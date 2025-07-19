@echo off
echo ===============================================
echo  Running Profile Image Migration
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Checking current migration status...
php artisan migrate:status

echo.
echo Running the profile image migration...
php artisan migrate --path=database/migrations/2025_07_07_120000_add_profile_image_to_users_table.php --force

echo.
echo Checking if migration was successful...
php artisan migrate:status

echo.
echo Creating storage link if it doesn't exist...
php artisan storage:link

echo.
echo Checking users table structure...
php artisan tinker --execute="Schema::getColumnListing('users')" 2>nul || echo "Could not check table structure via tinker"

echo.
echo ===============================================
echo Migration process completed!
echo ===============================================
echo.
echo You can now test the profile image upload feature.
echo If there are any issues, check the Laravel logs.
echo.
pause
