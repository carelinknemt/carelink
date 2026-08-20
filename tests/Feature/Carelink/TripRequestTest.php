<?php

use App\Cms\SectionDefinitions;
use App\Models\ContentSection;
use App\Models\TripRequest;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;
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
    'dropoff_stairs' => 4,
];

test('a trip request can be submitted and exported to csv', function () use ($validPayload) {
    Storage::fake('local');
    app()->bind(StripeClient::class, fn () => new FakeStripeClient);

    $this->post(route('bookings.store'), $validPayload)->assertOk();

    $tripRequest = TripRequest::first();

    expect($tripRequest)
        ->not->toBeNull()
        ->status->toBe(TripRequest::STATUS_PENDING_DISPATCH)
        ->passenger_first_name->toBe('Jane')
        ->passenger_last_name->toBe('Doe')
        ->passenger_is_bariatric->toBeTrue()
        ->oxygen_required->toBeTrue()
        ->dropoff_stairs->toBe(4)
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
    app()->bind(StripeClient::class, fn () => new FakeStripeClient);

    $this->post(route('bookings.store'), collect($validPayload)->except([
        'passenger_is_bariatric',
        'oxygen_required',
        'oxygen_liters_per_min',
        'will_call',
        'dropoff_stairs',
    ])->all())->assertOk();

    $this->assertDatabaseCount('trip_requests', 1);

    expect(TripRequest::first()->dropoff_stairs)->toBe(0);
});

test('the trip request form validates required fields', function () {
    $this->post(route('bookings.store'), [])
        ->assertSessionHasErrors([
            'passenger_first_name',
            'passenger_last_name',
            'passenger_phone_number',
            'passenger_email',
            'payer',
            'transport_type',
            'service_type',
            'trip_date',
            'pickup_address',
            'pickup_time',
            'dropoff_address',
        ]);

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request requires a passenger phone number', function () use ($validPayload) {
    $this->post(route('bookings.store'), [
        ...$validPayload,
        'passenger_phone_number' => '',
    ])->assertSessionHasErrors('passenger_phone_number');

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

test('a trip request accepts a US phone number and stores it as submitted', function () use ($validPayload) {
    Storage::fake('local');
    app()->bind(StripeClient::class, fn () => new FakeStripeClient);

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'passenger_phone_number' => '+1 707-555-0192',
    ])->assertOk();

    expect(TripRequest::first()->passenger_phone_number)->toBe('+1 707-555-0192');
});

test('a trip request rejects phone numbers that are not in the US', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'passenger_phone_number' => '+44 20 7946 0958',
    ])->assertSessionHasErrors('passenger_phone_number');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'passenger_phone_number' => '555-0192',
    ])->assertSessionHasErrors('passenger_phone_number');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request rejects payers other than private pay', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'payer' => 'Insurance / Medicaid',
    ])->assertSessionHasErrors('payer');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request requires a passenger email', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'passenger_email' => '',
    ])->assertSessionHasErrors('passenger_email');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request accepts a pickup time inside dispatch hours', function () use ($validPayload) {
    Storage::fake('local');
    app()->bind(StripeClient::class, fn () => new FakeStripeClient);

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => Carbon::parse('next saturday')->toDateString(),
        'pickup_time' => '01:00 PM',
    ])->assertOk();
});

test('a trip request rejects a pickup time after dispatch hours close', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => Carbon::parse('next monday')->toDateString(),
        'pickup_time' => '07:15 PM',
    ])->assertSessionHasErrors('pickup_time');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request rejects a pickup time before dispatch hours open', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => Carbon::parse('next sunday')->toDateString(),
        'pickup_time' => '06:00 AM',
    ])->assertSessionHasErrors('pickup_time');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('a trip request rejects a pickup time on a day with no dispatch service', function () use ($validPayload) {
    Storage::fake('local');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => Carbon::parse('next thursday')->toDateString(),
        'pickup_time' => 'not-a-time',
    ])->assertSessionHasErrors('pickup_time');

    $this->assertDatabaseCount('trip_requests', 0);
});

test('dispatch hours come from the cms dispatch_hours section', function () use ($validPayload) {
    Storage::fake('local');
    app()->bind(StripeClient::class, fn () => new FakeStripeClient);

    ContentSection::create([
        'slug' => 'dispatch_hours',
        'title' => 'Dispatch Hours',
        'schema' => SectionDefinitions::all()['dispatch_hours']['fields'],
        'content' => [
            'days' => [
                ['day' => 'Monday', 'hours' => '7:00 a.m.-5:00 p.m.'],
                ['day' => 'Tuesday', 'hours' => '7:00 a.m.-5:00 p.m.'],
            ],
        ],
    ]);

    $monday = Carbon::parse('next monday');

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => $monday->toDateString(),
        'pickup_time' => '05:30 PM',
    ])->assertSessionHasErrors('pickup_time');

    $this->assertDatabaseCount('trip_requests', 0);

    $this->post(route('bookings.store'), [
        ...$validPayload,
        'trip_date' => Carbon::parse('next tuesday')->toDateString(),
        'pickup_time' => '04:30 PM',
    ])->assertOk();
});
