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
            // Check and add columns only if they don't exist
            
            // Property description
            if (!Schema::hasColumn('properties', 'description')) {
                $table->text('description')->nullable()->after('type_propriete');
            }
            
            // Room details
            if (!Schema::hasColumn('properties', 'nombre_pieces')) {
                $table->integer('nombre_pieces')->nullable()->after('description');
            }
            
            if (!Schema::hasColumn('properties', 'nombre_chambres')) {
                $table->integer('nombre_chambres')->nullable()->after('nombre_pieces');
            }
            
            if (!Schema::hasColumn('properties', 'nombre_salles_bain')) {
                $table->integer('nombre_salles_bain')->nullable()->after('nombre_chambres');
            }
            
            if (!Schema::hasColumn('properties', 'etage')) {
                $table->integer('etage')->nullable()->after('nombre_salles_bain');
            }
            
            if (!Schema::hasColumn('properties', 'annee_construction')) {
                $table->integer('annee_construction')->nullable()->after('etage');
            }
            
            // Property condition and features
            if (!Schema::hasColumn('properties', 'etat_propriete')) {
                $table->enum('etat_propriete', [
                    'NEUF',
                    'EXCELLENT', 
                    'BON',
                    'A_RENOVER',
                    'A_RESTAURER'
                ])->nullable()->after('annee_construction');
            }
            
            if (!Schema::hasColumn('properties', 'type_chauffage')) {
                $table->enum('type_chauffage', [
                    'GAZ',
                    'ELECTRIQUE',
                    'FIOUL', 
                    'POMPE_CHALEUR',
                    'BOIS',
                    'COLLECTIF',
                    'AUTRE'
                ])->nullable()->after('etat_propriete');
            }
            
            // Energy performance
            if (!Schema::hasColumn('properties', 'dpe_classe_energie')) {
                $table->enum('dpe_classe_energie', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NON_RENSEIGNE'])
                    ->default('NON_RENSEIGNE')->after('type_chauffage');
            }
            
            if (!Schema::hasColumn('properties', 'dpe_classe_ges')) {
                $table->enum('dpe_classe_ges', ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'NON_RENSEIGNE'])
                    ->default('NON_RENSEIGNE')->after('dpe_classe_energie');
            }
            
            // Amenities and additional info
            if (!Schema::hasColumn('properties', 'amenities')) {
                $table->json('amenities')->nullable()->after('dpe_classe_ges');
            }
            
            if (!Schema::hasColumn('properties', 'meuble')) {
                $table->boolean('meuble')->default(false)->after('amenities');
            }
            
            if (!Schema::hasColumn('properties', 'charges_mensuelles')) {
                $table->decimal('charges_mensuelles', 8, 2)->nullable()->after('meuble');
            }
            
            if (!Schema::hasColumn('properties', 'informations_complementaires')) {
                $table->text('informations_complementaires')->nullable()->after('charges_mensuelles');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            // Only drop columns that exist
            $columnsToDrop = [];
            
            if (Schema::hasColumn('properties', 'description')) {
                $columnsToDrop[] = 'description';
            }
            if (Schema::hasColumn('properties', 'nombre_pieces')) {
                $columnsToDrop[] = 'nombre_pieces';
            }
            if (Schema::hasColumn('properties', 'nombre_chambres')) {
                $columnsToDrop[] = 'nombre_chambres';
            }
            if (Schema::hasColumn('properties', 'nombre_salles_bain')) {
                $columnsToDrop[] = 'nombre_salles_bain';
            }
            if (Schema::hasColumn('properties', 'etage')) {
                $columnsToDrop[] = 'etage';
            }
            if (Schema::hasColumn('properties', 'annee_construction')) {
                $columnsToDrop[] = 'annee_construction';
            }
            if (Schema::hasColumn('properties', 'etat_propriete')) {
                $columnsToDrop[] = 'etat_propriete';
            }
            if (Schema::hasColumn('properties', 'type_chauffage')) {
                $columnsToDrop[] = 'type_chauffage';
            }
            if (Schema::hasColumn('properties', 'dpe_classe_energie')) {
                $columnsToDrop[] = 'dpe_classe_energie';
            }
            if (Schema::hasColumn('properties', 'dpe_classe_ges')) {
                $columnsToDrop[] = 'dpe_classe_ges';
            }
            if (Schema::hasColumn('properties', 'amenities')) {
                $columnsToDrop[] = 'amenities';
            }
            if (Schema::hasColumn('properties', 'meuble')) {
                $columnsToDrop[] = 'meuble';
            }
            if (Schema::hasColumn('properties', 'charges_mensuelles')) {
                $columnsToDrop[] = 'charges_mensuelles';
            }
            if (Schema::hasColumn('properties', 'informations_complementaires')) {
                $columnsToDrop[] = 'informations_complementaires';
            }
            
            if (!empty($columnsToDrop)) {
                $table->dropColumn($columnsToDrop);
            }
        });
    }
};
