@echo off
echo ===============================================
echo  RUNNING FIXED MIGRATIONS
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Running all migrations (now with column checks)...
php artisan migrate --force

echo.
echo Setting up storage...
php artisan storage:link

echo.
echo ===============================================
echo MIGRATIONS COMPLETED!
echo ===============================================
echo.
echo Your profile image upload should now work!
echo Try uploading an image in your profile settings.
echo.
pause
