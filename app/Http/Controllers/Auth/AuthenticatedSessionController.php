<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(Request $request): Response
    {
        // Store the intended URL if provided
        if ($request->has('redirect')) {
            $request->session()->put('url.intended', $request->get('redirect'));
        }

        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'intendedUrl' => $request->get('redirect'),
            'userType' => $request->get('type'), // Pass the user type (agent, etc.)
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();
        $request->session()->regenerate();

        $user = Auth::user();
        
        // Check if email is verified
        if (!$user->hasVerifiedEmail()) {
            // Store intended URL for after verification
            $intendedUrl = $request->session()->get('url.intended');
            if ($intendedUrl) {
                $request->session()->put('post_verification_redirect', $intendedUrl);
            }
            
            // Redirect to email verification with notice
            return redirect()->route('verification.notice')
                ->with('status', 'email-verification-required')
                ->with('message', 'Veuillez vérifier votre adresse email avant de continuer.');
        }

        // Check for specific user type redirects
        $intendedUrl = $request->session()->get('url.intended');
        
        // Admin users should go to admin dashboard
        if ($user && $user->isAdmin()) {
            return redirect()->intended(route('admin.dashboard', absolute: false));
        }
        
        // Agent users should go to agent dashboard
        if ($user && $user->type_utilisateur === 'AGENT') {
            // Check if there's an intended URL for property pages
            if ($intendedUrl && preg_match('/\/property\/([a-f0-9-]+)/', $intendedUrl, $matches)) {
                $propertyId = $matches[1];
                // Redirect to payment page for the property
                return redirect("/payment/properties/{$propertyId}");
            }
            // Otherwise redirect to agent dashboard
            return redirect()->intended(route('agent.dashboard', absolute: false));
        }
        
        // Property owners should go to their dashboard
        if ($user && $user->type_utilisateur === 'PROPRIETAIRE') {
            return redirect()->intended(route('dashboard', absolute: false));
        }

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
