<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\UserAccountSuspendedMail;
use App\Mail\UserVerificationRevokedMail;
use App\Mail\UserAccountDeletedMail;

class TestAdminNotificationEmails extends Command
{
    protected $signature = 'email:test-admin-notifications {--to=}';
    protected $description = 'Test admin notification emails (suspend, revoke verification, delete)';

    public function handle()
    {
        $to = $this->option('to') ?: config('mail.admin_email', 'admin@proprio-link.fr');
        
        $this->info("Testing admin notification emails. Sending to: $to");
        $this->info("You can check all emails at: https://ethereal.email/messages");
        $this->info("Login with: darien79@ethereal.email / 1yjd16NHTnMFTEtVkN\n");
        
        // Create test users
        $agentUser = new User();
        $agentUser->first_name = 'John';
        $agentUser->last_name = 'Agent';
        $agentUser->email = $to;
        $agentUser->language = 'fr';
        $agentUser->role = 'agent';
        $agentUser->is_verified = true;
        
        $ownerUser = new User();
        $ownerUser->first_name = 'Marie';
        $ownerUser->last_name = 'Owner';
        $ownerUser->email = $to;
        $ownerUser->language = 'fr';
        $ownerUser->role = 'owner';
        $ownerUser->is_verified = true;
        
        // Test each email
        $emails = [
            'Account Suspension - Agent' => function() use ($to, $agentUser) {
                $reason = 'Activité suspecte détectée sur votre compte. Plusieurs tentatives de contournement des règles de la plateforme ont été observées.';
                Mail::to($to)->send(new UserAccountSuspendedMail($agentUser, $reason));
            },
            'Account Suspension - Owner' => function() use ($to, $ownerUser) {
                $reason = 'Annonces non conformes aux conditions d\'utilisation. Photos et descriptions ne correspondent pas aux critères de qualité requis.';
                Mail::to($to)->send(new UserAccountSuspendedMail($ownerUser, $reason));
            },
            'Verification Revoked - Agent' => function() use ($to, $agentUser) {
                $reason = 'Documents de vérification expirés ou non conformes. Veuillez fournir des documents à jour pour maintenir votre statut vérifié.';
                Mail::to($to)->send(new UserVerificationRevokedMail($agentUser, $reason));
            },
            'Verification Revoked - Owner' => function() use ($to, $ownerUser) {
                $reason = 'Informations de profil incohérentes avec les documents fournis. Une nouvelle vérification est nécessaire.';
                Mail::to($to)->send(new UserVerificationRevokedMail($ownerUser, $reason));
            },
            'Account Deletion - Agent' => function() use ($to, $agentUser) {
                $reason = 'Violations répétées des conditions d\'utilisation malgré les avertissements. Compte définitivement supprimé.';
                Mail::to($to)->send(new UserAccountDeletedMail($agentUser, $reason));
            },
            'Account Deletion - Owner' => function() use ($to, $ownerUser) {
                $reason = 'Compte inactif depuis plus de 12 mois et suppression demandée conformément à notre politique de rétention des données.';
                Mail::to($to)->send(new UserAccountDeletedMail($ownerUser, $reason));
            },
            'Account Suspension - No Reason' => function() use ($to, $agentUser) {
                Mail::to($to)->send(new UserAccountSuspendedMail($agentUser, ''));
            },
            'Verification Revoked - No Reason' => function() use ($to, $agentUser) {
                Mail::to($to)->send(new UserVerificationRevokedMail($agentUser, ''));
            },
            'Account Deletion - No Reason' => function() use ($to, $ownerUser) {
                Mail::to($to)->send(new UserAccountDeletedMail($ownerUser, ''));
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
                $this->error("Stack trace: " . $e->getTraceAsString());
                $failed++;
            }
            
            // Small delay between emails
            sleep(1);
        }
        
        $this->info("\n========================================");
        $this->info("Test Results for Admin Notification Emails:");
        $this->info("✅ Successful: $success");
        $this->error("❌ Failed: $failed");
        $this->info("========================================");
        
        if ($failed === 0) {
            $this->info("\n🎉 All admin notification emails sent successfully!");
            $this->info("📧 Check your inbox at: https://ethereal.email/messages");
            $this->info("🔐 Login: darien79@ethereal.email / 1yjd16NHTnMFTEtVkN");
            return 0;
        } else {
            $this->error("\nSome emails failed. Please check the errors above.");
            return 1;
        }
    }
}