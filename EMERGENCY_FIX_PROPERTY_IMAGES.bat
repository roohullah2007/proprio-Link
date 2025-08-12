@echo off
echo =========================================
echo    EMERGENCY PROPERTY IMAGES FIX
echo =========================================
echo.

echo Profile images work but property images don't - fixing now...
echo.

echo 1. Recreating storage symlink...
if exist "public\storage" (
    echo Removing existing symlink...
    rmdir "public\storage" /S /Q
)

echo Creating fresh symlink...
mklink /D "public\storage" "storage\app\public"

echo.
echo 2. Checking if properties folder exists in storage...
if not exist "storage\app\public\properties" (
    echo Creating properties folder...
    mkdir "storage\app\public\properties"
)

echo.
echo 3. Creating test image route...
php -r "
try {
    // Create a simple test route file
    \$testRoute = '<?php
Route::get(\'/test-property-image\', function () {
    \$property = \\App\\Models\\Property::with(\'images\')->first();
    if (!\$property || \$property->images->count() === 0) {
        return response()->json([\'error\' => \'No properties with images found\']);
    }
    
    \$image = \$property->images->first();
    \$imagePath = \$image->chemin_fichier;
    \$storagePath = storage_path(\'app/public/\' . \$imagePath);
    \$publicPath = public_path(\'storage/\' . \$imagePath);
    
    return response()->json([
        \'image_path\' => \$imagePath,
        \'storage_exists\' => file_exists(\$storagePath),
        \'public_exists\' => file_exists(\$publicPath),
        \'storage_url\' => asset(\'storage/\' . \$imagePath),
        \'storage_path\' => \$storagePath,
        \'public_path\' => \$publicPath,
        \'file_size\' => file_exists(\$storagePath) ? filesize(\$storagePath) : 0,
    ]);
});';
    file_put_contents('test_image_route.php', \$testRoute);
    echo 'Test route created: test_image_route.php' . PHP_EOL;
} catch (Exception \$e) {
    echo 'Error creating test route: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 4. Testing direct file access...
php -r "
try {
    \$property = \App\Models\Property::with('images')->first();
    if (\$property && \$property->images->count() > 0) {
        \$image = \$property->images->first();
        \$storagePath = storage_path('app/public/' . \$image->chemin_fichier);
        
        if (file_exists(\$storagePath)) {
            echo 'File exists in storage: ' . \$storagePath . PHP_EOL;
            echo 'File size: ' . filesize(\$storagePath) . ' bytes' . PHP_EOL;
            
            // Copy to public for testing
            \$publicTestPath = public_path('test-property-image.jpg');
            if (copy(\$storagePath, \$publicTestPath)) {
                echo 'Test image copied to: /test-property-image.jpg' . PHP_EOL;
                echo 'Test URL: ' . asset('test-property-image.jpg') . PHP_EOL;
            }
        } else {
            echo 'File does NOT exist in storage!' . PHP_EOL;
        }
    }
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 5. Force rebuild React components...
npm run build

echo.
echo 6. Clear all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo.
echo 7. Rebuild caches...
php artisan config:cache
php artisan route:cache

echo.
echo =========================================
echo    EMERGENCY FIX COMPLETE
echo =========================================
echo.
echo Next steps:
echo 1. Test the URL shown above in your browser
echo 2. Visit /test-property-image if created
echo 3. Check if property images now load
echo.
echo If still not working, run: DIAGNOSE_PROPERTY_IMAGES.bat
echo.
pause
