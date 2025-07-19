@echo off
echo ===============================================
echo  PROFILE UPDATE TEST
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Testing profile update functionality...

php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo '=== PROFILE UPDATE READINESS TEST ===' . PHP_EOL . PHP_EOL;

// 1. Check database columns
echo '1. DATABASE STRUCTURE:' . PHP_EOL;
\$userColumns = Schema::getColumnListing('users');
\$requiredColumns = ['id', 'prenom', 'nom', 'email', 'telephone', 'profile_image'];

foreach (\$requiredColumns as \$col) {
    \$exists = in_array(\$col, \$userColumns);
    echo '   ' . \$col . ': ' . (\$exists ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
}

// 2. Check storage
echo PHP_EOL . '2. STORAGE SETUP:' . PHP_EOL;
\$storageChecks = [
    'storage/app/public' => 'Main storage',
    'storage/app/public/profile-images' => 'Profile images dir',
    'public/storage' => 'Storage link'
];

foreach (\$storageChecks as \$path => \$desc) {
    \$exists = is_dir(\$path) || is_link(\$path);
    echo '   ' . \$desc . ': ' . (\$exists ? '✓ EXISTS' : '✗ MISSING') . PHP_EOL;
}

// 3. Check permissions
echo PHP_EOL . '3. PERMISSIONS:' . PHP_EOL;
\$writable = is_writable('storage/app/public');
echo '   Storage writable: ' . (\$writable ? '✓ YES' : '✗ NO') . PHP_EOL;

// 4. Check recent users
echo PHP_EOL . '4. TEST USER DATA:' . PHP_EOL;
try {
    \$userCount = DB::table('users')->count();
    echo '   Total users: ' . \$userCount . PHP_EOL;
    
    if (\$userCount > 0) {
        \$user = DB::table('users')->first();
        echo '   First user ID: ' . \$user->id . PHP_EOL;
        echo '   Has profile_image field: ' . (property_exists(\$user, 'profile_image') ? '✓ YES' : '✗ NO') . PHP_EOL;
    }
} catch (Exception \$e) {
    echo '   Database error: ' . \$e->getMessage() . PHP_EOL;
}

echo PHP_EOL . '=== TEST COMPLETE ===' . PHP_EOL;
echo 'If all items show ✓, profile updates should work!' . PHP_EOL;
"

echo.
echo ===============================================
echo Test completed!
echo ===============================================
echo.
echo If any items show ✗, run: COMPLETE_PROFILE_UPDATE_FIX.bat
echo.
pause
