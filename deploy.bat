@echo off
echo ===================================
echo Proprio-Link Deployment Preparation
echo ===================================
echo.

REM Create deployment directory
echo Creating deployment directory...
if exist "deployment" rmdir /s /q "deployment"
mkdir deployment
mkdir deployment\public_html
mkdir deployment\proprio

echo.
echo Building Vite assets...
call npm run build

echo.
echo Copying public files to deployment\public_html...
xcopy /E /I /Y "public\*" "deployment\public_html\"

echo.
echo Copying server-specific files...
copy /Y "server-files\public_html\index.php" "deployment\public_html\index.php"
copy /Y "server-files\public_html\.htaccess" "deployment\public_html\.htaccess"

echo.
echo Copying Laravel application files to deployment\proprio...
xcopy /E /I /Y "app" "deployment\proprio\app\"
xcopy /E /I /Y "bootstrap" "deployment\proprio\bootstrap\"
xcopy /E /I /Y "config" "deployment\proprio\config\"
xcopy /E /I /Y "database" "deployment\proprio\database\"
xcopy /E /I /Y "lang" "deployment\proprio\lang\"
xcopy /E /I /Y "resources" "deployment\proprio\resources\"
xcopy /E /I /Y "routes" "deployment\proprio\routes\"
xcopy /E /I /Y "vendor" "deployment\proprio\vendor\"

echo.
echo Creating storage directories...
mkdir "deployment\proprio\storage"
mkdir "deployment\proprio\storage\app"
mkdir "deployment\proprio\storage\app\public"
mkdir "deployment\proprio\storage\framework"
mkdir "deployment\proprio\storage\framework\cache"
mkdir "deployment\proprio\storage\framework\sessions"
mkdir "deployment\proprio\storage\framework\views"
mkdir "deployment\proprio\storage\logs"

echo.
echo Copying essential files...
copy "composer.json" "deployment\proprio\composer.json"
copy "composer.lock" "deployment\proprio\composer.lock"
copy "artisan" "deployment\proprio\artisan"
copy ".env.server" "deployment\proprio\.env.example"

echo.
echo ===================================
echo Deployment files ready in 'deployment' folder!
echo ===================================
echo.
echo Next steps:
echo 1. Upload 'deployment\public_html' contents to your server's public_html folder
echo 2. Upload 'deployment\proprio' contents to your server's proprio folder
echo 3. On the server, rename .env.example to .env and update database/email settings
echo 4. Run the server setup commands (see DEPLOYMENT_GUIDE.md)
echo.
pause