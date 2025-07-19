@echo off
echo ===============================================
echo  QUICK PROFILE IMAGE FIX
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo Running quick fix for profile image column...
php quick_profile_fix.php

echo.
echo ===============================================
echo Quick fix completed!
echo ===============================================
echo.
echo Now try uploading your profile image again.
echo If it still doesn't work, run: FIX_MIGRATION_AND_PROFILE.bat
echo.
pause
