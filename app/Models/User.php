<?php

namespace App\Models;

use App\Mail\ResetPasswordMail;
use App\Mail\VerifyEmailMail;
use Database\Factories\UserFactory;
use Illuminate\Auth\Events\Verified;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Laravel\Cashier\Billable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string $role
 * @property Carbon|null $banned_at
 * @property string|null $two_factor_secret
 * @property string|null $two_factor_recovery_codes
 * @property Carbon|null $two_factor_confirmed_at
 * @property string|null $remember_token
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'email', 'password', 'role', 'banned_at'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements MustVerifyEmail, PasskeyUser
{
    public const ROLE_ADMIN = 'admin';

    public const ROLE_DISPATCHER = 'dispatcher';

    public const ROLE_MANAGER = 'manager';

    /** @var array<int, string> */
    public const ROLES = [
        self::ROLE_ADMIN,
        self::ROLE_DISPATCHER,
        self::ROLE_MANAGER,
    ];

    /** @use HasFactory<UserFactory> */
    use Billable, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'banned_at' => 'datetime',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function isAdmin(): bool
    {
        return $this->role === self::ROLE_ADMIN;
    }

    public function isDispatcher(): bool
    {
        return $this->role === self::ROLE_DISPATCHER;
    }

    public function isManager(): bool
    {
        return $this->role === self::ROLE_MANAGER;
    }

    public function isBanned(): bool
    {
        return $this->banned_at !== null;
    }

    /**
     * Send the branded password reset email. Called by the Fortify
     * password broker (and the dashboard invite flow) with the reset token.
     */
    public function sendPasswordResetNotification($token): void
    {
        Mail::to($this->email)->send(new ResetPasswordMail($this, $token));
    }

    /**
     * Send the branded verification email. Called by Fortify's
     * verification-notification route (verify page resend and profile page).
     */
    public function sendEmailVerificationNotification(): void
    {
        Mail::to($this->email)->send(new VerifyEmailMail($this));
    }

    public function getEmailForVerification(): string
    {
        return $this->email;
    }

    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified_at !== null;
    }

    /**
     * Mark the account as verified. Verification is not enforced (users
     * keep dashboard access) but the confirmation link still works.
     */
    public function markEmailAsVerified(): bool
    {
        if ($this->hasVerifiedEmail()) {
            return false;
        }

        $this->forceFill(['email_verified_at' => $this->freshTimestamp()])->save();

        event(new Verified($this));

        return true;
    }
}
