<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Log the incoming request data for debugging
        \Log::info('ProfileUpdateRequest validation prep', [
            'method' => $this->method(),
            'all_data' => $this->all(),
            'files' => $this->allFiles(),
            'has_files' => count($this->allFiles()) > 0,
            'content_type' => $this->header('Content-Type')
        ]);
    }
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'prenom' => ['required', 'string', 'max:255'],
            'nom' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'telephone' => ['nullable', 'string', 'max:20'],
            'numero_siret' => ['nullable', 'string', 'max:14'],
            'licence_professionnelle' => ['nullable', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:5120'], // 5MB max
            'profile_image' => ['nullable', 'file', 'mimes:jpg,jpeg,png,gif', 'max:2048'], // 2MB max for profile images
        ];
    }

    /**
     * Get custom attribute names for error messages.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'prenom' => __('First Name'),
            'nom' => __('Last Name'),
            'email' => __('Email Address'),
            'telephone' => __('Phone Number'),
            'numero_siret' => __('SIRET Number'),
            'licence_professionnelle' => __('Professional License'),
            'profile_image' => __('Profile Image'),
        ];
    }

    /**
     * Get custom error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'prenom.required' => __('The first name field is required.'),
            'nom.required' => __('The last name field is required.'),
            'email.required' => __('The email address field is required.'),
            'email.email' => __('Please enter a valid email address.'),
            'email.unique' => __('This email address is already taken.'),
            'telephone.max' => __('The phone number may not be greater than :max characters.'),
            'numero_siret.max' => __('The SIRET number may not be greater than :max characters.'),
            'licence_professionnelle.file' => __('Professional license must be a file.'),
            'licence_professionnelle.mimes' => __('Professional license must be a PDF, JPG, JPEG, or PNG file.'),
            'licence_professionnelle.max' => __('Professional license file size may not be greater than 5MB.'),
            'profile_image.file' => __('Profile image must be a file.'),
            'profile_image.mimes' => __('Profile image must be a JPG, JPEG, PNG, or GIF file.'),
            'profile_image.max' => __('Profile image file size may not be greater than 2MB.'),
        ];
    }
}
