@echo off
echo =========================================
echo    PROPERTY IMAGES DIAGNOSTIC TOOL
echo =========================================
echo.

echo Checking why property images aren't showing...
echo.

echo 1. Testing storage symlink...
if exist "public\storage" (
    echo    ✓ Storage symlink exists
    if exist "public\storage\properties" (
        echo    ✓ Properties folder accessible via symlink
    ) else (
        echo    ✗ Properties folder NOT accessible via symlink
    )
) else (
    echo    ✗ Storage symlink missing
)

echo.
echo 2. Checking actual property image files...
php -r "
try {
    \$properties = \App\Models\Property::with('images')->take(3)->get();
    echo 'Found ' . \$properties->count() . ' properties to check' . PHP_EOL;
    
    foreach (\$properties as \$property) {
        echo PHP_EOL . 'Property ID: ' . \$property->id . PHP_EOL;
        echo 'Images count: ' . \$property->images->count() . PHP_EOL;
        
        foreach (\$property->images->take(2) as \$image) {
            echo '  Image ID: ' . \$image->id . PHP_EOL;
            echo '  Path: ' . \$image->chemin_fichier . PHP_EOL;
            
            \$storagePath = storage_path('app/public/' . \$image->chemin_fichier);
            \$publicPath = public_path('storage/' . \$image->chemin_fichier);
            
            echo '  Storage file exists: ' . (file_exists(\$storagePath) ? 'YES' : 'NO') . PHP_EOL;
            echo '  Public file exists: ' . (file_exists(\$publicPath) ? 'YES' : 'NO') . PHP_EOL;
            echo '  Storage URL: ' . asset('storage/' . \$image->chemin_fichier) . PHP_EOL;
            echo '  File size: ' . (file_exists(\$storagePath) ? filesize(\$storagePath) . ' bytes' : '0 bytes') . PHP_EOL;
            echo '  ---' . PHP_EOL;
        }
    }
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 3. Checking profile images (working) vs property images...
php -r "
try {
    echo 'Profile images folder: ';
    if (file_exists(public_path('storage/profile-images'))) {
        echo 'EXISTS' . PHP_EOL;
        \$profileFiles = glob(public_path('storage/profile-images/*'));
        echo 'Profile files count: ' . count(\$profileFiles) . PHP_EOL;
    } else {
        echo 'MISSING' . PHP_EOL;
    }
    
    echo 'Properties folder: ';
    if (file_exists(public_path('storage/properties'))) {
        echo 'EXISTS' . PHP_EOL;
        \$propertyDirs = glob(public_path('storage/properties/*'), GLOB_ONLYDIR);
        echo 'Property directories count: ' . count(\$propertyDirs) . PHP_EOL;
        
        if (count(\$propertyDirs) > 0) {
            \$firstDir = \$propertyDirs[0];
            \$files = glob(\$firstDir . '/*');
            echo 'Files in first property dir: ' . count(\$files) . PHP_EOL;
            if (count(\$files) > 0) {
                echo 'Sample file: ' . basename(\$files[0]) . PHP_EOL;
            }
        }
    } else {
        echo 'MISSING' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 4. Testing image URLs in browser...
php -r "
try {
    \$property = \App\Models\Property::with('images')->first();
    if (\$property && \$property->images->count() > 0) {
        \$image = \$property->images->first();
        echo 'Test this URL in your browser:' . PHP_EOL;
        echo asset('storage/' . \$image->chemin_fichier) . PHP_EOL;
        echo PHP_EOL;
        echo 'Alternative test URLs:' . PHP_EOL;
        echo '/images/' . \$image->chemin_fichier . PHP_EOL;
        echo '/storage/' . \$image->chemin_fichier . PHP_EOL;
    } else {
        echo 'No properties with images found' . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo =========================================
echo    DIAGNOSIS COMPLETE
echo =========================================
pause
