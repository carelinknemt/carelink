<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCareerApplicationRequest;
use App\Models\Career;
use App\Models\CareerApplication;
use Illuminate\Http\RedirectResponse;
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
        CareerApplication::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Application submitted successfully. Our team will contact you soon.',
        ]);

        return back();
    }
}
