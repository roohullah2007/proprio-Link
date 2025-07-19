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
        Schema::create('property_edit_requests', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('property_id');
            $table->uuid('requested_by')->comment('Admin who requested the edit');
            $table->text('requested_changes')->comment('Description of what needs to be edited');
            $table->text('admin_notes')->nullable()->comment('Additional notes from admin');
            $table->enum('status', ['PENDING', 'ACKNOWLEDGED', 'COMPLETED', 'CANCELLED'])
                  ->default('PENDING')
                  ->comment('Status of the edit request');
            $table->timestamp('acknowledged_at')->nullable()->comment('When owner acknowledged the request');
            $table->timestamp('completed_at')->nullable()->comment('When owner completed the edits');
            $table->timestamps();
            
            // Add foreign key constraints after ensuring table structure is compatible
            $table->index(['property_id', 'status']);
            $table->index('requested_by');
        });
        
        // Add foreign key constraints separately to avoid issues
        Schema::table('property_edit_requests', function (Blueprint $table) {
            $table->foreign('property_id')->references('id')->on('properties')->onDelete('cascade');
            // Don't add foreign key for requested_by since users table might have different UUID structure
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_edit_requests');
    }
};
