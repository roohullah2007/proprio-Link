@echo off
echo Checking current properties table structure...
php artisan tinker --execute="
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

echo 'Current columns in properties table:' . PHP_EOL;
$columns = DB::select('DESCRIBE properties');
foreach ($columns as $column) {
    echo '- ' . $column->Field . ' (' . $column->Type . ')' . PHP_EOL;
}
"
pause