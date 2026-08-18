<?php

use App\Models\Service;

test('the home page renders with seeded services', function () {
    $service = Service::factory()->create();

    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('home')
            ->has('services', 1)
            ->where('services.0.title', $service->title)
            ->has('team'));
});

test('the trip request page renders the booking form', function () {
    $this->get(route('book'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('book'));
});

test('the terms page renders with the public layout', function () {
    $this->get(route('terms'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('terms'));
});

test('the admin route redirects to the login page', function () {
    $this->get('/admin')->assertRedirect(route('login'));
});

test('unknown pages render the public error page with the status code', function () {
    $this->get('/this-page-does-not-exist')
        ->assertNotFound()
        ->assertInertia(fn ($page) => $page
            ->component('error')
            ->where('status', 404));
});

test('the booking form exposes wheelchair and ambulatory pricing rates by transport type', function () {
    Service::factory()->create([
        'slug' => 'wheelchair-transport',
        'title' => 'Wheelchair Transport',
        'base_rate' => 45,
        'mileage_rate' => 3.5,
    ]);
    Service::factory()->create([
        'slug' => 'ambulatory-sedan',
        'title' => 'Ambulatory Sedan',
        'base_rate' => 20,
        'mileage_rate' => 2.5,
    ]);

    $this->get(route('book'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('transport_rates')
            ->where('transport_rates.ambulatory.base_rate', 20)
            ->where('transport_rates.ambulatory.mileage_rate', 2.5)
            ->where('transport_rates.wheelchair.base_rate', 45)
            ->where('transport_rates.wheelchair.mileage_rate', 3.5)
            ->where('transport_rates.wheelchair xl.base_rate', 45)
            ->where('transport_rates.broda chair.base_rate', 45)
            ->where('transport_rates.geri chair.mileage_rate', 3.5));
});

test('public pages render with their content', function (string $route, string $component, string $prop) {
    $this->get(route($route))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component($component)->has($prop));
})->with([
    'services page' => ['services', 'services', 'services'],
    'fleet page' => ['fleet', 'fleet', 'fleet'],
    'about page' => ['about', 'about', 'team'],
    'faqs page' => ['faq', 'faqs', 'faqs'],
    'blog page' => ['blog', 'blog', 'posts'],
    'careers page' => ['careers', 'careers', 'careers'],
]);
