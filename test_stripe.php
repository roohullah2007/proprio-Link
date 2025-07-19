#!/usr/bin/env php
<?php

/**
 * Stripe API Test Script for Propio
 * This script tests the Stripe API connection and configuration
 */

require __DIR__ . '/vendor/autoload.php';

use Stripe\StripeClient;
use Stripe\Exception\ApiErrorException;

// Load environment variables
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '=') !== false && !str_starts_with($line, '#')) {
            [$key, $value] = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value, " \t\n\r\0\x0B\"'");
            $_ENV[$key] = $value;
        }
    }
}

function testStripeAPI() {
    echo "🧪 Testing Stripe API Configuration\n";
    echo "==================================\n\n";

    // Get Stripe keys from environment
    $publishableKey = $_ENV['STRIPE_KEY'] ?? $_ENV['VITE_STRIPE_PUBLISHABLE_KEY'] ?? null;
    $secretKey = $_ENV['STRIPE_SECRET'] ?? null;
    $webhookSecret = $_ENV['STRIPE_WEBHOOK_SECRET'] ?? null;
    $currency = $_ENV['STRIPE_CURRENCY'] ?? 'eur';
    $contactPrice = $_ENV['STRIPE_CONTACT_PRICE'] ?? '15.00';

    echo "📋 Configuration Overview:\n";
    echo "-------------------------\n";
    echo "Publishable Key: " . ($publishableKey ? substr($publishableKey, 0, 12) . '...' : '❌ Not set') . "\n";
    echo "Secret Key: " . ($secretKey ? substr($secretKey, 0, 12) . '...' : '❌ Not set') . "\n";
    echo "Webhook Secret: " . ($webhookSecret ? substr($webhookSecret, 0, 12) . '...' : '❌ Not set') . "\n";
    echo "Currency: " . $currency . "\n";
    echo "Contact Price: €" . $contactPrice . "\n\n";

    if (!$secretKey) {
        echo "❌ ERROR: Stripe secret key is not configured in .env file\n";
        echo "Please add STRIPE_SECRET=sk_test_... to your .env file\n\n";
        return false;
    }

    if (!$publishableKey) {
        echo "⚠️  WARNING: Stripe publishable key is not configured\n";
        echo "Please add STRIPE_KEY=pk_test_... to your .env file\n\n";
    }

    echo "🔌 Testing API Connection:\n";
    echo "--------------------------\n";

    try {
        $stripe = new StripeClient($secretKey);
        
        // Test 1: Retrieve account information
        echo "1️⃣  Testing account retrieval... ";
        $account = $stripe->accounts->retrieve();
        echo "✅ Success\n";
        echo "   Account ID: " . $account->id . "\n";
        echo "   Business Name: " . ($account->business_profile->name ?? 'Not set') . "\n";
        echo "   Country: " . $account->country . "\n";
        echo "   Charges Enabled: " . ($account->charges_enabled ? 'Yes' : 'No') . "\n";
        echo "   Payouts Enabled: " . ($account->payouts_enabled ? 'Yes' : 'No') . "\n\n";

        // Test 2: List payment methods
        echo "2️⃣  Testing payment methods... ";
        $paymentMethods = $stripe->paymentMethods->all(['type' => 'card', 'limit' => 1]);
        echo "✅ Success\n";
        echo "   Available payment methods: " . count($paymentMethods->data) . "\n\n";

        // Test 3: Create a test payment intent (without confirming)
        echo "3️⃣  Testing payment intent creation... ";
        $amount = (int)(floatval($contactPrice) * 100); // Convert to cents
        $paymentIntent = $stripe->paymentIntents->create([
            'amount' => $amount,
            'currency' => $currency,
            'metadata' => [
                'test_mode' => 'true',
                'agent_id' => 'test_agent',
                'property_id' => 'test_property',
            ],
            'description' => 'Test payment intent for Propio configuration check',
        ]);
        echo "✅ Success\n";
        echo "   Payment Intent ID: " . $paymentIntent->id . "\n";
        echo "   Amount: " . ($paymentIntent->amount / 100) . " " . strtoupper($paymentIntent->currency) . "\n";
        echo "   Status: " . $paymentIntent->status . "\n\n";

        // Test 4: Check webhook endpoints
        echo "4️⃣  Testing webhook endpoints... ";
        $webhookEndpoints = $stripe->webhookEndpoints->all(['limit' => 10]);
        echo "✅ Success\n";
        echo "   Configured webhooks: " . count($webhookEndpoints->data) . "\n";
        
        if (count($webhookEndpoints->data) > 0) {
            foreach ($webhookEndpoints->data as $webhook) {
                echo "   - " . $webhook->url . " (enabled: " . ($webhook->enabled ? 'Yes' : 'No') . ")\n";
            }
        } else {
            echo "   ⚠️  No webhook endpoints configured\n";
        }
        echo "\n";

        // Test 5: Check balance
        echo "5️⃣  Testing balance retrieval... ";
        $balance = $stripe->balance->retrieve();
        echo "✅ Success\n";
        echo "   Available balance:\n";
        foreach ($balance->available as $balanceItem) {
            $amount = $balanceItem->amount / 100;
            echo "   - " . $amount . " " . strtoupper($balanceItem->currency) . "\n";
        }
        if (empty($balance->available)) {
            echo "   - No available balance\n";
        }
        echo "\n";

        echo "🎉 All tests passed! Stripe is properly configured.\n\n";

        // Configuration recommendations
        echo "💡 Recommendations:\n";
        echo "-------------------\n";
        
        if (!$account->charges_enabled) {
            echo "⚠️  Charges are not enabled on this account. You may need to complete account setup.\n";
        }
        
        if (!$account->payouts_enabled) {
            echo "⚠️  Payouts are not enabled on this account. You may need to complete account setup.\n";
        }

        if (count($webhookEndpoints->data) === 0) {
            echo "💡 Consider setting up webhook endpoints for better payment tracking:\n";
            echo "   - payment_intent.succeeded\n";
            echo "   - payment_intent.payment_failed\n";
            echo "   - customer.subscription.created\n";
        }

        if (str_contains($secretKey, '_test_')) {
            echo "🧪 You're using test keys. Remember to switch to live keys for production.\n";
        }

        echo "\n";
        return true;

    } catch (ApiErrorException $e) {
        echo "❌ Failed\n";
        echo "   Error: " . $e->getMessage() . "\n";
        echo "   Type: " . $e->getStripeCode() . "\n";
        
        if ($e->getHttpStatus() === 401) {
            echo "\n🔍 This looks like an authentication error.\n";
            echo "   Please check that your STRIPE_SECRET key is correct.\n";
        }
        
        echo "\n";
        return false;
    } catch (Exception $e) {
        echo "❌ Failed\n";
        echo "   Error: " . $e->getMessage() . "\n\n";
        return false;
    }
}

