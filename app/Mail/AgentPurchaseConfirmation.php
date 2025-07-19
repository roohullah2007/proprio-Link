<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\ContactPurchase;

class AgentPurchaseConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public $purchase;
    public $contactData;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactPurchase $purchase, array $contactData = [])
    {
        $this->purchase = $purchase;
        $this->contactData = $contactData;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Purchase Confirmation - Property Contact Details | Propio',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.agent.purchase-confirmation',
        );
    }

    /**
     * Get the attachments for the message.
     */
    public function attachments(): array
    {
        $attachments = [];
        
        // Attach invoice PDF if available
        if ($this->purchase->invoice && $this->purchase->invoice->pdf_path) {
            $attachments[] = \Illuminate\Mail\Mailables\Attachment::fromStorageDisk('local', $this->purchase->invoice->pdf_path)
                ->as('Invoice-' . $this->purchase->invoice->invoice_number . '.pdf')
                ->withMime('application/pdf');
        }
        
        return $attachments;
    }
}
