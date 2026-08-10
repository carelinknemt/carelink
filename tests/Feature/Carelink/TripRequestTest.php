<?php

use App\Models\TripRequest;
use Illuminate\Support\Facades\Storage;

$validPayload = [
    'passenger_first_name' => 'Jane',
    'passenger_last_name' => 'Doe',
    'payer' => 'Insurance / Medicaid',
    'transport_type' => 'Wheelchair Van',
    'service_type' => 'Wheelchair Transport',
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
    'passenger_is_bariatric' => true,
    'oxygen_required' => true,
    'oxygen_liters_per_min' => 3,
];

test('a trip request can be submitted and exported to csv', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), $validPayload)->assertRedirect();

    $tripRequest = TripRequest::first();

    expect($tripRequest)
        ->not->toBeNull()
        ->status->toBe(TripRequest::STATUS_PENDING_DISPATCH)
        ->passenger_first_name->toBe('Jane')
        ->passenger_last_name->toBe('Doe')
        ->passenger_is_bariatric->toBeTrue()
        ->oxygen_required->toBeTrue()
        ->pickup_latitude->toBe(40.8020714)
        ->pickup_longitude->toBe(-124.1637275)
        ->dropoff_latitude->toBe(40.7868351)
        ->dropoff_longitude->toBe(-124.1608896)
        ->booking_number->toMatch('/^CL-NEMT-\d{6}$/')
        ->trip_request_csv_path->toBe("trip-requests/{$tripRequest->booking_number}.csv");

    Storage::disk('local')->assertExists($tripRequest->trip_request_csv_path);

    $rows = array_map('str_getcsv', explode(PHP_EOL, trim(Storage::disk('local')->get($tripRequest->trip_request_csv_path))));

    expect($rows[0])->toBe(TripRequest::CSV_COLUMNS);

    $idIndex = array_search('id', TripRequest::CSV_COLUMNS, true);
    $bariatricIndex = array_search('passenger_is_bariatric', TripRequest::CSV_COLUMNS, true);
    $oxygenIndex = array_search('oxygen_required', TripRequest::CSV_COLUMNS, true);
    $willCallIndex = array_search('will_call', TripRequest::CSV_COLUMNS, true);

    expect($rows[1])->toContain('Jane', 'Doe');
    expect($rows[1][$idIndex])->toBe('');
    expect($rows[1][$bariatricIndex])->toBe('TRUE');
    expect($rows[1][$oxygenIndex])->toBe('TRUE');
    expect($rows[1][$willCallIndex])->toBe('FALSE');
});

test('a trip request can be submitted without optional details', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), collect($validPayload)->except([
        'passenger_email',
        'passenger_is_bariatric',
        'oxygen_required',
        'oxygen_liters_per_min',
        'will_call',
    ])->all())->assertRedirect();

    $this->assertDatabaseCount('trip_requests', 1);
});

test('the trip request form validates required fields', function () {
    $this->post(route('bookings.store'), [])
        ->assertSessionHasErrors([
            'passenger_first_name',
            'passenger_last_name',
            'payer',
            'transport_type',
            'service_type',
            'trip_date',
            'input_price',
            'pickup_address',
            'pickup_time',
            'dropoff_address',
        ]);

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request cannot be scheduled in the past', function () use ($validPayload) {
    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => today()->subDay()->toDateString(),
    ])->assertSessionHasErrors('trip_date');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request cannot include an invalid trip price', function () use ($validPayload) {
    $this->post(route('bookings.store'), [
        ...$validPayload,
        'input_price' => -10,
    ])->assertSessionHasErrors('input_price');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request rejects coordinates outside valid ranges', function () use ($validPayload) {
    $this->post(route('bookings.store'), [
        ...$validPayload,
        'pickup_latitude' => 95,
        'dropoff_longitude' => 200,
    ])->assertSessionHasErrors(['pickup_latitude', 'dropoff_longitude']);

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request can be created through the factory', function () {
    $tripRequest = TripRequest::factory()->create();

    expect($tripRequest)
        ->status->toBe(TripRequest::STATUS_PENDING_DISPATCH)
        ->booking_number->toMatch('/^CL-NEMT-\d{6}$/');
});
