<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class KmsController extends Controller
{
    /**
     * Employee knowledge base: how to use every dashboard page.
     */
    public function index(): Response
    {
        return Inertia::render('kms');
    }
}
