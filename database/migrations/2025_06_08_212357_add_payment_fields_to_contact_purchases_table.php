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
        Schema::table('contact_purchases', function (Blueprint $table) {
            $table->string('statut_paiement')->default('pending')->after('devise');
            $table->text('donnees_contact')->nullable()->after('statut_paiement');
            $table->timestamp('paiement_confirme_a')->nullable()->after('donnees_contact');
            
            // Add indexes for performance
            $table->index('statut_paiement');
            
            // Add unique constraint to prevent duplicate purchases
            $table->unique(['agent_id', 'property_id'], 'unique_agent_property_purchase');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_purchases', function (Blueprint $table) {
            $table->dropIndex(['statut_paiement']);
            $table->dropUnique('unique_agent_property_purchase');
            $table->dropColumn(['statut_paiement', 'donnees_contact', 'paiement_confirme_a']);
        });
    }
};
