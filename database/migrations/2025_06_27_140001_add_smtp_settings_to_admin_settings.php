<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add SMTP settings to admin_settings table
        $smtpSettings = [
            [
                'key_name' => 'smtp_enabled',
                'value' => 'false',
                'description' => 'Enable custom SMTP configuration',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_host',
                'value' => '',
                'description' => 'SMTP host server (e.g., smtp.gmail.com)',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_port',
                'value' => '587',
                'description' => 'SMTP port number (587 for TLS, 465 for SSL)',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_username',
                'value' => '',
                'description' => 'SMTP username (usually your email address)',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_password',
                'value' => '',
                'description' => 'SMTP password (encrypted)',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_encryption',
                'value' => 'tls',
                'description' => 'SMTP encryption type (tls/ssl)',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_from_address',
                'value' => '',
                'description' => 'From email address for outgoing emails',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'key_name' => 'smtp_from_name',
                'value' => 'Propio',
                'description' => 'From name for outgoing emails',
                'category' => 'email',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($smtpSettings as $setting) {
            DB::table('admin_settings')->updateOrInsert(
                ['key_name' => $setting['key_name']],
                $setting
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $smtpKeys = [
            'smtp_enabled',
            'smtp_host',
            'smtp_port',
            'smtp_username',
            'smtp_password',
            'smtp_encryption',
            'smtp_from_address',
            'smtp_from_name',
        ];

        DB::table('admin_settings')->whereIn('key_name', $smtpKeys)->delete();
    }
};
