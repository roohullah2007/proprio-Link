@echo off
echo Creating storage symlink...
cd /d "E:\Proprio-Link\webapp\laravel-react-app"
php artisan storage:link
echo Storage symlink created!
pause
