<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Intervention\Image\Facades\Image;

class ProfileImageController extends Controller
{
    /**
     * Upload profile image
     */
    public function upload(Request $request): JsonResponse
    {
        try {
            // Validate the uploaded file
            $request->validate([
                'profile_image' => [
                    'required',
                    'file',
                    'mimes:jpeg,jpg,png,gif',
                    'max:2048' // 2MB max
                ]
            ]);

            $user = Auth::user();
            $file = $request->file('profile_image');

            Log::info('Profile image upload started', [
                'user_id' => $user->id,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType()
            ]);

            // Create a unique filename
            $fileName = 'profile_' . $user->id . '_' . time() . '.' . $file->getClientOriginalExtension();
            
            // Ensure the directory exists
            $profileImagesPath = public_path('uploads/profile-images');
            if (!file_exists($profileImagesPath)) {
                mkdir($profileImagesPath, 0755, true);
            }

            // Move the file directly to public directory
            $filePath = $profileImagesPath . '/' . $fileName;
            
            if ($file->move($profileImagesPath, $fileName)) {
                // Delete old profile image if it exists
                if ($user->profile_image) {
                    $oldImagePath = public_path('uploads/profile-images/' . basename($user->profile_image));
                    if (file_exists($oldImagePath)) {
                        unlink($oldImagePath);
                    }
                }

                // Update user's profile image path
                $relativePath = 'uploads/profile-images/' . $fileName;
                $user->profile_image = $relativePath;
                $user->save();

                Log::info('Profile image uploaded successfully', [
                    'user_id' => $user->id,
                    'file_path' => $relativePath
                ]);

                return response()->json([
                    'success' => true,
                    'message' => 'Profile image uploaded successfully!',
                    'image_url' => asset($relativePath)
                ]);
            } else {
                throw new \Exception('Failed to move uploaded file');
            }

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);

        } catch (\Exception $e) {
            Log::error('Profile image upload failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload profile image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove profile image
     */
    public function remove(Request $request): JsonResponse
    {
        try {
            $user = Auth::user();

            if ($user->profile_image) {
                // Delete the file
                $imagePath = public_path($user->profile_image);
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }

                // Clear the database field
                $user->profile_image = null;
                $user->save();

                Log::info('Profile image removed', ['user_id' => $user->id]);

                return response()->json([
                    'success' => true,
                    'message' => 'Profile image removed successfully!'
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'No profile image to remove'
            ]);

        } catch (\Exception $e) {
            Log::error('Profile image removal failed', [
                'user_id' => Auth::id(),
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to remove profile image: ' . $e->getMessage()
            ], 500);
        }
    }
}
