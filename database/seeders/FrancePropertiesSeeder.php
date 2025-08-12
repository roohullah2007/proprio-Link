<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Property;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

class FrancePropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create the property owner if not exists
        $owner = User::firstOrCreate(
            ['email' => 'propertyowner@gmail.com'],
            [
                'uuid' => Str::uuid(),
                'prenom' => 'Marie',
                'nom' => 'Dubois',
                'telephone' => '+33145678901',
                'type_utilisateur' => User::TYPE_PROPRIETAIRE,
                'est_verifie' => true,
                'language' => 'fr',
                'password' => Hash::make('ProprioSecure2024!'),
                'email_verified_at' => now(),
                'verification_statut' => 'verifie',
            ]
        );

        // Array of diverse French properties
        $properties = [
            // Paris Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '15 Avenue des Champs-Élysées, 75008 Paris',
                'ville' => 'Paris',
                'pays' => 'France',
                'prix' => 1250000,
                'superficie_m2' => 95,
                'nombre_pieces' => 4,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 2,
                'etage' => 3,
                'annee_construction' => 1890,
                'etat_propriete' => Property::ETAT_EXCELLENT,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_C,
                'dpe_classe_ges' => Property::DPE_C,
                'meuble' => false,
                'charges_mensuelles' => 350.00,
                'description' => 'Somptueux appartement haussmannien sur les Champs-Élysées. Plafonds moulurés, parquet d\'époque, et vue exceptionnelle. Idéalement situé au cœur de Paris avec tous commerces et transports à proximité.',
                'amenities' => ['ascenseur', 'digicode', 'concierge', 'balcon', 'double_vitrage', 'cuisine_equipee', 'vue_degagee', 'proche_transports', 'proche_commerces'],
                'informations_complementaires' => 'Copropriété de standing, gardien 24h/24, possibilité parking en sous-sol (en supplément).',
            ],
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '42 Rue de la Paix, 75002 Paris',
                'ville' => 'Paris',
                'pays' => 'France',
                'prix' => 680000,
                'superficie_m2' => 65,
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 2,
                'annee_construction' => 1925,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_ELECTRIQUE,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_D,
                'meuble' => true,
                'charges_mensuelles' => 280.00,
                'description' => 'Charmant appartement meublé dans le 2ème arrondissement, proche de l\'Opéra et des grands magasins. Lumineux et calme, parfait pour investissement locatif.',
                'amenities' => ['ascenseur', 'digicode', 'interphone', 'cuisine_equipee', 'placards', 'proche_transports', 'proche_commerces', 'calme'],
                'informations_complementaires' => 'Meublé de qualité, prêt à louer. Charges incluent eau froide et chauffage collectif.',
            ],

            // Lyon Properties
            [
                'type_propriete' => Property::TYPE_MAISON,
                'adresse_complete' => '23 Rue des Marronniers, 69006 Lyon',
                'ville' => 'Lyon',
                'pays' => 'France',
                'prix' => 545000,
                'superficie_m2' => 140,
                'nombre_pieces' => 6,
                'nombre_chambres' => 4,
                'nombre_salles_bain' => 2,
                'etage' => 0,
                'annee_construction' => 1960,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_E,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Maison familiale de charme dans le 6ème arrondissement de Lyon. Grand jardin arboré, garage double, idéale pour famille nombreuse.',
                'amenities' => ['jardin', 'garage', 'terrasse', 'cave', 'cheminee', 'cuisine_amenagee', 'placards', 'proche_ecoles', 'proche_transports', 'calme'],
                'informations_complementaires' => 'Jardin de 400m², garage pour 2 voitures, cave voûtée. Quartier résidentiel calme.',
            ],
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '78 Cours Franklin Roosevelt, 69006 Lyon',
                'ville' => 'Lyon',
                'pays' => 'France',
                'prix' => 395000,
                'superficie_m2' => 80,
                'nombre_pieces' => 4,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 1,
                'annee_construction' => 1970,
                'etat_propriete' => Property::ETAT_A_RENOVER,
                'type_chauffage' => Property::CHAUFFAGE_ELECTRIQUE,
                'dpe_classe_energie' => Property::DPE_F,
                'dpe_classe_ges' => Property::DPE_F,
                'meuble' => false,
                'charges_mensuelles' => 120.00,
                'description' => 'Appartement à rénover avec fort potentiel, situé cours Franklin Roosevelt. Vue dégagée, bien exposé. Idéal investisseur ou primo-accédant.',
                'amenities' => ['balcon', 'cave', 'placards', 'vue_degagee', 'proche_transports', 'proche_commerces'],
                'informations_complementaires' => 'Travaux de rénovation à prévoir. Possibilité d\'aide aux financements. Cave et parking possible.',
            ],

            // Marseille Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '56 La Canebière, 13001 Marseille',
                'ville' => 'Marseille',
                'pays' => 'France',
                'prix' => 285000,
                'superficie_m2' => 75,
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 4,
                'annee_construction' => 1930,
                'etat_propriete' => Property::ETAT_EXCELLENT,
                'type_chauffage' => Property::CHAUFFAGE_ELECTRIQUE,
                'dpe_classe_energie' => Property::DPE_C,
                'dpe_classe_ges' => Property::DPE_B,
                'meuble' => false,
                'charges_mensuelles' => 85.00,
                'description' => 'Magnifique appartement rénové sur la mythique Canebière. Vue imprenable sur le Vieux-Port. Prestations haut de gamme.',
                'amenities' => ['ascenseur', 'digicode', 'interphone', 'climatisation', 'balcon', 'cuisine_equipee', 'double_vitrage', 'vue_mer', 'proche_transports', 'proche_commerces'],
                'informations_complementaires' => 'Rénovation complète en 2022. Climatisation réversible. Vue exceptionnelle sur le port.',
            ],
            [
                'type_propriete' => Property::TYPE_MAISON,
                'adresse_complete' => '34 Chemin des Calanques, 13008 Marseille',
                'ville' => 'Marseille',
                'pays' => 'France',
                'prix' => 750000,
                'superficie_m2' => 180,
                'nombre_pieces' => 7,
                'nombre_chambres' => 4,
                'nombre_salles_bain' => 3,
                'etage' => 0,
                'annee_construction' => 1985,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_POMPE_CHALEUR,
                'dpe_classe_energie' => Property::DPE_B,
                'dpe_classe_ges' => Property::DPE_B,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Villa moderne proche des Calanques avec piscine et vue mer panoramique. Grand terrain paysager, idéale pour recevoir.',
                'amenities' => ['piscine', 'jardin', 'terrasse', 'garage', 'alarme', 'climatisation', 'cuisine_equipee', 'dressing', 'vue_mer', 'calme'],
                'informations_complementaires' => 'Terrain de 1200m², piscine 10x5m, système d\'alarme, portail électrique.',
            ],

            // Nice Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '89 Promenade des Anglais, 06000 Nice',
                'ville' => 'Nice',
                'pays' => 'France',
                'prix' => 920000,
                'superficie_m2' => 110,
                'nombre_pieces' => 4,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 2,
                'etage' => 6,
                'annee_construction' => 1960,
                'etat_propriete' => Property::ETAT_EXCELLENT,
                'type_chauffage' => Property::CHAUFFAGE_ELECTRIQUE,
                'dpe_classe_energie' => Property::DPE_C,
                'dpe_classe_ges' => Property::DPE_C,
                'meuble' => false,
                'charges_mensuelles' => 420.00,
                'description' => 'Appartement de prestige face à la Méditerranée sur la célèbre Promenade des Anglais. Vue mer exceptionnelle, balcons filants.',
                'amenities' => ['ascenseur', 'digicode', 'concierge', 'climatisation', 'balcon', 'cuisine_equipee', 'dressing', 'vue_mer', 'proche_transports', 'proche_commerces'],
                'informations_complementaires' => 'Immeuble de grand standing, concierge, possibilité garage. Vue frontale mer.',
            ],

            // Toulouse Properties
            [
                'type_propriete' => Property::TYPE_MAISON,
                'adresse_complete' => '17 Allée Jean Jaurès, 31000 Toulouse',
                'ville' => 'Toulouse',
                'pays' => 'France',
                'prix' => 485000,
                'superficie_m2' => 160,
                'nombre_pieces' => 6,
                'nombre_chambres' => 4,
                'nombre_salles_bain' => 2,
                'etage' => 0,
                'annee_construction' => 1975,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_D,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Maison toulousaine en brique rose avec jardin. Proche centre-ville et métro, idéale famille. Architecture typique de la région.',
                'amenities' => ['jardin', 'garage', 'terrasse', 'cheminee', 'cuisine_amenagee', 'placards', 'proche_ecoles', 'proche_transports', 'calme'],
                'informations_complementaires' => 'Architecture typique toulousaine, jardin arboré 500m², proche métro ligne B.',
            ],

            // Bordeaux Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '25 Cours de l\'Intendance, 33000 Bordeaux',
                'ville' => 'Bordeaux',
                'pays' => 'France',
                'prix' => 425000,
                'superficie_m2' => 85,
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 2,
                'annee_construction' => 1880,
                'etat_propriete' => Property::ETAT_EXCELLENT,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_C,
                'dpe_classe_ges' => Property::DPE_C,
                'meuble' => false,
                'charges_mensuelles' => 180.00,
                'description' => 'Appartement bordelais de charme dans le triangle d\'or. Pierre de taille, parquets anciens, proche de tous commerces de luxe.',
                'amenities' => ['digicode', 'interphone', 'cheminee', 'cuisine_equipee', 'placards', 'double_vitrage', 'proche_transports', 'proche_commerces', 'calme'],
                'informations_complementaires' => 'Immeuble en pierre de Bordeaux, parquets d\'origine restaurés, proche tramway.',
            ],

            // Nantes Properties
            [
                'type_propriete' => Property::TYPE_MAISON,
                'adresse_complete' => '42 Rue des Olivettes, 44000 Nantes',
                'ville' => 'Nantes',
                'pays' => 'France',
                'prix' => 385000,
                'superficie_m2' => 125,
                'nombre_pieces' => 5,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 2,
                'etage' => 0,
                'annee_construction' => 1990,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_C,
                'dpe_classe_ges' => Property::DPE_C,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Maison moderne dans un quartier calme de Nantes. Jardin paysager, garage double, proche écoles et commerces.',
                'amenities' => ['jardin', 'garage', 'terrasse', 'cuisine_equipee', 'placards', 'double_vitrage', 'proche_ecoles', 'proche_transports', 'calme'],
                'informations_complementaires' => 'Quartier résidentiel, jardin paysager 300m², proche toutes commodités.',
            ],

            // Strasbourg Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '18 Place Kléber, 67000 Strasbourg',
                'ville' => 'Strasbourg',
                'pays' => 'France',
                'prix' => 295000,
                'superficie_m2' => 70,
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 3,
                'annee_construction' => 1900,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_D,
                'meuble' => false,
                'charges_mensuelles' => 150.00,
                'description' => 'Appartement alsacien authentique place Kléber. Poutres apparentes, cachet d\'époque, cœur historique de Strasbourg.',
                'amenities' => ['digicode', 'interphone', 'cuisine_amenagee', 'placards', 'proche_transports', 'proche_commerces', 'calme'],
                'informations_complementaires' => 'Architecture alsacienne typique, centre historique classé UNESCO, proche cathédrale.',
            ],

            // Montpellier Properties
            [
                'type_propriete' => Property::TYPE_APPARTEMENT,
                'adresse_complete' => '55 Rue Foch, 34000 Montpellier',
                'ville' => 'Montpellier',
                'pays' => 'France',
                'prix' => 315000,
                'superficie_m2' => 72,
                'nombre_pieces' => 3,
                'nombre_chambres' => 2,
                'nombre_salles_bain' => 1,
                'etage' => 1,
                'annee_construction' => 2010,
                'etat_propriete' => Property::ETAT_NEUF,
                'type_chauffage' => Property::CHAUFFAGE_POMPE_CHALEUR,
                'dpe_classe_energie' => Property::DPE_A,
                'dpe_classe_ges' => Property::DPE_A,
                'meuble' => false,
                'charges_mensuelles' => 95.00,
                'description' => 'Appartement contemporain neuf dans résidence récente. Prestations haut de gamme, proche tramway et universités.',
                'amenities' => ['ascenseur', 'digicode', 'interphone', 'climatisation', 'balcon', 'cuisine_equipee', 'dressing', 'double_vitrage', 'proche_transports', 'proche_ecoles'],
                'informations_complementaires' => 'Résidence neuve avec espaces verts, parking sécurisé disponible, proche campus.',
            ],

            // Lille Properties  
            [
                'type_propriete' => Property::TYPE_MAISON,
                'adresse_complete' => '28 Rue de la Monnaie, 59000 Lille',
                'ville' => 'Lille',
                'pays' => 'France',
                'prix' => 298000,
                'superficie_m2' => 95,
                'nombre_pieces' => 4,
                'nombre_chambres' => 3,
                'nombre_salles_bain' => 1,
                'etage' => 0,
                'annee_construction' => 1920,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_GAZ,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_D,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Maison de ville lilloise typique en briques rouges. Proche Grand Place et métro, idéale pour investissement ou habitation.',
                'amenities' => ['cour', 'cuisine_amenagee', 'placards', 'proche_transports', 'proche_commerces', 'proche_ecoles'],
                'informations_complementaires' => 'Architecture typique du Nord, proche toutes commodités, métro République à 5min.',
            ],

            // Commercial Property
            [
                'type_propriete' => Property::TYPE_COMMERCIAL,
                'adresse_complete' => '67 Avenue de la République, 75011 Paris',
                'ville' => 'Paris',
                'pays' => 'France',
                'prix' => 695000,
                'superficie_m2' => 120,
                'nombre_pieces' => 0,
                'nombre_chambres' => 0,
                'nombre_salles_bain' => 1,
                'etage' => 0,
                'annee_construction' => 1950,
                'etat_propriete' => Property::ETAT_BON,
                'type_chauffage' => Property::CHAUFFAGE_ELECTRIQUE,
                'dpe_classe_energie' => Property::DPE_D,
                'dpe_classe_ges' => Property::DPE_D,
                'meuble' => false,
                'charges_mensuelles' => 280.00,
                'description' => 'Local commercial avec vitrine sur avenue passante. Idéal restaurant, boutique ou bureau. Fort potentiel.',
                'amenities' => ['proche_transports', 'proche_commerces'],
                'informations_complementaires' => 'Local avec vitrine, possibilité terrasse, licence débit de boisson possible.',
            ],

            // Land Property
            [
                'type_propriete' => Property::TYPE_TERRAIN,
                'adresse_complete' => 'Chemin des Vignes, 84000 Avignon',
                'ville' => 'Avignon',
                'pays' => 'France',
                'prix' => 180000,
                'superficie_m2' => 2500,
                'nombre_pieces' => 0,
                'nombre_chambres' => 0,
                'nombre_salles_bain' => 0,
                'etage' => 0,
                'annee_construction' => null,
                'etat_propriete' => Property::ETAT_NEUF,
                'type_chauffage' => null,
                'dpe_classe_energie' => Property::DPE_NON_RENSEIGNE,
                'dpe_classe_ges' => Property::DPE_NON_RENSEIGNE,
                'meuble' => false,
                'charges_mensuelles' => 0.00,
                'description' => 'Terrain constructible avec vue sur le Mont Ventoux. Viabilisé, proche centre d\'Avignon. Idéal construction villa.',
                'amenities' => ['vue_montagne', 'calme'],
                'informations_complementaires' => 'Terrain viabilisé, COS 0.4, possibilité construction 200m². Vue panoramique.',
            ]
        ];

        // Create properties
        foreach ($properties as $index => $propertyData) {
            // Generate unique address check to avoid duplicates
            $existingProperty = Property::where('adresse_complete', $propertyData['adresse_complete'])
                                      ->where('proprietaire_id', $owner->id)
                                      ->first();
            
            if (!$existingProperty) {
                Property::create(array_merge($propertyData, [
                    'id' => Str::uuid(),
                    'proprietaire_id' => $owner->id,
                    'contacts_souhaites' => rand(3, 8),
                    'contacts_restants' => rand(2, 6),
                    'statut' => Property::STATUT_EN_ATTENTE,
                    'created_at' => now()->subDays(rand(1, 60)),
                    'updated_at' => now()->subDays(rand(0, 5)),
                ]));
            }
        }

        $this->command->info('✅ France properties seeder completed successfully!');
        $this->command->info('📧 Property owner email: propertyowner@gmail.com');
        $this->command->info('🔐 Property owner password: ProprioSecure2024!');
        $this->command->info('🏠 Total properties created: ' . count($properties));
        $this->command->info('📍 Cities covered: Paris, Lyon, Marseille, Nice, Toulouse, Bordeaux, Nantes, Strasbourg, Montpellier, Lille, Avignon');
    }
}
