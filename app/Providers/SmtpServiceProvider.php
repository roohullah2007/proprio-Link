<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Schema;

class SmtpServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        try {
            // Check if admin_settings table exists and SMTP is enabled
            if (Schema::hasTable('admin_settings')) {
                $smtpSettings = DB::table('admin_settings')
                    ->whereIn('key_name', [
                        'smtp_enabled',
                        'smtp_host',
                        'smtp_port',
                        'smtp_username',
                        'smtp_password',
                        'smtp_encryption',
                        'smtp_from_address',
                        'smtp_from_name'
                    ])
                    ->pluck('value', 'key_name');

                // If SMTP is enabled and configured, override mail configuration
                if (isset($smtpSettings['smtp_enabled']) && 
                    filter_var($smtpSettings['smtp_enabled'], FILTER_VALIDATE_BOOLEAN) &&
                    !empty($smtpSettings['smtp_host'])) {
                    
                    // Decrypt password if exists
                    $password = '';
                    if (!empty($smtpSettings['smtp_password'])) {
                        try {
                            $password = Crypt::decryptString($smtpSettings['smtp_password']);
                        } catch (\Exception $e) {
                            \Log::error('Failed to decrypt SMTP password: ' . $e->getMessage());
                        }
                    }

                    // Override mail configuration
                    Config::set([
                        'mail.default' => 'smtp',
                        'mail.mailers.smtp' => [
                            'transport' => 'smtp',
                            'host' => $smtpSettings['smtp_host'] ?? env('MAIL_HOST'),
                            'port' => (int)($smtpSettings['smtp_port'] ?? env('MAIL_PORT', 587)),
                            'encryption' => $smtpSettings['smtp_encryption'] ?? env('MAIL_ENCRYPTION', 'tls'),
                            'username' => $smtpSettings['smtp_username'] ?? env('MAIL_USERNAME'),
                            'password' => $password ?: env('MAIL_PASSWORD'),
                            'timeout' => null,
                        ],
                        'mail.from' => [
                            'address' => $smtpSettings['smtp_from_address'] ?? env('MAIL_FROM_ADDRESS'),
                            'name' => $smtpSettings['smtp_from_name'] ?? env('MAIL_FROM_NAME'),
                        ],
                    ]);
                }
            }
        } catch (\Exception $e) {
            // If there's any error, fall back to .env configuration
            \Log::error('SMTP configuration error: ' . $e->getMessage());
        }
    }
}
