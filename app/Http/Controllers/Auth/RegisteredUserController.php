<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\RegisterUserRequest;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(Request $request): Response
    {
        // Store the intended URL if provided
        if ($request->has('redirect')) {
            $request->session()->put('url.intended', $request->get('redirect'));
        }

        return Inertia::render('Auth/Register', [
            'intendedUrl' => $request->get('redirect'),
            'userType' => $request->get('type'), // Pass the user type
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(RegisterUserRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Handle file upload for agents
        $licenceUrl = null;
        if ($request->hasFile('licence_professionnelle')) {
            $file = $request->file('licence_professionnelle');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $licenceUrl = $file->storeAs('licences_professionnelles', $filename, 'public');
        }

        $user = User::create([
            'uuid' => Str::uuid(),
            'prenom' => $validatedData['prenom'],
            'nom' => $validatedData['nom'],
            'email' => $validatedData['email'],
            'telephone' => $validatedData['telephone'] ?? null,
            'password' => Hash::make($validatedData['password']),
            'type_utilisateur' => $validatedData['type_utilisateur'], // Use original field
            'numero_siret' => $validatedData['numero_siret'] ?? null,
            'licence_professionnelle_url' => $licenceUrl,
            'est_verifie' => false, // All users start unverified
            'language' => $validatedData['language'] ?? app()->getLocale(),
        ]);

        // Send welcome email
        try {
            \Mail::to($user)->send(new \App\Mail\WelcomeEmail($user));
        } catch (\Exception $e) {
            \Log::error('Failed to send welcome email: ' . $e->getMessage());
        }

        event(new Registered($user));

        Auth::login($user);

        // Check if user is an agent and there's an intended URL
        $intendedUrl = $request->session()->get('url.intended');
        
        if ($user->type_utilisateur === 'AGENT' && $intendedUrl) {
            // Check if the intended URL is a property page
            if (preg_match('/\/property\/([a-f0-9-]+)/', $intendedUrl, $matches)) {
                $propertyId = $matches[1];
                // Store the property ID for after email verification
                $request->session()->put('payment_property_id', $propertyId);
            }
        }

        // Redirect to email verification for all new users
        // They'll be redirected to appropriate dashboard/payment after verification
        return redirect()->route('verification.notice');
    }
}
