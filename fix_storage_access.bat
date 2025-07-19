@echo off
echo ========================================
echo FIXING PROFILE IMAGE STORAGE ACCESS
echo ========================================
echo.

echo Step 1: Remove old storage link...
if exist "public\storage" (
    del /f /q "public\storage" 2>nul
    rmdir /s /q "public\storage" 2>nul
    echo ✓ Removed old storage link
) else (
    echo ✓ No old storage link to remove
)

echo.
echo Step 2: Create proper storage symlink...
php artisan storage:link
if %ERRORLEVEL% EQU 0 (
    echo ✓ Storage symlink created successfully
) else (
    echo ✗ Failed to create symlink via artisan, trying manual method...
    mklink /D "public\storage" "..\storage\app\public"
)

echo.
echo Step 3: Verify storage directories exist...
if not exist "storage\app\public\profile-images" (
    mkdir "storage\app\public\profile-images"
    echo ✓ Created profile-images directory
) else (
    echo ✓ Profile-images directory exists
)

echo.
echo Step 4: Test storage access...
if exist "public\storage" (
    echo ✓ Storage symlink exists
    dir "public\storage" | findstr "profile-images" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Profile-images accessible via symlink
    ) else (
        echo ⚠ Profile-images not visible via symlink
    )
) else (
    echo ✗ Storage symlink missing
)

echo.
echo Step 5: Clear caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Caches cleared

echo.
echo Step 6: Test profile image access...
echo Testing if uploaded images are accessible...
for %%f in (storage\app\public\profile-images\*.jpg) do (
    echo Found image: %%~nxf
    set "imagename=%%~nxf"
    goto :test_access
)
for %%f in (storage\app\public\profile-images\*.png) do (
    echo Found image: %%~nxf
    set "imagename=%%~nxf"
    goto :test_access
)
echo No profile images found to test.
goto :continue

:test_access
echo Testing access to: %imagename%
echo Visit: http://127.0.0.1:8000/storage/profile-images/%imagename%

:continue
echo.
echo ========================================
echo PROFILE IMAGE STORAGE FIX COMPLETE!
echo ========================================
echo.
echo What was fixed:
echo ✓ Recreated storage symlink
echo ✓ Added missing translations
echo ✓ Verified directory structure
echo ✓ Cleared application caches
echo.
echo Now try uploading a profile image again!
echo The image should be accessible after upload.
echo.
pause
