<?php

namespace App\Mail;

use App\Models\ContactPurchase;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentSuccessEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $purchase;
    public $locale;
    public $isForAdmin;

    /**
     * Create a new message instance.
     */
    public function __construct(ContactPurchase $purchase, $locale = 'fr', $isForAdmin = false)
    {
        $this->purchase = $purchase;
        $this->locale = $locale;
        $this->isForAdmin = $isForAdmin;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        if ($this->isForAdmin) {
            $subject = $this->locale === 'en' 
                ? 'Payment Successful - Contact Purchase #' . $this->purchase->id
                : 'Paiement réussi - Achat de contact #' . $this->purchase->id;
        } else {
            $subject = $this->locale === 'en' 
                ? 'Payment Confirmed - Contact Information Available'
                : 'Paiement confirmé - Informations de contact disponibles';
        }

        $view = $this->isForAdmin ? 'emails.admin.payment-success' : 'emails.agent.payment-success';

        return $this->subject($subject)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->view($view)
                    ->with([
                        'purchase' => $this->purchase,
                        'locale' => $this->locale,
                        'isForAdmin' => $this->isForAdmin,
                        'contactDetailsUrl' => route('payment.contact-details', $this->purchase->id),
                        'purchaseHistoryUrl' => route('payment.purchases'),
                        'adminDashboardUrl' => route('admin.dashboard'),
                        'invoiceUrl' => $this->purchase->invoice ? route('invoices.download', $this->purchase->invoice->id) : null,
                    ]);
    }
}
