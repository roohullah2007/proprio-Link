<?php

// Manual migration script for invoices table
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "=== MANUAL INVOICES TABLE CREATION ===\n\n";

try {
    // Check if invoices table exists
    $tableExists = Schema::hasTable('invoices');
    
    if ($tableExists) {
        echo "✅ Invoices table already exists!\n";
    } else {
        echo "⚠️ Invoices table doesn't exist. Creating it now...\n";
        
        // Create invoices table manually
        Schema::create('invoices', function ($table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->uuid('contact_purchase_id');
            $table->string('agent_name');
            $table->string('agent_email');
            $table->string('property_reference');
            $table->decimal('amount', 8, 2);
            $table->string('currency', 3);
            $table->json('billing_details');
            $table->string('pdf_path')->nullable();
            $table->timestamp('issued_at');
            $table->timestamps();

            $table->foreign('contact_purchase_id')->references('id')->on('contact_purchases');
            $table->index('invoice_number');
            $table->index('issued_at');
        });
        
        echo "✅ Invoices table created successfully!\n";
    }
    
    // Check if contact_purchases table exists
    $contactPurchasesExists = Schema::hasTable('contact_purchases');
    
    if (!$contactPurchasesExists) {
        echo "⚠️ Contact purchases table doesn't exist. Creating it now...\n";
        
        Schema::create('contact_purchases', function ($table) {
            $table->uuid('id')->primary();
            $table->uuid('agent_id');
            $table->uuid('property_id');
            $table->string('stripe_payment_intent_id');
            $table->decimal('montant_paye', 8, 2);
            $table->string('devise', 3);
            $table->string('statut_paiement');
            $table->text('donnees_contact')->nullable();
            $table->timestamp('paiement_confirme_a')->nullable();
            $table->timestamps();

            $table->foreign('agent_id')->references('id')->on('users');
            $table->foreign('property_id')->references('id')->on('properties');
            $table->index('statut_paiement');
            $table->index('agent_id');
        });
        
        echo "✅ Contact purchases table created successfully!\n";
    } else {
        echo "✅ Contact purchases table exists!\n";
    }
    
    // Check if admin_settings table has SMTP settings
    echo "\nChecking SMTP settings...\n";
    $smtpSettings = DB::table('admin_settings')
        ->whereIn('key_name', ['smtp_enabled', 'smtp_host', 'smtp_port'])
        ->count();
    
    if ($smtpSettings < 3) {
        echo "⚠️ Adding SMTP settings...\n";
        
        $smtpDefaultSettings = [
            ['key_name' => 'smtp_enabled', 'value' => 'false', 'description' => 'Enable custom SMTP', 'category' => 'email'],
            ['key_name' => 'smtp_host', 'value' => '', 'description' => 'SMTP host', 'category' => 'email'],
            ['key_name' => 'smtp_port', 'value' => '587', 'description' => 'SMTP port', 'category' => 'email'],
            ['key_name' => 'smtp_username', 'value' => '', 'description' => 'SMTP username', 'category' => 'email'],
            ['key_name' => 'smtp_password', 'value' => '', 'description' => 'SMTP password', 'category' => 'email'],
            ['key_name' => 'smtp_encryption', 'value' => 'tls', 'description' => 'SMTP encryption', 'category' => 'email'],
            ['key_name' => 'smtp_from_address', 'value' => '', 'description' => 'From email', 'category' => 'email'],
            ['key_name' => 'smtp_from_name', 'value' => 'Propio', 'description' => 'From name', 'category' => 'email'],
        ];

        foreach ($smtpDefaultSettings as $setting) {
            $setting['created_at'] = now();
            $setting['updated_at'] = now();
            
            DB::table('admin_settings')->updateOrInsert(
                ['key_name' => $setting['key_name']],
                $setting
            );
        }
        
        echo "✅ SMTP settings added!\n";
    } else {
        echo "✅ SMTP settings exist!\n";
    }
    
    echo "\n=== SUMMARY ===\n";
    echo "✅ All required tables are now ready!\n";
    echo "✅ Invoice system should work properly now!\n";
    echo "\nYou can now:\n";
    echo "1. Go to /admin/invoices\n";
    echo "2. Go to /agent/invoices\n";
    echo "3. Go to /admin/settings for SMTP configuration\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "\nTry running this first:\n";
    echo "php artisan migrate\n";
}
