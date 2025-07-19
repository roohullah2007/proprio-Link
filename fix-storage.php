<?php
/**
 * Manual Storage Symlink Fix Script
 * Run this file directly if web routes don't work
 */

// Get the application paths
$publicPath = __DIR__ . '/public/storage';
$targetPath = __DIR__ . '/storage/app/public';

echo "=== Storage Symlink Fix Script ===\n";
echo "Public path: $publicPath\n";
echo "Target path: $targetPath\n\n";

// Check if symlink already exists
if (is_link($publicPath)) {
    $currentTarget = readlink($publicPath);
    echo "✓ Symlink already exists!\n";
    echo "Current target: $currentTarget\n";
    
    if (realpath($currentTarget) === realpath($targetPath)) {
        echo "✓ Symlink is correct!\n";
    } else {
        echo "⚠ Symlink points to wrong location!\n";
        echo "Removing old symlink...\n";
        unlink($publicPath);
        echo "Creating new symlink...\n";
        symlink($targetPath, $publicPath);
        echo "✓ Fixed symlink!\n";
    }
} else if (file_exists($publicPath)) {
    echo "⚠ A file/directory exists at $publicPath but it's not a symlink!\n";
    echo "Please remove it manually and run this script again.\n";
} else {
    echo "Creating symlink...\n";
    if (symlink($targetPath, $publicPath)) {
        echo "✓ Symlink created successfully!\n";
    } else {
        echo "✗ Failed to create symlink!\n";
        echo "You may need to run this as administrator or use:\n";
        echo "php artisan storage:link\n";
    }
}

// Test symlink
echo "\n=== Testing symlink ===\n";
if (is_link($publicPath) && file_exists($targetPath)) {
    echo "✓ Symlink test passed!\n";
    
    // List some files in storage
    $files = glob($targetPath . '/properties/*/');
    echo "Found " . count($files) . " property folders in storage\n";
    
    foreach (array_slice($files, 0, 3) as $folder) {
        $images = glob($folder . '*.{png,jpg,jpeg,webp}', GLOB_BRACE);
        echo "- " . basename($folder) . ": " . count($images) . " images\n";
    }
} else {
    echo "✗ Symlink test failed!\n";
}

echo "\n=== Next Steps ===\n";
echo "1. Visit your website and check if images load\n";
echo "2. If still not working, visit: http://your-site.com/storage-admin\n";
echo "3. Or try: php artisan storage:link\n";
