<?php

use App\Mail\KmsIntroMail;
use App\Mail\ResetPasswordMail;
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

test('any authenticated user can view the user management page', function () {
    $manager = User::factory()->create();
    $this->actingAs($manager);

    $this->get(route('dashboard.users'))->assertOk();
});

test('any authenticated user can add users', function () {
    $manager = User::factory()->create();
    $this->actingAs($manager);

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertRedirect();

    expect(User::where('email', 'jane@example.com')->exists())->toBeTrue();
});

test('any authenticated user can ban or unban users', function () {
    $manager = User::factory()->create();
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
    actingAsAdmin();

    User::factory()->admin()->create(['name' => 'Jane Admin', 'email' => 'jane@example.com']);
    User::factory()->create(['name' => 'John Member', 'email' => 'john@example.com']);

    $this->get(route('dashboard.users', ['role' => 'admin']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->where('filters.role', 'admin')
            ->has('users.data', 2)
            ->where('users.data', fn ($users) => collect($users)
                ->pluck('name')
                ->contains('Jane Admin')));

    $this->get(route('dashboard.users', ['role' => 'member']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard/users')
            ->where('filters.role', 'member')
            ->has('users.data', 1)
            ->where('users.data', fn ($users) => collect($users)
                ->pluck('name')
                ->contains('John Member')));
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
        'is_admin' => 1,
    ])->assertRedirect();

    $user = User::where('email', 'jane@example.com')->first();

    expect($user)
        ->not->toBeNull()
        ->is_admin->toBeTrue();

    expect(Hash::check('password', $user->password))->toBeFalse();

    Mail::assertSent(ResetPasswordMail::class, fn ($mail) => $mail->hasTo('jane@example.com'));
    Mail::assertSent(KmsIntroMail::class, fn ($mail) => $mail->hasTo('jane@example.com'));
});

test('adding a user rejects an email that is already registered', function () {
    actingAsAdmin();

    User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertSessionHasErrors('email');
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
