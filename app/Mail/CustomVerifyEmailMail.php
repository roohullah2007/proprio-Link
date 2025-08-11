<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;
use App\Models\EmailSetting;

class CustomVerifyEmailMail extends Mailable
{
    use SerializesModels;

    public $user;
    public $verificationUrl;
    public $locale;
    
    /**
     * The number of times the job may be attempted.
     * Set to null to prevent queueing even if globally enabled
     */
    public $tries = null;

    /**
     * Create a new message instance.
     */
    public function __construct($user, $verificationUrl, $locale = 'fr')
    {
        $this->user = $user;
        $this->verificationUrl = $verificationUrl;
        $this->locale = $locale;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        // Set subject based on locale
        $subject = 'Vérifiez votre adresse email - Proprio Link';
            
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
        return new Content(
            view: 'emails.auth.verify-email-blue',
            with: [
                'user' => $this->user,
                'verificationUrl' => $this->verificationUrl,
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