function checkDatabaseSettings() {
    echo "🗄️  Checking Admin Settings in Database\n";
    echo "======================================\n\n";

    try {
        // Simple database connection without Laravel
        $host = $_ENV['DB_HOST'] ?? '127.0.0.1';
        $port = $_ENV['DB_PORT'] ?? '3306';
        $database = $_ENV['DB_DATABASE'] ?? 'propio';
        $username = $_ENV['DB_USERNAME'] ?? 'root';
        $password = $_ENV['DB_PASSWORD'] ?? '';

        $dsn = "mysql:host={$host};port={$port};dbname={$database};charset=utf8mb4";
        $pdo = new PDO($dsn, $username, $password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);

        echo "✅ Database connection successful\n\n";

        // Check if admin_settings table exists
        $tableCheck = $pdo->query("SHOW TABLES LIKE 'admin_settings'")->fetch();
        if (!$tableCheck) {
            echo "❌ admin_settings table does not exist\n";
            echo "   Run: php artisan migrate\n\n";
            return false;
        }

        echo "✅ admin_settings table exists\n\n";

        // Get Stripe settings from database
        $stripeSettings = $pdo->prepare(
            "SELECT key_name, value FROM admin_settings WHERE key_name LIKE 'stripe_%'"
        );
        $stripeSettings->execute();
        $settings = $stripeSettings->fetchAll();

        echo "📋 Stripe Settings in Database:\n";
        echo "-------------------------------\n";

        $settingsFound = false;
        foreach ($settings as $setting) {
            $settingsFound = true;
            $value = $setting['value'];
            
            // Mask sensitive data
            if (in_array($setting['key_name'], ['stripe_secret_key', 'stripe_webhook_secret'])) {
                $value = $value ? substr($value, 0, 12) . '...' : '(empty)';
            }
            
            echo $setting['key_name'] . ": " . $value . "\n";
        }

        if (!$settingsFound) {
            echo "❌ No Stripe settings found in database\n";
            echo "   Please configure Stripe settings through the admin panel\n";
        }

        echo "\n";
        return $settingsFound;

    } catch (PDOException $e) {
        echo "❌ Database connection failed\n";
        echo "   Error: " . $e->getMessage() . "\n\n";
        return false;
    }
}

function showUsageInstructions() {
    echo "📖 Usage Instructions:\n";
    echo "======================\n\n";
    
    echo "🔧 To configure Stripe in Propio:\n";
    echo "---------------------------------\n";
    echo "1. Get your Stripe API keys from https://dashboard.stripe.com/apikeys\n";
    echo "2. Add them to your .env file:\n";
    echo "   STRIPE_KEY=pk_test_your_publishable_key\n";
    echo "   STRIPE_SECRET=sk_test_your_secret_key\n";
    echo "   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret\n";
    echo "   STRIPE_CURRENCY=eur\n";
    echo "   STRIPE_CONTACT_PRICE=15.00\n\n";
    
    echo "3. Or configure through the admin panel:\n";
    echo "   - Login as admin\n";
    echo "   - Go to Admin -> Settings\n";
    echo "   - Navigate to Payment Settings tab\n";
    echo "   - Enter your Stripe keys and test the connection\n\n";
    
    echo "🎯 For production:\n";
    echo "------------------\n";
    echo "- Replace test keys (pk_test_, sk_test_) with live keys (pk_live_, sk_live_)\n";
    echo "- Set up webhook endpoints in Stripe dashboard\n";
    echo "- Test payments thoroughly before going live\n\n";
    
    echo "🔗 Useful links:\n";
    echo "----------------\n";
    echo "- Stripe Dashboard: https://dashboard.stripe.com/\n";
    echo "- API Documentation: https://stripe.com/docs/api\n";
    echo "- Webhooks Guide: https://stripe.com/docs/webhooks\n\n";
}

// Main execution
echo "🚀 Propio Stripe Configuration Test\n";
echo "===================================\n\n";

// Test 1: Check Stripe API
$stripeWorking = testStripeAPI();

// Test 2: Check database settings
$dbSettingsWorking = checkDatabaseSettings();

// Summary
echo "📊 Summary:\n";
echo "===========\n";
echo "Stripe API: " . ($stripeWorking ? "✅ Working" : "❌ Issues found") . "\n";
echo "Database Settings: " . ($dbSettingsWorking ? "✅ Configured" : "⚠️  Not configured") . "\n\n";

if (!$stripeWorking || !$dbSettingsWorking) {
    showUsageInstructions();
}

echo "✨ Test completed!\n";
