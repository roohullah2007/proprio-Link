<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;
use App\Models\EmailSetting;

class UserActivatedMail extends Mailable
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
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = 'Votre compte a été réactivé - Proprio Link';
            
        return new Envelope(
            subject: $subject,
            from: new Address(
                EmailSetting::get('mail_from_address', 'noreply@proprio-link.fr'),
                EmailSetting::get('mail_from_name', 'Proprio Link')
            )
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $viewName = $this->user->language === 'en' 
            ? 'emails.user-activated-en' 
            : 'emails.user-activated';
            
        return new Content(
            view: $viewName,
            with: [
                'user' => $this->user,
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