<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBusinessPartnerRequestRequest;
use App\Models\BusinessPartnerRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class BusinessPartnerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('business', [
            'business_types' => BusinessPartnerRequest::BUSINESS_TYPES,
        ]);
    }

    public function store(StoreBusinessPartnerRequestRequest $request): RedirectResponse
    {
        BusinessPartnerRequest::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Your inquiry was submitted successfully. Our team will reach out to you soon.',
        ]);

        return back();
    }
}
