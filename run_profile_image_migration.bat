@echo off
echo Running profile image migration...
cd /d "E:\Proprio-Link\webapp\laravel-react-app"
php artisan migrate --path=database/migrations/2025_07_07_120000_add_profile_image_to_users_table.php
echo Migration completed.
pause
