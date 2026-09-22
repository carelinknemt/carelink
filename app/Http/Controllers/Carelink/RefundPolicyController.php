<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class RefundPolicyController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('refund-policy');
    }
}
