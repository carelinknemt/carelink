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

## TripRequest status constants and audit trail
DROPDOWN_STATUSES = [PENDING_DISPATCH, BAMBI_DISPATCHED, IN_TRANSIT, COMPLETED] — used for the status dropdown on the detail page; CANCELLED is excluded. ASSIGNABLE_STATUSES still includes CANCELLED (legacy, used only by existing tests). The dedicated cancel route (POST dashboard.bookings.cancel) is the only path to cancel. TripRequest::audits() is a hasMany to TripRequestAudit (latest first).

## TripRequestAudit tracks every change to a booking
TripRequestAudit stores: trip_request_id, user_id (nullable), user_name, role (snapshotted at write time), action (status_changed|cancelled|updated), from_value, to_value, reason. UPDATED_AT is null (no auto-touch). The audits relation lives on TripRequest; show() passes the latest 20 (newest first) as an 'audits' prop. No backfill of pre-existing changes was done.
