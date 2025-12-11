<?php

// Add this route to routes/web.php for comprehensive property images diagnostic

Route::get('/diagnostic-property-images', function () {
    try {
        // Collect comprehensive diagnostic data
        $diagnosticData = [
            // Database analysis
            'total_images' => \App\Models\PropertyImage::count(),
            'images_with_properties' => \App\Models\PropertyImage::whereHas('property')->count(),
            
            // Storage paths
            'storage_path' => storage_path('app/public'),
            'properties_storage_path' => storage_path('app/public/properties'),
            'public_path' => public_path('storage'),
            
            // Storage existence checks
            'storage_exists' => file_exists(storage_path('app/public')),
            'properties_folder_exists' => file_exists(storage_path('app/public/properties')),
            'public_symlink_exists' => file_exists(public_path('storage')),
            'symlink_valid' => is_link(public_path('storage')) && file_exists(readlink(public_path('storage'))),
            
            // Profile images comparison (working)
            'profile_storage_exists' => file_exists(storage_path('app/public/profile-images')),
            'profile_public_exists' => file_exists(public_path('storage/profile-images')),
            'profile_files_count' => file_exists(storage_path('app/public/profile-images')) 
                ? count(glob(storage_path('app/public/profile-images/*'))) 
                : 0,
            
            // Property directories analysis
            'property_directories_count' => file_exists(storage_path('app/public/properties'))
                ? count(glob(storage_path('app/public/properties/*'), GLOB_ONLYDIR))
                : 0,
            'total_property_files' => 0,
            
            // Laravel configuration
            'default_disk' => config('filesystems.default'),
            'public_disk_root' => config('filesystems.disks.public.root'),
            'public_disk_url' => config('filesystems.disks.public.url'),
            'storage_facade_works' => \Storage::disk('public')->exists(''),
            
            // Sample images for testing
            'sample_images' => [],
        ];
        
        // Count total property files
        if (file_exists(storage_path('app/public/properties'))) {
            $propertyDirs = glob(storage_path('app/public/properties/*'), GLOB_ONLYDIR);
            $totalFiles = 0;
            foreach ($propertyDirs as $dir) {
                $totalFiles += count(glob($dir . '/*'));
            }
            $diagnosticData['total_property_files'] = $totalFiles;
        }
        
        // Get sample images with full analysis
        $sampleImages = \App\Models\PropertyImage::with('property')->take(5)->get();
        
        foreach ($sampleImages as $image) {
            $storagePath = storage_path('app/public/' . $image->chemin_fichier);
            $publicPath = public_path('storage/' . $image->chemin_fichier);
            
            $imageData = [
                'id' => $image->id,
                'property_id' => $image->property_id,
                'nom_fichier' => $image->nom_fichier,
                'chemin_fichier' => $image->chemin_fichier,
                'ordre_affichage' => $image->ordre_affichage,
                'created_at' => $image->created_at,
                'property' => $image->property ? [
                    'id' => $image->property->id,
                    'type_propriete' => $image->property->type_propriete,
                    'ville' => $image->property->ville,
                ] : null,
                
                // File existence checks
                'storage_file_exists' => file_exists($storagePath),
                'public_file_exists' => file_exists($publicPath),
                'file_size' => file_exists($storagePath) ? filesize($storagePath) : 0,
                'mime_type' => file_exists($storagePath) ? mime_content_type($storagePath) : null,
                
                // URL generation
                'asset_url' => asset('storage/' . $image->chemin_fichier),
                'storage_url' => \Storage::disk('public')->url($image->chemin_fichier),
                'model_url' => $image->url,
                
                // Storage facade test
                'exists_via_storage_facade' => \Storage::disk('public')->exists($image->chemin_fichier),
            ];
            
            $diagnosticData['sample_images'][] = $imageData;
        }
        
        // Test if sample image exists via Storage facade
        $diagnosticData['sample_image_exists_via_storage'] = !empty($diagnosticData['sample_images']) 
            ? $diagnosticData['sample_images'][0]['exists_via_storage_facade']
            : false;
        
        // Count images with accessible files
        $diagnosticData['images_with_accessible_files'] = count(array_filter(
            $diagnosticData['sample_images'], 
            fn($img) => $img['storage_file_exists'] || $img['public_file_exists']
        ));
        
        return \Inertia\Inertia::render('PropertyImagesDiagnostic', [
            'diagnosticData' => $diagnosticData
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
})->middleware('auth')->name('diagnostic.property.images');
