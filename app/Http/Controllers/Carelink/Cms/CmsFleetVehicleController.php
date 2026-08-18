<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Http\Controllers\Controller;
use App\Models\FleetVehicle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsFleetVehicleController extends Controller
{
    use ConvertsLineLists;

    /**
     * Admin-only fleet management: the vehicles behind the public fleet page.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->is_admin, 403);

        $vehicles = FleetVehicle::query()->ordered()->get()->map(fn (FleetVehicle $vehicle): array => $this->summary($vehicle));

        return Inertia::render('cms/fleet', [
            'vehicles' => $vehicles,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $vehicle = FleetVehicle::create($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$vehicle->name} was added.",
        ]);

        return back();
    }

    public function update(Request $request, FleetVehicle $vehicle): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $vehicle->update($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$vehicle->name} was updated.",
        ]);

        return back();
    }

    public function destroy(Request $request, FleetVehicle $vehicle): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $name = $vehicle->name;
        $vehicle->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$name} was deleted.",
        ]);

        return back();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:AMBULATORY,WHEELCHAIR,GURNEY,TRANSIT_SHUTTLE'],
            'capacity' => ['nullable', 'string', 'max:255'],
            'features' => ['nullable', 'string', 'max:20000'],
            'description' => ['nullable', 'string', 'max:20000'],
            'image' => ['nullable', 'string', 'max:1000'],
            'accessibility_specs' => ['nullable', 'string', 'max:20000'],
            'hourly_rate_est' => ['nullable', 'numeric', 'min:0'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'active' => ['nullable', 'boolean'],
        ];
    }

    /**
     * @param  array<string, mixed>  $validated
     * @return array<string, mixed>
     */
    private function values(array $validated): array
    {
        $validated['capacity'] = $validated['capacity'] ?? '';
        $validated['description'] = $validated['description'] ?? '';
        $validated['image'] = $validated['image'] ?? '';
        $validated['hourly_rate_est'] = $validated['hourly_rate_est'] ?? 0;
        $validated['features'] = $this->linesList($validated['features'] ?? '');
        $validated['accessibility_specs'] = $this->linesList($validated['accessibility_specs'] ?? '');
        $validated['active'] = (bool) ($validated['active'] ?? false);

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(FleetVehicle $vehicle): array
    {
        return [
            'id' => $vehicle->id,
            'name' => $vehicle->name,
            'type' => $vehicle->type,
            'capacity' => $vehicle->capacity,
            'features' => $vehicle->features,
            'description' => $vehicle->description,
            'image' => $vehicle->image,
            'accessibility_specs' => $vehicle->accessibility_specs,
            'hourly_rate_est' => $vehicle->hourly_rate_est,
            'sort_order' => $vehicle->sort_order,
            'active' => $vehicle->active,
        ];
    }
}
