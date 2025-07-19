<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\PropertyEditRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class PropertyEditRequestMail extends Mailable
{
    use Queueable, SerializesModels;

    public Property $property;
    public PropertyEditRequest $editRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property, PropertyEditRequest $editRequest)
    {
        $this->property = $property;
        $this->editRequest = $editRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('Edit Request for Your Property - :address', [
                'address' => $this->property->adresse_complete
            ]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.property-edit-request',
            with: [
                'property' => $this->property,
                'editRequest' => $this->editRequest,
                'propertyUrl' => route('properties.show', $this->property->id),
            ],
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
