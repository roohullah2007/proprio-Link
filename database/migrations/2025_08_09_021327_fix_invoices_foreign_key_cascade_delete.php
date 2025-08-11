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
        Schema::table('invoices', function (Blueprint $table) {
            // Drop the existing foreign key constraint
            $table->dropForeign(['contact_purchase_id']);
            
            // Add the foreign key constraint with cascade delete
            $table->foreign('contact_purchase_id')
                  ->references('id')
                  ->on('contact_purchases')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            // Drop the cascade foreign key constraint
            $table->dropForeign(['contact_purchase_id']);
            
            // Add back the original foreign key constraint without cascade
            $table->foreign('contact_purchase_id')
                  ->references('id')
                  ->on('contact_purchases');
        });
    }
};
