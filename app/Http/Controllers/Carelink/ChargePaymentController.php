<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\BookingCharge;
use App\Models\TripRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Stripe\Exception\ApiErrorException;

class ChargePaymentController extends Controller
{
    /**
     * The public page a passenger reaches from the payment-link email. It
     * shows the amount due and opens the Stripe Checkout session; payment
     * state is reconciled here on return and polled via the status route.
     */
    public function show(BookingCharge $charge, Request $request): Response
    {
        $this->recordPaymentReturn($charge, $request);

        $booking = $charge->tripRequest;

        return Inertia::render('charges/pay', [
            'charge' => $this->chargeSummary($charge, $booking),
            'checkout_url' => $this->checkoutUrl($charge),
        ]);
    }

    /**
     * Poll-friendly payment state for a charge.
     */
    public function status(BookingCharge $charge): JsonResponse
    {
        return response()->json([
            'token' => $charge->token,
            'status' => $charge->status,
            'paid_at' => $charge->paid_at?->toIso8601String(),
        ]);
    }

    /**
     * The live checkout session URL for a pending charge, so the passenger
     * can pay from the public page, or null once the charge is paid.
     */
    private function checkoutUrl(BookingCharge $charge): ?string
    {
        if ($charge->status === BookingCharge::STATUS_PAID || ! $charge->stripe_checkout_session_id) {
            return null;
        }

        try {
            return Cashier::stripe()->checkout->sessions->retrieve($charge->stripe_checkout_session_id)->url;
        } catch (ApiErrorException $exception) {
            report($exception);

            return null;
        }
    }

    /**
     * Finalize payment state when the passenger returns from Stripe
     * Checkout. The checkout.session.completed webhook is the source of
     * truth for payments made in a tab that was closed before redirecting
     * back.
     */
    private function recordPaymentReturn(BookingCharge $charge, Request $request): void
    {
        if ($charge->status === BookingCharge::STATUS_PAID) {
            return;
        }

        $sessionId = $request->query('session_id');

        if ($sessionId && $sessionId === $charge->stripe_checkout_session_id) {
            try {
                $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

                if (($session->payment_status ?? null) === 'paid') {
                    $charge->update([
                        'status' => BookingCharge::STATUS_PAID,
                        'paid_at' => now(),
                    ]);

                    Inertia::flash('toast', [
                        'type' => 'success',
                        'message' => 'Your payment was processed. Thank you!',
                    ]);

                    return;
                }
            } catch (ApiErrorException $exception) {
                report($exception);
            }
        }

        if ($request->query('payment') === 'cancelled') {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'Payment was not completed. You can try again anytime by opening this link again.',
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function chargeSummary(BookingCharge $charge, TripRequest $booking): array
    {
        return [
            'token' => $charge->token,
            'status' => $charge->status,
            'amount_dollars' => '$'.$charge->amountInDollars(),
            'amount_cents' => $charge->amount_cents,
            'note' => $charge->note,
            'paid_at' => $charge->paid_at?->toIso8601String(),
            'booking_number' => $booking->booking_number,
            'passenger_first_name' => $booking->passenger_first_name,
            'passenger_last_name' => $booking->passenger_last_name,
        ];
    }
}
