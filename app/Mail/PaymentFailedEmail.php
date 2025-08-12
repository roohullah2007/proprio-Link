<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PaymentFailedEmail extends Mailable
{
    use Queueable, SerializesModels;

    public $purchase;
    public $locale;
    public $isForAdmin;
    public $errorMessage;

    /**
     * Create a new message instance.
     */
    public function __construct($purchase, $locale = 'fr', $isForAdmin = false, $errorMessage = null)
    {
        $this->purchase = $purchase;
        $this->locale = $locale;
        $this->isForAdmin = $isForAdmin;
        $this->errorMessage = $errorMessage;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        if ($this->isForAdmin) {
            $subject = $this->locale === 'en' 
                ? 'Payment Failed - Contact Purchase Attempt'
                : 'Paiement échoué - Tentative d\'achat de contact';
        } else {
            $subject = $this->locale === 'en' 
                ? 'Payment Failed - Please Try Again'
                : 'Paiement échoué - Veuillez réessayer';
        }

        $view = $this->isForAdmin ? 'emails.admin.payment-failed' : 'emails.agent.payment-failed';

        return $this->subject($subject)
                    ->from(config('mail.from.address'), config('mail.from.name'))
                    ->view($view)
                    ->with([
                        'purchase' => $this->purchase,
                        'locale' => $this->locale,
                        'isForAdmin' => $this->isForAdmin,
                        'errorMessage' => $this->errorMessage,
                        'contactDetailsUrl' => '#',
                        'purchaseHistoryUrl' => route('payment.purchases'),
                        'adminDashboardUrl' => route('admin.dashboard'),
                    ]);
    }
}
