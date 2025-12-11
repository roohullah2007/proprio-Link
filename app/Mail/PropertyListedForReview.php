<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Property;

class PropertyListedForReview extends LocalizedMailable
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
        try {
            $this->setUserLocale($property->proprietaire);
        } catch (\Exception $e) {
            $this->locale = config('app.locale', 'fr');
            \Log::warning('Failed to set user locale in PropertyListedForReview: ' . $e->getMessage());
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        return new Envelope(
            subject: 'Propriété publiée avec succès - En cours de révision - Proprio Link',
            from: $this->getFromAddress()
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        $view = $this->getLocalizedView('emails.property-owner.property-listed');
        
        return new Content(
            view: $view,
            with: [
                'property' => $this->property,
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
