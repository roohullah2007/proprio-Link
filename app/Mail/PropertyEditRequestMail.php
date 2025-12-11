<?php

namespace App\Mail;

use App\Models\Property;
use App\Models\PropertyEditRequest;
use App\Models\EmailSetting;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class PropertyEditRequestMail extends Mailable
{
    use SerializesModels;

    public Property $property;
    
    /**
     * Prevent email from being queued
     */
    public $tries = null;
    public PropertyEditRequest $editRequest;

    /**
     * Create a new message instance.
     */
    public function __construct(Property $property, PropertyEditRequest $editRequest)
    {
        $this->property = $property;
        $this->editRequest = $editRequest;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subject = 'Demande de modification pour votre propriété - ' . $this->property->adresse_complete;
            
        return new Envelope(
            subject: $subject,
            from: new Address(
                EmailSetting::get('mail_from_address', 'noreply@proprio-link.fr'),
                EmailSetting::get('mail_from_name', 'Proprio Link')
            )
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $user = $this->property->proprietaire;
        $viewName = $user->language === 'en' 
            ? 'emails.property-edit-request-en' 
            : 'emails.property-edit-request';
            
        return new Content(
            view: $viewName,
            with: [
                'property' => $this->property,
                'editRequest' => $this->editRequest,
                'propertyUrl' => route('properties.edit', $this->property->id),
            ],
        );
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
