<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Carelink Company Information
    |--------------------------------------------------------------------------
    |
    | Shared operational details used across the dispatch, booking, and
    | public-facing pages of the NEMT platform.
    |
    */

    'name' => 'Carelink Medical Transportation LLC',

    'tagline' => 'Connecting Patients to Better Health Every Mile with Compassion. Every Trip with Purpose.',

    'headquarters' => 'Eureka, California',

    'phone' => '(707) 854-9350',

    'dispatch_phone' => '(707) 854-9350',

    'email' => 'dispatch@carelinknemt.com',

    'address' => '3857 Walnut Drive, Suite B, Eureka, CA 95503',

    'service_region' => 'Northern California Region (Humboldt, Del Norte, Trinity, & Shasta Counties)',

    'counties' => ['Humboldt', 'Del Norte', 'Trinity', 'Shasta'],

    'logo_url' => env('CARELINK_LOGO_URL', '/images/cllogo.png'),

];
