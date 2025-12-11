<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PricingCity;
use App\Models\PricingTier;
use App\Models\PricingSetting;
use App\Services\LeadPricingService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class PricingController extends Controller
{
    protected LeadPricingService $pricingService;

    public function __construct(LeadPricingService $pricingService)
    {
        $this->pricingService = $pricingService;
    }

    /**
     * Display the pricing management page
     */
    public function index()
    {
        $cities = PricingCity::orderBy('city_name')->get();
        $tiers = PricingTier::orderBy('display_order')->get();
        $settings = [
            'default_non_major_city_price' => PricingSetting::getDefaultNonMajorCityPrice(),
            'default_major_city_price' => PricingSetting::getDefaultMajorCityPrice(),
            'pricing_enabled' => PricingSetting::isPricingEnabled(),
        ];
        $pricingMatrix = $this->pricingService->getPricingMatrix();

        return Inertia::render('Admin/LeadPricing', [
            'cities' => $cities,
            'tiers' => $tiers,
            'settings' => $settings,
            'pricingMatrix' => $pricingMatrix,
        ]);
    }

    // ===========================
    // CITIES CRUD
    // ===========================

    /**
     * Store a new pricing city
     */
    public function storeCity(Request $request)
    {
        $validated = $request->validate([
            'city_name' => [
                'required',
                'string',
                'max:255',
            ],
            'country' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:1|max:1000',
            'is_major_city' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Check for duplicate (normalized)
        $normalized = PricingCity::normalizeCity($validated['city_name']);
        $exists = PricingCity::where('city_name_normalized', $normalized)
            ->where('country', $validated['country'])
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'city_name' => __('This city already exists for the selected country.')
            ]);
        }

        PricingCity::create([
            'city_name' => $validated['city_name'],
            'city_name_normalized' => $normalized,
            'country' => $validated['country'],
            'base_price' => $validated['base_price'],
            'is_major_city' => $validated['is_major_city'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->pricingService->clearCache();

        return back()->with('success', __('City added successfully.'));
    }

    /**
     * Update a pricing city
     */
    public function updateCity(Request $request, PricingCity $city)
    {
        $validated = $request->validate([
            'city_name' => [
                'required',
                'string',
                'max:255',
            ],
            'country' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:1|max:1000',
            'is_major_city' => 'boolean',
            'is_active' => 'boolean',
        ]);

        // Check for duplicate (normalized) excluding current city
        $normalized = PricingCity::normalizeCity($validated['city_name']);
        $exists = PricingCity::where('city_name_normalized', $normalized)
            ->where('country', $validated['country'])
            ->where('id', '!=', $city->id)
            ->exists();

        if ($exists) {
            return back()->withErrors([
                'city_name' => __('This city already exists for the selected country.')
            ]);
        }

        $city->update([
            'city_name' => $validated['city_name'],
            'city_name_normalized' => $normalized,
            'country' => $validated['country'],
            'base_price' => $validated['base_price'],
            'is_major_city' => $validated['is_major_city'] ?? true,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->pricingService->clearCache();

        return back()->with('success', __('City updated successfully.'));
    }

    /**
     * Delete a pricing city
     */
    public function destroyCity(PricingCity $city)
    {
        $city->delete();

        $this->pricingService->clearCache();

        return back()->with('success', __('City deleted successfully.'));
    }

    /**
     * Bulk add default French major cities
     */
    public function addDefaultCities(Request $request)
    {
        $defaultCities = [
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

        $added = 0;
        foreach ($defaultCities as $city) {
            $normalized = PricingCity::normalizeCity($city['name']);
            $exists = PricingCity::where('city_name_normalized', $normalized)
                ->where('country', 'France')
                ->exists();

            if (!$exists) {
                PricingCity::create([
                    'city_name' => $city['name'],
                    'city_name_normalized' => $normalized,
                    'country' => 'France',
                    'base_price' => $city['price'],
                    'is_major_city' => true,
                    'is_active' => true,
                ]);
                $added++;
            }
        }

        $this->pricingService->clearCache();

        return back()->with('success', __(':count major cities added.', ['count' => $added]));
    }

    // ===========================
    // TIERS CRUD
    // ===========================

    /**
     * Update a pricing tier
     */
    public function updateTier(Request $request, PricingTier $tier)
    {
        $validated = $request->validate([
            'tier_name' => 'required|string|max:255',
            'min_property_value' => 'required|numeric|min:0',
            'max_property_value' => 'nullable|numeric|min:0',
            'price_adjustment' => 'required|numeric|min:0|max:500',
            'is_flat_rate' => 'boolean',
            'flat_rate_price' => 'nullable|numeric|min:1|max:1000',
            'is_active' => 'boolean',
        ]);

        // Validate that flat_rate_price is set if is_flat_rate is true
        if ($validated['is_flat_rate'] && empty($validated['flat_rate_price'])) {
            return back()->withErrors([
                'flat_rate_price' => __('Flat rate price is required when flat rate is enabled.')
            ]);
        }

        // Validate max > min if max is set
        if ($validated['max_property_value'] !== null &&
            $validated['max_property_value'] <= $validated['min_property_value']) {
            return back()->withErrors([
                'max_property_value' => __('Maximum value must be greater than minimum value.')
            ]);
        }

        $tier->update([
            'tier_name' => $validated['tier_name'],
            'min_property_value' => $validated['min_property_value'],
            'max_property_value' => $validated['max_property_value'],
            'price_adjustment' => $validated['price_adjustment'],
            'is_flat_rate' => $validated['is_flat_rate'] ?? false,
            'flat_rate_price' => $validated['flat_rate_price'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $this->pricingService->clearCache();

        return back()->with('success', __('Tier updated successfully.'));
    }

    // ===========================
    // SETTINGS
    // ===========================

    /**
     * Update pricing settings
     */
    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'default_non_major_city_price' => 'required|numeric|min:1|max:500',
            'default_major_city_price' => 'required|numeric|min:1|max:500',
            'pricing_enabled' => 'boolean',
        ]);

        PricingSetting::setValue(
            PricingSetting::DEFAULT_NON_MAJOR_CITY_PRICE,
            $validated['default_non_major_city_price'],
            'Default price for cities not in the major cities list'
        );

        PricingSetting::setValue(
            PricingSetting::DEFAULT_MAJOR_CITY_PRICE,
            $validated['default_major_city_price'],
            'Default base price for major cities'
        );

        PricingSetting::setValue(
            PricingSetting::PRICING_ENABLED,
            $validated['pricing_enabled'] ?? true,
            'Whether dynamic pricing is enabled'
        );

        $this->pricingService->clearCache();

        return back()->with('success', __('Pricing settings updated successfully.'));
    }

    // ===========================
    // UTILITIES
    // ===========================

    /**
     * Calculate price for given city and property value (AJAX)
     */
    public function calculatePrice(Request $request)
    {
        $validated = $request->validate([
            'city' => 'required|string|max:255',
            'property_value' => 'required|numeric|min:0',
            'country' => 'nullable|string|max:255',
        ]);

        $pricing = $this->pricingService->calculatePriceForCityAndValue(
            $validated['city'],
            $validated['property_value'],
            $validated['country'] ?? 'France'
        );

        return response()->json([
            'success' => true,
            'pricing' => $pricing,
            'formatted_price' => $this->pricingService->formatPrice($pricing['final_price']),
        ]);
    }

    /**
     * Get pricing matrix (AJAX)
     */
    public function getMatrix()
    {
        return response()->json([
            'success' => true,
            'data' => $this->pricingService->getPricingMatrix(),
        ]);
    }
}
