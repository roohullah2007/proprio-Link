@echo off
echo Checking which property columns are missing...
echo.
php check_missing_columns.php
echo.
echo.
set /p continue="Do you want to run the safe migration to add missing columns? (y/n): "
if /i "%continue%"=="y" (
    echo.
    echo Running safe migration...
    php artisan migrate --path=database/migrations/2025_07_06_120001_add_missing_property_fields_safe.php
    echo.
    echo Migration completed!
    echo.
    echo Clearing cache...
    php artisan config:clear
    php artisan cache:clear
    echo.
    echo Done! Checking columns again...
    echo.
    php check_missing_columns.php
) else (
    echo.
    echo Migration cancelled.
)
echo.
pause