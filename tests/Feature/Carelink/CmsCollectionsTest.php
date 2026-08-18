<?php

use App\Models\BlogPost;
use App\Models\Faq;
use App\Models\FleetVehicle;
use App\Models\Service;
use App\Models\TeamMember;
use App\Models\User;

test('admins can create a service with line-break lists', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.services.store'), [
        'slug' => 'wheelchair-transport',
        'category' => 'MEDICAL',
        'title' => 'Wheelchair Transport',
        'short_description' => 'ADA wheelchair van rides.',
        'benefits' => "Hydraulic lift\nPASS-certified driver",
        'base_rate' => '45.00',
        'mileage_rate' => '3.50',
        'sort_order' => '1',
        'active' => '1',
    ])->assertRedirect();

    $service = Service::first();

    expect($service)
        ->title->toBe('Wheelchair Transport')
        ->benefits->toBe(['Hydraulic lift', 'PASS-certified driver'])
        ->base_rate->toBe('45.00')
        ->active->toBeTrue();

    $this->assertDatabaseCount('services', 1);
});

test('admins can update and delete a service', function () {
    $admin = User::factory()->admin()->create();
    $service = Service::factory()->create();

    $this->actingAs($admin)
        ->put(route('cms.services.update', $service), [
            'slug' => $service->slug,
            'category' => 'SPECIALTY',
            'title' => 'Renamed Service',
            'short_description' => 'Updated.',
            'active' => '0',
        ])
        ->assertRedirect();

    expect($service->fresh())
        ->title->toBe('Renamed Service')
        ->category->toBe('SPECIALTY')
        ->active->toBeFalse();

    $this->actingAs($admin)
        ->delete(route('cms.services.destroy', $service))
        ->assertRedirect();

    $this->assertDatabaseMissing('services', ['id' => $service->id]);
});

test('admins can create a team member', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.team.store'), [
        'name' => 'Jane Dispatch',
        'role' => 'Dispatch Manager',
        'bio' => 'Leads the dispatch team.',
        'certifications' => "PASS\nCPR",
        'active' => '1',
    ])->assertRedirect();

    $member = TeamMember::first();

    expect($member)
        ->name->toBe('Jane Dispatch')
        ->certifications->toBe(['PASS', 'CPR']);
});

test('admins can create a fleet vehicle', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.fleet.store'), [
        'name' => 'BraunAbility Wheelchair Van',
        'type' => 'WHEELCHAIR',
        'capacity' => '4 passengers',
        'features' => "Hydraulic lift\nWheelchair securement",
        'active' => '1',
    ])->assertRedirect();

    expect(FleetVehicle::first())
        ->name->toBe('BraunAbility Wheelchair Van')
        ->features->toBe(['Hydraulic lift', 'Wheelchair securement']);
});

test('admins can create a faq', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.faqs.store'), [
        'question' => 'Do you bill Medi-Cal?',
        'answer' => 'Not yet; trips booked online are private pay.',
        'category' => 'GENERAL',
        'active' => '1',
    ])->assertRedirect();

    expect(Faq::first())
        ->question->toBe('Do you bill Medi-Cal?')
        ->category->toBe('GENERAL');
});

test('admins can create a blog post', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)->post(route('cms.blog.store'), [
        'title' => 'Dialysis Ride Tips',
        'slug' => 'dialysis-ride-tips',
        'category' => 'WHEELCHAIR CARE',
        'summary' => 'How to prepare for your ride.',
        'content' => 'Arrive ten minutes early...',
        'published_at' => '2026-08-18',
        'active' => '1',
    ])->assertRedirect();

    $post = BlogPost::first();

    expect($post)
        ->title->toBe('Dialysis Ride Tips')
        ->and($post->getRawOriginal('published_at'))
        ->toStartWith('2026-08-18');
});

test('collection endpoints reject invalid input', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->post(route('cms.services.store'), ['title' => 'Missing Fields'])
        ->assertSessionHasErrors(['slug', 'category', 'short_description']);

    $this->actingAs($admin)
        ->post(route('cms.fleet.store'), [
            'name' => 'Bad Type',
            'type' => 'SPACESHIP',
        ])
        ->assertSessionHasErrors('type');
});
