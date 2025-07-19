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
            
            // Debug logging
            Log::info('Profile update started', [
                'user_id' => $user->id,
                'has_profile_image_file' => $request->hasFile('profile_image'),
                'profile_image_column_exists' => Schema::hasColumn('users', 'profile_image'),
                'validated_data' => array_keys($validated)
            ]);
            
            // Handle license file upload if present
            if ($request->hasFile('licence_professionnelle')) {
                $file = $request->file('licence_professionnelle');
                
                // Delete old license file if it exists
                if ($user->licence_professionnelle_url && !str_starts_with($user->licence_professionnelle_url, 'http')) {
                    Storage::disk('public')->delete($user->licence_professionnelle_url);
                }
                
                // Store new file
                $path = $file->store('licenses', 'public');
                $validated['licence_professionnelle_url'] = $path;
                
                // Remove the file from validated data as we've processed it
                unset($validated['licence_professionnelle']);
            }
            
            // Handle profile image upload if present
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                
                Log::info('Processing profile image upload', [
                    'original_name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType()
                ]);
                
                // Check if the profile_image column exists
                if (!Schema::hasColumn('users', 'profile_image')) {
                    Log::error('Profile image column does not exist in users table');
                    return Redirect::route('profile.edit')->withErrors([
                        'profile_image' => 'Database not ready for profile images. Please contact administrator.'
                    ]);
                }
                
                // Delete old profile image if it exists
                if ($user->profile_image && !str_starts_with($user->profile_image, 'http')) {
                    Storage::disk('public')->delete($user->profile_image);
                    Log::info('Deleted old profile image', ['path' => $user->profile_image]);
                }
                
                // Store new file with a unique name
                $fileName = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('profile-images', $fileName, 'public');
                $validated['profile_image'] = $path;
                
                Log::info('Stored new profile image', [
                    'path' => $path,
                    'full_path' => Storage::disk('public')->path($path)
                ]);
            }
            
            // Remove the profile_image file from validated data as we've processed it
            if (isset($validated['profile_image']) && $validated['profile_image'] instanceof \Illuminate\Http\UploadedFile) {
                unset($validated['profile_image']);
            }
            
            // Fill the user with validated data
            $user->fill($validated);

            // If email is being changed, reset email verification
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Save the user
            $user->save();
            
            Log::info('Profile updated successfully', [
                'user_id' => $user->id,
                'updated_fields' => array_keys($user->getDirty())
            ]);

            return Redirect::route('profile.edit')->with('status', 'profile-updated');
            
        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return Redirect::route('profile.edit')->withErrors([
                'general' => 'An error occurred while updating your profile. Please try again. Error: ' . $e->getMessage()
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
