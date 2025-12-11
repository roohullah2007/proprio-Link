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
        Schema::create('pricing_tiers', function (Blueprint $table) {
            $table->id();
            $table->string('tier_name');
            $table->string('tier_key', 50)->unique();
            $table->decimal('min_property_value', 12, 2)->default(0);
            $table->decimal('max_property_value', 12, 2)->nullable(); // null means no upper limit
            $table->decimal('price_adjustment', 8, 2)->default(0.00);
            $table->boolean('is_flat_rate')->default(false);
            $table->decimal('flat_rate_price', 8, 2)->nullable();
            $table->integer('display_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Index for efficient tier lookup
            $table->index(['is_active', 'min_property_value', 'max_property_value'], 'tier_lookup_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_tiers');
    }
};
