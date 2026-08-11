<?php

namespace App\Listeners;

use App\Models\TripRequest;
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

        TripRequest::query()
            ->where('booking_number', $bookingNumber)
            ->where('payment_status', '!=', TripRequest::PAYMENT_STATUS_PAID)
            ->update([
                'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
                'paid_at' => now(),
            ]);
    }
}
