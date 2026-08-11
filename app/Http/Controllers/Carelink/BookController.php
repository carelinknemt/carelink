<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTripRequestRequest;
use App\Models\Service;
use App\Models\TripRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Checkout;
use Stripe\Exception\ApiErrorException;

class BookController extends Controller
{
    private const BOOKING_FEE_AMOUNT = 3000;

    private const BOOKING_FEE_LABEL = 'CareLink Booking Fee';

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
            'services' => Service::query()
                ->where('active', true)
                ->get(['title', 'base_rate', 'mileage_rate'])
                ->mapWithKeys(fn (Service $service) => [
                    $service->title => [
                        'base_rate' => (float) $service->base_rate,
                        'mileage_rate' => (float) $service->mileage_rate,
                    ],
                ]),
            'booking' => $booking ? $this->bookingSummary($booking) : null,
        ]);
    }

    public function store(StoreTripRequestRequest $request): RedirectResponse
    {
        $tripRequest = TripRequest::create([
            ...$request->validated(),
            'booking_number' => $this->generateBookingNumber(),
            'status' => TripRequest::STATUS_PENDING_DISPATCH,
        ]);

        $tripRequest->trip_request_csv_path = $this->exportToCsv($tripRequest);
        $tripRequest->save();

        try {
            $checkout = $this->createBookingCheckout($tripRequest);

            $tripRequest->update(['stripe_checkout_session_id' => $checkout->id]);

            return $checkout->redirect();
        } catch (ApiErrorException $exception) {
            report($exception);

            Inertia::flash('booking', $this->bookingSummary($tripRequest));
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => "Trip request {$tripRequest->booking_number} submitted, but we could not process the {$this->bookingFeeLabel()} right now. Our team will contact you to arrange payment.",
            ]);

            return back();
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
                    'unit_amount' => self::BOOKING_FEE_AMOUNT,
                    'product_data' => [
                        'name' => self::BOOKING_FEE_LABEL,
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

    private function bookingSummary(TripRequest $tripRequest): array
    {
        return [
            'booking_number' => $tripRequest->booking_number,
            'passenger_name' => $tripRequest->passenger_first_name.' '.$tripRequest->passenger_last_name,
            'trip_date' => $tripRequest->trip_date->toDateString(),
            'pickup_address' => $tripRequest->pickup_address,
            'dropoff_address' => $tripRequest->dropoff_address,
            'input_price' => $tripRequest->input_price,
            'status' => $tripRequest->status,
            'payment_status' => $tripRequest->payment_status,
        ];
    }

    private function bookingFeeLabel(): string
    {
        return '$'.number_format(self::BOOKING_FEE_AMOUNT / 100, 2);
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

        fputcsv($handle, array_map(
            fn (string $column) => $this->csvValue($tripRequest, $column),
            TripRequest::CSV_COLUMNS,
        ));

        rewind($handle);
        Storage::disk('local')->put($path, stream_get_contents($handle));
        fclose($handle);

        return $path;
    }

    private function csvValue(TripRequest $tripRequest, string $column): string
    {
        if ($column === 'id') {
            return '';
        }

        $value = $tripRequest->getAttribute($column);

        if (is_bool($value)) {
            return $value ? 'TRUE' : 'FALSE';
        }

        if ($value instanceof Carbon) {
            return $value->toDateString();
        }

        return (string) $value;
    }
}