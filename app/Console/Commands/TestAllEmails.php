<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Property;
use App\Mail\WelcomeEmail;
use App\Mail\PropertySubmittedMail;
use App\Mail\PropertyApprovedMail;
use App\Mail\PropertyRejectedMail;
use App\Mail\AgentPurchaseConfirmation;
use App\Mail\PropertyContactPurchased;
use App\Mail\CustomVerifyEmailMail;
use App\Mail\CustomResetPasswordMail;

class TestAllEmails extends Command
{
    protected $signature = 'email:test-all {--to=}';
    protected $description = 'Test all email templates';

    public function handle()
    {
        $to = $this->option('to') ?: config('mail.admin_email', 'admin@proprio-link.fr');
        
        $this->info("Testing all email templates. Sending to: $to");
        $this->info("You can check all emails at: https://ethereal.email/messages");
        $this->info("Login with: darien79@ethereal.email / 1yjd16NHTnMFTEtVkN\n");
        
        // Create test data
        $user = new User();
        $user->first_name = 'Test';
        $user->last_name = 'User';
        $user->email = $to;
        $user->language = 'fr';
        $user->role = 'agent';
        $user->is_verified = false;
        
        $owner = new User();
        $owner->first_name = 'Property';
        $owner->last_name = 'Owner';
        $owner->email = $to;
        $owner->language = 'fr';
        $owner->role = 'owner';
        
        $property = new Property();
        $property->title = 'Beautiful Test Property';
        $property->description = 'This is a test property description';
        $property->price = 500000;
        $property->city = 'Paris';
        $property->property_type = 'house';
        $property->contact_attempts = 0;
        $property->max_contact_attempts = 5;
        $property->setRelation('user', $owner); // Set owner relationship
        
        // Test each email
        $emails = [
            'Welcome Email' => function() use ($to, $user) {
                Mail::to($to)->send(new WelcomeEmail($user));
            },
            'Email Verification' => function() use ($to, $user) {
                $verificationUrl = url('/verify-email/12345/abc123');
                Mail::to($to)->send(new CustomVerifyEmailMail($user, $verificationUrl));
            },
            'Password Reset' => function() use ($to, $user) {
                $resetUrl = url('/reset-password/token123');
                Mail::to($to)->send(new CustomResetPasswordMail($user, $resetUrl));
            },
            'Property Submitted' => function() use ($to, $property) {
                Mail::to($to)->send(new PropertySubmittedMail($property));
            },
            'Property Approved' => function() use ($to, $property) {
                Mail::to($to)->send(new PropertyApprovedMail($property));
            },
            'Property Rejected' => function() use ($to, $property) {
                Mail::to($to)->send(new PropertyRejectedMail($property, 'Missing required information'));
            },
            'Agent Purchase Confirmation' => function() use ($to, $user, $property) {
                Mail::to($to)->send(new AgentPurchaseConfirmation($user, $property));
            },
            'Property Contact Purchased' => function() use ($to, $owner, $user, $property) {
                Mail::to($to)->send(new PropertyContactPurchased($owner, $property, $user));
            }
        ];
        
        $success = 0;
        $failed = 0;
        
        foreach ($emails as $name => $callback) {
            try {
                $this->info("Testing: $name...");
                $callback();
                $this->info("✅ $name sent successfully!");
                $success++;
            } catch (\Exception $e) {
                $this->error("❌ $name failed: " . $e->getMessage());
                $failed++;
            }
            
            // Small delay between emails
            sleep(1);
        }
        
        $this->info("\n========================================");
        $this->info("Test Results:");
        $this->info("✅ Successful: $success");
        $this->error("❌ Failed: $failed");
        $this->info("========================================");
        
        if ($failed === 0) {
            $this->info("\nAll emails sent successfully!");
            $this->info("Check your inbox at: https://ethereal.email/messages");
            return 0;
        } else {
            $this->error("\nSome emails failed. Please check the errors above.");
            return 1;
        }
    }
}