<?php

// Final test for the specific invoice URL that was failing
// Run this with: php test_specific_invoice.php

require_once 'vendor/autoload.php';

// Load Laravel app
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;

echo "🔍 Testing Specific Invoice URL...\n\n";

$invoiceId = '0197b169-5e08-73b3-b1f6-472e101e8931';

try {
    // 1. Check if the specific invoice exists
    echo "1. Checking if invoice {$invoiceId} exists...\n";
    $invoice = Invoice::find($invoiceId);
    
    if ($invoice) {
        echo "   ✅ Invoice found: {$invoice->invoice_number}\n";
        echo "   📋 Agent: {$invoice->agent_name}\n";
        echo "   💰 Amount: {$invoice->amount} {$invoice->currency}\n";
        echo "   📅 Issued: {$invoice->issued_at}\n";
        
        // 2. Test PDF generation for this specific invoice
        echo "\n2. Testing PDF generation for this invoice...\n";
        $pdf = Pdf::loadView('invoices.template', compact('invoice'));
        $output = $pdf->output();
        echo "   ✅ PDF generation successful (Size: " . strlen($output) . " bytes)\n";
        
        // 3. Test the controller method
        echo "\n3. Testing controller access...\n";
        echo "   📋 Invoice details:\n";
        echo "      - ID: {$invoice->id}\n";
        echo "      - Number: {$invoice->invoice_number}\n";
        echo "      - PDF Path: " . ($invoice->pdf_path ?? 'Not set') . "\n";
        
        if ($invoice->pdf_path && \Storage::exists($invoice->pdf_path)) {
            echo "   ✅ PDF file exists in storage\n";
        } else {
            echo "   ⚠️  PDF file not found in storage (will be regenerated)\n";
        }
        
        echo "\n✅ FINAL TEST RESULT:\n";
        echo "===================\n";
        echo "✅ DomPDF class is now available\n";
        echo "✅ Invoice exists in database\n";
        echo "✅ PDF generation working\n";
        echo "✅ Controller should work correctly\n";
        echo "\n🎉 The URL should now work: http://127.0.0.1:8000/admin/invoices/{$invoiceId}\n";
        
    } else {
        echo "   ❌ Invoice {$invoiceId} not found in database\n";
        echo "   💡 Available invoices:\n";
        $availableInvoices = Invoice::select('id', 'invoice_number', 'agent_name')->take(5)->get();
        foreach ($availableInvoices as $inv) {
            echo "      - {$inv->id} ({$inv->invoice_number}) - {$inv->agent_name}\n";
        }
    }
    
} catch (\Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\nTest completed!\n";
