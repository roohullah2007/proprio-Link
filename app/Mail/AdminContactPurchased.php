<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactPurchase;
use App\Models\EmailSetting;

class AdminContactPurchased extends Mailable
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
        public ContactPurchase $purchase
    ) {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Nouveau contact acheté - ' . number_format($this->purchase->montant_paye, 2) . '€',
            from: new Address(
                EmailSetting::get('mail_from_address', config('mail.from.address', 'noreply@proprio-link.fr')),
                EmailSetting::get('mail_from_name', config('mail.from.name', 'Proprio Link'))
            )
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.admin.contact-purchased',
            with: [
                'purchase' => $this->purchase,
                'agent' => $this->purchase->agent,
                'property' => $this->purchase->property,
                'owner' => $this->purchase->property->proprietaire,
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
