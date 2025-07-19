@echo off
echo Fixing Profile Image Storage Issues...
echo.

REM Create storage directories if they don't exist
if not exist "storage\app\public\profile-images" (
    echo Creating profile-images directory...
    mkdir "storage\app\public\profile-images"
    echo Profile images directory created.
) else (
    echo Profile images directory already exists.
)

if not exist "storage\app\public\licenses" (
    echo Creating licenses directory...
    mkdir "storage\app\public\licenses"
    echo Licenses directory created.
) else (
    echo Licenses directory already exists.
)

REM Set proper permissions (Windows)
echo Setting directory permissions...
icacls "storage\app\public" /grant "Everyone:(OI)(CI)F" /T > nul 2>&1
if %errorlevel% equ 0 (
    echo Permissions set successfully.
) else (
    echo Warning: Could not set permissions. You may need to run as administrator.
)

REM Create storage symlink
echo Creating storage symlink...
if exist "public\storage" (
    echo Storage symlink already exists. Checking if it's valid...
    if exist "public\storage\profile-images" (
        echo Storage symlink is working correctly.
    ) else (
        echo Storage symlink exists but is not working. Recreating...
        rmdir "public\storage" /s /q > nul 2>&1
        php artisan storage:link
    )
) else (
    echo Creating new storage symlink...
    php artisan storage:link
)

REM Check if symlink was created successfully
if exist "public\storage" (
    echo Storage symlink created successfully!
) else (
    echo Failed to create storage symlink. Trying alternative method...
    mklink /D "public\storage" "storage\app\public"
)

REM Clear cache to ensure changes take effect
echo Clearing application cache...
php artisan config:cache > nul 2>&1
php artisan route:cache > nul 2>&1
php artisan view:cache > nul 2>&1

echo.
echo Storage fix completed!
echo.
echo Testing storage access...
php -r "
$profileDir = 'storage/app/public/profile-images';
$licensesDir = 'storage/app/public/licenses';
$symlink = 'public/storage';

echo 'Profile images dir exists: ' . (is_dir($profileDir) ? 'YES' : 'NO') . PHP_EOL;
echo 'Licenses dir exists: ' . (is_dir($licensesDir) ? 'YES' : 'NO') . PHP_EOL;
echo 'Storage symlink exists: ' . (file_exists($symlink) ? 'YES' : 'NO') . PHP_EOL;
echo 'Profile images writable: ' . (is_writable($profileDir) ? 'YES' : 'NO') . PHP_EOL;
echo 'Licenses writable: ' . (is_writable($licensesDir) ? 'YES' : 'NO') . PHP_EOL;
"

echo.
echo Fix completed! Try uploading your profile image again.
pause
