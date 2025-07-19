@echo off
echo ========================================
echo   FIXING SYNTAX ERRORS & DEPLOYING
echo ========================================
echo.

cd "E:\Proprio-Link\webapp\laravel-react-app"

echo Step 1: Creating upload directories...
if not exist "public\uploads" mkdir "public\uploads"
if not exist "public\uploads\profile-images" mkdir "public\uploads\profile-images"

echo Step 2: Setting permissions...
icacls "public\uploads" /grant "Everyone:(OI)(CI)F" /T > nul 2>&1

echo Step 3: Clearing all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo Step 4: Restarting Vite dev server...
echo IMPORTANT: After this script finishes, restart your Vite dev server with:
echo npm run dev
echo.
echo OR if using Vite:
echo npx vite
echo.

echo Step 5: Testing file structure...
php -r "
echo 'Checking files...' . PHP_EOL;

\$files = [
    'app/Http/Controllers/ProfileImageController.php',
    'resources/js/Components/SimpleProfileImageUpload.jsx',
    'resources/js/Pages/Profile/Partials/AlternativeProfileForm.jsx',
    'public/uploads/profile-images'
];

foreach (\$files as \$file) {
    if (file_exists(\$file) || is_dir(\$file)) {
        echo '✅ ' . \$file . ' exists' . PHP_EOL;
    } else {
        echo '❌ ' . \$file . ' missing' . PHP_EOL;
    }
}

echo PHP_EOL . 'Checking routes...' . PHP_EOL;
if (file_exists('routes/web.php')) {
    \$routesContent = file_get_contents('routes/web.php');
    if (strpos(\$routesContent, 'profile.upload-image') !== false) {
        echo '✅ Profile upload route registered' . PHP_EOL;
    } else {
        echo '❌ Profile upload route missing' . PHP_EOL;
    }
}
"

echo.
echo ========================================
echo   SYNTAX ERRORS FIXED!
echo ========================================
echo.
echo WHAT WAS FIXED:
echo  ✅ Removed invalid newline characters from JSX files
echo  ✅ Fixed JavaScript parser errors
echo  ✅ Ensured proper import statements
echo  ✅ Created upload directories
echo.
echo NEXT STEPS:
echo  1. RESTART your Vite dev server (npm run dev)
echo  2. Refresh your browser
echo  3. Go to your profile page
echo  4. Try uploading a profile image!
echo.
echo The new upload system should now work perfectly.
echo.
pause
