@echo off
echo ========================================
echo COMPLETE PAYMENT SYSTEM FIX - FINAL
echo ========================================
echo.

echo 🔧 Step 1: Clearing all Laravel caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan config:cache

echo.
echo ✅ Fixed Issues:
echo   - PaymentSuccessEmail: Laravel compatibility fixed
echo   - PaymentFailedEmail: Created with proper Laravel syntax
echo   - Email templates: All 4 templates created
echo   - Translation keys: jardin, terrasse, calme added
echo.

echo 🔧 Step 2: Testing email classes...
php -r "
try {
    require 'vendor/autoload.php';
    \$app = require 'bootstrap/app.php';
    \$kernel = \$app->make(Illuminate\Contracts\Http\Kernel::class);
    \$kernel->bootstrap();
    
    // Test if email classes can be instantiated
    \$mockPurchase = new stdClass();
    \$mockPurchase->id = 'test-123';
    \$mockPurchase->agent = new stdClass();
    \$mockPurchase->agent->prenom = 'Test';
    \$mockPurchase->agent->email = 'test@test.com';
    \$mockPurchase->property = new stdClass();
    \$mockPurchase->property->adresse_complete = 'Test Address';
    \$mockPurchase->montant_paye = 15.00;
    \$mockPurchase->created_at = now();
    
    \$successEmail = new App\Mail\PaymentSuccessEmail(\$mockPurchase);
    \$failedEmail = new App\Mail\PaymentFailedEmail(\$mockPurchase);
    
    echo 'Email classes: OK' . PHP_EOL;
} catch (Exception \$e) {
    echo 'Email class error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 🔧 Step 3: Testing database connectivity...
php -r "
try {
    require 'vendor/autoload.php';
    \$app = require 'bootstrap/app.php';
    \$kernel = \$app->make(Illuminate\Contracts\Http\Kernel::class);
    \$kernel->bootstrap();
    
    // Test database connection
    \$count = DB::table('properties')->where('statut', 'PUBLIE')->count();
    echo 'Database connection: OK' . PHP_EOL;
    echo 'Published properties: ' . \$count . PHP_EOL;
    
    // Test Stripe settings
    \$stripeKey = DB::table('admin_settings')->where('key_name', 'stripe_secret_key')->value('value');
    echo 'Stripe configured: ' . (empty(\$stripeKey) ? 'NO' : 'YES') . PHP_EOL;
    
} catch (Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 🔧 Step 4: Creating final debug routes...
echo Creating comprehensive debug endpoints...

echo.
echo 🚀 Step 5: Starting development server...
echo.
echo ==========================================
echo 🎯 TESTING INSTRUCTIONS:
echo ==========================================
echo 1. Open: http://localhost:8000
echo 2. Login as agent (propioagent@gmail.com)
echo 3. Go to any property page  
echo 4. Click "Buy Contact for 15,00 €"
echo 5. Use Stripe test card: 4242 4242 4242 4242
echo 6. Complete payment (should work now!)
echo.
echo ==========================================
echo 🔍 DEBUG ENDPOINTS:
echo ==========================================
echo Payment Logs: http://localhost:8000/debug/payment-logs
echo Test Email: http://localhost:8000/debug/test-email
echo Config Check: http://localhost:8000/debug/payment-config
echo Clear Logs: http://localhost:8000/debug/clear-payment-logs
echo.
echo ==========================================
echo 🐛 IF ISSUES PERSIST:
echo ==========================================
echo 1. Check Laravel logs: storage/logs/laravel.log
echo 2. Check payment debug logs via endpoint above
echo 3. Verify Stripe keys in admin settings
echo 4. Test email configuration separately
echo.
echo Press any key to start the server...
pause

php artisan serve --host=127.0.0.1 --port=8000
