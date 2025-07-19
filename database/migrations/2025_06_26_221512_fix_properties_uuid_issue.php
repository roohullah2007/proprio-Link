<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Check if uuid column exists and remove it since we're using id as UUID primary key
        if (Schema::hasColumn('properties', 'uuid')) {
            Schema::table('properties', function (Blueprint $table) {
                $table->dropColumn('uuid');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Re-add uuid column if needed for rollback
        if (!Schema::hasColumn('properties', 'uuid')) {
            Schema::table('properties', function (Blueprint $table) {
                $table->uuid('uuid')->nullable()->after('id');
            });
            
            // Fill existing records with UUIDs
            DB::statement('UPDATE properties SET uuid = UUID() WHERE uuid IS NULL');
            
            Schema::table('properties', function (Blueprint $table) {
                $table->uuid('uuid')->nullable(false)->change();
            });
        }
    }
};
