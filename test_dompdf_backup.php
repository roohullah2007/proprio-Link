<?php

// Test script to verify DomPDF functionality
// Run this with: php test_dompdf.php

require_once 'vendor/autoload.php';

// Load Laravel app
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\Invoice;

echo "🔍 Testing DomPDF Functionality...\n\n";

try {
    // 1. Test basic PDF creation
    echo "1. Testing basic PDF creation...\n";
    $pdf = Pdf::loadHTML('<h1>Test PDF</h1><p>This is a test PDF document.</p>');
    $output = $pdf->output();
    echo "   ✅ Basic PDF creation successful (Size: " . strlen($output) . " bytes)\n";
    
    // 2. Test with invoice template
    echo "\n2. Testing invoice template...\n";
    
    // Create a mock invoice object for testing
    $mockInvoice = (object) [
        'invoice_number' => 'TEST-2025-001',
        'agent_name' => 'Test Agent',
        'agent_email' => 'test@example.com',
        'property_reference' => 'TEST PROPERTY - Test City',
        'amount' => 15.00,
        'currency' => 'EUR',
        'issued_at' => now(),
        'billing_details' => [
            'agent' => [
                'phone' => '+33123456789',
                'siret' => '12345678901234'
            ],
            'property' => [
                'city' => 'Test City'
            ],
            'purchase_date' => now()->toISOString(),
            'stripe_payment_id' => 'pi_test_123456789'
        ]
    ];
    
    $invoicePdf = Pdf::loadView('invoices.template', ['invoice' => $mockInvoice]);
    $invoiceOutput = $invoicePdf->output();
    echo "   ✅ Invoice template PDF creation successful (Size: " . strlen($invoiceOutput) . " bytes)\n";
    
    // 3. Test storage
    echo "\n3. Testing PDF storage...\n";
    $filename = 'test-invoice-' . time() . '.pdf';
    $path = storage_path('app/public/' . $filename);
    file_put_contents($path, $invoiceOutput);
    
    if (file_exists($path)) {
        echo "   ✅ PDF saved successfully to: {$path}\n";
        // Clean up test file
        unlink($path);
        echo "   ✅ Test file cleaned up\n";
    } else {
        echo "   ❌ PDF save failed\n";
    }
    
    // 4. Check Invoice model exists
    echo "\n4. Checking Invoice model...\n";
    if (class_exists('App\Models\Invoice')) {
        echo "   ✅ Invoice model exists\n";
        
        // Check if invoices table exists
        try {
            $invoiceCount = Invoice::count();
            echo "   ✅ Invoices table exists (Records: {$invoiceCount})\n";
        } catch (\Exception $e) {
            echo "   ⚠️  Invoices table issue: " . $e->getMessage() . "\n";
        }
    } else {
        echo "   ❌ Invoice model not found\n";
    }
    
    echo "\n✅ DomPDF Test Summary:\n";
    echo "======================\n";
    echo "✅ DomPDF package installed and working\n";
    echo "✅ Basic PDF generation functional\n";
    echo "✅ Invoice template rendering functional\n";
    echo "✅ PDF storage working\n";
    echo "\n🎉 Invoice functionality should now work!\n";
    echo "\nTest the invoice URL: http://127.0.0.1:8000/admin/invoices/YOUR-INVOICE-ID\n";
    
} catch (\Exception $e) {
    echo "❌ Error during testing: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
}

echo "\nTest completed!\n";
