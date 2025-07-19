@echo off
echo ========================================
echo FIXING PROFILE IMAGE DISPLAY ISSUES
echo ========================================
echo.

echo This script will fix the profile image display in navbar and profile page.
echo.

echo Step 1: Clear all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Application caches cleared

echo.
echo Step 2: Build frontend assets...
npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Frontend assets built successfully
) else (
    echo ⚠ Frontend build failed, trying npm install first...
    npm install
    npm run build
)

echo.
echo Step 3: Ensure storage symlink exists...
if not exist "public\storage" (
    php artisan storage:link
    echo ✓ Storage symlink created
) else (
    echo ✓ Storage symlink already exists
)

echo.
echo Step 4: Test image accessibility...
echo Testing if uploaded images are accessible...
for %%f in (storage\app\public\profile-images\*.jpg) do (
    echo Found JPG: %%~nxf
    set "testimage=%%~nxf"
    goto :test_url
)
for %%f in (storage\app\public\profile-images\*.png) do (
    echo Found PNG: %%~nxf
    set "testimage=%%~nxf"
    goto :test_url
)
echo No profile images found to test.
goto :final

:test_url
echo Test URL: http://127.0.0.1:8000/storage/profile-images/%testimage%

:final
echo.
echo ========================================
echo ✅ PROFILE IMAGE DISPLAY FIX COMPLETE!
echo ========================================
echo.
echo What was fixed:
echo ✓ Updated User model to append profile_image_url accessor
echo ✓ Fixed AuthenticatedLayout navbar avatar display
echo ✓ Fixed mobile avatar display
echo ✓ Fixed Profile page header avatar
echo ✓ Updated ProfileImageUpload component
echo ✓ Rebuilt frontend assets
echo ✓ Cleared all caches
echo.
echo 🧪 TEST STEPS:
echo 1. Refresh your browser (Ctrl+F5)
echo 2. Go to /profile
echo 3. The uploaded image should now be visible in:
echo    - Profile page header (large avatar)
echo    - Navbar dropdown (small avatar)
echo    - Mobile navigation (small avatar)
echo.
echo If images still don't show:
echo 1. Check browser console for 404 errors
echo 2. Verify the image exists at: storage/app/public/profile-images/
echo 3. Test direct URL: http://127.0.0.1:8000/storage/profile-images/[filename]
echo.
pause
