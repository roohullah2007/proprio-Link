@echo off
echo Fixing storage link for profile images...

REM Remove the old storage file if it exists
if exist "public\storage" (
    del "public\storage"
    echo Removed old storage file
)

REM Create the storage link
php artisan storage:link

REM Check if link was created successfully
if exist "public\storage" (
    echo Storage link created successfully!
) else (
    echo Failed to create storage link. Creating manually...
    mklink /D "public\storage" "..\storage\app\public"
)

echo.
echo Profile images directory: storage\app\public\profile-images
echo Storage link: public\storage
echo.
echo Done! You can now upload profile images.
pause
