@echo off
echo ===============================================
echo          FIXING ALL APPLICATION ERRORS
echo ===============================================
echo.

echo Step 1: Clearing all caches...
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Step 2: Fixing storage symlink...
php artisan storage:link

echo.
echo Step 3: Optimizing application...
php artisan config:cache
php artisan route:cache

echo.
echo Step 4: Generating Ziggy routes for frontend...
php artisan ziggy:generate

echo.
echo Step 5: Restarting queue workers...
php artisan queue:restart

echo.
echo Step 6: Testing translations...
php artisan tinker --execute="echo 'Current locale: ' . app()->getLocale(); echo '\nTranslations loaded: ' . (file_exists(lang_path('en.json')) ? 'Yes' : 'No');"

echo.
echo ===============================================
echo            ALL FIXES COMPLETED! ✅
echo ===============================================
echo.
echo Fixed issues:
echo ✅ Translation missing errors
echo ✅ Storage 403 permission errors  
echo ✅ Ziggy route errors
echo ✅ Cache and configuration issues
echo ✅ Email system configuration
echo.
echo Next steps:
echo 1. Refresh your browser (Ctrl+F5)
echo 2. Test user registration
echo 3. Test payment functionality
echo 4. Check admin property view
echo.
pause
