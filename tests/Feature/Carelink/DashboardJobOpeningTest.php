<?php

use App\Models\Career;
use App\Models\CareerApplication;
use App\Models\User;

test('guests are redirected from the job openings dashboard', function () {
    $this->get(route('dashboard.job-openings'))->assertRedirect(route('login'));
});

test('any authenticated user can manage job openings', function () {
    $user = User::factory()->admin()->create();
    $career = Career::factory()->create();

    $this->actingAs($user)
        ->get(route('dashboard.job-openings'))
        ->assertOk();

    $this->actingAs($user)
        ->post(route('dashboard.job-openings.store'), ['title' => 'Driver'])
        ->assertRedirect();

    $this->actingAs($user)
        ->put(route('dashboard.job-openings.update', $career), ['title' => 'Driver'])
        ->assertRedirect();

    $this->actingAs($user)
        ->post(route('dashboard.job-openings.toggle', $career))
        ->assertRedirect();

    $this->actingAs($user)
        ->delete(route('dashboard.job-openings.destroy', $career))
        ->assertRedirect();
});

test('admins can post a job opening', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('dashboard.job-openings.store'), [
        'title' => 'Medical Transport Driver',
        'location' => 'Eureka, CA',
        'employment_type' => 'Full-Time',
        'summary' => 'Drive patients to appointments.',
        'requirements' => "PASS certification\nValid CA driver license",
        'benefits' => "Health insurance stipend\nPaid drive time",
        'sort_order' => '2',
    ])->assertRedirect();

    $opening = Career::first();

    expect($opening)
        ->title->toBe('Medical Transport Driver')
        ->location->toBe('Eureka, CA')
        ->employment_type->toBe('Full-Time')
        ->active->toBeTrue()
        ->sort_order->toBe(2)
        ->requirements->toBe(['PASS certification', 'Valid CA driver license'])
        ->benefits->toBe(['Health insurance stipend', 'Paid drive time']);

    $this->assertDatabaseCount('careers', 1);
});

test('admins can update a job opening', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create(['title' => 'Old Title']);

    $this->actingAs($admin)->put(route('dashboard.job-openings.update', $career), [
        'title' => 'New Title',
        'location' => 'Arcata, CA',
        'employment_type' => 'Part-Time',
        'summary' => 'Updated summary.',
        'requirements' => "New requirement\nAnother one",
        'benefits' => "Flexible schedule\nPaid training",
        'sort_order' => '1',
    ])->assertRedirect();

    expect($career->fresh())
        ->title->toBe('New Title')
        ->location->toBe('Arcata, CA')
        ->employment_type->toBe('Part-Time')
        ->requirements->toBe(['New requirement', 'Another one'])
        ->benefits->toBe(['Flexible schedule', 'Paid training']);
});

test('a job opening may be created without benefits', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('dashboard.job-openings.store'), [
        'title' => 'Dispatcher',
        'location' => 'Eureka, CA',
        'employment_type' => 'Full-Time',
        'summary' => 'Coordinate the dispatch desk.',
        'requirements' => 'Multi-line phone experience',
        'sort_order' => '3',
    ])->assertRedirect();

    $opening = Career::first();

    expect($opening)
        ->benefits->toBe([])
        ->requirements->toBe(['Multi-line phone experience']);
});

test('admins can close and reopen a job opening', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create();

    $this->actingAs($admin)
        ->post(route('dashboard.job-openings.toggle', $career))
        ->assertRedirect();

    expect($career->fresh()->active)->toBeFalse();

    $this->actingAs($admin)
        ->post(route('dashboard.job-openings.toggle', $career))
        ->assertRedirect();

    expect($career->fresh()->active)->toBeTrue();
});

test('admins can delete a job opening', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create();

    $this->actingAs($admin)
        ->delete(route('dashboard.job-openings.destroy', $career))
        ->assertRedirect();

    $this->assertDatabaseMissing('careers', ['id' => $career->id]);
});

test('the job openings list shows application counts', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create();

    CareerApplication::create([
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello.',
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard.job-openings'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/job-openings')
            ->has('openings', 1)
            ->where('openings.0.title', $career->title)
            ->where('openings.0.applications_count', 1));
});
