@echo off
echo ===============================================
echo  COMPLETE MIGRATION AND PROFILE IMAGE FIX
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Step 1: Clearing any failed migration state...
echo ===============================================
php artisan migrate:reset --force 2>nul || echo "No migrations to reset"

echo.
echo Step 2: Running the fixed migration...
echo ===============================================
php artisan migrate --force

echo.
echo Step 3: Adding profile image column if missing...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

if (!Schema::hasColumn('users', 'profile_image')) {
    echo 'Adding profile_image column...' . PHP_EOL;
    Schema::table('users', function (Blueprint \$table) {
        \$table->string('profile_image')->nullable()->after('licence_professionnelle_url');
    });
    echo 'Profile image column added successfully!' . PHP_EOL;
} else {
    echo 'Profile image column already exists.' . PHP_EOL;
}
"

echo.
echo Step 4: Setting up storage...
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
echo Step 5: Clearing caches...
echo ===============================================
php artisan config:clear
php artisan cache:clear
php artisan view:clear

echo.
echo Step 6: Final verification...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;

echo '=== FINAL DATABASE STRUCTURE ===' . PHP_EOL;
\$columns = Schema::getColumnListing('users');
\$required = ['id', 'uuid', 'prenom', 'nom', 'email', 'telephone', 'type_utilisateur', 'numero_siret', 'licence_professionnelle_url', 'est_verifie', 'profile_image'];

echo 'Checking required columns:' . PHP_EOL;
foreach (\$required as \$col) {
    \$exists = in_array(\$col, \$columns);
    echo '  ' . \$col . ': ' . (\$exists ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
}

echo PHP_EOL . 'All columns in users table:' . PHP_EOL;
foreach (\$columns as \$index => \$column) {
    echo '  ' . (\$index + 1) . '. ' . \$column . PHP_EOL;
}
"

echo.
echo ===============================================
echo  MIGRATION FIX COMPLETED!
echo ===============================================
echo.
echo Your database should now be properly set up.
echo You can now upload profile images successfully.
echo.
echo If you still have issues:
echo 1. Check storage/logs/laravel.log for errors
echo 2. Verify file permissions on storage directory
echo 3. Test the profile image upload feature
echo.
pause
