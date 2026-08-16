<?php

use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Laravel\Fortify\Features;

beforeEach(function () {
    $this->skipUnlessFortifyHas(Features::resetPasswords());
});

test('reset password link screen can be rendered', function () {
    $response = $this->get(route('password.request'));

    $response->assertOk();
});

test('reset password link can be requested', function () {
    Mail::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    Mail::assertSent(ResetPasswordMail::class, fn ($mail) => $mail->hasTo($user->email));
});

test('reset password screen can be rendered', function () {
    Mail::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $sentMail = null;
    Mail::assertSent(ResetPasswordMail::class, function ($mail) use (&$sentMail) {
        $sentMail = $mail;

        return true;
    });

    $token = collect(explode('/', parse_url($sentMail->resetUrl, PHP_URL_PATH) ?? ''))->last();

    $response = $this->get(route('password.reset', $token));

    $response->assertOk();
});

test('password can be reset with valid token', function () {
    Mail::fake();

    $user = User::factory()->create();

    $this->post(route('password.email'), ['email' => $user->email]);

    $sentMail = null;
    Mail::assertSent(ResetPasswordMail::class, function ($mail) use (&$sentMail) {
        $sentMail = $mail;

        return true;
    });

    $token = collect(explode('/', parse_url($sentMail->resetUrl, PHP_URL_PATH) ?? ''))->last();

    $response = $this->post(route('password.update'), [
        'token' => $token,
        'email' => $user->email,
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('login'));
});

test('password cannot be reset with invalid token', function () {
    $user = User::factory()->create();

    $response = $this->post(route('password.update'), [
        'token' => 'invalid-token',
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertSessionHasErrors('email');
});
