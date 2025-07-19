<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = 'fr'; // Default fallback
        
        // Priority order: Session > User preference > Default
        if (Session::has('locale')) {
            $locale = Session::get('locale');
        } elseif ($request->user() && $request->user()->language) {
            $locale = $request->user()->language;
            // Store in session for future requests
            Session::put('locale', $locale);
        }
        
        // Validate the locale
        if (!in_array($locale, ['fr', 'en'])) {
            $locale = 'fr'; // Default fallback
        }
        
        // Set the application locale
        App::setLocale($locale);
        
        // Ensure session is updated
        Session::put('locale', $locale);
        
        return $next($request);
    }
}
