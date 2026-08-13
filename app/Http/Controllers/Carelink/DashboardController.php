<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\TripRequest;
use Illuminate\Database\Eloquent\Collection;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $paid = TripRequest::where('payment_status', TripRequest::PAYMENT_STATUS_PAID);

        $stats = [
            'total_paid' => (clone $paid)->count(),
            'pending_dispatch' => (clone $paid)->where('status', TripRequest::STATUS_PENDING_DISPATCH)->count(),
            'in_transit' => (clone $paid)->where('status', TripRequest::STATUS_IN_TRANSIT)->count(),
            'completed' => (clone $paid)->where('status', TripRequest::STATUS_COMPLETED)->count(),
        ];

        $trends = $this->weeklyTrends();

        $todayTrips = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->whereDate('trip_date', today())
            ->orderBy('pickup_time')
            ->limit(20)
            ->get()
            ->map(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

        $recentBookings = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->orderByDesc('created_at')
            ->limit(4)
            ->get()
            ->map(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'trends' => $trends,
            'today_trips' => $todayTrips,
            'recent_bookings' => $recentBookings,
        ]);
    }

    /**
     * Delta between bookings created in the last 7 days and the 7 days
     * before that, per dashboard stat category. A positive number means
     * the current week is busier than the previous one.
     *
     * @return array<string, int>
     */
    private function weeklyTrends(): array
    {
        $bookings = TripRequest::where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->where('created_at', '>=', now()->subDays(14)->startOfDay())
            ->get(['status', 'created_at'])
            ->groupBy(fn (TripRequest $tripRequest): string => $tripRequest->created_at->gte(now()->subDays(7)) ? 'current' : 'previous');

        $current = $bookings->get('current', new Collection);
        $previous = $bookings->get('previous', new Collection);

        return [
            'total_paid' => $current->count() - $previous->count(),
            'pending_dispatch' => $current->where('status', TripRequest::STATUS_PENDING_DISPATCH)->count() - $previous->where('status', TripRequest::STATUS_PENDING_DISPATCH)->count(),
            'in_transit' => $current->where('status', TripRequest::STATUS_IN_TRANSIT)->count() - $previous->where('status', TripRequest::STATUS_IN_TRANSIT)->count(),
            'completed' => $current->where('status', TripRequest::STATUS_COMPLETED)->count() - $previous->where('status', TripRequest::STATUS_COMPLETED)->count(),
        ];
    }
}
