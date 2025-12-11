<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingSetting extends Model
{
    use HasFactory;

    /**
     * Setting key constants
     */
    const DEFAULT_NON_MAJOR_CITY_PRICE = 'default_non_major_city_price';
    const DEFAULT_MAJOR_CITY_PRICE = 'default_major_city_price';
    const PRICING_ENABLED = 'pricing_enabled';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'setting_key',
        'setting_value',
        'description',
    ];

    /**
     * Get a setting value by key
     */
    public static function getValue(string $key, mixed $default = null): mixed
    {
        $setting = self::where('setting_key', $key)->first();

        if (!$setting) {
            return $default;
        }

        return $setting->setting_value;
    }

    /**
     * Get a numeric setting value
     */
    public static function getNumericValue(string $key, float $default = 0): float
    {
        $value = self::getValue($key, $default);
        return is_numeric($value) ? (float) $value : $default;
    }

    /**
     * Get a boolean setting value
     */
    public static function getBooleanValue(string $key, bool $default = false): bool
    {
        $value = self::getValue($key, $default);
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    /**
     * Set a setting value
     */
    public static function setValue(string $key, mixed $value, ?string $description = null): self
    {
        return self::updateOrCreate(
            ['setting_key' => $key],
            [
                'setting_value' => $value,
                'description' => $description,
            ]
        );
    }

    /**
     * Get default non-major city price
     */
    public static function getDefaultNonMajorCityPrice(): float
    {
        return self::getNumericValue(self::DEFAULT_NON_MAJOR_CITY_PRICE, 15.00);
    }

    /**
     * Get default major city price
     */
    public static function getDefaultMajorCityPrice(): float
    {
        return self::getNumericValue(self::DEFAULT_MAJOR_CITY_PRICE, 25.00);
    }

    /**
     * Check if dynamic pricing is enabled
     */
    public static function isPricingEnabled(): bool
    {
        return self::getBooleanValue(self::PRICING_ENABLED, true);
    }

    /**
     * Get all settings as key-value array
     */
    public static function getAllSettings(): array
    {
        return self::pluck('setting_value', 'setting_key')->toArray();
    }
}
