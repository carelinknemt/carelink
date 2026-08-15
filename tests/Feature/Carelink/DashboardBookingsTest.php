<?php

use App\Mail\TripRequestCancelled;
use App\Models\TripRequest;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Stripe\Exception\ApiConnectionException;
use Stripe\StripeClient;
use Tests\Support\FakeStripeClient;

function paidBooking(array $attributes = []): TripRequest
{
    return TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        ...$attributes,
    ]);
}

function paidBookingWithStripePayment(array $attributes = []): TripRequest
{
    return paidBooking([
        'stripe_checkout_session_id' => 'cs_test_cancel',
        ...$attributes,
    ]);
}

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.bookings'))->assertRedirect(route('login'));

    $booking = paidBooking();

    $this->get(route('dashboard.bookings.show', $booking))->assertRedirect(route('login'));
});

test('authenticated users can view the paid bookings page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/bookings')
            ->has('bookings')
            ->has('statuses', count(TripRequest::STATUSES)));
});

test('only bookings with the paid booking fee are listed', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $paid = paidBooking(['trip_date' => now()->addDays(1)->toDateString()]);
    paidBooking(['trip_date' => now()->addDays(2)->toDateString()]);
    TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/bookings')
            ->has('bookings.data', 2)
            ->where('bookings.data.0.booking_number', $paid->booking_number));
});

test('bookings are sorted by trip date soonest first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $later = paidBooking(['trip_date' => now()->addDays(5)->toDateString()]);
    $earliest = paidBooking(['trip_date' => now()->addDays(1)->toDateString()]);
    $middle = paidBooking(['trip_date' => now()->addDays(3)->toDateString()]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.booking_number', $earliest->booking_number)
            ->where('bookings.data.1.booking_number', $middle->booking_number)
            ->where('bookings.data.2.booking_number', $later->booking_number));
});

test('bookings with the same trip date fall back to newest booking time first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $tripDate = now()->addDays(2)->toDateString();

    $older = paidBooking(['trip_date' => $tripDate]);
    $older->forceFill(['created_at' => now()->subDays(4)])->save();
    $newer = paidBooking(['trip_date' => $tripDate]);
    $newer->forceFill(['created_at' => now()->subDay()])->save();

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.booking_number', $newer->booking_number)
            ->where('bookings.data.1.booking_number', $older->booking_number));
});

test('bookings can be searched by passenger name or booking number', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $byName = paidBooking(['passenger_first_name' => 'Zelda', 'passenger_last_name' => 'Harkness']);
    $byNumber = paidBooking();
    paidBooking(['passenger_first_name' => 'Ignored', 'passenger_last_name' => 'Nobody']);

    $this->get(route('dashboard.bookings', ['search' => 'Zelda']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $byName->booking_number));

    $this->get(route('dashboard.bookings', ['search' => $byNumber->booking_number]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $byNumber->booking_number));
});

test('bookings can be filtered by trip status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $inTransit = paidBooking(['status' => TripRequest::STATUS_IN_TRANSIT]);
    paidBooking(['status' => TripRequest::STATUS_COMPLETED]);

    $this->get(route('dashboard.bookings', ['status' => TripRequest::STATUS_IN_TRANSIT]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $inTransit->booking_number));
});

test('bookings can be filtered by a trip date range', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $inRange = paidBooking(['trip_date' => now()->addDays(3)->toDateString()]);
    paidBooking(['trip_date' => now()->addDays(6)->toDateString()]);

    $this->get(route('dashboard.bookings', [
        'date_from' => now()->addDays(2)->toDateString(),
        'date_to' => now()->addDays(4)->toDateString(),
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $inRange->booking_number));

    $this->get(route('dashboard.bookings', [
        'date_from' => now()->addDays(7)->toDateString(),
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 0));
});

test('bookings can be filtered by service type', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $wheelchair = paidBooking(['service_type' => 'curb-to-curb']);
    paidBooking(['service_type' => 'door-to-door']);

    $this->get(route('dashboard.bookings', ['service_type' => 'curb-to-curb']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $wheelchair->booking_number));
});

