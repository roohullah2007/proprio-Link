<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schema;

class EmailSetting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'description'];

    /**
     * Get a setting value by key
     */
    public static function get($key, $default = null)
    {
        try {
            // Check if table exists first
            if (!\Schema::hasTable('email_settings')) {
                \Log::warning('email_settings table does not exist, using env fallback for: ' . $key);
                return self::getEnvFallback($key, $default);
            }
            
            return Cache::remember("email_setting_{$key}", 3600, function () use ($key, $default) {
                $setting = self::where('key', $key)->first();
                
                if (!$setting) {
                    return self::getEnvFallback($key, $default);
                }

                return self::castValue($setting->value, $setting->type);
            });
        } catch (\Exception $e) {
            \Log::error('Error getting email setting ' . $key . ': ' . $e->getMessage());
            return self::getEnvFallback($key, $default);
        }
    }
    
    /**
     * Get fallback value from environment
     */
    private static function getEnvFallback($key, $default)
    {
        switch ($key) {
            case 'smtp_host':
                return env('MAIL_HOST', $default);
            case 'smtp_port':
                return env('MAIL_PORT', $default);
            case 'smtp_username':
                return env('MAIL_USERNAME', $default);
            case 'smtp_password':
                return env('MAIL_PASSWORD', $default);
            case 'smtp_encryption':
                return env('MAIL_ENCRYPTION', $default);
            case 'mail_from_address':
                return env('MAIL_FROM_ADDRESS', $default);
            case 'mail_from_name':
                return env('MAIL_FROM_NAME', $default);
            case 'admin_notification_emails':
                return [env('MAIL_ADMIN_EMAIL', 'admin@proprio-link.fr')];
            case 'smtp_enabled':
                return true;
            default:
                return $default;
        }
    }

    /**
     * Set a setting value
     */
    public static function set($key, $value, $type = 'string', $description = null)
    {
        $processedValue = self::processValue($value, $type);
        
        self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $processedValue,
                'type' => $type,
                'description' => $description
            ]
        );

        // Clear cache
        Cache::forget("email_setting_{$key}");
    }

    /**
     * Process value before storage
     */
    private static function processValue($value, $type)
    {
        switch ($type) {
            case 'json':
                return json_encode($value);
            case 'boolean':
                return $value ? 'true' : 'false';
            case 'encrypted':
                return $value ? Crypt::encryptString($value) : null;
            default:
                return $value;
        }
    }

    /**
     * Cast value after retrieval
     */
    private static function castValue($value, $type)
    {
        try {
            switch ($type) {
                case 'json':
                    return json_decode($value, true) ?: [];
                case 'boolean':
                    return $value === 'true';
                case 'encrypted':
                    if (!$value) {
                        return null;
                    }
                    try {
                        return Crypt::decryptString($value);
                    } catch (\Exception $e) {
                        \Log::warning('Failed to decrypt email setting, returning null: ' . $e->getMessage());
                        return null;
                    }
                default:
                    return $value;
            }
        } catch (\Exception $e) {
            \Log::error('Error casting email setting value: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Get all settings as array
     */
    public static function getAll()
    {
        $settings = self::all();
        $result = [];
        
        foreach ($settings as $setting) {
            $result[$setting->key] = self::castValue($setting->value, $setting->type);
        }
        
        return $result;
    }

    /**
     * Clear all email settings cache
     */
    public static function clearCache()
    {
        $keys = self::pluck('key');
        foreach ($keys as $key) {
            Cache::forget("email_setting_{$key}");
        }
    }
}
