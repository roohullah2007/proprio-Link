<?php

namespace App\Console\Commands;

use App\Models\Property;
use Illuminate\Console\Command;

class UpdatePropertyBedroomBathroom extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'properties:update-bedroom-bathroom';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update existing properties with realistic bedroom and bathroom counts';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to update properties with bedroom and bathroom counts...');

        // Get all properties that don't have bedroom/bathroom data
        $properties = Property::where(function($query) {
            $query->whereNull('nombre_chambres')
                  ->orWhereNull('nombre_salles_bain')
                  ->orWhere('nombre_chambres', 0)
                  ->orWhere('nombre_salles_bain', 0);
        })->get();

        if ($properties->count() === 0) {
            $this->info('No properties need updating. All properties already have bedroom/bathroom data.');
            return;
        }

        $this->info("Found {$properties->count()} properties to update...");

        $progressBar = $this->output->createProgressBar($properties->count());
        $progressBar->start();

        foreach ($properties as $property) {
            // Generate realistic bedroom count based on property type and surface
            $bedrooms = $this->generateBedroomCount($property);
            $bathrooms = $this->generateBathroomCount($property, $bedrooms);

            // Update the property
            $property->update([
                'nombre_chambres' => $bedrooms,
                'nombre_salles_bain' => $bathrooms,
            ]);

            $progressBar->advance();
        }

        $progressBar->finish();
        $this->newLine();
        $this->info("Successfully updated {$properties->count()} properties with bedroom and bathroom counts!");
    }

    /**
     * Generate realistic bedroom count based on property characteristics
     */
    private function generateBedroomCount(Property $property): int
    {
        $surface = $property->superficie_m2 ?? 100;
        $type = $property->type_propriete;

        // Base bedroom count on surface area
        if ($surface < 30) {
            return 1; // Studio or very small
        } elseif ($surface < 60) {
            return rand(1, 2); // Small apartment/house
        } elseif ($surface < 90) {
            return rand(2, 3); // Medium apartment/house
        } elseif ($surface < 150) {
            return rand(3, 4); // Large apartment/house
        } else {
            return rand(4, 6); // Very large house
        }
    }

    /**
     * Generate realistic bathroom count based on bedrooms and property characteristics
     */
    private function generateBathroomCount(Property $property, int $bedrooms): int
    {
        $surface = $property->superficie_m2 ?? 100;
        $type = $property->type_propriete;

        // Base bathroom count on bedrooms and surface
        if ($bedrooms === 1) {
            return 1; // 1 bedroom = 1 bathroom
        } elseif ($bedrooms === 2) {
            return rand(1, 2); // 2 bedrooms = 1-2 bathrooms
        } elseif ($bedrooms === 3) {
            return rand(2, 3); // 3 bedrooms = 2-3 bathrooms
        } elseif ($bedrooms >= 4) {
            return rand(2, 4); // 4+ bedrooms = 2-4 bathrooms
        }

        return 1; // Fallback
    }
}
