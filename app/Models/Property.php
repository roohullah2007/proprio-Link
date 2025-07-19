<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory, HasUuids;

    /**
     * The "type" of the primary key ID.
     */
    protected $keyType = 'string';

    /**
     * Indicates if the IDs are auto-incrementing.
     */
    public $incrementing = false;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'proprietaire_id',
        'adresse_complete',
        'pays',
        'ville',
        'prix',
        'superficie_m2',
        'type_propriete',
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
        'informations_complementaires',
        'contacts_souhaites',
        'contacts_restants',
        'statut',
        'raison_rejet',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'prix' => 'decimal:2',
            'charges_mensuelles' => 'decimal:2',
            'superficie_m2' => 'integer',
            'nombre_pieces' => 'integer',
            'nombre_chambres' => 'integer',
            'nombre_salles_bain' => 'integer',
            'etage' => 'integer',
            'annee_construction' => 'integer',
            'contacts_souhaites' => 'integer',
            'contacts_restants' => 'integer',
            'amenities' => 'array',
            'meuble' => 'boolean',
        ];
    }

    /**
     * Property type constants
     */
    const TYPE_APPARTEMENT = 'APPARTEMENT';
    const TYPE_MAISON = 'MAISON';
    const TYPE_TERRAIN = 'TERRAIN';
    const TYPE_COMMERCIAL = 'COMMERCIAL';
    const TYPE_BUREAU = 'BUREAU';
    const TYPE_AUTRES = 'AUTRES';

    /**
     * Property status constants
     */
    const STATUT_EN_ATTENTE = 'EN_ATTENTE';
    const STATUT_PUBLIE = 'PUBLIE';
    const STATUT_REJETE = 'REJETE';
    const STATUT_VENDU = 'VENDU';

    /**
     * Property condition constants
     */
    const ETAT_NEUF = 'NEUF';
    const ETAT_EXCELLENT = 'EXCELLENT';
    const ETAT_BON = 'BON';
    const ETAT_A_RENOVER = 'A_RENOVER';
    const ETAT_A_RESTAURER = 'A_RESTAURER';

    /**
     * Heating type constants
     */
    const CHAUFFAGE_GAZ = 'GAZ';
    const CHAUFFAGE_ELECTRIQUE = 'ELECTRIQUE';
    const CHAUFFAGE_FIOUL = 'FIOUL';
    const CHAUFFAGE_POMPE_CHALEUR = 'POMPE_CHALEUR';
    const CHAUFFAGE_BOIS = 'BOIS';
    const CHAUFFAGE_COLLECTIF = 'COLLECTIF';
    const CHAUFFAGE_AUTRE = 'AUTRE';

    /**
     * DPE class constants
     */
    const DPE_A = 'A';
    const DPE_B = 'B';
    const DPE_C = 'C';
    const DPE_D = 'D';
    const DPE_E = 'E';
    const DPE_F = 'F';
    const DPE_G = 'G';
    const DPE_NON_RENSEIGNE = 'NON_RENSEIGNE';

    /**
     * Available amenities organized by category
     */
    public static function getAvailableAmenities(): array
    {
        return [
            // Extérieur et parking
            'exterior_parking' => [
                'parking' => 'Parking',
                'garage' => 'Garage',
                'jardin' => 'Jardin',
                'terrasse' => 'Terrasse',
                'balcon' => 'Balcon',
                'piscine' => 'Piscine',
                'cave' => 'Cave',
                'grenier' => 'Grenier/Combles',
                'cour' => 'Cour',
                'loggia' => 'Loggia',
                'veranda' => 'Véranda',
                'depot' => 'Dépôt/Remise',
            ],
            
            // Sécurité et confort
            'security_comfort' => [
                'ascenseur' => 'Ascenseur',
                'digicode' => 'Digicode',
                'interphone' => 'Interphone',
                'videophone' => 'Videophone',
                'gardien' => 'Gardien/Concierge',
                'alarme' => 'Système d\'alarme',
                'climatisation' => 'Climatisation',
                'cheminee' => 'Cheminée',
                'spa' => 'Spa/Jacuzzi',
                'sauna' => 'Sauna',
            ],
            
            // Équipements
            'equipment' => [
                'cuisine_equipee' => 'Cuisine équipée',
                'cuisine_amenagee' => 'Cuisine aménagée',
                'dressing' => 'Dressing',
                'placards' => 'Placards intégrés',
                'double_vitrage' => 'Double vitrage',
                'volets_electriques' => 'Volets électriques',
                'lave_vaisselle' => 'Lave-vaisselle',
                'lave_linge' => 'Lave-linge',
                'seche_linge' => 'Sèche-linge',
                'four' => 'Four',
                'micro_ondes' => 'Micro-ondes',
                'refrigerateur' => 'Réfrigérateur',
            ],
            
            // Accessibilité et services
            'accessibility_services' => [
                'acces_handicape' => 'Accès handicapé',
                'fibre_optique' => 'Fibre optique',
                'proche_transports' => 'Proche transports',
                'proche_commerces' => 'Proche commerces',
                'proche_ecoles' => 'Proche écoles',
                'proche_hopitaux' => 'Proche hôpitaux',
                'vue_mer' => 'Vue mer',
                'vue_montagne' => 'Vue montagne',
                'vue_degagee' => 'Vue dégagée',
                'calme' => 'Environnement calme',
            ],
        ];
    }

    /**
     * Get flat list of all amenities
     */
    public static function getFlatAmenitiesList(): array
    {
        $flatList = [];
        foreach (self::getAvailableAmenities() as $category => $amenities) {
            $flatList = array_merge($flatList, $amenities);
        }
        return $flatList;
    }

    /**
     * Relationship with property owner
     */
    public function proprietaire()
    {
        return $this->belongsTo(User::class, 'proprietaire_id');
    }

    /**
     * Relationship with property images
     */
    public function images()
    {
        return $this->hasMany(PropertyImage::class)->orderBy('ordre_affichage');
    }

    /**
     * Relationship with contact purchases
     */
    public function contactPurchases()
    {
        return $this->hasMany(ContactPurchase::class);
    }

    /**
     * Relationship with property edit requests
     */
    public function editRequests()
    {
        return $this->hasMany(PropertyEditRequest::class);
    }

    /**
     * Get pending edit requests
     */
    public function pendingEditRequests()
    {
        return $this->editRequests()
            ->where('status', PropertyEditRequest::STATUS_PENDING)
            ->with('requestedBy');
    }

    /**
     * Check if property is published
     */
    public function isPublie(): bool
    {
        return $this->statut === self::STATUT_PUBLIE;
    }

    /**
     * Check if property has remaining contacts
     */
    public function hasContactsRestants(): bool
    {
        return $this->contacts_restants > 0;
    }

    /**
     * Decrement remaining contacts
     */
    public function decrementContacts(): void
    {
        if ($this->contacts_restants > 0) {
            $this->decrement('contacts_restants');
        }
    }
}
