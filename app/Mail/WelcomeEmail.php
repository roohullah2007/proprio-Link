<?php

namespace App\Mail;

use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class WelcomeEmail extends LocalizedMailable
{
    use SerializesModels;

    public $user;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user)
    {
        $this->user = $user;
        
        // Set locale based on user's language preference
        // Handle the case where user might not have language set yet
        try {
            $this->setUserLocale($user);
        } catch (\Exception $e) {
            // Fallback to default locale if user locale setting fails
            $this->locale = config('app.locale', 'fr');
            \Log::warning('Failed to set user locale in WelcomeEmail: ' . $e->getMessage());
        }
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Ensure we have a locale set
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        return new Envelope(
            subject: 'Bienvenue sur Proprio Link ! - Votre compte a été créé',
            from: $this->getFromAddress()
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        // Ensure we have a locale set before getting view
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        $view = $this->getLocalizedView('emails.welcome');
        
        return new Content(
            view: $view,
            with: [
                'user' => $this->user,
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
