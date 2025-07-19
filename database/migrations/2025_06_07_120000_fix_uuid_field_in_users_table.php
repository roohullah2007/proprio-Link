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
            // Make uuid field nullable and add default value generation
            $table->uuid('uuid')->nullable()->default(null)->change();
        });
        
        // Update existing records that don't have UUIDs
        DB::statement('UPDATE users SET uuid = UUID() WHERE uuid IS NULL');
        
        // Now make the field required again
        Schema::table('users', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert back to original state
            $table->uuid('uuid')->nullable(false)->change();
        });
    }
};
