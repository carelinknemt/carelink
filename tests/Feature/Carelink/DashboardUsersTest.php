<?php

use App\Models\User;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

function actingAsAdmin(): User
{
    $admin = User::factory()->admin()->create();

    test()->actingAs($admin);

    return $admin;
}

test('only admins can view the user management page', function () {
    $manager = User::factory()->create();
    $this->actingAs($manager);

    $this->get(route('dashboard.users'))->assertForbidden();
});

test('only admins can add users', function () {
    $manager = User::factory()->create();
    $this->actingAs($manager);

    $this->post(route('dashboard.users.store'), [
        'name' => 'Jane Doe',
        'email' => 'jane@example.com',
    ])->assertForbidden();

    expect(User::where('email', 'jane@example.com')->exists())->toBeFalse();
});

test('only admins can ban or unban users', function () {
    $manager = User::factory()->create();
    $target = User::factory()->create();
    $this->actingAs($manager);

    $this->post(route('dashboard.users.ban-toggle', $target))->assertForbidden();

    expect($target->fresh()->banned_at)->toBeNull();
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

test('adding a user sends a password reset link and no usable password', function () {
    Notification::fake();
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

    Notification::assertSentTo($user, ResetPassword::class);
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
