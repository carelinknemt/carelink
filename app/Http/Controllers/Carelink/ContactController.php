<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Models\ContactMessage;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): RedirectResponse
    {
        ContactMessage::create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Thank you! Your message has been received and our team will get back to you shortly.',
        ]);

        return back();
    }
}
