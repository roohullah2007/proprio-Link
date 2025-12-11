@echo off
echo ========================================
echo Proprio Link - Hostinger Deployment Script
echo ========================================
echo.

echo This script will prepare your files for deployment to Hostinger.
echo.
echo IMPORTANT: This deployment process requires:
echo 1. Your local build files to be up to date (npm run build)
echo 2. Manual upload to Hostinger via FTP or File Manager
echo.

REM Step 1: Clear Laravel caches
echo [1/5] Clearing Laravel caches...
php artisan cache:clear
php artisan route:clear
php artisan config:clear
php artisan view:clear

REM Step 2: Build fresh assets
echo.
echo [2/5] Building fresh production assets...
call npm run build

REM Step 3: Generate optimized caches
echo.
echo [3/5] Generating optimized caches...
php artisan config:cache
php artisan route:cache
php artisan view:cache

REM Step 4: Create deployment info file
echo.
echo [4/5] Creating deployment info...
echo Deployment Date: %date% %time% > deployment_info.txt
echo Build Manifest Hash: >> deployment_info.txt
powershell -Command "(Get-FileHash public\build\manifest.json -Algorithm SHA256).Hash" >> deployment_info.txt

REM Step 5: Instructions for manual deployment
echo.
echo [5/5] DEPLOYMENT INSTRUCTIONS:
echo ========================================
echo.
echo Files to upload to Hostinger:
echo.
echo 1. Upload entire 'public\build' folder to 'public_html\build'
echo    - DELETE the old build folder on server first
echo    - Upload the new build folder completely
echo.
echo 2. Clear server-side caches on Hostinger:
echo    a. Login to Hostinger Control Panel
echo    b. Navigate to your domain
echo    c. Go to Advanced > PHP Configuration
echo    d. Click "Clear Cache" or restart PHP workers
echo.
echo 3. If using Cloudflare or other CDN:
echo    - Purge CDN cache after upload
echo.
echo 4. Test the deployment:
echo    - Visit your site in incognito/private mode
echo    - Check browser console for any 404 errors
echo    - Verify all pages load correctly
echo.
echo CRITICAL: The build folder MUST be completely replaced, not merged!
echo.
echo Press any key to open the build folder...
pause > nul
explorer public\build

echo.
echo Deployment preparation complete!
echo.
pause