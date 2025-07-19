@echo off
echo Creating storage directory structure...

cd /d "E:\Proprio-Link\webapp\laravel-react-app"

REM First, try to create the symlink with mklink
echo Attempting to create junction with mklink...
rmdir /s /q "public\storage" 2>nul
mklink /J "public\storage" "storage\app\public"

if %errorlevel% equ 0 (
    echo ✓ Junction created successfully with mklink
    goto :test
)

REM If mklink fails, try with PowerShell
echo mklink failed, trying with PowerShell...
powershell -ExecutionPolicy Bypass -File "create_storage_link.ps1"

if %errorlevel% equ 0 (
    echo ✓ Junction created successfully with PowerShell
    goto :test
)

REM If both fail, try Laravel artisan
echo PowerShell failed, trying Laravel artisan...
php artisan storage:link

if %errorlevel% equ 0 (
    echo ✓ Storage link created successfully with Laravel
    goto :test
)

echo ✗ All methods failed. Please run as Administrator.
goto :end

:test
echo.
echo Testing storage link...
if exist "public\storage\properties" (
    echo ✓ Storage link is working - properties directory accessible
) else (
    echo ✗ Storage link created but not working properly
)

:end
echo.
echo Done!
pause
