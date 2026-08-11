<?php

use App\Models\TripRequest;
use App\Models\User;

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('authenticated users can visit the dashboard', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $response = $this->get(route('dashboard'));
    $response->assertOk();
});

test('the dashboard shows booking stats and recent paid bookings', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'status' => TripRequest::STATUS_IN_TRANSIT,
        'input_price' => 120,
    ]);
    TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'status' => TripRequest::STATUS_COMPLETED,
        'input_price' => 80,
    ]);
    TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard')
            ->where('stats.total_paid', 2)
            ->where('stats.pending_dispatch', 0)
            ->where('stats.in_transit', 1)
            ->where('stats.completed', 1)
            ->has('recent_bookings', 2));
});
