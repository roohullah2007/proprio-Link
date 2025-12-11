<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class PricingCity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'city_name',
        'city_name_normalized',
        'country',
        'base_price',
        'is_major_city',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'base_price' => 'decimal:2',
            'is_major_city' => 'boolean',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Boot method to auto-normalize city name
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->city_name_normalized)) {
                $model->city_name_normalized = self::normalizeCity($model->city_name);
            }
        });

        static::updating(function ($model) {
            if ($model->isDirty('city_name')) {
                $model->city_name_normalized = self::normalizeCity($model->city_name);
            }
        });
    }

    /**
     * Normalize city name for consistent matching
     * Removes accents, converts to lowercase, trims whitespace
     */
    public static function normalizeCity(string $cityName): string
    {
        // Convert to lowercase
        $normalized = mb_strtolower($cityName, 'UTF-8');

        // Remove accents
        $normalized = self::removeAccents($normalized);

        // Remove extra whitespace
        $normalized = preg_replace('/\s+/', ' ', trim($normalized));

        return $normalized;
    }

    /**
     * Remove accents from string
     */
    private static function removeAccents(string $string): string
    {
        $accents = [
            'à' => 'a', 'â' => 'a', 'ä' => 'a', 'á' => 'a', 'ã' => 'a',
            'è' => 'e', 'ê' => 'e', 'ë' => 'e', 'é' => 'e',
            'ì' => 'i', 'î' => 'i', 'ï' => 'i', 'í' => 'i',
            'ò' => 'o', 'ô' => 'o', 'ö' => 'o', 'ó' => 'o', 'õ' => 'o',
            'ù' => 'u', 'û' => 'u', 'ü' => 'u', 'ú' => 'u',
            'ÿ' => 'y', 'ý' => 'y',
            'ñ' => 'n',
            'ç' => 'c',
            'œ' => 'oe', 'æ' => 'ae',
        ];

        return strtr($string, $accents);
    }

    /**
     * Find city by name (normalized matching)
     */
    public static function findByCity(string $cityName, string $country = 'France'): ?self
    {
        return self::where('city_name_normalized', self::normalizeCity($cityName))
            ->where('country', $country)
            ->where('is_active', true)
            ->first();
    }

    /**
     * Get all active major cities
     */
    public static function getMajorCities(): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('is_major_city', true)
            ->where('is_active', true)
            ->orderBy('city_name')
            ->get();
    }

    /**
     * Scope for active cities
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope for major cities
     */
    public function scopeMajor($query)
    {
        return $query->where('is_major_city', true);
    }
}
