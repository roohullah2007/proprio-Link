<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Support\Facades\App;
use App\Models\EmailSetting;

abstract class LocalizedMailable extends Mailable
{
    protected $user;
    public $locale;
    
    /**
     * Prevent email from being queued - applies to all localized emails
     */
    public $tries = null;

    /**
     * Set the locale for this email based on user preference
     */
    protected function setUserLocale($user = null)
    {
        try {
            if ($user && isset($user->language) && $user->language) {
                $this->locale = $user->language;
                $this->user = $user;
            } else {
                $this->locale = config('app.locale', 'fr');
            }

            // Set the application locale for translations
            App::setLocale($this->locale);
        } catch (\Exception $e) {
            // Fallback to default locale if anything goes wrong
            $this->locale = 'fr';
            App::setLocale($this->locale);
            \Log::error('Error setting user locale: ' . $e->getMessage());
        }
    }

    /**
     * Get localized subject line
     */
    protected function getLocalizedSubject($key, $replacements = [])
    {
        return __($key, $replacements);
    }

    /**
     * Get the proper From address for emails
     */
    protected function getFromAddress()
    {
        return new Address(
            EmailSetting::get('mail_from_address', config('mail.from.address', 'noreply@proprio-link.fr')),
            EmailSetting::get('mail_from_name', config('mail.from.name', 'Proprio Link'))
        );
    }

    /**
     * Get the appropriate email template view based on locale
     */
    protected function getLocalizedView($baseTemplate)
    {
        // Ensure we have a locale set
        if (!$this->locale) {
            $this->locale = config('app.locale', 'fr');
        }
        
        $localizedTemplate = $baseTemplate . '_' . $this->locale;
        
        // Check if localized template exists, otherwise fall back to base template
        try {
            if (view()->exists($localizedTemplate)) {
                return $localizedTemplate;
            }
        } catch (\Exception $e) {
            // Log the error but don't fail
            \Log::warning('Failed to check view existence: ' . $e->getMessage());
        }
        
        // Ensure base template exists
        try {
            if (view()->exists($baseTemplate)) {
                return $baseTemplate;
            }
        } catch (\Exception $e) {
            \Log::error('Base email template not found: ' . $baseTemplate);
        }
        
        // Fallback to a generic template that should always exist
        return 'emails.empty';
    }

    /**
     * Build the message with proper locale context
     * This method is called by Laravel's mailing system
     */
    public function build()
    {
        // Set locale in view data for Blade templates
        $this->with('locale', $this->locale);
        $this->with('user', $this->user);
        
        // For modern Laravel mailables, we don't need parent::build()
        // The envelope(), content(), and attachments() methods handle everything
        return $this;
    }
}