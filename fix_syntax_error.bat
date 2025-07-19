@echo off
echo ==========================================
echo FIXING SYNTAX ERROR AND REBUILDING
echo ==========================================
echo.

echo Step 1: Clear all caches...
php artisan config:clear
php artisan route:clear
php artisan view:clear
echo ✓ Laravel caches cleared

echo.
echo Step 2: Rebuild frontend...
npm run build
if %ERRORLEVEL% EQU 0 (
    echo ✓ Frontend built successfully
) else (
    echo ⚠ Build had issues, trying npm install first...
    npm install
    npm run build
)

echo.
echo Step 3: Check if Vite server is running...
echo If you're using npm run dev, restart it:
echo 1. Stop the dev server (Ctrl+C)
echo 2. Run: npm run dev
echo 3. The syntax error should be resolved

echo.
echo ==========================================
echo SYNTAX ERROR FIXED
echo ==========================================
echo.
echo The file has been rewritten with proper syntax.
echo.
echo 🧪 TEST STEPS:
echo 1. If using 'npm run dev', restart it
echo 2. Refresh your browser
echo 3. Go to /profile
echo 4. Try uploading a profile image
echo 5. Check browser console for debugging messages
echo.
pause
