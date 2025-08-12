<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\PropertyEditRequest;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Collection;

class AdminPropertyResubmitted extends Mailable
{
    use SerializesModels;

    public Property $property;
    public Collection $editRequests;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property, Collection $editRequests)
    {
        $this->property = $property;
        $this->editRequests = $editRequests;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Propriété mise à jour après demande de modification - ' . $this->property->ville . ' (' . number_format($this->property->prix, 0, ',', ' ') . '€)',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.property-resubmitted',
            with: [
                'property' => $this->property,
                'editRequests' => $this->editRequests,
                'owner' => $this->property->proprietaire,
                'adminPropertyUrl' => route('admin.property-review', $this->property->id),
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}