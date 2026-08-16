<?php

use App\Models\Career;
use App\Models\CareerApplication;
use App\Models\User;
use Illuminate\Support\Facades\Storage;

test('guests are redirected from the career applications dashboard', function () {
    $this->get(route('dashboard.career-applications'))->assertRedirect(route('login'));
});

test('a user sees only their own applications', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();
    $career = Career::factory()->create();

    $mine = CareerApplication::create([
        'career_id' => $career->id,
        'user_id' => $user->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'My application.',
        'resume_path' => 'resumes/mine.pdf',
        'resume_name' => 'mine.pdf',
    ]);

    CareerApplication::create([
        'career_id' => $career->id,
        'user_id' => $other->id,
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'Someone else\'s application.',
        'resume_path' => 'resumes/theirs.pdf',
        'resume_name' => 'theirs.pdf',
    ]);

    $this->actingAs($user)
        ->get(route('dashboard.career-applications'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/career-applications')
            ->has('applications', 1)
            ->where('applications.0.id', $mine->id)
            ->where('applications.0.resume_name', 'mine.pdf'));
});

test('a user cannot download another user\'s resume', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $other = User::factory()->create();
    $career = Career::factory()->create();

    $otherApplication = CareerApplication::create([
        'career_id' => $career->id,
        'user_id' => $other->id,
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'Hello.',
        'resume_path' => 'resumes/theirs.pdf',
        'resume_name' => 'theirs.pdf',
    ]);

    Storage::disk('local')->put('resumes/theirs.pdf', 'pdf-bytes');

    $this->actingAs($user)
        ->get(route('dashboard.career-applications.resume', $otherApplication))
        ->assertForbidden();
});

test('a user can download their own resume', function () {
    Storage::fake('local');

    $user = User::factory()->create();
    $career = Career::factory()->create();

    $application = CareerApplication::create([
        'career_id' => $career->id,
        'user_id' => $user->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello.',
        'resume_path' => 'resumes/mine.pdf',
        'resume_name' => 'mine.pdf',
    ]);

    Storage::disk('local')->put('resumes/mine.pdf', 'pdf-bytes');

    $this->actingAs($user)
        ->get(route('dashboard.career-applications.resume', $application))
        ->assertOk()
        ->assertDownload('mine.pdf');
});
