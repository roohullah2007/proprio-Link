@echo off
echo IMMEDIATE PROFILE IMAGE FIX
echo ============================
echo.

cd "E:\Proprio-Link\webapp\laravel-react-app"

echo Step 1: Checking current storage state...
if exist "storage\app\public\profile-images" (
    echo ✅ Profile images directory exists
) else (
    echo ❌ Profile images directory missing - creating...
    mkdir "storage\app\public\profile-images"
    echo ✅ Created profile images directory
)

if exist "storage\app\public\licenses" (
    echo ✅ Licenses directory exists
) else (
    echo ❌ Licenses directory missing - creating...
    mkdir "storage\app\public\licenses"
    echo ✅ Created licenses directory
)

echo.
echo Step 2: Fixing storage symlink...
if exist "public\storage" (
    echo Removing broken storage link...
    del /f /q "public\storage" > nul 2>&1
    rmdir /s /q "public\storage" > nul 2>&1
)

echo Creating new storage symlink...
php artisan storage:link

if exist "public\storage" (
    echo ✅ Storage symlink created!
) else (
    echo ❌ Artisan failed, trying manual...
    mklink /D "public\storage" "storage\app\public"
    if exist "public\storage" (
        echo ✅ Manual symlink created!
    ) else (
        echo ❌ Manual failed, creating junction...
        mklink /J "public\storage" "storage\app\public"
    )
)

echo.
echo Step 3: Setting permissions...
icacls "storage\app\public" /grant "Everyone:(OI)(CI)F" /T > nul 2>&1

echo.
echo Step 4: Clearing Laravel cache...
php artisan config:clear > nul 2>&1
php artisan route:clear > nul 2>&1
php artisan view:clear > nul 2>&1

echo.
echo Step 5: Testing storage access...
if exist "public\storage\profile-images" (
    echo ✅ Profile images accessible via web!
    echo    URL: /storage/profile-images/
) else (
    echo ❌ Profile images still not accessible
)

echo.
echo ============================
echo FIX COMPLETED!
echo ============================
echo.
echo Try uploading your profile image now.
echo The "mkdir(): No such file or directory" error should be resolved.
echo.
pause
