<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Facades\Hash;

class PendingPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Ensure we have property owners
        $owners = [];
        
        for ($i = 1; $i <= 3; $i++) {
            $owners[] = User::firstOrCreate(
                ['email' => "owner{$i}@propio.com"],
                [
                    'prenom' => "Owner{$i}",
                    'nom' => 'TestUser',
                    'telephone' => "03{$i}{$i}1234567",
                    'password' => Hash::make('password'),
                    'type_utilisateur' => 'PROPRIETAIRE',
                    'est_verifie' => true,
                    'language' => 'fr',
                    'email_verified_at' => now(),
                ]
            );
        }

        // Create pending properties
        $pendingProperties = [
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => 'Flat 301, Block A, Gulshan-e-Iqbal, Karachi',
                'ville' => 'Karachi',
                'pays' => 'Pakistan',
                'prix' => 8500000,
                'superficie_m2' => 120,
                'description' => 'Modern 3-bedroom apartment in prime location. Recently renovated with modern amenities. Awaiting admin approval.',
                'nombre_pieces' => 4,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 2,
            ],
            [
                'type_propriete' => 'MAISON',
                'adresse_complete' => 'House 45, Street 12, F-8/3, Islamabad',
                'ville' => 'Islamabad',
                'pays' => 'Pakistan',
                'prix' => 25000000,
                'superficie_m2' => 250,
                'description' => 'Beautiful house with garden in F-8 sector. Perfect for families. Needs admin review.',
                'nombre_pieces' => 6,
                'nombre_chambres' => 4,
                'nombre_salles_bain' => 3,
            ],
            [
                'type_propriete' => 'COMMERCIAL',
                'adresse_complete' => 'Shop 12, Main Market, Johar Town, Lahore',
                'ville' => 'Lahore',
                'pays' => 'Pakistan',
                'prix' => 12000000,
                'superficie_m2' => 80,
                'description' => 'Prime commercial space in busy market area. Great for retail business. Pending moderation.',
                'nombre_pieces' => 2,
                'nombre_chambres' => 0,
                'nombre_salles_bain' => 1,
            ],
            [
                'type_propriete' => 'TERRAIN',
                'adresse_complete' => 'Plot 123, Block C, DHA Phase 5, Karachi',
                'ville' => 'Karachi',
                'pays' => 'Pakistan',
                'prix' => 15000000,
                'superficie_m2' => 300,
                'description' => 'Residential plot in DHA Phase 5. Ready for construction. Awaiting approval.',
                'nombre_pieces' => 0,
                'nombre_chambres' => 0,
                'nombre_salles_bain' => 0,
            ],
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => 'Apartment 15B, Tower Heights, Clifton, Karachi',
                'ville' => 'Karachi',
                'pays' => 'Pakistan',
                'prix' => 18000000,
                'superficie_m2' => 180,
                'description' => 'Luxury apartment with sea view in Clifton area. High-end finishes. Requires admin review.',
                'nombre_pieces' => 5,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 3,
            ],
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => 'Unit 7A, Emaar Canyon Views, DHA Phase 8, Karachi',
                'ville' => 'Karachi',
                'pays' => 'Pakistan',
                'prix' => 22000000,
                'superficie_m2' => 160,
                'description' => 'Premium apartment in Emaar project. Modern design with all amenities. Pending admin approval.',
                'nombre_pieces' => 4,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 2,
            ],
            [
                'type_propriete' => 'MAISON',
                'adresse_complete' => 'Bungalow 67, Block M, Model Town, Lahore',
                'ville' => 'Lahore',
                'pays' => 'Pakistan',
                'prix' => 35000000,
                'superficie_m2' => 400,
                'description' => 'Spacious bungalow in Model Town with large garden and parking. Family oriented property awaiting review.',
                'nombre_pieces' => 8,
                'nombre_chambres' => 5,
                'nombre_salles_bain' => 4,
            ],
            [
                'type_propriete' => 'BUREAU',
                'adresse_complete' => 'Office Suite 402, Centaurus Mall, Islamabad',
                'ville' => 'Islamabad',
                'pays' => 'Pakistan',
                'prix' => 8000000,
                'superficie_m2' => 60,
                'description' => 'Modern office space in prestigious Centaurus building. Ideal for small business. Needs approval.',
                'nombre_pieces' => 3,
                'nombre_chambres' => 0,
                'nombre_salles_bain' => 1,
            ],
        ];

        foreach ($pendingProperties as $index => $propertyData) {
            $owner = $owners[$index % count($owners)];
            
            Property::firstOrCreate(
                [
                    'adresse_complete' => $propertyData['adresse_complete'],
                    'proprietaire_id' => $owner->id,
                ],
                array_merge($propertyData, [
                    'proprietaire_id' => $owner->id,
                    'contacts_souhaites' => rand(3, 8),
                    'contacts_restants' => rand(3, 8),
                    'statut' => Property::STATUT_EN_ATTENTE, // This is the key!
                    'created_at' => now()->subDays(rand(1, 14)),
                    'updated_at' => now(),
                    'etage' => rand(0, 10),
                    'annee_construction' => rand(2000, 2024),
                    'etat_propriete' => ['NEUF', 'EXCELLENT', 'BON', 'A_RENOVER'][rand(0, 3)],
                    'type_chauffage' => ['GAZ', 'ELECTRIQUE', 'POMPE_CHALEUR', 'AUTRE'][rand(0, 3)],
                ])
            );
        }

        $this->command->info('✅ Created ' . count($pendingProperties) . ' pending properties successfully!');
        $this->command->info('🏠 Properties are now awaiting admin review');
        $this->command->info('👤 Property owners created: owner1@propio.com, owner2@propio.com, owner3@propio.com (password: password)');
        $this->command->info('🔗 Visit /admin/properties/pending to review them');
        $this->command->info('📊 Visit /admin/dashboard to see updated stats');
    }
}
