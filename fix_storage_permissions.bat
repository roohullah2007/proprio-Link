@echo off
echo Fixing Storage Symlink and Permissions...
echo.

echo 1. Clearing config cache...
php artisan config:clear

echo 2. Creating storage symlink...
php artisan storage:link

echo 3. Setting proper permissions...
if exist "public\storage" (
    echo Storage symlink exists.
) else (
    echo Creating storage directory manually...
    mkdir public\storage 2>nul
)

echo 4. Testing storage access...
php artisan tinker --execute="echo 'Storage URL test: ' . Storage::url('test.txt');"

echo.
echo ✅ Storage symlink setup complete!
echo.
echo If you still see 403 errors:
echo 1. Check your web server permissions
echo 2. Ensure storage/app/public directory exists
echo 3. Verify symlink points to correct directory
echo.
pause
