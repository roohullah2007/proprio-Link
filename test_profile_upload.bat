@echo off
echo ================================
echo PROFILE IMAGE UPLOAD DEBUG TEST
echo ================================
echo.

echo Testing form submission with files...
echo.

echo 1. Check current Laravel logs...
if exist "storage\logs\laravel.log" (
    echo Latest log entries:
    powershell "Get-Content 'storage\logs\laravel.log' -Tail 20"
) else (
    echo No log file found.
)

echo.
echo 2. Test basic profile update without files...
php artisan tinker --execute="
try {
    \$user = App\Models\User::first();
    \$originalData = [
        'prenom' => \$user->prenom,
        'nom' => \$user->nom,
        'email' => \$user->email
    ];
    echo 'Original data: ' . json_encode(\$originalData) . PHP_EOL;
    
    // Test validation
    \$validator = Validator::make([
        'prenom' => 'Test',
        'nom' => 'User',
        'email' => \$user->email,
        'telephone' => '',
        'numero_siret' => ''
    ], [
        'prenom' => 'required|string|max:255',
        'nom' => 'required|string|max:255',
        'email' => 'required|email|unique:users,email,' . \$user->id,
        'telephone' => 'nullable|string|max:20',
        'numero_siret' => 'nullable|string|max:14'
    ]);
    
    if (\$validator->fails()) {
        echo 'Validation failed: ' . json_encode(\$validator->errors()) . PHP_EOL;
    } else {
        echo 'Validation passed!' . PHP_EOL;
    }
    
} catch (Exception \$e) {
    echo 'Error: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo 3. Check if storage directories exist...
if exist "storage\app\public\profile-images" (
    echo ✓ Profile images directory exists
) else (
    echo ✗ Profile images directory missing - creating...
    mkdir "storage\app\public\profile-images"
)

if exist "public\storage" (
    echo ✓ Storage symlink exists
) else (
    echo ✗ Storage symlink missing - creating...
    php artisan storage:link
)

echo.
echo 4. Test file upload permissions...
echo Testing file creation in profile-images directory...
echo test > "storage\app\public\profile-images\test.txt"
if exist "storage\app\public\profile-images\test.txt" (
    echo ✓ Can write to profile-images directory
    del "storage\app\public\profile-images\test.txt"
) else (
    echo ✗ Cannot write to profile-images directory
)

echo.
echo ================================
echo NEXT STEPS:
echo 1. Try uploading a profile image again
echo 2. Check browser Network tab for the request details
echo 3. Look at the new Laravel logs above
echo 4. If still failing, check browser console for JS errors
echo ================================
pause
