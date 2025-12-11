<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Event;
use Illuminate\Mail\Events\MessageSending;
use Illuminate\Http\Request;
use Illuminate\Cache\RateLimiting\Limit;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);

        // Configure rate limiting for API routes
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->ip());
        });

        // Configure rate limiting for WordPress API
        RateLimiter::for('wordpress', function (Request $request) {
            return Limit::perMinute(120)->by($request->ip());
        });

        // Log when emails are sent for debugging
        Event::listen(MessageSending::class, function (MessageSending $event) {
            $message = $event->message;
            $recipients = [];
            
            try {
                // Get recipients from headers
                if (method_exists($message, 'getHeaders')) {
                    $headers = $message->getHeaders();
                    if ($headers->has('To')) {
                        $toHeader = $headers->get('To');
                        if (method_exists($toHeader, 'getAddresses')) {
                            foreach ($toHeader->getAddresses() as $address) {
                                $recipients[] = $address->getAddress();
                            }
                        }
                    }
                }
            } catch (Exception $e) {
                \Log::error('Error getting email recipients: ' . $e->getMessage());
            }
            
            $recipientsList = empty($recipients) ? 'none' : implode(', ', $recipients);
            \Log::info('Email sent: ' . $message->getSubject() . ' to: ' . $recipientsList);
        });
    }
}
