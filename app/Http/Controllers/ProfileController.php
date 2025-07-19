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
            // Enhanced logging for debugging
            \Log::info('Profile update request received', [
                'user_id' => $request->user()->id,
                'method' => $request->method(),
                'content_type' => $request->header('Content-Type'),
                'all_data' => $request->except(['profile_image', 'licence_professionnelle']),
                'has_profile_image' => $request->hasFile('profile_image'),
                'has_license' => $request->hasFile('licence_professionnelle'),
                'profile_image_details' => $request->hasFile('profile_image') ? [
                    'name' => $request->file('profile_image')->getClientOriginalName(),
                    'size' => $request->file('profile_image')->getSize(),
                    'mime' => $request->file('profile_image')->getMimeType()
                ] : null
            ]);
            
            // Check storage directories exist and create them using Laravel Storage
            $profileImagesPath = 'profile-images';
            $licensesPath = 'licenses';
            
            if (!Storage::disk('public')->exists($profileImagesPath)) {
                Storage::disk('public')->makeDirectory($profileImagesPath);
                \Log::info('Created profile images directory', ['path' => $profileImagesPath]);
            }
            
            if (!Storage::disk('public')->exists($licensesPath)) {
                Storage::disk('public')->makeDirectory($licensesPath);
                \Log::info('Created licenses directory', ['path' => $licensesPath]);
            }
            
            $validated = $request->validated();
            $user = $request->user();
            
            // Handle license file upload if present
            if ($request->hasFile('licence_professionnelle')) {
                $file = $request->file('licence_professionnelle');
                
                // Delete old license file if it exists
                if ($user->licence_professionnelle_url && !str_starts_with($user->licence_professionnelle_url, 'http')) {
                    Storage::disk('public')->delete($user->licence_professionnelle_url);
                }
                
                // Store new file
                $path = $file->store('licenses', 'public');
                $user->licence_professionnelle_url = $path;
                
                Log::info('License file uploaded', ['user_id' => $user->id, 'path' => $path]);
            }
            
            // Handle profile image upload if present
            if ($request->hasFile('profile_image')) {
                $file = $request->file('profile_image');
                
                // Additional file validation
                if (!$file->isValid()) {
                    throw new \Exception('Invalid file upload');
                }
                
                $allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                if (!in_array($file->getMimeType(), $allowedMimes)) {
                    throw new \Exception('File type not allowed. Please upload JPG, PNG, or GIF images only.');
                }
                
                if ($file->getSize() > 2 * 1024 * 1024) { // 2MB
                    throw new \Exception('File size too large. Maximum size is 2MB.');
                }
                
                // Delete old profile image if it exists
                if ($user->profile_image && !str_starts_with($user->profile_image, 'http')) {
                    try {
                        Storage::disk('public')->delete($user->profile_image);
                        \Log::info('Deleted old profile image', ['old_path' => $user->profile_image]);
                    } catch (\Exception $e) {
                        \Log::warning('Could not delete old profile image', ['error' => $e->getMessage()]);
                    }
                }
                
                // Store new file with a unique name
                $fileName = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
                $path = $file->storeAs('profile-images', $fileName, 'public');
                
                if (!$path) {
                    throw new \Exception('Failed to store profile image');
                }
                
                $user->profile_image = $path;
                
                // FALLBACK: Also copy to public directory if symlink doesn't work
                $sourcePath = storage_path('app/public/' . $path);
                $publicPath = public_path('storage/' . $path);
                $publicDir = dirname($publicPath);
                
                if (!is_dir($publicDir)) {
                    mkdir($publicDir, 0755, true);
                }
                
                if (file_exists($sourcePath) && !file_exists($publicPath)) {
                    copy($sourcePath, $publicPath);
                    Log::info('Profile image copied to public directory as fallback', [
                        'user_id' => $user->id, 
                        'source' => $sourcePath,
                        'destination' => $publicPath
                    ]);
                }
                
                Log::info('Profile image uploaded successfully', [
                    'user_id' => $user->id, 
                    'path' => $path,
                    'file_name' => $fileName,
                    'file_size' => $file->getSize()
                ]);
            }
            
            // Remove file fields from validated data since we handled them separately
            unset($validated['licence_professionnelle'], $validated['profile_image']);
            
            // Fill the user with the remaining validated data
            $user->fill($validated);

            // If email is being changed, reset email verification
            if ($user->isDirty('email')) {
                $user->email_verified_at = null;
            }

            // Save the user
            $saved = $user->save();
            
            Log::info('Profile update completed', [
                'user_id' => $user->id,
                'saved' => $saved,
                'updated_fields' => array_keys($user->getDirty())
            ]);

            return Redirect::route('profile.edit')->with('status', 'profile-updated');
            
        } catch (\Exception $e) {
            Log::error('Profile update failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage(),
                'line' => $e->getLine(),
                'file' => $e->getFile(),
                'trace' => $e->getTraceAsString(),
                'request_data' => $request->except(['password', 'profile_image', 'licence_professionnelle']),
                'storage_info' => [
                    'storage_app_public_exists' => file_exists(storage_path('app/public')),
                    'profile_images_dir_exists' => file_exists(storage_path('app/public/profile-images')),
                    'public_storage_exists' => file_exists(public_path('storage')),
                    'storage_disk_exists' => Storage::disk('public')->exists(''),
                ]
            ]);
            
            // Check if it's a specific file upload error
            $errorMessage = 'An error occurred while updating your profile. Please try again.';
            
            if (str_contains($e->getMessage(), 'mkdir')) {
                $errorMessage = 'Storage directory creation failed. Please run the storage fix script or contact support.';
            } elseif (str_contains($e->getMessage(), 'File type not allowed')) {
                $errorMessage = $e->getMessage();
            } elseif (str_contains($e->getMessage(), 'File size too large')) {
                $errorMessage = $e->getMessage();
            } elseif (str_contains($e->getMessage(), 'Invalid file upload')) {
                $errorMessage = 'The uploaded file is invalid. Please try uploading a different image.';
            } elseif (str_contains($e->getMessage(), 'Failed to store')) {
                $errorMessage = 'Failed to save the uploaded file. Please check storage permissions and try again.';
            }
            
            return Redirect::route('profile.edit')->withErrors([
                'general' => $errorMessage
            ]);
        }
    }

    /**
     * Handle profile image removal
     */
    public function removeProfileImage(Request $request): RedirectResponse
    {
        try {
            $user = $request->user();
            
            // Delete current profile image if it exists
            if ($user->profile_image && !str_starts_with($user->profile_image, 'http')) {
                Storage::disk('public')->delete($user->profile_image);
            }
            
            // Remove profile image from user record
            $user->profile_image = null;
            $user->save();
            
            Log::info('Profile image removed', ['user_id' => $user->id]);
            
            return Redirect::route('profile.edit')->with('status', 'profile-image-removed');
            
        } catch (\Exception $e) {
            Log::error('Profile image removal failed', [
                'user_id' => $request->user()->id,
                'error' => $e->getMessage()
            ]);
            
            return Redirect::route('profile.edit')->withErrors([
                'general' => 'An error occurred while removing your profile image. Please try again.'
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
