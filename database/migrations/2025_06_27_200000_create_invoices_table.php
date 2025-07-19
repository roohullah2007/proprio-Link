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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->uuid('contact_purchase_id');
            $table->string('agent_name');
            $table->string('agent_email');
            $table->string('property_reference');
            $table->decimal('amount', 8, 2);
            $table->string('currency', 3);
            $table->json('billing_details');
            $table->string('pdf_path')->nullable();
            $table->timestamp('issued_at');
            $table->timestamps();

            $table->foreign('contact_purchase_id')->references('id')->on('contact_purchases');
            $table->index('invoice_number');
            $table->index('issued_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
