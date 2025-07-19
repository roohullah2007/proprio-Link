<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Property details
            $table->text('description')->nullable()->after('type_propriete');
            $table->integer('nombre_pieces')->nullable()->after('description');
            $table->integer('nombre_chambres')->nullable()->after('nombre_pieces');
            $table->integer('nombre_salles_bain')->nullable()->after('nombre_chambres');
            $table->integer('etage')->nullable()->after('nombre_salles_bain');
            $table->integer('annee_construction')->nullable()->after('etage');
            $table->enum('etat_propriete', ['NEUF', 'EXCELLENT', 'BON', 'A_RENOVER', 'A_RESTAURER'])->nullable()->after('annee_construction');
            $table->enum('type_chauffage', ['GAZ', 'ELECTRIQUE', 'FIOUL', 'POMPE_CHALEUR', 'BOIS', 'COLLECTIF', 'AUTRE'])->nullable()->after('etat_propriete');
            $table->enum('dpe_classe_energie', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NON_RENSEIGNE'])->default('NON_RENSEIGNE')->after('type_chauffage');
            $table->enum('dpe_classe_ges', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NON_RENSEIGNE'])->default('NON_RENSEIGNE')->after('dpe_classe_energie');
            
            // Amenities (stored as JSON)
            $table->json('amenities')->nullable()->after('dpe_classe_ges');
            
            // Additional details
            $table->boolean('meuble')->default(false)->after('amenities');
            $table->decimal('charges_mensuelles', 8, 2)->nullable()->after('meuble');
            $table->text('informations_complementaires')->nullable()->after('charges_mensuelles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
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
            ]);
        });
    }
};
