@echo off
echo ==========================================
echo    DEBUGGING PAYMENT 500 ERROR
echo ==========================================
echo.

echo Step 1: Checking recent Laravel errors...
if exist "storage\logs\laravel.log" (
    echo Most recent errors:
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'ERROR|Exception|Fatal|payment|confirm' | Select-Object -Last 15"
    echo.
    echo Full error context for payment-related issues:
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'payment|confirm' -Context 2 | Select-Object -Last 20"
) else (
    echo No log file found.
)

echo.
echo Step 2: Testing payment route directly...
php artisan route:list | findstr payment

echo.
echo Step 3: Checking database connections...
php artisan tinker --execute="
try {
    \DB::connection()->getPdo();
    echo 'Database connection: OK' . PHP_EOL;
    
    // Check required tables
    \$tables = ['users', 'properties', 'contact_purchases', 'admin_settings'];
    foreach (\$tables as \$table) {
        if (\Schema::hasTable(\$table)) {
            echo 'Table ' . \$table . ': EXISTS' . PHP_EOL;
        } else {
            echo 'Table ' . \$table . ': MISSING' . PHP_EOL;
        }
    }
} catch (\Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 4: Testing PaymentController initialization...
php artisan tinker --execute="
try {
    \$controller = new \App\Http\Controllers\PaymentController();
    echo 'PaymentController: OK' . PHP_EOL;
} catch (\Exception \$e) {
    echo 'PaymentController error: ' . \$e->getMessage() . PHP_EOL;
    echo 'Stack trace: ' . \$e->getTraceAsString() . PHP_EOL;
}
"

echo.
echo Step 5: Checking Stripe configuration...
php artisan tinker --execute="
try {
    // Check if admin_settings table has Stripe config
    \$stripeKey = \DB::table('admin_settings')->where('key_name', 'stripe_secret_key')->value('value');
    echo 'Stripe secret key in DB: ' . (\$stripeKey ? 'SET' : 'NOT SET') . PHP_EOL;
    
    \$stripePublic = \DB::table('admin_settings')->where('key_name', 'stripe_publishable_key')->value('value');
    echo 'Stripe publishable key in DB: ' . (\$stripePublic ? 'SET' : 'NOT SET') . PHP_EOL;
    
    // Check env fallbacks
    echo 'STRIPE_SECRET in env: ' . (env('STRIPE_SECRET') ? 'SET' : 'NOT SET') . PHP_EOL;
    echo 'STRIPE_KEY in env: ' . (env('STRIPE_KEY') ? 'SET' : 'NOT SET') . PHP_EOL;
    
} catch (\Exception \$e) {
    echo 'Stripe config check error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 6: Testing contact purchase model...
php artisan tinker --execute="
try {
    \$model = new \App\Models\ContactPurchase();
    echo 'ContactPurchase model: OK' . PHP_EOL;
    
    // Check fillable fields
    echo 'Fillable fields: ' . implode(', ', \$model->getFillable()) . PHP_EOL;
    
} catch (\Exception \$e) {
    echo 'ContactPurchase model error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo ==========================================
echo        DIAGNOSIS COMPLETE
echo ==========================================
echo.
echo Check the output above for specific errors.
echo The most likely issues are:
echo 1. Database table missing or incorrect structure
echo 2. Stripe configuration problems
echo 3. Missing or corrupted model files
echo 4. PHP memory or execution time limits
echo.
pause
