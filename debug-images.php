<?php
/**
 * Image Diagnostic & Debug Script
 * Place this in your Laravel root directory and run via browser
 * URL: http://127.0.0.1:8000/debug-images.php
 */

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

// Basic diagnostic information
echo "<h1>Property Images Diagnostic</h1>";
echo "<style>
body { font-family: Arial, sans-serif; margin: 20px; }
.success { color: green; }
.error { color: red; }
.warning { color: orange; }
.info { color: blue; }
.code { background: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 3px solid #ccc; }
table { border-collapse: collapse; width: 100%; margin: 20px 0; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }
</style>";

echo "<h2>1. File System Check</h2>";

// Check storage directories
$storagePath = storage_path('app/public');
$publicStoragePath = public_path('storage');
$propertiesPath = storage_path('app/public/properties');

echo "<table>";
echo "<tr><th>Path</th><th>Status</th><th>Type</th></tr>";

// Storage app/public
echo "<tr><td>storage/app/public</td>";
if (is_dir($storagePath)) {
    echo "<td class='success'>✓ Exists</td><td>Directory</td>";
} else {
    echo "<td class='error'>✗ Missing</td><td>-</td>";
}
echo "</tr>";

// Public storage symlink
echo "<tr><td>public/storage</td>";
if (is_link($publicStoragePath)) {
    $target = readlink($publicStoragePath);
    echo "<td class='success'>✓ Symlink</td><td>Points to: " . htmlspecialchars($target) . "</td>";
} elseif (is_dir($publicStoragePath)) {
    echo "<td class='warning'>⚠ Directory (should be symlink)</td><td>Directory</td>";
} elseif (file_exists($publicStoragePath)) {
    echo "<td class='error'>✗ File (should be symlink)</td><td>File</td>";
} else {
    echo "<td class='error'>✗ Missing</td><td>-</td>";
}
echo "</tr>";

// Properties directory
echo "<tr><td>storage/app/public/properties</td>";
if (is_dir($propertiesPath)) {
    $count = count(glob($propertiesPath . '/*', GLOB_ONLYDIR));
    echo "<td class='success'>✓ Exists</td><td>$count property folders</td>";
} else {
    echo "<td class='error'>✗ Missing</td><td>-</td>";
}
echo "</tr>";

echo "</table>";

echo "<h2>2. Laravel Configuration</h2>";

// Get Laravel configuration
$app_url = config('app.url', 'Not set');
$filesystem_default = config('filesystems.default', 'Not set');
$public_disk = config('filesystems.disks.public', 'Not configured');

echo "<table>";
echo "<tr><th>Setting</th><th>Value</th></tr>";
echo "<tr><td>APP_URL</td><td>" . htmlspecialchars($app_url) . "</td></tr>";
echo "<tr><td>Default Filesystem</td><td>" . htmlspecialchars($filesystem_default) . "</td></tr>";
echo "<tr><td>Public Disk Root</td><td>" . htmlspecialchars($public_disk['root'] ?? 'Not set') . "</td></tr>";
echo "<tr><td>Public Disk URL</td><td>" . htmlspecialchars($public_disk['url'] ?? 'Not set') . "</td></tr>";
echo "</table>";

echo "<h2>3. Database Check</h2>";

try {
    // Connect to database and check property images
    $properties = DB::table('properties')
        ->select('id', 'ville', 'statut')
        ->limit(5)
        ->get();
    
    echo "<p class='success'>✓ Database connection successful</p>";
    echo "<p>Found " . $properties->count() . " properties (showing first 5)</p>";
    
    if ($properties->count() > 0) {
        echo "<table>";
        echo "<tr><th>Property ID</th><th>City</th><th>Status</th><th>Images</th><th>Sample Image Path</th></tr>";
        
        foreach ($properties as $property) {
            $images = DB::table('property_images')
                ->where('property_id', $property->id)
                ->get();
            
            echo "<tr>";
            echo "<td>" . htmlspecialchars(substr($property->id, 0, 8)) . "...</td>";
            echo "<td>" . htmlspecialchars($property->ville) . "</td>";
            echo "<td>" . htmlspecialchars($property->statut) . "</td>";
            echo "<td>" . $images->count() . " images</td>";
            
            if ($images->count() > 0) {
                $firstImage = $images->first();
                $imagePath = $firstImage->chemin_fichier;
                echo "<td>" . htmlspecialchars($imagePath) . "</td>";
            } else {
                echo "<td>No images</td>";
            }
            echo "</tr>";
        }
        echo "</table>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>✗ Database error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<h2>4. Image Access Test</h2>";

try {
    // Test actual image files
    $testProperty = DB::table('properties')
        ->where('id', '0197dc10-27b0-72f0-85ae-ba90e412ccbe')
        ->first();
    
    if ($testProperty) {
        $testImages = DB::table('property_images')
            ->where('property_id', $testProperty->id)
            ->get();
        
        echo "<p>Testing property: " . htmlspecialchars($testProperty->ville) . "</p>";
        
        if ($testImages->count() > 0) {
            echo "<table>";
            echo "<tr><th>Image</th><th>Storage File</th><th>Public Access</th><th>Preview</th></tr>";
            
            foreach ($testImages as $image) {
                $storagePath = storage_path('app/public/' . $image->chemin_fichier);
                $publicPath = public_path('storage/' . $image->chemin_fichier);
                $urlPath = '/storage/' . $image->chemin_fichier;
                
                echo "<tr>";
                echo "<td>" . htmlspecialchars($image->nom_fichier) . "</td>";
                
                // Check if file exists in storage
                if (file_exists($storagePath)) {
                    echo "<td class='success'>✓ File exists (" . number_format(filesize($storagePath) / 1024, 1) . " KB)</td>";
                } else {
                    echo "<td class='error'>✗ File missing</td>";
                }
                
                // Check if file accessible via public symlink
                if (file_exists($publicPath)) {
                    echo "<td class='success'>✓ Public access OK</td>";
                } else {
                    echo "<td class='error'>✗ Public access failed</td>";
                }
                
                // Show preview if accessible
                if (file_exists($publicPath)) {
                    echo "<td><img src='" . htmlspecialchars($urlPath) . "' style='max-width: 100px; max-height: 60px;' onerror='this.style.display=\"none\"; this.nextSibling.style.display=\"inline\";'><span style='display:none; color:red;'>Load failed</span></td>";
                } else {
                    echo "<td>No preview</td>";
                }
                echo "</tr>";
            }
            echo "</table>";
        } else {
            echo "<p class='warning'>No images found for test property</p>";
        }
    } else {
        echo "<p class='warning'>Test property not found</p>";
    }
    
} catch (Exception $e) {
    echo "<p class='error'>✗ Image test error: " . htmlspecialchars($e->getMessage()) . "</p>";
}

echo "<h2>5. Solutions</h2>";

echo "<div class='code'>";
echo "<h3>If images still don't show, try these solutions:</h3>";
echo "<p><strong>1. Recreate storage symlink:</strong></p>";
echo "<code>php artisan storage:link</code>";
echo "<p><strong>2. Manual symlink (Windows):</strong></p>";
echo "<code>mklink /D \"public\\storage\" \"storage\\app\\public\"</code>";
echo "<p><strong>3. Manual symlink (Linux/Mac):</strong></p>";
echo "<code>ln -s ../storage/app/public public/storage</code>";
echo "<p><strong>4. Alternative route fix (add to web.php):</strong></p>";
echo "<code>Route::get('/storage/{path}', function (\$path) {<br>";
echo "&nbsp;&nbsp;&nbsp;&nbsp;return response()->file(storage_path('app/public/' . \$path));<br>";
echo "})->where('path', '.*');</code>";
echo "</div>";

echo "<h2>6. Admin URLs</h2>";
echo "<p>Test these URLs after fixing:</p>";
echo "<ul>";
echo "<li><a href='/admin/properties/pending'>Pending Properties</a></li>";
echo "<li><a href='/admin/properties/0197dc10-27b0-72f0-85ae-ba90e412ccbe/review'>Sample Property Review</a></li>";
echo "<li><a href='/storage/properties/0197dc10-27b0-72f0-85ae-ba90e412ccbe/5fcc5b4d-0d1e-48f2-b656-54732245ef99.png'>Direct Image Test</a></li>";
echo "</ul>";

echo "<hr>";
echo "<p><small>Generated at: " . date('Y-m-d H:i:s') . "</small></p>";
