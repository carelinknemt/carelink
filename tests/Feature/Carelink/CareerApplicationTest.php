<?php

use App\Models\Career;
use App\Models\CareerApplication;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

test('an employment application can be submitted for a position', function () {
    Storage::fake('local');

    $career = Career::factory()->create();

    $this->post(route('careers.apply'), [
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'I would love to join the Carelink team as a driver.',
        'resume' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    $application = CareerApplication::first();

    expect($application)
        ->not->toBeNull()
        ->name->toBe('Jane Doe')
        ->email->toBe('jane@example.com')
        ->phone->toBe('(555) 123-4567')
        ->cover_letter->toContain('join the Carelink team')
        ->career_id->toBe($career->id)
        ->resume_name->toBe('resume.pdf');

    Storage::disk('local')->assertExists($application->resume_path);
});

test('an employment application is linked to a signed-in applicant', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $career = Career::factory()->create();

    $this->actingAs($user)->post(route('careers.apply'), [
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Looking forward to joining the team.',
        'resume' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
    ])->assertRedirect();

    expect(CareerApplication::first()->user_id)->toBe($user->id);
});

test('an application requires a specific position', function () {
    Storage::fake('local');

    $this->post(route('careers.apply'), [
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'Application for a specific role.',
        'resume' => UploadedFile::fake()->create('resume.pdf', 100, 'application/pdf'),
    ])->assertSessionHasErrors(['career_id']);

    $this->assertDatabaseCount('career_applications', 0);
});

test('the employment application form validates required fields', function () {
    $this->post(route('careers.apply'), [])
        ->assertSessionHasErrors([
            'career_id',
            'name',
            'email',
            'phone',
            'cover_letter',
            'resume',
        ]);

    $this->assertDatabaseCount('career_applications', 0);
});

test('an application requires a resume in an allowed format', function () {
    $career = Career::factory()->create();

    $this->post(route('careers.apply'), [
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello from Jane.',
        'resume' => UploadedFile::fake()->create('resume.txt', 100, 'text/plain'),
    ])->assertSessionHasErrors(['resume']);

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
