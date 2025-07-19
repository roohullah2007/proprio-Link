<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyEditRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyEditRequestController extends Controller
{
    /**
     * Show edit requests for a property (for property owners)
     */
    public function index(Property $property)
    {
        // Ensure the authenticated user owns this property
        if ($property->proprietaire_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this property.');
        }

        $editRequests = $property->editRequests()
            ->with('requestedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Properties/EditRequests', [
            'property' => $property->load('images'),
            'editRequests' => $editRequests
        ]);
    }

    /**
     * Acknowledge an edit request (for property owners)
     */
    public function acknowledge(Request $request, PropertyEditRequest $editRequest)
    {
        // Ensure the authenticated user owns the property
        if ($editRequest->property->proprietaire_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this edit request.');
        }

        if ($editRequest->status !== PropertyEditRequest::STATUS_PENDING) {
            return back()->with('error', __('This edit request has already been processed.'));
        }

        $editRequest->markAsAcknowledged();

        return back()->with('success', __('Edit request acknowledged. Please make the requested changes.'));
    }

    /**
     * Mark an edit request as completed (for property owners)
     */
    public function complete(Request $request, PropertyEditRequest $editRequest)
    {
        // Ensure the authenticated user owns the property
        if ($editRequest->property->proprietaire_id !== Auth::id()) {
            abort(403, 'Unauthorized access to this edit request.');
        }

        if (!in_array($editRequest->status, [PropertyEditRequest::STATUS_PENDING, PropertyEditRequest::STATUS_ACKNOWLEDGED])) {
            return back()->with('error', __('This edit request cannot be completed.'));
        }

        $editRequest->markAsCompleted();

        return back()->with('success', __('Edit request marked as completed. Thank you for making the changes!'));
    }
}
