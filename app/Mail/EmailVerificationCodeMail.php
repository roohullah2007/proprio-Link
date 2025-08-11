<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;
use App\Models\EmailSetting;

class EmailVerificationCodeMail extends Mailable
{
    use SerializesModels;

    public $verificationCode;
    
    /**
     * The number of times the job may be attempted.
     * Set to null to prevent queueing even if globally enabled
     */
    public $tries = null;

    public function __construct($verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Code de vérification - Proprio Link',
            from: new Address(
                EmailSetting::get('mail_from_address', 'noreply@proprio-link.fr'),
                EmailSetting::get('mail_from_name', 'Proprio Link')
            )
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.auth.verification-code-blue',
            with: [
                'code' => $this->verificationCode,
            ]
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
