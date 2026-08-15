<?php

use App\Mail\TripRequestPaymentConfirmed;
use App\Models\TripRequest;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Laravel\Cashier\Events\WebhookReceived;
use Stripe\Exception\ApiConnectionException;
use Stripe\StripeClient;
use Tests\Support\FakeStripeClient;

$validPayload = [
    'passenger_first_name' => 'Jane',
    'passenger_last_name' => 'Doe',
    'payer' => 'Private Pay',
    'transport_type' => 'wheelchair',
    'service_type' => 'door-to-door',
    'will_call' => false,
    'trip_date' => today()->toDateString(),
    'input_price' => 85.5,
    'pickup_address' => '1420 Harrison Ave, Eureka, CA',
    'pickup_time' => '07:00 AM',
    'dropoff_address' => 'St. Joseph Hospital, Eureka, CA',
    'pickup_latitude' => 40.8020714,
    'pickup_longitude' => -124.1637275,
    'dropoff_latitude' => 40.7868351,
    'dropoff_longitude' => -124.1608896,
    'passenger_email' => 'jane@example.com',
    'passenger_phone_number' => '+1 707-555-0192',
    'passenger_is_bariatric' => true,
    'oxygen_required' => true,
    'oxygen_liters_per_min' => 3,
];

function fakeStripeClient(FakeStripeClient $fake): FakeStripeClient
{
    app()->bind(StripeClient::class, fn () => $fake);

    return $fake;
}

function checkoutSessionCompletedPayload(TripRequest $tripRequest, string $paymentStatus = 'paid'): array
{
    return [
        'type' => 'checkout.session.completed',
        'data' => [
            'object' => [
                'payment_status' => $paymentStatus,
                'metadata' => ['booking_number' => $tripRequest->booking_number],
            ],
        ],
    ];
}

test('submitting a trip request charges the 30 dollar booking fee through stripe checkout', function () use ($validPayload) {
    Storage::fake('local');
    $stripe = fakeStripeClient(new FakeStripeClient);

    $this->post(route('bookings.store'), $validPayload)
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('checkout', fn ($checkout) => $checkout
                ->where('url', 'https://checkout.stripe.com/c/pay/cs_test_fake')
                ->where('booking_number', TripRequest::first()->booking_number)
            )
            ->where('booking.payment_status', TripRequest::PAYMENT_STATUS_PENDING));

    $tripRequest = TripRequest::first();

    expect($tripRequest)
        ->not->toBeNull()
        ->stripe_checkout_session_id->toBe('cs_test_fake')
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PENDING)
        ->paid_at->toBeNull();

    $lineItem = $stripe->checkout->sessions->created[0]['line_items'][0];

    expect($lineItem['price_data'])
        ->currency->toBe('usd')
        ->unit_amount->toBe(3000)
        ->product_data->name->toBe('CareLink Booking Fee')
        ->product_data->description->toContain($tripRequest->booking_number);

    $session = $stripe->checkout->sessions->created[0];

    expect($session)
        ->metadata->booking_number->toBe($tripRequest->booking_number)
        ->customer_email->toBe('jane@example.com')
        ->success_url->toContain($tripRequest->booking_number)
        ->success_url->toContain('session_id={CHECKOUT_SESSION_ID}')
        ->cancel_url->toContain('payment=cancelled');
});

test('a trip request is still created when the booking fee checkout fails', function () use ($validPayload) {
    Storage::fake('local');
    $stripe = fakeStripeClient(new FakeStripeClient);
    $stripe->checkout->sessions->createException = new ApiConnectionException('boom');

    $this->post(route('bookings.store'), $validPayload)->assertRedirect();

    expect(TripRequest::first())
        ->not->toBeNull()
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PENDING);
});

test('the booking fee is marked paid when stripe completes the checkout session', function () {
    Mail::fake();
    $tripRequest = TripRequest::factory()->create();

    event(new WebhookReceived(checkoutSessionCompletedPayload($tripRequest)));

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PAID)
        ->paid_at->not->toBeNull();

    Mail::assertSent(
        TripRequestPaymentConfirmed::class,
        fn ($mail) => $mail->hasTo($tripRequest->passenger_email)
            && $mail->assertSeeInHtml(route('bookings.show', ['booking' => $tripRequest->booking_number])),
    );
});

