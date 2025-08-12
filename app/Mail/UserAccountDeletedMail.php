<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class UserAccountDeletedMail extends LocalizedMailable
{
    use SerializesModels;

    public $user;
    public $reason;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, string $reason = '')
    {
        $this->user = $user;
        $this->reason = $reason;
        
        try {
            $this->setUserLocale($user);
        } catch (\Exception $e) {
            $this->locale = config('app.locale', 'fr');
            \Log::warning('Failed to set user locale in UserAccountDeletedMail: ' . $e->getMessage());
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
            subject: 'Compte supprimé - Proprio Link',
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
        
        $view = $this->getLocalizedView('emails.user-account-deleted');
        
        return new Content(
            view: $view,
            with: [
                'user' => $this->user,
                'reason' => $this->reason,
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