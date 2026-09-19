<?php

namespace App\Listeners;

use App\Mail\TripRequestPaymentConfirmed;
use App\Models\BookingCharge;
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
        $this->markPaymentPaid($event->payload);
    }

    /**
     * Mark a payment as paid when its checkout session completes. Sessions
     * for an additional booking charge carry a charge_id and update the
     * booking charge; every other session carries a booking_number and
     * updates the trip request's booking fee.
     *
     * @param  array<string, mixed>  $payload
     */
    private function markPaymentPaid(array $payload): void
    {
        if (($payload['type'] ?? null) !== 'checkout.session.completed') {
            return;
        }

        $session = $payload['data']['object'] ?? [];

        if (($session['payment_status'] ?? null) !== 'paid') {
            return;
        }

        $metadata = $session['metadata'] ?? [];

        if (isset($metadata['charge_id'])) {
            BookingCharge::query()
                ->whereKey($metadata['charge_id'])
                ->where('status', '!=', BookingCharge::STATUS_PAID)
                ->update([
                    'status' => BookingCharge::STATUS_PAID,
                    'paid_at' => now(),
                ]);

            return;
        }

        $bookingNumber = $metadata['booking_number'] ?? null;

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
