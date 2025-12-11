<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Queue\SerializesModels;

class PropertyRejectedMail extends LocalizedMailable
{
    use SerializesModels;

    public $property;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property)
    {
        $this->property = $property;
        
        // Ensure property owner is loaded
        if (!$property->relationLoaded('proprietaire')) {
            $property->load('proprietaire');
        }
        
        // Set locale based on property owner's language preference
        try {
            $this->setUserLocale($property->proprietaire);
        } catch (\Exception $e) {
            $this->locale = config('app.locale', 'fr');
            \Log::warning('Failed to set user locale in PropertyRejectedMail: ' . $e->getMessage());
        }
    }

    /**
     * Build the message.
     */
    public function build()
    {
        // Ensure we have a locale set
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        $view = $this->getLocalizedView('emails.property-rejected');
        $subject = $this->getLocalizedSubject('Your property listing has been disapproved');
        
        return $this->subject($subject)
                    ->view($view)
                    ->with([
                        'property' => $this->property,
                        'ownerName' => $this->property->proprietaire->prenom,
                        'rejectionReason' => $this->property->raison_rejet,
                        'locale' => $this->locale,
                    ]);
    }
}
