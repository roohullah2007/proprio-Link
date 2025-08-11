<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\CustomResetPasswordMail;
use App\Mail\CustomVerifyEmailMail;

class TestCustomEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:custom-emails {email?} {--type=all}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test custom styled emails (reset-password, verify-email)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email') ?: config('mail.admin_email', 'admin@proprio-link.fr');
        $type = $this->option('type');
        
        // Create a demo user
        $testUser = new User([
            'prenom' => 'Jean',
            'nom' => 'Dupont',
            'email' => $email,
            'type_utilisateur' => 'AGENT',
            'created_at' => now()
        ]);

        try {
            if ($type === 'all' || $type === 'reset-password') {
                $this->info('Sending password reset email...');
                $resetUrl = 'https://exemple.com/reset-password?token=test-token-123';
                
                Mail::to($email)->send(new CustomResetPasswordMail($testUser, $resetUrl));
                $this->info("✅ Password reset email sent to: {$email}");
            }

            if ($type === 'all' || $type === 'verify-email') {
                $this->info('Sending email verification email...');
                $verificationUrl = 'https://exemple.com/verify-email?signature=test-signature-456';
                
                Mail::to($email)->send(new CustomVerifyEmailMail($testUser, $verificationUrl));
                $this->info("✅ Email verification email sent to: {$email}");
            }

            $this->info('All test emails sent successfully!');
            $this->info('Check your Mailtrap inbox: https://mailtrap.io');

        } catch (\Exception $e) {
            $this->error('Failed to send test emails: ' . $e->getMessage());
            return 1;
        }

        return 0;
    }
}
