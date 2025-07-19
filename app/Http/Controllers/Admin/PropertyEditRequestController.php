<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyEditRequest;
use App\Mail\PropertyEditRequestMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PropertyEditRequestController extends Controller
{
    /**
     * Create a new edit request for a property
     */
    public function store(Request $request, Property $property)
    {
        $validated = $request->validate([
            'requested_changes' => 'required|string|max:2000',
            'admin_notes' => 'nullable|string|max:1000',
        ]);

        $editRequest = PropertyEditRequest::create([
            'property_id' => $property->id,
            'requested_by' => Auth::id(),
            'requested_changes' => $validated['requested_changes'],
            'admin_notes' => $validated['admin_notes'] ?? null,
            'status' => PropertyEditRequest::STATUS_PENDING,
        ]);

        // Send email to property owner
        try {
            Mail::to($property->proprietaire->email)
                ->send(new PropertyEditRequestMail($property, $editRequest));
        } catch (\Exception $e) {
            \Log::error('Failed to send edit request email: ' . $e->getMessage());
        }

        return back()->with('success', __('Edit request sent to property owner successfully.'));
    }

    /**
     * Show edit requests for a property
     */
    public function show(Property $property)
    {
        $editRequests = $property->editRequests()
            ->with('requestedBy')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'editRequests' => $editRequests
        ]);
    }

    /**
     * Update edit request status
     */
    public function update(Request $request, PropertyEditRequest $editRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:ACKNOWLEDGED,COMPLETED,CANCELLED',
        ]);

        switch ($validated['status']) {
            case PropertyEditRequest::STATUS_ACKNOWLEDGED:
                $editRequest->markAsAcknowledged();
                break;
            case PropertyEditRequest::STATUS_COMPLETED:
                $editRequest->markAsCompleted();
                break;
            case PropertyEditRequest::STATUS_CANCELLED:
                $editRequest->cancel();
                break;
        }

        return back()->with('success', __('Edit request status updated successfully.'));
    }

    /**
     * Cancel an edit request
     */
    public function destroy(PropertyEditRequest $editRequest)
    {
        $editRequest->cancel();

        return back()->with('success', __('Edit request cancelled successfully.'));
    }
}
