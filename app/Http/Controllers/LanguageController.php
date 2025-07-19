<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;

class LanguageController extends Controller
{
    /**
     * Change the application language
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function change(Request $request)
    {
        // Get language from either 'language' or 'locale' parameter for backward compatibility
        $language = $request->input('language') ?? $request->input('locale');
        
        // Validate the language is supported
        if (!in_array($language, ['fr', 'en'])) {
            return redirect()->back()->with('error', 'Language not supported');
        }
        
        // Store the language preference in session
        Session::put('locale', $language);
        Session::save();
        
        // Set the application locale immediately
        App::setLocale($language);
        
        // If user is authenticated, update their language preference
        if ($request->user()) {
            try {
                $request->user()->update(['language' => $language]);
            } catch (\Exception $e) {
                // Silent fail for user preference update
            }
        }
        
        // Clear any cached views or configs that might contain translations
        $this->clearLanguageCache();
        
        // Force redirect back to same page with new locale
        return redirect()->back()
            ->with('success', $this->getLanguageChangeMessage($language))
            ->with('locale_changed', $language);
    }
    
    /**
     * Get the current language
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function current()
    {
        return response()->json([
            'current_locale' => app()->getLocale(),
            'session_locale' => session('locale'),
            'available_locales' => ['fr', 'en'],
        ]);
    }
    
    /**
     * Get language change success message
     *
     * @param string $language
     * @return string
     */
    private function getLanguageChangeMessage(string $language): string
    {
        return match($language) {
            'fr' => 'Langue changée en français',
            'en' => 'Language changed to English',
            default => 'Language changed'
        };
    }
    
    /**
     * Clear language-related caches
     *
     * @return void
     */
    private function clearLanguageCache(): void
    {
        try {
            // Clear view cache only in development
            if (app()->environment() !== 'production') {
                \Artisan::call('view:clear');
                \Artisan::call('config:clear');
            }
            
            // Clear OPcache if available
            if (function_exists('opcache_reset')) {
                opcache_reset();
            }
        } catch (\Exception $e) {
            // Silent fail for cache clearing
        }
    }
}
