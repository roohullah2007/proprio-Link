<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Mail\WelcomeEmail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;

class TestWelcomeEmail extends Command
{
    protected $signature = 'email:test-welcome {--to=}';
    protected $description = 'Test sending a welcome email';

    public function handle()
    {
        $to = $this->option('to') ?: config('mail.admin_email', 'admin@proprio-link.fr');
        
        $this->info("Sending welcome email to: $to");
        
        try {
            // Create a temporary user object (not saved to database)
            $user = new User();
            $user->first_name = 'Demo';
            $user->last_name = 'User';
            $user->email = $to;
            $user->language = 'fr';
            $user->role = 'agent';
            
            Mail::to($to)->send(new WelcomeEmail($user));
            
            $this->info('✅ Welcome email sent successfully!');
            $this->info('Check your inbox at: https://ethereal.email/messages');
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send welcome email: ' . $e->getMessage());
            return 1;
        }
    }
}