<?php

namespace App\Listeners;

use App\Mail\TripRequestPaymentConfirmed;
use App\Models\TripRequest;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Events\WebhookHandled;
use Laravel\Cashier\Events\WebhookReceived;

class StripeEventListener
{
    /**
     * Handle received and handled Stripe webhooks.
     */
    public function handle(WebhookReceived|WebhookHandled $event): void
    {
        $this->markBookingPaid($event->payload);
    }

    /**
     * Mark a trip request as paid when its checkout session completes.
     *
     * @param  array<string, mixed>  $payload
     */
    private function markBookingPaid(array $payload): void
    {
        if (($payload['type'] ?? null) !== 'checkout.session.completed') {
            return;
        }

        $session = $payload['data']['object'] ?? [];

        if (($session['payment_status'] ?? null) !== 'paid') {
            return;
        }

        $bookingNumber = $session['metadata']['booking_number'] ?? null;

        if (! $bookingNumber) {
            return;
        }

        $updated = TripRequest::query()
            ->where('booking_number', $bookingNumber)
            ->where('payment_status', '!=', TripRequest::PAYMENT_STATUS_PAID)
            ->update([
                'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
            ]);

        if ($updated > 0) {
            $tripRequest = TripRequest::where('booking_number', $bookingNumber)->first();

            if ($tripRequest?->passenger_email) {
                Mail::to($tripRequest->passenger_email)->send(new TripRequestPaymentConfirmed($tripRequest));
            }
        }
    }
}
