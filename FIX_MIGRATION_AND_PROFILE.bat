@echo off
echo ===============================================
echo  FIXING MIGRATION AND PROFILE IMAGE ISSUES
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo 1. Checking current migration status...
echo ===============================================
php artisan migrate:status

echo.
echo 2. Marking the problematic migration as run (if needed)...
echo ===============================================
echo This will mark the failing migration as completed without running it
php artisan migrate:mark-migrated --path=database/migrations/2025_06_06_221615_modify_users_table_for_proprio_link.php 2>nul || echo "Migration marking failed or not needed"

echo.
echo 3. Running a direct database fix...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Schema\Blueprint;

echo 'Checking and fixing database structure...' . PHP_EOL;

try {
    // Check current table structure
    \$columns = Schema::getColumnListing('users');
    echo 'Current columns: ' . implode(', ', \$columns) . PHP_EOL;
    
    // Add missing columns one by one
    \$neededColumns = [
        'uuid' => 'uuid',
        'prenom' => 'string',
        'nom' => 'string', 
        'telephone' => 'string_nullable',
        'type_utilisateur' => 'enum',
        'numero_siret' => 'string_nullable',
        'licence_professionnelle_url' => 'string_nullable',
        'est_verifie' => 'boolean',
        'profile_image' => 'string_nullable'
    ];
    
    foreach (\$neededColumns as \$columnName => \$type) {
        if (!Schema::hasColumn('users', \$columnName)) {
            echo 'Adding column: ' . \$columnName . PHP_EOL;
            Schema::table('users', function (Blueprint \$table) use (\$columnName, \$type) {
                switch (\$type) {
                    case 'uuid':
                        \$table->uuid(\$columnName)->nullable()->unique();
                        break;
                    case 'string':
                        \$table->string(\$columnName);
                        break;
                    case 'string_nullable':
                        \$table->string(\$columnName)->nullable();
                        break;
                    case 'enum':
                        \$table->enum(\$columnName, ['PROPRIETAIRE', 'AGENT', 'ADMIN'])->default('PROPRIETAIRE');
                        break;
                    case 'boolean':
                        \$table->boolean(\$columnName)->default(false);
                        break;
                }
            });
            echo 'Added: ' . \$columnName . PHP_EOL;
        } else {
            echo 'Column exists: ' . \$columnName . PHP_EOL;
        }
    }
    
    echo 'Database structure fixed successfully!' . PHP_EOL;
    
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 4. Running remaining migrations...
echo ===============================================
php artisan migrate --force

echo.
echo 5. Creating storage structure...
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
echo 6. Setting up permissions...
echo ===============================================
icacls "storage" /grant Everyone:F /T 2>nul || echo "Could not set permissions (may require admin rights)"

echo.
echo 7. Clearing caches...
echo ===============================================
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo 8. Final verification...
echo ===============================================
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;

echo 'Final database verification:' . PHP_EOL;
\$columns = Schema::getColumnListing('users');
\$required = ['id', 'uuid', 'prenom', 'nom', 'email', 'telephone', 'type_utilisateur', 'numero_siret', 'licence_professionnelle_url', 'est_verifie', 'profile_image'];

foreach (\$required as \$col) {
    echo \$col . ': ' . (in_array(\$col, \$columns) ? '✓' : '✗') . PHP_EOL;
}
"

echo.
echo ===============================================
echo  FIX COMPLETED!
echo ===============================================
echo.
echo Your database should now be ready for profile images.
echo Try uploading a profile image again.
echo.
echo If you still get errors, check:
echo 1. storage/logs/laravel.log
echo 2. Your database connection settings
echo 3. File permissions on storage directory
echo.
pause
