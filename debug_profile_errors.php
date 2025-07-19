<?php

require_once 'vendor/autoload.php';

// Load Laravel application
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

echo "=== PROFILE UPDATE DEBUGGING ===\n\n";

try {
    // 1. Check database structure
    echo "1. CHECKING DATABASE STRUCTURE\n";
    echo "================================\n";
    
    $hasProfileImage = Schema::hasColumn('users', 'profile_image');
    echo "Profile image column exists: " . ($hasProfileImage ? "YES" : "NO") . "\n";
    
    if (!$hasProfileImage) {
        echo "FIXING: Adding profile_image column...\n";
        Schema::table('users', function ($table) {
            $table->string('profile_image')->nullable();
        });
        echo "Profile image column added!\n";
    }
    
    // 2. Check user table columns
    echo "\n2. USER TABLE COLUMNS\n";
    echo "=====================\n";
    $userColumns = Schema::getColumnListing('users');
    $requiredColumns = ['id', 'uuid', 'prenom', 'nom', 'email', 'telephone', 'profile_image'];
    
    foreach ($requiredColumns as $col) {
        $exists = in_array($col, $userColumns);
        echo sprintf("%-20s: %s\n", $col, $exists ? "✓" : "✗");
    }
    
    // 3. Check storage directories
    echo "\n3. STORAGE DIRECTORIES\n";
    echo "======================\n";
    
    $directories = [
        'storage/app/public' => 'Main storage',
        'storage/app/public/profile-images' => 'Profile images',
        'storage/app/public/licenses' => 'License files',
        'public/storage' => 'Storage link'
    ];
    
    foreach ($directories as $dir => $desc) {
        $exists = is_dir($dir) || is_link($dir);
        echo sprintf("%-30s: %s\n", $desc, $exists ? "✓" : "✗");
        
        if (!$exists && $dir !== 'public/storage') {
            mkdir($dir, 0755, true);
            echo "  Created: $dir\n";
        }
    }
    
    // Create storage link if missing
    if (!is_link('public/storage') && !is_dir('public/storage')) {
        echo "Creating storage link...\n";
        if (symlink('../storage/app/public', 'public/storage')) {
            echo "Storage link created!\n";
        } else {
            echo "Failed to create storage link\n";
        }
    }
    
    // 4. Check permissions
    echo "\n4. CHECKING PERMISSIONS\n";
    echo "=======================\n";
    
    $storageWritable = is_writable('storage/app/public');
    echo "Storage writable: " . ($storageWritable ? "YES" : "NO") . "\n";
    
    if (!$storageWritable) {
        echo "FIXING: Setting storage permissions...\n";
        chmod('storage/app/public', 0755);
        chmod('storage/app/public/profile-images', 0755);
    }
    
    // 5. Test database connection
    echo "\n5. DATABASE CONNECTION\n";
    echo "======================\n";
    
    $dbName = DB::connection()->getDatabaseName();
    echo "Connected to: $dbName\n";
    
    // Test user count
    $userCount = DB::table('users')->count();
    echo "Total users: $userCount\n";
    
    // 6. Check for recent errors in logs
    echo "\n6. RECENT LOG ERRORS\n";
    echo "====================\n";
    
    $logFile = 'storage/logs/laravel.log';
    if (file_exists($logFile)) {
        $logContent = file_get_contents($logFile);
        $recentErrors = [];
        
        // Look for recent profile-related errors
        if (preg_match_all('/\[.*?\] local\.ERROR: (.+Profile.+)/', $logContent, $matches)) {
            $recentErrors = array_slice($matches[1], -5); // Last 5 errors
        }
        
        if (!empty($recentErrors)) {
            echo "Recent profile-related errors:\n";
            foreach ($recentErrors as $error) {
                echo "- " . substr($error, 0, 100) . "...\n";
            }
        } else {
            echo "No recent profile-related errors found.\n";
        }
    } else {
        echo "No log file found.\n";
    }
    
    echo "\n=== DEBUGGING COMPLETE ===\n";
    echo "If you're still getting errors:\n";
    echo "1. Check the browser console for JavaScript errors\n";
    echo "2. Check the network tab for failed requests\n";
    echo "3. Look at storage/logs/laravel.log for detailed errors\n";
    echo "4. Try uploading a small image (< 1MB)\n";
    
} catch (Exception $e) {
    echo "ERROR: " . $e->getMessage() . "\n";
    echo "Stack trace: " . $e->getTraceAsString() . "\n";
}
