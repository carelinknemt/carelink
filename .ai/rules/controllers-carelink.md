---
paths:
  - 'app/Http/Controllers/Carelink/**'
  - app/Http/Controllers/Carelink/BookController.php
  - app/Http/Controllers/Carelink/DashboardBookingController.php
  - app/Http/Controllers/Carelink/DashboardAnalyticsController.php
  - app/Http/Controllers/Carelink/DashboardPaymentController.php
  - app/Http/Controllers/Carelink/DashboardUserController.php
  - app/Http/Controllers/Carelink/DashboardCareerApplicationController.php
  - app/Http/Controllers/Carelink/DashboardJobOpeningController.php
---

# Controllers Carelink

## Career applications submit via POST /careers/apply
The careers page posts employment applications to `careers.apply` (POST /careers/apply), validated by StoreCareerApplicationRequest, stored in `career_applications` (career_id nullable for general applications). Success flashes an Inertia `toast` and returns back. Apply Now buttons preselect the position in the form.

## TripRequest CSV must match docs/schema.csv exactly
TripRequest::CSV_COLUMNS order is the Bambi import contract — keep it in sync with docs/schema.csv. Booleans export as TRUE/FALSE, the id column exports empty, dates as YYYY-MM-DD. Booking numbers are CL-NEMT-XXXXXX (unique). Do not add columns to the CSV without updating schema.csv too.

## External redirects break Inertia POSTs — hand URL to client
Never return an external 303 redirect (e.g. $checkout->redirect() to checkout.stripe.com) from an Inertia endpoint — the browser XHR follows it and fails with a CORS HttpNetworkError. Return Inertia::render() with the external URL as a prop and let the client window.open(url, '_blank'). Payment state is polled via GET /bookings/{booking}/status (plain JSON) and tracked on GET /bookings/{booking} (bookings/track page).

## Bookings list filter/sort/per-page contract
DashboardBookingController filters now use date_from/date_to (not the old single 'date'), plus service_type. Sort is whitelisted to trip_date/passenger_name/input_price/created_at via sortClause(); per_page must be one of [15,25,50,100] or falls back to 15. The frontend bookings.tsx mirrors these with debounced search and a per-page Select.

## Analytics aggregates in PHP, not SQL
Keep DashboardAnalyticsController aggregation portable: fetch the paid rows once for the range and aggregate in PHP (tree of Carbon remains SQLite/MySQL agnostic). today() returns CarbonImmutable, so use CarbonInterface type hints throughout. dailySeries is zero-filled per calendar day; revenue = paid bookings x $30 fee (BOOKING_FEE).

## Cancel booking refunds first via Stripe
The dedicated cancel action (POST dashboard.bookings.cancel) refunds the checkout session's payment_intent and only sets status=CANCELLED + refunded_at when the refund succeeds. On success with a Stripe payment it also emails the passenger App\Mail\TripRequestCancelled (view mail.trip-request-cancelled, sent when passenger_email exists). Since CANCELLED was added to ASSIGNABLE_STATUSES (user decision), managers may also set CANCELLED directly via the status dropdown — that path does NOT refund the fee and does NOT email; use the cancel route when a refund is owed.

## Bookings list defaults to pending dispatch
DashboardBookingController::filteredQuery() constrains status to PENDING_DISPATCH when no status filter is sent; the '__all' sentinel (TripRequest::STATUS_FILTER_ALL) shows every status. filters() returns PENDING_DISPATCH as the default status so the UI reflects it. The frontend status Select maps "All statuses" to '__all' (not '').

## Business partnership inquiry flow
Public form at GET /for-businesses (route business, Inertia page 'business', CarelinkLayout public layout) posts to business.store (POST /business-partners), validated by StoreBusinessPartnerRequestRequest, stored in business_partner_requests with business_type limited to BusinessPartnerRequest::BUSINESS_TYPES. Inquiries are managed at GET /dashboard/business-partners (route dashboard.business-partners, page 'dashboard/business-partners') - newest first, 15 per page, searchable, and status-filtered: defaults to PENDING, '__all' (STATUS_FILTER_ALL) reveals every status, mirroring the bookings list contract. POST dashboard.business-partners.approve validates an email input and updates status to APPROVED + emails that address with BusinessPartnerApproved; POST dashboard.business-partners.reject requires a reason and updates status to REJECTED + emails the registered address with BusinessPartnerRejected. Approve/reject are only offered for PENDING rows in the UI.

## Payments list default shows all payment records
Payments page lists only bookings that reached Stripe checkout (stripe_checkout_session_id not null). Status filter: '__all' is the default — an empty status means NO filter (unlike bookings/business-partners which default to an actionable state). 'refunded' sentinel filters refunded_at not null. Summary: collected = (paid - refunded) * $30 fee (net), pending = unpaid * fee, refunded = refunded * fee, computed in PHP.

## User management is admin-gated, invites via reset link
User management is admin-only: abort_unless($request->user()->is_admin, 403) in every method. Adding a user creates it with a random Str::password(32) (no usable password) and immediately sends the Fortify password reset link via Password::broker()->sendResetLink — email flows to Fortify's password.reset view. Admins cannot ban themselves (toggleBan guard). Never seed admin passwords (repo rule).

## Applications page is admin-only with role switcher
Dashboard applications management is ADMIN-ONLY (abort_unless is_admin, 403) — no user-facing "My Applications" page. Route dashboard.applications lists all career_applications paginated (15), filterable by role (career_id) and search (name/email); roles list prop feeds the frontend role switcher. Resume download (dashboard.applications.resume) streams from the private 'local' disk; destroy removes the application.

## Job openings CRUD is admin-only via DashboardJobOpeningController
Job opening management (dashboard.job-openings*) is ADMIN-ONLY: index lists careers with applications_count (withCount), store/update create/update roles, toggle flips active (closes/reopens the public role), destroy deletes the career. The form sends requirements as a newline-separated string; the controller splits it into the requirements array. Career::applications() hasMany exists for the count.

## Payments dashboard lists PAID by default, no admin refund action
Payments dashboard defaults to PAID only; status '__all' shows all checkout sessions, 'refunded' shows refunded ones. Refund action was removed from UI and backend - Stripe refunds only happen via booking cancellation (DashboardBookingController).

## Application accept/reject emails applicants via dropdown actions
Applications table is compact (applicant, role title, submitted, actions dropdown: View Details / Accept / Reject + trash). Accept/reject POST dashboard.applications.accept/.reject (admin-only) send ApplicationAccepted / ApplicationRejected mailables to the applicant's email and flash a success toast; no status field is persisted on the application. Details dialog exposes contact, resume download, and cover letter.
