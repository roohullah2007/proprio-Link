<?php

// COMPREHENSIVE PAYMENT & EMAIL DEBUG AND FIX SCRIPT
// Place this file in your Laravel root directory and run it to debug and fix payment/email issues

require_once __DIR__ . '/vendor/autoload.php';

use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

// Bootstrap Laravel Application
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Request::capture();
$kernel->bootstrap();

class PaymentEmailDebugger
{
    private $issues = [];
    private $fixes = [];
    
    public function __construct()
    {
        echo "🔍 COMPREHENSIVE PAYMENT & EMAIL SYSTEM DEBUGGER\n";
        echo "===============================================\n\n";
    }
    
    public function runAllChecks()
    {
        $this->checkTranslations();
        $this->checkStripeConfiguration();
        $this->checkEmailConfiguration();
        $this->checkPaymentRoutes();
        $this->checkPaymentController();
        $this->checkEmailTemplates();
        $this->checkDatabaseTables();
        $this->testPaymentFlow();
        $this->displayResults();
        $this->applyFixes();
    }
    
    private function checkTranslations()
    {
        echo "📖 Checking Translation Files...\n";
        
        $missingTranslations = ['jardin', 'terrasse', 'calme'];
        $locales = ['en', 'fr'];
        
        foreach ($locales as $locale) {
            $translationFile = base_path("lang/{$locale}.json");
            
            if (!file_exists($translationFile)) {
                $this->issues[] = "Translation file missing: {$translationFile}";
                $this->fixes[] = "Create translation file for {$locale}";
                continue;
            }
            
            $translations = json_decode(file_get_contents($translationFile), true) ?? [];
            
            foreach ($missingTranslations as $key) {
                if (!isset($translations[$key])) {
                    $this->issues[] = "Missing translation key '{$key}' in {$locale}.json";
                    $this->fixes[] = "Add '{$key}' translation to {$locale}.json";
                    
                    // Auto-fix translation
                    $translations[$key] = $this->getDefaultTranslation($key, $locale);
                    file_put_contents($translationFile, json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
                    echo "✅ Fixed: Added '{$key}' translation to {$locale}.json\n";
                }
            }
        }
    }
    
    private function getDefaultTranslation($key, $locale)
    {
        $defaults = [
            'en' => [
                'jardin' => 'Garden',
                'terrasse' => 'Terrace',
                'calme' => 'Quiet'
            ],
            'fr' => [
                'jardin' => 'Jardin',
                'terrasse' => 'Terrasse',
                'calme' => 'Calme'
            ]
        ];
        
        return $defaults[$locale][$key] ?? ucfirst($key);
    }
    
    private function checkStripeConfiguration()
    {
        echo "\n💳 Checking Stripe Configuration...\n";
        
        try {
            $settings = DB::table('admin_settings')
                ->whereIn('key_name', ['stripe_publishable_key', 'stripe_secret_key'])
                ->pluck('value', 'key_name');
            
            if (empty($settings['stripe_publishable_key'])) {
                $this->issues[] = "Stripe publishable key not configured";
                $this->fixes[] = "Set stripe_publishable_key in admin settings";
            } else {
                echo "✅ Stripe publishable key configured\n";
            }
            
            if (empty($settings['stripe_secret_key'])) {
                $this->issues[] = "Stripe secret key not configured";
                $this->fixes[] = "Set stripe_secret_key in admin settings";
            } else {
                echo "✅ Stripe secret key configured\n";
                
                // Test decryption
                try {
                    $decrypted = \Illuminate\Support\Facades\Crypt::decryptString($settings['stripe_secret_key']);
                    echo "✅ Stripe secret key can be decrypted\n";
                } catch (\Exception $e) {
                    $this->issues[] = "Cannot decrypt Stripe secret key: " . $e->getMessage();
                }
            }
            
        } catch (\Exception $e) {
            $this->issues[] = "Error checking Stripe configuration: " . $e->getMessage();
        }
    }
    
    private function checkEmailConfiguration()
    {
        echo "\n📧 Checking Email Configuration...\n";
        
        $mailConfig = [
            'MAIL_MAILER' => env('MAIL_MAILER'),
            'MAIL_HOST' => env('MAIL_HOST'),
            'MAIL_PORT' => env('MAIL_PORT'),
            'MAIL_USERNAME' => env('MAIL_USERNAME'),
            'MAIL_PASSWORD' => env('MAIL_PASSWORD'),
            'MAIL_FROM_ADDRESS' => env('MAIL_FROM_ADDRESS'),
        ];
        
        foreach ($mailConfig as $key => $value) {
            if (empty($value)) {
                $this->issues[] = "Email configuration missing: {$key}";
                $this->fixes[] = "Set {$key} in .env file";
            } else {
                echo "✅ {$key} configured\n";
            }
        }
        
        // Test email connection
        try {
            $transport = Mail::getSwiftMailer()->getTransport();
            echo "✅ Email transport configured successfully\n";
        } catch (\Exception $e) {
            $this->issues[] = "Email transport error: " . $e->getMessage();
        }
    }
    
    private function checkPaymentRoutes()
    {
        echo "\n🛣️ Checking Payment Routes...\n";
        
        $requiredRoutes = [
            'payment.form',
            'payment.create-intent',
            'payment.confirm',
            'payment.purchases',
            'payment.contact-details'
        ];
        
        foreach ($requiredRoutes as $routeName) {
            try {
                $route = \Illuminate\Support\Facades\Route::getRoutes()->getByName($routeName);
                if ($route) {
                    echo "✅ Route '{$routeName}' exists\n";
                } else {
                    $this->issues[] = "Missing route: {$routeName}";
                }
            } catch (\Exception $e) {
                $this->issues[] = "Error checking route {$routeName}: " . $e->getMessage();
            }
        }
    }
    
    private function checkPaymentController()
    {
        echo "\n🎮 Checking Payment Controller...\n";
        
        $controllerPath = app_path('Http/Controllers/PaymentController.php');
        
        if (!file_exists($controllerPath)) {
            $this->issues[] = "PaymentController.php not found";
            $this->fixes[] = "Create PaymentController.php";
            return;
        }
        
        $controllerContent = file_get_contents($controllerPath);
        
        $requiredMethods = [
            'showPaymentForm',
            'createPaymentIntent', 
            'confirmPayment',
            'purchaseHistory',
            'showContactDetails'
        ];
        
        foreach ($requiredMethods as $method) {
            if (strpos($controllerContent, "function {$method}") === false) {
                $this->issues[] = "Missing method {$method} in PaymentController";
            } else {
                echo "✅ Method '{$method}' exists in PaymentController\n";
            }
        }
    }
    
    private function checkEmailTemplates()
    {
        echo "\n📄 Checking Email Templates...\n";
        
        $emailTemplates = [
            'resources/views/emails/agent/payment-success.blade.php',
            'resources/views/emails/admin/payment-success.blade.php',
            'resources/views/emails/agent/payment-failed.blade.php',
            'resources/views/emails/admin/payment-failed.blade.php'
        ];
        
        foreach ($emailTemplates as $template) {
            $templatePath = base_path($template);
            if (!file_exists($templatePath)) {
                $this->issues[] = "Missing email template: {$template}";
                $this->fixes[] = "Create email template: {$template}";
                $this->createEmailTemplate($templatePath);
            } else {
                echo "✅ Email template exists: {$template}\n";
            }
        }
    }
    
    private function createEmailTemplate($templatePath)
    {
        $dir = dirname($templatePath);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }
        
        $templateName = basename($templatePath, '.blade.php');
        $isAdmin = strpos($templatePath, 'admin') !== false;
        $isSuccess = strpos($templatePath, 'success') !== false;
        
        $content = $this->getEmailTemplateContent($templateName, $isAdmin, $isSuccess);
        file_put_contents($templatePath, $content);
        echo "✅ Created email template: {$templatePath}\n";
    }
    
