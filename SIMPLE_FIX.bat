@echo off
echo ===============================================
echo  SIMPLE MIGRATION FIX
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Running migrations with the fixed migration file...
echo ===============================================
php artisan migrate --force

echo.
echo Adding profile image column...
echo ===============================================
php artisan migrate --path=database/migrations/2025_07_07_120000_add_profile_image_to_users_table.php --force

echo.
echo Setting up storage...
echo ===============================================
php artisan storage:link

echo.
echo ===============================================
echo  SIMPLE FIX COMPLETED!
echo ===============================================
echo.
echo Now try uploading your profile image again.
echo.
pause
