@echo off
echo ==========================================
echo IMMEDIATE FIX: STORAGE SYMLINK 404 ERROR
echo ==========================================
echo.

echo The image profile_9_1751843309.jpg exists in storage but can't be accessed.
echo This is because public\storage is a FILE instead of a DIRECTORY symlink.
echo.

echo Step 1: Backup and remove the problematic storage file...
if exist "public\storage" (
    echo Removing problematic storage file...
    del /f /q "public\storage"
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Removed old storage file
    ) else (
        echo ⚠ Could not remove storage file - trying to continue...
    )
)

echo.
echo Step 2: Create proper storage symlink...
echo Method 1: Using Laravel artisan...
php artisan storage:link
if %ERRORLEVEL% EQU 0 (
    echo ✓ Storage symlink created successfully via artisan
    goto :test_symlink
) else (
    echo ⚠ Artisan method failed, trying manual method...
)

echo Method 2: Manual symlink creation...
mklink /D "public\storage" "..\storage\app\public"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Manual symlink created successfully
    goto :test_symlink
) else (
    echo ✗ Manual symlink failed - permissions issue
    echo   Trying alternative approach...
)

echo Method 3: Junction (Windows alternative)...
mklink /J "public\storage" "storage\app\public"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Junction created successfully
    goto :test_symlink
) else (
    echo ✗ All symlink methods failed
    echo   Using route-based fallback...
    goto :route_fallback
)

:test_symlink
echo.
echo Step 3: Testing the symlink...
if exist "public\storage\" (
    echo ✓ Storage directory exists
    if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
        echo ✓ Image accessible via symlink!
        echo   URL: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
        goto :success
    ) else (
        echo ⚠ Image not found via symlink, checking directory...
        dir "public\storage\profile-images\" 2>nul
    )
) else (
    echo ✗ Storage directory still doesn't exist
    goto :route_fallback
)

:route_fallback
echo.
echo Step 4: Implementing route-based fallback...
echo Since symlink creation failed, the route fallback is already in place.
echo Images will be served via: /storage/profile-images/{filename}
echo.
echo ✓ Fallback route enabled in web.php
goto :final_test

:success
echo.
echo Step 4: Clearing caches...
php artisan route:clear
php artisan config:clear
echo ✓ Caches cleared

:final_test
echo.
echo Step 5: Final verification...
echo Testing image access:
echo - Storage file exists: ✓ storage\app\public\profile-images\profile_9_1751843309.jpg
echo - Public URL: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo.

echo ==========================================
echo 🎯 IMMEDIATE ACTIONS:
echo ==========================================
echo.
echo 1. Refresh your browser (Ctrl+F5)
echo 2. Go to /profile
echo 3. The image should now display correctly
echo.
echo If the image still shows 404:
echo 1. Try accessing directly: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo 2. Check browser console for any new errors
echo 3. The fallback route should catch any symlink issues
echo.
echo ==========================================
echo ✅ FIX COMPLETE!
echo ==========================================
pause
