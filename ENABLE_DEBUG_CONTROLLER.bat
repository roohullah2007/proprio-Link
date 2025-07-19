@echo off
echo ===============================================
echo  ENABLE ENHANCED PROFILE DEBUGGING
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Backing up current ProfileController...
copy "app\Http\Controllers\ProfileController.php" "app\Http\Controllers\ProfileController_BACKUP.php"

echo.
echo Installing enhanced ProfileController with detailed logging...
copy "app\Http\Controllers\ProfileController_ENHANCED.php" "app\Http\Controllers\ProfileController.php"

echo.
echo Clearing caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo.
echo Running database and storage checks...
php debug_profile_errors.php

echo.
echo ===============================================
echo  ENHANCED DEBUGGING ENABLED
echo ===============================================
echo.
echo Now try uploading your profile image again.
echo.
echo The enhanced controller will log detailed information to:
echo storage/logs/laravel.log
echo.
echo If you want to restore the original controller later:
echo copy "app\Http\Controllers\ProfileController_BACKUP.php" "app\Http\Controllers\ProfileController.php"
echo.
pause
