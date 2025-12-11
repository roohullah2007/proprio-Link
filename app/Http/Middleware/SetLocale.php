<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Available locales
     */
    const AVAILABLE_LOCALES = ['fr', 'en'];
    
    /**
     * Default locale
     */
    const DEFAULT_LOCALE = 'fr';

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = $this->determineLocale($request);
        
        // Set the application locale
        App::setLocale($locale);
        
        // Store in session for future requests
        Session::put('locale', $locale);
        
        // Debug logging (remove in production)
        if (app()->environment('local')) {
            Log::info('Locale Set', [
                'determined_locale' => $locale,
                'session_locale' => Session::get('locale'),
                'app_locale' => App::getLocale(),
                'request_path' => $request->path(),
            ]);
        }
        
        return $next($request);
    }

    /**
     * Determine the locale to use
     *
     * @param Request $request
     * @return string
     */
    private function determineLocale(Request $request): string
    {
        // Priority order:
        // 1. URL parameter (?lang=en)
        // 2. Session value
        // 3. User preference (if authenticated)
        // 4. Accept-Language header
        // 5. Default locale
        
        // 1. Check URL parameter
        if ($request->has('lang')) {
            $urlLocale = $request->get('lang');
            if ($this->isValidLocale($urlLocale)) {
                return $urlLocale;
            }
        }
        
        // 2. Check session
        if (Session::has('locale')) {
            $sessionLocale = Session::get('locale');
            if ($this->isValidLocale($sessionLocale)) {
                return $sessionLocale;
            }
        }
        
        // 3. Check user preference
        if ($request->user() && $request->user()->language) {
            $userLocale = $request->user()->language;
            if ($this->isValidLocale($userLocale)) {
                return $userLocale;
            }
        }
        
        // 4. Check Accept-Language header
        $acceptLanguage = $request->header('Accept-Language');
        if ($acceptLanguage) {
            $preferredLocale = $this->parseAcceptLanguage($acceptLanguage);
            if ($preferredLocale && $this->isValidLocale($preferredLocale)) {
                return $preferredLocale;
            }
        }
        
        // 5. Default locale
        return self::DEFAULT_LOCALE;
    }

    /**
     * Check if a locale is valid
     *
     * @param string $locale
     * @return bool
     */
    private function isValidLocale(?string $locale): bool
    {
        return $locale && in_array($locale, self::AVAILABLE_LOCALES);
    }

    /**
     * Parse Accept-Language header and return the first supported locale
     *
     * @param string $acceptLanguage
     * @return string|null
     */
    private function parseAcceptLanguage(string $acceptLanguage): ?string
    {
        // Parse languages from Accept-Language header
        // Format: en-US,en;q=0.9,fr;q=0.8
        preg_match_all('/([a-z]{2})(?:-[A-Z]{2})?(?:;q=([0-9.]+))?/', $acceptLanguage, $matches, PREG_SET_ORDER);
        
        $languages = [];
        foreach ($matches as $match) {
            $lang = $match[1];
            $quality = isset($match[2]) ? (float) $match[2] : 1.0;
            $languages[$lang] = $quality;
        }
        
        // Sort by quality (preference)
        arsort($languages);
        
        // Return first supported language
        foreach (array_keys($languages) as $lang) {
            if (in_array($lang, self::AVAILABLE_LOCALES)) {
                return $lang;
            }
        }
        
        return null;
    }
}
