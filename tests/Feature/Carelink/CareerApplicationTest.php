<?php

use App\Models\Career;
use App\Models\CareerApplication;

test('an employment application can be submitted for a position', function () {
    $career = Career::factory()->create();

    $this->post(route('careers.apply'), [
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'I would love to join the Carelink team as a driver.',
    ])->assertRedirect();

    $application = CareerApplication::first();

    expect($application)
        ->not->toBeNull()
        ->name->toBe('Jane Doe')
        ->email->toBe('jane@example.com')
        ->phone->toBe('(555) 123-4567')
        ->cover_letter->toContain('join the Carelink team')
        ->career_id->toBe($career->id);
});

test('a general application can be submitted without a position', function () {
    $this->post(route('careers.apply'), [
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'General application for future opportunities.',
    ])->assertRedirect();

    $this->assertDatabaseHas('career_applications', [
        'name' => 'John Smith',
        'career_id' => null,
    ]);
});

test('the employment application form validates required fields', function () {
    $this->post(route('careers.apply'), [])
        ->assertSessionHasErrors([
            'name',
            'email',
            'phone',
            'cover_letter',
        ]);

    $this->assertDatabaseCount('career_applications', 0);
});

test('an application cannot reference an unknown position', function () {
    $this->post(route('careers.apply'), [
        'career_id' => 9999,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello from Jane.',
    ])->assertSessionHasErrors(['career_id']);

    $this->assertDatabaseCount('career_applications', 0);
});
