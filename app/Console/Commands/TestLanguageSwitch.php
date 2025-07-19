<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\App;

class TestLanguageSwitch extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'test:language';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test language switching functionality';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Testing language switching...');
        
        // Test French
        App::setLocale('fr');
        $this->line('Current locale: ' . App::getLocale());
        $this->line('Translation test (FR): ' . __('Welcome'));
        
        // Test English
        App::setLocale('en');
        $this->line('Current locale: ' . App::getLocale());
        $this->line('Translation test (EN): ' . __('Welcome'));
        
        // Test translation files exist
        $frPath = lang_path('fr.json');
        $enPath = lang_path('en.json');
        
        $this->line('FR translation file exists: ' . (file_exists($frPath) ? 'Yes' : 'No'));
        $this->line('EN translation file exists: ' . (file_exists($enPath) ? 'Yes' : 'No'));
        
        if (file_exists($frPath)) {
            $frTranslations = json_decode(file_get_contents($frPath), true);
            $this->line('FR translations count: ' . count($frTranslations));
            $this->line('FR Welcome: ' . ($frTranslations['Welcome'] ?? 'Not found'));
        }
        
        if (file_exists($enPath)) {
            $enTranslations = json_decode(file_get_contents($enPath), true);
            $this->line('EN translations count: ' . count($enTranslations));
            $this->line('EN Welcome: ' . ($enTranslations['Welcome'] ?? 'Not found'));
        }
        
        $this->info('Language test completed!');
    }
}
