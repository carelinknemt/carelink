<?php

use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use App\Models\User;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\URL;

test('forgot password sends the branded reset email with a reset link', function () {
    Mail::fake();
    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('password.email'), ['email' => 'jane@example.com']);

    Mail::assertSent(ResetPasswordMail::class, function (ResetPasswordMail $mail) {
        expect($mail->hasTo('jane@example.com'))->toBeTrue()
            ->and($mail->envelope()->subject)->toBe('CareLink Password Reset')
            ->and($mail->resetUrl)->toContain('/reset-password/')
            ->and($mail->resetUrl)->toContain('email=jane%40example.com');

        return true;
    });
});

test('the password reset link from the email renders the reset page', function () {
    Mail::fake();
    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->post(route('password.email'), ['email' => 'jane@example.com']);

    $token = Password::broker()->getRepository()->recentlyCreatedToken($user);

    expect($token)->not->toBeNull();

    $this->get(route('password.reset', ['token' => $token]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('auth/reset-password'));
});

test('resending the verification email from the verify page sends the branded email', function () {
    Mail::fake();
    $user = User::factory()->unverified()->create(['email' => 'jane@example.com']);

    $this->actingAs($user)->post(route('verification.send'));

    Mail::assertSent(VerifyEmailMail::class, function (VerifyEmailMail $mail) {
        expect($mail->envelope()->subject)->toBe('CareLink Email Verification')
            ->and($mail->verificationUrl)->toContain('/email/verify/');

        return true;
    });
});

test('the verification link from the email marks the account verified', function () {
    $user = User::factory()->unverified()->create(['email' => 'jane@example.com']);

    $url = URL::temporarySignedRoute(
        'verification.verify',
        now()->addMinutes(60),
        [
            'id' => $user->id,
            'hash' => sha1('jane@example.com'),
        ],
    );

    $this->actingAs($user)->get($url)->assertRedirect();

    expect($user->fresh()->email_verified_at)->not->toBeNull();
});

test('unverified accounts keep dashboard access (verification is not enforced)', function () {
    $user = User::factory()->unverified()->create();

    $this->actingAs($user)->get(route('dashboard'))->assertOk();
});

test('verified accounts are not emailed again when resending', function () {
    Mail::fake();
    $user = User::factory()->create(['email' => 'jane@example.com']);

    $this->actingAs($user)->post(route('verification.send'));

    Mail::assertNothingSent();
});
