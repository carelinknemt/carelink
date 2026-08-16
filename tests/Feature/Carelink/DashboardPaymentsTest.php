<?php

use App\Models\TripRequest;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Stripe\StripeClient;
use Tests\Support\FakeStripeClient;

function fakeStripePaymentsClient(FakeStripeClient $fake): FakeStripeClient
{
    app()->bind(StripeClient::class, fn () => $fake);

    return $fake;
}

test('payments page lists checkout sessions with fee totals', function () {
    $user = User::factory()->create();
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
    TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_3',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => now(),
    ]);
    TripRequest::factory()->create(); // never reached checkout

    $this->get(route('dashboard.payments'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/payments')
            ->has('payments.data', 3)
            ->where('summary.total_payments', 3)
            ->where('summary.collected', 30)
            ->where('summary.pending', 30)
            ->where('summary.refunded', 30)
            ->where('filters.status', '__all'));
});

test('payments can be filtered by status and searched', function () {
    $user = User::factory()->create();
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

test('refunding a booking fee records the refund and keeps the booking active', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $stripe = fakeStripePaymentsClient(new FakeStripeClient);

    $booking = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_fake',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'status' => TripRequest::STATUS_PENDING_DISPATCH,
        'refunded_at' => null,
    ]);

    $this->post(route('dashboard.payments.refund', $booking))
        ->assertRedirect();

    expect($stripe->refunds->created[0]['payment_intent'])->toBe('pi_test_fake');

    $booking->refresh();

    expect($booking)
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PAID)
        ->refunded_at->not->toBeNull()
        ->status->toBe(TripRequest::STATUS_PENDING_DISPATCH);
});

test('pending bookings cannot be refunded', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_1',
        'payment_status' => TripRequest::PAYMENT_STATUS_PENDING,
        'refunded_at' => null,
    ]);

    $this->post(route('dashboard.payments.refund', $booking))
        ->assertNotFound();

    expect($booking->fresh()->refunded_at)->toBeNull();
});

test('a booking fee is only refunded once', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    fakeStripePaymentsClient(new FakeStripeClient);

    $booking = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_1',
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'refunded_at' => now(),
    ]);

    $this->post(route('dashboard.payments.refund', $booking))
        ->assertNotFound();
});
