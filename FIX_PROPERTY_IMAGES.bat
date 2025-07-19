@echo off
echo ============================================
echo FIXING PROPERTY IMAGES - COMPLETE SOLUTION
echo ============================================
echo.

cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo Step 1: Removing broken storage symlink...
if exist "public\storage" (
    del /f /q "public\storage" 2>nul
    rmdir /s /q "public\storage" 2>nul
    echo - Removed broken storage link
) else (
    echo - No storage link found to remove
)

echo.
echo Step 2: Creating new storage symlink...
php artisan storage:link
if errorlevel 1 (
    echo WARNING: Laravel storage:link failed, trying manual creation...
    
    echo Step 2b: Manual symlink creation...
    set "SOURCE=%CD%\storage\app\public"
    set "TARGET=%CD%\public\storage"
    
    echo Source: %SOURCE%
    echo Target: %TARGET%
    
    mklink /D "%TARGET%" "%SOURCE%"
    if errorlevel 1 (
        echo ERROR: Manual symlink creation failed!
        echo Please run as Administrator or check permissions
        pause
        exit /b 1
    ) else (
        echo - Manual symlink created successfully
    )
) else (
    echo - Laravel storage:link created successfully
)

echo.
echo Step 3: Verifying storage structure...
if exist "storage\app\public\properties" (
    echo ✓ Properties directory exists
    dir /b "storage\app\public\properties" | find /c /v "" > nul
    if errorlevel 1 (
        echo - No property folders found
    ) else (
        echo - Property folders found
    )
) else (
    echo ✗ Properties directory missing
)

echo.
echo Step 4: Testing symlink...
if exist "public\storage" (
    echo ✓ Storage symlink exists
    if exist "public\storage\properties" (
        echo ✓ Properties accessible via symlink
    ) else (
        echo ✗ Properties not accessible via symlink
    )
) else (
    echo ✗ Storage symlink still missing
)

echo.
echo Step 5: Clearing Laravel caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear
echo - Caches cleared

echo.
echo Step 6: Testing image access...
echo Testing direct file access...
if exist "storage\app\public\properties\0197dc10-27b0-72f0-85ae-ba90e412ccbe\5fcc5b4d-0d1e-48f2-b656-54732245ef99.png" (
    echo ✓ Test image file exists in storage
) else (
    echo ✗ Test image file not found
)

if exist "public\storage\properties\0197dc10-27b0-72f0-85ae-ba90e412ccbe\5fcc5b4d-0d1e-48f2-b656-54732245ef99.png" (
    echo ✓ Test image accessible via public symlink
) else (
    echo ✗ Test image not accessible via public symlink
)

echo.
echo ============================================
echo SOLUTION COMPLETE
echo ============================================
echo.
echo Now test the admin property view:
echo http://127.0.0.1:8000/admin/properties/0197dc10-27b0-72f0-85ae-ba90e412ccbe/review
echo.
echo If images still don't show, check:
echo 1. Web server permissions
echo 2. .htaccess configuration
echo 3. Symlink support on your system
echo.
echo Diagnostic tool available at:
echo http://127.0.0.1:8000/debug-images.php
echo.
pause
