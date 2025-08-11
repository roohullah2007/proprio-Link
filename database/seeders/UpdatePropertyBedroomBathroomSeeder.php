<?php

namespace Database\Seeders;

use App\Models\Property;
use Illuminate\Database\Seeder;

class UpdatePropertyBedroomBathroomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('Updating properties with bedroom and bathroom counts...');

        // Get all properties that don't have bedroom/bathroom data
        $properties = Property::where(function($query) {
            $query->whereNull('nombre_chambres')
                  ->orWhereNull('nombre_salles_bain')
                  ->orWhere('nombre_chambres', 0)
                  ->orWhere('nombre_salles_bain', 0);
        })->get();

        if ($properties->count() === 0) {
            $this->command->info('No properties need updating. All properties already have bedroom/bathroom data.');
            return;
        }

        $this->command->info("Found {$properties->count()} properties to update...");

        foreach ($properties as $property) {
            // Generate realistic bedroom count based on property type and surface
            $bedrooms = $this->generateBedroomCount($property);
            $bathrooms = $this->generateBathroomCount($property, $bedrooms);

            // Update the property
            $property->update([
                'nombre_chambres' => $bedrooms,
                'nombre_salles_bain' => $bathrooms,
            ]);

            $this->command->info("Updated property {$property->id}: {$bedrooms} bedrooms, {$bathrooms} bathrooms");
        }

        $this->command->info("Successfully updated {$properties->count()} properties!");
    }

    /**
     * Generate realistic bedroom count based on property characteristics
     */
    private function generateBedroomCount(Property $property): int
    {
        $surface = $property->superficie_m2 ?? 100;
        $type = $property->type_propriete;

        // Use property ID as seed for consistent results
        $seed = crc32($property->id);
        mt_srand($seed);

        // Base bedroom count on surface area
        if ($surface < 30) {
            $bedrooms = 1; // Studio or very small
        } elseif ($surface < 60) {
            $bedrooms = mt_rand(1, 2); // Small apartment/house
        } elseif ($surface < 90) {
            $bedrooms = mt_rand(2, 3); // Medium apartment/house
        } elseif ($surface < 150) {
            $bedrooms = mt_rand(3, 4); // Large apartment/house
        } else {
            $bedrooms = mt_rand(4, 6); // Very large house
        }

        // Adjust based on property type
        if ($type === 'APPARTEMENT' && $bedrooms > 4) {
            $bedrooms = 4; // Cap apartments at 4 bedrooms
        } elseif ($type === 'COMMERCIAL' || $type === 'BUREAU') {
            $bedrooms = 0; // Commercial properties don't have bedrooms
        }

        mt_srand(); // Reset random seed
        return max(1, $bedrooms);
    }

    /**
     * Generate realistic bathroom count based on bedrooms and property characteristics
     */
    private function generateBathroomCount(Property $property, int $bedrooms): int
    {
        $surface = $property->superficie_m2 ?? 100;
        $type = $property->type_propriete;

        // Use property ID as seed for consistent results
        $seed = crc32($property->id . 'bath');
        mt_srand($seed);

        // Commercial properties
        if ($type === 'COMMERCIAL' || $type === 'BUREAU') {
            $bathrooms = mt_rand(1, 3); // Commercial properties have restrooms
        } elseif ($bedrooms === 1) {
            $bathrooms = 1; // 1 bedroom = 1 bathroom
        } elseif ($bedrooms === 2) {
            $bathrooms = mt_rand(1, 2); // 2 bedrooms = 1-2 bathrooms
        } elseif ($bedrooms === 3) {
            $bathrooms = mt_rand(2, 3); // 3 bedrooms = 2-3 bathrooms
        } elseif ($bedrooms >= 4) {
            $bathrooms = mt_rand(2, 4); // 4+ bedrooms = 2-4 bathrooms
        } else {
            $bathrooms = 1; // Fallback
        }

        mt_srand(); // Reset random seed
        return max(1, $bathrooms);
    }
}
