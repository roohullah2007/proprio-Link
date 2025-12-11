<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

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
        
        // Load translations with caching for better performance
        $translations = $this->loadTranslations($locale);
        
        // Debug logging (remove in production)
        if (app()->environment('local')) {
            Log::info('Inertia Props Debug', [
                'locale' => $locale,
                'session_locale' => $request->session()->get('locale'),
                'app_locale' => app()->getLocale(),
                'translations_count' => count($translations),
                'sample_keys' => array_slice(array_keys($translations), 0, 5)
            ]);
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
            // Force re-render when locale changes
            'locale_key' => $locale . '_' . md5(serialize($translations)),
        ];
    }

    /**
     * Load translations for the given locale with caching
     *
     * @param string $locale
     * @return array
     */
    private function loadTranslations(string $locale): array
    {
        $cacheKey = "translations.{$locale}";
        
        return Cache::remember($cacheKey, 3600, function () use ($locale) {
            $translations = [];
            
            // Try multiple paths for translation files
            $paths = [
                lang_path($locale . '.json'),
                resource_path("lang/{$locale}.json"),
                base_path("lang/{$locale}.json")
            ];
            
            foreach ($paths as $path) {
                if (file_exists($path)) {
                    try {
                        // Force fresh read without file cache
                        clearstatcache(true, $path);
                        $contents = file_get_contents($path);
                        
                        if ($contents !== false) {
                            $decoded = json_decode($contents, true);
                            
                            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                                $translations = $decoded;
                                Log::info("Translations loaded from: {$path}", [
                                    'count' => count($translations),
                                    'locale' => $locale
                                ]);
                                break;
                            } else {
                                Log::error("JSON decode error in translation file: {$path}", [
                                    'error' => json_last_error_msg(),
                                    'locale' => $locale
                                ]);
                            }
                        }
                    } catch (\Exception $e) {
                        Log::error("Error reading translation file: {$path}", [
                            'error' => $e->getMessage(),
                            'locale' => $locale
                        ]);
                    }
                }
            }
            
            // If no translations loaded, log warning and provide fallback
            if (empty($translations)) {
                Log::warning("No translations loaded for locale: {$locale}");
                
                // Provide basic fallback translations
                $translations = [
                    'Register' => $locale === 'fr' ? 'S\'inscrire' : 'Register',
                    'Login' => $locale === 'fr' ? 'Se connecter' : 'Login',
                    'Email' => $locale === 'fr' ? 'E-mail' : 'Email',
                    'Password' => $locale === 'fr' ? 'Mot de passe' : 'Password',
                    'First Name' => $locale === 'fr' ? 'Prénom' : 'First Name',
                    'Last Name' => $locale === 'fr' ? 'Nom' : 'Last Name',
                ];
            }
            
            return $translations;
        });
    }

    /**
     * Clear translation cache
     */
    public static function clearTranslationCache(): void
    {
        Cache::forget('translations.fr');
        Cache::forget('translations.en');
    }
}
