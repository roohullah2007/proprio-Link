@echo off
echo Clearing Laravel caches...
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo Clearing cache...
php artisan cache:clear

echo Clearing config cache...
php artisan config:clear

echo Clearing view cache...
php artisan view:clear

echo Clearing route cache...
php artisan route:clear

echo Caches cleared successfully!
pause
