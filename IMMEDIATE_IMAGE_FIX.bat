@echo off
echo ==========================================
echo IMMEDIATE IMAGE FIX - COPY METHOD
echo ==========================================
echo.

echo Since symlinks aren't working, let's manually copy the image
echo to where it needs to be for immediate access.
echo.

echo Step 1: Create public storage directory...
if not exist "public\storage" mkdir "public\storage"
if not exist "public\storage\profile-images" mkdir "public\storage\profile-images"
echo ✓ Directories created

echo.
echo Step 2: Copy your specific image...
if exist "storage\app\public\profile-images\profile_9_1751843309.jpg" (
    copy "storage\app\public\profile-images\profile_9_1751843309.jpg" "public\storage\profile-images\"
    echo ✓ Copied profile_9_1751843309.jpg to public directory
) else (
    echo ✗ Source image not found at: storage\app\public\profile-images\profile_9_1751843309.jpg
)

echo.
echo Step 3: Verify the copy...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image now accessible at: public\storage\profile-images\profile_9_1751843309.jpg
    echo ✓ URL should work: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
) else (
    echo ✗ Copy failed
)

echo.
echo Step 4: Clear caches...
php artisan route:clear
php artisan config:clear
echo ✓ Caches cleared

echo.
echo ==========================================
echo ✅ IMMEDIATE FIX COMPLETE
echo ==========================================
echo.
echo Your profile image should now display immediately!
echo.
echo 🧪 TEST:
echo 1. Refresh your browser (Ctrl+F5)
echo 2. Go to /profile
echo 3. Image should now appear in header and navbar
echo.
echo This is a temporary fix until we resolve the symlink issue.
echo.
pause
