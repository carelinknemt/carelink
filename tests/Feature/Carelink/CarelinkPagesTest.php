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
