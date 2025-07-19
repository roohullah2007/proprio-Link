<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        try {
            $validated = $request->validated();
            $user = $request->user();
            
            Log::info('Profile update started', [
                'user_id' => $user->id,
                'has_profile_image' => $request->hasFile('profile_image'),
                'profile_image_column_exists' => Schema::hasColumn('users', 'profile_image'),
                'validated_keys' => array_keys($validated)
            ]);
            
            // Handle license file upload if present
            if ($request->hasFile('licence_professionnelle')) {
                $file = $request->file('licence_professionnelle');
                
                Log::info('Processing license file', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);
                
                // Delete old license file if it exists
                if ($user->licence_professionnelle_url && !str_starts_with($user->licence_professionnelle_url, 'http')) {
                    Storage::disk('public')->delete($user->licence_professionnelle_url);
                }
                
                // Store new file
                $path = $file->store('licenses', 'public');
                $validated['licence_professionnelle_url'] = $path;
                
                // Remove the file from validated data as we've processed it
                unset($validated['licence_professionnelle']);
                
                Log::info('License file processed', ['path' => $path]);
            }
            
            // Handle profile image upload if present
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                
                Log::info('Processing profile image', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);
                
                // Check if the profile_image column exists
                if (!Schema::hasColumn('users', 'profile_image')) {
                    Log::error('Profile image column missing');
                    return Redirect::route('profile.edit')->withErrors([
                        'profile_image' => 'Database not ready for profile images. Please run migrations.'
                    ]);
                }
                
                // Validate file
                if (!$file->isValid()) {
                    Log::error('Invalid file upload', ['error' => $file->getErrorMessage()]);
                    return Redirect::route('profile.edit')->withErrors([
                        'profile_image' => 'File upload failed. Please try again.'
                    ]);
                }
                
                // Check file size (2MB = 2048KB)
                if ($file->getSize() > 2048 * 1024) {
                    Log::warning('File too large', ['size' => $file->getSize()]);
                    return Redirect::route('profile.edit')->withErrors([
                        'profile_image' => 'File size must be less than 2MB.'
                    ]);
                }
                
                // Delete old profile image if it exists
                if ($user->profile_image && !str_starts_with($user->profile_image, 'http')) {
                    $deleted = Storage::disk('public')->delete($user->profile_image);
                    Log::info('Old profile image deletion', ['success' => $deleted, 'path' => $user->profile_image]);
                }
                
                // Ensure directory exists
                if (!Storage::disk('public')->exists('profile-images')) {
                    Storage::disk('public')->makeDirectory('profile-images');
                    Log::info('Created profile-images directory');
                }
                
                // Store new file with a unique name
                $fileName = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('profile-images', $fileName, 'public');
                
                if (!$path) {
                    Log::error('Failed to store profile image');
                    return Redirect::route('profile.edit')->withErrors([
                        'profile_image' => 'Failed to save image. Please try again.'
                    ]);
                }
                
                // Set the profile image path directly on the user model
                $user->profile_image = $path;
                
                Log::info('Profile image stored', [
                    'path' => $path,
                    'full_path' => Storage::disk('public')->path($path),
                    'url' => asset('storage/' . $path)
                ]);
                
                // Remove from validated data since we're setting it directly
                unset($validated['profile_image']);
            }
            
            // Fill the user with other validated data
            $user->fill($validated);

            // If email is being changed, reset email verification
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
                Log::info('Email changed, resetting verification');
            }

            // Save the user
            $saved = $user->save();
            
            if (!$saved) {
                Log::error('Failed to save user');
                return Redirect::route('profile.edit')->withErrors([
                    'general' => 'Failed to save profile changes. Please try again.'
                ]);
            }
            
            Log::info('Profile updated successfully', [
                'user_id' => $user->id,
                'changed_attributes' => $user->getChanges()
            ]);

            return Redirect::route('profile.edit')->with('status', 'profile-updated');
            
        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Redirect::route('profile.edit')->withErrors([
                'general' => 'An error occurred while updating your profile: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
