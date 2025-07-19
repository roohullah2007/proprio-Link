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
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('proprietaire_id')->constrained('users'); // Foreign key to users
            $table->text('adresse_complete'); // Complete address
            $table->string('pays'); // Country
            $table->string('ville'); // City
            $table->decimal('prix', 12, 2); // Price with 2 decimal places
            $table->integer('superficie_m2'); // Surface area in m²
            $table->enum('type_propriete', [
                'APPARTEMENT',
                'MAISON',
                'TERRAIN',
                'COMMERCIAL',
                'BUREAU',
                'AUTRES'
            ]); // Property type
            $table->integer('contacts_souhaites')->default(5); // Desired number of contacts
            $table->integer('contacts_restants')->default(5); // Remaining contacts
            $table->enum('statut', [
                'EN_ATTENTE',
                'PUBLIE', 
                'REJETE',
                'VENDU'
            ])->default('EN_ATTENTE'); // Property status
            $table->text('raison_rejet')->nullable(); // Rejection reason if applicable
            $table->timestamps();
            
            // Add indexes for performance
            $table->index(['statut', 'contacts_restants']);
            $table->index(['pays', 'ville']);
            $table->index(['type_propriete', 'prix']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
