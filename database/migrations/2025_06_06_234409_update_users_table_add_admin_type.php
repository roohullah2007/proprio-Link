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
            // Update the enum to include ADMIN type
            $table->dropColumn('type_utilisateur');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->enum('type_utilisateur', ['PROPRIETAIRE', 'AGENT', 'ADMIN'])->after('telephone');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('type_utilisateur');
        });
        
        Schema::table('users', function (Blueprint $table) {
            $table->enum('type_utilisateur', ['PROPRIETAIRE', 'AGENT'])->after('telephone');
        });
    }
};
