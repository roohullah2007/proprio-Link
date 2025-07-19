<?php

require_once 'vendor/autoload.php';

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo "=== QUICK PROFILE IMAGE COLUMN FIX ===\n\n";

try {
    // Check current state
    $hasProfileImage = Schema::hasColumn('users', 'profile_image');
    echo "Profile image column exists: " . ($hasProfileImage ? "YES" : "NO") . "\n";
    
    if (!$hasProfileImage) {
        echo "Adding profile_image column...\n";
        
        // Try to add the column
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_image')->nullable();
        });
        
        // Verify it was added
        $hasProfileImage = Schema::hasColumn('users', 'profile_image');
        echo "Profile image column added: " . ($hasProfileImage ? "SUCCESS" : "FAILED") . "\n";
    }
    
    // Show current table structure
    echo "\n=== CURRENT USERS TABLE STRUCTURE ===\n";
    $columns = Schema::getColumnListing('users');
    foreach ($columns as $index => $column) {
        echo ($index + 1) . ". " . $column . "\n";
    }
    
    // Test database connection
    echo "\n=== DATABASE INFO ===\n";
    $dbName = DB::connection()->getDatabaseName();
    echo "Database: " . $dbName . "\n";
    
    // Check if we can create the storage directories
    echo "\n=== STORAGE SETUP ===\n";
    $storageDir = 'storage/app/public/profile-images';
    if (!is_dir($storageDir)) {
        if (mkdir($storageDir, 0755, true)) {
            echo "Created directory: " . $storageDir . "\n";
        } else {
            echo "Failed to create directory: " . $storageDir . "\n";
        }
    } else {
        echo "Directory exists: " . $storageDir . "\n";
    }
    
    // Check storage link
    $linkExists = is_link('public/storage') || is_dir('public/storage');
    echo "Storage link exists: " . ($linkExists ? "YES" : "NO") . "\n";
    
    if (!$linkExists) {
        echo "Creating storage link...\n";
        if (symlink('../storage/app/public', 'public/storage')) {
            echo "Storage link created successfully\n";
        } else {
            echo "Failed to create storage link\n";
        }
    }
    
    echo "\n=== FIX COMPLETED ===\n";
    echo "You should now be able to upload profile images!\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Full error: " . $e->getTraceAsString() . "\n";
}
