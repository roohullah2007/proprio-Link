# Dynamic Lead Pricing System - Implementation Plan

## Overview
This document outlines the implementation of a dynamic lead pricing system for Proprio-Link. The system allows administrators to configure location-based and property value-based pricing for contact/lead purchases.

## Current System
- Single static price stored in `admin_settings` table (`contact_purchase_price`)
- Default: €15.00
- No location or property value considerations

## New Pricing Model

### Geographic Classification
- **Major Cities**: Paris, Marseille, Lyon, Bordeaux, Toulouse, Nice, Nantes, Montpellier, Strasbourg, Lille
- **Base Price for Major Cities**: €25
- **Base Price for Other Cities**: €15

### Property Value Tiers

| Tier | Property Value Range | Non-Major City Price | Major City Price |
|------|---------------------|---------------------|------------------|
| Standard | Up to €490,000 | €15 | €25 |
| Mid-Range | €490,000 - €800,000 | €25 (€15 + €10) | €35 (€25 + €10) |
| High-Value | €800,000 - €1,000,000 | €50 (flat rate) | €50 (flat rate) |
| Prestige | €1,000,000+ | €50 (flat rate) | €50 (flat rate) |

## Database Schema

### Table: `pricing_cities`
```sql
CREATE TABLE pricing_cities (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(255) NOT NULL,
    city_name_normalized VARCHAR(255) NOT NULL,
    country VARCHAR(255) DEFAULT 'France',
    base_price DECIMAL(8,2) DEFAULT 25.00,
    is_major_city BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    UNIQUE KEY unique_city_country (city_name_normalized, country)
);
```

### Table: `pricing_tiers`
```sql
CREATE TABLE pricing_tiers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tier_name VARCHAR(255) NOT NULL,
    tier_key VARCHAR(50) NOT NULL UNIQUE,
    min_property_value DECIMAL(12,2) NOT NULL,
    max_property_value DECIMAL(12,2) NULL,
    price_adjustment DECIMAL(8,2) DEFAULT 0.00,
    is_flat_rate BOOLEAN DEFAULT FALSE,
    flat_rate_price DECIMAL(8,2) NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Table: `pricing_settings`
```sql
CREATE TABLE pricing_settings (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(255) NOT NULL UNIQUE,
    setting_value TEXT NULL,
    description TEXT NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

## Pricing Calculation Logic

```php
public function calculatePrice(Property $property): array
{
    $city = $property->ville;
    $propertyValue = $property->prix;

    // Step 1: Determine base price from city
    $pricingCity = PricingCity::where('city_name_normalized', $this->normalizeCity($city))
        ->where('is_active', true)
        ->first();

    if ($pricingCity) {
        $basePrice = $pricingCity->base_price;
        $isMajorCity = $pricingCity->is_major_city;
    } else {
        $basePrice = $this->getDefaultNonMajorCityPrice(); // €15
        $isMajorCity = false;
    }

    // Step 2: Apply tier adjustment
    $tier = PricingTier::where('is_active', true)
        ->where('min_property_value', '<=', $propertyValue)
        ->where(function($q) use ($propertyValue) {
            $q->whereNull('max_property_value')
              ->orWhere('max_property_value', '>=', $propertyValue);
        })
        ->orderBy('min_property_value', 'desc')
        ->first();

    if ($tier) {
        if ($tier->is_flat_rate) {
            $finalPrice = $tier->flat_rate_price;
        } else {
            $finalPrice = $basePrice + $tier->price_adjustment;
        }
    } else {
        $finalPrice = $basePrice;
    }

    return [
        'final_price' => $finalPrice,
        'base_price' => $basePrice,
        'tier_name' => $tier?->tier_name ?? 'Standard',
        'tier_adjustment' => $tier?->price_adjustment ?? 0,
        'is_flat_rate' => $tier?->is_flat_rate ?? false,
        'is_major_city' => $isMajorCity,
        'city_matched' => $pricingCity !== null,
    ];
}
```

## Implementation Tasks

### Phase 1: Database Structure ✅ COMPLETED
- [x] Create migration for `pricing_cities` table
- [x] Create migration for `pricing_tiers` table
- [x] Create migration for `pricing_settings` table
- [x] Create PricingCity model
- [x] Create PricingTier model
- [x] Create PricingSetting model
- [x] Create database seeder with default data

### Phase 2: Backend Services ✅ COMPLETED
- [x] Create LeadPricingService
- [x] Create PricingController for admin CRUD
- [x] Update PaymentController to use dynamic pricing
- [x] Add API routes for pricing management

### Phase 3: Admin UI ✅ COMPLETED
- [x] Create LeadPricing.jsx admin page
- [x] Cities management section
- [x] Pricing tiers management section
- [x] Pricing calculator/preview tool
- [x] Add navigation link in admin sidebar

### Phase 4: Frontend Updates ✅ COMPLETED
- [x] Update payment page to show dynamic pricing
- [x] Add pricing breakdown display
- [x] Update translations (EN/FR)

## File Structure

```
app/
├── Http/
│   └── Controllers/
│       └── Admin/
│           └── PricingController.php
├── Models/
│   ├── PricingCity.php
│   ├── PricingTier.php
│   └── PricingSetting.php
└── Services/
    └── LeadPricingService.php

database/
├── migrations/
│   ├── xxxx_create_pricing_cities_table.php
│   ├── xxxx_create_pricing_tiers_table.php
│   └── xxxx_create_pricing_settings_table.php
└── seeders/
    └── PricingSeeder.php

resources/js/Pages/Admin/
└── LeadPricing.jsx

routes/
└── web.php (updated)

lang/
├── en.json (updated)
└── fr.json (updated)
```

## API Endpoints

### Cities Management
- `GET /admin/pricing/cities` - List all cities
- `POST /admin/pricing/cities` - Create city
- `PUT /admin/pricing/cities/{id}` - Update city
- `DELETE /admin/pricing/cities/{id}` - Delete city

### Tiers Management
- `GET /admin/pricing/tiers` - List all tiers
- `PUT /admin/pricing/tiers/{id}` - Update tier

### Settings
- `GET /admin/pricing/settings` - Get pricing settings
- `PUT /admin/pricing/settings` - Update pricing settings

### Utility
- `POST /admin/pricing/calculate` - Calculate price for city + value
- `GET /admin/pricing` - Main pricing admin page

## Default Data

### Major Cities (Base Price: €25)
1. Paris
2. Marseille
3. Lyon
4. Bordeaux
5. Toulouse
6. Nice
7. Nantes
8. Montpellier
9. Strasbourg
10. Lille

### Default Pricing Tiers
1. **Standard** (€0 - €490,000): No adjustment
2. **Mid-Range** (€490,000 - €800,000): +€10 adjustment
3. **High-Value** (€800,000 - €1,000,000): €50 flat rate
4. **Prestige** (€1,000,000+): €50 flat rate

### Default Settings
- `default_non_major_city_price`: 15.00
- `default_major_city_price`: 25.00

## Testing Scenarios

| City | Property Value | Expected Price |
|------|---------------|----------------|
| Lyon (major) | €300,000 | €25 |
| Lyon (major) | €500,000 | €35 |
| Lyon (major) | €900,000 | €50 |
| Lyon (major) | €1,500,000 | €50 |
| Annecy (non-major) | €300,000 | €15 |
| Annecy (non-major) | €500,000 | €25 |
| Annecy (non-major) | €900,000 | €50 |

## Notes

- City names are normalized (lowercase, accents removed) for matching
- Admins can add any city and set custom base prices
- Tiers can be modified but not deleted (for data integrity)
- All prices are in EUR
- System falls back to default pricing if no match found
