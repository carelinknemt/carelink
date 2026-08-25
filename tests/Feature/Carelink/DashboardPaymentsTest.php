<?php

use App\Models\TripRequest;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('payments page lists only paid checkout sessions by default', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_1',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => null,
        'transport_type' => 'wheelchair',
    ]);
    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_2',
        'payment_status' => TripRequest::PAYMENT_STATUS_PENDING,
        'paid_at' => null,
        'refunded_at' => null,
        'transport_type' => 'wheelchair',
    ]);
    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_3',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => now(),
        'transport_type' => 'wheelchair',
    ]);
    TripRequest::factory()->create(); // never reached checkout

    $this->get(route('dashboard.payments'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/payments')
            ->has('payments.data', 2)
            ->where('summary.total_payments', 3)
            ->where('summary.collected', 30)
            ->where('summary.pending', 30)
            ->where('summary.refunded', 30)
            ->where('filters.status', TripRequest::PAYMENT_STATUS_PAID));
});

test('payments page can list all sessions when requested', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_1',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => null,
    ]);
    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_2',
        'payment_status' => TripRequest::PAYMENT_STATUS_PENDING,
        'paid_at' => null,
        'refunded_at' => null,
    ]);

    $this->get(route('dashboard.payments', ['status' => '__all']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page->has('payments.data', 2));
});

test('payments can be filtered by status and searched', function () {
    $user = User::factory()->admin()->create();
    $this->actingAs($user);

    TripRequest::factory()->create([
        'booking_number' => 'CL-NEMT-000001',
        'passenger_first_name' => 'Jane',
        'stripe_checkout_session_id' => 'cs_test_1',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => null,
    ]);
    TripRequest::factory()->create([
        'booking_number' => 'CL-NEMT-000002',
        'passenger_first_name' => 'John',
        'stripe_checkout_session_id' => 'cs_test_2',
        'payment_status' => TripRequest::PAYMENT_STATUS_PENDING,
        'paid_at' => null,
        'refunded_at' => null,
    ]);

    $this->get(route('dashboard.payments', ['status' => 'PENDING']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('payments.data', 1)
            ->where('payments.data.0.payment_status', TripRequest::PAYMENT_STATUS_PENDING));

    $this->get(route('dashboard.payments', ['search' => 'Jane']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('payments.data', 1)
            ->where('payments.data.0.booking_number', 'CL-NEMT-000001'));
});
