<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\TripRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Stripe\Exception\ApiErrorException;

class DashboardPaymentController extends Controller
{
    private const PER_PAGE = 15;

    private const STATUS_FILTER_ALL = '__all';

    private const STATUS_REFUNDED = 'refunded';

    /**
     * Bookings that reached the Stripe checkout (a payment record exists),
     * with collected/refunded fee totals. Refund actions come through
     * dashboard.payments.refund.
     */
    public function index(Request $request): Response
    {
        $status = $request->string('status')->toString();

        $query = TripRequest::query()->whereNotNull('stripe_checkout_session_id');

        if ($status === self::STATUS_REFUNDED) {
            $query->whereNotNull('refunded_at');
        } elseif ($status !== '' && $status !== self::STATUS_FILTER_ALL) {
            // An empty status means no filter: every payment record is shown.
            $query->where('payment_status', $status);
        }

        $payments = $query
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('booking_number', 'like', "%{$search}%")
                        ->orWhere('passenger_first_name', 'like', "%{$search}%")
                        ->orWhere('passenger_last_name', 'like', "%{$search}%")
                        ->orWhere('passenger_email', 'like', "%{$search}%");
                });
            })
            ->latest('created_at')
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (TripRequest $tripRequest): array => $this->paymentSummary($tripRequest));

        return Inertia::render('dashboard/payments', [
            'payments' => $payments,
            'summary' => $this->summary(),
            'filters' => [
                'search' => $request->string('search')->trim()->toString() ?: null,
                'status' => $status ?: self::STATUS_FILTER_ALL,
            ],
        ]);
    }

    /**
     * Refund the booking fee without touching the booking's status or
     * dispatch state; the trip itself stays active.
     */
    public function refund(TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);
        abort_if($booking->refunded_at !== null, 404);

        if ($this->refundBookingFee($booking)) {
            $booking->update(['refunded_at' => now()]);

            Inertia::flash('toast', [
                'type' => 'success',
                'message' => "The {$booking->booking_number} booking fee was refunded.",
            ]);

            return back();
        }

        Inertia::flash('toast', [
            'type' => 'error',
            'message' => "The {$booking->booking_number} booking fee could not be refunded. Please try again or contact support.",
        ]);

        return back();
    }

    /**
     * @return array<string, int>
     */
    private function summary(): array
    {
        $fee = BookController::BOOKING_FEE_AMOUNT / 100;

        $counts = TripRequest::query()
            ->whereNotNull('stripe_checkout_session_id')
            ->selectRaw('count(*) as total')
            ->selectRaw("sum(case when payment_status = 'PAID' then 1 else 0 end) as paid")
            ->selectRaw('sum(case when refunded_at is not null then 1 else 0 end) as refunded')
            ->first();

        $total = (int) ($counts?->total ?? 0);
        $paid = (int) ($counts?->paid ?? 0);
        $refunded = (int) ($counts?->refunded ?? 0);

        return [
            'total_payments' => $total,
            'collected' => max(0, $paid - $refunded) * $fee,
            'pending' => ($total - $paid) * $fee,
            'refunded' => $refunded * $fee,
        ];
    }

    /**
     * Refund the booking fee charged to the checkout session's payment
     * intent. Returns true when the refund was created and false when
     * Stripe rejected it.
     */
    private function refundBookingFee(TripRequest $booking): bool
    {
        try {
            $session = Cashier::stripe()->checkout->sessions->retrieve($booking->stripe_checkout_session_id);

            if (! ($session->payment_intent ?? null)) {
                return false;
            }

            Cashier::stripe()->refunds->create([
                'payment_intent' => $session->payment_intent,
                'metadata' => ['booking_number' => $booking->booking_number],
            ]);

            return true;
        } catch (ApiErrorException $exception) {
            report($exception);

            return false;
        }
    }

    /**
     * @return array<string, mixed>
     */
    private function paymentSummary(TripRequest $tripRequest): array
    {
        return [
            'id' => $tripRequest->id,
            'booking_number' => $tripRequest->booking_number,
            'passenger_name' => trim($tripRequest->passenger_first_name.' '.$tripRequest->passenger_last_name),
            'passenger_email' => $tripRequest->passenger_email,
            'trip_date' => $tripRequest->trip_date?->toDateString(),
            'input_price' => $tripRequest->input_price,
            'payment_status' => $tripRequest->payment_status,
            'amount' => BookController::BOOKING_FEE_AMOUNT / 100,
            'paid_at' => $tripRequest->paid_at?->toIso8601String(),
            'refunded_at' => $tripRequest->refunded_at?->toIso8601String(),
            'stripe_checkout_session_id' => $tripRequest->stripe_checkout_session_id,
        ];
    }
}
