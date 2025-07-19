<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class FixPropertiesUuidColumn extends Migration
{
    public function up()
    {
        // Check if uuid column exists
        if (Schema::hasColumn('properties', 'uuid')) {
            // Drop the existing unique constraint if it exists
            try {
                Schema::table('properties', function (Blueprint $table) {
                    $table->dropUnique('properties_uuid_unique');
                });
            } catch (Exception $e) {
                // Constraint might not exist, continue
            }
            
            // Drop the existing column
            Schema::table('properties', function (Blueprint $table) {
                $table->dropColumn('uuid');
            });
        }
        
        // Add the uuid column without unique constraint first
        Schema::table('properties', function (Blueprint $table) {
            $table->uuid('uuid')->nullable()->after('id');
        });
        
        // Generate UUIDs for all existing properties
        $properties = DB::table('properties')->get();
        foreach ($properties as $property) {
            DB::table('properties')
                ->where('id', $property->id)
                ->update(['uuid' => (string) \Illuminate\Support\Str::uuid()]);
        }
        
        // Now add the unique constraint
        Schema::table('properties', function (Blueprint $table) {
            $table->unique('uuid');
        });
        
        // Make the column non-nullable
        Schema::table('properties', function (Blueprint $table) {
            $table->uuid('uuid')->nullable(false)->change();
        });
    }

    public function down()
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('uuid');
        });
    }
}