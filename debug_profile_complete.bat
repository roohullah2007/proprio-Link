@echo off
echo ===========================================
echo Profile Image Upload Debug Script
echo ===========================================
echo.

echo 1. Checking database column...
php artisan tinker --execute="
$user = App\Models\User::first();
echo 'User model fillable fields: ' . implode(', ', $user->getFillable()) . PHP_EOL;
echo 'Profile image column exists: ' . (Schema::hasColumn('users', 'profile_image') ? 'YES' : 'NO') . PHP_EOL;
echo 'Current profile image value: ' . ($user->profile_image ?? 'NULL') . PHP_EOL;
"

echo.
echo 2. Checking storage directories...
if not exist "storage\app\public\profile-images" (
    echo Creating profile-images directory...
    mkdir "storage\app\public\profile-images"
) else (
    echo Profile-images directory exists.
)

echo.
echo 3. Checking storage link...
if exist "public\storage" (
    echo Storage link exists.
    dir "public\storage" | findstr "profile-images"
) else (
    echo Storage link missing! Creating...
    php artisan storage:link
)

echo.
echo 4. Testing form submission...
echo Creating test file for debugging...

echo ^<?php > test_profile_debug.php
echo try { >> test_profile_debug.php
echo     $user = App\Models\User::find(1); >> test_profile_debug.php
echo     echo "User ID: " . $user->id . "\n"; >> test_profile_debug.php
echo     echo "Current prenom: " . $user->prenom . "\n"; >> test_profile_debug.php
echo     echo "Current nom: " . $user->nom . "\n"; >> test_profile_debug.php
echo     echo "Current email: " . $user->email . "\n"; >> test_profile_debug.php
echo     echo "Profile image: " . ($user->profile_image ?? 'NULL') . "\n"; >> test_profile_debug.php
echo     echo "Fillable fields: " . implode(', ', $user->getFillable()) . "\n"; >> test_profile_debug.php
echo } catch (Exception $e) { >> test_profile_debug.php
echo     echo "Error: " . $e->getMessage() . "\n"; >> test_profile_debug.php
echo } >> test_profile_debug.php

php artisan tinker test_profile_debug.php
del test_profile_debug.php

echo.
echo 5. Checking form validation...
echo The issue might be in the form submission. Key points to check:
echo - Make sure field names match between frontend and backend
echo - prenom, nom, email should be filled
echo - Check if FormData is properly constructed when uploading files
echo.

echo 6. Check log files for errors...
if exist "storage\logs\laravel.log" (
    echo Latest log entries:
    powershell "Get-Content 'storage\logs\laravel.log' -Tail 10"
) else (
    echo No log file found.
)

echo.
echo ===========================================
echo Debug complete! If you're still having issues:
echo 1. Check browser console for JavaScript errors
echo 2. Check Network tab to see what data is being sent
echo 3. Verify the field names in the form match the validation rules
echo 4. Run this script again after making changes
echo ===========================================
pause
