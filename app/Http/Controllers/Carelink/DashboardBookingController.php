<?php

namespace App\Http\Controllers\Carelink;

use App\Cms\BookingFee;
use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTripRequestRequest;
use App\Http\Requests\UpdateTripRequestStatusRequest;
use App\Mail\TripRequestCancelled;
use App\Models\PassengerBlacklist;
use App\Models\TripRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use RuntimeException;
use Stripe\Exception\ApiErrorException;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardBookingController extends Controller
{
    private const SORTABLE_COLUMNS = [
        'trip_date',
        'passenger_name',
        'input_price',
        'created_at',
    ];

    private const PER_PAGE_OPTIONS = [15, 25, 50, 100];

    private const SERVICE_TYPES = [
        'curb-to-curb',
        'door-to-door',
        'door-through-door',
        'person-to-person',
    ];

    public function index(Request $request): Response
    {
        $paginator = $this->filteredQuery($request)
            ->paginate($this->perPage($request))
            ->withQueryString();

        $trips = collect($paginator->items())->map(fn ($item) => $item);

        $blacklistMap = PassengerBlacklist::matchCollection($trips);

        $bookings = $paginator->through(function (TripRequest $trip) use ($blacklistMap): array {
            return $trip->managerSummary($blacklistMap[$trip->id] ?? null);
        });

        return Inertia::render('dashboard/bookings', [
            'bookings' => $bookings,
            'filters' => $this->filters($request),
            'statuses' => TripRequest::STATUSES,
            'service_types' => self::SERVICE_TYPES,
        ]);
    }

    public function show(TripRequest $booking): Response
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        return Inertia::render('dashboard/bookings/show', [
            'booking' => $booking,
            'statuses' => TripRequest::ASSIGNABLE_STATUSES,
            'booking_fee' => BookingFee::amountInDollarsFor($booking->transport_type),
            'blacklist' => PassengerBlacklist::matchFor($booking)
                ?->load('blacklister:id,name'),
        ]);
    }

    public function update(UpdateTripRequestRequest $request, TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $booking->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} details were updated.",
        ]);

        return back();
    }

    public function updateStatus(UpdateTripRequestStatusRequest $request, TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $booking->update(['status' => $request->validated()['status']]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} status changed to {$booking->status}.",
        ]);

        return back();
    }

    /**
     * Cancel a booking and refund the collected booking fee through Stripe.
     * The booking is only cancelled when the refund succeeds, so a customer
     * is never left with a cancelled trip and an un-refunded payment.
     */
    public function cancel(TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        if ($booking->status === TripRequest::STATUS_CANCELLED) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => "{$booking->booking_number} is already cancelled.",
            ]);

            return back();
        }

        if ($booking->status === TripRequest::STATUS_COMPLETED) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => "{$booking->booking_number} is completed and cannot be cancelled.",
            ]);

            return back();
        }

        $hasStripePayment = (bool) $booking->stripe_checkout_session_id;

        if ($hasStripePayment && ! $this->refundBookingFee($booking)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "{$booking->booking_number} could not be cancelled because refunding the booking fee failed. Please try again or contact support.",
            ]);

            return back();
        }

        $booking->update([
            'status' => TripRequest::STATUS_CANCELLED,
            'refunded_at' => $hasStripePayment ? now() : null,
        ]);

        if ($hasStripePayment) {
            $this->sendCancellationEmail($booking);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} was cancelled".($hasStripePayment ? ' and the booking fee was refunded' : '').'.',
        ]);

        return back();
    }

    /**
     * Notify the passenger that their booking was cancelled and the
     * booking fee refunded.
     */
    private function sendCancellationEmail(TripRequest $booking): void
    {
        if (! $booking->passenger_email) {
            return;
        }

        Mail::to($booking->passenger_email)->send(new TripRequestCancelled($booking));
    }

    /**
     * Refund the booking fee charged to the checkout session's payment
     * intent. Returns true when the refund was created (or there was
     * nothing to refund) and false when Stripe rejected it.
     */
    private function refundBookingFee(TripRequest $booking): bool
    {
        try {
            $session = Cashier::stripe()->checkout->sessions->retrieve($booking->stripe_checkout_session_id);

            if (! ($session->payment_intent ?? null)) {
                return true;
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

    public function showExport(TripRequest $booking): StreamedResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $filename = "carelink-{$booking->booking_number}-".now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($booking): void {
            $handle = fopen('php://output', 'w');

            if ($handle === false) {
                throw new RuntimeException('Could not open an output stream for the CSV export.');
            }

            fputcsv($handle, TripRequest::CSV_COLUMNS);
            fputcsv($handle, TripRequest::exportRow($booking));

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    public function export(Request $request): StreamedResponse
    {
        $filename = 'carelink-paid-bookings-'.now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($request): void {
            $handle = fopen('php://output', 'w');

            if ($handle === false) {
                throw new RuntimeException('Could not open an output stream for the CSV export.');
            }

            fputcsv($handle, TripRequest::CSV_COLUMNS);

            $this->filteredQuery($request)->each(function (TripRequest $tripRequest) use ($handle): void {
                fputcsv($handle, TripRequest::exportRow($tripRequest));
            });

            fclose($handle);
        }, $filename, ['Content-Type' => 'text/csv']);
    }

    /**
     * Paid bookings (the $30 booking fee has been processed), with
     * optional search, status, date range, service type filters and a
     * whitelisted sort applied. By default only bookings pending
     * dispatch are shown; the status filter reveals the rest.
     *
     * @return Builder<TripRequest>
     */
    private function filteredQuery(Request $request): Builder
    {
        $status = $request->string('status')->toString();

        $query = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID);

        if ($status !== TripRequest::STATUS_FILTER_ALL) {
            // No status filter defaults to bookings pending dispatch;
            // the '__all' sentinel reveals every status.
            $query->where('status', $status !== '' ? $status : TripRequest::STATUS_PENDING_DISPATCH);
        }

        return $query
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('booking_number', 'like', "%{$search}%")
                        ->orWhere('passenger_first_name', 'like', "%{$search}%")
                        ->orWhere('passenger_last_name', 'like', "%{$search}%")
                        ->orWhere('passenger_phone_number', 'like', "%{$search}%")
                        ->orWhere('passenger_email', 'like', "%{$search}%");
                });
            })
            ->when($request->filled('date_from'), function (Builder $query) use ($request): void {
                $query->whereDate('trip_date', '>=', $request->string('date_from')->toString());
            })
            ->when($request->filled('date_to'), function (Builder $query) use ($request): void {
                $query->whereDate('trip_date', '<=', $request->string('date_to')->toString());
            })
            ->when($request->filled('service_type'), function (Builder $query) use ($request): void {
                $query->where('service_type', $request->string('service_type')->toString());
            })
            ->orderByRaw($this->sortClause($request));
    }

    /**
     * @return array<string, string|null>
     */
    private function filters(Request $request): array
    {
        return [
            'search' => $request->string('search')->trim()->toString() ?: null,
            'status' => $request->string('status')->toString()
                ?: TripRequest::STATUS_PENDING_DISPATCH,
            'date_from' => $request->string('date_from')->toString() ?: null,
            'date_to' => $request->string('date_to')->toString() ?: null,
            'service_type' => $request->string('service_type')->toString() ?: null,
            'sort' => $request->string('sort')->toString() ?: null,
            'direction' => $request->string('direction')->toString() ?: null,
            'per_page' => (string) $this->perPage($request),
        ];
    }

    private function perPage(Request $request): int
    {
        $perPage = $request->integer('per_page');

        if (in_array($perPage, self::PER_PAGE_OPTIONS, true)) {
            return $perPage;
        }

        return $this->isMobileRequest($request) ? 25 : 15;
    }

    private function isMobileRequest(Request $request): bool
    {
        return (bool) preg_match(
            '/Android|iPhone|iPad|iPod|Mobile|Opera Mini|IEMobile/i',
            $request->userAgent() ?? '',
        );
    }

    /**
     * @return literal-string
     */
    private function sortClause(Request $request): string
    {
        $column = $request->string('sort')->toString();

        if (! in_array($column, self::SORTABLE_COLUMNS, true)) {
            return 'trip_date asc, created_at desc';
        }

        $direction = $request->string('direction')->toString() === 'desc' ? 'desc' : 'asc';

        if ($column === 'passenger_name') {
            return "passenger_first_name {$direction}, passenger_last_name {$direction}";
        }

        return "{$column} {$direction}, created_at desc";
    }
}
