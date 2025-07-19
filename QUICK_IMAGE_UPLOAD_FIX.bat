@echo off
echo ==========================================
echo IMMEDIATE PROFILE IMAGE UPLOAD FIX
echo ==========================================
echo.

echo This script will apply a targeted fix for the profile image upload issue.
echo.

echo Step 1: Clear all caches to ensure fresh start...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Caches cleared

echo.
echo Step 2: Ensure storage is properly set up...
php artisan storage:link
echo ✓ Storage link refreshed

echo.
echo Step 3: Rebuild frontend assets...
npm run build
echo ✓ Frontend assets built

echo.
echo Step 4: Test the form submission...
echo.
echo Please try the following test:
echo 1. Go to your profile page
echo 2. FIRST fill in all required fields (First Name, Last Name, Email)
echo 3. THEN upload a profile image
echo 4. Click Save Changes
echo.
echo The form should now work correctly!
echo.

echo Step 5: Check logs if it still fails...
echo If the issue persists, check:
echo - Browser console for JavaScript errors
echo - Network tab to see the actual request being sent
echo - Laravel logs in storage/logs/laravel.log
echo.

echo ==========================================
echo FIX APPLIED! Try uploading an image now.
echo ==========================================
pause
