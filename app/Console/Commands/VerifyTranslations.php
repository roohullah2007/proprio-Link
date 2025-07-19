<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class VerifyTranslations extends Command
{
    protected $signature = 'translations:verify';
    protected $description = 'Verify translation files are properly loaded';

    public function handle()
    {
        $this->info('Verifying translation files...');

        // Check French translations
        $frPath = lang_path('fr.json');
        if (File::exists($frPath)) {
            $frTranslations = json_decode(File::get($frPath), true);
            $this->info("French translations loaded: " . count($frTranslations) . " keys");
        } else {
            $this->error("French translation file not found at: $frPath");
        }

        // Check English translations
        $enPath = lang_path('en.json');
        if (File::exists($enPath)) {
            $enTranslations = json_decode(File::get($enPath), true);
            $this->info("English translations loaded: " . count($enTranslations) . " keys");
        } else {
            $this->error("English translation file not found at: $enPath");
        }

        // Test specific admin keys
        $adminKeys = [
            'Tableau de bord admin',
            'Propriétés en attente',
            'Propriétés publiées',
            'Propriétés rejetées',
            'Utilisateurs totaux',
            'Actions rapides',
            'Modérer les propriétés',
            'Voir tout'
        ];

        $this->info("\nTesting admin translation keys:");
        foreach ($adminKeys as $key) {
            $frExists = isset($frTranslations[$key]);
            $enExists = isset($enTranslations[$key]);
            
            $status = $frExists && $enExists ? '✓' : '✗';
            $this->line("$status \"$key\" - FR: " . ($frExists ? '✓' : '✗') . " EN: " . ($enExists ? '✓' : '✗'));
            
            if ($enExists) {
                $this->line("   EN: \"{$enTranslations[$key]}\"");
            }
        }

        // Test app locale setting
        $this->info("\nCurrent app locale: " . app()->getLocale());
        
        return 0;
    }
}
