@echo off
echo ===============================================
echo  PROFILE UPDATE ERROR DEBUGGING
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Running comprehensive debug check...
php debug_profile_errors.php

echo.
echo ===============================================
echo  ADDITIONAL CHECKS
echo ===============================================

echo.
echo Checking Laravel configuration...
php artisan config:cache
php artisan route:cache

echo.
echo Testing file upload limits...
php -r "
echo 'PHP Upload Settings:' . PHP_EOL;
echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL;
echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;
echo 'max_file_uploads: ' . ini_get('max_file_uploads') . PHP_EOL;
echo 'memory_limit: ' . ini_get('memory_limit') . PHP_EOL;
"

echo.
echo Checking recent Laravel logs...
if exist "storage\logs\laravel.log" (
    echo Latest log entries:
    powershell "Get-Content 'storage\logs\laravel.log' | Select-Object -Last 10"
) else (
    echo No Laravel log file found.
)

echo.
echo ===============================================
echo  DEBUG COMPLETED
echo ===============================================
echo.
echo Now try uploading your profile image again and note any errors.
echo If you see errors, they should be displayed above.
echo.
pause
