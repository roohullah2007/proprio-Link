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
            $table->decimal('montant_ht', 8, 2)->nullable()->after('montant_paye');
            $table->decimal('taux_tva', 5, 2)->default(20.00)->after('montant_ht');
            $table->decimal('montant_tva', 8, 2)->nullable()->after('taux_tva');
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->decimal('amount_ht', 8, 2)->nullable()->after('amount');
            $table->decimal('tax_rate', 5, 2)->default(20.00)->after('amount_ht');
            $table->decimal('tax_amount', 8, 2)->nullable()->after('tax_rate');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contact_purchases', function (Blueprint $table) {
            $table->dropColumn(['montant_ht', 'taux_tva', 'montant_tva']);
        });

        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn(['amount_ht', 'tax_rate', 'tax_amount']);
        });
    }
};
