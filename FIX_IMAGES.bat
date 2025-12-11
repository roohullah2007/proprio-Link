@echo off
echo =========================================
echo    Proprio-Link Image Display Fix
echo =========================================
echo.

echo 1. Checking current storage status...
if exist "public\storage" (
    echo    ✓ Storage symlink exists
) else (
    echo    ✗ Storage symlink missing
)

echo.
echo 2. Clearing all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo.
echo 3. Creating/fixing storage symlink...
php artisan storage:link

echo.
echo 4. Rebuilding caches...
php artisan config:cache
php artisan route:cache

echo.
echo 5. Checking storage permissions and paths...
if exist "storage\app\public" (
    echo    ✓ Storage path exists: storage\app\public
) else (
    echo    ✗ Storage path missing: storage\app\public
    mkdir "storage\app\public"
    echo    ✓ Created storage\app\public
)

if exist "storage\app\public\properties" (
    echo    ✓ Properties folder exists
) else (
    echo    ✗ Properties folder missing
    mkdir "storage\app\public\properties"
    echo    ✓ Created properties folder
)

echo.
echo 6. Verifying symlink target...
if exist "public\storage" (
    echo    ✓ Public storage link verified
) else (
    echo    ✗ Symlink creation failed, trying alternative method...
    rmdir "public\storage" /S /Q 2>nul
    mklink /D "public\storage" "storage\app\public"
)

echo.
echo 7. Testing image routes...
php artisan route:list | findstr /C:"serve.image" /C:"serve.storage"

echo.
echo =========================================
echo    Fix completed!
echo =========================================
echo.
echo You can now test the image display:
echo - Agent view: /agent/properties
echo - Admin view: /admin/properties/pending
echo - Owner view: /properties
echo.
echo Debug URLs:
echo - Storage test: /test-storage
echo - Storage admin: /storage-admin
echo - Fix storage: /fix-storage
echo.
pause
