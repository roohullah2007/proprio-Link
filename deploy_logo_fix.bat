@echo off
echo ============================================
echo Deploying Logo Fix to Production
echo ============================================
echo.

echo Step 1: Building production assets...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed. Please fix build errors and try again.
    pause
    exit /b 1
)

echo.
echo Step 2: Build completed successfully!
echo.
echo ============================================
echo DEPLOYMENT INSTRUCTIONS:
echo ============================================
echo.
echo The build has been completed. Now you need to upload the following to your production server:
echo.
echo 1. Upload the entire 'public/build' folder to your production server
echo    Location: public_html/build/
echo.
echo 2. The key files that were updated:
echo    - public/build/assets/PublicLayout-*.js
echo    - public/build/assets/AuthenticatedLayout-*.js  
echo    - public/build/assets/GuestLayout-*.js
echo    - public/build/manifest.json
echo.
echo 3. Clear your browser cache after deployment
echo.
echo 4. Test the logo link on: https://app.proprio-link.fr/property/01989534-ae4f-7201-b8a7-3a68df4d9a76
echo.
echo ============================================
echo IMPORTANT: The logo should now link to https://proprio-link.fr/
echo ============================================
echo.
pause