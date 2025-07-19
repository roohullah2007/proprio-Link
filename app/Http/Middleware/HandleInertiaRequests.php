<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // Get the current locale (should be set by SetLocale middleware)
        $locale = app()->getLocale();
        $sessionLocale = $request->session()->get('locale');
        
        // Load translations for the current locale
        $translationsPath = lang_path($locale . '.json');
        $translations = [];
        
        if (file_exists($translationsPath)) {
            // Force fresh read of the translation file (no caching)
            clearstatcache(true, $translationsPath);
            $contents = file_get_contents($translationsPath);
            $translations = json_decode($contents, true) ?? [];
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'locale' => $locale,
            'translations' => $translations,
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'success_description' => fn () => $request->session()->get('success_description'),
                'error' => fn () => $request->session()->get('error'),
                'locale_changed' => fn () => $request->session()->get('locale_changed'),
            ],
            // Add a unique key that changes when locale changes to force re-render
            'locale_key' => $locale . '_' . time(),
        ];
    }
}
