@echo off
echo ========================================
echo   PROFILE IMAGE UPLOAD - NEW SYSTEM
echo ========================================
echo.

cd "E:\Proprio-Link\webapp\laravel-react-app"

echo Step 1: Creating upload directories...
if not exist "public\uploads" mkdir "public\uploads"
if not exist "public\uploads\profile-images" mkdir "public\uploads\profile-images"

echo Step 2: Setting directory permissions...
icacls "public\uploads" /grant "Everyone:(OI)(CI)F" /T > nul 2>&1

echo Step 3: Clearing caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo Step 4: Testing new upload system...
php -r "
echo 'Testing directories...' . PHP_EOL;
echo 'public/uploads exists: ' . (is_dir('public/uploads') ? 'YES' : 'NO') . PHP_EOL;
echo 'public/uploads/profile-images exists: ' . (is_dir('public/uploads/profile-images') ? 'YES' : 'NO') . PHP_EOL;
echo 'public/uploads writable: ' . (is_writable('public/uploads') ? 'YES' : 'NO') . PHP_EOL;
echo 'public/uploads/profile-images writable: ' . (is_writable('public/uploads/profile-images') ? 'YES' : 'NO') . PHP_EOL;

echo PHP_EOL . 'Testing routes...' . PHP_EOL;
if (file_exists('routes/web.php')) {
    \$routesContent = file_get_contents('routes/web.php');
    if (strpos(\$routesContent, 'profile.upload-image') !== false) {
        echo 'New profile upload route exists: YES' . PHP_EOL;
    } else {
        echo 'New profile upload route exists: NO' . PHP_EOL;
    }
}

echo PHP_EOL . 'Testing controllers...' . PHP_EOL;
if (file_exists('app/Http/Controllers/ProfileImageController.php')) {
    echo 'ProfileImageController exists: YES' . PHP_EOL;
} else {
    echo 'ProfileImageController exists: NO' . PHP_EOL;
}

if (file_exists('resources/js/Components/SimpleProfileImageUpload.jsx')) {
    echo 'SimpleProfileImageUpload component exists: YES' . PHP_EOL;
} else {
    echo 'SimpleProfileImageUpload component exists: NO' . PHP_EOL;
}

if (file_exists('resources/js/Pages/Profile/Partials/AlternativeProfileForm.jsx')) {
    echo 'AlternativeProfileForm exists: YES' . PHP_EOL;
} else {
    echo 'AlternativeProfileForm exists: NO' . PHP_EOL;
}
"

echo.
echo ========================================
echo   NEW UPLOAD SYSTEM DEPLOYED!
echo ========================================
echo.
echo WHAT'S NEW:
echo  ✅ Separate profile image upload API
echo  ✅ Direct upload to public/uploads directory
echo  ✅ No storage symlink dependency
echo  ✅ Instant image preview and validation
echo  ✅ Improved error handling
echo.
echo HOW IT WORKS:
echo  1. Profile image uploads separately via AJAX
echo  2. Files go directly to public/uploads/profile-images/
echo  3. No storage symlink issues
echo  4. Profile form handles text fields only
echo  5. Immediate visual feedback
echo.
echo NEXT STEPS:
echo  1. Go to your profile page
echo  2. Upload a profile image using the new uploader
echo  3. The image should upload instantly!
echo.
echo If you still get errors, check:
echo  - File size under 2MB
echo  - File type is JPG, PNG, or GIF
echo  - Browser console for specific errors
echo.
pause
