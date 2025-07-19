<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class PropertySubmittedMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public $property;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property)
    {
        $this->property = $property;
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject(__('Votre propriété a été soumise avec succès'))
                    ->view('emails.property-submitted')
                    ->with([
                        'property' => $this->property,
                        'ownerName' => $this->property->proprietaire->prenom,
                    ]);
    }
}
