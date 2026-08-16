<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\CareerApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DashboardCareerApplicationController extends Controller
{
    /**
     * Lists the signed-in applicant's own job applications.
     */
    public function index(Request $request): Response
    {
        $applications = CareerApplication::query()
            ->where('user_id', $request->user()->id)
            ->with('career:id,title')
            ->latest()
            ->get()
            ->map(fn (CareerApplication $application): array => $this->summary($application));

        return Inertia::render('dashboard/career-applications', [
            'applications' => $applications,
        ]);
    }

    /**
     * Downloads the applicant's own resume from private storage.
     */
    public function resume(Request $request, CareerApplication $application): StreamedResponse
    {
        abort_unless($application->user_id === $request->user()->id, 403);

        if (! $application->resume_path || ! Storage::disk('local')->exists($application->resume_path)) {
            abort(404);
        }

        return Storage::disk('local')->download($application->resume_path, $application->resume_name ?? 'resume');
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
            'resume_path' => $application->resume_path,
            'resume_name' => $application->resume_name,
            'submitted_at' => $application->created_at?->toIso8601String(),
        ];
    }
}
