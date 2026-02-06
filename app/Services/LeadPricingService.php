<?php

namespace App\Services;

use App\Models\PricingCity;
use App\Models\PricingTier;
use App\Models\PricingSetting;
use App\Models\Property;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class LeadPricingService
{
    /**
     * Cache duration in seconds (1 hour)
     */
    const CACHE_DURATION = 3600;

    /**
     * Calculate the lead price for a property
     *
     * @param Property $property
     * @return array Pricing breakdown with final_price, base_price, tier info, etc.
     */
    public function calculatePrice(Property $property): array
    {
        return $this->calculatePriceForCityAndValue(
            $property->ville,
            (float) $property->prix,
            $property->pays ?? 'France'
        );
    }

    /**
     * Calculate price for given city and property value
     *
     * @param string $cityName
     * @param float $propertyValue
     * @param string $country
     * @return array
     */
    public function calculatePriceForCityAndValue(
        string $cityName,
        float $propertyValue,
        string $country = 'France'
    ): array {
        // Check if dynamic pricing is enabled
        if (!PricingSetting::isPricingEnabled()) {
            return $this->getStaticPricing();
        }

        // Step 1: Determine base price from city
        $pricingCity = PricingCity::findByCity($cityName, $country);

        if ($pricingCity) {
            $basePrice = (float) $pricingCity->base_price;
            $isMajorCity = $pricingCity->is_major_city;
            $cityMatched = true;
        } else {
            $basePrice = PricingSetting::getDefaultNonMajorCityPrice();
            $isMajorCity = false;
            $cityMatched = false;
        }

        // Step 2: Find applicable tier
        $tier = PricingTier::findTierForValue($propertyValue);

        // Step 3: Calculate final price
        if ($tier) {
            $finalPrice = $tier->calculatePrice($basePrice);
            $tierName = $tier->tier_name;
            $tierKey = $tier->tier_key;
            $priceAdjustment = $tier->is_flat_rate ? 0 : (float) $tier->price_adjustment;
            $isFlatRate = $tier->is_flat_rate;
        } else {
            $finalPrice = $basePrice;
            $tierName = 'Standard';
            $tierKey = 'standard';
            $priceAdjustment = 0;
            $isFlatRate = false;
        }

        // Calculate VAT
        $vatRate = PricingSetting::getVatRate();
        $priceHT = round($finalPrice, 2);
        $taxAmount = round($priceHT * ($vatRate / 100), 2);
        $priceTTC = round($priceHT + $taxAmount, 2);

        return [
            'final_price' => $priceHT,
            'base_price' => round($basePrice, 2),
            'tier_name' => $tierName,
            'tier_key' => $tierKey,
            'price_adjustment' => round($priceAdjustment, 2),
            'is_flat_rate' => $isFlatRate,
            'is_major_city' => $isMajorCity,
            'city_matched' => $cityMatched,
            'city_name' => $cityName,
            'property_value' => $propertyValue,
            'currency' => 'EUR',
            'price_ht' => $priceHT,
            'vat_rate' => $vatRate,
            'tax_amount' => $taxAmount,
            'price_ttc' => $priceTTC,
        ];
    }

    /**
     * Get static pricing fallback
     */
    private function getStaticPricing(): array
    {
        $defaultPrice = PricingSetting::getDefaultNonMajorCityPrice();
        $vatRate = PricingSetting::getVatRate();
        $taxAmount = round($defaultPrice * ($vatRate / 100), 2);
        $priceTTC = round($defaultPrice + $taxAmount, 2);

        return [
            'final_price' => $defaultPrice,
            'base_price' => $defaultPrice,
            'tier_name' => 'Standard',
            'tier_key' => 'standard',
            'price_adjustment' => 0,
            'is_flat_rate' => false,
            'is_major_city' => false,
            'city_matched' => false,
            'city_name' => '',
            'property_value' => 0,
            'currency' => 'EUR',
            'price_ht' => $defaultPrice,
            'vat_rate' => $vatRate,
            'tax_amount' => $taxAmount,
            'price_ttc' => $priceTTC,
        ];
    }

    /**
     * Get pricing summary for display
     */
    public function getPricingSummary(Property $property): array
    {
        $pricing = $this->calculatePrice($property);

        return [
            'price' => $pricing['final_price'],
            'formatted_price' => $this->formatPrice($pricing['final_price'], $pricing['currency']),
            'breakdown' => $this->getBreakdownText($pricing),
            'tier' => $pricing['tier_name'],
        ];
    }

    /**
     * Format price for display
     */
    public function formatPrice(float $price, string $currency = 'EUR'): string
    {
        $symbols = [
            'EUR' => '€',
            'USD' => '$',
            'GBP' => '£',
        ];

        $symbol = $symbols[$currency] ?? '€';

        return $symbol . number_format($price, 2, ',', ' ');
    }

    /**
     * Get breakdown text for pricing explanation
     */
    private function getBreakdownText(array $pricing): string
    {
        $parts = [];

        if ($pricing['city_matched']) {
            $cityType = $pricing['is_major_city'] ? 'Major city' : 'City';
            $parts[] = "{$cityType} base: €{$pricing['base_price']}";
        } else {
            $parts[] = "Default base: €{$pricing['base_price']}";
        }

        if ($pricing['is_flat_rate']) {
            $parts[] = "Flat rate tier: {$pricing['tier_name']}";
        } elseif ($pricing['price_adjustment'] > 0) {
            $parts[] = "Tier adjustment: +€{$pricing['price_adjustment']}";
        }

        return implode(' | ', $parts);
    }

    /**
     * Get all major cities for display
     */
    public function getMajorCities(): array
    {
        return Cache::remember('pricing_major_cities', self::CACHE_DURATION, function () {
            return PricingCity::getMajorCities()
                ->map(fn($city) => [
                    'id' => $city->id,
                    'name' => $city->city_name,
                    'base_price' => $city->base_price,
                ])
                ->toArray();
        });
    }

    /**
     * Get all pricing tiers for display
     */
    public function getPricingTiers(): array
    {
        return Cache::remember('pricing_tiers', self::CACHE_DURATION, function () {
            return PricingTier::getActiveTiers()
                ->map(fn($tier) => [
                    'id' => $tier->id,
                    'name' => $tier->tier_name,
                    'key' => $tier->tier_key,
                    'min_value' => $tier->min_property_value,
                    'max_value' => $tier->max_property_value,
                    'adjustment' => $tier->price_adjustment,
                    'is_flat_rate' => $tier->is_flat_rate,
                    'flat_rate_price' => $tier->flat_rate_price,
                    'value_range' => $tier->value_range,
                ])
                ->toArray();
        });
    }

    /**
     * Clear pricing cache
     */
    public function clearCache(): void
    {
        Cache::forget('pricing_major_cities');
        Cache::forget('pricing_tiers');
    }

    /**
     * Get pricing matrix for admin display
     * Shows what price would be charged for each city + tier combination
     */
    public function getPricingMatrix(): array
    {
        $cities = PricingCity::active()->orderBy('city_name')->get();
        $tiers = PricingTier::active()->ordered()->get();
        $defaultNonMajorPrice = PricingSetting::getDefaultNonMajorCityPrice();

        $matrix = [];

        // Add default (non-major city) row
        $defaultRow = [
            'city' => 'Other Cities (Default)',
            'city_id' => null,
            'is_major' => false,
            'base_price' => $defaultNonMajorPrice,
            'tiers' => [],
        ];

        foreach ($tiers as $tier) {
            $defaultRow['tiers'][$tier->tier_key] = $tier->calculatePrice($defaultNonMajorPrice);
        }

        $matrix[] = $defaultRow;

        // Add each configured city
        foreach ($cities as $city) {
            $row = [
                'city' => $city->city_name,
                'city_id' => $city->id,
                'is_major' => $city->is_major_city,
                'base_price' => $city->base_price,
                'tiers' => [],
            ];

            foreach ($tiers as $tier) {
                $row['tiers'][$tier->tier_key] = $tier->calculatePrice((float) $city->base_price);
            }

            $matrix[] = $row;
        }

        return [
            'matrix' => $matrix,
            'tiers' => $tiers->map(fn($t) => [
                'key' => $t->tier_key,
                'name' => $t->tier_name,
                'value_range' => $t->value_range,
            ])->toArray(),
        ];
    }
}
