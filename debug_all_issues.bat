@echo off
echo ==========================================
echo    COMPLETE SYSTEM DEBUG AND REPAIR
echo ==========================================
echo.

echo Step 1: Checking Laravel error logs for 500 error details...
if exist "storage\logs\laravel.log" (
    echo.
    echo === MOST RECENT 500 ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'ERROR.*500|Exception.*payment|CRITICAL|EMERGENCY' -Context 5 | Select-Object -Last 30"
    
    echo.
    echo === PAYMENT CONFIRMATION ERRORS ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'confirmPayment|payment.*confirm|contact_purchases' -Context 3 | Select-Object -Last 20"
    
    echo.
    echo === STACK TRACES ===
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'Stack trace:|#[0-9].*App\\' | Select-Object -Last 15"
    
) else (
    echo Laravel log file not found
)

echo.
echo Step 2: Checking payment debug log...
if exist "storage\logs\payment_debug.log" (
    echo.
    echo === PAYMENT DEBUG LOG ===
    type "storage\logs\payment_debug.log"
) else (
    echo Payment debug log not found
)

echo.
echo Step 3: Testing current PaymentController...
php artisan tinker --execute="
try {
    echo 'Testing PaymentController...' . PHP_EOL;
    \$controller = new \App\Http\Controllers\PaymentController();
    echo 'PaymentController instantiation: OK' . PHP_EOL;
    
    \$methods = get_class_methods(\$controller);
    echo 'Available methods: ' . implode(', ', \$methods) . PHP_EOL;
    
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
echo Step 4: Checking database structure...
php artisan tinker --execute="
try {
    // Check contact_purchases table
    if (\Schema::hasTable('contact_purchases')) {
        \$columns = \Schema::getColumnListing('contact_purchases');
        echo 'contact_purchases columns: ' . implode(', ', \$columns) . PHP_EOL;
        
        // Test insert
        \$testId = \Illuminate\Support\Str::uuid();
        try {
            \DB::table('contact_purchases')->insert([
                'id' => \$testId,
                'agent_id' => \Illuminate\Support\Str::uuid(),
                'property_id' => \Illuminate\Support\Str::uuid(),
                'stripe_payment_intent_id' => 'pi_test_db_' . time(),
                'montant_paye' => 15.00,
                'devise' => 'eur',
                'statut_paiement' => 'test',
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            \DB::table('contact_purchases')->where('id', \$testId)->delete();
            echo 'Database insert/delete: OK' . PHP_EOL;
        } catch (\Exception \$e) {
            echo 'Database operation failed: ' . \$e->getMessage() . PHP_EOL;
        }
    } else {
        echo 'contact_purchases table: MISSING' . PHP_EOL;
    }
    
} catch (\Exception \$e) {
    echo 'Database check failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 5: Checking route registration...
php artisan route:list | findstr "payment.*confirm"

echo.
echo Step 6: Testing mail configuration...
php artisan tinker --execute="
try {
    echo 'Mail configuration check:' . PHP_EOL;
    echo 'Mail driver: ' . config('mail.default') . PHP_EOL;
    echo 'SMTP host: ' . config('mail.mailers.smtp.host') . PHP_EOL;
    echo 'SMTP username: ' . config('mail.mailers.smtp.username') . PHP_EOL;
    echo 'From address: ' . config('mail.from.address') . PHP_EOL;
    
    // Test basic mail functionality
    \Mail::raw('Test email from debug', function(\$message) {
        \$message->to('test@example.com')->subject('Debug Test');
    });
    echo 'Basic mail test: OK' . PHP_EOL;
    
} catch (\Exception \$e) {
    echo 'Mail test failed: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 7: Checking user authentication...
php artisan tinker --execute="
\$agentCount = \App\Models\User::where('type_utilisateur', 'AGENT')->count();
\$adminCount = \App\Models\User::where('type_utilisateur', 'ADMIN')->count();
\$propertyCount = \App\Models\Property::where('statut', 'PUBLIE')->count();

echo 'Agent users: ' . \$agentCount . PHP_EOL;
echo 'Admin users: ' . \$adminCount . PHP_EOL;
echo 'Published properties: ' . \$propertyCount . PHP_EOL;

if (\$agentCount > 0) {
    \$agent = \App\Models\User::where('type_utilisateur', 'AGENT')->first();
    echo 'Sample agent: ' . \$agent->email . ' (ID: ' . \$agent->id . ')' . PHP_EOL;
}
"

echo.
echo ==========================================
echo        CREATING EMERGENCY FIX
echo ==========================================
echo.

echo Creating bulletproof PaymentController...
pause
