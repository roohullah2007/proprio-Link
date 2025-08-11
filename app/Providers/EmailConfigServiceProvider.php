<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\EmailConfigService;

class EmailConfigServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Apply email settings on every request (including console commands)
        try {
            EmailConfigService::applySettings();
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::warning('Failed to apply email settings: ' . $e->getMessage());
        }
    }
}
