<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class EmailVerificationNotificationController extends Controller
{
    /**
     * Send a new email verification notification.
     */
    public function store(Request $request): RedirectResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return redirect()->intended(route('home', absolute: false));
        }

        // Send verification email directly instead of using notifications
        $user = $request->user();
        
        try {
            // Generate verification URL
            $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
                'verification.verify',
                \Illuminate\Support\Carbon::now()->addMinutes(60), // 60 minutes expiry
                [
                    'id' => $user->getKey(),
                    'hash' => sha1($user->getEmailForVerification()),
                ]
            );
            
            // Send email directly without queue
            \Illuminate\Support\Facades\Mail::to($user->getEmailForVerification())
                ->send(new \App\Mail\CustomVerifyEmailMail($user, $verificationUrl, $user->language ?? 'fr'));
                
            \Log::info('Verification email sent successfully to: ' . $user->getEmailForVerification());
                
        } catch (\Exception $e) {
            \Log::error('Failed to send verification email: ' . $e->getMessage());
            return back()->withErrors(['email' => 'Erreur lors de l\'envoi de l\'email de vérification.']);
        }

        return back()->with('status', 'verification-link-sent');
    }
}
