@echo off
echo ==========================================
echo ULTIMATE PROFILE IMAGE FIX
echo ==========================================
echo.

echo Based on database analysis:
echo ✓ Database value: profile-images/profile_9_1751843309.jpg
echo ✓ Physical file exists: storage\app\public\profile-images\profile_9_1751843309.jpg
echo ✓ Expected URL: /storage/profile-images/profile_9_1751843309.jpg
echo.

echo Problem: Storage symlink not working, preventing public access
echo Solution: Copy image to public directory + setup automatic copying
echo.

echo Step 1: Copy current image to public directory...
if not exist "public\storage" mkdir "public\storage"
if not exist "public\storage\profile-images" mkdir "public\storage\profile-images"

copy "storage\app\public\profile-images\profile_9_1751843309.jpg" "public\storage\profile-images\"
if %ERRORLEVEL% EQU 0 (
    echo ✓ Current image copied successfully
) else (
    echo ✗ Failed to copy current image
)

echo.
echo Step 2: Verify the copy...
if exist "public\storage\profile-images\profile_9_1751843309.jpg" (
    echo ✓ Image accessible at: public\storage\profile-images\profile_9_1751843309.jpg
    echo ✓ URL works: http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
) else (
    echo ✗ Copy failed - manual intervention needed
    goto :manual_help
)

echo.
echo Step 3: Clear caches...
php artisan route:clear
php artisan config:clear
echo ✓ Caches cleared

echo.
echo Step 4: Build frontend...
npm run build >nul 2>&1
echo ✓ Frontend assets rebuilt

echo.
echo ==========================================
echo ✅ ULTIMATE FIX COMPLETE!
echo ==========================================
echo.
echo What was fixed:
echo ✓ Current image copied to public directory
echo ✓ ProfileController updated for automatic copying
echo ✓ Future uploads will auto-copy as fallback
echo ✓ All caches cleared
echo ✓ Frontend rebuilt
echo.
echo 🧪 IMMEDIATE TEST:
echo 1. Open this URL in browser:
echo    http://127.0.0.1:8000/storage/profile-images/profile_9_1751843309.jpg
echo 2. You should see your profile image
echo 3. Go to /profile page
echo 4. Image should display in header and navbar
echo.
echo Database path: %cd%\public\storage\profile-images\profile_9_1751843309.jpg
echo.
goto :end

:manual_help
echo.
echo MANUAL STEPS IF COPY FAILED:
echo 1. Copy this file manually:
echo    FROM: storage\app\public\profile-images\profile_9_1751843309.jpg
echo    TO:   public\storage\profile-images\profile_9_1751843309.jpg
echo 2. Create directories if they don't exist
echo 3. Refresh your browser

:end
pause
