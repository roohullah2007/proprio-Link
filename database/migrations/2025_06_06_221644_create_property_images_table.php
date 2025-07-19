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
        Schema::create('property_images', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('property_id'); // Foreign key to properties
            $table->string('nom_fichier'); // Original filename
            $table->string('chemin_fichier'); // File path
            $table->integer('ordre_affichage')->default(0); // Display order
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            
            // Index for performance
            $table->index(['property_id', 'ordre_affichage']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_images');
    }
};
