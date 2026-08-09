<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\Career;
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
}
