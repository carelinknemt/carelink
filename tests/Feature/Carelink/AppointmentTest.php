<?php

use App\Models\RideBooking;

test('a ride booking can be submitted through the intake form', function () {
    $this->post(route('appointments.store'), [
        'passenger_name' => 'Eleanor Vance',
        'phone' => '(707) 555-0192',
        'email' => 'eleanor@example.com',
        'service_type' => 'Wheelchair Van',
        'pickup_address' => '2400 Harris St, Eureka, CA',
        'pickup_county' => 'Humboldt',
        'destination_address' => 'St. Joseph Hospital, Eureka, CA',
        'destination_county' => 'Humboldt',
        'ride_date' => now()->addDay()->toDateString(),
        'ride_time' => '09:00 AM',
        'is_round_trip' => true,
        'wheelchair_needed' => true,
        'oxygen_needed' => false,
        'additional_notes' => 'Gate code 1234',
        'payment_method' => 'Insurance / Medicaid',
        'estimated_cost' => 85,
    ])->assertRedirect();

    $booking = RideBooking::first();

    expect($booking)
        ->not->toBeNull()
        ->passenger_name->toBe('Eleanor Vance')
        ->status->toBe(RideBooking::STATUS_PENDING_DISPATCH)
        ->is_round_trip->toBeTrue()
        ->booking_number->toMatch('/^CL-NEMT-\d{6}$/');

    $this->assertDatabaseHas('ride_bookings', [
        'id' => $booking->id,
        'booking_number' => $booking->booking_number,
    ]);
});

test('the ride booking form validates required fields', function () {
    $this->post(route('appointments.store'), [])
        ->assertSessionHasErrors([
            'passenger_name',
            'phone',
            'service_type',
            'pickup_address',
            'destination_address',
            'ride_date',
            'ride_time',
            'payment_method',
        ]);

    $this->assertDatabaseCount('ride_bookings', 0);
});
