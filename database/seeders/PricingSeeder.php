<?php

namespace Database\Seeders;

use App\Models\PricingCity;
use App\Models\PricingTier;
use App\Models\PricingSetting;
use Illuminate\Database\Seeder;

class PricingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedSettings();
        $this->seedCities();
        $this->seedTiers();
    }

    /**
     * Seed default pricing settings
     */
    private function seedSettings(): void
    {
        $settings = [
            [
                'setting_key' => PricingSetting::DEFAULT_NON_MAJOR_CITY_PRICE,
                'setting_value' => '15.00',
                'description' => 'Default price for cities not in the major cities list',
            ],
            [
                'setting_key' => PricingSetting::DEFAULT_MAJOR_CITY_PRICE,
                'setting_value' => '25.00',
                'description' => 'Default base price for major cities',
            ],
            [
                'setting_key' => PricingSetting::PRICING_ENABLED,
                'setting_value' => 'true',
                'description' => 'Whether dynamic pricing is enabled',
            ],
        ];

        foreach ($settings as $setting) {
            PricingSetting::updateOrCreate(
                ['setting_key' => $setting['setting_key']],
                $setting
            );
        }

        $this->command->info('Pricing settings seeded successfully.');
    }

    /**
     * Seed major French cities
     */
    private function seedCities(): void
    {
        $majorCities = [
            ['name' => 'Paris', 'price' => 25.00],
            ['name' => 'Marseille', 'price' => 25.00],
            ['name' => 'Lyon', 'price' => 25.00],
            ['name' => 'Bordeaux', 'price' => 25.00],
            ['name' => 'Toulouse', 'price' => 25.00],
            ['name' => 'Nice', 'price' => 25.00],
            ['name' => 'Nantes', 'price' => 25.00],
            ['name' => 'Montpellier', 'price' => 25.00],
            ['name' => 'Strasbourg', 'price' => 25.00],
            ['name' => 'Lille', 'price' => 25.00],
        ];

        foreach ($majorCities as $city) {
            $normalized = PricingCity::normalizeCity($city['name']);

            PricingCity::updateOrCreate(
                [
                    'city_name_normalized' => $normalized,
                    'country' => 'France',
                ],
                [
                    'city_name' => $city['name'],
                    'base_price' => $city['price'],
                    'is_major_city' => true,
                    'is_active' => true,
                ]
            );
        }

        $this->command->info('Major cities seeded successfully (' . count($majorCities) . ' cities).');
    }

    /**
     * Seed pricing tiers
     */
    private function seedTiers(): void
    {
        $tiers = [
            [
                'tier_name' => 'Standard',
                'tier_key' => PricingTier::TIER_STANDARD,
                'min_property_value' => 0,
                'max_property_value' => 490000,
                'price_adjustment' => 0,
                'is_flat_rate' => false,
                'flat_rate_price' => null,
                'display_order' => 1,
                'is_active' => true,
            ],
            [
                'tier_name' => 'Mid-Range',
                'tier_key' => PricingTier::TIER_MID_RANGE,
                'min_property_value' => 490000,
                'max_property_value' => 800000,
                'price_adjustment' => 10,
                'is_flat_rate' => false,
                'flat_rate_price' => null,
                'display_order' => 2,
                'is_active' => true,
            ],
            [
                'tier_name' => 'High-Value',
                'tier_key' => PricingTier::TIER_HIGH_VALUE,
                'min_property_value' => 800000,
                'max_property_value' => 1000000,
                'price_adjustment' => 0,
                'is_flat_rate' => true,
                'flat_rate_price' => 50,
                'display_order' => 3,
                'is_active' => true,
            ],
            [
                'tier_name' => 'Prestige',
                'tier_key' => PricingTier::TIER_PRESTIGE,
                'min_property_value' => 1000000,
                'max_property_value' => null, // No upper limit
                'price_adjustment' => 0,
                'is_flat_rate' => true,
                'flat_rate_price' => 50,
                'display_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($tiers as $tier) {
            PricingTier::updateOrCreate(
                ['tier_key' => $tier['tier_key']],
                $tier
            );
        }

        $this->command->info('Pricing tiers seeded successfully (' . count($tiers) . ' tiers).');
    }
}