test('bookings can be sorted by trip price and direction', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $cheap = paidBooking([
        'input_price' => 10,
        'trip_date' => now()->addDays(9)->toDateString(),
    ]);
    $expensive = paidBooking([
        'input_price' => 250,
        'trip_date' => now()->addDays(2)->toDateString(),
    ]);

    $this->get(route('dashboard.bookings', ['sort' => 'input_price', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.booking_number', $expensive->booking_number)
            ->where('bookings.data.1.booking_number', $cheap->booking_number));

    $this->get(route('dashboard.bookings', ['sort' => 'not_a_column']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.booking_number', $expensive->booking_number));
});

test('bookings respect the requested page size', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    paidBooking(['passenger_first_name' => 'First']);
    paidBooking(['passenger_first_name' => 'Second']);

    $this->get(route('dashboard.bookings', ['per_page' => 25]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.per_page', 25));

    $this->get(route('dashboard.bookings', ['per_page' => 7]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.per_page', 15));
});

test('mobile requests default to 25 bookings per page', function () {
    $user = User::factory()->create();
    $this->actingAs($user)
        ->withHeader('User-Agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1');

    paidBooking(['passenger_first_name' => 'First']);
    paidBooking(['passenger_first_name' => 'Second']);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.per_page', 25)
            ->where('filters.per_page', '25'));

    $this->get(route('dashboard.bookings', ['per_page' => 7]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.per_page', 25));
});

test('bookings are paginated', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    paidBooking(['passenger_first_name' => 'First']);
    paidBooking(['passenger_first_name' => 'Second']);

    $this->get(route('dashboard.bookings', ['page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.current_page', 2)
            ->where('bookings.total', 2)
            ->where('bookings.per_page', 15));
});

test('the export downloads a csv of paid bookings using the Bambi schema', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $paid = paidBooking([
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Doe',
        'service_type' => 'door-to-door',
        'will_call' => true,
        'passenger_is_bariatric' => true,
        'oxygen_required' => false,
        'passenger_gender' => null,
        'passenger_notes' => null,
    ]);
    paidBooking();
    TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $response = $this->get(route('dashboard.bookings.export'));

    $response
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $rows = array_map('str_getcsv', explode(PHP_EOL, trim($response->streamedContent())));

    expect($rows[0])->toBe(TripRequest::CSV_COLUMNS);

    $idIndex = array_search('id', TripRequest::CSV_COLUMNS, true);
    $bariatricIndex = array_search('passenger_is_bariatric', TripRequest::CSV_COLUMNS, true);
    $willCallIndex = array_search('will_call', TripRequest::CSV_COLUMNS, true);
    $oxygenIndex = array_search('oxygen_required', TripRequest::CSV_COLUMNS, true);

    $janeRow = collect($rows)->first(fn (array $row): bool => $row[0] === 'Jane');

    expect($janeRow)->not->toBeNull()
        ->and($janeRow[$idIndex])->toBe('')
        ->and($janeRow[$bariatricIndex])->toBe('TRUE')
        ->and($janeRow[$willCallIndex])->toBe('TRUE')
        ->and($janeRow[$oxygenIndex])->toBe('FALSE');

    $genderIndex = array_search('passenger_gender', TripRequest::CSV_COLUMNS, true);
    $notesIndex = array_search('passenger_notes', TripRequest::CSV_COLUMNS, true);

    expect($janeRow[$genderIndex])->toBe('')
        ->and($janeRow[$notesIndex])->toBe('');

    expect($rows)->toHaveCount(3);
});

test('a single paid booking can be exported with the Bambi schema', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking([
        'passenger_first_name' => 'Ruth',
        'passenger_last_name' => 'Bader',
        'will_call' => true,
    ]);

    $response = $this->get(route('dashboard.bookings.show-export', $booking));

    $response
        ->assertOk()
        ->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $rows = array_map('str_getcsv', explode(PHP_EOL, trim($response->streamedContent())));

    expect($rows[0])->toBe(TripRequest::CSV_COLUMNS);

    $idIndex = array_search('id', TripRequest::CSV_COLUMNS, true);
    $willCallIndex = array_search('will_call', TripRequest::CSV_COLUMNS, true);

    expect($rows)->toHaveCount(2)
        ->and($rows[1][0])->toBe('Ruth')
        ->and($rows[1][$willCallIndex])->toBe('TRUE')
        ->and($rows[1][$idIndex])->toBe('');
});

test('unpaid bookings cannot be exported individually', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unpaid = TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->get(route('dashboard.bookings.show-export', $unpaid))->assertNotFound();
});

test('authenticated users can view every detail of a paid booking', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking([
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Doe',
        'service_type' => 'door-to-door',
        'passenger_is_bariatric' => true,
    ]);

    $this->get(route('dashboard.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/bookings/show')
            ->where('booking.booking_number', $booking->booking_number)
            ->where('booking.passenger_first_name', 'Jane')
            ->where('booking.passenger_last_name', 'Doe')
            ->where('booking.service_type', 'door-to-door')
            ->where('booking.payment_status', TripRequest::PAYMENT_STATUS_PAID));
});

test('the booking detail page is not accessible for unpaid bookings', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unpaid = TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->get(route('dashboard.bookings.show', $unpaid))->assertNotFound();
});

test('a manager can update the trip status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking(['status' => TripRequest::STATUS_PENDING_DISPATCH]);

    $this->patch(route('dashboard.bookings.update-status', $booking), [
        'status' => TripRequest::STATUS_IN_TRANSIT,
    ])->assertRedirect();

    expect($booking->fresh()->status)->toBe(TripRequest::STATUS_IN_TRANSIT);
});

test('the trip status update requires a valid status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking();

    $this->patch(route('dashboard.bookings.update-status', $booking), [
        'status' => 'NOT_A_STATUS',
    ])->assertSessionHasErrors('status');

    expect($booking->fresh()->status)->toBe(TripRequest::STATUS_PENDING_DISPATCH);
});

