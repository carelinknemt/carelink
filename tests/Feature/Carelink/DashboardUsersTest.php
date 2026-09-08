<?php

use App\Mail\KmsIntroMail;
use App\Mail\ResetPasswordMail;
use App\Models\Career;
use App\Models\CareerApplication;
use App\Models\TripRequest;
use App\Models\TripRequestAudit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Inertia\Testing\AssertableInertia as Assert;

function actingAsAdmin(): User
{
    $admin = User::factory()->admin()->create();

    test()->actingAs($admin);

    return $admin;
}

test('admins can view the user management page', function () {
    $manager = User::factory()->admin()->create();
    $this->actingAs($manager);

    $this->get(route('dashboard.users'))->assertOk();
});

test('admins can add users', function () {
    $manager = User::factory()->admin()->create();
    $this->actingAs($manager);

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertRedirect();

    expect(User::where('email', 'jane@example.com')->exists())->toBeTrue();
});

test('admins can ban or unban users', function () {
    $manager = User::factory()->admin()->create();
    $target = User::factory()->create();
    $this->actingAs($manager);

    $this->post(route('dashboard.users.ban-toggle', $target))->assertRedirect();

    expect($target->fresh()->banned_at)->not->toBeNull();
});

test('admins see the user list with an add action', function () {
    actingAsAdmin();

    User::factory()->count(3)->create();

    $this->get(route('dashboard.users'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->has('users.data', 4)
            ->has('filters')
            ->has('current_user_id'));
});

test('users can be filtered by role', function () {
    $admin = actingAsAdmin();

    User::factory()->admin()->create(['name' => 'Jane Admin', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Dispatcher', 'email' => 'john@example.com']);
    User::factory()->manager()->create(['name' => 'Joan Manager', 'email' => 'joan@example.com']);

    $this->get(route('dashboard.users', ['role' => 'admin']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->where('filters.role', 'admin')
            ->has('users.data', 2));

    $this->get(route('dashboard.users', ['role' => 'dispatcher']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->where('filters.role', 'dispatcher')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Dispatcher'));

    $this->get(route('dashboard.users', ['role' => 'manager']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->where('filters.role', 'manager')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Joan Manager'));
});

test('users can be searched by name or email', function () {
    actingAsAdmin();

    User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Smith', 'email' => 'john@example.com']);

    $this->get(route('dashboard.users', ['search' => 'jane']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->has('users.data', 1)
            ->where('users.data.0.name', 'Jane Doe'));
});

test('adding a user sends reset and knowledge base links and no usable password', function () {
    Mail::fake();
    actingAsAdmin();

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
        'role' => 'admin',
    ])->assertRedirect();

    $user = User::where('email', 'jane@example.com')->first();

    expect($user)
        ->not->toBeNull()
        ->role->toBe('admin');

    expect(Hash::check('password', $user->password))->toBeFalse();

    Mail::assertSent(ResetPasswordMail::class, fn ($mail) => $mail->hasTo('jane@example.com'));
    Mail::assertSent(KmsIntroMail::class, fn ($mail) => $mail->hasTo('jane@example.com'));
});

test('new users default to dispatcher role when no role is specified', function () {
    actingAsAdmin();

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertRedirect();

    $user = User::where('email', 'jane@example.com')->first();

    expect($user->role)->toBe(User::ROLE_DISPATCHER);
});

test('adding a user rejects an email that is already registered', function () {
    actingAsAdmin();

    User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertSessionHasErrors('email');
});

test('an admin can change another user\'s role', function () {
    $admin = actingAsAdmin();
    $target = User::factory()->create(['role' => User::ROLE_DISPATCHER]);

    $this->patch(route('dashboard.users.update-role', $target), [
        'role' => User::ROLE_MANAGER,
    ])->assertRedirect();

    expect($target->fresh()->role)->toBe(User::ROLE_MANAGER);
});

test('an admin cannot change their own role', function () {
    $admin = actingAsAdmin();

    $this->patch(route('dashboard.users.update-role', $admin), [
        'role' => User::ROLE_MANAGER,
    ])->assertRedirect();

    expect($admin->fresh()->role)->toBe(User::ROLE_ADMIN);
});

test('role update rejects invalid roles', function () {
    $admin = actingAsAdmin();
    $target = User::factory()->create();

    $this->patch(route('dashboard.users.update-role', $target), [
        'role' => 'not-a-role',
    ])->assertSessionHasErrors('role');
});

test('banning a user sets banned_at and blocks future logins', function () {
    $target = User::factory()->create(['password' => Hash::make('secret')]);
    actingAsAdmin();

    $this->post(route('dashboard.users.ban-toggle', $target))
        ->assertRedirect();

    expect($target->fresh()->banned_at)->not->toBeNull();

    $this->post(route('logout'));

    $this->post(route('login'), [
        'email' => $target->email,
        'password' => 'secret',
    ])->assertSessionHasErrors('email');

    expect(auth()->check())->toBeFalse();
});

test('unbanning a user clears banned_at so they can sign in again', function () {
    $target = User::factory()->banned()->create();
    actingAsAdmin();

    $this->post(route('dashboard.users.ban-toggle', $target))
        ->assertRedirect();

    expect($target->fresh()->banned_at)->toBeNull();
});

test('an admin cannot ban their own account', function () {
    $admin = actingAsAdmin();

    $this->post(route('dashboard.users.ban-toggle', $admin))
        ->assertRedirect();

    expect($admin->fresh()->banned_at)->toBeNull();
});

test('a banned user is signed out on their next request', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $user->update(['banned_at' => now()]);

    $this->get(route('dashboard'))
        ->assertRedirect(route('login'));
});

test('the user summary returns role instead of is_admin', function () {
    $admin = actingAsAdmin();

    $this->get(route('dashboard.users'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('users.data.0.role')
            ->where('users.data.0.role', User::ROLE_ADMIN));
});

test('admins can view a user detail page', function () {
    $admin = actingAsAdmin();
    $target = User::factory()->create(['name' => 'Jane Doe', 'email' => 'jane@example.com']);

    $this->get(route('dashboard.users.show', $target))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users/show')
            ->where('user.name', 'Jane Doe')
            ->where('user.email', 'jane@example.com')
            ->where('current_user_id', $admin->id)
            ->has('applications')
            ->has('audits'));
});

test('user detail shows the user\'s job applications and booking activity', function () {
    $target = User::factory()->create();
    actingAsAdmin();
    $career = Career::factory()->create(['title' => 'Medical Transport Driver']);

    CareerApplication::create([
        'career_id' => $career->id,
        'user_id' => $target->id,
        'name' => $target->name,
        'email' => $target->email,
        'phone' => '(707) 555-0192',
        'cover_letter' => 'I would love to join the team.',
        'resume_path' => 'resumes/example.pdf',
        'resume_name' => 'resume.pdf',
    ]);

    $trip = TripRequest::factory()->create();
    TripRequestAudit::create([
        'trip_request_id' => $trip->id,
        'user_id' => $target->id,
        'user_name' => $target->name,
        'role' => $target->role,
        'action' => TripRequestAudit::ACTION_STATUS_CHANGED,
        'from_value' => TripRequest::STATUS_PENDING_DISPATCH,
        'to_value' => TripRequest::STATUS_IN_TRANSIT,
    ]);

    $this->get(route('dashboard.users.show', $target))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users/show')
            ->has('applications', 1)
            ->where('applications.0.position', 'Medical Transport Driver')
            ->where('applications.0.resume_name', 'resume.pdf')
            ->has('audits', 1)
            ->where('audits.0.booking_number', $trip->booking_number)
            ->where('audits.0.action', TripRequestAudit::ACTION_STATUS_CHANGED));
});

test('user detail profile includes verification, two-factor, and sessions', function () {
    $target = User::factory()->create();
    actingAsAdmin();

    $this->get(route('dashboard.users.show', $target))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users/show')
            ->has('user.email_verified_at')
            ->has('user.two_factor_enabled')
            ->has('user.sessions_count'));
});

test('managers cannot access the user detail page', function () {
    $manager = User::factory()->manager()->create();
    $target = User::factory()->create();
    $this->actingAs($manager);

    $this->get(route('dashboard.users.show', $target))->assertRedirect();
});
