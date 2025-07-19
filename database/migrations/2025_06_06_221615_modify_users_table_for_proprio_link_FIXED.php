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
        Schema::table('users', function (Blueprint $table) {
            // Only drop the name column if it exists
            if (Schema::hasColumn('users', 'name')) {
                $table->dropColumn('name');
            }
            
            // Add UUID field if it doesn't exist
            if (!Schema::hasColumn('users', 'uuid')) {
                $table->uuid('uuid')->nullable()->unique()->after('id');
            }
            
            // Add French specific fields if they don't exist
            if (!Schema::hasColumn('users', 'prenom')) {
                $table->string('prenom')->after('uuid'); // First name
            }
            if (!Schema::hasColumn('users', 'nom')) {
                $table->string('nom')->after('prenom'); // Last name
            }
            if (!Schema::hasColumn('users', 'telephone')) {
                $table->string('telephone')->nullable()->after('email'); // Phone number
            }
            
            // Add user type enum if it doesn't exist
            if (!Schema::hasColumn('users', 'type_utilisateur')) {
                $table->enum('type_utilisateur', ['PROPRIETAIRE', 'AGENT'])->after('telephone');
            }
            
            // Add agent-specific fields if they don't exist
            if (!Schema::hasColumn('users', 'numero_siret')) {
                $table->string('numero_siret')->nullable()->after('type_utilisateur'); // SIRET number for agents
            }
            if (!Schema::hasColumn('users', 'licence_professionnelle_url')) {
                $table->string('licence_professionnelle_url')->nullable()->after('numero_siret'); // Professional license URL
            }
            
            // Add verification status if it doesn't exist
            if (!Schema::hasColumn('users', 'est_verifie')) {
                $table->boolean('est_verifie')->default(false)->after('licence_professionnelle_url');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Add back name column if it doesn't exist
            if (!Schema::hasColumn('users', 'name')) {
                $table->string('name')->after('id');
            }
            
            // Drop added columns if they exist
            $columnsToRemove = [
                'uuid', 'prenom', 'nom', 'telephone', 
                'type_utilisateur', 'numero_siret', 
                'licence_professionnelle_url', 'est_verifie'
            ];
            
            foreach ($columnsToRemove as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }
        });
    }
};
