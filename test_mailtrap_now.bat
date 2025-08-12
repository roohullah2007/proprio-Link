@echo off
echo ==========================================
echo    TESTING EMAIL WITH NEW CREDENTIALS
echo ==========================================
echo.

echo Step 1: Clearing all caches...
php artisan config:clear
php artisan cache:clear

echo.
echo Step 2: Verifying configuration...
php artisan tinker --execute="
echo 'Mail Driver: ' . config('mail.default') . PHP_EOL;
echo 'SMTP Host: ' . config('mail.mailers.smtp.host') . PHP_EOL;
echo 'SMTP Username: ' . config('mail.mailers.smtp.username') . PHP_EOL;
echo 'SMTP Password: ' . (config('mail.mailers.smtp.password') ? 'SET' : 'NOT SET') . PHP_EOL;
"

echo.
echo Step 3: Sending test email...
php artisan tinker --execute="
try {
    \Mail::raw('🎉 SUCCESS! Your Mailtrap configuration is working! Email sent at: ' . now(), function(\$message) {
        \$message->to('test@example.com')
                ->subject('✅ Mailtrap Test - ' . now());
    });
    echo '✅ SUCCESS: Test email sent to Mailtrap!' . PHP_EOL;
    echo 'Check your Mailtrap inbox now!' . PHP_EOL;
} catch (\Exception \$e) {
    echo '❌ ERROR: ' . \$e->getMessage() . PHP_EOL;
}
"

echo.
echo Step 4: Sending all test emails from your app...
php artisan tinker --execute="
use App\Models\User;
use App\Mail\AdminUserRegisteredNotification;
use App\Mail\PaymentSuccessEmail;
use App\Mail\PaymentFailedEmail;
use Illuminate\Support\Facades\Mail;

// Create or get a test user
\$testUser = User::first();
if (!\$testUser) {
    echo 'No users found. Please register a user first.' . PHP_EOL;
} else {
    echo 'Sending registration email...' . PHP_EOL;
    \$admins = User::where('type_utilisateur', 'ADMIN')->get();
    if (\$admins->isNotEmpty()) {
        foreach (\$admins as \$admin) {
            Mail::to(\$admin->email)->send(new AdminUserRegisteredNotification(\$testUser, 'fr'));
        }
        echo 'Registration emails sent to ' . \$admins->count() . ' admins' . PHP_EOL;
    }
    
    // Send password reset test
    echo 'Sending password reset email...' . PHP_EOL;
    \$testUser->sendPasswordResetNotification('test-token-123');
    echo 'Password reset email sent' . PHP_EOL;
    
    echo '✅ All test emails sent!' . PHP_EOL;
}
"

echo.
echo ==========================================
echo              TESTING COMPLETE! 🎉
echo ==========================================
echo.
echo What to do next:
echo 1. Go to your Mailtrap inbox: https://mailtrap.io/inboxes
echo 2. Click on "My Sandbox"
echo 3. You should see multiple test emails!
echo 4. Click on each email to view its content
echo.
echo If you see emails in Mailtrap, your email system is working! ✅
echo.
pause
