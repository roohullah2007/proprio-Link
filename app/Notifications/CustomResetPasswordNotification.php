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

        // Send the custom email
        try {
            Mail::to($notifiable->getEmailForPasswordReset())
                ->send(new CustomResetPasswordMail($notifiable, $resetUrl));
        } catch (\Exception $e) {
            \Log::error('Failed to send custom password reset email: ' . $e->getMessage());
        }

        // Return empty MailMessage to prevent Laravel from sending its default email
        return (new MailMessage)
            ->subject(__('Reset Password'))
            ->view('emails.empty', ['message' => 'Password reset email sent via custom mailer.']);
    }
}
