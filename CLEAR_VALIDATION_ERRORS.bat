@echo off
echo ===============================================
echo  CLEAR PROFILE VALIDATION ERRORS
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Clearing all cached errors and sessions...

php artisan cache:clear
php artisan config:clear
php artisan session:flush
php artisan view:clear

echo.
echo Testing current user data...
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

try {
    \$users = DB::table('users')->select('id', 'prenom', 'nom', 'email')->limit(3)->get();
    echo 'Sample user data:' . PHP_EOL;
    foreach (\$users as \$user) {
        echo '  ID: ' . \$user->id . ', Name: ' . \$user->prenom . ' ' . \$user->nom . ', Email: ' . \$user->email . PHP_EOL;
    }
} catch (Exception \$e) {
    echo 'Database error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo ===============================================
echo  CACHE CLEARED!
echo ===============================================
echo.
echo Now:
echo 1. Close your browser completely
echo 2. Reopen browser and go to: http://127.0.0.1:8000/profile
echo 3. Hard refresh the page (Ctrl+Shift+R or Ctrl+F5)
echo 4. The validation errors should be gone!
echo.
echo If errors persist, run: FIX_PROFILE_VALIDATION.bat
echo.
pause
