@echo off
echo ========================================
echo COMPREHENSIVE PAYMENT & EMAIL DEBUGGER
echo ========================================
echo.

echo 🔍 Running comprehensive payment and email system diagnosis...
php debug_payment_email_comprehensive.php

echo.
echo 🔧 Clearing Laravel caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo.
echo 📧 Testing email configuration...
php artisan tinker --execute="try { Mail::raw('Test email', function($m) { $m->to('test@test.com')->subject('Test'); }); echo 'Email config OK'; } catch(Exception $e) { echo 'Email error: ' . $e->getMessage(); }"

echo.
echo 💳 Testing Stripe configuration...
php artisan tinker --execute="try { $stripe = new \Stripe\StripeClient(config('services.stripe.secret')); echo 'Stripe config OK'; } catch(Exception $e) { echo 'Stripe error: ' . $e->getMessage(); }"

echo.
echo 🚀 Starting development server...
echo Visit: http://localhost:8000/debug/payment-logs to see payment debug logs
echo Visit: http://localhost:8000/debug/test-email to test email sending
echo.

pause
php artisan serve --host=127.0.0.1 --port=8000
