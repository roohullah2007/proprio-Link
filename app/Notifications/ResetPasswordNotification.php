<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends BaseResetPassword
{
    use Queueable;

    /**
     * The password reset token.
     *
     * @var string
     */
    public $token;

    /**
     * Create a new notification instance.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $locale = $notifiable->language ?? app()->getLocale();
        
        if (static::$toMailCallback) {
            return call_user_func(static::$toMailCallback, $notifiable, $this->token);
        }

        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        if ($locale === 'en') {
            return $this->buildEnglishMail($url, $notifiable);
        } else {
            return $this->buildFrenchMail($url, $notifiable);
        }
    }

    /**
     * Build the English version of the mail.
     */
    protected function buildEnglishMail($url, $notifiable)
    {
        return (new MailMessage)
            ->subject('Reset Your Password - Proprio Link')
            ->view('emails.auth.reset-password-en', [
                'user' => $notifiable,
                'url' => $url,
                'count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
            ]);
    }

    /**
     * Build the French version of the mail.
     */
    protected function buildFrenchMail($url, $notifiable)
    {
        return (new MailMessage)
            ->subject('Réinitialiser Votre Mot de Passe - Proprio Link')
            ->view('emails.auth.reset-password-fr', [
                'user' => $notifiable,
                'url' => $url,
                'count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
            ]);
    }
}
