<?php

// Simple script to check which property columns are missing
require_once __DIR__ . '/vendor/autoload.php';

// Load Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;

$requiredColumns = [
    'description',
    'nombre_pieces', 
    'nombre_chambres',
    'nombre_salles_bain',
    'etage',
    'annee_construction',
    'etat_propriete',
    'type_chauffage',
    'dpe_classe_energie',
    'dpe_classe_ges',
    'amenities',
    'meuble',
    'charges_mensuelles',
    'informations_complementaires'
];

echo "Checking properties table for missing columns...\n";
echo "==================================================\n";

$missingColumns = [];
$existingColumns = [];

foreach ($requiredColumns as $column) {
    if (Schema::hasColumn('properties', $column)) {
        $existingColumns[] = $column;
        echo "✅ $column (exists)\n";
    } else {
        $missingColumns[] = $column;
        echo "❌ $column (MISSING)\n";
    }
}

echo "\n";
echo "Summary:\n";
echo "--------\n";
echo "Existing columns: " . count($existingColumns) . "\n";
echo "Missing columns: " . count($missingColumns) . "\n";

if (count($missingColumns) > 0) {
    echo "\nMissing columns that need to be added:\n";
    foreach ($missingColumns as $column) {
        echo "- $column\n";
    }
    echo "\nRun the safe migration to add these columns.\n";
} else {
    echo "\n🎉 All required columns exist!\n";
}
