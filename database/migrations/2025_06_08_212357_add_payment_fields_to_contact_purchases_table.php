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
            if (!Schema::hasColumn('contact_purchases', 'statut_paiement')) {
                $table->string('statut_paiement')->default('pending')->after('devise');
            }
            if (!Schema::hasColumn('contact_purchases', 'donnees_contact')) {
                $table->text('donnees_contact')->nullable()->after('statut_paiement');
            }
            if (!Schema::hasColumn('contact_purchases', 'paiement_confirme_a')) {
                $table->timestamp('paiement_confirme_a')->nullable()->after('donnees_contact');
            }
        });

        // Add indexes safely (ignore if already exist)
        try {
            Schema::table('contact_purchases', function (Blueprint $table) {
                $table->index('statut_paiement');
            });
        } catch (\Exception $e) {
            // Index already exists
        }

        try {
            Schema::table('contact_purchases', function (Blueprint $table) {
                $table->unique(['agent_id', 'property_id'], 'unique_agent_property_purchase');
            });
        } catch (\Exception $e) {
            // Unique constraint already exists
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        try {
            Schema::table('contact_purchases', function (Blueprint $table) {
                $table->dropIndex(['statut_paiement']);
            });
        } catch (\Exception $e) {}

        try {
            Schema::table('contact_purchases', function (Blueprint $table) {
                $table->dropUnique('unique_agent_property_purchase');
            });
        } catch (\Exception $e) {}

        $columns = ['statut_paiement', 'donnees_contact', 'paiement_confirme_a'];
        foreach ($columns as $column) {
            if (Schema::hasColumn('contact_purchases', $column)) {
                Schema::table('contact_purchases', function (Blueprint $table) use ($column) {
                    $table->dropColumn($column);
                });
            }
        }
    }
};
