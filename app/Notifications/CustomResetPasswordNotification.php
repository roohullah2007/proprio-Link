<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\CustomResetPasswordMail;
use Illuminate\Support\Facades\Mail;

class CustomResetPasswordNotification extends BaseResetPassword
{
    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $resetUrl = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        // Log email sending attempt
        \Log::info('Sending password reset email to: ' . $notifiable->getEmailForPasswordReset());

        // Send using Laravel's mail system directly through MailMessage
        return (new MailMessage)
            ->subject('Réinitialisation de votre mot de passe - Proprio Link')
            ->view('emails.auth.reset-password', [
                'user' => $notifiable,
                'resetUrl' => $resetUrl,
            ]);
    }
}
