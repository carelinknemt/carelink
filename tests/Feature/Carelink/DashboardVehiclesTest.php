<?php

use App\Models\FleetVehicle;
use App\Models\MaintenanceDocument;
use App\Models\User;
use App\Models\VehicleMaintenanceRecord;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

test('admins can view the vehicle maintenance page', function () {
    $vehicle = FleetVehicle::factory()->create();
    VehicleMaintenanceRecord::factory()->create(['fleet_vehicle_id' => $vehicle->id]);
    actingAsAdmin();

    $this->get(route('dashboard.vehicles'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/vehicles')
            ->has('vehicles', 1)
            ->has('records', 1)
            ->has('vehicle_options', 1)
            ->where('vehicles.0.name', $vehicle->name)
            ->where('vehicles.0.records_count', 1));
});

test('only admins can access the vehicle maintenance page', function () {
    $manager = User::factory()->manager()->create();
    $dispatcher = User::factory()->dispatcher()->create();

    $this->actingAs($manager)->get(route('dashboard.vehicles'))->assertRedirect();
    $this->actingAs($dispatcher)->get(route('dashboard.vehicles'))->assertRedirect();
});

test('admins can add a maintenance record', function () {
    $vehicle = FleetVehicle::factory()->create();
    actingAsAdmin();

    $this->post(route('dashboard.vehicles.maintenance.store'), [
        'fleet_vehicle_id' => $vehicle->id,
        'maintenance_type' => VehicleMaintenanceRecord::TYPE_OIL_CHANGE,
        'service_date' => '2026-09-08',
        'vehicle_mileage' => 34210,
        'service_provider' => "Joe's Auto Repair",
        'total_cost' => 189.75,
        'next_service_date' => '2027-03-08',
        'next_service_mileage' => 54210,
        'notes' => 'Replaced oil and filter.',
    ])->assertRedirect();

    $record = VehicleMaintenanceRecord::first();

    expect($record)
        ->not->toBeNull()
        ->fleet_vehicle_id->toBe($vehicle->id)
        ->maintenance_type->toBe(VehicleMaintenanceRecord::TYPE_OIL_CHANGE)
        ->service_date->not->toBeNull()
        ->vehicle_mileage->toBe(34210)
        ->service_provider->toBe("Joe's Auto Repair")
        ->total_cost->toBe('189.75')
        ->next_service_date->not->toBeNull()
        ->next_service_mileage->toBe(54210)
        ->notes->toBe('Replaced oil and filter.');
});

test('adding a maintenance record attaches receipt documents', function () {
    Storage::fake('local');
    $vehicle = FleetVehicle::factory()->create();
    actingAsAdmin();

    $this->post(route('dashboard.vehicles.maintenance.store'), [
        'fleet_vehicle_id' => $vehicle->id,
        'maintenance_type' => VehicleMaintenanceRecord::TYPE_OIL_CHANGE,
        'service_date' => '2026-09-08',
        'documents' => [
            ['file' => UploadedFile::fake()->create('receipt.pdf', 100, 'application/pdf')],
            ['file' => UploadedFile::fake()->image('photo.jpg', 200, 200)],
        ],
    ])->assertRedirect();

    $record = VehicleMaintenanceRecord::first();

    expect($record->documents()->count())->toBe(2);

    Storage::disk('local')->assertExists($record->documents()->value('file_path'));
});

test('adding a maintenance record rejects an unknown maintenance type', function () {
    $vehicle = FleetVehicle::factory()->create();
    actingAsAdmin();

    $this->post(route('dashboard.vehicles.maintenance.store'), [
        'fleet_vehicle_id' => $vehicle->id,
        'maintenance_type' => 'unknown',
        'service_date' => '2026-09-08',
    ])->assertSessionHasErrors('maintenance_type');

    expect(VehicleMaintenanceRecord::count())->toBe(0);
});

test('admins can update a maintenance record', function () {
    $record = VehicleMaintenanceRecord::factory()->create();
    actingAsAdmin();

    $this->put(route('dashboard.vehicles.maintenance.update', $record), [
        'fleet_vehicle_id' => $record->fleet_vehicle_id,
        'maintenance_type' => VehicleMaintenanceRecord::TYPE_BRAKE_SERVICE,
        'service_date' => '2026-09-08',
        'total_cost' => 420.50,
        'notes' => 'Replaced brake pads.',
    ])->assertRedirect();

    $fresh = $record->fresh();

    expect($fresh)
        ->maintenance_type->toBe(VehicleMaintenanceRecord::TYPE_BRAKE_SERVICE)
        ->total_cost->toBe('420.50')
        ->notes->toBe('Replaced brake pads.');
});

test('admins can delete a maintenance record and its stored receipts', function () {
    Storage::fake('local');
    $record = VehicleMaintenanceRecord::factory()->create();
    $document = MaintenanceDocument::factory()->create([
        'vehicle_maintenance_record_id' => $record->id,
    ]);
    Storage::disk('local')->put($document->file_path, 'content');
    actingAsAdmin();

    $this->delete(route('dashboard.vehicles.maintenance.destroy', $record))
        ->assertRedirect();

    expect(VehicleMaintenanceRecord::find($record->id))->toBeNull();
    expect(MaintenanceDocument::find($document->id))->toBeNull();
    Storage::disk('local')->assertMissing($document->file_path);
});

test('admins can download a maintenance receipt', function () {
    Storage::fake('local');
    $record = VehicleMaintenanceRecord::factory()->create();
    $path = 'maintenance-documents/receipt.pdf';
    Storage::disk('local')->put($path, 'pdf-content');
    $document = MaintenanceDocument::create([
        'vehicle_maintenance_record_id' => $record->id,
        'file_path' => $path,
        'file_name' => 'receipt.pdf',
        'file_size' => 11,
    ]);
    actingAsAdmin();

    $this->get(route('dashboard.vehicles.maintenance.documents.show', [$record, $document]))
        ->assertOk()
        ->assertDownload('receipt.pdf');
});

test('admins can add a fleet vehicle', function () {
    actingAsAdmin();

    $this->post(route('dashboard.vehicles.store'), [
        'name' => 'Van 01 - BraunAbility',
        'type' => 'WHEELCHAIR',
        'capacity' => '1 Wheelchair + 3 Passengers',
        'hourly_rate_est' => 85,
        'description' => 'Wheelchair accessible van.',
    ])->assertRedirect();

    $vehicle = FleetVehicle::where('name', 'Van 01 - BraunAbility')->first();

    expect($vehicle)->not->toBeNull();
    expect($vehicle->type)->toBe('WHEELCHAIR');
    expect($vehicle->active)->toBeTrue();
});

test('admins can toggle a fleet vehicle active state', function () {
    $vehicle = FleetVehicle::factory()->create(['active' => true]);
    actingAsAdmin();

    $this->post(route('dashboard.vehicles.toggle', $vehicle))->assertRedirect();

    expect($vehicle->fresh()->active)->toBeFalse();
});

test('admins can update a fleet vehicle', function () {
    $vehicle = FleetVehicle::factory()->create();
    actingAsAdmin();

    $this->put(route('dashboard.vehicles.update', $vehicle), [
        'name' => 'Updated Van',
        'type' => 'TRANSIT_SHUTTLE',
        'capacity' => '8 Passengers',
        'hourly_rate_est' => 95,
        'description' => 'Updated description.',
    ])->assertRedirect();

    $fresh = $vehicle->fresh();

    expect($fresh)->name->toBe('Updated Van');
    expect($fresh)->type->toBe('TRANSIT_SHUTTLE');
});

test('admins can delete a fleet vehicle and its maintenance history', function () {
    Storage::fake('local');
    $vehicle = FleetVehicle::factory()->create();
    $record = VehicleMaintenanceRecord::factory()->create([
        'fleet_vehicle_id' => $vehicle->id,
    ]);
    $document = MaintenanceDocument::factory()->create([
        'vehicle_maintenance_record_id' => $record->id,
    ]);
    Storage::disk('local')->put($document->file_path, 'content');
    actingAsAdmin();

    $this->delete(route('dashboard.vehicles.destroy', $vehicle))->assertRedirect();

    expect(FleetVehicle::find($vehicle->id))->toBeNull();
    expect(VehicleMaintenanceRecord::find($record->id))->toBeNull();
    Storage::disk('local')->assertMissing($document->file_path);
});
