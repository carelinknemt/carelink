<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\TripRequest;
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

        $recentBookings = TripRequest::query()
            ->where('payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn (TripRequest $tripRequest): array => $tripRequest->managerSummary());

        return Inertia::render('dashboard', [
            'stats' => $stats,
            'recent_bookings' => $recentBookings,
        ]);
    }
}
