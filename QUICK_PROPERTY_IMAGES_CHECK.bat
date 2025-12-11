@echo off
echo =========================================
echo    QUICK PROPERTY IMAGES ANALYSIS
echo =========================================
echo.

echo Please run this script and share the output with me!
echo.

echo 1. QUICK DATABASE CHECK
echo =======================
php -r "
echo 'Property Images in Database:' . PHP_EOL;
\$count = \App\Models\PropertyImage::count();
echo 'Total: ' . \$count . PHP_EOL;

if (\$count > 0) {
    \$sample = \App\Models\PropertyImage::with('property')->first();
    echo 'Sample Image:' . PHP_EOL;
    echo '  ID: ' . \$sample->id . PHP_EOL;
    echo '  Property ID: ' . \$sample->property_id . PHP_EOL;
    echo '  File Path: ' . \$sample->chemin_fichier . PHP_EOL;
    echo '  File Name: ' . \$sample->nom_fichier . PHP_EOL;
    
    if (\$sample->property) {
        echo '  Property Type: ' . \$sample->property->type_propriete . PHP_EOL;
        echo '  Property City: ' . \$sample->property->ville . PHP_EOL;
    }
}
"

echo.
echo 2. QUICK FILE SYSTEM CHECK
echo ===========================
if exist "storage\app\public\properties" (
    echo ✓ Properties storage folder exists
    for /f %%i in ('dir "storage\app\public\properties" /ad /b ^| find /c /v ""') do echo   Property UUID folders: %%i
) else (
    echo ✗ Properties storage folder missing
)

if exist "public\storage" (
    echo ✓ Public storage symlink exists
    if exist "public\storage\properties" (
        echo ✓ Properties accessible via public symlink
    ) else (
        echo ✗ Properties NOT accessible via public symlink
    )
) else (
    echo ✗ Public storage symlink missing
)

echo.
echo 3. QUICK URL TEST
echo =================
php -r "
\$image = \App\Models\PropertyImage::first();
if (\$image) {
    \$url = '/storage/' . \$image->chemin_fichier;
    echo 'Test this URL in your browser:' . PHP_EOL;
    echo config('app.url') . \$url . PHP_EOL;
    echo PHP_EOL;
    echo 'Expected file location:' . PHP_EOL;
    echo storage_path('app/public/' . \$image->chemin_fichier) . PHP_EOL;
    echo 'File exists: ' . (file_exists(storage_path('app/public/' . \$image->chemin_fichier)) ? 'YES' : 'NO') . PHP_EOL;
} else {
    echo 'No property images found to test' . PHP_EOL;
}
"

echo.
echo =========================================
echo    ANALYSIS COMPLETE
echo =========================================
echo.
echo Please copy ALL the output above and send it to me!
echo This will help identify the exact issue with your property images.
echo.
pause
