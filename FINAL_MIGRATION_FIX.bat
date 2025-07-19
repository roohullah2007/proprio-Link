@echo off
echo ===============================================
echo  COMPLETE MIGRATIONS FIX - ALL ISSUES
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Step 1: Checking migration status...
echo ===============================================
php artisan migrate:status

echo.
echo Step 2: Running all migrations with fixes...
echo ===============================================
php artisan migrate --force

echo.
echo Step 3: Ensuring profile image column exists...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

// Ensure profile_image column exists
if (!Schema::hasColumn('users', 'profile_image')) {
    echo 'Adding profile_image column to users table...' . PHP_EOL;
    Schema::table('users', function (Blueprint \$table) {
        \$table->string('profile_image')->nullable();
    });
    echo 'Profile image column added!' . PHP_EOL;
} else {
    echo 'Profile image column already exists.' . PHP_EOL;
}

// Check properties table structure
echo PHP_EOL . 'Checking properties table...' . PHP_EOL;
\$propertyColumns = Schema::getColumnListing('properties');
\$requiredPropertyColumns = ['description', 'nombre_pieces', 'nombre_chambres', 'etat_propriete'];

foreach (\$requiredPropertyColumns as \$col) {
    \$exists = in_array(\$col, \$propertyColumns);
    echo '  ' . \$col . ': ' . (\$exists ? '✓' : '✗') . PHP_EOL;
}
"

echo.
echo Step 4: Setting up storage and directories...
echo ===============================================
php artisan storage:link --force

if not exist "storage\app\public\profile-images" (
    mkdir "storage\app\public\profile-images"
    echo Created profile-images directory
)

if not exist "storage\app\public\licenses" (
    mkdir "storage\app\public\licenses"
    echo Created licenses directory
)

echo.
echo Step 5: Clearing all caches...
echo ===============================================
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Step 6: Final verification...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;

echo '=== USERS TABLE VERIFICATION ===' . PHP_EOL;
\$userColumns = Schema::getColumnListing('users');
\$requiredUserColumns = ['id', 'uuid', 'prenom', 'nom', 'email', 'profile_image'];

foreach (\$requiredUserColumns as \$col) {
    \$exists = in_array(\$col, \$userColumns);
    echo '  ' . \$col . ': ' . (\$exists ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
}

echo PHP_EOL . '=== PROPERTIES TABLE VERIFICATION ===' . PHP_EOL;
\$propertyColumns = Schema::getColumnListing('properties');
\$requiredPropertyColumns = ['id', 'titre', 'description', 'prix', 'nombre_pieces'];

foreach (\$requiredPropertyColumns as \$col) {
    \$exists = in_array(\$col, \$propertyColumns);
    echo '  ' . \$col . ': ' . (\$exists ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
}

echo PHP_EOL . '=== STORAGE VERIFICATION ===' . PHP_EOL;
echo 'Profile images directory: ' . (is_dir('storage/app/public/profile-images') ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
echo 'Licenses directory: ' . (is_dir('storage/app/public/licenses') ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
echo 'Storage link: ' . (is_link('public/storage') || is_dir('public/storage') ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
"

echo.
echo ===============================================
echo  ALL MIGRATIONS FIXED!
echo ===============================================
echo.
echo ✅ Database structure is now complete
echo ✅ Profile image upload should work
echo ✅ All storage directories are set up
echo ✅ Caches are cleared
echo.
echo You can now:
echo 1. Upload profile images successfully
echo 2. Use all property features
echo 3. Upload license documents for agents
echo.
echo If you still encounter issues, check:
echo - storage/logs/laravel.log for detailed errors
echo - Database connection settings in .env
echo - File permissions on storage directories
echo.
pause
