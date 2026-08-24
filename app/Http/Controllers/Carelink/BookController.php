<?php

namespace App\Http\Controllers\Carelink;

use App\Cms\BookingFee;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTripRequestRequest;
use App\Mail\TripRequestPaymentConfirmed;
use App\Models\Service;
use App\Models\TripRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Checkout;
use Stripe\Exception\ApiErrorException;

class BookController extends Controller
{
    /**
     * Backwards-compatible default for the booking fee; the live amount and
     * label come from the booking_fee_settings CMS section via BookingFee.
     */
    public const BOOKING_FEE_AMOUNT = BookingFee::DEFAULT_AMOUNT_CENTS;

    public function index(Request $request): Response
    {
        $booking = null;

        if ($bookingNumber = $request->query('booking')) {
            $booking = TripRequest::where('booking_number', $bookingNumber)->first();

            if ($booking) {
                $this->recordPaymentReturn($booking, $request);
            } else {
                Inertia::flash('toast', [
                    'type' => 'warning',
                    'message' => 'We could not find that booking number. Please contact dispatch for assistance.',
                ]);
            }
        }

        return Inertia::render('book', [
            'services' => $this->servicesForBookPage(),
            'booking_fee' => $this->bookingFeeProp(),
            'booking' => $booking ? $this->bookingSummary($booking) : null,
        ]);
    }

    public function store(StoreTripRequestRequest $request): Response|RedirectResponse
    {
        $validated = $request->validated();

        $tripRequest = TripRequest::create([
            ...$validated,
            'booking_number' => $this->generateBookingNumber(),
            'status' => TripRequest::STATUS_PENDING_DISPATCH,
            'input_price' => BookingFee::amountInCentsFor($validated['transport_type']) / 100,
        ]);

        $tripRequest->trip_request_csv_path = $this->exportToCsv($tripRequest);
        $tripRequest->save();

        try {
            $checkout = $this->createBookingCheckout($tripRequest);

            $tripRequest->update(['stripe_checkout_session_id' => $checkout->id]);

            return Inertia::render('book', [
                'services' => $this->servicesForBookPage(),
                'booking_fee' => $this->bookingFeeProp(),
                'booking' => $this->bookingSummary($tripRequest),
                'checkout' => [
                    'url' => $checkout->url,
                    'booking_number' => $tripRequest->booking_number,
                ],
            ]);
        } catch (ApiErrorException $exception) {
            report($exception);

            Inertia::flash('booking', $this->bookingSummary($tripRequest));
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => "Trip request {$tripRequest->booking_number} submitted, but we could not process the ".BookingFee::dollarsFor($tripRequest->transport_type).' right now. Our team will contact you to arrange payment.',
            ]);

