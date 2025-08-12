<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Queue\SerializesModels;

class PropertyUnapprovedMail extends LocalizedMailable
{
    use SerializesModels;

    public $property;
    public $unapprovalReason;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property, $unapprovalReason = null)
    {
        $this->property = $property;
        $this->unapprovalReason = $unapprovalReason;
        
        // Set locale based on property owner's language preference
        $this->setUserLocale($property->proprietaire);
    }

    /**
     * Build the message.
     */
    public function build()
    {
        return $this->subject($this->getLocalizedSubject('Your property listing has been unapproved'))
                    ->view($this->getLocalizedView('emails.property-unapproved'))
                    ->with([
                        'property' => $this->property,
                        'ownerName' => $this->property->proprietaire->prenom,
                        'unapprovalReason' => $this->unapprovalReason,
                    ]);
    }
}