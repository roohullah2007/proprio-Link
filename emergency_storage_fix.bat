@echo off
echo ==========================================
echo EMERGENCY FIX - Creating Storage Symlink
echo ==========================================
echo.

cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo Step 1: Trying Laravel artisan command...
php artisan storage:link
if %errorlevel% equ 0 (
    echo ✓ Laravel artisan worked!
    goto :test
)

echo Step 2: Trying Windows junction...
rmdir /s /q "public\storage" 2>nul
mklink /J "public\storage" "storage\app\public"
if %errorlevel% equ 0 (
    echo ✓ Windows junction worked!
    goto :test
)

echo Step 3: Trying robocopy mirror (as backup)...
robocopy "storage\app\public" "public\storage" /MIR /E
if %errorlevel% lss 8 (
    echo ✓ Robocopy mirror worked!
    goto :test
)

echo ✗ All methods failed. You may need Administrator privileges.
goto :end

:test
echo.
echo Testing storage link...
if exist "public\storage\properties" (
    echo ✓ SUCCESS! Storage is accessible
    echo   URL: http://127.0.0.1:8000/storage/properties/
    echo.
    echo ✓ Images should now display correctly!
) else (
    echo ✗ Storage link created but properties not found
)

:end
echo.
echo Press any key to continue...
pause > nul
