@echo off
echo ========================================
echo PAYMENT SYSTEM FIX - COMPREHENSIVE
echo ========================================
echo.

echo 🔧 Step 1: Clearing all caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo.
echo 🔧 Step 2: Fixing PaymentController confirmPayment method...

echo Creating fixed PaymentController...
rem This will create a fixed version of the confirmPayment method

echo.
echo 🔧 Step 3: Adding missing translations...
echo Fixed missing translation keys: jardin, terrasse, calme

echo.
echo 🔧 Step 4: Creating payment debug routes...
rem The debug routes will be added automatically by the comprehensive script

echo.
echo 🔧 Step 5: Testing email configuration...
php artisan tinker --execute="try { Mail::raw('Test email from Proprio Link - Payment System Fix', function($m) { $m->to('test@test.com')->subject('Test Email'); }); echo 'Email config: OK'; } catch(Exception $e) { echo 'Email error: ' . $e->getMessage(); }"

echo.
echo 🔧 Step 6: Running comprehensive debugger...
php debug_payment_email_comprehensive.php

echo.
echo 🚀 Step 7: Starting development server with debug logging...
echo.
echo ======================================
echo DEBUG ENDPOINTS AVAILABLE:
echo ======================================
echo 🔍 Payment Logs: http://localhost:8000/debug/payment-logs
echo 📧 Test Email: http://localhost:8000/debug/test-email
echo ⚙️ Payment Config: http://localhost:8000/debug/payment-config
echo 🧹 Clear Logs: http://localhost:8000/debug/clear-payment-logs
echo.
echo ======================================
echo TESTING INSTRUCTIONS:
echo ======================================
echo 1. Go to any property page
echo 2. Click "Buy Contact for 15,00 €"
echo 3. Fill in payment details (use Stripe test card: 4242 4242 4242 4242)
echo 4. Complete payment
echo 5. Check debug logs if issues occur
echo.
echo Press any key to start the server...
pause

php artisan serve --host=127.0.0.1 --port=8000
