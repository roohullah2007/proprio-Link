@echo off
echo ===============================================
echo  Profile Image Column Fix
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo Running database column fix...
php fix_profile_image_column.php

echo.
echo ===============================================
echo Fix completed!
echo ===============================================
pause
