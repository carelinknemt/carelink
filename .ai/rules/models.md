---
paths:
  - 'app/Models/**'
  - app/Models/User.php
  - app/Models/PassengerBlacklist.php
---

# Models

## Display formatting via Eloquent accessors
`RideBooking::rideDate()` serializes `ride_date` as `m/d/Y` and `BlogPost::publishedAt()` serializes `published_at` as `M j, Y` via Casts\Attribute. Controllers/frontend must not re-format; the accessors handle display.

## User sends CareLink-branded reset/verify mailables
User overrides sendPasswordResetNotification($token) (parameter MUST stay untyped to match parent signature) → ResetPasswordMail (uses Password::broker()->sendResetLink flow, resetUrl from route('password.reset')), and sendEmailVerificationNotification() → VerifyEmailMail (URL::temporarySignedRoute 'verification.verify', 60 min). markEmailAsVerified() fires Illuminate\Auth\Events\Verified. Verification is intentionally NOT enforced: unverified users keep dashboard access.

## Phone matching uses 10-digit normalization
PassengerBlacklist::digitsFromPhone() strips all non-digits from phone numbers for matching. TripRequest stores free-form phone strings like `(707) 909-0898` or `+17079090898`. The blacklist normalizes both sides to 10 digits before comparing. Always use digitsFromPhone() when comparing phone values — never compare raw strings.
