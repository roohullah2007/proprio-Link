@echo off
cd /d "E:\propio\webapp\laravel-react-app"
echo Running Laravel migrations...
php artisan migrate
echo.
echo Checking migration status...
php artisan migrate:status
echo.
echo Done!
pause
