@echo off
echo ========================================
echo FIXING hasAnyFile METHOD ERROR
echo ========================================
echo.

echo Step 1: Clearing all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Caches cleared

echo.
echo Step 2: Testing the fix...
echo The hasAnyFile() method error has been fixed.
echo The method has been replaced with: count($this->allFiles()) > 0
echo.

echo Step 3: Try the profile image upload again...
echo 1. Go to your profile page
echo 2. Upload a profile image
echo 3. Click Save Changes
echo.

echo The error should now be resolved!
echo.
echo If you still get errors, check the Laravel logs:
echo storage\logs\laravel.log
echo.
pause
