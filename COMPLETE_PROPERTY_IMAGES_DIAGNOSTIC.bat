@echo off
echo =========================================
echo    COMPLETE PROPERTY IMAGES DIAGNOSTIC
echo =========================================
echo.

echo Checking property images from database AND file system...
echo.

echo 1. DATABASE ANALYSIS - Property Images Table
echo ==========================================
php -r "
try {
    echo 'Property Images in Database:' . PHP_EOL;
    echo '=============================' . PHP_EOL;
    
    \$images = \App\Models\PropertyImage::with('property')->take(10)->get();
    echo 'Total property images in DB: ' . \App\Models\PropertyImage::count() . PHP_EOL;
    echo 'Showing first 10 records:' . PHP_EOL . PHP_EOL;
    
    foreach (\$images as \$image) {
        echo 'IMAGE ID: ' . \$image->id . PHP_EOL;
        echo '  Property ID: ' . \$image->property_id . PHP_EOL;
        echo '  Property Type: ' . (\$image->property ? \$image->property->type_propriete : 'N/A') . PHP_EOL;
        echo '  Property City: ' . (\$image->property ? \$image->property->ville : 'N/A') . PHP_EOL;
        echo '  nom_fichier: ' . \$image->nom_fichier . PHP_EOL;
        echo '  chemin_fichier: ' . \$image->chemin_fichier . PHP_EOL;
        echo '  ordre_affichage: ' . \$image->ordre_affichage . PHP_EOL;
        echo '  created_at: ' . \$image->created_at . PHP_EOL;
        echo '  ---------------' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'Database Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 2. FILE SYSTEM ANALYSIS - Storage Directory
echo ===========================================
php -r "
try {
    echo 'File System Analysis:' . PHP_EOL;
    echo '===================' . PHP_EOL;
    
    \$storagePath = storage_path('app/public');
    \$publicPath = public_path('storage');
    
    echo 'Storage path: ' . \$storagePath . PHP_EOL;
    echo 'Public path: ' . \$publicPath . PHP_EOL;
    echo 'Storage exists: ' . (file_exists(\$storagePath) ? 'YES' : 'NO') . PHP_EOL;
    echo 'Public exists: ' . (file_exists(\$publicPath) ? 'YES' : 'NO') . PHP_EOL;
    echo 'Public is symlink: ' . (is_link(\$publicPath) ? 'YES' : 'NO') . PHP_EOL;
    
    if (is_link(\$publicPath)) {
        echo 'Symlink target: ' . readlink(\$publicPath) . PHP_EOL;
    }
    
    echo PHP_EOL . 'Properties folder structure:' . PHP_EOL;
    \$propertiesPath = \$storagePath . '/properties';
    if (file_exists(\$propertiesPath)) {
        echo 'Properties folder exists: YES' . PHP_EOL;
        \$dirs = glob(\$propertiesPath . '/*', GLOB_ONLYDIR);
        echo 'Property UUID directories: ' . count(\$dirs) . PHP_EOL;
        
        if (count(\$dirs) > 0) {
            echo 'First 5 property directories:' . PHP_EOL;
            foreach (array_slice(\$dirs, 0, 5) as \$dir) {
                \$uuid = basename(\$dir);
                \$files = glob(\$dir . '/*');
                echo '  ' . \$uuid . ' (' . count(\$files) . ' files)' . PHP_EOL;
                
                if (count(\$files) > 0) {
                    foreach (array_slice(\$files, 0, 2) as \$file) {
                        \$filename = basename(\$file);
                        \$size = filesize(\$file);
                        echo '    - ' . \$filename . ' (' . \$size . ' bytes)' . PHP_EOL;
                    }
                }
            }
        }
    } else {
        echo 'Properties folder exists: NO' . PHP_EOL;
    }
    
} catch (Exception \$e) {
    echo 'File System Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 3. CROSS-REFERENCE - DB vs File System
echo =======================================
php -r "
try {
    echo 'Cross-referencing database records with actual files:' . PHP_EOL;
    echo '====================================================' . PHP_EOL;
    
    \$images = \App\Models\PropertyImage::take(5)->get();
    
    foreach (\$images as \$image) {
        echo 'IMAGE: ' . \$image->id . PHP_EOL;
        echo '  DB Path: ' . \$image->chemin_fichier . PHP_EOL;
        
        \$storagePath = storage_path('app/public/' . \$image->chemin_fichier);
        \$publicPath = public_path('storage/' . \$image->chemin_fichier);
        
        echo '  Storage file exists: ' . (file_exists(\$storagePath) ? 'YES' : 'NO') . PHP_EOL;
        echo '  Public file exists: ' . (file_exists(\$publicPath) ? 'YES' : 'NO') . PHP_EOL;
        echo '  Storage path: ' . \$storagePath . PHP_EOL;
        echo '  Public path: ' . \$publicPath . PHP_EOL;
        
        if (file_exists(\$storagePath)) {
            echo '  File size: ' . filesize(\$storagePath) . ' bytes' . PHP_EOL;
            echo '  File type: ' . mime_content_type(\$storagePath) . PHP_EOL;
        }
        
        // Test URL generation
        echo '  Asset URL: ' . asset('storage/' . \$image->chemin_fichier) . PHP_EOL;
        echo '  Model URL: ' . \$image->url . PHP_EOL;
        echo '  ---------------' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'Cross-reference Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 4. PROFILE IMAGES COMPARISON (Working)
echo =====================================
php -r "
try {
    echo 'Profile Images Analysis (for comparison):' . PHP_EOL;
    echo '=======================================' . PHP_EOL;
    
    \$profilePath = storage_path('app/public/profile-images');
    \$publicProfilePath = public_path('storage/profile-images');
    
    echo 'Profile storage exists: ' . (file_exists(\$profilePath) ? 'YES' : 'NO') . PHP_EOL;
    echo 'Profile public exists: ' . (file_exists(\$publicProfilePath) ? 'YES' : 'NO') . PHP_EOL;
    
    if (file_exists(\$profilePath)) {
        \$files = glob(\$profilePath . '/*');
        echo 'Profile files count: ' . count(\$files) . PHP_EOL;
        
        if (count(\$files) > 0) {
            \$sampleFile = \$files[0];
            \$filename = basename(\$sampleFile);
            echo 'Sample profile file: ' . \$filename . PHP_EOL;
            echo 'Sample URL would be: ' . asset('storage/profile-images/' . \$filename) . PHP_EOL;
        }
    }
} catch (Exception \$e) {
    echo 'Profile comparison Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 5. LARAVEL STORAGE CONFIGURATION
echo ================================
php -r "
try {
    echo 'Laravel Storage Configuration:' . PHP_EOL;
    echo '=============================' . PHP_EOL;
    
    echo 'Default disk: ' . config('filesystems.default') . PHP_EOL;
    echo 'Public disk root: ' . config('filesystems.disks.public.root') . PHP_EOL;
    echo 'Public disk URL: ' . config('filesystems.disks.public.url') . PHP_EOL;
    
    // Test Storage facade
    echo 'Storage::disk(\"public\") works: ' . (\Storage::disk('public')->exists('') ? 'YES' : 'NO') . PHP_EOL;
    
    // Test a sample property image if exists
    \$image = \App\Models\PropertyImage::first();
    if (\$image) {
        echo 'Sample image storage exists: ' . (\Storage::disk('public')->exists(\$image->chemin_fichier) ? 'YES' : 'NO') . PHP_EOL;
        echo 'Sample image URL: ' . \Storage::disk('public')->url(\$image->chemin_fichier) . PHP_EOL;
    }
    
} catch (Exception \$e) {
    echo 'Configuration Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 6. RECOMMENDED TEST URLS
echo =======================
php -r "
try {
    echo 'Test these URLs in your browser:' . PHP_EOL;
    echo '===============================' . PHP_EOL;
    
    \$image = \App\Models\PropertyImage::first();
    if (\$image) {
        \$baseUrl = rtrim(config('app.url'), '/');
        if (empty(\$baseUrl)) \$baseUrl = 'http://localhost:8000';
        
        echo '1. Storage URL: ' . \$baseUrl . '/storage/' . \$image->chemin_fichier . PHP_EOL;
        echo '2. Images URL: ' . \$baseUrl . '/images/' . \$image->chemin_fichier . PHP_EOL;
        echo '3. Asset URL: ' . asset('storage/' . \$image->chemin_fichier) . PHP_EOL;
        echo '4. Direct file: ' . storage_path('app/public/' . \$image->chemin_fichier) . PHP_EOL;
    } else {
        echo 'No property images found in database to test.' . PHP_EOL;
    }
    
} catch (Exception \$e) {
    echo 'URL generation Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo =========================================
echo    DIAGNOSTIC COMPLETE
echo =========================================
echo.
echo Check the output above to see:
echo 1. What property images are in the database
echo 2. What files actually exist in storage
echo 3. Whether database paths match file paths
echo 4. How URLs are being generated
echo 5. Differences between working profile images and broken property images
echo.
pause
