@echo off
echo ===============================================
echo  QUICK PROFILE UPDATE FIX
echo ===============================================
cd /d "E:\Proprio-Link\webapp\laravel-react-app"

echo.
echo Step 1: Ensuring profile_image column exists...
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

if (!Schema::hasColumn('users', 'profile_image')) {
    echo 'Adding profile_image column...' . PHP_EOL;
    Schema::table('users', function (Blueprint \$table) {
        \$table->string('profile_image')->nullable();
    });
    echo 'Profile image column added!' . PHP_EOL;
} else {
    echo 'Profile image column exists.' . PHP_EOL;
}
"

echo.
echo Step 2: Setting up storage directories...
php artisan storage:link --force

if not exist "storage\app\public\profile-images" (
    mkdir "storage\app\public\profile-images"
    echo Created profile-images directory
)

echo.
echo Step 3: Setting permissions...
attrib -r "storage\app\public" /s /d 2>nul
attrib -r "storage\logs" /s /d 2>nul

echo.
echo Step 4: Clearing all caches...
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo.
echo Step 5: Checking PHP upload settings...
php -r "
echo 'PHP Upload Limits:' . PHP_EOL;
echo 'upload_max_filesize: ' . ini_get('upload_max_filesize') . PHP_EOL;
echo 'post_max_size: ' . ini_get('post_max_size') . PHP_EOL;
echo 'max_execution_time: ' . ini_get('max_execution_time') . ' seconds' . PHP_EOL;

\$maxSize = ini_get('upload_max_filesize');
\$maxSizeBytes = intval(\$maxSize) * (strpos(\$maxSize, 'M') !== false ? 1024*1024 : 1024);
if (\$maxSizeBytes < 2*1024*1024) {
    echo 'WARNING: upload_max_filesize is less than 2MB!' . PHP_EOL;
}
"

echo.
echo ===============================================
echo  QUICK FIX COMPLETED
echo ===============================================
echo.
echo Now try uploading your profile image again.
echo.
echo If you still get errors:
echo 1. Run: ENABLE_DEBUG_CONTROLLER.bat (for detailed logging)
echo 2. Check: storage/logs/laravel.log for error details
echo 3. Try a smaller image file (under 1MB)
echo.
pause
