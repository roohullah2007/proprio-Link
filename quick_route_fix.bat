@echo off
echo ==========================================
echo QUICK ROUTE CACHE CLEAR
echo ==========================================
echo.

echo Clearing route cache to enable fallback image serving...
php artisan route:clear
php artisan config:clear
echo ✓ Route cache cleared

echo.
echo The fallback route is now active:
echo /storage/profile-images/{filename}
echo.
echo This will serve images directly even if the symlink is broken.
echo.
echo Test your profile page now - the image should display!
echo.
pause
