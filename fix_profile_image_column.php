<?php

require_once 'vendor/autoload.php';

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo "=== Profile Image Column Fix ===\n\n";

try {
    // Check if the column exists
    $hasColumn = Schema::hasColumn('users', 'profile_image');
    
    if ($hasColumn) {
        echo "✅ The 'profile_image' column already exists in the users table.\n";
    } else {
        echo "❌ The 'profile_image' column does NOT exist in the users table.\n";
        echo "🔧 Adding the column now...\n";
        
        // Add the column
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_image')->nullable()->after('licence_professionnelle_url');
        });
        
        // Verify it was added
        $hasColumn = Schema::hasColumn('users', 'profile_image');
        if ($hasColumn) {
            echo "✅ Successfully added 'profile_image' column to users table!\n";
        } else {
            echo "❌ Failed to add the column. Please check database permissions.\n";
        }
    }
    
    // Show current table structure
    echo "\n=== Current Users Table Columns ===\n";
    $columns = Schema::getColumnListing('users');
    foreach ($columns as $index => $column) {
        echo ($index + 1) . ". " . $column . "\n";
    }
    
    // Test database connection
    echo "\n=== Database Connection Test ===\n";
    $dbName = DB::connection()->getDatabaseName();
    echo "✅ Connected to database: " . $dbName . "\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Please check your database connection and permissions.\n";
}

echo "\n=== Fix Complete ===\n";
