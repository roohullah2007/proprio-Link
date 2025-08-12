<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Property;

class PropertyApprovedMail extends LocalizedMailable
{
    use SerializesModels;

    public $property;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property)
    {
        $this->property = $property;
        
        // Ensure property owner is loaded
        if (!$property->relationLoaded('proprietaire')) {
            $property->load('proprietaire');
        }
        
        // Set locale based on property owner's language preference
        $this->setUserLocale($property->proprietaire);
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->getLocalizedSubject('Excellente nouvelle ! Votre propriété a été approuvée - Proprio Link'),
            from: $this->getFromAddress()
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: $this->getLocalizedView('emails.property-approved'),
            with: [
                'property' => $this->property,
                'ownerName' => $this->property->proprietaire->prenom,
                'locale' => $this->locale,
            ]
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
