<?php

// Add this route to routes/web.php for testing property images

Route::get('/test-property-images', function () {
    try {
        // Get some properties with images for testing
        $properties = \App\Models\Property::with('images')
            ->whereHas('images')
            ->take(3)
            ->get();
        
        // Transform images to include all necessary data
        $properties->each(function ($property) {
            $property->images->each(function ($image) {
                $image->append('url');
                $image->test_urls = [
                    'storage' => asset('storage/' . $image->chemin_fichier),
                    'images' => asset('images/' . $image->chemin_fichier),
                    'direct' => url('/storage/' . $image->chemin_fichier),
                ];
                $image->file_info = [
                    'storage_exists' => \Storage::disk('public')->exists($image->chemin_fichier),
                    'file_size' => \Storage::disk('public')->exists($image->chemin_fichier) 
                        ? \Storage::disk('public')->size($image->chemin_fichier) 
                        : 0,
                ];
            });
        });
        
        return \Inertia\Inertia::render('TestPropertyImages', [
            'properties' => $properties,
            'debug_info' => [
                'storage_path' => storage_path('app/public'),
                'public_path' => public_path('storage'),
                'symlink_exists' => is_link(public_path('storage')),
                'total_properties_with_images' => \App\Models\Property::whereHas('images')->count(),
            ]
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware('auth')->name('test.property.images');
