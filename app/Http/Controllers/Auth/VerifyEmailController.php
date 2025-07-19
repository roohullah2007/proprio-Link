<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Auth\Events\Verified;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\RedirectResponse;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(EmailVerificationRequest $request): RedirectResponse
    {
        $user = $request->user();
        
        if ($user->hasVerifiedEmail()) {
            // Check if there's a pending property payment for agents
            if ($user->type_utilisateur === 'AGENT' && $request->session()->has('payment_property_id')) {
                $propertyId = $request->session()->pull('payment_property_id');
                return redirect("/payment/properties/{$propertyId}")->with('verified', true);
            }
            
            // Redirect to appropriate dashboard based on user type
            switch ($user->type_utilisateur) {
                case 'AGENT':
                    return redirect()->route('agent.dashboard')->with('verified', true);
                case 'ADMIN':
                    return redirect()->route('admin.dashboard')->with('verified', true);
                case 'PROPRIETAIRE':
                default:
                    return redirect()->route('dashboard')->with('verified', true);
            }
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        // Check if there's a pending property payment for agents after verification
        if ($user->type_utilisateur === 'AGENT' && $request->session()->has('payment_property_id')) {
            $propertyId = $request->session()->pull('payment_property_id');
            return redirect("/payment/properties/{$propertyId}")->with('verified', true);
        }

        // Redirect to appropriate dashboard based on user type after verification
        switch ($user->type_utilisateur) {
            case 'AGENT':
                return redirect()->route('agent.dashboard')->with('verified', true);
            case 'ADMIN':
                return redirect()->route('admin.dashboard')->with('verified', true);
            case 'PROPRIETAIRE':
            default:
                return redirect()->route('dashboard')->with('verified', true);
        }
    }
}
