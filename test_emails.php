<?php

use App\Models\User;
use App\Mail\AdminUserRegisteredNotification;
use App\Mail\PaymentSuccessEmail;
use App\Mail\PaymentFailedEmail;
use App\Models\ContactPurchase;
use App\Models\Property;
use Illuminate\Support\Facades\Mail;

/**
 * Email Testing Script
 * Run this with: php artisan tinker
 * Then paste this code
 */

// Test 1: User Registration Email to Admin
echo "Testing User Registration Email...\n";

$testUser = User::factory()->create([
    'prenom' => 'Jean',
    'nom' => 'Dupont',
    'email' => 'jean.dupont@test.com',
    'type_utilisateur' => 'AGENT',
    'language' => 'fr'
]);

$admins = User::where('type_utilisateur', 'ADMIN')->get();
if ($admins->isEmpty()) {
    echo "No admins found, creating test admin...\n";
    $admin = User::factory()->create([
        'prenom' => 'Admin',
        'nom' => 'Test',
        'email' => 'admin@test.com',
        'type_utilisateur' => 'ADMIN',
        'language' => 'fr'
    ]);
    $admins = collect([$admin]);
}

foreach ($admins as $admin) {
    Mail::to($admin->email)->send(new AdminUserRegisteredNotification($testUser, 'fr'));
}
echo "User registration emails sent to " . $admins->count() . " admins\n";

// Test 2: Payment Success Email
echo "\nTesting Payment Success Email...\n";

$property = Property::first();
if (!$property) {
    echo "No properties found, please create a property first\n";
} else {
    $mockPurchase = new stdClass();
    $mockPurchase->id = 'TEST-SUCCESS-' . time();
    $mockPurchase->agent = $testUser;
    $mockPurchase->property = $property;
    $mockPurchase->montant_paye = 15.00;
    $mockPurchase->devise = 'eur';
    $mockPurchase->created_at = now();
    $mockPurchase->stripe_payment_intent_id = 'pi_test_success';
    
    // Send to agent
    Mail::to($testUser->email)->send(new PaymentSuccessEmail($mockPurchase, 'fr', false));
    
    // Send to admins
    foreach ($admins as $admin) {
        Mail::to($admin->email)->send(new PaymentSuccessEmail($mockPurchase, 'fr', true));
    }
    
    echo "Payment success emails sent\n";
}

// Test 3: Payment Failed Email
echo "\nTesting Payment Failed Email...\n";

$mockFailedPurchase = new stdClass();
$mockFailedPurchase->id = 'TEST-FAILED-' . time();
$mockFailedPurchase->agent = $testUser;
$mockFailedPurchase->property = $property ?? null;
$mockFailedPurchase->created_at = now();

// Send to agent
Mail::to($testUser->email)->send(new PaymentFailedEmail($mockFailedPurchase, 'fr', false, 'Carte de crédit refusée'));

// Send to admins
foreach ($admins as $admin) {
    Mail::to($admin->email)->send(new PaymentFailedEmail($mockFailedPurchase, 'fr', true, 'Carte de crédit refusée'));
}

echo "Payment failed emails sent\n";

// Test 4: Password Reset Email
echo "\nTesting Password Reset Email...\n";

$testUser->sendPasswordResetNotification('test-token-123');
echo "Password reset email sent\n";

echo "\n✅ All email tests completed!\n";
echo "Check your Mailtrap inbox to see the emails.\n";
echo "\nEmails sent to:\n";
echo "- User: {$testUser->email}\n";
foreach ($admins as $admin) {
    echo "- Admin: {$admin->email}\n";
}

// Clean up test user (optional)
// $testUser->delete();
// echo "\nTest user deleted\n";
