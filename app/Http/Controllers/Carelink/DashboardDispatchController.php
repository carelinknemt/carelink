<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\TripRequest;
use Inertia\Inertia;
use Inertia\Response;

class DashboardDispatchController extends Controller
{
    public function index(): Response
    {
        $bookings = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->orderBy('trip_date')
            ->orderBy('pickup_time')
            ->get()
            ->map(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

        $columns = collect(TripRequest::STATUSES)
            ->mapWithKeys(fn (string $status): array => [
                $status => $bookings->filter(fn (array $booking): bool => $booking['status'] === $status)->values(),
            ]);

        return Inertia::render('dashboard/dispatch', [
            'columns' => $columns,
            'statuses' => TripRequest::STATUSES,
        ]);
    }
}
