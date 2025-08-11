<?php

namespace App\Services;

use App\Models\EmailSetting;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

class EmailConfigService
{
    /**
     * Apply email settings to Laravel's mail configuration
     * Prioritizes admin settings over .env file when available
     */
    public static function applySettings()
    {
        try {
            if (!EmailSetting::get('smtp_enabled', true)) {
                return;
            }

            // Check if admin has configured custom SMTP settings
            $hasCustomSettings = self::hasCustomSettings();
            
            if ($hasCustomSettings) {
                // Use admin-configured settings
                $smtpHost = EmailSetting::get('smtp_host');
                $smtpPort = EmailSetting::get('smtp_port');
                $smtpUsername = EmailSetting::get('smtp_username');
                $smtpPassword = EmailSetting::get('smtp_password');
                $smtpEncryption = EmailSetting::get('smtp_encryption');
                $fromAddress = EmailSetting::get('mail_from_address');
                $fromName = EmailSetting::get('mail_from_name');
                
                \Log::info('Using admin-configured SMTP settings');
            } else {
                // Fall back to .env file settings
                $smtpHost = env('MAIL_HOST');
                $smtpPort = env('MAIL_PORT', 587);
                $smtpUsername = env('MAIL_USERNAME');
                $smtpPassword = env('MAIL_PASSWORD');
                $smtpEncryption = env('MAIL_ENCRYPTION', 'tls');
                $fromAddress = env('MAIL_FROM_ADDRESS');
                $fromName = env('MAIL_FROM_NAME', env('APP_NAME', 'Proprio Link'));
                
                \Log::info('Using .env file SMTP settings');
            }
            
            // Only apply configuration if we have minimum required settings
            if (!$smtpHost || !$fromAddress) {
                \Log::warning('Incomplete SMTP configuration, skipping email config update');
                return;
            }

            // Update mail configuration
            Config::set([
                'mail.mailers.smtp.host' => $smtpHost,
                'mail.mailers.smtp.port' => (int) $smtpPort,
                'mail.mailers.smtp.username' => $smtpUsername,
                'mail.mailers.smtp.password' => $smtpPassword,
                'mail.mailers.smtp.encryption' => $smtpEncryption ?: null,
                'mail.from.address' => $fromAddress,
                'mail.from.name' => $fromName,
            ]);

            // Purge mailer instances to apply new config
            Mail::purge('smtp');
        } catch (\Exception $e) {
            \Log::warning('Could not apply email settings, using defaults: ' . $e->getMessage());
        }
    }

    /**
     * Test email configuration
     */
    public static function testConfiguration($toEmail = null)
    {
        try {
            self::applySettings();
            
            $testEmail = $toEmail ?: EmailSetting::get('admin_notification_emails', [])[0] ?? 'test@example.com';
            
            Mail::raw('Test de configuration email - Proprio Link', function ($message) use ($testEmail) {
                $message->to($testEmail)
                        ->subject('Test de configuration SMTP - Proprio Link');
            });
            
            return ['success' => true, 'message' => 'Email de test envoyé avec succès'];
        } catch (\Exception $e) {
            return ['success' => false, 'message' => 'Erreur: ' . $e->getMessage()];
        }
    }

    /**
     * Get admin notification emails
     */
    public static function getAdminEmails()
    {
        $emails = EmailSetting::get('admin_notification_emails', []);
        
        // If emails contains only the default admin@proprio-link.fr, 
        // check admin_settings for admin_notification_emails as alternative
        if (count($emails) === 1 && $emails[0] === 'admin@proprio-link.fr') {
            try {
                $adminSettingEmails = \DB::table('admin_settings')->where('key_name', 'admin_notification_emails')->value('value');
                if ($adminSettingEmails) {
                    $settingEmails = json_decode($adminSettingEmails, true);
                    if (is_array($settingEmails)) {
                        $validEmails = array_filter($settingEmails, fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL));
                        if (!empty($validEmails)) {
                            \Log::info('Using admin_settings admin_notification_emails instead of default: ' . implode(', ', $validEmails));
                            return $validEmails;
                        }
                    }
                }
            } catch (\Exception $e) {
                \Log::warning('Could not check admin_settings: ' . $e->getMessage());
            }
        }
        
        return $emails;
    }

    /**
     * Send notification to all admin emails
     */
    public static function sendAdminNotification($mailable)
    {
        $adminEmails = self::getAdminEmails();
        
        if (empty($adminEmails)) {
            \Log::warning('No admin notification emails configured');
            return false;
        }

        self::applySettings();
        
        try {
            foreach ($adminEmails as $email) {
                if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
                    // Skip test email addresses
                    if (strpos($email, 'test@') !== false || strpos($email, '@ethereal.email') !== false || strpos($email, 'example.com') !== false) {
                        \Log::warning('Test/example email address skipped in EmailConfigService: ' . $email);
                        continue;
                    }
                    
                    Mail::to($email)->send(clone $mailable);
                    \Log::info('✅ Admin notification sent via EmailConfigService to: ' . $email);
                }
            }
            return true;
        } catch (\Exception $e) {
            \Log::error('Failed to send admin notification: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Get mail configuration for display (hiding sensitive data)
     */
    public static function getConfigForDisplay()
    {
        return [
            'smtp_host' => EmailSetting::get('smtp_host'),
            'smtp_port' => EmailSetting::get('smtp_port'),
            'smtp_username' => EmailSetting::get('smtp_username'),
            'smtp_password' => EmailSetting::get('smtp_password') ? '••••••••' : '',
            'smtp_encryption' => EmailSetting::get('smtp_encryption'),
            'mail_from_address' => EmailSetting::get('mail_from_address'),
            'mail_from_name' => EmailSetting::get('mail_from_name'),
            'admin_notification_emails' => EmailSetting::get('admin_notification_emails', []),
            'smtp_enabled' => EmailSetting::get('smtp_enabled', true),
            'website_url' => EmailSetting::get('website_url', 'https://proprio-link.fr'),
        ];
    }

    /**
     * Check if admin has configured custom SMTP settings
     */
    private static function hasCustomSettings()
    {
        try {
            // Check if email_settings table exists and has SMTP settings
            if (!\Schema::hasTable('email_settings')) {
                return false;
            }

            // Check if we have the essential SMTP settings configured by admin
            $settings = EmailSetting::whereIn('key', ['smtp_host', 'smtp_username', 'smtp_password'])
                ->where('value', '!=', '')
                ->where('value', '!=', null)
                ->count();
            
            // Need at least host and either username/password to consider it custom configured
            return $settings >= 2;
        } catch (\Exception $e) {
            \Log::warning('Could not check custom settings: ' . $e->getMessage());
            return false;
        }
    }
}
