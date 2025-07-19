@echo off
echo =========================================
echo FIXING STORAGE SYMLINK ISSUE - CRITICAL
echo =========================================
echo.

echo The issue is that public\storage exists as a FILE instead of a symlink DIRECTORY.
echo This prevents images from being accessible via public URLs.
echo.

echo Step 1: Remove the incorrect storage file...
if exist "public\storage" (
    del /f /q "public\storage" 2>nul
    echo ✓ Removed incorrect storage file
) else (
    echo ✓ No storage file to remove
)

echo.
echo Step 2: Create proper storage symlink...
php artisan storage:link
if %ERRORLEVEL% EQU 0 (
    echo ✓ Storage symlink created via artisan
) else (
    echo ⚠ Artisan failed, trying manual method...
    mklink /D "public\storage" "..\storage\app\public"
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Manual symlink created successfully
    ) else (
        echo ✗ Failed to create symlink
        echo   This might be a permissions issue.
        echo   Try running as administrator or use the alternative method below.
    )
)

echo.
echo Step 3: Verify the symlink...
if exist "public\storage\" (
    echo ✓ Storage symlink directory exists
    dir "public\storage" | findstr "profile-images" >nul
    if %ERRORLEVEL% EQU 0 (
        echo ✓ Profile-images directory accessible via symlink
    ) else (
        echo ⚠ Profile-images not visible via symlink
    )
) else (
    echo ✗ Storage symlink still missing
    echo.
    echo ALTERNATIVE SOLUTION:
    echo If symlink creation fails, we can serve images directly via a route.
    echo This is less efficient but will work as a fallback.
)

echo.
echo Step 4: Test image access...
echo Looking for uploaded images to test...
for %%f in (storage\app\public\profile-images\*.jpg) do (
    echo Testing JPG: %%~nxf
    echo Direct storage path: storage\app\public\profile-images\%%~nxf
    echo Public URL should be: http://127.0.0.1:8000/storage/profile-images/%%~nxf
    goto :continue
)
for %%f in (storage\app\public\profile-images\*.png) do (
    echo Testing PNG: %%~nxf  
    echo Direct storage path: storage\app\public\profile-images\%%~nxf
    echo Public URL should be: http://127.0.0.1:8000/storage/profile-images/%%~nxf
    goto :continue
)
echo No profile images found to test.

:continue
echo.
echo Step 5: Alternative fix if symlink fails...
echo If the symlink approach doesn't work, we can add a fallback route.

echo.
echo =========================================
echo STORAGE SYMLINK FIX COMPLETE
echo =========================================
echo.
echo Now test by:
echo 1. Refreshing your browser
echo 2. Going to /profile  
echo 3. The uploaded image should now be visible
echo.
echo If images still show 404 errors:
echo 1. Check if public\storage is a directory (not a file)
echo 2. Run this script again as administrator
echo 3. Or contact support for manual symlink setup
echo.
pause
