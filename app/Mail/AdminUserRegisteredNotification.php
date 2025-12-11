<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class AdminUserRegisteredNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;
    public $locale;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, $locale = 'fr')
    {
        $this->user = $user;
        $this->locale = $locale;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = $this->locale === 'en' 
            ? 'New User Registration - ' . $this->user->prenom . ' ' . $this->user->nom
            : 'Nouvelle inscription utilisateur - ' . $this->user->prenom . ' ' . $this->user->nom;

        return Envelope::create()
            ->subject($subject)
            ->from(config('mail.from.address'), config('mail.from.name'));
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return Content::create()
            ->view('emails.admin.user-registered')
            ->with([
                'user' => $this->user,
                'locale' => $this->locale,
                'loginUrl' => route('login'),
                'adminDashboardUrl' => route('admin.dashboard'),
                'userManagementUrl' => route('admin.users'),
            ]);
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
