<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;

class TestEmail extends Command
{
    protected $signature = 'email:test {email} {--type=welcome}';
    protected $description = 'Send a test email to verify Mailtrap configuration';

    public function handle()
    {
        $email = $this->argument('email');
        $type = $this->option('type');

        $this->info("Sending test email to: {$email}");
        $this->info("Email type: {$type}");

        try {
            switch ($type) {
                case 'welcome':
                    $this->sendWelcomeEmail($email);
                    break;
                case 'test':
                    $this->sendSimpleTestEmail($email);
                    break;
                default:
                    $this->sendSimpleTestEmail($email);
            }

            $this->info("✅ Email sent successfully! Check your Mailtrap inbox.");
            $this->info("🌐 Login to https://mailtrap.io to view the email.");

        } catch (\Exception $e) {
            $this->error("❌ Failed to send email: " . $e->getMessage());
            $this->info("💡 Make sure your Mailtrap credentials are correct in .env file");
        }
    }

    private function sendWelcomeEmail($email)
    {
        // Create a temporary user for testing
        $testUser = new User([
            'prenom' => 'Test',
            'nom' => 'User',
            'email' => $email,
            'type_utilisateur' => 'AGENT',
            'est_verifie' => false,
            'created_at' => now()
        ]);

        Mail::send('emails.welcome', ['user' => $testUser], function ($message) use ($email) {
            $message->to($email)
                    ->subject('Bienvenue sur Proprio Link !');
        });
    }

    private function sendSimpleTestEmail($email)
    {
        Mail::raw('This is a test email from Proprio Link to verify Mailtrap configuration.', function ($message) use ($email) {
            $message->to($email)
                    ->subject('Test Email - Mailtrap Configuration');
        });
    }
}
