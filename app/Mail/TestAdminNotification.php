<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;
use App\Models\EmailSetting;

class TestAdminNotification extends Mailable
{
    use SerializesModels;

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Test de notification administrateur - Proprio Link',
            from: new Address(
                EmailSetting::get('mail_from_address', 'noreply@proprio-link.fr'),
                EmailSetting::get('mail_from_name', 'Proprio Link')
            )
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.test-notification',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
