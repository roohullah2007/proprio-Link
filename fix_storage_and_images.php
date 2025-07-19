<?php

/**
 * Fix for Propio-Link Image Display Issues
 * 
 * This script addresses:
 * 1. Missing storage symlink
 * 2. Image handling in property updates
 * 3. Translation issues
 * 
 * Run this with: php fix_storage_and_images.php
 */

echo "Propio-Link Image Display Fix\n";
echo "============================\n\n";

// 1. Create storage symlink
echo "1. Creating storage symlink...\n";

$publicPath = __DIR__ . '/public';
$storagePath = __DIR__ . '/storage/app/public';
$symlinkPath = $publicPath . '/storage';

// Remove existing symlink if it exists
if (is_link($symlinkPath)) {
    unlink($symlinkPath);
    echo "   - Removed existing symlink\n";
}

// Create the symlink
if (symlink($storagePath, $symlinkPath)) {
    echo "   ✓ Storage symlink created successfully\n";
} else {
    echo "   ✗ Failed to create storage symlink\n";
    echo "   Please run: php artisan storage:link\n";
}

echo "\n2. Checking storage directories...\n";

// Check if storage directories exist
$propertyImagesPath = $storagePath . '/properties';
if (!is_dir($propertyImagesPath)) {
    mkdir($propertyImagesPath, 0755, true);
    echo "   ✓ Created properties directory\n";
} else {
    echo "   ✓ Properties directory exists\n";
}

echo "\n3. Fix summary:\n";
echo "   - Storage symlink: " . (is_link($symlinkPath) ? "✓ Fixed" : "✗ Still missing") . "\n";
echo "   - Properties directory: " . (is_dir($propertyImagesPath) ? "✓ Ready" : "✗ Missing") . "\n";

echo "\nNext steps:\n";
echo "1. Update PropertyController to handle image uploads/removals in update method\n";
echo "2. Add missing translations\n";
echo "3. Test the edit functionality\n";

echo "\nScript completed!\n";