test('the trip status of unpaid bookings cannot be updated', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unpaid = TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->patch(route('dashboard.bookings.update-status', $unpaid), [
        'status' => TripRequest::STATUS_IN_TRANSIT,
    ])->assertNotFound();
});

test('a manager can edit the trip details', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking();

    $this->put(route('dashboard.bookings.update', $booking), [
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Smith',
        'payer' => 'Private Pay',
        'transport_type' => $booking->transport_type,
        'service_type' => 'door-to-door',
        'trip_date' => now()->addDays(3)->toDateString(),
        'input_price' => 95.5,
        'pickup_address' => '123 Main St, Eureka, CA',
        'pickup_time' => '08:30 AM',
        'dropoff_address' => 'General Hospital, Eureka, CA',
        'passenger_phone_number' => '+1 707-555-0100',
        'passenger_email' => 'jane.smith@example.com',
    ])->assertRedirect();

    $booking->refresh();

    expect($booking)
        ->passenger_first_name->toBe('Jane')
        ->passenger_last_name->toBe('Smith')
        ->service_type->toBe('door-to-door')
        ->input_price->toBe('95.50')
        ->pickup_address->toBe('123 Main St, Eureka, CA')
        ->passenger_email->toBe('jane.smith@example.com');
});

test('per-card edits only update the fields that were submitted', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking([
        'passenger_first_name' => 'Jane',
        'will_call' => false,
        'pickup_stairs' => true,
        'trip_date' => now()->addDays(5)->toDateString(),
        'input_price' => 80,
    ]);

    $this->put(route('dashboard.bookings.update', $booking), [
        'passenger_first_name' => 'Joan',
        'passenger_last_name' => $booking->passenger_last_name,
        'passenger_phone_number' => '+1 707-555-0199',
        'passenger_is_bariatric' => 1,
    ])->assertRedirect();

    $booking->refresh();

    expect($booking)
        ->passenger_first_name->toBe('Joan')
        ->passenger_phone_number->toBe('+1 707-555-0199')
        ->passenger_is_bariatric->toBeTrue()
        ->will_call->toBeFalse()
        ->pickup_stairs->toBeTrue()
        ->input_price->toBe('80.00')
        ->trip_date->format('Y-m-d')->toBe(now()->addDays(5)->toDateString());
});

test('a manager can edit the dropoff stairs as a number', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking(['dropoff_stairs' => 0]);

    $this->put(route('dashboard.bookings.update', $booking), [
        'dropoff_address_details' => 'Main entrance, 3rd floor',
        'dropoff_stairs' => 3,
    ])->assertRedirect();

    expect($booking->fresh())
        ->dropoff_stairs->toBe(3)
        ->dropoff_address_details->toBe('Main entrance, 3rd floor');
});

test('trip edits are validated', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking();

    $this->put(route('dashboard.bookings.update', $booking), [
        'passenger_first_name' => '',
        'input_price' => -5,
    ])->assertSessionHasErrors(['passenger_first_name', 'input_price']);
});

test('unpaid bookings cannot be edited', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unpaid = TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->put(route('dashboard.bookings.update', $unpaid), [
        'passenger_first_name' => 'Jane',
        'passenger_last_name' => 'Doe',
        'payer' => 'Private Pay',
        'transport_type' => 'wheelchair',
        'service_type' => 'door-to-door',
        'trip_date' => now()->addDays(2)->toDateString(),
        'input_price' => 60,
        'pickup_address' => '123 Main St',
        'pickup_time' => '09:00 AM',
        'dropoff_address' => 'Hospital',
    ])->assertNotFound();
});

