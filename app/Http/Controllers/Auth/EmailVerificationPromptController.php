<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmailVerificationPromptController extends Controller
{
    /**
     * Display the email verification prompt.
     */
    public function __invoke(Request $request): RedirectResponse|Response
    {
        if ($request->user()->hasVerifiedEmail()) {
            // Check for post-verification redirect
            $postVerificationRedirect = $request->session()->get('post_verification_redirect');
            if ($postVerificationRedirect) {
                $request->session()->forget('post_verification_redirect');
                return redirect($postVerificationRedirect);
            }
            
            // Redirect to appropriate dashboard based on user type
            $user = $request->user();
            switch ($user->type_utilisateur) {
                case 'AGENT':
                    return redirect()->route('agent.dashboard');
                case 'ADMIN':
                    return redirect()->route('admin.dashboard');
                case 'PROPRIETAIRE':
                default:
                    return redirect()->route('dashboard');
            }
        }

        return Inertia::render('Auth/VerifyEmail', [
            'status' => session('status'),
            'message' => session('message'),
            'canRequestCode' => true, // Enable code-based verification
        ]);
    }
}
