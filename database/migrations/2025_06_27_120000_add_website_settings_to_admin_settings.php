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
        // Insert website settings
        $settings = [
            [
                'key_name' => 'website_url',
                'value' => 'https://yourdomain.com',
                'description' => 'Main website URL for public pages',
                'category' => 'website'
            ],
            [
                'key_name' => 'website_menu_links',
                'value' => json_encode([
                    ['label' => 'Home', 'url' => 'https://yourdomain.com', 'external' => true],
                    ['label' => 'About', 'url' => 'https://yourdomain.com/about', 'external' => true],
                    ['label' => 'Services', 'url' => 'https://yourdomain.com/services', 'external' => true],
                    ['label' => 'Contact', 'url' => 'https://yourdomain.com/contact', 'external' => true],
                    ['label' => 'Properties', 'url' => '/properties/search', 'external' => false]
                ]),
                'description' => 'Website menu links in JSON format',
                'category' => 'website'
            ]
        ];

        foreach ($settings as $setting) {
            DB::table('admin_settings')->updateOrInsert(
                ['key_name' => $setting['key_name']],
                array_merge($setting, [
                    'created_at' => now(),
                    'updated_at' => now()
                ])
            );
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('admin_settings')->whereIn('key_name', [
            'website_url',
            'website_menu_links'
        ])->delete();
    }
};
