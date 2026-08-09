<?php

use App\Models\RideBooking;
use App\Models\Service;
use App\Models\User;

test('guests cannot access the dispatch CMS', function () {
    $this->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));
});

test('non-admin users cannot access the dispatch CMS', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('admin.dashboard'))
        ->assertRedirect(route('admin.login'));
});

test('admins can visit each section of the dispatch portal', function (string $route, string $component) {
    $admin = User::factory()->create(['is_admin' => true]);

    $this->actingAs($admin)
        ->get(route($route))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component($component));
})->with([
    'dispatch overview' => ['admin.dashboard', 'admin/dashboard'],
    'fleet status' => ['admin.fleet', 'admin/fleet'],
    'service rates' => ['admin.services', 'admin/services'],
]);

test('the dispatch overview paginates bookings and reports metric counts', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    RideBooking::factory()->count(12)->create();
    RideBooking::factory()->count(2)->create(['status' => RideBooking::STATUS_IN_TRANSIT]);

    $this->actingAs($admin)
        ->get(route('admin.dashboard'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('admin/dashboard')
            ->has('bookings.data', 10)
            ->where('bookings.total', 14)
            ->where('bookings.last_page', 2)
            ->where('activeRidesCount', 2));
});

test('admins can log into the dispatch portal', function () {
    $user = User::factory()->create([
        'email' => 'dispatch@carelink.com',
        'password' => bcrypt('carelink2026'),
        'is_admin' => true,
    ]);

    $this->post(route('admin.login.attempt'), [
        'email' => 'dispatch@carelink.com',
        'password' => 'carelink2026',
    ])->assertRedirect(route('admin.dashboard'));

    $this->assertAuthenticatedAs($user);
});

test('invalid admin credentials are rejected', function () {
    User::factory()->create(['email' => 'dispatch@carelink.com', 'is_admin' => true]);

    $this->post(route('admin.login.attempt'), [
        'email' => 'dispatch@carelink.com',
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('admins can update a booking status', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $booking = RideBooking::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.bookings.update-status', $booking), ['status' => RideBooking::STATUS_BAMBI_DISPATCHED])
        ->assertRedirect();

    expect($booking->fresh()->status)->toBe(RideBooking::STATUS_BAMBI_DISPATCHED);
});

test('booking status must be a valid dispatch status', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $booking = RideBooking::factory()->create();

    $this->actingAs($admin)
        ->patch(route('admin.bookings.update-status', $booking), ['status' => 'INVALID_STATUS'])
        ->assertSessionHasErrors('status');
});

test('admins can update service rates', function () {
    $admin = User::factory()->create(['is_admin' => true]);
    $service = Service::factory()->create(['base_rate' => '55.00', 'mileage_rate' => '3.50']);

    $this->actingAs($admin)
        ->put(route('admin.services.update-rates'), [
            'services' => [
                ['id' => $service->id, 'base_rate' => 62.5, 'mileage_rate' => 4.0],
            ],
        ])->assertRedirect();

    $service->refresh();

    expect($service->base_rate)->toBe('62.50')
        ->and($service->mileage_rate)->toBe('4.00');
});
