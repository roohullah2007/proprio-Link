<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterProprietaireRequest;
use App\Http\Requests\Auth\RegisterAgentRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    /**
     * Display the registration view for property owners.
     */
    public function showRegisterProprietaire(): Response
    {
        return Inertia::render('Auth/RegisterProprietaire');
    }

    /**
     * Display the registration view for agents.
     */
    public function showRegisterAgent(): Response
    {
        return Inertia::render('Auth/RegisterAgent');
    }

    /**
     * Handle an incoming registration request for property owners.
     */
    public function registerProprietaire(RegisterProprietaireRequest $request): RedirectResponse
    {
        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'type_utilisateur' => User::TYPE_PROPRIETAIRE,
            'est_verifie' => false,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard'))->with('success', 'Inscription réussie ! Bienvenue sur Propio.');
    }

    /**
     * Handle an incoming registration request for agents.
     */
    public function registerAgent(RegisterAgentRequest $request): RedirectResponse
    {
        $licenceUrl = null;
        
        // Handle license file upload
        if ($request->hasFile('licence_professionnelle')) {
            $licenceUrl = $request->file('licence_professionnelle')->store('licences', 'public');
        }

        $user = User::create([
            'prenom' => $request->prenom,
            'nom' => $request->nom,
            'email' => $request->email,
            'telephone' => $request->telephone,
            'password' => Hash::make($request->password),
            'type_utilisateur' => User::TYPE_AGENT,
            'numero_siret' => $request->numero_siret,
            'licence_professionnelle_url' => $licenceUrl,
            'est_verifie' => false, // Agents need manual verification
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect(route('dashboard'))->with('info', 'Inscription réussie ! Votre compte agent est en cours de vérification.');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = Auth::user();
        
        $message = "Bienvenue {$user->prenom} !";
        
        if ($user->isAgent() && !$user->est_verifie) {
            $message .= " Votre compte agent est en cours de vérification.";
        }

        return redirect()->intended(route('dashboard'))->with('success', $message);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'À bientôt sur Propio !');
    }
}
