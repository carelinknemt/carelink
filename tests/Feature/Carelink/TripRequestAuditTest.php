<?php

use App\Models\TripRequest;
use App\Models\TripRequestAudit;
use App\Models\User;

function paidBookingForAudit(array $attributes = []): TripRequest
{
    return TripRequest::factory()->create([
        'payment_status' => TripRequest::PAYMENT_STATUS_PAID,
        'paid_at' => now(),
        ...$attributes,
    ]);
}

test('a status change from the dashboard records an audit entry', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForAudit();

    $this->patch(route('dashboard.bookings.update-status', $booking), [
        'status' => TripRequest::STATUS_BAMBI_DISPATCHED,
    ])->assertRedirect();

    $audit = $booking->audits()->first();

    expect($audit)
        ->not->toBeNull()
        ->action->toBe(TripRequestAudit::ACTION_STATUS_CHANGED)
        ->from_value->toBe(TripRequest::STATUS_PENDING_DISPATCH)
        ->to_value->toBe(TripRequest::STATUS_BAMBI_DISPATCHED)
        ->user_id->toBe($user->id)
        ->user_name->toBe($user->name)
        ->role->toBe($user->role);
});

test('editing booking details records an audit entry', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForAudit();

    $this->put(route('dashboard.bookings.update', $booking), [
        'passenger_notes' => 'Update by an admin',
    ])->assertRedirect();

    $audit = $booking->audits()->first();

    expect($audit)
        ->not->toBeNull()
        ->action->toBe(TripRequestAudit::ACTION_UPDATED)
        ->user_id->toBe($user->id)
        ->from_value->toBeNull()
        ->to_value->toBeNull();
});

test('the detail page passes the audit history newest first', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $booking = paidBookingForAudit();

    TripRequestAudit::factory()->create([
        'trip_request_id' => $booking->id,
        'action' => TripRequestAudit::ACTION_UPDATED,
        'created_at' => now()->subMinutes(5),
    ]);
    TripRequestAudit::factory()->create([
        'trip_request_id' => $booking->id,
        'action' => TripRequestAudit::ACTION_STATUS_CHANGED,
        'created_at' => now()->subMinute(),
    ]);

    $this->get(route('dashboard.bookings.show', $booking))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/bookings/show')
            ->has('audits', 2)
            ->where('audits.0.action', TripRequestAudit::ACTION_STATUS_CHANGED)
            ->where('audits.1.action', TripRequestAudit::ACTION_UPDATED));
});