test('an already paid booking does not receive a second confirmation email', function () {
    Mail::fake();
    $tripRequest = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
    ]);

    event(new WebhookReceived(checkoutSessionCompletedPayload($tripRequest)));

    Mail::assertNotSent(TripRequestPaymentConfirmed::class);
});

test('a booking without an email is marked paid without sending a confirmation email', function () {
    Mail::fake();
    $tripRequest = TripRequest::factory()->create([
        'passenger_email' => null,
    ]);

    event(new WebhookReceived(checkoutSessionCompletedPayload($tripRequest)));

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PAID);

    Mail::assertNotSent(TripRequestPaymentConfirmed::class);
});

test('unpaid or unrelated stripe webhooks do not mark the booking as paid', function () {
    Mail::fake();
    $tripRequest = TripRequest::factory()->create();

    event(new WebhookReceived(checkoutSessionCompletedPayload($tripRequest, 'unpaid')));
    event(new WebhookReceived([
        'type' => 'charge.succeeded',
        'data' => ['object' => ['metadata' => ['booking_number' => $tripRequest->booking_number]]],
    ]));

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PENDING)
        ->paid_at->toBeNull();
});

test('a webhook without booking metadata does not mark anything as paid', function () {
    $tripRequest = TripRequest::factory()->create();

    event(new WebhookReceived([
        'type' => 'checkout.session.completed',
        'data' => ['object' => ['payment_status' => 'paid']],
    ]));

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PENDING);
});

test('returning from a paid stripe checkout records the payment', function () {
    Mail::fake();
    $tripRequest = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);
    fakeStripeClient(new FakeStripeClient);

    $this->get(route('book', [
        'booking' => $tripRequest->booking_number,
        'session_id' => 'cs_test_abc',
    ]))->assertOk();

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PAID)
        ->paid_at->not->toBeNull();

    Mail::assertSent(TripRequestPaymentConfirmed::class, fn ($mail) => $mail->hasTo($tripRequest->passenger_email));
});

test('returning with a mismatched session id does not record payment', function () {
    $tripRequest = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);
    fakeStripeClient(new FakeStripeClient);

    $this->get(route('book', [
        'booking' => $tripRequest->booking_number,
        'session_id' => 'cs_test_other',
    ]))->assertOk();

    expect($tripRequest->fresh())
        ->payment_status->toBe(TripRequest::PAYMENT_STATUS_PENDING);
});

test('the booking status endpoint reports the payment state', function () {
    $pending = TripRequest::factory()->create();
    $paid = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
    ]);

    $this->getJson(route('bookings.status', ['booking' => $pending->booking_number]))
        ->assertOk()
        ->assertJson([
            'booking_number' => $pending->booking_number,
            'status' => TripRequest::STATUS_PENDING_DISPATCH,
            'payment_status' => TripRequest::PAYMENT_STATUS_PENDING,
            'paid_at' => null,
        ]);

    $this->getJson(route('bookings.status', ['booking' => $paid->booking_number]))
        ->assertOk()
        ->assertJson([
            'booking_number' => $paid->booking_number,
            'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        ])
        ->assertJsonPath('paid_at', $paid->paid_at->toIso8601String());
});

test('the booking status endpoint returns 404 for an unknown booking', function () {
    $this->getJson(route('bookings.status', ['booking' => 'CL-NEMT-000000']))
        ->assertNotFound();
});

test('the tracking page renders a pending booking with a resume payment link', function () {
    $tripRequest = TripRequest::factory()->create([
        'stripe_checkout_session_id' => 'cs_test_abc',
    ]);
    fakeStripeClient(new FakeStripeClient);

    $this->get(route('bookings.show', ['booking' => $tripRequest->booking_number]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('bookings/track')
            ->where('booking.booking_number', $tripRequest->booking_number)
            ->where('booking.payment_status', TripRequest::PAYMENT_STATUS_PENDING)
            ->where('checkout_url', 'https://checkout.stripe.com/c/pay/cs_test_fake'));
});

test('the tracking page for a paid booking has no checkout url', function () {
    $tripRequest = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
    ]);

    $this->get(route('bookings.show', ['booking' => $tripRequest->booking_number]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('bookings/track')
            ->where('booking.payment_status', TripRequest::PAYMENT_STATUS_PAID)
            ->where('checkout_url', null));
});

test('the tracking page redirects to the book page for an unknown booking', function () {
    $this->get(route('bookings.show', ['booking' => 'CL-NEMT-000000']))
        ->assertRedirect(route('book'));
});
