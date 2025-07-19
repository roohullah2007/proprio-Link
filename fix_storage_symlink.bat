@echo off
echo Creating Storage Symlink for Profile Images...
echo.

cd "E:\Proprio-Link\webapp\laravel-react-app"

REM Remove any existing storage file/link that might be broken
if exist "public\storage" (
    echo Removing existing storage link...
    del /f /q "public\storage" > nul 2>&1
    rmdir /s /q "public\storage" > nul 2>&1
)

REM Create the symlink using Laravel artisan command
echo Creating storage symlink with Laravel...
php artisan storage:link

REM Check if it was created successfully
if exist "public\storage" (
    echo ✅ Storage symlink created successfully!
    echo Testing access to profile-images directory...
    
    if exist "public\storage\profile-images" (
        echo ✅ Profile images directory accessible through symlink!
    ) else (
        echo ❌ Profile images directory not accessible. Creating manually...
        if not exist "storage\app\public\profile-images" (
            mkdir "storage\app\public\profile-images"
        )
        if not exist "storage\app\public\licenses" (
            mkdir "storage\app\public\licenses"
        )
    )
) else (
    echo ❌ Laravel symlink failed. Trying manual creation...
    
    REM Manual symlink creation for Windows
    mklink /D "public\storage" "storage\app\public"
    
    if exist "public\storage" (
        echo ✅ Manual symlink created successfully!
    ) else (
        echo ❌ Manual symlink also failed. Creating junction instead...
        mklink /J "public\storage" "storage\app\public"
    )
)

echo.
echo Final test of storage structure:
echo.
dir "public\storage" /ad
echo.
echo Profile images directory test:
if exist "public\storage\profile-images" (
    echo ✅ Profile images accessible at: public\storage\profile-images
) else (
    echo ❌ Profile images NOT accessible
)

echo.
echo Storage setup complete! Try uploading your profile image again.
pause
