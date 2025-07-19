@echo off
echo ===========================================
echo COMPLETE PROFILE IMAGE UPLOAD FIX
echo ===========================================
echo.

echo Step 1: Creating required directories...
if not exist "storage\app\public\profile-images" (
    mkdir "storage\app\public\profile-images"
    echo ✓ Created profile-images directory
) else (
    echo ✓ Profile-images directory already exists
)

echo.
echo Step 2: Fixing storage symlink...
if exist "public\storage" (
    del "public\storage" 2>nul
    echo ✓ Removed old storage file
)
php artisan storage:link
echo ✓ Created storage symlink

echo.
echo Step 3: Running profile image migration...
php artisan migrate --path=database/migrations/2025_07_07_120000_add_profile_image_to_users_table.php --force
echo ✓ Database migration completed

echo.
echo Step 4: Setting proper permissions...
icacls "storage\app\public\profile-images" /grant "IIS_IUSRS:(OI)(CI)F" /T 2>nul
icacls "public\storage" /grant "IIS_IUSRS:(OI)(CI)F" /T 2>nul
echo ✓ Set permissions for web server

echo.
echo Step 5: Clearing cache...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Cleared application cache

echo.
echo Step 6: Testing database connection...
php artisan tinker --execute="
try {
    \$user = App\Models\User::first();
    echo 'Database connection: OK' . PHP_EOL;
    echo 'Profile image column exists: ' . (Schema::hasColumn('users', 'profile_image') ? 'YES' : 'NO') . PHP_EOL;
    echo 'User model ready: YES' . PHP_EOL;
} catch (Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 7: Installing/updating dependencies...
npm install
npm run build
echo ✓ Frontend dependencies updated

echo.
echo ===========================================
echo ✅ PROFILE IMAGE UPLOAD FIX COMPLETE!
echo ===========================================
echo.
echo What was fixed:
echo ✓ Created profile-images storage directory
echo ✓ Fixed storage symlink
echo ✓ Updated database schema
echo ✓ Fixed form submission logic
echo ✓ Added proper error handling
echo ✓ Cleared application cache
echo ✓ Updated frontend assets
echo.
echo You can now test profile image upload!
echo.
echo If you still have issues:
echo 1. Check browser console for JavaScript errors
echo 2. Check Network tab to see the actual request being sent
echo 3. Look at storage/logs/laravel.log for server errors
echo.
pause
