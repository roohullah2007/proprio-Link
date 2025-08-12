@echo off
echo Configuring Email System and Testing...

echo.
echo 1. Clearing caches...
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo.
echo 2. Optimizing application...
php artisan config:cache

echo.
echo 3. Restarting queue workers...
php artisan queue:restart

echo.
echo 4. Testing email configuration...
php artisan tinker --execute="echo 'Mail configuration: ' . config('mail.default'); echo '\nHost: ' . config('mail.mailers.smtp.host'); echo '\nFrom: ' . config('mail.from.address');"

echo.
echo ✅ Email system configuration complete!
echo.
echo Next steps:
echo 1. Update MAIL_USERNAME and MAIL_PASSWORD in .env with your Mailtrap credentials
echo 2. Run test_send_email.bat to test email sending
echo 3. Check your Mailtrap inbox for test emails
echo.
pause
