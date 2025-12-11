<?php

// Add this route to routes/web.php for debugging image issues

Route::get('/debug-images', function () {
    try {
        // Get some properties with images
        $properties = \App\Models\Property::with('images')->take(5)->get();
        
        $debug_info = [
            'storage_info' => [
                'storage_path' => storage_path('app/public'),
                'public_path' => public_path('storage'),
                'symlink_exists' => is_link(public_path('storage')),
                'symlink_target' => is_link(public_path('storage')) ? readlink(public_path('storage')) : null,
                'storage_disk_exists' => \Storage::disk('public')->exists(''),
            ],
            'routes_info' => [
                'serve_image_exists' => \Route::has('serve.image'),
                'serve_storage_exists' => \Route::has('serve.storage'),
            ],
            'properties_with_images' => []
        ];
        
        foreach ($properties as $property) {
            $property_debug = [
                'id' => $property->id,
                'type' => $property->type_propriete,
                'images_count' => $property->images->count(),
                'images' => []
            ];
            
            foreach ($property->images as $image) {
                $file_path = storage_path('app/public/' . $image->chemin_fichier);
                $public_file_path = public_path('storage/' . $image->chemin_fichier);
                
                $image_debug = [
                    'id' => $image->id,
                    'chemin_fichier' => $image->chemin_fichier,
                    'file_exists_storage' => file_exists($file_path),
                    'file_exists_public' => file_exists($public_file_path),
                    'file_size' => file_exists($file_path) ? filesize($file_path) : 0,
                    'urls' => [
                        'asset_url' => asset('storage/' . $image->chemin_fichier),
                        'storage_url' => \Storage::disk('public')->url($image->chemin_fichier),
                        'model_url' => $image->url,
                    ],
                    'fallback_urls' => $image->getImageUrls(),
                ];
                
                $property_debug['images'][] = $image_debug;
            }
            
            $debug_info['properties_with_images'][] = $property_debug;
        }
        
        // Return as JSON for easy debugging
        return response()->json($debug_info, 200, [], JSON_PRETTY_PRINT);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware('auth')->name('debug.images');
