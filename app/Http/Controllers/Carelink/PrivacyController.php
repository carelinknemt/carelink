<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class PrivacyController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('privacy');
    }
}
