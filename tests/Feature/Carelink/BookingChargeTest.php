<?php

use App\Mail\BookingChargeDue;
use App\Models\BookingCharge;
use App\Models\TripRequest;
use App\Models\TripRequestAudit;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\StripeClient;
use Tests\Support\FakeStripeClient;

function paidBookingForCharge(array $attributes = []): TripRequest
{
    return TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        ...$attributes,
    ]);
}

function fakeStripeClientForCharge(FakeStripeClient $fake): FakeStripeClient
{
    app()->bind(StripeClient::class, fn () => $fake);

    return $fake;
}

function chargeCheckoutSessionCompletedPayload(BookingCharge $charge): array
{
    return [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'payment_status' => 'paid',
                'metadata' => ['charge_id' => (string) $charge->id],
            ],
        ],
    ];
}

test('a dispatcher can bill a paid booking for an additional charge', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();

    $this->from(route('dashboard.bookings.show', $booking))
        ->post(route('dashboard.bookings.charges.store', $booking), [
            'amount' => 55,
            'note' => 'Overnight wait surcharge',
        ])
        ->assertRedirect();

    $charge = $booking->charges()->first();

    expect($charge)
        ->not->toBeNull()
        ->amount_cents->toBe(5500)
        ->status->toBe(BookingCharge::STATUS_PENDING)
        ->stripe_checkout_session_id->toBe('cs_test_fake')
        ->token->not->toBeNull()
        ->note->toBe('Overnight wait surcharge')
        ->email_sent_at->not->toBeNull();

    Mail::assertSent(BookingChargeDue::class, fn ($mail) => $mail->hasTo($booking->passenger_email));
});

test('adding a charge validates the amount', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => 0,
    ])->assertSessionHasErrors('amount');

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => '',
    ])->assertSessionHasErrors('amount');

    expect(BookingCharge::count())->toBe(0);
});

test('a guest is redirected to login when adding a charge', function () {
    $booking = paidBookingForCharge();

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => 25,
    ])->assertRedirect(route('login'));
});

test('the charge checkout session expires within Stripe 24-hour cap', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);
    $fake = fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => 55,
    ])->assertRedirect();

    $created = $fake->checkout->sessions->created;
    expect($created)->toHaveCount(1);

    $expiresAt = $created[0]['expires_at'];
    expect($expiresAt)
        ->toBeInt()
        ->toBeGreaterThan(now()->timestamp)
        ->toBeLessThan(now()->addHours(24)->timestamp);
});

test('a charge cannot be added to a booking that has not been paid', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = TripRequest::factory()->create();

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => 25,
    ])->assertNotFound();

    expect(BookingCharge::count())->toBe(0);
});

test('creating a charge records an audit entry', function () {
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();

    $this->post(route('dashboard.bookings.charges.store', $booking), [
        'amount' => 42,
        'note' => 'Added luggage allowance',
    ])->assertRedirect();

    $audit = $booking->audits()->first();

    expect($audit)
        ->not->toBeNull()
        ->action->toBe(TripRequestAudit::ACTION_CHARGE_CREATED)
        ->from_value->toBeNull()
        ->to_value->toBe('$42.00')
        ->reason->toBe('Added luggage allowance');
});

test('a completed stripe checkout marks a pending charge as paid', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForCharge();
    $charge = BookingCharge::factory()->for($booking)->create();

    event(new WebhookReceived(chargeCheckoutSessionCompletedPayload($charge)));

    expect($charge->fresh())
        ->status->toBe(BookingCharge::STATUS_PAID)
        ->paid_at->not->toBeNull();
});

test('a completed stripe checkout for an already paid charge is a no-op', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForCharge();
    $charge = BookingCharge::factory()->for($booking)->paid()->create();
    $paidAt = $charge->paid_at;

    event(new WebhookReceived(chargeCheckoutSessionCompletedPayload($charge)));

    expect($charge->fresh())
        ->status->toBe(BookingCharge::STATUS_PAID)
        ->paid_at->toEqual($paidAt);
});

test('the public pay page shows a pending charge with its checkout link', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();
    $charge = BookingCharge::factory()->for($booking)->create([
        'stripe_checkout_session_id' => 'cs_test_fake',
    ]);

    $this->get(route('charges.pay', $charge))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('charges/pay')
            ->where('charge.status', BookingCharge::STATUS_PENDING)
            ->where('checkout_url', 'https://checkout.stripe.com/c/pay/cs_test_fake'));
});

test('the public pay page returns 404 for an unknown charge token', function () {
    $this->get(route('charges.pay', ['charge' => 'missing-token']))
        ->assertNotFound();
});

test('the charge status endpoint reports the payment state', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForCharge();
    $pending = BookingCharge::factory()->for($booking)->create();
    $paid = BookingCharge::factory()->for($booking)->paid()->create();

    $this->getJson(route('charges.status', $pending))
        ->assertOk()
        ->assertJson([
            'status' => BookingCharge::STATUS_PENDING,
            'paid_at' => null,
        ]);

    $this->getJson(route('charges.status', $paid))
        ->assertOk()
        ->assertJson([
            'status' => BookingCharge::STATUS_PAID,
            'paid_at' => $paid->paid_at->toIso8601String(),
        ]);
});

test('the charge status endpoint returns 404 for an unknown charge token', function () {
    $this->getJson(route('charges.status', ['charge' => 'missing-token']))
        ->assertNotFound();
});

test('returning from a paid stripe checkout records the charge as paid', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();
    $charge = BookingCharge::factory()->for($booking)->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->get(route('charges.pay', [
        'charge' => $charge->token,
        'session_id' => 'cs_test_abc',
    ]))->assertOk();

    expect($charge->fresh())
        ->status->toBe(BookingCharge::STATUS_PAID)
        ->paid_at->not->toBeNull();
});

test('returning with a mismatched session id does not mark the charge as paid', function () {
    Mail::fake();
    $user = User::factory()->create();
    $this->actingAs($user);
    fakeStripeClientForCharge(new FakeStripeClient);

    $booking = paidBookingForCharge();
    $charge = BookingCharge::factory()->for($booking)->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);

    $this->get(route('charges.pay', [
        'charge' => $charge->token,
        'session_id' => 'cs_test_other',
    ]))->assertOk();

    expect($charge->fresh())
        ->status->toBe(BookingCharge::STATUS_PENDING)
        ->paid_at->toBeNull();
});
