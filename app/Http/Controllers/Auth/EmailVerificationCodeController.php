<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\EmailVerificationCode;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class EmailVerificationCodeController extends Controller
{
    /**
     * Send verification code to user's email
     */
    public function send(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        $success = EmailVerificationCode::generateAndSend($user->email);
        
        if ($success) {
            return back()->with('status', 'verification-code-sent')
                         ->with('message', 'Un code de vérification a été envoyé à votre adresse email.');
        } else {
            return back()->withErrors(['email' => 'Erreur lors de l\'envoi du code. Veuillez réessayer.']);
        }
    }

    /**
     * Verify the code and mark email as verified
     */
    public function verify(Request $request): RedirectResponse
    {
        $request->validate([
            'code' => 'required|string|size:6',
        ]);

        $user = $request->user();
        
        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard'));
        }

        $verified = EmailVerificationCode::verify($user->email, $request->code);
        
        if ($verified) {
            // Mark email as verified
            $user->markEmailAsVerified();
            
            // Check for post-verification redirect
            $postVerificationRedirect = $request->session()->get('post_verification_redirect');
            if ($postVerificationRedirect) {
                $request->session()->forget('post_verification_redirect');
                return redirect($postVerificationRedirect)->with('status', 'email-verified');
            }
            
            // Redirect to appropriate dashboard
            switch ($user->type_utilisateur) {
                case 'AGENT':
                    return redirect()->route('agent.dashboard')->with('status', 'email-verified');
                case 'ADMIN':
                    return redirect()->route('admin.dashboard')->with('status', 'email-verified');
                case 'PROPRIETAIRE':
                default:
                    return redirect()->route('dashboard')->with('status', 'email-verified');
            }
        } else {
            throw ValidationException::withMessages([
                'code' => 'Le code de vérification est invalide ou a expiré.',
            ]);
        }
    }
}
