@echo off
echo ==========================================
echo    COMPREHENSIVE 500 ERROR DIAGNOSIS
echo ==========================================
echo.

echo Step 1: Checking Laravel logs for specific errors...
if exist "storage\logs\laravel.log" (
    echo.
    echo === RECENT ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'ERROR|EMERGENCY|ALERT|CRITICAL' | Select-Object -Last 20"
    
    echo.
    echo === PAYMENT-RELATED ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'payment|confirm|stripe|contact.*purchase' -Context 3 | Select-Object -Last 30"
    
    echo.
    echo === STACK TRACES ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'Stack trace|#[0-9]' | Select-Object -Last 15"
    
    echo.
    echo === DATABASE ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'database|sql|connection' -Context 2 | Select-Object -Last 15"
    
) else (
    echo No log file found at storage\logs\laravel.log
)

echo.
echo Step 2: Testing database structure...
php artisan tinker --execute="
echo 'Checking database structure...' . PHP_EOL;

// Check if contact_purchases table exists and has correct structure
try {
    if (\Schema::hasTable('contact_purchases')) {
        echo 'contact_purchases table: EXISTS' . PHP_EOL;
        
        \$columns = \Schema::getColumnListing('contact_purchases');
        echo 'Columns: ' . implode(', ', \$columns) . PHP_EOL;
        
        // Try to insert a test record to check for structure issues
        \$testId = \Illuminate\Support\Str::uuid();
        \DB::table('contact_purchases')->insert([
            'id' => \$testId,
            'agent_id' => \Illuminate\Support\Str::uuid(),
            'property_id' => \Illuminate\Support\Str::uuid(), 
            'stripe_payment_intent_id' => 'pi_test_structure_' . time(),
            'montant_paye' => 15.00,
            'devise' => 'eur',
            'statut_paiement' => 'test',
            'created_at' => now(),
            'updated_at' => now()
        ]);
        
        // Clean up test record
        \DB::table('contact_purchases')->where('id', \$testId)->delete();
        echo 'Table structure: OK' . PHP_EOL;
        
    } else {
        echo 'contact_purchases table: MISSING' . PHP_EOL;
    }
} catch (\Exception \$e) {
    echo 'Table structure error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 3: Testing PaymentController directly...
php artisan tinker --execute="
try {
    echo 'Testing PaymentController instantiation...' . PHP_EOL;
    \$controller = new \App\Http\Controllers\PaymentController();
    echo 'PaymentController: OK' . PHP_EOL;
    
    // Test if the method exists
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

echo.
echo Step 4: Testing route registration...
php artisan route:list | findstr payment

echo.
echo Step 5: Checking for class conflicts...
php artisan tinker --execute="
echo 'Checking for class conflicts...' . PHP_EOL;

// Check if required classes exist
\$classes = [
    'App\Models\ContactPurchase',
    'App\Models\Property', 
    'App\Models\User',
    'App\Mail\PaymentSuccessEmail',
    'App\Mail\PropertyContactPurchased'
];

foreach (\$classes as \$class) {
    if (class_exists(\$class)) {
        echo \$class . ': OK' . PHP_EOL;
    } else {
        echo \$class . ': MISSING' . PHP_EOL;
    }
}
"

echo.
echo Step 6: Checking authentication middleware...
php artisan tinker --execute="
echo 'Checking authentication...' . PHP_EOL;

// Check if we have agent users
\$agentCount = \App\Models\User::where('type_utilisateur', 'AGENT')->count();
echo 'Agent users: ' . \$agentCount . PHP_EOL;

if (\$agentCount > 0) {
    \$agent = \App\Models\User::where('type_utilisateur', 'AGENT')->first();
    echo 'Sample agent: ' . \$agent->email . ' (ID: ' . \$agent->id . ')' . PHP_EOL;
}

// Check properties
\$propertyCount = \App\Models\Property::where('statut', 'PUBLIE')->count();
echo 'Published properties: ' . \$propertyCount . PHP_EOL;
"

echo.
echo ==========================================
echo          DIAGNOSIS COMPLETE
echo ==========================================
echo.
echo Review the output above for specific error details.
echo Look for:
echo - Database connection errors
echo - Missing table columns  
echo - Class loading issues
echo - Authentication problems
echo - Route registration issues
echo.
pause
