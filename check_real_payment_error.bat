@echo off
echo ==========================================
echo     CHECKING REAL PAYMENT ERROR
echo ==========================================
echo.

echo Step 1: Reading the latest Laravel log entries...
if exist "storage\logs\laravel.log" (
    echo.
    echo === MOST RECENT ERROR ENTRIES ===
    powershell "Get-Content 'storage\logs\laravel.log' -Tail 50 | Where-Object { $_ -match 'ERROR|Exception|Fatal|payment|confirm|ContactPurchase' }"
    
    echo.
    echo === SPECIFIC PAYMENT ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'payment.*confirm|ContactPurchase|stripe_payment_intent' -Context 5 | Select-Object -Last 20"
    
    echo.
    echo === STACK TRACE INFORMATION ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'Stack trace:|#[0-9]' | Select-Object -Last 20"
    
) else (
    echo Laravel log file not found at storage\logs\laravel.log
)

echo.
echo Step 2: Checking current PaymentController...
if exist "app\Http\Controllers\PaymentController.php" (
    echo PaymentController exists
    php artisan tinker --execute="
    try {
        \$controller = new \App\Http\Controllers\PaymentController();
        echo 'PaymentController loads: OK' . PHP_EOL;
        
        if (method_exists(\$controller, 'confirmPayment')) {
            echo 'confirmPayment method: EXISTS' . PHP_EOL;
        } else {
            echo 'confirmPayment method: MISSING' . PHP_EOL;
        }
    } catch (\Exception \$e) {
        echo 'PaymentController error: ' . \$e->getMessage() . PHP_EOL;
        echo 'File: ' . \$e->getFile() . ':' . \$e->getLine() . PHP_EOL;
    }
    "
) else (
    echo PaymentController file missing!
)

echo.
echo Step 3: Testing route registration...
php artisan route:list | findstr "payment.*confirm"

echo.
echo Step 4: Testing database connectivity...
php artisan tinker --execute="
try {
    \DB::connection()->getPdo();
    echo 'Database connection: OK' . PHP_EOL;
    
    // Check contact_purchases table structure
    if (\Schema::hasTable('contact_purchases')) {
        \$columns = \Schema::getColumnListing('contact_purchases');
        echo 'contact_purchases table exists with columns: ' . implode(', ', \$columns) . PHP_EOL;
        
        // Check if we can insert a test record
        \$testRecord = [
            'id' => \Illuminate\Support\Str::uuid(),
            'agent_id' => \Illuminate\Support\Str::uuid(),
            'property_id' => \Illuminate\Support\Str::uuid(),
            'stripe_payment_intent_id' => 'pi_test_structure_' . time(),
            'montant_paye' => 15.00,
            'devise' => 'eur',
            'statut_paiement' => 'test',
            'created_at' => now(),
            'updated_at' => now()
        ];
        
        \DB::table('contact_purchases')->insert(\$testRecord);
        \DB::table('contact_purchases')->where('id', \$testRecord['id'])->delete();
        echo 'Database insert/delete: OK' . PHP_EOL;
        
    } else {
        echo 'contact_purchases table: MISSING' . PHP_EOL;
    }
    
} catch (\Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 5: Creating a minimal test route...
php artisan tinker --execute="
// Test if we can manually create the route and controller logic
try {
    echo 'Testing basic payment confirmation logic...' . PHP_EOL;
    
    // Simulate the request data
    \$mockRequest = new \stdClass();
    \$mockRequest->payment_intent_id = 'pi_test_' . time();
    \$mockRequest->property_id = \Illuminate\Support\Str::uuid();
    
    echo 'Mock request created' . PHP_EOL;
    
    // Test basic validation
    if (empty(\$mockRequest->payment_intent_id)) {
        echo 'Validation would fail: missing payment_intent_id' . PHP_EOL;
    } else {
        echo 'Validation would pass' . PHP_EOL;
    }
    
} catch (\Exception \$e) {
    echo 'Basic logic test failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo ==========================================
echo        DIAGNOSIS COMPLETE
echo ==========================================
echo.
echo Check the log output above for:
echo 1. Specific error messages from Laravel
echo 2. Missing database tables or columns
echo 3. Controller loading issues
echo 4. Route registration problems
echo.
pause
