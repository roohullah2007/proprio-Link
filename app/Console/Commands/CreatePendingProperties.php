<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Property;
use App\Models\User;

class CreatePendingProperties extends Command
{
    protected $signature = 'admin:create-pending-properties';
    protected $description = 'Create test pending properties for admin review';

    public function handle()
    {
        $this->info('Creating test pending properties...');

        // Find or create a property owner
        $proprietaire = User::where('type_utilisateur', 'PROPRIETAIRE')->first();
        
        if (!$proprietaire) {
            $proprietaire = User::create([
                'prenom' => 'Test',
                'nom' => 'Owner',
                'email' => 'testowner@propio.com',
                'email_verified_at' => now(),
                'password' => bcrypt('password'),
                'type_utilisateur' => 'PROPRIETAIRE',
                'est_verifie' => true,
                'language' => 'fr',
            ]);
            $this->info("Created property owner: {$proprietaire->email}");
        } else {
            $this->info("Using existing property owner: {$proprietaire->email}");
        }

        // Create test pending properties
        $cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad'];
        $types = ['APPARTEMENT', 'MAISON', 'TERRAIN', 'COMMERCIAL', 'BUREAU'];
        
        $created = 0;
        for ($i = 1; $i <= 5; $i++) {
            $city = $cities[array_rand($cities)];
            $type = $types[array_rand($types)];
            
            $property = Property::create([
                'proprietaire_id' => $proprietaire->id,
                'adresse_complete' => "Block $i, Test Area, $city",
                'pays' => 'Pakistan',
                'ville' => $city,
                'prix' => rand(2000000, 15000000),
                'superficie_m2' => rand(80, 300),
                'type_propriete' => $type,
                'description' => "Test property $i requiring admin review and approval.",
                'nombre_pieces' => rand(3, 6),
                'nombre_chambres' => rand(2, 4),
                'nombre_salles_bain' => rand(1, 3),
                'contacts_souhaites' => 5,
                'contacts_restants' => 5,
                'statut' => Property::STATUT_EN_ATTENTE, // This is the key!
                'created_at' => now()->subDays(rand(1, 7)),
            ]);
            
            $this->info("Created pending property: {$property->ville} - {$property->type_propriete}");
            $created++;
        }
        
        // Check results
        $pendingCount = Property::where('statut', Property::STATUT_EN_ATTENTE)->count();
        
        $this->info("✅ Created {$created} test pending properties");
        $this->info("📊 Total pending properties in database: {$pendingCount}");
        $this->info("🔗 Visit /admin/dashboard to see updated stats");
        $this->info("📋 Visit /admin/properties/pending to review properties");

        return 0;
    }
}
