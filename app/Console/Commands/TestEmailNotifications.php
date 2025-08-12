<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Mail\AdminUserRegistered;
use App\Mail\AdminPasswordResetRequest;
use App\Mail\AdminContactPurchased;
use App\Models\ContactPurchase;
use App\Services\AdminNotificationService;

class TestEmailNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:emails {type? : Type of email to test (registration|password-reset|contact-purchase|property-created|property-approved|all)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test email notifications to admins';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $type = $this->argument('type') ?? 'all';
        
        $this->info('Testing email notifications...');
        
        // Get a test user
        $testUser = User::where('type_utilisateur', 'AGENT')->first() 
                   ?? User::first();
                   
        if (!$testUser) {
            $this->error('No users found in database. Please create a user first.');
            return;
        }
        
        switch ($type) {
            case 'registration':
                $this->testRegistrationEmail($testUser);
                break;
            case 'password-reset':
                $this->testPasswordResetEmail($testUser);
                break;
            case 'contact-purchase':
                $this->testContactPurchaseEmail();
                break;
            case 'property-created':
                $this->testPropertyCreatedEmail();
                break;
            case 'property-approved':
                $this->testPropertyApprovedEmail();
                break;
            case 'all':
                $this->testRegistrationEmail($testUser);
                $this->testPasswordResetEmail($testUser);
                $this->testContactPurchaseEmail();
                $this->testPropertyCreatedEmail();
                $this->testPropertyApprovedEmail();
                break;
            default:
                $this->error('Invalid email type. Use: registration, password-reset, contact-purchase, property-created, property-approved, or all');
                return;
        }
        
        $this->info('Email tests completed. Check your Mailtrap inbox.');
    }
    
    private function testRegistrationEmail($user)
    {
        $this->info('Testing registration email...');
        try {
            AdminNotificationService::notifyAdmins(new AdminUserRegistered($user));
            $this->line('✅ Registration email sent successfully');
        } catch (\Exception $e) {
            $this->error('❌ Registration email failed: ' . $e->getMessage());
        }
    }
    
    private function testPasswordResetEmail($user)
    {
        $this->info('Testing password reset email...');
        try {
            $resetUrl = route('password.reset', ['token' => 'test-token', 'email' => $user->email]);
            AdminNotificationService::notifyAdmins(new AdminPasswordResetRequest($user, $resetUrl));
            $this->line('✅ Password reset email sent successfully');
        } catch (\Exception $e) {
            $this->error('❌ Password reset email failed: ' . $e->getMessage());
        }
    }
    
    private function testContactPurchaseEmail()
    {
        $this->info('Testing contact purchase email...');
        try {
            $purchase = ContactPurchase::with(['agent', 'property.proprietaire'])->first();
            
            if (!$purchase) {
                $this->warn('⚠️ No contact purchases found. Skipping contact purchase email test.');
                return;
            }
            
            AdminNotificationService::notifyAdmins(new AdminContactPurchased($purchase));
            $this->line('✅ Contact purchase email sent successfully');
        } catch (\Exception $e) {
            $this->error('❌ Contact purchase email failed: ' . $e->getMessage());
        }
    }
    
    private function testPropertyCreatedEmail()
    {
        $this->info('Testing property created email...');
        try {
            $property = \App\Models\Property::with('proprietaire')->first();
            
            if (!$property) {
                $this->warn('⚠️ No properties found. Skipping property created email test.');
                return;
            }
            
            AdminNotificationService::notifyAdmins(new \App\Mail\AdminPropertyCreated($property));
            $this->line('✅ Property created email sent successfully');
        } catch (\Exception $e) {
            $this->error('❌ Property created email failed: ' . $e->getMessage());
        }
    }
    
    private function testPropertyApprovedEmail()
    {
        $this->info('Testing property approved email...');
        try {
            $property = \App\Models\Property::with('proprietaire')->where('statut', 'PUBLIE')->first();
            
            if (!$property) {
                $this->warn('⚠️ No published properties found. Skipping property approved email test.');
                return;
            }
            
            AdminNotificationService::notifyAdmins(new \App\Mail\AdminPropertyApproved($property));
            $this->line('✅ Property approved email sent successfully');
        } catch (\Exception $e) {
            $this->error('❌ Property approved email failed: ' . $e->getMessage());
        }
    }
}