    private function getEmailTemplateContent($templateName, $isAdmin, $isSuccess)
    {
        $title = $isSuccess ? 'Payment Successful' : 'Payment Failed';
        $recipient = $isAdmin ? 'Admin' : 'Agent';
        
        return <<<'HTML'
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'Payment Notification' }} - Proprio Link</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #065033; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { padding: 20px; text-align: center; color: #666; }
        .button { background: #065033; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
        .success { color: #28a745; }
        .error { color: #dc3545; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Proprio Link</h1>
            <h2>{{ $title ?? 'Payment Notification' }}</h2>
        </div>
        
        <div class="content">
            @if (isset($purchase) && (!isset($errorMessage) || empty($errorMessage)))
                <h3 class="success">✅ Payment Confirmed</h3>
                <p>Dear {{ $isForAdmin ?? false ? 'Administrator' : ($purchase->agent->prenom ?? 'Agent') }},</p>
                
                @if ($isForAdmin ?? false)
                    <p>A contact purchase has been completed successfully:</p>
                @else
                    <p>Your payment has been processed successfully! You now have access to the contact information.</p>
                @endif
                
                <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4>Purchase Details:</h4>
                    <ul>
                        <li><strong>Purchase ID:</strong> {{ $purchase->id ?? 'N/A' }}</li>
                        <li><strong>Amount:</strong> €{{ number_format($purchase->montant_paye ?? 0, 2) }}</li>
                        <li><strong>Property:</strong> {{ $purchase->property->adresse_complete ?? 'N/A' }}</li>
                        <li><strong>Date:</strong> {{ $purchase->created_at ? $purchase->created_at->format('d/m/Y H:i') : 'N/A' }}</li>
                    </ul>
                </div>
                
                @if (!($isForAdmin ?? false))
                    <p>
                        <a href="{{ $contactDetailsUrl ?? '#' }}" class="button">View Contact Information</a>
                    </p>
                @endif
            @else
                <h3 class="error">❌ Payment Failed</h3>
                <p>Dear {{ $isForAdmin ?? false ? 'Administrator' : (isset($purchase) && $purchase->agent ? $purchase->agent->prenom : 'Agent') }},</p>
                
                @if ($isForAdmin ?? false)
                    <p>A payment attempt has failed:</p>
                @else
                    <p>Unfortunately, your payment could not be processed. Please try again or contact support.</p>
                @endif
                
                @if (isset($errorMessage) && !empty($errorMessage))
                    <div style="background: #ffe6e6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <strong>Error:</strong> {{ $errorMessage }}
                    </div>
                @endif
            @endif
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} Proprio Link. All rights reserved.</p>
            <p>
                <a href="{{ env('APP_URL') }}">Visit Proprio Link</a> | 
                <a href="mailto:support@proprio-link.com">Support</a>
            </p>
        </div>
    </div>
</body>
</html>
HTML;
    }
    
    private function checkDatabaseTables()
    {
        echo "\n🗄️ Checking Database Tables...\n";
        
        $requiredTables = [
            'contact_purchases',
            'properties', 
            'users',
            'admin_settings',
            'invoices'
        ];
        
        foreach ($requiredTables as $table) {
            try {
                if (DB::getSchemaBuilder()->hasTable($table)) {
                    echo "✅ Table '{$table}' exists\n";
                } else {
                    $this->issues[] = "Missing table: {$table}";
                }
            } catch (\Exception $e) {
                $this->issues[] = "Error checking table {$table}: " . $e->getMessage();
            }
        }
        
        // Check specific columns
        $columnChecks = [
            'contact_purchases' => ['stripe_payment_intent_id', 'montant_paye', 'statut_paiement'],
            'users' => ['type_utilisateur', 'email', 'language'],
            'properties' => ['statut', 'contacts_restants', 'proprietaire_id']
        ];
        
        foreach ($columnChecks as $table => $columns) {
            foreach ($columns as $column) {
                try {
                    if (DB::getSchemaBuilder()->hasColumn($table, $column)) {
                        echo "✅ Column '{$table}.{$column}' exists\n";
                    } else {
                        $this->issues[] = "Missing column: {$table}.{$column}";
                    }
                } catch (\Exception $e) {
                    $this->issues[] = "Error checking column {$table}.{$column}: " . $e->getMessage();
                }
            }
        }
    }
    
    private function testPaymentFlow()
    {
        echo "\n🔄 Testing Payment Flow...\n";
        
        try {
            // Check if we can instantiate PaymentController
            $paymentController = new \App\Http\Controllers\PaymentController();
            echo "✅ PaymentController can be instantiated\n";
        } catch (\Exception $e) {
            $this->issues[] = "Cannot instantiate PaymentController: " . $e->getMessage();
        }
        
        // Check if we have test data
        try {
            $publishedProperties = \App\Models\Property::where('statut', 'PUBLIE')->count();
            $agentUsers = \App\Models\User::where('type_utilisateur', 'AGENT')->count();
            $adminUsers = \App\Models\User::where('type_utilisateur', 'ADMIN')->count();
            
            echo "✅ Published properties: {$publishedProperties}\n";
            echo "✅ Agent users: {$agentUsers}\n";
            echo "✅ Admin users: {$adminUsers}\n";
            
            if ($publishedProperties === 0) {
                $this->issues[] = "No published properties available for testing";
            }
            
            if ($agentUsers === 0) {
                $this->issues[] = "No agent users available for testing";
            }
        } catch (\Exception $e) {
            $this->issues[] = "Error checking test data: " . $e->getMessage();
        }
    }
    
    private function displayResults()
    {
        echo "\n" . str_repeat("=", 50) . "\n";
        echo "📊 DIAGNOSIS RESULTS\n";
        echo str_repeat("=", 50) . "\n";
        
        if (empty($this->issues)) {
            echo "🎉 No issues found! Your payment and email system looks good.\n";
        } else {
            echo "⚠️ Found " . count($this->issues) . " issues:\n\n";
            foreach ($this->issues as $index => $issue) {
                echo ($index + 1) . ". {$issue}\n";
            }
        }
        
        if (!empty($this->fixes)) {
            echo "\n🔧 Recommended fixes:\n\n";
            foreach ($this->fixes as $index => $fix) {
                echo ($index + 1) . ". {$fix}\n";
            }
        }
    }
    
    private function applyFixes()
    {
        echo "\n🛠️ Applying automatic fixes...\n";
        
        // Create missing email classes
        $this->createMissingEmailClasses();
        
        // Update PaymentController with better error handling
        $this->updatePaymentController();
        
        // Create debug routes
        $this->createDebugRoutes();
        
        echo "✅ Automatic fixes applied!\n";
    }
    
    private function createMissingEmailClasses()
    {
        $emailClasses = [
            'PaymentSuccessEmail',
            'PaymentFailedEmail',
            'PropertyContactPurchased'
        ];
        
        foreach ($emailClasses as $className) {
            $classPath = app_path("Mail/{$className}.php");
            if (!file_exists($classPath)) {
                $this->createEmailClass($className, $classPath);
                echo "✅ Created email class: {$className}\n";
            }
        }
    }
    
    private function createEmailClass($className, $classPath)
    {
        $content = <<<'PHP'
<?php

namespace App\Mail;

use App\Models\ContactPurchase;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class $className extends Mailable
{
    use Queueable, SerializesModels;

    public $purchase;
    public $locale;
    public $isForAdmin;
    public $errorMessage;

    public function __construct($purchase, $locale = 'fr', $isForAdmin = false, $errorMessage = null)
    {
        $this->purchase = $purchase;
        $this->locale = $locale;
        $this->isForAdmin = $isForAdmin;
        $this->errorMessage = $errorMessage;
    }

    public function envelope(): Envelope
    {
        $subject = $this->locale === 'en' 
            ? 'Payment Notification - Proprio Link'
            : 'Notification de paiement - Proprio Link';

        return Envelope::create()
            ->subject($subject)
            ->from(config('mail.from.address'), config('mail.from.name'));
    }

    public function content(): Content
    {
        $view = $this->isForAdmin ? 'emails.admin.payment-success' : 'emails.agent.payment-success';
        
        return Content::create()
            ->view($view)
            ->with([
                'purchase' => $this->purchase,
                'locale' => $this->locale,
                'isForAdmin' => $this->isForAdmin,
                'errorMessage' => $this->errorMessage,
                'contactDetailsUrl' => '#',
                'purchaseHistoryUrl' => '#',
                'adminDashboardUrl' => '#',
            ]);
    }

    public function attachments(): array
    {
        return [];
    }
}
PHP;
        
        $content = str_replace('$className', $className, $content);
        file_put_contents($classPath, $content);
    }
    
    private function updatePaymentController()
    {
        echo "🔄 Updating PaymentController with better error handling...\n";
        
        $controllerPath = app_path('Http/Controllers/PaymentController.php');
        if (!file_exists($controllerPath)) {
            echo "⚠️ PaymentController.php not found, skipping update\n";
            return;
        }
        
        $content = file_get_contents($controllerPath);
        
        // Add better logging method if not exists
        if (strpos($content, 'logPaymentDebug') === false) {
            $loggerMethod = <<<'PHP'

    /**
     * Enhanced logging for payment debugging
     */
    private function logPaymentDebug($message, $context = [])
    {
        $debugContext = array_merge($context, [
            'timestamp' => now()->toISOString(),
            'user_id' => auth()->id(),
            'user_agent' => request()->userAgent(),
            'ip' => request()->ip(),
        ]);
        
        Log::info("PAYMENT_DEBUG: {$message}", $debugContext);
        
        // Also write to a specific payment debug log
        $debugLog = storage_path('logs/payment_debug.log');
        $logEntry = "[" . now()->toISOString() . "] {$message} " . json_encode($debugContext) . PHP_EOL;
        file_put_contents($debugLog, $logEntry, FILE_APPEND | LOCK_EX);
    }
PHP;
            
            // Insert the logger method before the last closing brace
            $content = str_replace('}\n}', $loggerMethod . "\n}\n}", $content);
            file_put_contents($controllerPath, $content);
            echo "✅ Added debug logging to PaymentController\n";
        }
    }
    
    private function createDebugRoutes()
    {
        echo "🔄 Creating debug routes...\n";
        
        $debugRoutes = <<<'PHP'

// PAYMENT DEBUG ROUTES - Remove in production
Route::middleware(['auth'])->group(function () {
    Route::get('/debug/payment-logs', function () {
        $logFile = storage_path('logs/payment_debug.log');
        if (file_exists($logFile)) {
            $logs = file_get_contents($logFile);
            return response($logs)->header('Content-Type', 'text/plain');
        }
        return response('No payment debug logs found', 404);
    });
    
    Route::get('/debug/test-email', function () {
        try {
            $user = auth()->user();
            \Mail::raw('Test email from Proprio Link - ' . now(), function ($message) use ($user) {
                $message->to($user->email)
                        ->subject('Test Email - Proprio Link');
            });
            return response()->json(['success' => true, 'message' => 'Test email sent to ' . $user->email]);
        } catch (Exception $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()]);
        }
    });
    
    Route::get('/debug/clear-payment-logs', function () {
        $logFile = storage_path('logs/payment_debug.log');
        if (file_exists($logFile)) {
            file_put_contents($logFile, '');
            return response()->json(['success' => true, 'message' => 'Payment debug logs cleared']);
        }
        return response()->json(['success' => false, 'message' => 'No logs to clear']);
    });
    
    Route::get('/debug/payment-config', function () {
        try {
            $settings = DB::table('admin_settings')
                ->whereIn('key_name', ['stripe_publishable_key', 'stripe_secret_key'])
                ->pluck('value', 'key_name');
                
            return response()->json([
                'stripe_configured' => !empty($settings['stripe_secret_key']),
                'email_configured' => !empty(env('MAIL_HOST')),
                'published_properties' => \App\Models\Property::where('statut', 'PUBLIE')->count(),
                'agent_users' => \App\Models\User::where('type_utilisateur', 'AGENT')->count(),
                'timestamp' => now()
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()]);
        }
    });
});
PHP;
        
        $routesFile = base_path('routes/web.php');
        $routesContent = file_get_contents($routesFile);
        
        if (strpos($routesContent, 'PAYMENT DEBUG ROUTES') === false) {
            file_put_contents($routesFile, $routesContent . PHP_EOL . $debugRoutes);
            echo "✅ Debug routes added to web.php\n";
        } else {
            echo "✅ Debug routes already exist in web.php\n";
        }
    }
}

// Run the debugger
try {
    $debugger = new PaymentEmailDebugger();
    $debugger->runAllChecks();
    
    echo "\n🎯 NEXT STEPS:\n";
    echo "1. Test payment flow: Visit a property page and click 'Buy Contact'\n";
    echo "2. Check debug logs: http://localhost:8000/debug/payment-logs\n";
    echo "3. Test emails: http://localhost:8000/debug/test-email\n";
    echo "4. Check config: http://localhost:8000/debug/payment-config\n";
    echo "5. Clear logs: http://localhost:8000/debug/clear-payment-logs\n";
    echo "\n✨ Debug complete! Check the output above for any remaining issues.\n";
    
} catch (Exception $e) {
    echo "❌ Error running debugger: " . $e->getMessage() . "\n";
    echo "Trace: " . $e->getTraceAsString() . "\n";
}
