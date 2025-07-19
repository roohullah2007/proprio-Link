<?php

// Script to generate missing invoices for existing successful purchases
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== GENERATING MISSING INVOICES ===\n\n";

try {
    // Check if required tables exist
    if (!Schema::hasTable('invoices')) {
        echo "❌ Invoices table doesn't exist. Run migrations first:\n";
        echo "   php artisan migrate\n";
        exit(1);
    }

    if (!Schema::hasTable('contact_purchases')) {
        echo "❌ Contact purchases table doesn't exist. Run migrations first:\n";
        echo "   php artisan migrate\n";
        exit(1);
    }

    // Find successful purchases without invoices
    $purchasesWithoutInvoices = \App\Models\ContactPurchase::with(['agent', 'property'])
        ->where('statut_paiement', \App\Models\ContactPurchase::STATUS_SUCCEEDED)
        ->whereDoesntHave('invoice')
        ->get();

    echo "Found {$purchasesWithoutInvoices->count()} successful purchases without invoices.\n\n";

    if ($purchasesWithoutInvoices->isEmpty()) {
        echo "✅ All successful purchases already have invoices!\n";
        
        // Show current stats
        $totalInvoices = \App\Models\Invoice::count();
        $totalRevenue = \App\Models\Invoice::sum('amount');
        
        echo "\n📊 Current Statistics:\n";
        echo "   Total Invoices: {$totalInvoices}\n";
        echo "   Total Revenue: €" . number_format($totalRevenue, 2) . "\n";
        exit(0);
    }

    $generated = 0;
    echo "Generating invoices...\n";

    foreach ($purchasesWithoutInvoices as $purchase) {
        try {
            $invoice = $purchase->generateInvoice();
            if ($invoice) {
                $generated++;
                echo "✅ Generated invoice {$invoice->invoice_number} for {$purchase->agent->prenom} {$purchase->agent->nom}\n";
                echo "   Amount: €{$purchase->montant_paye} | Property: " . 
                     ($purchase->property ? $purchase->property->ville : 'N/A') . "\n";
            }
        } catch (\Exception $e) {
            echo "❌ Failed to generate invoice for purchase {$purchase->id}: " . $e->getMessage() . "\n";
        }
    }

    echo "\n=== SUMMARY ===\n";
    echo "✅ Successfully generated {$generated} invoices!\n";
    
    // Show updated stats
    $totalInvoices = \App\Models\Invoice::count();
    $totalRevenue = \App\Models\Invoice::sum('amount');
    $totalTransactions = \App\Models\ContactPurchase::where('statut_paiement', 'succeeded')->count();
    
    echo "\n📊 Updated Statistics:\n";
    echo "   Total Invoices: {$totalInvoices}\n";
    echo "   Total Revenue: €" . number_format($totalRevenue, 2) . "\n";
    echo "   Total Successful Transactions: {$totalTransactions}\n";
    
    if ($totalInvoices === $totalTransactions) {
        echo "✅ All successful purchases now have invoices!\n";
    } else {
        echo "⚠️ Some purchases may still be missing invoices.\n";
    }

    echo "\n🎉 Invoice generation complete!\n";
    echo "Now check:\n";
    echo "   - Admin: /admin/invoices (should show {$totalInvoices} invoices)\n";
    echo "   - Agent: /agent/invoices (should show download buttons)\n";

} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nMake sure to:\n";
    echo "1. Run migrations: php artisan migrate\n";
    echo "2. Check database connection\n";
    echo "3. Verify tables exist\n";
}
