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
    public function index(Request $request): Response
    {
        $bookings = $this->filteredQuery($request)
            ->paginate(15)
            ->withQueryString()
            ->through(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

        return Inertia::render('dashboard/bookings', [
            'bookings' => $bookings,
            'filters' => $request->only(['search', 'status', 'date']),
            'statuses' => TripRequest::STATUSES,
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
     * Paid bookings (the $30 booking fee has been processed), sorted by
     * trip date with optional search, trip date, and status filters applied.
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
            ->when($request->filled('date'), function (Builder $query) use ($request): void {
                $query->whereDate('trip_date', $request->string('date')->toString());
            })
            ->orderBy('trip_date')
            ->orderByDesc('created_at');
    }
}
