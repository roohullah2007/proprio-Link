@echo off
echo ==========================================
echo    TESTING PAYMENT EMAIL FUNCTIONALITY
echo ==========================================
echo.

echo Step 1: Checking admin users in database...
php artisan tinker --execute="
\$admins = \App\Models\User::where('type_utilisateur', 'ADMIN')->get();
echo 'Admin users found: ' . \$admins->count() . PHP_EOL;
foreach (\$admins as \$admin) {
    echo '- Admin: ' . \$admin->email . ' (ID: ' . \$admin->id . ')' . PHP_EOL;
}

if (\$admins->isEmpty()) {
    echo 'Creating a test admin user...' . PHP_EOL;
    \$admin = \App\Models\User::create([
        'prenom' => 'Admin',
        'nom' => 'Test',
        'email' => 'admin@proprio-link.com',
        'type_utilisateur' => 'ADMIN',
        'password' => bcrypt('password123'),
        'est_verifie' => true,
        'email_verified_at' => now(),
        'language' => 'fr'
    ]);
    echo 'Admin user created: ' . \$admin->email . PHP_EOL;
}
"

echo.
echo Step 2: Checking agent users...
php artisan tinker --execute="
\$agents = \App\Models\User::where('type_utilisateur', 'AGENT')->get();
echo 'Agent users found: ' . \$agents->count() . PHP_EOL;
foreach (\$agents->take(3) as \$agent) {
    echo '- Agent: ' . \$agent->email . ' (ID: ' . \$agent->id . ')' . PHP_EOL;
}
"

echo.
echo Step 3: Creating mock contact purchase for testing...
php artisan tinker --execute="
use App\Models\User;
use App\Models\Property;
use App\Models\ContactPurchase;
use App\Mail\PaymentSuccessEmail;
use Illuminate\Support\Facades\Mail;

\$agent = User::where('type_utilisateur', 'AGENT')->first();
\$property = Property::with('proprietaire')->where('statut', 'PUBLIE')->first();

if (!\$agent) {
    echo 'No agent found. Please create an agent user first.' . PHP_EOL;
    exit;
}

if (!\$property) {
    echo 'No published property found. Please create a property first.' . PHP_EOL;
    exit;
}

echo 'Creating mock purchase...' . PHP_EOL;
echo 'Agent: ' . \$agent->email . PHP_EOL;
echo 'Property: ' . \$property->adresse_complete . PHP_EOL;
echo 'Property Owner: ' . \$property->proprietaire->email . PHP_EOL;

// Create a mock purchase object
\$mockPurchase = new stdClass();
\$mockPurchase->id = 'TEST-' . time();
\$mockPurchase->agent = \$agent;
\$mockPurchase->property = \$property;
\$mockPurchase->montant_paye = 15.00;
\$mockPurchase->devise = 'eur';
\$mockPurchase->created_at = now();
\$mockPurchase->stripe_payment_intent_id = 'pi_test_payment_success';

// Send emails
echo 'Sending payment success emails...' . PHP_EOL;

// Email to agent
try {
    Mail::to(\$agent->email)->send(new PaymentSuccessEmail(\$mockPurchase, 'fr', false));
    echo '✅ Agent email sent to: ' . \$agent->email . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Agent email failed: ' . \$e->getMessage() . PHP_EOL;
}

// Email to admins
\$admins = User::where('type_utilisateur', 'ADMIN')->get();
foreach (\$admins as \$admin) {
    try {
        Mail::to(\$admin->email)->send(new PaymentSuccessEmail(\$mockPurchase, 'fr', true));
        echo '✅ Admin email sent to: ' . \$admin->email . PHP_EOL;
    } catch (Exception \$e) {
        echo '❌ Admin email failed: ' . \$e->getMessage() . PHP_EOL;
    }
}

// Email to property owner
try {
    Mail::to(\$property->proprietaire->email)->send(new \App\Mail\PropertyContactPurchased(\$mockPurchase, 'fr'));
    echo '✅ Property owner email sent to: ' . \$property->proprietaire->email . PHP_EOL;
} catch (Exception \$e) {
    echo '❌ Property owner email failed: ' . \$e->getMessage() . PHP_EOL;
}

echo 'Email test completed!' . PHP_EOL;
"

echo.
echo Step 4: Checking Laravel logs for email errors...
if exist "storage\logs\laravel.log" (
    echo Recent email-related logs:
    powershell "Get-Content 'storage\logs\laravel.log' | Select-String -Pattern 'mail|email|Payment.*success|Failed.*send' | Select-Object -Last 10"
) else (
    echo No log file found.
)

echo.
echo ==========================================
echo         EMAIL TEST COMPLETE! 📧
echo ==========================================
echo.
echo Check your Mailtrap inbox at: https://mailtrap.io/inboxes
echo You should see:
echo - Agent payment success email
echo - Admin payment notification email  
echo - Property owner contact purchased email
echo.
echo If no emails appear:
echo 1. Check the error messages above
echo 2. Verify Mailtrap credentials in .env
echo 3. Ensure admin users exist in database
echo 4. Check Laravel logs for specific errors
echo.
pause
