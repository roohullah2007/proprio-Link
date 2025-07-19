@echo off
echo Cleaning up failed migration...
php artisan tinker --execute="
use Illuminate\Support\Facades\DB;
DB::table('migrations')->where('migration', '2025_07_06_120000_add_missing_property_fields')->delete();
echo 'Failed migration entry removed from migrations table.' . PHP_EOL;
"
echo.
echo Migration table cleaned up.
pause