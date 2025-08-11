<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class AdminPasswordResetRequest extends Mailable
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
        public User $user,
        public string $resetUrl
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Demande de réinitialisation de mot de passe - ' . $this->user->email,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.password-reset-request',
            with: [
                'user' => $this->user,
                'resetUrl' => $this->resetUrl,
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
