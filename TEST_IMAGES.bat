@echo off
echo =========================================
echo    Image Display Testing Script
echo =========================================
echo.

echo Testing image display functionality...
echo.

echo 1. Running storage fix...
call FIX_IMAGES.bat

echo.
echo 2. Testing image URLs...
php -r "
\$imagePath = 'properties/01974747-c58c-735c-a491-c78565370e57/f5efc31c-935b-417e-9808-5752af0473fd.png';
echo 'Testing image path: ' . \$imagePath . PHP_EOL;
echo 'Storage path exists: ' . (file_exists(storage_path('app/public/' . \$imagePath)) ? 'YES' : 'NO') . PHP_EOL;
echo 'Public path exists: ' . (file_exists(public_path('storage/' . \$imagePath)) ? 'YES' : 'NO') . PHP_EOL;
echo 'Asset URL: ' . asset('storage/' . \$imagePath) . PHP_EOL;
"

echo.
echo 3. Building React components...
npm run build

echo.
echo 4. Testing component compilation...
echo Checking if PropertyImage component was built successfully...
if exist "public\build" (
    echo    ✓ Build directory exists
) else (
    echo    ✗ Build directory missing - running npm run dev...
    npm run dev
)

echo.
echo =========================================
echo    Testing Complete!
echo =========================================
echo.
echo Next steps:
echo 1. Open your browser and navigate to your application
echo 2. Login with different user types:
echo    - Property Owner: Go to /properties
echo    - Agent: Go to /agent/properties  
echo    - Admin: Go to /admin/properties/pending
echo.
echo 3. Check browser console for any image loading errors
echo 4. Verify images load properly with fallbacks
echo.
echo If images still don't load, check:
echo - Storage symlink: /fix-storage
echo - Debug storage: /test-storage
echo - Storage admin: /storage-admin
echo.
pause
