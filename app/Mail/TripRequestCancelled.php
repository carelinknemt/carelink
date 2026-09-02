<?php

namespace App\Mail;

use App\Models\TripRequest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TripRequestCancelled extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public TripRequest $tripRequest, public ?string $reason = null) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "CareLink Trip Request Cancelled - {$this->tripRequest->booking_number}",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail.trip-request-cancelled',
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
