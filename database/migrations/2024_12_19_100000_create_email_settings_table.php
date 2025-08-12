<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::create('email_settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, boolean, encrypted
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // Insert default settings
        $defaultSettings = [
            [
                'key' => 'smtp_host',
                'value' => env('MAIL_HOST', 'sandbox.smtp.mailtrap.io'),
                'type' => 'string',
                'description' => 'Serveur SMTP'
            ],
            [
                'key' => 'smtp_port',
                'value' => env('MAIL_PORT', '2525'),
                'type' => 'string',
                'description' => 'Port SMTP'
            ],
            [
                'key' => 'smtp_username',
                'value' => env('MAIL_USERNAME', ''),
                'type' => 'encrypted',
                'description' => 'Nom d\'utilisateur SMTP'
            ],
            [
                'key' => 'smtp_password',
                'value' => env('MAIL_PASSWORD', ''),
                'type' => 'encrypted',
                'description' => 'Mot de passe SMTP'
            ],
            [
                'key' => 'smtp_encryption',
                'value' => env('MAIL_ENCRYPTION', 'tls'),
                'type' => 'string',
                'description' => 'Chiffrement SMTP (tls/ssl/null)'
            ],
            [
                'key' => 'mail_from_address',
                'value' => env('MAIL_FROM_ADDRESS', 'noreply@proprio-link.fr'),
                'type' => 'string',
                'description' => 'Adresse email d\'expédition'
            ],
            [
                'key' => 'mail_from_name',
                'value' => env('MAIL_FROM_NAME', 'Proprio Link'),
                'type' => 'string',
                'description' => 'Nom d\'expédition'
            ],
            [
                'key' => 'admin_notification_emails',
                'value' => json_encode([env('MAIL_ADMIN_EMAIL', 'admin@proprio-link.fr')]),
                'type' => 'json',
                'description' => 'Emails des administrateurs pour les notifications'
            ],
            [
                'key' => 'smtp_enabled',
                'value' => 'true',
                'type' => 'boolean',
                'description' => 'Activer l\'envoi d\'emails'
            ]
        ];

        foreach ($defaultSettings as $setting) {
            DB::table('email_settings')->insert($setting + ['created_at' => now(), 'updated_at' => now()]);
        }
    }

    public function down()
    {
        Schema::dropIfExists('email_settings');
    }
};
