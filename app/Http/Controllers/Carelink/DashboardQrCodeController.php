<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardQrCodeController extends Controller
{
    /**
     * Admin-only QR code generator for arbitrary links.
     */
    public function index(): Response
    {
        return Inertia::render('dashboard/qr-codes');
    }
}