test('a manager can cancel a paid booking and the booking fee is refunded', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment();

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    $booking->refresh();

    expect($booking)
        ->status->toBe(TripRequest::STATUS_CANCELLED)
        ->refunded_at->not->toBeNull();

    expect($stripe->refunds->created)->toHaveCount(1);

    $refund = $stripe->refunds->created[0];

    expect($refund)
        ->payment_intent->toBe('pi_test_fake')
        ->metadata->booking_number->toBe($booking->booking_number);

    Mail::assertSent(
        TripRequestCancelled::class,
        fn (TripRequestCancelled $mail): bool => $mail->hasTo($booking->passenger_email)
            && $mail->tripRequest->is($booking),
    );
});

test('cancelling a payment-backed booking sends a refund confirmation email', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment(['passenger_email' => 'rider@example.com']);

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    Mail::assertSent(
        TripRequestCancelled::class,
        fn (TripRequestCancelled $mail): bool => $mail->hasTo('rider@example.com'),
    );
});

test('no cancellation email is sent when the passenger has no email address', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment(['passenger_email' => null]);

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    expect($booking->fresh())->status->toBe(TripRequest::STATUS_CANCELLED);

    Mail::assertNotSent(TripRequestCancelled::class);
});

test('a booking with no stripe payment is cancelled without a refund', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBooking();

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    expect($booking->fresh())
        ->status->toBe(TripRequest::STATUS_CANCELLED)
        ->refunded_at->toBeNull();

    expect($stripe->refunds->created)->toBeEmpty();

    Mail::assertNotSent(TripRequestCancelled::class);
});

test('a booking is not cancelled when the refund fails', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Mail::fake();

    $stripe = new FakeStripeClient;
    $stripe->refunds->createException = new ApiConnectionException('boom');
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment();

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    expect($booking->fresh())
        ->status->toBe(TripRequest::STATUS_PENDING_DISPATCH)
        ->refunded_at->toBeNull();

    Mail::assertNotSent(TripRequestCancelled::class);
});

test('unpaid bookings cannot be cancelled', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $unpaid = TripRequest::factory()->create(['payment_status' => TripRequest::PAYMENT_STATUS_PENDING]);

    $this->post(route('dashboard.bookings.cancel', $unpaid))->assertNotFound();
});

test('an already cancelled booking cannot be cancelled again', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment(['status' => TripRequest::STATUS_CANCELLED]);

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    expect($booking->fresh())->status->toBe(TripRequest::STATUS_CANCELLED);
    expect($stripe->refunds->created)->toBeEmpty();
});

test('completed bookings cannot be cancelled', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $stripe = new FakeStripeClient;
    app()->bind(StripeClient::class, fn () => $stripe);

    $booking = paidBookingWithStripePayment(['status' => TripRequest::STATUS_COMPLETED]);

    $this->post(route('dashboard.bookings.cancel', $booking))->assertRedirect();

    expect($booking->fresh())->status->toBe(TripRequest::STATUS_COMPLETED);
    expect($stripe->refunds->created)->toBeEmpty();
});

test('the cancelled status can be assigned from the status dropdown', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking();

    $this->patch(route('dashboard.bookings.update-status', $booking), [
        'status' => TripRequest::STATUS_CANCELLED,
    ])->assertRedirect();

    expect($booking->fresh())->status->toBe(TripRequest::STATUS_CANCELLED);
});

test('the booking detail page offers cancelled in the status select', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBooking();

    $this->get(route('dashboard.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/bookings/show')
            ->where('statuses', TripRequest::ASSIGNABLE_STATUSES)
            ->where('statuses.4', TripRequest::STATUS_CANCELLED));
});

test('the bookings list shows pending dispatch bookings by default', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $pending = paidBooking(['status' => TripRequest::STATUS_PENDING_DISPATCH]);
    $completed = paidBooking(['status' => TripRequest::STATUS_COMPLETED]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 1)
            ->where('bookings.data.0.booking_number', $pending->booking_number)
            ->where('filters.status', TripRequest::STATUS_PENDING_DISPATCH));
});

test('the all statuses filter reveals every booking status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $pending = paidBooking([
        'status' => TripRequest::STATUS_PENDING_DISPATCH,
        'trip_date' => now()->addDays(1)->toDateString(),
    ]);
    $completed = paidBooking([
        'status' => TripRequest::STATUS_COMPLETED,
        'trip_date' => now()->addDays(2)->toDateString(),
    ]);
    $cancelled = paidBooking([
        'status' => TripRequest::STATUS_CANCELLED,
        'trip_date' => now()->addDays(3)->toDateString(),
    ]);

    $this->get(route('dashboard.bookings', ['status' => TripRequest::STATUS_FILTER_ALL]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data', 3)
            ->where('filters.status', TripRequest::STATUS_FILTER_ALL))
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.booking_number', $pending->booking_number)
            ->where('bookings.data.2.booking_number', $cancelled->booking_number));
});
