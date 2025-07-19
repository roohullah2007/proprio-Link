@echo off
echo ==========================================
echo EMERGENCY FIX: MANUAL STORAGE SETUP
echo ==========================================
echo.

echo The symlink approach isn't working. Let's fix this manually.
echo.

echo Step 1: Force remove any existing storage link/file...
if exist "public\storage" (
    attrib -r -s -h "public\storage" 2>nul
    del /f /q "public\storage" 2>nul
    rmdir /s /q "public\storage" 2>nul
    echo ✓ Removed existing storage
)

echo.
echo Step 2: Clear all caches...
php artisan route:clear
php artisan config:clear
php artisan view:clear
echo ✓ Caches cleared

echo.
echo Step 3: Try artisan storage link...
php artisan storage:link
if %ERRORLEVEL% EQU 0 (
    echo ✓ Artisan storage link created
) else (
    echo ⚠ Artisan failed, trying manual approach...
)

echo.
echo Step 4: Manual verification and copy approach...
if not exist "public\storage" (
    echo Creating storage directory manually...
    mkdir "public\storage"
    mkdir "public\storage\profile-images"
    
    echo Copying images to public directory...
    copy "storage\app\public\profile-images\*.*" "public\storage\profile-images\" 2>nul
    
    if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
        echo ✓ Image copied to public directory
    ) else (
        echo ⚠ Image copy failed
    )
)

echo.
echo Step 5: Test access...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image accessible at: public\storage\profile-images\profile_9_1751843309.jpg
    echo ✓ URL should work: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
) else (
    echo ✗ Image still not accessible
)

echo.
echo ==========================================
echo MANUAL FIX COMPLETE
echo ==========================================
echo.
echo Now try accessing your profile page.
echo The image should display correctly.
echo.
pause
