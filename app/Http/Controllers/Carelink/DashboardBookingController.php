<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateTripRequestRequest;
use App\Http\Requests\UpdateTripRequestStatusRequest;
use App\Models\TripRequest;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
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
        $bookings = $this->filteredQuery($request)
            ->paginate($this->perPage($request))
            ->withQueryString()
            ->through(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

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
            'statuses' => TripRequest::STATUSES,
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

    public function showExport(TripRequest $booking): StreamedResponse
    {
        abort_if($booking->payment_status !== TripRequest::PAYMENT_STATUS_PAID, 404);

        $filename = "carelink-{$booking->booking_number}-".now()->format('Y-m-d').'.csv';

        return response()->streamDownload(function () use ($booking): void {
            $handle = fopen('php://output', 'w');

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
     * whitelisted sort applied.
     */
    private function filteredQuery(Request $request): Builder
    {
        return TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
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
            ->when($request->filled('status'), function (Builder $query) use ($request): void {
                $query->where('status', $request->string('status')->toString());
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
            'status' => $request->string('status')->toString() ?: null,
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
