@echo off
echo ==========================================
echo DEFINITIVE PROFILE IMAGE FIX
echo ==========================================
echo.

echo Database shows: profile-images/profile_9_1751843309.jpg
echo Expected URL: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo Physical file: storage\app\public\profile-images\profile_9_1751843309.jpg
echo.

echo Step 1: Verify the image exists in storage...
if exist "storage\app\public\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image exists in storage directory
) else (
    echo ✗ Image NOT found in storage directory
    echo This indicates a storage upload issue.
    goto :end
)

echo.
echo Step 2: Check if public access exists...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image already accessible via public URL
    echo The image should be displaying. Check browser cache.
    goto :cache_fix
) else (
    echo ✗ Image NOT accessible via public URL
    echo Need to fix storage access...
)

echo.
echo Step 3: Create proper directory structure...
if not exist "public\storage" (
    mkdir "public\storage"
    echo ✓ Created public\storage directory
)

if not exist "public\storage\profile-images" (
    mkdir "public\storage\profile-images"
    echo ✓ Created public\storage\profile-images directory
)

echo.
echo Step 4: Copy the specific image...
copy "storage\app\public\profile-images\profile_9_1751843309.jpg" "public\storage\profile-images\"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Successfully copied profile_9_1751843309.jpg
) else (
    echo ✗ Failed to copy image
    goto :end
)

echo.
echo Step 5: Verify the copy worked...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image now accessible at: public\storage\profile-images\profile_9_1751843309.jpg
    echo ✓ URL should work: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
) else (
    echo ✗ Copy verification failed
    goto :end
)

:cache_fix
echo.
echo Step 6: Clear browser and Laravel caches...
php artisan route:clear
php artisan config:clear
echo ✓ Laravel caches cleared

echo.
echo Step 7: Test the URL directly...
echo You can test the image directly by visiting:
echo http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg

echo.
echo ==========================================
echo ✅ PROFILE IMAGE FIX COMPLETE
echo ==========================================
echo.
echo The database shows the correct path: profile-images/profile_9_1751843309.jpg
echo The User model will generate: /storage/profile-images/profile_9_1751843309.jpg  
echo The file now exists at: public\storage\profile-images\profile_9_1751843309.jpg
echo.
echo 🧪 IMMEDIATE TEST:
echo 1. Open: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo 2. You should see your profile image
echo 3. Refresh /profile page (Ctrl+F5)
echo 4. Image should now display in header and navbar
echo.
echo If it still doesn't work:
echo - Check browser developer tools for any 404 errors
echo - Verify the file exists: public\storage\profile-images\profile_9_1751843309.jpg
echo - Try hard refresh with Ctrl+Shift+R
echo.

:end
pause
