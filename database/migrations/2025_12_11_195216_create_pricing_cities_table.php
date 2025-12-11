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
        Schema::create('pricing_cities', function (Blueprint $table) {
            $table->id();
            $table->string('city_name');
            $table->string('city_name_normalized')->index();
            $table->string('country')->default('France');
            $table->decimal('base_price', 8, 2)->default(25.00);
            $table->boolean('is_major_city')->default(true);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Unique constraint on normalized city name and country
            $table->unique(['city_name_normalized', 'country'], 'unique_city_country');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pricing_cities');
    }
};
