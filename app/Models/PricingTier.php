<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PricingTier extends Model
{
    use HasFactory;

    /**
     * Tier key constants
     */
    const TIER_STANDARD = 'standard';
    const TIER_MID_RANGE = 'mid_range';
    const TIER_HIGH_VALUE = 'high_value';
    const TIER_PRESTIGE = 'prestige';

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'tier_name',
        'tier_key',
        'min_property_value',
        'max_property_value',
        'price_adjustment',
        'is_flat_rate',
        'flat_rate_price',
        'display_order',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'min_property_value' => 'decimal:2',
            'max_property_value' => 'decimal:2',
            'price_adjustment' => 'decimal:2',
            'flat_rate_price' => 'decimal:2',
            'is_flat_rate' => 'boolean',
            'is_active' => 'boolean',
            'display_order' => 'integer',
        ];
    }

    /**
     * Find the appropriate tier for a given property value
     */
    public static function findTierForValue(float $propertyValue): ?self
    {
        return self::where('is_active', true)
            ->where('min_property_value', '<=', $propertyValue)
            ->where(function ($query) use ($propertyValue) {
                $query->whereNull('max_property_value')
                    ->orWhere('max_property_value', '>=', $propertyValue);
            })
            ->orderBy('min_property_value', 'desc')
            ->first();
    }

    /**
     * Get all active tiers ordered by display order
     */
    public static function getActiveTiers(): \Illuminate\Database\Eloquent\Collection
    {
        return self::where('is_active', true)
            ->orderBy('display_order')
            ->get();
    }

    /**
     * Calculate price based on this tier
     *
     * @param float $basePrice The base city price
     * @return float The final price
     */
    public function calculatePrice(float $basePrice): float
    {
        if ($this->is_flat_rate && $this->flat_rate_price !== null) {
            return (float) $this->flat_rate_price;
        }

        return $basePrice + (float) $this->price_adjustment;
    }

    /**
     * Get human-readable value range
     */
    public function getValueRangeAttribute(): string
    {
        $min = number_format($this->min_property_value, 0, ',', ' ');

        if ($this->max_property_value === null) {
            return "€{$min}+";
        }

        $max = number_format($this->max_property_value, 0, ',', ' ');
        return "€{$min} - €{$max}";
    }

    /**
     * Scope for active tiers
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope ordered by display order
     */
    public function scopeOrdered($query)
    {
        return $query->orderBy('display_order');
    }
}
