<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\EmailSetting;
use App\Services\EmailConfigService;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminEmailSettingsController extends Controller
{
    /**
     * Display email settings
     */
    public function index(): Response
    {
        return Inertia::render('Admin/EmailSettings', [
            'settings' => EmailConfigService::getConfigForDisplay(),
            'lastTestResult' => session('email_test_result'),
        ]);
    }

    /**
     * Update SMTP settings
     */
    public function updateSmtp(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'smtp_host' => 'required|string|max:255',
            'smtp_port' => 'required|integer|min:1|max:65535',
            'smtp_username' => 'nullable|string|max:255',
            'smtp_password' => 'nullable|string|max:255',
            'smtp_encryption' => ['nullable', Rule::in(['tls', 'ssl', 'null'])],
            'mail_from_address' => 'required|email|max:255',
            'mail_from_name' => 'required|string|max:255',
            'smtp_enabled' => 'boolean',
        ]);

        // Update SMTP settings
        EmailSetting::set('smtp_host', $validated['smtp_host'], 'string', 'Serveur SMTP');
        EmailSetting::set('smtp_port', $validated['smtp_port'], 'string', 'Port SMTP');
        EmailSetting::set('smtp_username', $validated['smtp_username'], 'encrypted', 'Nom d\'utilisateur SMTP');
        
        // Only update password if provided
        if (!empty($validated['smtp_password'])) {
            EmailSetting::set('smtp_password', $validated['smtp_password'], 'encrypted', 'Mot de passe SMTP');
        }
        
        EmailSetting::set('smtp_encryption', $validated['smtp_encryption'] === 'null' ? null : $validated['smtp_encryption'], 'string', 'Chiffrement SMTP');
        EmailSetting::set('mail_from_address', $validated['mail_from_address'], 'string', 'Adresse email d\'expédition');
        EmailSetting::set('mail_from_name', $validated['mail_from_name'], 'string', 'Nom d\'expédition');
        EmailSetting::set('smtp_enabled', $validated['smtp_enabled'] ?? false, 'boolean', 'Activer l\'envoi d\'emails');

        // Clear cache and apply new settings
        EmailSetting::clearCache();
        EmailConfigService::applySettings();

        return redirect()->route('admin.email-settings')
            ->with('success', 'Paramètres SMTP mis à jour avec succès.');
    }

    /**
     * Update admin notification emails
     */
    public function updateNotificationEmails(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'admin_emails' => 'required|array|min:1',
            'admin_emails.*' => 'required|email|max:255',
        ], [
            'admin_emails.required' => 'Au moins une adresse email est requise.',
            'admin_emails.min' => 'Au moins une adresse email est requise.',
            'admin_emails.*.required' => 'Toutes les adresses email sont requises.',
            'admin_emails.*.email' => 'Toutes les adresses doivent être des emails valides.',
        ]);

        // Remove duplicates and empty values
        $emails = array_unique(array_filter($validated['admin_emails']));

        EmailSetting::set('admin_notification_emails', $emails, 'json', 'Emails des administrateurs pour les notifications');
        EmailSetting::clearCache();

        return redirect()->route('admin.email-settings')
            ->with('success', 'Emails de notification mis à jour avec succès.');
    }

    /**
     * Test email configuration
     */
    public function testEmail(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'test_email' => 'required|email',
        ]);

        $result = EmailConfigService::testConfiguration($validated['test_email']);

        if ($result['success']) {
            return redirect()->route('admin.email-settings')
                ->with('success', $result['message'])
                ->with('email_test_result', $result);
        } else {
            return redirect()->route('admin.email-settings')
                ->with('error', $result['message'])
                ->with('email_test_result', $result);
        }
    }

    /**
     * Update website URL setting
     */
    public function updateWebsiteUrl(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'website_url' => 'required|url|max:255',
        ]);

        EmailSetting::set('website_url', $validated['website_url'], 'string', 'URL du site web affiché dans les emails');
        EmailSetting::clearCache();

        return redirect()->route('admin.email-settings')
            ->with('success', 'URL du site web mise à jour avec succès.');
    }

    /**
     * Send test admin notification
     */
    public function testAdminNotification(): RedirectResponse
    {
        try {
            $adminEmails = EmailConfigService::getAdminEmails();
            
            if (empty($adminEmails)) {
                return redirect()->route('admin.email-settings')
                    ->with('error', 'Aucun email d\'administrateur configuré.');
            }

            $mailable = new \App\Mail\TestAdminNotification();
            $success = EmailConfigService::sendAdminNotification($mailable);

            if ($success) {
                $emailList = implode(', ', $adminEmails);
                return redirect()->route('admin.email-settings')
                    ->with('success', "Notification de test envoyée aux administrateurs: {$emailList}");
            } else {
                return redirect()->route('admin.email-settings')
                    ->with('error', 'Erreur lors de l\'envoi de la notification de test.');
            }
        } catch (\Exception $e) {
            return redirect()->route('admin.email-settings')
                ->with('error', 'Erreur: ' . $e->getMessage());
        }
    }
}
