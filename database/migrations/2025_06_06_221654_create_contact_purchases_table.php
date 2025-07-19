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
        Schema::create('contact_purchases', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('agent_id')->constrained('users'); // Foreign key to users (agents)
            $table->uuid('property_id'); // Foreign key to properties
            $table->string('stripe_payment_intent_id')->unique(); // Stripe payment intent ID
            $table->decimal('montant_paye', 8, 2)->default(15.00); // Amount paid (default 15€)
            $table->string('devise', 3)->default('EUR'); // Currency
            $table->string('statut_paiement')->default('pending'); // pending, succeeded, failed, canceled
            $table->json('donnees_contact')->nullable(); // Encrypted contact data
            $table->timestamp('paiement_confirme_a')->nullable(); // When payment was confirmed
            $table->timestamps();
            
            // Foreign key constraint
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            
            // Index for performance
            $table->index(['agent_id', 'property_id']);
            $table->index('statut_paiement');
            
            // Unique constraint to prevent duplicate purchases
            $table->unique(['agent_id', 'property_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_purchases');
    }
};
