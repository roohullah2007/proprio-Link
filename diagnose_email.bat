@echo off
echo Checking Current Email Configuration...
echo.

echo === Current .env Mail Settings ===
findstr /C:"MAIL_" .env
echo.

echo === Laravel Mail Configuration ===
php artisan tinker --execute="
echo 'Mail Driver: ' . config('mail.default') . PHP_EOL;
echo 'SMTP Host: ' . config('mail.mailers.smtp.host') . PHP_EOL;
echo 'SMTP Port: ' . config('mail.mailers.smtp.port') . PHP_EOL;
echo 'SMTP Username: ' . config('mail.mailers.smtp.username') . PHP_EOL;
echo 'SMTP Password: ' . (config('mail.mailers.smtp.password') ? 'SET' : 'NOT SET') . PHP_EOL;
echo 'From Address: ' . config('mail.from.address') . PHP_EOL;
"

echo.
echo === Sending Test Email ===
php artisan tinker --execute="
try {
    \Mail::raw('Test email from Laravel at ' . now(), function(\$message) {
        \$message->to('test@example.com')
                ->subject('Laravel Test Email - ' . now());
    });
    echo 'SUCCESS: Test email sent!' . PHP_EOL;
} catch (\Exception \$e) {
    echo 'ERROR: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo === Checking Recent Logs ===
echo Looking for email-related errors in Laravel logs...
if exist "storage\logs\laravel.log" (
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'mail|smtp|Mail|SMTP' | Select-Object -Last 5"
) else (
    echo No log file found.
)

echo.
echo ✅ Diagnosis complete!
echo.
pause
