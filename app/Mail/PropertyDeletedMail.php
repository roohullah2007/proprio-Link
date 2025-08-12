<?php

namespace App\Mail;

use App\Models\Property;
use Illuminate\Queue\SerializesModels;

class PropertyDeletedMail extends LocalizedMailable
{
    use SerializesModels;

    public $property;
    public $deletionReason;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property, $deletionReason = null)
    {
        $this->property = $property;
        $this->deletionReason = $deletionReason;
        
        // Ensure property owner is loaded
        if (!$property->relationLoaded('proprietaire')) {
            $property->load('proprietaire');
        }
        
        // Set locale based on property owner's language preference
        try {
            $this->setUserLocale($property->proprietaire);
        } catch (\Exception $e) {
            $this->locale = config('app.locale', 'fr');
            \Log::warning('Failed to set user locale in PropertyDeletedMail: ' . $e->getMessage());
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
        
        $view = $this->getLocalizedView('emails.property-deleted');
        $subject = $this->getLocalizedSubject('Your property listing has been removed');
        
        return $this->subject($subject)
                    ->view($view)
                    ->with([
                        'property' => $this->property,
                        'ownerName' => $this->property->proprietaire->prenom,
                        'deletionReason' => $this->deletionReason,
                        'locale' => $this->locale,
                    ]);
    }
}