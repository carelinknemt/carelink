<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Mail\ApplicationAccepted;
use App\Mail\ApplicationRejected;
use App\Models\Career;
use App\Models\CareerApplication;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardCareerApplicationController extends Controller
{
    private const PER_PAGE = 15;

    /**
     * Admin-only listing of employment applications, filterable by role.
     */
    public function index(Request $request): Response
    {

        $applications = CareerApplication::query()
            ->with('career:id,title')
            ->when($request->filled('role'), function (Builder $query) use ($request): void {
                $query->where('career_id', $request->integer('role'));
            })
            ->when($request->filled('search'), function (Builder $query) use ($request): void {
                $search = $request->string('search')->trim()->toString();

                $query->where(function (Builder $query) use ($search): void {
                    $query->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(self::PER_PAGE)
            ->withQueryString()
            ->through(fn (CareerApplication $application): array => $this->summary($application));

        return Inertia::render('dashboard/applications', [
            'applications' => $applications,
            'roles' => Career::ordered()->get(['id', 'title']),
            'filters' => [
                'role' => $request->integer('role') ?: null,
                'search' => $request->string('search')->trim()->toString() ?: null,
            ],
        ]);
    }

    /**
     * Downloads an applicant's resume from private storage.
     */
    public function resume(Request $request, CareerApplication $application): StreamedResponse
    {

        if (! $application->resume_path || ! Storage::disk('local')->exists($application->resume_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($application->resume_path, $application->resume_name ?? 'resume');
    }

    /**
     * Accepts an application and emails the applicant.
     */
    public function accept(Request $request, CareerApplication $application): RedirectResponse
    {
        $position = $application->career?->title;

        if ($position === null) {
            $position = 'the position';
        }

        Mail::to($application->email)->send(new ApplicationAccepted(
            name: $application->name,
            position: $application->career?->title,
        ));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$application->name} was accepted for {$position} and emailed.",
        ]);

        return back();
    }

    /**
     * Rejects an application and emails the applicant.
     */
    public function reject(Request $request, CareerApplication $application): RedirectResponse
    {
        $position = $application->career?->title;

        if ($position === null) {
            $position = 'the position';
        }

        Mail::to($application->email)->send(new ApplicationRejected(
            name: $application->name,
            position: $application->career?->title,
        ));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$application->name} was rejected for {$position} and emailed.",
        ]);

        return back();
    }

    /**
     * Removes an application.
     */
    public function destroy(Request $request, CareerApplication $application): RedirectResponse
    {

        $application->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "{$application->name}'s application was deleted.",
        ]);

        return back();
    }

    /**
     * @return array<string, mixed>
     */
    private function summary(CareerApplication $application): array
    {
        return [
            'id' => $application->id,
            'position' => $application->career?->title,
            'name' => $application->name,
            'email' => $application->email,
            'phone' => $application->phone,
            'cover_letter' => $application->cover_letter,
            'resume_name' => $application->resume_name,
            'submitted_at' => $application->created_at?->toIso8601String(),
        ];
    }
}
