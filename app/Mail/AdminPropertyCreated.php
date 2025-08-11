<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Property;

class AdminPropertyCreated extends Mailable
{
    use SerializesModels;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public Property $property
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouvelle propriété soumise - ' . $this->property->ville . ' (' . number_format($this->property->prix, 0, ',', ' ') . '€)',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.property-created',
            with: [
                'property' => $this->property,
                'owner' => $this->property->proprietaire,
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
