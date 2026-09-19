<?php

namespace App\Http\Controllers\Carelink;

use App\Cms\BookingFee;
use App\Http\Controllers\Controller;
use App\Http\Requests\CancelTripRequestRequest;
use App\Http\Requests\StoreBookingChargeRequest;
use App\Http\Requests\UpdateTripRequestRequest;
use App\Http\Requests\UpdateTripRequestStatusRequest;
use App\Mail\BookingChargeDue;
use App\Mail\TripRequestCancelled;
use App\Models\BookingCharge;
use App\Models\PassengerBlacklist;
use App\Models\TripRequest;
use App\Models\TripRequestAudit;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Cashier\Cashier;
use Laravel\Cashier\Checkout;
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

        $blacklistEntry = PassengerBlacklist::matchFor($booking)
            ?->load('blacklister:id,name');

        return Inertia::render('dashboard/bookings/show', [
            'booking' => $booking,
            'statuses' => TripRequest::DROPDOWN_STATUSES,
            'booking_fee' => BookingFee::amountInDollarsFor($booking->transport_type),
            'charges' => $this->chargesForShow($booking),
            'audits' => $booking->audits()->limit(20)->get()->map(fn (TripRequestAudit $audit): array => [
                'id' => $audit->id,
                'user_name' => $audit->user_name,
                'role' => $audit->role,
                'action' => $audit->action,
                'from_value' => $audit->from_value,
                'to_value' => $audit->to_value,
                'reason' => $audit->reason,
                'created_at' => $audit->created_at->toIso8601String(),
            ]),
            'blacklist' => $blacklistEntry ? [
                'id' => $blacklistEntry->id,
                'reason' => $blacklistEntry->reason,
                'by' => $blacklistEntry->blacklister->name ?? 'Unknown',
                'at' => $blacklistEntry->created_at->toIso8601String(),
            ] : null,
        ]);
    }

    public function update(UpdateTripRequestRequest $request, TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $data = $request->validated();
        unset($data['status']);

        $booking->update($data);

        $this->recordAudit($booking, $request->user(), TripRequestAudit::ACTION_UPDATED, null, null, null);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} details were updated.",
        ]);

        return back();
    }

    public function updateStatus(UpdateTripRequestStatusRequest $request, TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $from = $booking->status;
        $to = $request->validated()['status'];

        $booking->update(['status' => $to]);

        $this->recordAudit($booking, $request->user(), TripRequestAudit::ACTION_STATUS_CHANGED, $from, $to, null);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} status changed to {$booking->status}.",
        ]);

        return back();
    }

    /**
     * Cancel a booking and refund the collected booking fee through Stripe.
     * The booking is only cancelled when the refund succeeds, so a customer
     * is never left with a cancelled trip and an un-refunded payment. The
     * reason for cancellation is required and recorded alongside who
     * cancelled it.
     */
    public function cancel(CancelTripRequestRequest $request, TripRequest $booking): RedirectResponse
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

        $reason = $request->validated()['reason'];
        $hasStripePayment = (bool) $booking->stripe_checkout_session_id;

        if ($hasStripePayment && ! $this->refundBookingFee($booking)) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "{$booking->booking_number} could not be cancelled because refunding the booking fee failed. Please try again or contact support.",
            ]);

            return back();
        }

        $from = $booking->status;
        $actor = $request->user();

        $booking->update([
            'status' => TripRequest::STATUS_CANCELLED,
            'refunded_at' => $hasStripePayment ? now() : null,
            'cancellation_reason' => $reason,
            'cancelled_by_name' => $actor?->name,
            'cancelled_at' => now(),
        ]);

        $this->recordAudit($booking, $request->user(), TripRequestAudit::ACTION_CANCELLED, $from, TripRequest::STATUS_CANCELLED, $reason);

        if ($hasStripePayment) {
            $this->sendCancellationEmail($booking, $reason);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$booking->booking_number} was cancelled".($hasStripePayment ? ' and the booking fee was refunded' : '').'.',
        ]);

        return back();
    }

    /**
     * Bill a passenger for an additional manual amount on a paid booking.
     * Creates a pending booking charge with its own Stripe Checkout session
     * (valid 7 days), emails the passenger a payment link, and exposes the
     * ready-to-send SMS message so dispatch can copy it.
     */
    public function storeCharge(StoreBookingChargeRequest $request, TripRequest $booking): RedirectResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $charge = BookingCharge::create([
            'trip_request_id' => $booking->id,
            'amount_cents' => (int) round((float) $request->validated('amount') * 100),
            'token' => Str::random(40),
            'note' => $request->validated('note') ?: null,
            'created_by' => $request->user()?->getAuthIdentifier(),
        ]);

        try {
            $session = $this->createChargeCheckout($charge)->asStripeCheckoutSession();
            $charge->update(['stripe_checkout_session_id' => $session->id]);
        } catch (ApiErrorException $exception) {
            $charge->delete();
            report($exception);

            Inertia::flash('toast', [
                'type' => 'error',
                'message' => "The payment link for {$booking->booking_number} could not be created right now. Please try again.",
            ]);

            return back();
        }

        $this->sendChargeEmail($charge);

        $this->recordAudit(
            $booking,
            $request->user(),
            TripRequestAudit::ACTION_CHARGE_CREATED,
            null,
            '$'.$charge->amountInDollars(),
            $charge->note,
        );

        Inertia::flash('charge_sms', [
            'amount_dollars' => $charge->amountInDollars(),
            'booking_number' => $booking->booking_number,
            'passenger_phone_number' => $booking->passenger_phone_number,
            'email_sent_to' => $booking->passenger_email,
            'payment_url' => route('charges.pay', $charge),
            'sms_message' => $charge->paymentSmsMessage(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $booking->passenger_email
                ? "A payment link for \${$charge->amountInDollars()} was emailed to {$booking->passenger_email}."
                : "Charge of \${$charge->amountInDollars()} created, but {$booking->booking_number} has no passenger email on file.",
        ]);

        return back();
    }

    /**
     * Notify the passenger that their booking was cancelled and the
     * booking fee refunded.
     */
    private function sendCancellationEmail(TripRequest $booking, ?string $reason): void
    {
        if (! $booking->passenger_email) {
            return;
        }

        Mail::to($booking->passenger_email)
            ->send(new TripRequestCancelled($booking, $reason));
    }

    /**
     * Start a Stripe Checkout session for an additional booking charge,
     * valid for 7 days so the passenger is not racing a short link.
     */
    private function createChargeCheckout(BookingCharge $charge): Checkout
    {
        $booking = $charge->tripRequest;

        return Checkout::guest()->create([
            [
                'price_data' => [
                    'currency' => config('cashier.currency', 'usd'),
                    'unit_amount' => $charge->amount_cents,
                    'product_data' => [
                        'name' => 'CareLink Balance Due',
                        'description' => "Remaining balance for trip request {$booking->booking_number}",
                    ],
                ],
                'quantity' => 1,
            ],
        ], [
            'success_url' => route('charges.pay', $charge).'?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('charges.pay', $charge).'?payment=cancelled',
            'metadata' => [
                'booking_number' => $booking->booking_number,
                'charge_id' => (string) $charge->id,
            ],
            'customer_email' => $booking->passenger_email,
            'expires_at' => now()->addDays(7)->timestamp,
        ]);
    }

    /**
     * Email the passenger the balance-due payment link. Sends only when the
     * booking has an email on file and never fails a charge over mail.
     */
    private function sendChargeEmail(BookingCharge $charge): void
    {
        if (! $charge->tripRequest->passenger_email) {
            return;
        }

        Mail::to($charge->tripRequest->passenger_email)->send(new BookingChargeDue($charge));

        $charge->update(['email_sent_at' => now()]);
    }

    /**
     * @return list<array<string, mixed>>
     */
    private function chargesForShow(TripRequest $booking): array
    {
        return array_values($booking->charges()->get()->map(fn (BookingCharge $charge): array => [
            'id' => $charge->id,
            'amount_cents' => $charge->amount_cents,
            'amount_dollars' => '$'.$charge->amountInDollars(),
            'status' => $charge->status,
            'note' => $charge->note,
            'created_at' => $charge->created_at?->toIso8601String(),
            'email_sent_at' => $charge->email_sent_at?->toIso8601String(),
            'paid_at' => $charge->paid_at?->toIso8601String(),
            'payment_url' => route('charges.pay', $charge),
            'sms_message' => $charge->paymentSmsMessage(),
        ])->all());
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

    /**
     * Record who changed a booking and what changed. The actor's name and
     * role are snapshotted at write time so the history survives even if
     * the user is later renamed or deleted.
     */
    private function recordAudit(TripRequest $booking, ?User $user, string $action, ?string $from, ?string $to, ?string $reason): void
    {
        $booking->audits()->create([
            'user_id' => $user?->getAuthIdentifier(),
            'user_name' => $user->name ?? 'Unknown',
            'role' => $user->role ?? 'unknown',
            'action' => $action,
            'from_value' => $from,
            'to_value' => $to,
            'reason' => $reason,
        ]);
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
