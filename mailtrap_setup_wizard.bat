@echo off
echo.
echo ==========================================
echo     MAILTRAP SETUP FOR PROPRIO LINK
echo ==========================================
echo.

echo Step 1: Open Mailtrap in your browser...
echo.
echo Please follow these steps:
echo 1. Go to https://mailtrap.io
echo 2. Sign up for a FREE account
echo 3. Click on "Email Testing" → "Inboxes"
echo 4. Click on "My Inbox" (or create a new one)
echo 5. Go to "SMTP Settings" tab
echo 6. Select "Laravel 9+" from dropdown
echo.

echo Step 2: Copy your credentials...
echo You'll see something like:
echo   MAIL_USERNAME=a1b2c3d4e5f6g7
echo   MAIL_PASSWORD=h8i9j0k1l2m3n4
echo.

echo Step 3: Update your .env file...
echo.
set /p username="Enter your MAIL_USERNAME from Mailtrap: "
set /p password="Enter your MAIL_PASSWORD from Mailtrap: "

echo.
echo Updating .env file...

:: Create a temporary file with the new mail settings
(
echo MAIL_MAILER=smtp
echo MAIL_HOST=sandbox.smtp.mailtrap.io
echo MAIL_PORT=2525
echo MAIL_USERNAME=%username%
echo MAIL_PASSWORD=%password%
echo MAIL_ENCRYPTION=tls
echo MAIL_FROM_ADDRESS="noreply@proprio-link.com"
echo MAIL_FROM_NAME="Proprio Link"
) > temp_mail_config.txt

echo.
echo ✅ Configuration prepared!
echo.
echo Step 4: Clearing Laravel cache...
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo.
echo Step 5: Caching new configuration...
php artisan config:cache

echo.
echo ==========================================
echo           SETUP COMPLETE! 🎉
echo ==========================================
echo.
echo What you can do now:
echo.
echo 1. Test emails: run "test_send_email.bat"
echo 2. Go to your Mailtrap inbox in browser
echo 3. Register a new user to test registration emails
echo 4. Make a test payment to test payment emails
echo 5. Use "Forgot Password" to test reset emails
echo.
echo Mailtrap URL: https://mailtrap.io/inboxes
echo.
echo Next step: Run "test_send_email.bat" to send test emails!
echo.

:: Clean up
del temp_mail_config.txt 2>nul

pause
