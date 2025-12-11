@echo off
echo Testing Email Functionality...

echo.
echo 📧 Testing all email types...
echo This will send test emails to your Mailtrap inbox.
echo.

php artisan tinker < test_emails.php

echo.
echo ✅ Email tests completed!
echo.
echo Check your Mailtrap inbox for the following test emails:
echo - User Registration Notification (to Admin)
echo - Payment Success Notification (to Agent and Admin)
echo - Payment Failed Notification (to Agent and Admin) 
echo - Password Reset Email (to User)
echo.
echo If you don't see emails in Mailtrap:
echo 1. Check your MAIL_USERNAME and MAIL_PASSWORD in .env
echo 2. Verify Mailtrap credentials are correct
echo 3. Check Laravel logs: storage/logs/laravel.log
echo.
pause
