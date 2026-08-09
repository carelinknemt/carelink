<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use App\Models\FleetVehicle;
use Inertia\Inertia;
use Inertia\Response;

class FleetController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('fleet', [
            'fleet' => FleetVehicle::active()->ordered()->get(),
        ]);
    }
}
