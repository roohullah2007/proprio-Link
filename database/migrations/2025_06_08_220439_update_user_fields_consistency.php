<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add the new columns if they don't exist
        Schema::table('users', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('users', 'type')) {
                $table->string('type')->nullable()->after('telephone');
            }
            if (!Schema::hasColumn('users', 'verification_statut')) {
                $table->string('verification_statut')->nullable()->after('type');
            }
        });

        // Migrate data from old columns to new columns
        DB::statement("UPDATE users SET type = type_utilisateur WHERE type IS NULL AND type_utilisateur IS NOT NULL");
        
        // Set verification_statut based on user type and est_verifie
        DB::statement("UPDATE users SET verification_statut = CASE 
            WHEN type = 'AGENT' AND est_verifie = 1 THEN 'approuve'
            WHEN type = 'AGENT' AND est_verifie = 0 THEN 'en_attente'
            ELSE NULL
        END WHERE verification_statut IS NULL");

        // Make type column not nullable after data migration
        Schema::table('users', function (Blueprint $table) {
            $table->string('type')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Migrate data back to old columns if needed
        DB::statement("UPDATE users SET type_utilisateur = type WHERE type_utilisateur IS NULL");
        DB::statement("UPDATE users SET est_verifie = CASE 
            WHEN verification_statut = 'approuve' THEN 1
            ELSE 0
        END");
        
        // Drop new columns
        Schema::table('users', function (Blueprint $table) {
            if (Schema::hasColumn('users', 'type') && Schema::hasColumn('users', 'type_utilisateur')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('users', 'verification_statut')) {
                $table->dropColumn('verification_statut');
            }
        });
    }
};
