<?php

use App\Models\TripRequest;
use App\Models\User;

test('the dashboard shows stats and today trips', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $today = now()->startOfDay();
    $today->setTime(7, 0);

    $todayPending = paidBooking([
        'status' => TripRequest::STATUS_PENDING_DISPATCH,
        'trip_date' => $today->toDateString(),
        'pickup_time' => '07:00 AM',
    ]);

    $todayCompleted = paidBooking([
        'status' => TripRequest::STATUS_COMPLETED,
        'trip_date' => $today->toDateString(),
        'pickup_time' => '09:00 AM',
    ]);

    $nextWeek = paidBooking([
        'status' => TripRequest::STATUS_PENDING_DISPATCH,
        'trip_date' => now()->addDays(5)->toDateString(),
    ]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('stats.total_paid', 3)
            ->where('stats.pending_dispatch', 2)
            ->where('stats.completed', 1)
            ->where('today_trips.0.booking_number', $todayPending->booking_number)
            ->where('today_trips.1.booking_number', $todayCompleted->booking_number)
            ->has('recent_bookings', 3));
});

test('the analytics page aggregates paid bookings over the selected window', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $completed = paidBooking([
        'status' => TripRequest::STATUS_COMPLETED,
        'service_type' => 'door-to-door',
        'trip_date' => now()->subDays(2)->toDateString(),
        'pickup_time' => '07:30 AM',
        'pickup_address' => '1420 Harrison Ave, Eureka, CA',
        'input_price' => 100,
        'paid_at' => now()->subDays(2),
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Doe',
        'transport_type' => 'wheelchair',
    ]);

    $pending = paidBooking([
        'status' => TripRequest::STATUS_PENDING_DISPATCH,
        'service_type' => 'curb-to-curb',
        'trip_date' => now()->toDateString(),
        'pickup_time' => '07:30 AM',
        'pickup_address' => '1420 Harrison Ave, Eureka, CA',
        'input_price' => 80,
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Doe',
        'transport_type' => 'wheelchair',
    ]);

    $this->get(route('dashboard.analytics', ['days' => 7]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/analytics')
            ->where('days', 7)
            ->where('summary.bookings', 2)
            ->where('summary.revenue', 60)
            ->where('summary.avg_trip_price', 90)
            ->where('summary.completed_rate', 50)
            ->where('statuses', fn ($statuses) => collect($statuses)
                ->contains(fn ($row) => $row['label'] === 'COMPLETED' && $row['count'] === 1))
            ->where('repeat_passengers', fn ($passengers) => collect($passengers)
                ->contains(fn ($row) => $row['trips'] === 2)));
});

test('the analytics page defaults to a 30 day window and rejects invalid periods', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    paidBooking();

    $this->get(route('dashboard.analytics'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('days', 30)
            ->has('daily'));

    $this->get(route('dashboard.analytics', ['days' => 400]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('days', 30));
});
