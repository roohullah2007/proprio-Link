<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'prenom' => 'required|string|max:255',
            'nom' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'telephone' => 'nullable|string|max:20',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'type_utilisateur' => 'required|in:PROPRIETAIRE,AGENT',
            'language' => 'nullable|string|in:fr,en',
        ];

        // Additional validation for agents
        if ($this->type_utilisateur === 'AGENT') {
            $rules['numero_siret'] = 'required|string|size:14|regex:/^[0-9]{14}$/';
            $rules['licence_professionnelle'] = 'required|file|mimes:pdf,jpg,jpeg,png|max:10240'; // 10MB max
        }

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'prenom.required' => 'Le prénom est obligatoire.',
            'nom.required' => 'Le nom est obligatoire.',
            'email.required' => 'L\'adresse email est obligatoire.',
            'email.email' => 'L\'adresse email doit être valide.',
            'email.unique' => 'Cette adresse email est déjà utilisée.',
            'telephone.max' => 'Le numéro de téléphone ne peut pas dépasser 20 caractères.',
            'password.required' => 'Le mot de passe est obligatoire.',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas.',
            'type_utilisateur.required' => 'Le type d\'utilisateur est obligatoire.',
            'type_utilisateur.in' => 'Le type d\'utilisateur doit être PROPRIETAIRE ou AGENT.',
            'numero_siret.required' => 'Le numéro SIRET est obligatoire pour les agents.',
            'numero_siret.size' => 'Le numéro SIRET doit contenir exactement 14 chiffres.',
            'numero_siret.regex' => 'Le numéro SIRET doit contenir uniquement des chiffres.',
            'licence_professionnelle.required' => 'La licence professionnelle est obligatoire pour les agents.',
            'licence_professionnelle.file' => 'La licence professionnelle doit être un fichier.',
            'licence_professionnelle.mimes' => 'La licence professionnelle doit être un fichier PDF, JPG, JPEG ou PNG.',
            'licence_professionnelle.max' => 'La licence professionnelle ne peut pas dépasser 10 MB.',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Remove any spaces from SIRET number
        if ($this->has('numero_siret')) {
            $this->merge([
                'numero_siret' => preg_replace('/\s+/', '', $this->numero_siret),
            ]);
        }
    }
}
