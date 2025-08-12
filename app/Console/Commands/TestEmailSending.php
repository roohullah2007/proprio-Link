<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Config;

class TestEmailSending extends Command
{
    protected $signature = 'email:test {--to=}';
    protected $description = 'Test email sending configuration';

    public function handle()
    {
        $to = $this->option('to') ?: config('mail.admin_email', 'admin@proprio-link.fr');
        
        $this->info('Current email configuration:');
        $this->info('MAIL_MAILER: ' . config('mail.default'));
        $this->info('MAIL_HOST: ' . config('mail.mailers.smtp.host'));
        $this->info('MAIL_PORT: ' . config('mail.mailers.smtp.port'));
        $this->info('MAIL_USERNAME: ' . config('mail.mailers.smtp.username'));
        $this->info('MAIL_ENCRYPTION: ' . config('mail.mailers.smtp.encryption'));
        $this->info('MAIL_FROM_ADDRESS: ' . config('mail.from.address'));
        $this->info('MAIL_FROM_NAME: ' . config('mail.from.name'));
        
        $this->info("\nSending test email to: $to");
        
        try {
            Mail::raw('This is a demo email from Proprio Link application. If you receive this, email configuration is working correctly!', function ($message) use ($to) {
                $message->to($to)
                        ->subject('Demo Email - Proprio Link');
            });
            
            $this->info('✅ Email sent successfully!');
            $this->info('Check your inbox at: https://ethereal.email/messages');
            return 0;
        } catch (\Exception $e) {
            $this->error('❌ Failed to send email: ' . $e->getMessage());
            $this->error('Stack trace: ' . $e->getTraceAsString());
            return 1;
        }
    }
}