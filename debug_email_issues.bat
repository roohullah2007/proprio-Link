@echo off
echo Debugging Email Issues...
echo.

echo 1. Checking Mail Configuration...
php artisan tinker --execute="echo 'Mail Driver: ' . config('mail.default'); echo '\nSMTP Host: ' . config('mail.mailers.smtp.host'); echo '\nFrom Address: ' . config('mail.from.address');"

echo.
echo 2. Checking Recent Laravel Logs for Email Errors...
type storage\logs\laravel.log | findstr /C:"mail" /C:"email" /C:"smtp" /C:"Mail" | tail -10

echo.
echo 3. Sending a Simple Test Email...
php artisan tinker --execute="use Illuminate\Support\Facades\Mail; Mail::raw('Test email sent at: ' . now(), function(\$msg) { \$msg->to('test@example.com')->subject('Debug Test - ' . now()); }); echo 'Test email sent!';"

echo.
echo 4. Checking Queue Status...
php artisan queue:failed

echo.
echo ✅ Debug complete! 
echo.
echo Next steps:
echo 1. Go to Mailtrap → Sandboxes → My Inbox
echo 2. Refresh the page (F5)
echo 3. Look for emails in the list on the left
echo 4. If still no emails, check your MAIL_USERNAME and MAIL_PASSWORD in .env
echo.
pause
