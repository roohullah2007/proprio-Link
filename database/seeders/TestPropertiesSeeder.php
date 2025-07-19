<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class TestPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create a test property owner if not exists
        $owner = User::firstOrCreate(
            ['email' => 'testowner@propio.fr'],
            [
                'uuid' => Str::uuid(),
                'prenom' => 'Jean',
                'nom' => 'Dupont',
                'telephone' => '+33123456789',
                'type_utilisateur' => User::TYPE_PROPRIETAIRE,
                'est_verifie' => true,
                'language' => 'fr',
                'password' => Hash::make('password123'),
                'email_verified_at' => now(),
            ]
        );

        // Create test properties
        $properties = [
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => '123 Rue de Rivoli, 75001 Paris',
                'ville' => 'Paris',
                'pays' => 'France',
                'prix' => 450000,
                'superficie_m2' => 85,
                'description' => 'Magnifique appartement au cœur de Paris, proche du Louvre. Rénové récemment avec des finitions de qualité.',
            ],
            [
                'type_propriete' => 'MAISON',
                'adresse_complete' => '45 Avenue des Champs, 69000 Lyon',
                'ville' => 'Lyon',
                'pays' => 'France',
                'prix' => 320000,
                'superficie_m2' => 120,
                'description' => 'Belle maison familiale avec jardin, proche des écoles et transports. Parfaite pour une famille.',
            ],
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => '78 Boulevard Saint-Michel, 75006 Paris',
                'ville' => 'Paris',
                'pays' => 'France',
                'prix' => 280000,
                'superficie_m2' => 35,
                'description' => 'Studio moderne dans le 6ème arrondissement, idéal pour étudiant ou investissement locatif.',
            ],
            [
                'type_propriete' => 'MAISON',
                'adresse_complete' => '12 Chemin des Oliviers, 06400 Cannes',
                'ville' => 'Cannes',
                'pays' => 'France',
                'prix' => 850000,
                'superficie_m2' => 200,
                'description' => 'Villa de luxe avec piscine et vue mer, dans un quartier résidentiel calme de Cannes.',
            ],
            [
                'type_propriete' => 'APPARTEMENT',
                'adresse_complete' => '33 Rue Nationale, 13000 Marseille',
                'ville' => 'Marseille',
                'pays' => 'France',
                'prix' => 195000,
                'superficie_m2' => 70,
                'description' => 'Appartement lumineux avec balcon, proche du Vieux-Port et des commodités.',
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::firstOrCreate(
                [
                    'adresse_complete' => $propertyData['adresse_complete'],
                    'proprietaire_id' => $owner->id,
                ],
                array_merge($propertyData, [
                    'id' => Str::uuid(),
                    'proprietaire_id' => $owner->id,
                    'contacts_souhaites' => 5,
                    'contacts_restants' => 5,
                    'statut' => Property::STATUT_PUBLIE, // Already published for testing
                    'created_at' => now()->subDays(rand(1, 30)),
                    'updated_at' => now(),
                ])
            );
        }

        $this->command->info('Test properties created successfully!');
        $this->command->info('Owner email: testowner@propio.fr');
        $this->command->info('Owner password: password123');
    }
}
