<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCareerApplicationRequest;
use App\Models\Career;
use App\Models\CareerApplication;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CareersController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('careers', [
            'careers' => Career::active()->ordered()->get(),
        ]);
    }

    public function store(StoreCareerApplicationRequest $request): RedirectResponse
    {
        $resume = $request->file('resume');

        CareerApplication::create([
            'career_id' => $request->validated('career_id'),
            'user_id' => $request->user()?->id,
            'name' => $request->validated('name'),
            'email' => $request->validated('email'),
            'phone' => $request->validated('phone'),
            'cover_letter' => $request->validated('cover_letter'),
            'resume_path' => $resume->store('resumes', 'local'),
            'resume_name' => Str::limit($resume->getClientOriginalName(), 255),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Application submitted successfully. Our team will contact you soon.',
        ]);

        return back();
    }
}
