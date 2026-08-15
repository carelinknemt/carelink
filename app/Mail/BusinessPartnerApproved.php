<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BusinessPartnerApproved extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public string $companyName, public string $contactName) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Your CareLink Partnership Has Been Approved',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.business-partner-approved',
        );
    }

    /**
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
