<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Create test agent user
        $agent = User::firstOrCreate(
            ['email' => 'agent@test.com'],
            [
                'prenom' => 'Marie',
                'nom' => 'Agent',
                'telephone' => '0123456789',
                'password' => Hash::make('password'),
                'type_utilisateur' => 'AGENT',
                'numero_siret' => '12345678901234',
                'est_verifie' => true,
                'language' => 'fr',
                'email_verified_at' => now(),
            ]
        );

        // Create test property owner
        $owner = User::firstOrCreate(
            ['email' => 'owner@test.com'],
            [
                'prenom' => 'Jean',
                'nom' => 'Propriétaire',
                'telephone' => '0123456788',
                'password' => Hash::make('password'),
                'type_utilisateur' => 'PROPRIETAIRE',
                'est_verifie' => true,
                'language' => 'fr',
                'email_verified_at' => now(),
            ]
        );

        // Create test admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@test.com'],
            [
                'prenom' => 'Admin',
                'nom' => 'Admin',
                'telephone' => '0123456787',
                'password' => Hash::make('password'),
                'type_utilisateur' => 'ADMIN',
                'est_verifie' => true,
                'language' => 'fr',
                'email_verified_at' => now(),
            ]
        );

        // Create a test property
        $property = Property::firstOrCreate(
            ['adresse_complete' => '123 Rue de Test, 75001 Paris'],
            [
                'proprietaire_id' => $owner->id,
                'pays' => 'France',
                'ville' => 'Paris',
                'prix' => 450000,
                'superficie_m2' => 80,
                'type_propriete' => 'APPARTEMENT',
                'description' => 'Bel appartement de 3 pièces en centre-ville',
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'contacts_souhaites' => 10,
                'contacts_restants' => 10,
                'statut' => 'PUBLIE',
            ]
        );

        $this->command->info('Test data created successfully!');
        $this->command->info('Agent: agent@test.com / password');
        $this->command->info('Owner: owner@test.com / password');
        $this->command->info('Admin: admin@test.com / password');
    }
}
