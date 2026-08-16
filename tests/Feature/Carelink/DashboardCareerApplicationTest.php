<?php

use App\Mail\ApplicationAccepted;
use App\Mail\ApplicationRejected;
use App\Models\Career;
use App\Models\CareerApplication;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

test('guests are redirected from the applications dashboard', function () {
    $this->get(route('dashboard.applications'))->assertRedirect(route('login'));
});

test('non-admins cannot view, download, delete, accept, or reject applications', function () {
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

    $this->actingAs($user)->get(route('dashboard.applications'))->assertForbidden();
    $this->actingAs($user)->get(route('dashboard.applications.resume', $application))->assertForbidden();
    $this->actingAs($user)->delete(route('dashboard.applications.destroy', $application))->assertForbidden();
    $this->actingAs($user)->post(route('dashboard.applications.accept', $application))->assertForbidden();
    $this->actingAs($user)->post(route('dashboard.applications.reject', $application))->assertForbidden();
});

test('admins see every application and can filter by role', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create(['title' => 'Medical Transport Driver']);
    $otherCareer = Career::factory()->create(['title' => 'Dispatcher']);

    CareerApplication::create([
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'My application.',
        'resume_path' => 'resumes/mine.pdf',
        'resume_name' => 'mine.pdf',
    ]);

    CareerApplication::create([
        'career_id' => $otherCareer->id,
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'Another application.',
        'resume_path' => 'resumes/theirs.pdf',
        'resume_name' => 'theirs.pdf',
    ]);

    $this->actingAs($admin)
        ->get(route('dashboard.applications'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('dashboard/applications')
            ->has('applications.data', 2)
            ->has('roles', 2));

    $this->actingAs($admin)
        ->get(route('dashboard.applications', ['role' => $career->id]))
        ->assertInertia(fn ($page) => $page
            ->has('applications.data', 1)
            ->where('applications.data.0.name', 'Jane Doe'));
});

test('admins can download an applicant resume and delete an application', function () {
    Storage::fake('local');

    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create();

    $application = CareerApplication::create([
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello.',
        'resume_path' => 'resumes/mine.pdf',
        'resume_name' => 'mine.pdf',
    ]);

    Storage::disk('local')->put('resumes/mine.pdf', 'pdf-bytes');

    $this->actingAs($admin)
        ->get(route('dashboard.applications.resume', $application))
        ->assertOk()
        ->assertDownload('mine.pdf');

    $this->actingAs($admin)
        ->delete(route('dashboard.applications.destroy', $application))
        ->assertRedirect();

    $this->assertDatabaseMissing('career_applications', ['id' => $application->id]);
});

test('accepting an application emails the applicant', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create(['title' => 'Medical Transport Driver']);

    $application = CareerApplication::create([
        'career_id' => $career->id,
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '(555) 123-4567',
        'cover_letter' => 'Hello.',
    ]);

    Mail::fake();

    $this->actingAs($admin)
        ->post(route('dashboard.applications.accept', $application))
        ->assertRedirect();

    Mail::assertSent(ApplicationAccepted::class, function (ApplicationAccepted $mail): bool {
        return $mail->hasTo('jane@example.com')
            && $mail->name === 'Jane Doe'
            && $mail->position === 'Medical Transport Driver';
    });
});

test('rejecting an application emails the applicant', function () {
    $admin = User::factory()->admin()->create();
    $career = Career::factory()->create(['title' => 'Medical Transport Driver']);

    $application = CareerApplication::create([
        'career_id' => $career->id,
        'name' => 'John Smith',
        'email' => 'john@example.com',
        'phone' => '(707) 555-0192',
        'cover_letter' => 'Hello.',
    ]);

    Mail::fake();

    $this->actingAs($admin)
        ->post(route('dashboard.applications.reject', $application))
        ->assertRedirect();

    Mail::assertSent(ApplicationRejected::class, function (ApplicationRejected $mail): bool {
        return $mail->hasTo('john@example.com')
            && $mail->name === 'John Smith'
            && $mail->position === 'Medical Transport Driver';
    });
});
