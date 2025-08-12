<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\ContactPurchase;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AgentController extends Controller
{
    public function __construct()
    {
        // Middleware is handled by routes in Laravel 12
    }

    /**
     * Show agent dashboard with property search
     */
    public function dashboard()
    {
        try {
            // Get available properties for the agent
            $agentId = Auth::id();
            $properties = Property::where('statut', 'PUBLIE')
                ->where('proprietaire_id', '!=', $agentId)
                ->whereDoesntHave('contactPurchases', function ($query) use ($agentId) {
                    $query->where('agent_id', $agentId)
                          ->where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED);
                })
                ->get();
            
            // Apply address masking to dashboard properties
            $properties->transform(function ($property) use ($agentId) {
                $addressInfo = $property->getAddressDisplayInfo($agentId);
                $property->display_address = $addressInfo['display_address'];
                $property->full_address_available = $addressInfo['full_address_available'];
                $property->is_purchased = $addressInfo['full_address_available'];
                
                // Mask address for display
                if (!$property->is_purchased) {
                    $property->adresse_complete = $property->getMaskedAddress();
                }
                
                return $property;
            });

            // Get purchase history for recent activity
            $purchaseHistory = ContactPurchase::with(['property'])
                ->where('agent_id', Auth::id())
                ->orderBy('created_at', 'desc')
                ->limit(10)
                ->get();
            
            // Apply address masking to purchase history properties
            $purchaseHistory->each(function ($purchase) use ($agentId) {
                if ($purchase->property) {
                    $addressInfo = $purchase->property->getAddressDisplayInfo($agentId);
                    $purchase->property->display_address = $addressInfo['display_address'];
                    $purchase->property->full_address_available = $addressInfo['full_address_available'];
                    $purchase->property->is_purchased = true; // Always true for purchase history
                }
            });

            // Calculate stats
            $totalSpent = ContactPurchase::where('agent_id', Auth::id())
                ->sum('montant_paye') ?? 0;
            
            $totalPurchases = ContactPurchase::where('agent_id', Auth::id())->count();
            
            $purchasesThisMonth = ContactPurchase::where('agent_id', Auth::id())
                ->whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->count();

            // Calculate meaningful statistics for agent dashboard
            $totalAvailableProperties = Property::where('statut', 'PUBLIE')
                ->where('proprietaire_id', '!=', $agentId)
                ->count();

            // Agent's specific performance metrics
            $agentPerformanceMetrics = [
                'properties_viewed' => $totalAvailableProperties,
                'conversion_efficiency' => $totalPurchases > 0 ? round(($purchasesThisMonth / max($totalPurchases, 1)) * 100, 1) : 0,
                'average_monthly_spending' => $totalPurchases > 0 ? round($totalSpent / max($totalPurchases, 1), 2) : 0,
                'active_properties_in_area' => Property::where('statut', 'PUBLIE')
                    ->where('proprietaire_id', '!=', $agentId)
                    ->distinct('ville')
                    ->count('ville'),
            ];

            $stats = [
                'total_properties' => $totalAvailableProperties,
                'purchases_this_month' => $purchasesThisMonth,
                'total_purchases' => $totalPurchases,
                'total_spent' => $totalSpent,
                'available_properties' => $properties->count(),
                'agent_metrics' => $agentPerformanceMetrics,
            ];

            return Inertia::render('Agent/Dashboard', [
                'properties' => $properties,
                'purchaseHistory' => $purchaseHistory,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            \Log::error('Agent dashboard error: ' . $e->getMessage());
            
            // Fallback stats in case of error
            $fallbackStats = [
                'total_properties' => 0,
                'purchases_this_month' => 0,
                'total_purchases' => 0,
                'total_spent' => 0,
                'available_properties' => 0,
                'agent_metrics' => [
                    'properties_viewed' => 0,
                    'conversion_efficiency' => 0,
                    'average_monthly_spending' => 0,
                    'active_properties_in_area' => 0,
                ],
            ];

            return Inertia::render('Agent/Dashboard', [
                'properties' => [],
                'purchaseHistory' => [],
                'stats' => $fallbackStats,
            ]);
        }
    }

    /**
     * Show property search and listing for agents
     */
    public function properties(Request $request)
    {
        $agentId = Auth::id();
        $query = Property::with(['images', 'proprietaire'])
            ->where('statut', 'PUBLIE')
            ->where('proprietaire_id', '!=', $agentId);

        // Apply filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('adresse_complete', 'like', "%{$search}%")
                  ->orWhere('ville', 'like', "%{$search}%")
                  ->orWhere('pays', 'like', "%{$search}%");
            });
        }

        if ($request->filled('type_propriete')) {
            $query->where('type_propriete', $request->type_propriete);
        }

        if ($request->filled('prix_min')) {
            $query->where('prix', '>=', $request->prix_min);
        }

        if ($request->filled('prix_max')) {
            $query->where('prix', '<=', $request->prix_max);
        }

        if ($request->filled('superficie_min')) {
            $query->where('superficie_m2', '>=', $request->superficie_min);
        }

        if ($request->filled('superficie_max')) {
            $query->where('superficie_m2', '<=', $request->superficie_max);
        }

        if ($request->filled('ville')) {
            $query->where('ville', 'like', "%{$request->ville}%");
        }

        if ($request->filled('pays')) {
            $query->where('pays', $request->pays);
        }

        // Sort options
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $validSorts = ['created_at', 'prix', 'superficie_m2', 'ville'];
        if (in_array($sortBy, $validSorts)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        $properties = $query->paginate(12)->withQueryString();

        // Add purchased status and address masking for each property
        $agentId = Auth::id();
        $purchasedPropertyIds = ContactPurchase::where('agent_id', $agentId)
            ->where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)
            ->pluck('property_id')
            ->toArray();

        $properties->getCollection()->transform(function ($property) use ($purchasedPropertyIds, $agentId) {
            $property->is_purchased = in_array($property->id, $purchasedPropertyIds);
            
            // Add address display information
            $addressInfo = $property->getAddressDisplayInfo($agentId);
            $property->display_address = $addressInfo['display_address'];
            $property->full_address_available = $addressInfo['full_address_available'];
            
            // Replace the original address field with masked version for frontend
            if (!$property->is_purchased) {
                $property->adresse_complete = $property->getMaskedAddress();
            }
            
            return $property;
        });

        return Inertia::render('Agent/Properties', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'type_propriete', 'prix_min', 'prix_max', 'superficie_min', 'superficie_max', 'ville', 'pays', 'sort_by', 'sort_order']),
            'propertyTypes' => [
                'MAISON' => __('Maison'),
                'APPARTEMENT' => __('Appartement'),
                'TERRAIN' => __('Terrain'),
                'COMMERCIAL' => __('Commercial'),
                'AUTRES' => __('Autres'),
            ],
        ]);
    }

    /**
     * Show detailed view of a property for agents
     */
    public function showProperty(Property $property)
    {
        // Check if property is available
        if ($property->statut !== 'PUBLIE') {
            return redirect()->route('agent.properties')->with('error', __('Cette propriété n\'est pas disponible.'));
        }

        $agentId = Auth::id();
        
        // Increment view count for property (agents viewing properties)
        $property->increment('views');
        
        // Check if agent already purchased this contact
        $hasPurchased = ContactPurchase::where('agent_id', $agentId)
            ->where('property_id', $property->id)
            ->where('statut_paiement', ContactPurchase::STATUS_SUCCEEDED)
            ->exists();

        $property->load(['images', 'proprietaire']);
        $property->is_purchased = $hasPurchased;
        
        // Add address display information
        $addressInfo = $property->getAddressDisplayInfo($agentId);
        $property->display_address = $addressInfo['display_address'];
        $property->full_address_available = $addressInfo['full_address_available'];
        
        // Mask the address if not purchased
        if (!$hasPurchased) {
            $property->adresse_complete = $property->getMaskedAddress();
        }

        return Inertia::render('Agent/PropertyDetails', [
            'property' => $property,
            'contactPrice' => config('services.stripe.contact_price'),
            'currency' => config('services.stripe.currency'),
        ]);
    }

    /**
     * Show agent's purchase history
     */
    public function purchases()
    {
        $purchases = ContactPurchase::with(['property.images', 'property.proprietaire'])
            ->where('agent_id', Auth::id())
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Agent/Purchases', [
            'purchases' => $purchases,
        ]);
    }

    /**
     * Show contact details for a purchased property
     */
    public function contactDetails(ContactPurchase $purchase)
    {
        // Verify the purchase belongs to the authenticated agent
        if ($purchase->agent_id !== Auth::id()) {
            return redirect()->route('agent.purchases')->with('error', __('Accès non autorisé.'));
        }

        $purchase->load(['property.images', 'property.proprietaire']);

        return Inertia::render('Agent/ContactDetails', [
            'purchase' => $purchase,
            'property' => $purchase->property,
            'owner' => $purchase->property->proprietaire,
        ]);
    }

    /**
     * Get property search suggestions (AJAX endpoint)
     */
    public function searchSuggestions(Request $request)
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $suggestions = Property::where('statut', 'PUBLIE')
            ->where('proprietaire_id', '!=', Auth::id())
            ->where(function ($q) use ($query) {
                $q->where('ville', 'like', "%{$query}%")
                  ->orWhere('pays', 'like', "%{$query}%")
                  ->orWhere('adresse_complete', 'like', "%{$query}%");
            })
            ->select(['ville', 'pays', 'adresse_complete'])
            ->distinct()
            ->limit(10)
            ->get()
            ->map(function ($property) {
                return [
                    'ville' => $property->ville,
                    'pays' => $property->pays,
                    'adresse' => $property->adresse_complete,
                ];
            });

        return response()->json($suggestions);
    }
}
