<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardJobOpeningController extends Controller
{
    /**
     * Admin-only job opening management: post, edit, close, and delete roles.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->is_admin, 403);

        $openings = Career::query()
            ->withCount('applications')
            ->ordered()
            ->get()
            ->map(fn (Career $career): array => $this->summary($career));

        return Inertia::render('dashboard/job-openings', [
            'openings' => $openings,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $this->validated($request);

        Career::create([
            ...$validated,
            'requirements' => $this->requirementsList($validated['requirements']),
            'active' => true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$validated['title']} was posted.",
        ]);

        return back();
    }

    public function update(Request $request, Career $career): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $this->validated($request);

        $career->update([
            ...$validated,
            'requirements' => $this->requirementsList($validated['requirements']),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$career->title} was updated.",
        ]);

        return back();
    }

    public function toggle(Request $request, Career $career): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $career->update([
            'active' => ! $career->active,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $career->active
                ? "{$career->title} is now open and visible on the careers page."
                : "{$career->title} was closed and hidden from the careers page.",
        ]);

        return back();
    }

    public function destroy(Request $request, Career $career): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $title = $career->title;
        $career->delete();

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
            'title' => ['required', 'string', 'max:255'],
            'location' => ['required', 'string', 'max:255'],
            'employment_type' => ['required', 'string', 'max:255'],
            'summary' => ['nullable', 'string', 'max:5000'],
            'requirements' => ['required', 'string', 'max:5000'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function validated(Request $request): array
    {
        return $request->validate($this->rules());
    }

    /**
     * @return array<int, string>
     */
    private function requirementsList(string $requirements): array
    {
        return collect(explode("\n", $requirements))
            ->map(fn (string $line): string => trim($line))
            ->filter()
            ->values()
            ->all();
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(Career $career): array
    {
        return [
            'id' => $career->id,
            'title' => $career->title,
            'location' => $career->location,
            'employment_type' => $career->employment_type,
            'summary' => $career->summary,
            'requirements' => $career->requirements,
            'sort_order' => $career->sort_order,
            'active' => $career->active,
            'applications_count' => $career->applications_count,
        ];
    }
}
