<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\FleetVehicle;
use App\Models\MaintenanceDocument;
use App\Models\VehicleMaintenanceRecord;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardVehicleController extends Controller
{
    /**
     * Admin-only fleet management: maintenance logs and fleet vehicles.
     */
    public function index(): Response
    {
        $vehicles = FleetVehicle::query()
            ->with('maintenanceRecords')
            ->ordered()
            ->get()
            ->map(fn (FleetVehicle $vehicle): array => $this->vehicleSummary($vehicle));

        $records = VehicleMaintenanceRecord::query()
            ->with(['vehicle:id,name', 'documents'])
            ->latest('service_date')
            ->get()
            ->map(fn (VehicleMaintenanceRecord $record): array => $this->recordSummary($record));

        return Inertia::render('dashboard/vehicles', [
            'vehicles' => $vehicles,
            'records' => $records,
            'vehicle_options' => FleetVehicle::query()
                ->ordered()
                ->get(['id', 'name']),
        ]);
    }

    /* ------------------------------------------------------------------ *
     |  Maintenance records
     * ------------------------------------------------------------------ */

    /**
     * Add a maintenance record for a fleet vehicle.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->maintenanceRecordRules());

        $record = VehicleMaintenanceRecord::create($this->maintenanceValues($validated));

        $this->storeDocuments($record, $validated['documents'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Maintenance record saved.',
        ]);

        return back();
    }

    /**
     * Update a maintenance record and append any new receipt documents.
     */
    public function update(Request $request, VehicleMaintenanceRecord $record): RedirectResponse
    {
        $validated = $request->validate($this->maintenanceRecordRules());

        $record->update($this->maintenanceValues($validated));

        $this->storeDocuments($record, $validated['documents'] ?? []);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Maintenance record updated.',
        ]);

        return back();
    }

    /**
     * Delete a maintenance record and its stored receipt files.
     */
    public function destroy(Request $request, VehicleMaintenanceRecord $record): RedirectResponse
    {
        $paths = $record->documents()->pluck('file_path');

        Storage::disk('local')->delete($paths->all());

        $record->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Maintenance record removed.',
        ]);

        return back();
    }

    /**
     * Attach a receipt or service document to an existing record.
     */
    public function storeDocument(Request $request, VehicleMaintenanceRecord $record): RedirectResponse
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ]);

        $file = $request->file('file');

        $record->documents()->create([
            'file_path' => $file->store('maintenance-documents', 'local'),
            'file_name' => Str::limit($file->getClientOriginalName(), 255),
            'file_size' => $file->getSize(),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Receipt attached.',
        ]);

        return back();
    }

    /**
     * Remove a receipt document and its stored file.
     */
    public function destroyDocument(Request $request, VehicleMaintenanceRecord $record, MaintenanceDocument $document): RedirectResponse
    {
        if ($document->vehicle_maintenance_record_id !== $record->id) {
            abort(404);
        }

        Storage::disk('local')->delete($document->file_path);

        $document->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Receipt removed.',
        ]);

        return back();
    }

    /**
     * Stream a receipt document from private storage.
     */
    public function downloadDocument(Request $request, VehicleMaintenanceRecord $record, MaintenanceDocument $document): StreamedResponse
    {
        if ($document->vehicle_maintenance_record_id !== $record->id) {
            abort(404);
        }

        return Storage::disk('local')->download($document->file_path, $document->file_name);
    }

    /* ------------------------------------------------------------------ *
     |  Fleet vehicles
     * ------------------------------------------------------------------ */

    /**
     * Add a fleet vehicle to the vehicles list.
     */
    public function storeVehicle(Request $request): RedirectResponse
    {
        $validated = $request->validate($this->vehicleRules());

        $vehicle = FleetVehicle::create([
            ...$validated,
            'features' => [],
            'accessibility_specs' => [],
            'image' => '',
            'sort_order' => FleetVehicle::query()->max('sort_order') + 1,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$vehicle->name} was added.",
        ]);

        return back();
    }

    /**
     * Update a fleet vehicle.
     */
    public function updateVehicle(Request $request, FleetVehicle $vehicle): RedirectResponse
    {
        $validated = $request->validate($this->vehicleRules());

        $vehicle->update($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$vehicle->name} was updated.",
        ]);

        return back();
    }

    /**
     * Toggle a fleet vehicle between active and hidden.
     */
    public function toggleVehicle(Request $request, FleetVehicle $vehicle): RedirectResponse
    {
        $vehicle->update([
            'active' => ! $vehicle->active,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $vehicle->active
                ? "{$vehicle->name} is now active."
                : "{$vehicle->name} was deactivated.",
        ]);

        return back();
    }

    /**
     * Delete a fleet vehicle and its maintenance history.
     */
    public function destroyVehicle(Request $request, FleetVehicle $vehicle): RedirectResponse
    {
        $name = $vehicle->name;

        $paths = MaintenanceDocument::query()
            ->whereIn(
                'vehicle_maintenance_record_id',
                $vehicle->maintenanceRecords()->pluck('id'),
            )
            ->pluck('file_path');

        Storage::disk('local')->delete($paths->all());

        $vehicle->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$name} was deleted.",
        ]);

        return back();
    }

    /* ------------------------------------------------------------------ *
     |  Validation and serialization
     * ------------------------------------------------------------------ */

    /**
     * @return array<string, array<int, string>>
     */
    private function maintenanceRecordRules(): array
    {
        return [
            'fleet_vehicle_id' => ['required', 'integer', 'exists:fleet_vehicles,id'],
            'maintenance_type' => ['required', 'string', 'in:'.implode(',', VehicleMaintenanceRecord::TYPES)],
            'service_date' => ['required', 'date'],
            'vehicle_mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'service_provider' => ['nullable', 'string', 'max:255'],
            'total_cost' => ['nullable', 'numeric', 'min:0', 'max:999999'],
            'next_service_date' => ['nullable', 'date', 'after_or_equal:service_date'],
            'next_service_mileage' => ['nullable', 'integer', 'min:0', 'max:2000000'],
            'notes' => ['nullable', 'string', 'max:5000'],
            'documents' => ['nullable', 'array'],
            'documents.*.file' => ['required_with:documents', 'file', 'mimes:pdf,jpg,jpeg,png', 'max:10240'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function maintenanceValues(array $validated): array
    {
        return [
            'fleet_vehicle_id' => $validated['fleet_vehicle_id'],
            'maintenance_type' => $validated['maintenance_type'],
            'service_date' => $validated['service_date'],
            'vehicle_mileage' => $validated['vehicle_mileage'] ?? null,
            'service_provider' => $validated['service_provider'] ?? null,
            'total_cost' => $validated['total_cost'] ?? 0,
            'next_service_date' => $validated['next_service_date'] ?? null,
            'next_service_mileage' => $validated['next_service_mileage'] ?? null,
            'notes' => $validated['notes'] ?? null,
        ];
    }

    /**
     * @return array<string, array<int, string>>
     */
    private function vehicleRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'string', 'in:AMBULATORY,WHEELCHAIR,GURNEY,TRANSIT_SHUTTLE'],
            'capacity' => ['required', 'string', 'max:255'],
            'hourly_rate_est' => ['nullable', 'numeric', 'min:0', 'max:9999'],
            'description' => ['nullable', 'string', 'max:5000'],
            'active' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function vehicleSummary(FleetVehicle $vehicle): array
    {
        $records = $vehicle->maintenanceRecords;

        return [
            'id' => $vehicle->id,
            'name' => $vehicle->name,
            'type' => $vehicle->type,
            'capacity' => $vehicle->capacity,
            'hourly_rate_est' => $vehicle->hourly_rate_est,
            'description' => $vehicle->description,
            'active' => $vehicle->active,
            'records_count' => $records->count(),
            'last_service_date' => $records->max(fn ($record) => $record->service_date?->format('Y-m-d')),
            'next_service_date' => $records
                ->pluck('next_service_date')
                ->filter()
                ->min(fn ($date) => $date->format('Y-m-d')),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function recordSummary(VehicleMaintenanceRecord $record): array
    {
        return [
            'id' => $record->id,
            'maintenance_type' => $record->maintenance_type,
            'type_label' => VehicleMaintenanceRecord::TYPE_LABELS[$record->maintenance_type] ?? $record->maintenance_type,
            'service_date' => $record->service_date?->format('Y-m-d'),
            'vehicle_mileage' => $record->vehicle_mileage,
            'service_provider' => $record->service_provider,
            'total_cost' => $record->total_cost,
            'next_service_date' => $record->next_service_date?->format('Y-m-d'),
            'next_service_mileage' => $record->next_service_mileage,
            'notes' => $record->notes,
            'vehicle' => $record->vehicle ? ['id' => $record->vehicle->id, 'name' => $record->vehicle->name] : null,
            'documents' => $record->documents->map(fn (MaintenanceDocument $document): array => [
                'id' => $document->id,
                'file_name' => $document->file_name,
                'file_size' => $document->file_size,
            ])->values(),
        ];
    }

    /**
     * Persist the receipt documents submitted with a maintenance record.
     *
     * @param  array<int, array{file: UploadedFile}>  $documents
     */
    private function storeDocuments(VehicleMaintenanceRecord $record, array $documents): void
    {
        foreach ($documents as $document) {
            $file = $document['file'];

            $record->documents()->create([
                'file_path' => $file->store('maintenance-documents', 'local'),
                'file_name' => Str::limit($file->getClientOriginalName(), 255),
                'file_size' => $file->getSize(),
            ]);
        }
    }
}
