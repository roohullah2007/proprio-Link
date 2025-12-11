@echo off
echo ========================================
echo COMPREHENSIVE PAYMENT SYSTEM FIX
echo ========================================
echo.

echo 🔧 Step 1: Running comprehensive debugger and fixes...
php debug_payment_email_comprehensive.php

echo.
echo 🔧 Step 2: Clearing Laravel caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

echo.
echo 🔧 Step 3: Testing Stripe configuration...
php -r "
try {
    require 'vendor/autoload.php';
    $app = require 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $kernel->bootstrap();
    
    $settings = DB::table('admin_settings')
        ->where('key_name', 'stripe_secret_key')
        ->value('value');
    
    if (empty($settings)) {
        echo 'WARNING: Stripe secret key not configured in admin_settings table' . PHP_EOL;
    } else {
        echo 'Stripe configuration: Found in database' . PHP_EOL;
    }
    
    echo 'Environment Stripe key: ' . (config('services.stripe.secret') ? 'Found' : 'Missing') . PHP_EOL;
} catch (Exception $e) {
    echo 'Error checking Stripe config: ' . $e->getMessage() . PHP_EOL;
}
"

echo.
echo 🔧 Step 4: Testing email configuration...
php -r "
try {
    require 'vendor/autoload.php';
    $app = require 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $kernel->bootstrap();
    
    $mailHost = env('MAIL_HOST');
    $mailPort = env('MAIL_PORT');
    $mailUsername = env('MAIL_USERNAME');
    
    if (empty($mailHost)) {
        echo 'WARNING: MAIL_HOST not configured' . PHP_EOL;
    } else {
        echo 'Email Host: ' . $mailHost . ':' . $mailPort . PHP_EOL;
        echo 'Email Username: ' . ($mailUsername ? 'Configured' : 'Missing') . PHP_EOL;
    }
    
    // Test connection (simplified)
    echo 'Email configuration appears: ' . (($mailHost && $mailPort && $mailUsername) ? 'Complete' : 'Incomplete') . PHP_EOL;
} catch (Exception $e) {
    echo 'Error checking email config: ' . $e->getMessage() . PHP_EOL;
}
"

echo.
echo 🔧 Step 5: Checking database tables...
php -r "
try {
    require 'vendor/autoload.php';
    $app = require 'bootstrap/app.php';
    $kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
    $kernel->bootstrap();
    
    $tables = ['contact_purchases', 'properties', 'users', 'admin_settings'];
    foreach ($tables as $table) {
        if (Schema::hasTable($table)) {
            echo 'Table ' . $table . ': EXISTS' . PHP_EOL;
        } else {
            echo 'Table ' . $table . ': MISSING' . PHP_EOL;
        }
    }
    
    // Check published properties
    $publishedCount = DB::table('properties')->where('statut', 'PUBLIE')->count();
    echo 'Published properties: ' . $publishedCount . PHP_EOL;
    
    // Check agent users  
    $agentCount = DB::table('users')->where('type_utilisateur', 'AGENT')->count();
    echo 'Agent users: ' . $agentCount . PHP_EOL;
    
} catch (Exception $e) {
    echo 'Error checking database: ' . $e->getMessage() . PHP_EOL;
}
"

echo.
echo 🚀 Step 6: Starting development server...
echo.
echo ==========================================
echo 🎯 DEBUGGING ENDPOINTS AVAILABLE:
echo ==========================================
echo 🔍 Payment Debug Logs: http://localhost:8000/debug/payment-logs
echo 📧 Test Email Sending: http://localhost:8000/debug/test-email  
echo ⚙️ Payment Config Check: http://localhost:8000/debug/payment-config
echo 🧹 Clear Debug Logs: http://localhost:8000/debug/clear-payment-logs
echo.
echo ==========================================
echo 🧪 TESTING INSTRUCTIONS:
echo ==========================================
echo 1. Open: http://localhost:8000
echo 2. Login as an agent
echo 3. Go to any property page
echo 4. Click "Buy Contact for 15,00 €"
echo 5. Use Stripe test card: 4242 4242 4242 4242
echo 6. Complete payment process
echo 7. If errors occur, check debug logs above
echo 8. Emails should be sent to configured email addresses
echo.
echo ==========================================
echo 🔧 TROUBLESHOOTING:
echo ==========================================
echo ▶ 500 Error: Check payment debug logs
echo ▶ No Emails: Check email test endpoint
echo ▶ Stripe Error: Verify Stripe configuration
echo ▶ Translation Error: Restart server after clearing cache
echo.
echo Press any key to start the development server...
pause

php artisan serve --host=127.0.0.1 --port=8000