            return back();
        }
    }

    /**
     * Show the public order tracking page for a trip request.
     */
    public function show(string $booking): HttpResponse|RedirectResponse
    {
        $tripRequest = TripRequest::where('booking_number', $booking)->first();

        if (! $tripRequest) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'We could not find that booking. Please check the link or contact dispatch for assistance.',
            ]);

            return redirect()->route('book');
        }

        return Inertia::render('bookings/track', [
            'booking' => $this->bookingSummary($tripRequest),
            'booking_fee' => $this->bookingFeeProp(),
            'checkout_url' => $this->checkoutUrl($tripRequest),
        ])
            ->toResponse(request())
            ->header('X-Robots-Tag', 'noindex, nofollow');
    }

    /**
     * Poll-friendly payment state for a trip request.
     */
    public function status(string $booking): JsonResponse
    {
        $tripRequest = TripRequest::where('booking_number', $booking)->first();

        abort_if(! $tripRequest, 404);

        return response()->json([
            'booking_number' => $tripRequest->booking_number,
            'status' => $tripRequest->status,
            'payment_status' => $tripRequest->payment_status,
            'paid_at' => $tripRequest->paid_at?->toIso8601String(),
        ]);
    }

    private function servicesForBookPage(): array
    {
        return Service::query()
            ->where('active', true)
            ->get(['title', 'base_rate', 'mileage_rate'])
            ->mapWithKeys(fn (Service $service) => [
                $service->title => [
                    'base_rate' => (float) $service->base_rate,
                    'mileage_rate' => (float) $service->mileage_rate,
                ],
            ])
            ->all();
    }

    /**
     * The checkout session URL for an unpaid booking, so the customer can
     * resume the payment later, or null when there is nothing to pay.
     */
    private function checkoutUrl(TripRequest $tripRequest): ?string
    {
        if ($tripRequest->payment_status === TripRequest::PAYMENT_STATUS_PAID) {
            return null;
        }

        if (! $tripRequest->stripe_checkout_session_id) {
            return null;
        }

        try {
            return Cashier::stripe()->checkout->sessions->retrieve($tripRequest->stripe_checkout_session_id)->url;
        } catch (ApiErrorException $exception) {
            report($exception);

            return null;
        }
    }

    /**
     * Start a Stripe Checkout session for the $30 non-refundable booking fee.
     */
    private function createBookingCheckout(TripRequest $tripRequest): Checkout
    {
        return Checkout::guest()->create([
            [
                'price_data' => [
                    'currency' => config('cashier.currency', 'usd'),
                    'unit_amount' => BookingFee::amountInCentsFor($tripRequest->transport_type),
                    'product_data' => [
                        'name' => BookingFee::label(),
                        'description' => "Non-refundable booking fee for trip request {$tripRequest->booking_number}",
                    ],
                ],
                'quantity' => 1,
            ],
        ], [
            'success_url' => route('book').'?booking='.$tripRequest->booking_number.'&session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('book').'?booking='.$tripRequest->booking_number.'&payment=cancelled',
            'metadata' => ['booking_number' => $tripRequest->booking_number],
            'customer_email' => $tripRequest->passenger_email,
            'expires_at' => now()->addMinutes(30)->timestamp,
        ]);
    }

    /**
     * Finalize payment state when the customer returns from Stripe Checkout.
     * The checkout.session.completed webhook is the source of truth for
     * payments made in a tab that was closed before redirecting back.
     */
    private function recordPaymentReturn(TripRequest $tripRequest, Request $request): void
    {
        if ($tripRequest->payment_status === TripRequest::PAYMENT_STATUS_PAID) {
            return;
        }

        $sessionId = $request->query('session_id');

        if ($sessionId && $sessionId === $tripRequest->stripe_checkout_session_id) {
            try {
                $session = Cashier::stripe()->checkout->sessions->retrieve($sessionId);

                if (($session->payment_status ?? null) === 'paid') {
                    $tripRequest->update([
                        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
                        'paid_at' => now(),
                    ]);

                    $this->sendPaymentConfirmationEmail($tripRequest);

                    Inertia::flash('toast', [
                        'type' => 'success',
                        'message' => "Your booking fee for {$tripRequest->booking_number} was processed. Thank you!",
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
                'message' => "Payment for {$tripRequest->booking_number} was not completed. Your trip request is still received and our team will contact you to arrange payment.",
            ]);
        }
    }

    private function sendPaymentConfirmationEmail(TripRequest $tripRequest): void
    {
        if (! $tripRequest->passenger_email) {
            return;
        }

        Mail::to($tripRequest->passenger_email)->send(new TripRequestPaymentConfirmed($tripRequest));
    }

    private function bookingSummary(TripRequest $tripRequest): array
    {
        return [
            'booking_number' => $tripRequest->booking_number,
            'passenger_name' => $tripRequest->passenger_first_name.' '.$tripRequest->passenger_last_name,
            'trip_date' => $tripRequest->trip_date->toDateString(),
            'pickup_address' => $tripRequest->pickup_address,
            'dropoff_address' => $tripRequest->dropoff_address,
            'transport_type' => $tripRequest->transport_type,
            'input_price' => $tripRequest->input_price,
            'status' => $tripRequest->status,
            'payment_status' => $tripRequest->payment_status,
            'paid_at' => $tripRequest->paid_at?->toIso8601String(),
        ];
    }

    /**
     * Fee amounts for the book form, keyed by transport type so the shown
     * fee matches the selected vehicle: ambulatory trips pay the ambulatory
     * fee, every other transport type pays the standard fee.
     *
     * @return array{standard: array{amount_cents: int, amount_dollars: string, label: string, dollars: string}, ambulatory: array{amount_cents: int, amount_dollars: string, label: string, dollars: string}}
     */
    private function bookingFeeProp(): array
    {
        return [
            'standard' => $this->feeProp(BookingFee::amountInCents()),
            'ambulatory' => $this->feeProp(BookingFee::ambulatoryAmountInCents()),
        ];
    }

    /**
     * @return array{amount_cents: int, amount_dollars: string, label: string, dollars: string}
     */
    private function feeProp(int $amountCents): array
    {
        return [
            'amount_cents' => $amountCents,
            'amount_dollars' => number_format($amountCents / 100, 2),
            'label' => BookingFee::label(),
            'dollars' => '$'.number_format($amountCents / 100, 2),
        ];
    }

    private function generateBookingNumber(): string
    {
        do {
            $number = 'CL-NEMT-'.str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
        } while (TripRequest::where('booking_number', $number)->exists());

        return $number;
    }

    private function exportToCsv(TripRequest $tripRequest): string
    {
        $path = 'trip-requests/'.$tripRequest->booking_number.'.csv';
        $handle = fopen('php://temp', 'w');

        fputcsv($handle, TripRequest::CSV_COLUMNS);

        fputcsv($handle, TripRequest::exportRow($tripRequest));

        rewind($handle);
        Storage::disk('local')->put($path, stream_get_contents($handle));
        fclose($handle);

        return $path;
    }
}
