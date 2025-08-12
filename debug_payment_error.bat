@echo off
echo ==========================================
echo       DEBUGGING PAYMENT ERROR
echo ==========================================
echo.

echo Step 1: Checking Laravel logs for payment errors...
echo.
if exist "storage\logs\laravel.log" (
    echo Recent Laravel errors:
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'ERROR|Exception|payment|stripe' | Select-Object -Last 10"
) else (
    echo No log file found.
)

echo.
echo Step 2: Checking database connection...
php artisan tinker --execute="
try {
    \DB::connection()->getPdo();
    echo 'Database connection: OK' . PHP_EOL;
    
    // Check if admin_settings table exists
    \$tableExists = \Schema::hasTable('admin_settings');
    echo 'admin_settings table exists: ' . (\$tableExists ? 'YES' : 'NO') . PHP_EOL;
    
    if (\$tableExists) {
        \$stripeSettings = \DB::table('admin_settings')
            ->whereIn('key_name', ['stripe_publishable_key', 'stripe_secret_key'])
            ->count();
        echo 'Stripe settings count: ' . \$stripeSettings . PHP_EOL;
    }
    
} catch (\Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 3: Checking Stripe configuration...
php artisan tinker --execute="
try {
    \$controller = new \App\Http\Controllers\PaymentController();
    echo 'PaymentController initialized successfully' . PHP_EOL;
} catch (\Exception \$e) {
    echo 'PaymentController error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 4: Testing payment route...
php artisan route:list | findstr payment

echo.
echo Step 5: Checking required models...
php artisan tinker --execute="
try {
    \$property = \App\Models\Property::first();
    echo 'Property model: ' . (\$property ? 'OK' : 'No properties found') . PHP_EOL;
    
    \$user = \App\Models\User::where('type_utilisateur', 'AGENT')->first();
    echo 'Agent user: ' . (\$user ? 'OK' : 'No agents found') . PHP_EOL;
    
    echo 'ContactPurchase model: OK' . PHP_EOL;
} catch (\Exception \$e) {
    echo 'Model error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo ==========================================
echo           DEBUG COMPLETE
echo ==========================================
echo.
echo Next steps:
echo 1. Check the Laravel log output above for specific errors
echo 2. Ensure admin_settings table has Stripe configuration
echo 3. Make sure you're logged in as an AGENT user
echo 4. Verify the property exists and is published
echo.
pause
