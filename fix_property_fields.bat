@echo off
echo Running database migration to add missing property fields...
php artisan migrate --path=database/migrations/2025_07_06_120000_add_missing_property_fields.php
echo.
echo Migration completed!
echo.
echo Clearing cache...
php artisan config:clear
php artisan cache:clear
echo.
echo Done! The bedroom field and other property details should now work properly.
pause