<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Stripe\StripeClient;
use Exception;

class FixStripeSettings extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'stripe:fix {--publishable= : Stripe Publishable Key} {--secret= : Stripe Secret Key} {--webhook= : Stripe Webhook Secret} {--price=15.00 : Contact Purchase Price} {--currency=EUR : Payment Currency}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix Stripe configuration settings';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Fixing Stripe Configuration...');
        $this->newLine();

        // Get options or ask for input
        $publishableKey = $this->option('publishable') ?: $this->ask('Enter your Stripe Publishable Key (pk_test_...)');
        $secretKey = $this->option('secret') ?: $this->secret('Enter your Stripe Secret Key (sk_test_...)');
        $webhookSecret = $this->option('webhook') ?: $this->ask('Enter your Stripe Webhook Secret (whsec_...) [Optional]', '');
        $price = $this->option('price');
        $currency = $this->option('currency');

        // Validate keys
        if (!$this->validatePublishableKey($publishableKey)) {
            $this->error('❌ Invalid Publishable Key format. Should start with pk_test_ or pk_live_');
            return Command::FAILURE;
        }

        if (!$this->validateSecretKey($secretKey)) {
            $this->error('❌ Invalid Secret Key format. Should start with sk_test_ or sk_live_');
            return Command::FAILURE;
        }

        // Test Stripe connection
        $this->info('🔍 Testing Stripe connection...');
        if (!$this->testStripeConnection($secretKey)) {
            return Command::FAILURE;
        }

        // Update database settings
        $this->info('💾 Updating database settings...');
        
        try {
            // Clear existing settings
            DB::table('admin_settings')
                ->whereIn('key_name', [
                    'stripe_publishable_key',
                    'stripe_secret_key',
                    'stripe_webhook_secret',
                    'contact_purchase_price',
                    'payment_currency'
                ])
                ->delete();

            // Insert new settings
            $settings = [
                [
                    'key_name' => 'stripe_publishable_key',
                    'value' => $publishableKey,
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'key_name' => 'stripe_secret_key',
                    'value' => Crypt::encryptString($secretKey),
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'key_name' => 'contact_purchase_price',
                    'value' => $price,
                    'created_at' => now(),
                    'updated_at' => now()
                ],
                [
                    'key_name' => 'payment_currency',
                    'value' => strtoupper($currency),
                    'created_at' => now(),
                    'updated_at' => now()
                ]
            ];

            if (!empty($webhookSecret)) {
                $settings[] = [
                    'key_name' => 'stripe_webhook_secret',
                    'value' => Crypt::encryptString($webhookSecret),
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            DB::table('admin_settings')->insert($settings);

            $this->info('✅ Database settings updated successfully!');

        } catch (Exception $e) {
            $this->error('❌ Database update failed: ' . $e->getMessage());
            return Command::FAILURE;
        }

        // Update .env file
        $this->info('📝 Updating .env file...');
        $this->updateEnvFile($publishableKey, $secretKey, $webhookSecret, $price, $currency);

        // Clear caches
        $this->info('🧹 Clearing caches...');
        $this->call('cache:clear');
        $this->call('config:clear');
        $this->call('route:clear');
        $this->call('view:clear');

        $this->newLine();
        $this->info('🎉 Stripe configuration fixed successfully!');
        $this->info('✅ You can now test the connection in your admin panel.');
        
        return Command::SUCCESS;
    }

    private function validatePublishableKey($key)
    {
        return preg_match('/^pk_(test|live)_[a-zA-Z0-9]{24,}$/', $key);
    }

    private function validateSecretKey($key)
    {
        return preg_match('/^sk_(test|live)_[a-zA-Z0-9]{24,}$/', $key);
    }

    private function testStripeConnection($secretKey)
    {
        try {
            $stripe = new StripeClient($secretKey);
            $account = $stripe->accounts->retrieve();
            
            $this->info('✅ Stripe connection successful!');
            $this->line("  Account ID: {$account->id}");
            $this->line("  Business: " . ($account->business_profile->name ?? 'Not set'));
            $this->line("  Country: {$account->country}");
            
            return true;
        } catch (Exception $e) {
            $this->error('❌ Stripe connection failed: ' . $e->getMessage());
            return false;
        }
    }

    private function updateEnvFile($publishableKey, $secretKey, $webhookSecret, $price, $currency)
    {
        $envFile = base_path('.env');
        
        if (!file_exists($envFile)) {
            $this->warn('⚠️  .env file not found, skipping env update');
            return;
        }

        $envContent = file_get_contents($envFile);
        
        // Update or add Stripe settings
        $replacements = [
            'STRIPE_KEY' => $publishableKey,
            'STRIPE_SECRET' => $secretKey,
            'STRIPE_CURRENCY' => strtolower($currency),
            'STRIPE_CONTACT_PRICE' => $price,
            'VITE_STRIPE_PUBLISHABLE_KEY' => $publishableKey,
        ];

        if (!empty($webhookSecret)) {
            $replacements['STRIPE_WEBHOOK_SECRET'] = $webhookSecret;
        }

        foreach ($replacements as $key => $value) {
            if (preg_match("/^{$key}=.*$/m", $envContent)) {
                $envContent = preg_replace("/^{$key}=.*$/m", "{$key}={$value}", $envContent);
            } else {
                $envContent .= "\n{$key}={$value}";
            }
        }

        file_put_contents($envFile, $envContent);
        $this->info('✅ .env file updated successfully!');
    }
}
