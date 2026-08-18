<?php

namespace App\Http\Controllers\Carelink\Cms;

use App\Cms\ResetsCmsContent;
use App\Http\Controllers\Controller;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsTeamMemberController extends Controller
{
    use ConvertsLineLists;

    /**
     * Admin-only team management: the leadership shown on the home and about pages.
     */
    public function index(Request $request): Response
    {
        abort_unless($request->user()->is_admin, 403);

        $members = TeamMember::query()->ordered()->get()->map(fn (TeamMember $member): array => $this->summary($member));

        return Inertia::render('cms/team', [
            'members' => $members,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $member = TeamMember::create($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$member->name} was added.",
        ]);

        return back();
    }

    public function update(Request $request, TeamMember $member): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $validated = $request->validate($this->rules());

        $member->update($this->values($validated));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$member->name} was updated.",
        ]);

        return back();
    }

    public function destroy(Request $request, TeamMember $member): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        $name = $member->name;
        $member->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$name} was deleted.",
        ]);

        return back();
    }

    /**
     * @return array<string, array<int, mixed>>
     */
    /**
     * Replace every row with the CollectionDefinitions defaults.
     */
    public function restore(Request $request): RedirectResponse
    {
        abort_unless($request->user()->is_admin, 403);

        (new ResetsCmsContent)->resetCollection('team');

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Team members were reset to their defaults.',
        ]);

        return back();
    }

    private function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'role' => ['nullable', 'string', 'max:255'],
            'title' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'string', 'max:20000'],
            'image' => ['nullable', 'string', 'max:1000'],
            'certifications' => ['nullable', 'string', 'max:20000'],
            'experience_years' => ['nullable', 'integer', 'min:0'],
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
        $validated['role'] = $validated['role'] ?? '';
        $validated['title'] = $validated['title'] ?? '';
        $validated['bio'] = $validated['bio'] ?? '';
        $validated['image'] = $validated['image'] ?? '';
        $validated['certifications'] = $this->linesList($validated['certifications'] ?? '');
        $validated['active'] = (bool) ($validated['active'] ?? false);

        return $validated;
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(TeamMember $member): array
    {
        return [
            'id' => $member->id,
            'name' => $member->name,
            'role' => $member->role,
            'title' => $member->title,
            'bio' => $member->bio,
            'image' => $member->image,
            'certifications' => $member->certifications,
            'experience_years' => $member->experience_years,
            'sort_order' => $member->sort_order,
            'active' => $member->active,
        ];
    }
}
