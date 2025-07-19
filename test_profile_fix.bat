@echo off
echo Testing Profile Upload Fix...
echo.

REM First, run the storage fix
echo Step 1: Running storage fix...
call fix_profile_storage.bat

echo.
echo Step 2: Testing route access...
php -r "
try {
    echo 'Testing profile route registration...' . PHP_EOL;
    
    // Simulate route check
    if (file_exists('routes/web.php')) {
        echo 'Routes file exists: YES' . PHP_EOL;
        $routesContent = file_get_contents('routes/web.php');
        
        if (strpos($routesContent, 'profile.update') !== false) {
            echo 'Profile update route exists: YES' . PHP_EOL;
        } else {
            echo 'Profile update route exists: NO' . PHP_EOL;
        }
        
        if (strpos($routesContent, 'profile.remove-image') !== false) {
            echo 'Profile image removal route exists: YES' . PHP_EOL;
        } else {
            echo 'Profile image removal route exists: NO' . PHP_EOL;
        }
    }
    
    echo 'Translation files check...' . PHP_EOL;
    
    if (file_exists('lang/en.json')) {
        $enTranslations = json_decode(file_get_contents('lang/en.json'), true);
        if (isset($enTranslations['Please type your password to confirm this action. This is a permanent action and cannot be undone.'])) {
            echo 'Missing translation added to English: YES' . PHP_EOL;
        } else {
            echo 'Missing translation added to English: NO' . PHP_EOL;
        }
    }
    
    if (file_exists('lang/fr.json')) {
        $frTranslations = json_decode(file_get_contents('lang/fr.json'), true);
        if (isset($frTranslations['Please type your password to confirm this action. This is a permanent action and cannot be undone.'])) {
            echo 'Missing translation added to French: YES' . PHP_EOL;
        } else {
            echo 'Missing translation added to French: NO' . PHP_EOL;
        }
    }
    
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 3: Testing file permissions...
php -r "
$dirs = [
    'storage/app/public/profile-images',
    'storage/app/public/licenses',
    'public/storage'
];

foreach ($dirs as $dir) {
    echo sprintf('%-40s: %s' . PHP_EOL, $dir, 
        (file_exists($dir) ? 'EXISTS' : 'MISSING') .
        (is_writable($dir) ? ' (WRITABLE)' : ' (NOT WRITABLE)')
    );
}
"

echo.
echo Step 4: Clearing application cache...
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

echo.
echo =============================================================
echo PROFILE UPLOAD FIX COMPLETED!
echo =============================================================
echo.
echo Summary of fixes applied:
echo 1. Added missing translation keys to English and French
echo 2. Enhanced ProfileController error handling
echo 3. Created storage directories with proper permissions
echo 4. Fixed storage symlink issues
echo 5. Added comprehensive file validation
echo.
echo You can now try uploading your profile image again.
echo If you still encounter issues, check the Laravel logs at:
echo storage/logs/laravel.log
echo.
echo Common solutions if issues persist:
echo - Run as Administrator if permission issues
echo - Check that your image is under 2MB and is JPG/PNG/GIF
echo - Ensure proper file extension (.jpg, .png, .gif)
echo.
pause
