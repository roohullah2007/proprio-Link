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

class PropertiesController extends Controller
{
    /**
     * Display all properties with combined moderation interface
     */
    public function index(Request $request): Response
    {
        $query = Property::with(['proprietaire', 'images']);

        // Filter by status (default to all)
        $status = $request->get('status', 'all');
        if ($status !== 'all') {
            $query->where('statut', $status);
        }

        // Search functionality
        if ($request->filled('search')) {
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
        if ($request->filled('type')) {
            $query->where('type_propriete', $request->type);
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->where('prix', '>=', $request->price_min);
        }
        if ($request->filled('price_max')) {
            $query->where('prix', '<=', $request->price_max);
        }

        // Sort pending properties first, then by creation date
        $query->orderByRaw("CASE WHEN statut = 'EN_ATTENTE' THEN 0 ELSE 1 END")
              ->orderBy('created_at', 'desc');

        $properties = $query->paginate(15)->withQueryString();

        // Get statistics for the header
        $stats = [
            'all' => Property::count(),
            'pending' => Property::where('statut', Property::STATUT_EN_ATTENTE)->count(),
            'published' => Property::where('statut', Property::STATUT_PUBLIE)->count(),
            'rejected' => Property::where('statut', Property::STATUT_REJETE)->count(),
            'sold' => Property::where('statut', Property::STATUT_VENDU)->count(),
        ];

        return Inertia::render('Admin/Properties', [
            'properties' => $properties,
            'stats' => $stats,
            'filters' => $request->only(['search', 'type', 'price_min', 'price_max', 'status'])
        ]);
    }

    /**
     * Show property details for review/editing
     */
    public function show(Property $property): Response
    {
        $property->load(['proprietaire', 'images']);

        return Inertia::render('Admin/PropertyReview', [
            'property' => $property
        ]);
    }

    /**
     * Approve a property
     */
    public function approve(Request $request, Property $property)
    {
        if ($property->statut !== Property::STATUT_EN_ATTENTE) {
            return redirect()->back()->with('error', __('Only pending properties can be approved.'));
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
            \Log::error('Failed to send approval email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property approved', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'property_address' => $property->adresse_complete
        ]);

        return redirect()->back()->with('success', __('Property approved and email sent to owner.'));
    }

    /**
     * Reject a property
     */
    public function reject(Request $request, Property $property)
    {
        $validated = $request->validate([
            'raison_rejet' => 'required|string|max:1000',
        ]);

        if ($property->statut !== Property::STATUT_EN_ATTENTE) {
            return redirect()->back()->with('error', __('Only pending properties can be rejected.'));
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
            \Log::error('Failed to send rejection email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property rejected', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'rejection_reason' => $validated['raison_rejet'],
            'property_address' => $property->adresse_complete
        ]);

        return redirect()->back()->with('success', __('Property rejected and email sent to owner.'));
    }

    /**
     * Change property status
     */
    public function updateStatus(Request $request, Property $property)
    {
        $validated = $request->validate([
            'status' => 'required|in:EN_ATTENTE,PUBLIE,REJETE,VENDU',
            'raison_rejet' => 'nullable|string|max:1000'
        ]);

        $property->update([
            'statut' => $validated['status'],
            'raison_rejet' => $validated['raison_rejet'] ?? null
        ]);

        $statusMessages = [
            'EN_ATTENTE' => 'Property status changed to pending review',
            'PUBLIE' => 'Property published successfully',
            'REJETE' => 'Property rejected',
            'VENDU' => 'Property marked as sold'
        ];

        return redirect()->back()->with('success', __($statusMessages[$validated['status']]));
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

        return redirect()->back()->with('success', __('Properties approved: :count', ['count' => $properties->count()]));
    }

    /**
     * Bulk reject properties
     */
    public function bulkReject(Request $request)
    {
        $validated = $request->validate([
            'property_ids' => 'required|array',
            'property_ids.*' => 'exists:properties,id',
            'raison_rejet' => 'required|string|max:1000'
        ]);

        $properties = Property::whereIn('id', $validated['property_ids'])
            ->where('statut', Property::STATUT_EN_ATTENTE)
            ->get();

        foreach ($properties as $property) {
            $property->update([
                'statut' => Property::STATUT_REJETE,
                'raison_rejet' => $validated['raison_rejet']
            ]);

            // Send rejection email
            try {
                Mail::to($property->proprietaire->email)
                    ->send(new PropertyRejectedMail($property));
            } catch (\Exception $e) {
                \Log::error('Failed to send bulk rejection email: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', __('Properties rejected: :count', ['count' => $properties->count()]));
    }

    /**
     * Update property details (admin editing)
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'type_propriete' => 'required|in:APPARTEMENT,MAISON,TERRAIN,COMMERCIAL,BUREAU,AUTRES',
            'prix' => 'required|numeric|min:1',
            'superficie_m2' => 'required|integer|min:1',
            'ville' => 'required|string|max:255',
            'pays' => 'required|string|max:255',
            'adresse_complete' => 'required|string|max:500',
            'contacts_souhaites' => 'required|integer|min:1|max:100',
        ]);

        $property->update($validated);

        return redirect()->back()->with('success', __('Property updated successfully'));
    }

    /**
     * Delete a property
     */
    public function destroy(Property $property)
    {
        // Delete associated images from storage
        foreach ($property->images as $image) {
            \Storage::disk('public')->delete($image->chemin_fichier);
        }

        $property->delete();

        return redirect()->route('admin.properties')->with('success', __('Property deleted successfully'));
    }
}
