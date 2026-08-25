<?php

use App\Models\PassengerBlacklist;
use App\Models\TripRequest;
use App\Models\User;

function blacklistEntry(array $attributes = []): PassengerBlacklist
{
    return PassengerBlacklist::create([
        'email' => null,
        'phone_digits' => null,
        'reason' => 'Repeated no-shows and aggressive behavior towards drivers',
        'blacklisted_by' => User::factory()->create()->id,
        ...$attributes,
    ]);
}

test('guests are redirected to the login page', function () {
    $this->get(route('dashboard.blacklist'))->assertRedirect(route('login'));
});

test('authenticated users can view the blacklist page', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('dashboard.blacklist'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/blacklist')
            ->has('blacklist'));
});

test('blacklist page shows entries', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $entry = blacklistEntry([
        'email' => 'bad@passenger.com',
        'phone_digits' => '7079090898',
    ]);

    $this->get(route('dashboard.blacklist'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('blacklist.data', 1)
            ->where('blacklist.data.0.email', 'bad@passenger.com')
            ->where('blacklist.data.0.phone_digits', '7079090898'));
});

test('blacklist page can be searched by email', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    blacklistEntry(['email' => 'found@passenger.com']);
    blacklistEntry(['email' => 'other@passenger.com']);

    $this->get(route('dashboard.blacklist', ['search' => 'found']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('blacklist.data', 1)
            ->where('blacklist.data.0.email', 'found@passenger.com'));
});

test('blacklist page can be searched by reason', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    blacklistEntry(['reason' => 'Aggressive behavior on multiple trips']);
    blacklistEntry(['reason' => 'Repeated cancellations without notice']);

    $this->get(route('dashboard.blacklist', ['search' => 'aggressive']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('blacklist.data', 1)
            ->where('blacklist.data.0.reason', 'Aggressive behavior on multiple trips'));
});

test('a passenger can be blacklisted by email', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => 'bad@passenger.com',
        'phone' => '',
        'reason' => 'Repeated no-shows and aggressive behavior towards drivers',
    ])->assertRedirect();

    $entry = PassengerBlacklist::where('email', 'bad@passenger.com')->first();

    expect($entry)->not->toBeNull()
        ->and($entry->phone_digits)->toBeNull()
        ->and($entry->reason)->toBe('Repeated no-shows and aggressive behavior towards drivers')
        ->and($entry->blacklisted_by)->toBe($user->id);
});

test('a passenger can be blacklisted by phone', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => '',
        'phone' => '(707) 909-0898',
        'reason' => 'Repeated no-shows and aggressive behavior towards drivers',
    ])->assertRedirect();

    $entry = PassengerBlacklist::where('phone_digits', '7079090898')->first();

    expect($entry)->not->toBeNull()
        ->and($entry->email)->toBeNull()
        ->and($entry->blacklisted_by)->toBe($user->id);
});

test('a passenger can be blacklisted by both email and phone', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => 'bad@passenger.com',
        'phone' => '+17079090898',
        'reason' => 'Repeated no-shows and aggressive behavior towards drivers',
    ])->assertRedirect();

    $entry = PassengerBlacklist::first();

    expect($entry)
        ->email->toBe('bad@passenger.com')
        ->phone_digits->toBe('17079090898');
});

test('blacklisting requires a valid email or phone', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => '',
        'phone' => '',
        'reason' => 'Repeated no-shows and aggressive behavior towards drivers',
    ])->assertSessionHasErrors('email');
});

test('blacklisting requires a reason of at least 20 characters', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => 'bad@passenger.com',
        'phone' => '',
        'reason' => 'Too short',
    ])->assertSessionHasErrors('reason');
});

test('duplicate email blacklists are prevented', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    blacklistEntry(['email' => 'already@blacklisted.com']);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => 'already@blacklisted.com',
        'phone' => '',
        'reason' => 'This email was already blacklisted for some reason',
    ])->assertRedirect();

    expect(PassengerBlacklist::where('email', 'already@blacklisted.com')->count())->toBe(1);
});

test('duplicate phone blacklists are prevented', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    blacklistEntry(['phone_digits' => '7079090898']);

    $this->post(route('dashboard.blacklist.store'), [
        'email' => '',
        'phone' => '707-909-0898',
        'reason' => 'This phone was already blacklisted for some reason',
    ])->assertRedirect();

    expect(PassengerBlacklist::where('phone_digits', '7079090898')->count())->toBe(1);
});

test('a blacklist entry can be removed', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $entry = blacklistEntry();

    $this->delete(route('dashboard.blacklist.destroy', $entry))->assertRedirect();

    expect(PassengerBlacklist::find($entry->id))->toBeNull();
});

test('the bookings list includes blacklist flag for blacklisted passengers', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'passenger_email' => 'flagged@example.com',
        'passenger_phone_number' => null,
    ]);

    blacklistEntry([
        'email' => 'flagged@example.com',
        'phone_digits' => null,
    ]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data.0.blacklist')
            ->where('bookings.data.0.blacklist.reason', 'Repeated no-shows and aggressive behavior towards drivers'));
});

test('the bookings list shows null blacklist for non-blacklisted passengers', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'passenger_email' => 'good@example.com',
    ]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('bookings.data.0.blacklist', null));
});

test('blacklist matching works with different phone formats', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'passenger_phone_number' => '(707) 909-0898',
        'passenger_email' => null,
    ]);

    blacklistEntry([
        'email' => null,
        'phone_digits' => '7079090898',
    ]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data.0.blacklist')
            ->where('bookings.data.0.blacklist.id', PassengerBlacklist::first()->id));
});

test('the booking detail page includes blacklist data for blacklisted passengers', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'passenger_email' => 'flagged@example.com',
    ]);

    $entry = blacklistEntry([
        'email' => 'flagged@example.com',
        'phone_digits' => null,
    ]);

    $this->get(route('dashboard.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('blacklist.id', $entry->id)
            ->where('blacklist.reason', 'Repeated no-shows and aggressive behavior towards drivers'));
});

test('the booking detail page shows null blacklist for non-blacklisted passengers', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
    ]);

    $this->get(route('dashboard.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('blacklist', null));
});

test('the bookings list includes blacklist data in the manager summary', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        'passenger_email' => 'flagged@example.com',
    ]);

    $entry = blacklistEntry([
        'email' => 'flagged@example.com',
        'phone_digits' => null,
    ]);

    $this->get(route('dashboard.bookings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('bookings.data.0.blacklist')
            ->where('bookings.data.0.blacklist.id', $entry->id)
            ->where('bookings.data.0.blacklist.reason', 'Repeated no-shows and aggressive behavior towards drivers')
            ->has('bookings.data.0.blacklist.by')
            ->has('bookings.data.0.blacklist.at'));
});
