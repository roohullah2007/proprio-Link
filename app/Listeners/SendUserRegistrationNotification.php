<?php

namespace App\Listeners;

use App\Mail\AdminUserRegisteredNotification;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class SendUserRegistrationNotification implements ShouldQueue
{
    use InteractsWithQueue;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(Registered $event): void
    {
        try {
            // Get the registered user
            $user = $event->user;
            
            // Get user's preferred language (default to French)
            $locale = $user->language ?? 'fr';
            
            // Get all admin users to send notifications
            $admins = User::where('type_utilisateur', User::TYPE_ADMIN)->get();
            
            if ($admins->isEmpty()) {
                Log::warning('No admin users found to send registration notification', [
                    'user_id' => $user->id,
                    'user_email' => $user->email
                ]);
                return;
            }
            
            // Send email to each admin
            foreach ($admins as $admin) {
                $adminLocale = $admin->language ?? $locale;
                
                Mail::to($admin->email)->send(
                    new AdminUserRegisteredNotification($user, $adminLocale)
                );
                
                Log::info('Admin registration notification sent', [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'admin_id' => $admin->id,
                    'admin_email' => $admin->email,
                    'locale' => $adminLocale
                ]);
            }
            
        } catch (\Exception $e) {
            Log::error('Failed to send admin registration notification', [
                'user_id' => $event->user->id ?? null,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
