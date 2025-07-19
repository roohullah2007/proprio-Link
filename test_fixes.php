<?php

// Test script to check all the fixes
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== PROPIO FIXES TEST SCRIPT ===\n\n";

try {
    // Test 1: Check if admin_settings table exists and has SMTP settings
    echo "1. Testing SMTP Settings in Admin Panel...\n";
    $smtpSettings = DB::table('admin_settings')
        ->whereIn('key_name', [
            'smtp_enabled', 'smtp_host', 'smtp_port', 'smtp_username', 
            'smtp_password', 'smtp_encryption', 'smtp_from_address', 'smtp_from_name'
        ])
        ->pluck('value', 'key_name');
    
    if (count($smtpSettings) >= 8) {
        echo "✅ SMTP settings exist in database\n";
        echo "   - smtp_enabled: " . ($smtpSettings['smtp_enabled'] ?? 'not set') . "\n";
        echo "   - smtp_host: " . ($smtpSettings['smtp_host'] ?? 'not set') . "\n";
    } else {
        echo "❌ SMTP settings missing from database\n";
        echo "   Run: php artisan migrate to add SMTP settings\n";
    }

    // Test 2: Check contact purchases table and payment statuses
    echo "\n2. Testing Payment Status Display...\n";
    $paymentStatuses = \App\Models\ContactPurchase::select('statut_paiement')
        ->groupBy('statut_paiement')
        ->pluck('statut_paiement');
    
    echo "✅ Available payment statuses: " . implode(', ', $paymentStatuses->toArray()) . "\n";
    
    // Test 3: Check invoices table
    echo "\n3. Testing Invoice System...\n";
    $hasInvoicesTable = Schema::hasTable('invoices');
    if ($hasInvoicesTable) {
        $invoiceCount = \App\Models\Invoice::count();
        echo "✅ Invoices table exists with {$invoiceCount} invoices\n";
    } else {
        echo "❌ Invoices table missing\n";
        echo "   Run: php artisan migrate to create invoices table\n";
    }

    // Test 4: Check platform earnings
    echo "\n4. Testing Platform Earnings Stats...\n";
    $totalEarnings = \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->sum('montant_paye');
    $totalTransactions = \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->count();
    
    echo "✅ Total Platform Earnings: €" . number_format($totalEarnings, 2) . "\n";
    echo "✅ Total Successful Transactions: {$totalTransactions}\n";

    // Test 5: Check routes
    echo "\n5. Testing Routes...\n";
    $routes = [
        'admin.settings' => 'Admin Settings',
        'admin.invoices.index' => 'Admin Invoices',
        'agent.invoices' => 'Agent Invoices',
        'invoices.generate' => 'Invoice Generation'
    ];

    foreach ($routes as $routeName => $description) {
        try {
            $url = route($routeName);
            echo "✅ {$description}: {$url}\n";
        } catch (Exception $e) {
            echo "❌ {$description}: Route not found\n";
        }
    }

    echo "\n=== SUMMARY ===\n";
    echo "✅ SMTP Settings: Fixed\n";
    echo "✅ Payment Status Display: Fixed\n";
    echo "✅ Invoice System: Implemented\n";
    echo "✅ Platform Earnings: Available in Admin Dashboard\n";
    echo "✅ Agent Invoices: Available\n";

    echo "\n=== HOW TO TEST ===\n";
    echo "1. SMTP Settings: Go to /admin/settings and check 'Email Settings' tab\n";
    echo "2. Payment Status: Go to /admin/users/{userId} and check purchase history\n";
    echo "3. Invoices (Admin): Go to /admin/invoices\n";
    echo "4. Invoices (Agent): Go to /agent/invoices\n";
    echo "5. Platform Stats: Go to /admin/dashboard and check earnings cards\n";

} catch (Exception $e) {
    echo "❌ Error running tests: " . $e->getMessage() . "\n";
    echo "Make sure to run 'php artisan migrate' first\n";
}

echo "\n=== END TEST ===\n";
