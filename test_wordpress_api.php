<?php

/**
 * Test WordPress API bedroom/bathroom data
 * Run this from your Laravel app root: php test_wordpress_api.php
 */

require_once 'vendor/autoload.php';

// Load Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Property;

echo "🔍 Testing WordPress API bedroom/bathroom data...\n\n";

// Test 1: Check Property model data
echo "📊 Checking Property model data:\n";
$properties = Property::where('statut', 'PUBLIE')
    ->where('contacts_restants', '>', 0)
    ->limit(3)
    ->get();

if ($properties->count() > 0) {
    foreach ($properties as $property) {
        echo "• Property ID: {$property->id}\n";
        echo "  - Type: {$property->type_propriete}\n";
        echo "  - Bedrooms (nombre_chambres): " . ($property->nombre_chambres ?? 'NULL') . "\n";
        echo "  - Bathrooms (nombre_salles_bain): " . ($property->nombre_salles_bain ?? 'NULL') . "\n";
        echo "  - Surface: {$property->superficie_m2} m²\n";
        echo "  - Location: {$property->ville}, {$property->pays}\n\n";
    }
} else {
    echo "❌ No published properties found!\n\n";
}

// Test 2: Simulate WordPress API call
echo "🔗 Testing WordPress API response format:\n";
$controller = new App\Http\Controllers\Api\WordPressController();

// Create a fake request
$request = new Illuminate\Http\Request();
$request->merge(['per_page' => 2, 'app_url' => 'http://localhost:8000']);

try {
    $response = $controller->searchProperties($request);
    $data = json_decode($response->getContent(), true);
    
    if ($data['success'] && !empty($data['data'])) {
        echo "✅ API call successful!\n";
        foreach ($data['data'] as $index => $property) {
            echo "• Property " . ($index + 1) . ":\n";
            echo "  - ID: {$property['id']}\n";
            echo "  - Title: {$property['title']}\n";
            echo "  - Price: {$property['price_formatted']}\n";
            echo "  - Bedrooms: " . ($property['bedrooms'] ?? 'NOT SET') . "\n";
            echo "  - Bathrooms: " . ($property['bathrooms'] ?? 'NOT SET') . "\n";
            echo "  - Rooms: " . ($property['rooms'] ?? 'NOT SET') . "\n";
            echo "  - Surface: {$property['surface_formatted']}\n";
            echo "  - Location: {$property['location']}\n\n";
        }
    } else {
        echo "❌ API call failed or no data returned\n";
        echo "Response: " . json_encode($data, JSON_PRETTY_PRINT) . "\n\n";
    }
} catch (Exception $e) {
    echo "❌ API call error: " . $e->getMessage() . "\n\n";
}

// Test 3: Check featured properties
echo "⭐ Testing Featured Properties API:\n";
try {
    $response = $controller->getFeaturedProperties($request);
    $data = json_decode($response->getContent(), true);
    
    if ($data['success'] && !empty($data['data'])) {
        echo "✅ Featured Properties API successful!\n";
        $property = $data['data'][0];
        echo "• Sample property:\n";
        echo "  - Bedrooms: " . ($property['bedrooms'] ?? 'NOT SET') . "\n";
        echo "  - Bathrooms: " . ($property['bathrooms'] ?? 'NOT SET') . "\n";
        echo "  - Rooms: " . ($property['rooms'] ?? 'NOT SET') . "\n\n";
    } else {
        echo "❌ Featured Properties API failed\n\n";
    }
} catch (Exception $e) {
    echo "❌ Featured Properties API error: " . $e->getMessage() . "\n\n";
}

echo "🎯 Test completed!\n";
echo "If bedrooms/bathrooms show 'NULL' or 'NOT SET', run the seeder:\n";
echo "php artisan db:seed --class=UpdatePropertyBedroomBathroomSeeder\n";
