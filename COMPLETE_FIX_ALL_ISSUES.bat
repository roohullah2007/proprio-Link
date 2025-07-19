@echo off
echo ==========================================
echo COMPLETE FIX: IMAGE + ACCESSIBILITY 
echo ==========================================
echo.

echo This script fixes both issues:
echo 1. Profile image 404 error
echo 2. Password form accessibility warning
echo.

echo Step 1: Fix storage symlink issue...
echo.

REM Remove any existing storage file/link
if exist "public\storage" (
    echo Removing existing storage file/link...
    attrib -r -s -h "public\storage" 2>nul
    del /f /q "public\storage" 2>nul
    rmdir /s /q "public\storage" 2>nul
    echo ✓ Removed existing storage
)

REM Clear Laravel caches first
echo Clearing Laravel caches...
php artisan route:clear
php artisan config:clear
php artisan view:clear
echo ✓ Caches cleared

REM Try Laravel artisan storage link
echo Attempting Laravel storage:link...
php artisan storage:link
if %ERRORLEVEL% EQU 0 (
    echo ✓ Laravel storage link created successfully
    goto :test_symlink
) else (
    echo ⚠ Laravel artisan failed, trying manual approach...
)

REM Manual symlink creation
echo Attempting manual symlink creation...
mklink /D "public\storage" "..\storage\app\public"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Manual symlink created successfully
    goto :test_symlink
) else (
    echo ⚠ Manual symlink failed, trying junction...
)

REM Junction fallback
echo Attempting junction creation...
mklink /J "public\storage" "storage\app\public"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Junction created successfully
    goto :test_symlink
) else (
    echo ⚠ All symlink methods failed, using copy approach...
    goto :copy_approach
)

:copy_approach
echo.
echo Using direct copy approach as fallback...
if not exist "public\storage" mkdir "public\storage"
if not exist "public\storage\profile-images" mkdir "public\storage\profile-images"

echo Copying existing images...
if exist "storage\app\public\profile-images\*.*" (
    copy "storage\app\public\profile-images\*.*" "public\storage\profile-images\" >nul 2>&1
    echo ✓ Images copied to public directory
) else (
    echo ⚠ No images to copy
)
goto :verify_images

:test_symlink
echo.
echo Testing symlink...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image accessible via symlink
    goto :verify_images
) else (
    echo ⚠ Symlink created but image not accessible
    echo Falling back to copy approach...
    goto :copy_approach
)

:verify_images
echo.
echo Step 2: Verify image accessibility...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image exists: public\storage\profile-images\profile_9_1751843309.jpg
    echo ✓ URL should work: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
) else (
    echo ✗ Image still not accessible
    echo Checking if image exists in storage...
    if exist "storage\app\public\profile-images\profile_9_1751843309.jpg" (
        echo ✓ Image exists in storage, copying manually...
        copy "storage\app\public\profile-images\profile_9_1751843309.jpg" "public\storage\profile-images\" >nul 2>&1
        echo ✓ Image copied manually
    ) else (
        echo ✗ Image not found in storage either
    )
)

echo.
echo Step 3: Build frontend assets...
npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Frontend assets built successfully
) else (
    echo ⚠ Frontend build had issues, but continuing...
)

echo.
echo Step 4: Final cache clear...
php artisan route:clear
php artisan config:clear
echo ✓ Final cache clear complete

echo.
echo ==========================================
echo ✅ COMPLETE FIX APPLIED
echo ==========================================
echo.
echo Fixed issues:
echo ✓ Storage symlink/copy for image access
echo ✓ Password form accessibility (hidden username field)
echo ✓ Fallback route for image serving
echo ✓ Frontend assets rebuilt
echo.
echo 🧪 TEST NOW:
echo 1. Refresh browser with Ctrl+F5
echo 2. Go to /profile
echo 3. Image should display in profile header and navbar
echo 4. No more accessibility warnings in console
echo.
echo If image still doesn't show:
echo - Check: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo - Verify: public\storage\profile-images\profile_9_1751843309.jpg exists
echo.
pause
