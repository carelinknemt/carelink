<?php

use App\Models\Career;
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

test('the privacy policy page renders with the public layout', function () {
    $this->get(route('privacy'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('privacy'));
});

test('the careers page exposes job benefits', function () {
    $career = Career::factory()->create([
        'benefits' => ['Health insurance stipend', 'Paid drive time'],
    ]);

    $this->get(route('careers'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('careers')
            ->where('careers.0.id', $career->id)
            ->where('careers.0.benefits', ['Health insurance stipend', 'Paid drive time']));
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

test('the booking form exposes the standard and ambulatory booking fees', function () {
    $this->get(route('book'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('book')
            ->has('booking_fee.standard')
            ->has('booking_fee.ambulatory')
            ->where('booking_fee.standard.amount_cents', 3000)
            ->where('booking_fee.standard.dollars', '$30.00')
            ->where('booking_fee.ambulatory.amount_cents', 2000)
            ->where('booking_fee.ambulatory.dollars', '$20.00'));
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
