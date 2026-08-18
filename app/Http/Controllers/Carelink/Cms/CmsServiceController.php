<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsServiceController extends Controller
{
    use ConvertsLineLists;

    /**
     * Admin-only service catalog management: the rows behind the public
     * services page and the book form rates.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->is_admin, 403);

        $services = Service::query()->ordered()->get()->map(fn (Service $service): array => $this->summary($service));

        return Inertia::render('cms/services', [
            'services' => $services,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $service = Service::create($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$service->title} was added.",
        ]);

        return back();
    }

    public function update(Request $request, Service $service): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $service->update($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$service->title} was updated.",
        ]);

        return back();
    }

    public function destroy(Request $request, Service $service): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $title = $service->title;
        $service->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$title} was deleted.",
        ]);

        return back();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    private function rules(): array
    {
        return [
            'slug' => ['required', 'string', 'max:255'],
            'category' => ['required', 'in:MEDICAL,NON_MEDICAL,SPECIALTY'],
            'title' => ['required', 'string', 'max:255'],
            'short_description' => ['required', 'string', 'max:20000'],
            'full_description' => ['nullable', 'string', 'max:20000'],
            'benefits' => ['nullable', 'string', 'max:20000'],
            'image' => ['nullable', 'string', 'max:1000'],
            'icon_name' => ['nullable', 'string', 'max:255'],
            'suitable_for' => ['nullable', 'string', 'max:20000'],
            'typical_destinations' => ['nullable', 'string', 'max:20000'],
            'base_rate' => ['nullable', 'numeric', 'min:0'],
            'mileage_rate' => ['nullable', 'numeric', 'min:0'],
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
        $validated['full_description'] = $validated['full_description'] ?? '';
        $validated['image'] = $validated['image'] ?? '';
        $validated['icon_name'] = $validated['icon_name'] ?? '';
        $validated['benefits'] = $this->linesList($validated['benefits'] ?? '');
        $validated['suitable_for'] = $this->linesList($validated['suitable_for'] ?? '');
        $validated['typical_destinations'] = $this->linesList($validated['typical_destinations'] ?? '');
        $validated['active'] = (bool) ($validated['active'] ?? false);

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Service $service): array
    {
        return [
            'id' => $service->id,
            'slug' => $service->slug,
            'category' => $service->category,
            'title' => $service->title,
            'short_description' => $service->short_description,
            'full_description' => $service->full_description,
            'benefits' => $service->benefits,
            'image' => $service->image,
            'icon_name' => $service->icon_name,
            'suitable_for' => $service->suitable_for,
            'typical_destinations' => $service->typical_destinations,
            'base_rate' => $service->base_rate,
            'mileage_rate' => $service->mileage_rate,
            'sort_order' => $service->sort_order,
            'active' => $service->active,
        ];
    }
}
