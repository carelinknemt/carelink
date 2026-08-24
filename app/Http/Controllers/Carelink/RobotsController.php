<?php

namespace App\Http\Controllers\Carelink;

use App\Http\Controllers\Controller;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    /**
     * Serve robots.txt dynamically so the sitemap URL follows APP_URL.
     */
    public function __invoke(): Response
    {
        $lines = [
            'User-agent: *',
            'Disallow:',
            '',
            'Sitemap: '.route('sitemap'),
            '',
        ];

        return response(implode(PHP_EOL, $lines))
            ->header('Content-Type', 'text/plain; charset=UTF-8');
    }
}
