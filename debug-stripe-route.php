
// Add this debug route to web.php temporarily to test Stripe config
Route::get('/debug-stripe-config', function () {
    try {
        $settings = DB::table('admin_settings')
            ->whereIn('key_name', [
                'stripe_publishable_key', 
                'stripe_secret_key', 
                'contact_purchase_price', 
                'payment_currency'
            ])
            ->pluck('value', 'key_name');

        $stripeSettings = [
            'publishable_key' => $settings['stripe_publishable_key'] ?? 'NOT SET',
            'secret_key_exists' => !empty($settings['stripe_secret_key']),
            'secret_key_encrypted' => $settings['stripe_secret_key'] ?? 'NOT SET',
            'contact_price' => (float)($settings['contact_purchase_price'] ?? 15.00),
            'currency' => strtolower($settings['payment_currency'] ?? 'eur'),
        ];

        // Try to decrypt secret key
        if (!empty($settings['stripe_secret_key'])) {
            try {
                $decryptedKey = Crypt::decryptString($settings['stripe_secret_key']);
                $stripeSettings['secret_key_decrypted'] = 'SUCCESS (length: ' . strlen($decryptedKey) . ')';
                $stripeSettings['secret_key_prefix'] = substr($decryptedKey, 0, 7) . '...';
            } catch (\Exception $e) {
                $stripeSettings['secret_key_decrypted'] = 'DECRYPT FAILED: ' . $e->getMessage();
            }
        }

        return response()->json($stripeSettings);
    } catch (\Exception $e) {
        return response()->json([
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
    }
})->middleware('auth');
