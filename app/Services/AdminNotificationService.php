<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Log;

class AdminNotificationService
{
    /**
     * Get all admin email addresses
     */
    public static function getAdminEmails(): array
    {
        try {
            // First try to get from email settings
            $configuredEmails = \App\Services\EmailConfigService::getAdminEmails();
            
            if (!empty($configuredEmails)) {
                Log::info('Using configured admin emails: ' . implode(', ', $configuredEmails));
                return $configuredEmails;
            }
            
            // Fallback to admin users from database
            $adminEmails = User::where('type_utilisateur', 'ADMIN')
                             ->where('est_verifie', true)
                             ->pluck('email')
                             ->toArray();
            
            if (!empty($adminEmails)) {
                Log::info('Using admin users emails: ' . implode(', ', $adminEmails));
                return $adminEmails;
            }
            
            // Fallback to admin_settings table admin_notification_emails
            try {
                $adminSettingEmails = \DB::table('admin_settings')->where('key_name', 'admin_notification_emails')->value('value');
                if ($adminSettingEmails) {
                    $emails = json_decode($adminSettingEmails, true);
                    if (is_array($emails)) {
                        $validEmails = array_filter($emails, fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL));
                        if (!empty($validEmails)) {
                            Log::info('Using admin_settings admin_notification_emails: ' . implode(', ', $validEmails));
                            return $validEmails;
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::warning('Could not check admin_settings table: ' . $e->getMessage());
            }
            
            // Final fallback to email_settings default
            $defaultAdmin = \App\Models\EmailSetting::get('admin_notification_emails', ['admin@proprio-link.fr'])[0] ?? 'admin@proprio-link.fr';
            Log::warning('No other admin emails found, using EmailSetting default: ' . $defaultAdmin);
            return [$defaultAdmin];
            
        } catch (\Exception $e) {
            Log::error('Failed to get admin emails: ' . $e->getMessage());
            // Try to get from admin_settings as last resort
            try {
                $adminSettingEmails = \DB::table('admin_settings')->where('key_name', 'admin_notification_emails')->value('value');
                if ($adminSettingEmails) {
                    $emails = json_decode($adminSettingEmails, true);
                    if (is_array($emails)) {
                        $validEmails = array_filter($emails, fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL));
                        if (!empty($validEmails)) {
                            return $validEmails;
                        }
                    }
                }
            } catch (\Exception $e2) {
                Log::warning('Could not check admin_settings in fallback: ' . $e2->getMessage());
            }
            
            // Ultimate fallback
            try {
                $fallbackEmails = \App\Models\EmailSetting::get('admin_notification_emails', ['admin@proprio-link.fr']);
                return is_array($fallbackEmails) ? $fallbackEmails : [$fallbackEmails];
            } catch (\Exception $e3) {
                return ['admin@proprio-link.fr'];
            }
        }
    }
    
    /**
     * Send email to all admins using EmailConfigService
     */
    public static function notifyAdmins($mailable): void
    {
        Log::info('Attempting to send admin notification...');
        
        try {
            // Try using EmailConfigService first (preferred method)
            $result = \App\Services\EmailConfigService::sendAdminNotification($mailable);
            
            if ($result) {
                Log::info('Admin notification sent successfully via EmailConfigService');
                return;
            } else {
                Log::warning('EmailConfigService failed, falling back to direct method');
            }
        } catch (\Exception $e) {
            Log::error('Failed to send admin notification via EmailConfigService: ' . $e->getMessage());
        }
        
        // Fallback to direct method
        $adminEmails = self::getAdminEmails();
        Log::info('Sending admin notifications to: ' . implode(', ', $adminEmails));
        
        foreach ($adminEmails as $email) {
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                Log::warning('Invalid email address skipped: ' . $email);
                continue;
            }
            
            // Skip test email addresses
            if (strpos($email, 'test@') !== false || strpos($email, '@ethereal.email') !== false || strpos($email, 'example.com') !== false) {
                Log::warning('Test/example email address skipped: ' . $email);
                continue;
            }
            
            try {
                \Mail::to($email)->send(clone $mailable);
                Log::info('✅ Admin notification sent successfully to real email: ' . $email);
            } catch (\Exception $e) {
                Log::error('❌ Failed to send admin notification to ' . $email . ': ' . $e->getMessage());
            }
        }
    }
}
