<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactPurchase;

class PropertyContactPurchased extends Mailable
{
    use SerializesModels;

    public $purchase;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactPurchase $purchase)
    {
        $this->purchase = $purchase;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Un agent s\'intéresse à votre propriété ! | Proprio Link',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.property-owner.contact-purchased',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        return [];
    }
}
