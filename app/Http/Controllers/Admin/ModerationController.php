<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\User;
use App\Models\ContactPurchase;
use App\Models\Invoice;
use App\Models\PropertyImage;
use App\Models\PropertyEditRequest;
use App\Mail\PropertyApprovedMail;
use App\Mail\PropertyRejectedMail;
use App\Mail\PropertyDeletedMail;
use App\Mail\PropertyUnapprovedMail;
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
        // Debug: Test direct queries first
        $debugPending = Property::where('statut', 'EN_ATTENTE')->count();
        $debugEarnings = ContactPurchase::where('statut_paiement', 'succeeded')->sum('montant_paye');
        
        \Log::info('DEBUG - Direct queries:', [
            'pending_direct' => $debugPending,
            'earnings_direct' => $debugEarnings,
            'STATUT_EN_ATTENTE' => Property::STATUT_EN_ATTENTE,
            'STATUS_SUCCEEDED' => ContactPurchase::STATUS_SUCCEEDED,
        ]);
        
        $stats = [
            'properties_pending' => Property::where('statut', 'EN_ATTENTE')->count(),
            'properties_published' => Property::where('statut', 'PUBLIE')->count(),
            'properties_rejected' => Property::where('statut', 'REJETE')->count(),
            'total_users' => User::count(),
            'agents_unverified' => User::where('type_utilisateur', 'AGENT')
                                      ->where('est_verifie', false)
                                      ->count(),
            
            // New earnings statistics - using direct string values
            'total_earnings' => ContactPurchase::where('statut_paiement', 'succeeded')
                ->sum('montant_paye'),
            'earnings_this_month' => ContactPurchase::where('statut_paiement', 'succeeded')
                ->whereMonth('paiement_confirme_a', now()->month)
                ->whereYear('paiement_confirme_a', now()->year)
                ->sum('montant_paye'),
            'total_transactions' => ContactPurchase::where('statut_paiement', 'succeeded')->count(),
            'transactions_this_month' => ContactPurchase::where('statut_paiement', 'succeeded')
                ->whereMonth('paiement_confirme_a', now()->month)
                ->whereYear('paiement_confirme_a', now()->year)
                ->count(),
        ];
        
        // Debug logging
        \Log::info('Admin Dashboard Stats:', $stats);

        $recentProperties = Property::with(['proprietaire', 'images' => function($query) {
                $query->orderBy('ordre_affichage', 'asc');
            }])
            ->where('statut', 'EN_ATTENTE')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($property) {
                // Ensure images have proper URLs
                if ($property->images) {
                    $property->images = $property->images->map(function ($image) {
                        $image->url = asset('storage/' . $image->chemin_fichier);
                        $image->chemin_image = asset('storage/' . $image->chemin_fichier);
                        return $image;
                    });
                }
                return $property;
            });

        $response = [
            'stats' => $stats,
            'recentProperties' => $recentProperties,
            'debug' => [
                'stats_count' => count($stats),
                'properties_pending_value' => $stats['properties_pending'],
                'total_earnings_value' => $stats['total_earnings'],
                'recent_properties_count' => $recentProperties->count(),
            ]
        ];
        
        \Log::info('Admin Dashboard - Final response:', $response);
        
        return Inertia::render('Admin/Dashboard', $response);
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

        // Send admin notification about approval
        try {
            \App\Services\AdminNotificationService::notifyAdmins(
                new \App\Mail\AdminPropertyApproved($property->load('proprietaire'))
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send admin notification for property approval: ' . $e->getMessage());
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

    /**
     * Delete a property permanently
     */
    public function deleteProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'deletion_reason' => 'nullable|string|max:1000',
        ]);

        $deletionReason = $validated['deletion_reason'] ?? null;

        // Store property data before deletion
        $propertyData = $property->load('proprietaire');
        $ownerEmail = $property->proprietaire->email;

        // Send deletion email to property owner before deleting
        try {
            Mail::to($ownerEmail)->send(new PropertyDeletedMail($propertyData, $deletionReason));
        } catch (\Exception $e) {
            \Log::error('Failed to send property deletion email: ' . $e->getMessage());
            return redirect()->back()->with('error', __('Failed to send notification email. Property not deleted.'));
        }

        // Log the deletion action
        \Log::info('Property deleted by admin', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'property_address' => $property->adresse_complete,
            'deletion_reason' => $deletionReason
        ]);

        // Handle cascade deletion manually due to foreign key constraints
        try {
            // First, get all contact purchases for this property
            $contactPurchases = ContactPurchase::where('property_id', $property->id)->get();
            
            // Delete related invoices first (invoices → contact_purchases)
            foreach ($contactPurchases as $purchase) {
                Invoice::where('contact_purchase_id', $purchase->id)->delete();
            }
            
            // Delete contact purchases (contact_purchases → property)
            ContactPurchase::where('property_id', $property->id)->delete();
            
            // Delete property images (property_images → property)
            PropertyImage::where('property_id', $property->id)->delete();
            
            // Delete property edit requests (property_edit_requests → property)
            PropertyEditRequest::where('property_id', $property->id)->delete();
            
            // Finally delete the property
            $property->delete();
            
        } catch (\Exception $e) {
            \Log::error('Failed to delete property with related records: ' . $e->getMessage());
            return redirect()->back()->with('error', __('Failed to delete property due to database constraints. Please contact support.'));
        }

        return redirect()->back()->with('success', __('Property deleted and owner notified via email.'));
    }

    /**
     * Unapprove a published property
     */
    public function unapproveProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'unapproval_reason' => 'required|string|max:1000',
        ]);

        // Only allow unapproving published properties
        if ($property->statut !== Property::STATUT_PUBLIE) {
            return redirect()->back()->with('error', __('Only published properties can be unapproved.'));
        }

        $property->update([
            'statut' => Property::STATUT_REJETE,
            'raison_rejet' => $validated['unapproval_reason']
        ]);

        // Send unapproval email to property owner
        try {
            Mail::to($property->proprietaire->email)
                ->send(new PropertyUnapprovedMail($property, $validated['unapproval_reason']));
        } catch (\Exception $e) {
            // Log error but don't fail the unapproval
            \Log::error('Failed to send unapproval email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property unapproved', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'unapproval_reason' => $validated['unapproval_reason'],
            'property_address' => $property->adresse_complete
        ]);

        return redirect()->back()->with('success', __('Property unapproved and owner notified via email.'));
    }

    /**
     * Disapprove a property (works for both pending and published)
     */
    public function disapproveProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'raison_rejet' => 'required|string|max:1000',
        ]);

        // Allow disapproving both pending and published properties
        if (!in_array($property->statut, [Property::STATUT_EN_ATTENTE, Property::STATUT_PUBLIE])) {
            return redirect()->back()->with('error', __('Only pending or published properties can be disapproved.'));
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
            // Log error but don't fail the disapproval
            \Log::error('Failed to send disapproval email: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property disapproved', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'disapproval_reason' => $validated['raison_rejet'],
            'property_address' => $property->adresse_complete,
            'previous_status' => $property->getOriginal('statut')
        ]);

        return redirect()->back()->with('success', __('Property disapproved and owner notified via email.'));
    }

    /**
     * Re-approve a rejected property
     */
    public function reapproveProperty(Request $request, Property $property)
    {
        // Only allow re-approving rejected properties
        if ($property->statut !== Property::STATUT_REJETE) {
            return redirect()->back()->with('error', __('Only rejected properties can be re-approved.'));
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
            \Log::error('Failed to send re-approval email: ' . $e->getMessage());
        }

        // Send admin notification about approval
        try {
            \App\Services\AdminNotificationService::notifyAdmins(
                new \App\Mail\AdminPropertyApproved($property->load('proprietaire'))
            );
        } catch (\Exception $e) {
            \Log::error('Failed to send admin notification for property re-approval: ' . $e->getMessage());
        }

        // Log moderation action
        \Log::info('Property re-approved', [
            'property_id' => $property->id,
            'moderator_id' => auth()->id(),
            'property_address' => $property->adresse_complete
        ]);

        return redirect()->back()->with('success', __('Property re-approved and owner notified via email.'));
    }
}
