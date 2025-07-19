<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use App\Mail\PropertyApprovedMail;
use App\Mail\PropertyRejectedMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class ModerationController extends Controller
{
    /**
     * Display admin dashboard with moderation statistics
     */
    public function dashboard(): Response
    {
        $stats = [
            'properties_pending' => Property::where('statut', Property::STATUT_EN_ATTENTE)->count(),
            'properties_published' => Property::where('statut', Property::STATUT_PUBLIE)->count(),
            'properties_rejected' => Property::where('statut', Property::STATUT_REJETE)->count(),
            'total_users' => User::count(),
            'agents_unverified' => User::where('type_utilisateur', 'AGENT')
                                      ->where('est_verifie', false)
                                      ->count(),
            
            // New earnings statistics
            'total_earnings' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
                ->sum('montant_paye'),
            'earnings_this_month' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
                ->whereMonth('paiement_confirme_a', now()->month)
                ->whereYear('paiement_confirme_a', now()->year)
                ->sum('montant_paye'),
            'total_transactions' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)->count(),
            'transactions_this_month' => \App\Models\ContactPurchase::where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
                ->whereMonth('paiement_confirme_a', now()->month)
                ->whereYear('paiement_confirme_a', now()->year)
                ->count(),
        ];

        $recentProperties = Property::with(['proprietaire', 'images'])
            ->where('statut', Property::STATUT_EN_ATTENTE)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentProperties' => $recentProperties
        ]);
    }

    /**
     * Display properties pending moderation
     */
    public function pendingProperties(Request $request): Response
    {
        $query = Property::with(['proprietaire', 'images'])
            ->where('statut', Property::STATUT_EN_ATTENTE);

        // Search filters
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ville', 'like', "%{$search}%")
                  ->orWhere('adresse_complete', 'like', "%{$search}%")
                  ->orWhereHas('proprietaire', function($userQuery) use ($search) {
                      $userQuery->where('prenom', 'like', "%{$search}%")
                                ->orWhere('nom', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by property type
        if ($request->has('type') && $request->type) {
            $query->where('type_propriete', $request->type);
        }

        // Filter by price range
        if ($request->has('price_min') && $request->price_min) {
            $query->where('prix', '>=', $request->price_min);
        }
        if ($request->has('price_max') && $request->price_max) {
            $query->where('prix', '<=', $request->price_max);
        }

        $properties = $query->orderBy('created_at', 'asc')->paginate(12);

        return Inertia::render('Admin/PendingProperties', [
            'properties' => $properties,
            'filters' => $request->only(['search', 'type', 'price_min', 'price_max'])
        ]);
    }

    /**
     * Show property details for moderation
     */
    public function showProperty(Property $property): Response
    {
        $property->load(['proprietaire', 'images', 'editRequests.requestedBy']);

        return Inertia::render('Admin/PropertyReview', [
            'property' => $property,
            'editRequests' => $property->editRequests->sortByDesc('created_at')->values(),
        ]);
    }

    /**
     * Approve a property
     */
    public function approveProperty(Request $request, Property $property)
    {
        if ($property->statut !== Property::STATUT_EN_ATTENTE) {
            return redirect()->back()->with('error', __('Seules les propriétés en attente peuvent être approuvées.'));
        }

        $property->update([
            'statut' => Property::STATUT_PUBLIE,
            'raison_rejet' => null
        ]);

        // Send approval email to property owner
        try {
            Mail::to($property->proprietaire->email)
                ->send(new PropertyApprovedMail($property));
        } catch (\Exception $e) {
            // Log error but don't fail the approval
            \Log::error('Failed to send approval email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property approved', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'property_address' => $property->adresse_complete
        ]);

        // Redirect to pending properties list with success message
        return redirect()->route('admin.pending-properties')
            ->with('success', __('Propriété approuvée et email envoyé au propriétaire.'));
    }

    /**
     * Reject a property
     */
    public function rejectProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'raison_rejet' => 'required|string|max:1000',
        ]);

        if ($property->statut !== Property::STATUT_EN_ATTENTE) {
            return redirect()->back()->with('error', __('Seules les propriétés en attente peuvent être rejetées.'));
        }

        $property->update([
            'statut' => Property::STATUT_REJETE,
            'raison_rejet' => $validated['raison_rejet']
        ]);

        // Send rejection email to property owner
        try {
            Mail::to($property->proprietaire->email)
                ->send(new PropertyRejectedMail($property));
        } catch (\Exception $e) {
            // Log error but don't fail the rejection
            \Log::error('Failed to send rejection email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property rejected', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'rejection_reason' => $validated['raison_rejet'],
            'property_address' => $property->adresse_complete
        ]);

        // Redirect to pending properties list with success message
        return redirect()->route('admin.pending-properties')
            ->with('success', __('Propriété rejetée et email envoyé au propriétaire.'));
    }

    /**
     * Put property back to pending review
     */
    public function pendingProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'commentaire' => 'required|string|max:1000',
        ]);

        $property->update([
            'statut' => Property::STATUT_EN_ATTENTE,
            'raison_rejet' => $validated['commentaire']
        ]);

        // Note: Could send email asking for more information

        return back()->with('success', __('Propriété remise en attente avec commentaires.'));
    }

    /**
     * Mark property as sold
     */
    public function markAsSold(Property $property)
    {
        $property->update([
            'statut' => Property::STATUT_VENDU
        ]);

        return back()->with('success', __('Propriété marquée comme vendue.'));
    }

    /**
     * Bulk approve properties
     */
    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'property_ids' => 'required|array',
            'property_ids.*' => 'exists:properties,id'
        ]);

        $properties = Property::whereIn('id', $validated['property_ids'])
            ->where('statut', Property::STATUT_EN_ATTENTE)
            ->get();

        foreach ($properties as $property) {
            $property->update([
                'statut' => Property::STATUT_PUBLIE,
                'raison_rejet' => null
            ]);

            // Send approval email
            try {
                Mail::to($property->proprietaire->email)
                    ->send(new PropertyApprovedMail($property));
            } catch (\Exception $e) {
                \Log::error('Failed to send bulk approval email: ' . $e->getMessage());
            }
        }

        return back()->with('success', __('Propriétés approuvées: :count', ['count' => $properties->count()]));
    }

    /**
     * Display all properties (for admin overview)
     */
    public function allProperties(Request $request): Response
    {
        $query = Property::with(['proprietaire', 'images']);

        // Filter by status
        if ($request->has('status') && $request->status) {
            $query->where('statut', $request->status);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('ville', 'like', "%{$search}%")
                  ->orWhere('adresse_complete', 'like', "%{$search}%")
                  ->orWhereHas('proprietaire', function($userQuery) use ($search) {
                      $userQuery->where('prenom', 'like', "%{$search}%")
                                ->orWhere('nom', 'like', "%{$search}%");
                  });
            });
        }

        $properties = $query->orderBy('created_at', 'desc')->paginate(15);

        return Inertia::render('Admin/AllProperties', [
            'properties' => $properties,
            'filters' => $request->only(['status', 'search'])
        ]);
    }
}
