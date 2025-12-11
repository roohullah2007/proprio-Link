<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Inertia\Inertia;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = $this->getSettings();
        
        return Inertia::render('Admin/Settings', [
            'settings' => $settings
        ]);
    }

    public function update(Request $request)
    {
        $request->validate([
            'stripe_publishable_key' => 'nullable|string|max:255',
            'stripe_secret_key' => 'nullable|string|max:255',
            'stripe_webhook_secret' => 'nullable|string|max:255',
            'contact_purchase_price' => 'required|numeric|min:1|max:1000',
            'payment_currency' => 'required|string|in:EUR,USD,GBP',
            'platform_name' => 'required|string|max:255',
            'platform_url' => 'required|url|max:255',
            'admin_notification_emails' => 'required|array|min:1',
            'admin_notification_emails.*' => 'required|email|max:255',
            'default_language' => 'required|string|in:fr,en',
            'max_file_size' => 'required|integer|min:1|max:100',
            'allowed_image_types' => 'required|array',
            'allowed_image_types.*' => 'required|string|in:jpg,jpeg,png,webp,gif',
            'website_url' => 'required|url|max:255',
            'website_menu_links' => 'nullable|json',
            // SMTP settings validation
            'smtp_enabled' => 'boolean',
            'smtp_host' => 'nullable|string|max:255',
            'smtp_port' => 'nullable|integer|min:1|max:65535',
            'smtp_username' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            'smtp_encryption' => 'nullable|string|in:tls,ssl',
            'smtp_from_address' => 'nullable|email|max:255',
            'smtp_from_name' => 'nullable|string|max:255',
        ]);

        $settings = $request->all();
        
        // Encrypt sensitive data
        if (!empty($settings['stripe_secret_key'])) {
            $settings['stripe_secret_key'] = Crypt::encryptString($settings['stripe_secret_key']);
        }
        
        if (!empty($settings['stripe_webhook_secret'])) {
            $settings['stripe_webhook_secret'] = Crypt::encryptString($settings['stripe_webhook_secret']);
        }

        // Encrypt SMTP password if provided
        if (!empty($settings['smtp_password'])) {
            $settings['smtp_password'] = Crypt::encryptString($settings['smtp_password']);
        }

        foreach ($settings as $key => $value) {
            $this->updateSetting($key, $value);
        }

        return redirect()->back()->with('success', 'Settings updated successfully');
    }

    public function testStripe(Request $request)
    {
        $request->validate([
            'stripe_secret_key' => 'required|string'
        ]);

        try {
            \Stripe\Stripe::setApiKey($request->stripe_secret_key);
            $account = \Stripe\Account::retrieve();
            
            return response()->json([
                'success' => true,
                'account_id' => $account->id,
                'business_name' => $account->business_profile->name ?? 'Unknown',
                'country' => $account->country
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    public function testSmtp(Request $request)
    {
        $request->validate([
            'smtp_host' => 'required|string',
            'smtp_port' => 'required|integer',
            'smtp_username' => 'required|string',
            'smtp_password' => 'required|string',
            'smtp_encryption' => 'required|string|in:tls,ssl',
            'smtp_from_address' => 'required|email',
            'smtp_from_name' => 'required|string',
            'test_email' => 'required|email',
        ]);

        try {
            // Temporarily configure mail settings
            $originalMailer = config('mail.default');
            $originalConfig = config('mail.mailers.smtp');

            config([
                'mail.default' => 'smtp',
                'mail.mailers.smtp' => [
                    'transport' => 'smtp',
                    'host' => $request->smtp_host,
                    'port' => $request->smtp_port,
                    'encryption' => $request->smtp_encryption,
                    'username' => $request->smtp_username,
                    'password' => $request->smtp_password,
                    'timeout' => null,
                ],
                'mail.from' => [
                    'address' => $request->smtp_from_address,
                    'name' => $request->smtp_from_name,
                ],
            ]);

            // Send test email
            \Mail::raw('This is a test email from Proprio Link SMTP configuration.', function ($message) use ($request) {
                $message->to($request->test_email)
                        ->subject('Proprio Link SMTP Test Email');
            });

            // Restore original configuration
            config([
                'mail.default' => $originalMailer,
                'mail.mailers.smtp' => $originalConfig,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage()
            ], 400);
        }
    }

    private function getSettings()
    {
        $defaultSettings = [
            'stripe_publishable_key' => '',
            'stripe_secret_key' => '',
            'stripe_webhook_secret' => '',
            'contact_purchase_price' => 15.00,
            'payment_currency' => 'EUR',
            'platform_name' => 'Proprio Link',
            'platform_url' => config('app.url'),
            'admin_notification_emails' => ['admin@proprio-link.fr'],
            'default_language' => 'fr',
            'max_file_size' => 10,
            'allowed_image_types' => ['jpg', 'jpeg', 'png', 'webp'],
            'website_url' => 'https://yourdomain.com',
            'website_menu_links' => json_encode([
                ['label' => 'Home', 'url' => 'https://yourdomain.com', 'external' => true],
                ['label' => 'About', 'url' => 'https://yourdomain.com/about', 'external' => true],
                ['label' => 'Services', 'url' => 'https://yourdomain.com/services', 'external' => true],
                ['label' => 'Contact', 'url' => 'https://yourdomain.com/contact', 'external' => true],
                ['label' => 'Properties', 'url' => '/properties/search', 'external' => false]
            ]),
            // SMTP settings
            'smtp_enabled' => false,
            'smtp_host' => '',
            'smtp_port' => 587,
            'smtp_username' => '',
            'smtp_password' => '',
            'smtp_encryption' => 'tls',
            'smtp_from_address' => '',
            'smtp_from_name' => 'Proprio Link',
        ];

        $settings = [];
        
        try {
            $dbSettings = DB::table('admin_settings')->pluck('value', 'key_name');
            
            foreach ($defaultSettings as $key => $defaultValue) {
                if (isset($dbSettings[$key])) {
                    $value = $dbSettings[$key];
                    
                    // Decrypt sensitive data
                    if (in_array($key, ['stripe_secret_key', 'stripe_webhook_secret', 'smtp_password']) && !empty($value)) {
                        try {
                            $value = Crypt::decryptString($value);
                        } catch (\Exception $e) {
                            $value = '';
                        }
                    }
                    
                    // Parse JSON arrays
                    if (in_array($key, ['allowed_image_types', 'website_menu_links', 'admin_notification_emails'])) {
                        $value = json_decode($value, true) ?: $defaultValue;
                    } elseif (in_array($key, ['smtp_enabled'])) {
                        $value = filter_var($value, FILTER_VALIDATE_BOOLEAN);
                    } elseif (is_numeric($value)) {
                        $value = is_float($defaultValue) ? (float) $value : (int) $value;
                    }
                    
                    $settings[$key] = $value;
                } else {
                    $settings[$key] = $defaultValue;
                }
            }
        } catch (\Exception $e) {
            // If table doesn't exist yet, return defaults
            $settings = $defaultSettings;
        }

        return $settings;
    }

    private function updateSetting($key, $value)
    {
        // Handle array values
        if (is_array($value)) {
            $value = json_encode($value);
        }

        DB::table('admin_settings')->updateOrInsert(
            ['key_name' => $key],
            [
                'value' => $value,
                'updated_at' => now()
            ]
        );
    }
}
