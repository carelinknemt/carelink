# CareLink Medical Transportation

> **Connecting Patients to Better Health Every Mile with Compassion. Every Trip with Purpose.**

CareLink is a production-ready **Non-Emergency Medical Transportation (NEMT)** platform for **Carelink Medical Transportation LLC** (Eureka, California). It combines a public marketing website, an online trip-request (booking) flow backed by **Stripe Checkout**, and an authenticated manager dashboard — all in one Laravel + Inertia + React application.

Patients (or their caregivers) submit a trip request online, pay a non-refundable **$30 booking fee** through Stripe, and receive a booking number they can track. Managers log in to review paid bookings, update dispatch statuses, and export each trip as a CSV row that is compatible with the **Bambi NEMT scheduling software** import format.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [The Booking & Payment Flow](#the-booking--payment-flow)
- [Public Website](#public-website)
- [Manager Dashboard](#manager-dashboard)
- [Authentication & Security](#authentication--security)
- [Frontend & Design System](#frontend--design-system)
- [The Bambi CSV Contract](#the-bambi-csv-contract)
- [Developer Conventions](#developer-conventions)
- [Testing](#testing)
- [Code Quality & Tooling](#code-quality--tooling)
- [Stripe Webhook Setup](#stripe-webhook-setup)
- [Deployment Notes](#deployment-notes)
- [Troubleshooting](#troubleshooting)
- [License](#license)

---

## Features

**Public website**
- Marketing pages: Home, Services, Fleet, About, FAQ, Blog, Careers
- ADA accessibility widget (font size, line height, letter spacing, contrast, dyslexia font, reduce motion, large cursor, etc.)
- Leaflet map previews, hero carousel, marquees, and a fully responsive layout

**Online trip request / booking**
- 4-step booking wizard: **Passenger → Trip → Service & Payment → Review**
- Address search with **geocoding** (Photon, no API keys) and live map route preview
- Automatic distance-based price estimate (haversine × service base/mileage rates)
- Unique booking numbers (`CL-NEMT-XXXXXX`), validated US phone input, `react-day-picker` date pickers, 15-minute slot time pickers
- **$30 non-refundable booking fee** collected via Stripe guest Checkout (opens in a new tab with automatic payment-status polling)
- Public booking tracking page + JSON status endpoint
- **Bambi-compatible CSV export** for every trip request

**Manager dashboard** (authenticated)
- Stats overview (total paid, pending dispatch, in transit, completed) + recent bookings
- Bookings list with search (booking #, name, phone, email) and status/date filters
- Booking detail, edit, and status updates (`PENDING_DISPATCH → BAMBI_DISPATCHED → IN_TRANSIT → COMPLETED`)
- Per-booking and filtered-collection CSV exports

**Authentication & account security**
- Fortify-backed registration, login, email verification, and password reset
- Two-factor authentication (TOTP) with recovery codes
- **Passkeys / WebAuthn** sign-in
- Password confirmation gating for security settings

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | [Laravel](https://laravel.com) 13 (PHP 8.3+, developed on 8.5) |
| Frontend | [Inertia.js](https://inertiajs.com) v3 + [React](https://react.dev) 19 + TypeScript |
| Styling | [Tailwind CSS](https://tailwindcss.com) v4 + `tw-animate-css` + shadcn/ui-style components (Radix UI primitives) |
| Build tooling | [Vite](https://vitejs.dev) 8, `@inertiajs/vite`, `laravel-vite-plugin`, `babel-plugin-react-compiler` |
| Auth | [Laravel Fortify](https://github.com/laravel/fortify) (incl. passkeys) |
| Payments | [Laravel Cashier](https://laravel.com/docs/cashier) + [Stripe](https://stripe.com) guest Checkout |
| Email | [Resend](https://resend.com) via `resend/resend-laravel` |
| Typed routes | [Laravel Wayfinder](https://github.com/laravel/wayfinder) (client imports from `@/routes` / `@/actions`) |
| Maps / geocoding | `react-leaflet` v5 + CARTO tiles; Photon geocoder (no API keys) |
| Phone validation | `libphonenumber-js` (US only, shared `PhoneInput` component) |
| Database | SQLite by default (env-swappable to MySQL/Postgres) |
| Testing | [Pest](https://pestphp.com) 5 (+ `FakeStripeClient` for Stripe mocks) |
| Static analysis / style | Larastan (PHPStan), Laravel Pint, ESLint, Prettier, `tsc --noEmit` |

---

## Architecture Overview

The app is a classic **Inertia v3** monolith: Laravel serves data + routes, React renders the pages client-side, and there is no separate API layer for the UI (one exception: the JSON booking-status poll endpoint).

```
Browser (React SPA via Inertia)
        │  XHR visits (Inertia)
        ▼
routes/web.php ──► Carelink controllers ──► Eloquent models ──► SQLite/DB
        │                │
        │                ├── StoreTripRequestRequest (validation)
        │                ├── TripRequest (CSV export contract)
        │                └── Stripe (Cashier guest Checkout)
        │
        └── Stripe webhook ──► StripeEventListener ──► marks booking PAID ──► confirmation email (Resend)
```

Key request flows:

1. **Public pages** — `GET /`, `/services`, `/fleet`, `/about`, `/faq`, `/blog`, `/careers` render Inertia pages backed by content models (`Service`, `FleetVehicle`, `TeamMember`, `Faq`, `BlogPost`, `Career`) seeded by `CarelinkContentSeeder`.
2. **Book a ride** — `GET /book` renders the 4-step wizard; `POST /bookings` validates, creates a `TripRequest`, writes its Bambi CSV, and starts a Stripe Checkout session for the $30 fee. The client opens the checkout URL in a new tab and polls `GET /bookings/{booking}/status` every 3 seconds.
3. **Payment confirmation** — Stripe's `checkout.session.completed` webhook fires `StripeEventListener`, which marks the booking `PAID` and emails a confirmation. If the customer returns to the app from Stripe, `BookController@index` performs a belt-and-suspenders reconciliation (see [Payment reconciliation](#payment-reconciliation)).
4. **Manager dashboard** — Authenticated routes under `/dashboard` list **paid** bookings only, with editing, status updates, and CSV exports.

---

## Getting Started

### Prerequisites

- PHP **8.3+** with common extensions (sqlite, mbstring, etc.)
- [Composer](https://getcomposer.org)
- Node.js 20+ and npm (or pnpm — a `pnpm-workspace.yaml` is present)
- A [Stripe](https://stripe.com) account (test mode is fine) for the booking fee
- A [Resend](https://resend.com) API key for transactional email (optional locally)

### Installation

```bash
# 1. Install PHP + JS dependencies and set up the environment
composer install
npm install

# 2. Create the environment file and generate an app key
cp .env.example .env
php artisan key:generate

# 3. Configure the database (SQLite is the default)
#    touch database/database.sqlite  (if not already present)
php artisan migrate

# 4. Seed the public content (services, fleet, team, FAQs, blog, careers, demo bookings)
php artisan db:seed

# 5. Build assets (or skip and use the dev server below)
npm run build
```

> Alternatively, `composer setup` runs installs, env setup, key generation, migration, and asset build in one shot.

### Running the Dev Server

```bash
# Starts both the Laravel server and Vite dev server
composer run dev
```

Or run them separately:

```bash
php artisan serve      # Laravel on http://localhost:8000
npm run dev            # Vite dev server (hot reload)
```

The app will be available at the URL printed by `php artisan serve` (typically `http://localhost:8000`). If assets look unstyled, make sure `npm run dev` or `npm run build` has been run.

### Registering a Manager Account

Register through the UI (`/register`), verify your email, and you can log in to the dashboard at `/dashboard`. The `is_admin` flag exists on users but the admin UI has been removed — all verified users can access the manager dashboard. **Never seed admin users or hardcoded passwords** (see [Developer Conventions](#developer-conventions)).

---

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `APP_NAME` | ✅ | Application name (`CareLink`) |
| `APP_URL` | ✅ | Base URL — must match the Stripe redirect/return URLs |
| `APP_KEY` | ✅ | Laravel app key (generate with `php artisan key:generate`) |
| `DB_CONNECTION` | — | `sqlite` by default |
| `STRIPE_KEY` | ✅ | Stripe **publishable** key (`pk_test_...`) |
| `STRIPE_SECRET` | ✅ | Stripe **secret** key (`sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret (`whsec_...`) — needed to accept webhooks |
| `CASHIER_CURRENCY` | — | Default `usd` |
| `RESEND_API_KEY` | ✅ | Resend API key for the payment-confirmation email |
| `MAIL_FROM_ADDRESS` | — | Sender address (`onboarding@resend.dev` by default) |
| `CARELINK_LOGO_URL` | — | Override the logo used on public pages (default `/images/cllogo.png`) |
| `FILESYSTEM_DISK` | — | `local` by default; trip CSV files are stored on this disk |

Stripe and Resend variables can be left as placeholders locally — the booking flow degrades gracefully (the trip request is still created if checkout fails).

---

## Project Structure

```
carelink/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Carelink/          # Public pages + booking + dashboard controllers
│   │   │   └── Settings/          # Profile & security settings
│   │   ├── Middleware/
│   │   │   ├── HandleInertiaRequests.php   # Shared Inertia props (auth, sidebar state)
│   │   │   └── HandleAppearance.php        # Appearance cookie → view share
│   │   └── Requests/              # Form requests (StoreTripRequestRequest, etc.)
│   ├── Listeners/
│   │   └── StripeEventListener.php         # Marks bookings PAID on webhook
│   ├── Mail/
│   │   └── TripRequestPaymentConfirmed.php # Confirmation email after payment
│   ├── Models/                    # TripRequest, Service, FleetVehicle, TeamMember,
│   │                              #   Faq, BlogPost, Career, CareerApplication,
│   │                              #   RideBooking (legacy), User
│   └── Actions/Fortify/           # Registration / password reset actions
├── bootstrap/app.php              # Middleware, exception handling, redirectGuestsTo
├── config/
│   ├── carelink.php               # Company info (name, phone, dispatch, counties…)
│   ├── cashier.php                # Stripe keys, currency, webhook secret
│   └── fortify.php                # Auth features (2FA, passkeys, email verification)
├── database/
│   ├── migrations/                # Trip requests, services, fleet, content, cashier…
│   ├── factories/                 # Eloquent factories for every model
│   └── seeders/                   # CarelinkContentSeeder + DatabaseSeeder
├── docs/
│   └── schema.csv                 # The Bambi CSV column contract (mirrors TripRequest::CSV_COLUMNS)
├── resources/
│   ├── js/
│   │   ├── app.tsx                # Inertia boot + global providers
│   │   ├── pages/                 # React pages (book, home, dashboard/bookings, auth…)
│   │   ├── layouts/               # carelink-layout (public), app-layout, auth-layout
│   │   ├── components/
│   │   │   ├── carelink/          # PhoneInput, DatePicker, TimePicker, LocationPicker,
│   │   │   │                      #   MapPreview, header, footer, accessibility-widget…
│   │   │   ├── ui/                # shadcn-style primitives (button, input, dialog…)
│   │   │   └── …                  # App shell, sidebar, auth components
│   │   ├── data/carelink.ts       # COMPANY_INFO + hero slides + hours + partners
│   │   └── routes/                # Generated Wayfinder route helpers (do not edit)
│   ├── css/app.css                # Tailwind v4 theme + Carelink palette + animations
│   └── views/
│       ├── app.blade.php          # Inertia root template
│       └── mail/                  # Payment-confirmation email template
├── routes/
│   ├── web.php                    # Public + dashboard routes
│   └── settings.php               # Profile / security / passkey-endpoint routes
├── tests/
│   ├── Feature/Carelink/          # Booking, billing, pages, dashboard, careers…
│   └── Support/FakeStripeClient.php  # In-memory Stripe mock for feature tests
└── .ai/rules/                     # Load-bearing agent/dev conventions (see below)
```

---

## The Booking & Payment Flow

### Trip Request Lifecycle

Every online booking creates a `TripRequest` with:

- A unique **booking number** — `CL-NEMT-XXXXXX` (6 random digits, collision-checked)
- **Dispatch status** (default `PENDING_DISPATCH`):

  | Status | Meaning |
  | --- | --- |
  | `PENDING_DISPATCH` | Received, awaiting dispatch assignment |
  | `BAMBI_DISPATCHED` | Assigned/dispatched in the Bambi system |
  | `IN_TRANSIT` | Passenger is being transported |
  | `COMPLETED` | Trip finished |

- **Payment status** — `PENDING` or `PAID`, plus `paid_at`

The booking wizard collects passenger details (name, email, DOB, mobility/medical needs), trip details (date, pickup/dropoff times and geocoded addresses), and service selection (transport type, service type, will-call flag). The review step shows a distance-based price estimate computed client-side from service base/mileage rates; the actual fare is **confirmed by dispatch** and the submitted `input_price` is `0`.

### Stripe Booking Fee

1. On submit, `BookController@store` creates the `TripRequest`, exports its Bambi CSV to storage, and creates a **guest Stripe Checkout session** for a **$30 non-refundable booking fee** (30-minute expiry, `success_url`/`cancel_url` return to `/book?booking=…`).
2. The Inertia response includes a `checkout.url` prop. The client opens it in a **new tab** (`window.open`) and stores a pending-payment marker in `sessionStorage`.
3. While pending, the book page polls `GET /bookings/{booking}/status` every 3 seconds. When `payment_status` becomes `PAID`, the user is redirected to the tracking page (`/bookings/{booking}`).
4. If checkout creation fails, the trip request is **still saved** and the customer is told the team will arrange payment.

> **Why a new tab?** Inertia navigation uses XHR, which cannot follow an external `303` redirect to `checkout.stripe.com` without a CORS error — so the URL is handed to the client instead.

### Payment Reconciliation

Payments are finalized in two independent ways (idempotent — a booking is only marked paid once):

1. **Webhook (source of truth)** — `checkout.session.completed` with `payment_status=paid` and the `booking_number` metadata is handled by `StripeEventListener@handle`. It marks the trip `PAID` and emails `TripRequestPaymentConfirmed` (only if not already paid, and only when the passenger has an email).
2. **Return redirect** — `BookController@index` checks `?session_id=` against the stored checkout session ID and verifies the session is paid before recording the payment, covering tabs closed before the redirect.

### Bambi CSV Export

Every trip request is exported as a CSV row matching the **Bambi scheduling-software import contract**:

- Column order is `TripRequest::CSV_COLUMNS`, which must stay in sync with [`docs/schema.csv`](docs/schema.csv) (see [The Bambi CSV Contract](#the-bambi-csv-contract)).
- Each booking is written to the `local` disk at `trip-requests/{booking_number}.csv`.
- The manager dashboard can also stream CSV downloads (single booking or filtered collection).

---

## Public Website

| Route | Page | Purpose |
| --- | --- | --- |
| `GET /` | `home` | Hero carousel, services, team, reviews, trusted partners |
| `GET /services` | `services` | Six service lines (wheelchair transport, group shuttle, sedan, discharges, community rides, long-distance) |
| `GET /fleet` | `fleet` | Vehicle fleet cards with capacity & accessibility specs |
| `GET /about` | `about` | Company story + team members |
| `GET /faq` | `faqs` | FAQ accordions (note: route is `faq`, page is `faqs`) |
| `GET /blog` | `blog` | Blog posts |
| `GET /careers` | `careers` | Job openings + application form (`POST /careers/apply`) |
| `GET /book` | `book` | Online trip-request wizard |
| `GET /bookings/{booking}` | `bookings/track` | Public tracking page for a booking number |
| `GET /bookings/{booking}/status` | JSON | Payment/dispatch status poll endpoint |

Company-wide details (name, phone, dispatch email, service region, counties) live in `config/carelink.php` (server) and `resources/js/data/carelink.ts` (client).

> **Legacy note:** `POST /appointments` (`AppointmentController` / `RideBooking` model / `appointment-modal.tsx`) is the old booking flow and is **unreachable** from the UI — do not wire it back into headers. The `book` page is the source of truth.

---

## Manager Dashboard

All dashboard routes require `auth` + `verified`.

| Route | Page | Purpose |
| --- | --- | --- |
| `GET /dashboard` | `dashboard` | Stats (total paid, pending dispatch, in transit, completed) + 5 recent bookings |
| `GET /dashboard/bookings` | `dashboard/bookings` | Paginated list (15/page) with search + status/date filters |
| `GET /dashboard/bookings/{booking}` | `dashboard/bookings/show` | Full booking detail |
| `PUT /dashboard/bookings/{booking}` | — | Update editable booking details |
| `PATCH /dashboard/bookings/{booking}/status` | — | Change dispatch status |
| `GET …/export` (list & single) | — | Stream CSV in the Bambi format |

Important behavior: **only `PAID` bookings are visible or editable** — unpaid or unknown bookings 404 on the show/update/status/export routes.

---

## Authentication & Security

Powered by **Laravel Fortify** with `web`-guard routes and Inertia-rendered auth pages:

- Registration, login, **email verification**, password reset (with throttling on password changes)
- **Two-factor authentication** (TOTP) with recovery codes and confirmation password
- **Passkeys (WebAuthn)** — including a `.well-known/passkey-endpoints` discovery route
- Login throttling, guest redirects to `/login` (`redirectGuestsTo` in `bootstrap/app.php`)
- Password confirmation required before visiting security settings
- CSRF is disabled for `stripe/*` (webhook) routes only
- The `appearance` and `sidebar_state` cookies are excluded from encryption; public pages force a light theme so date pickers and forms render reliably

---

## Frontend & Design System

- **Pages** live in `resources/js/pages`, rendered server-side via `Inertia::render()`; components live in `resources/js/components`.
- **Wayfinder** generates typed route helpers — import from `@/routes` (e.g. `store`, `show`, `status`) or `@/actions` and call `.url()`, `.get()`, `.post()`, or `.form()`. Never hardcode URLs.
- **shadcn/ui-style primitives** (`button`, `input`, `dialog`, `select`, …) are built on Radix UI with `class-variance-authority` + `tailwind-merge`.
- **Carelink brand**: navy `#004B87` primary, cyan accents, orange `#E64A19` CTAs (e.g. the submit button — there is no orange variant on the Button component). Custom animations (hero reveal, marquee, route rails, accessibility helpers) live in `resources/css/app.css`.
- **Map & geocoding**: the book form geocodes addresses with the free **Photon** API (CA bounding box, debounced 350 ms, min 3 chars, `AbortController`), and previews routes with `react-leaflet` v5 + CARTO light tiles — **no API keys required**.
- **Phone input**: shared `PhoneInput` component (`libphonenumber-js`) with a `+1` country selector; the backend form requests enforce the same US regex.

### Frontend gotchas worth knowing

- **Inertia v3 `useForm`**: `setData({...})` with an object **replaces** the entire form data. Always use the key/value form: `setData('field', value)`.
- **Flash toasts**: `useFlashToast()` must be mounted only inside the global `Toaster` (`components/ui/sonner.tsx`) — calling it in layouts/pages causes every toast to fire twice.
- The booking form uses the custom `DatePicker`/`TimePicker` components (react-day-picker v10, 12-hour slots), **never** native `<input type="date/time">`.

---

## The Bambi CSV Contract

`TripRequest::CSV_COLUMNS` defines the exact 44-column order expected by Bambi's import and mirrors `docs/schema.csv`:

- **Booleans** export as `TRUE` / `FALSE`
- **Dates** export as `YYYY-MM-DD`
- **Nulls** export as empty strings
- The `id` column always exports **empty**

> ⚠️ This contract is load-bearing. If you add columns to the CSV you **must** update `docs/schema.csv` too. Coordinates (`pickup_latitude` / `dropoff_longitude`) are stored in the DB but are **not** part of the CSV contract.

---

## Developer Conventions

The repo keeps committed, area-grouped conventions in **`.ai/rules/`** (see `.ai/rules/index.md` for the glob map). They are the authoritative "how we do things here" and should be read before editing the matching paths. Highlights:

- **Controllers (`app/Http/Controllers/Carelink/**`)**
  - Never return external 303 redirects from Inertia endpoints — pass the URL as a prop and let the client `window.open()` it.
  - Keep `TripRequest::CSV_COLUMNS` in sync with `docs/schema.csv`.
- **Models** — display formatting lives in Eloquent accessors (`RideBooking::rideDate()`, `BlogPost::publishedAt()`); frontend must not re-format.
- **JS (`resources/js/**`)** — key/value `setData` only (see above); shared `PhoneInput` for all phone fields.
- **Pages (`book.tsx`)** — no native date/time inputs; review-step submit is gated behind an 800 ms `reviewReady` delay and a `type="button"` to prevent accidental double submission.
- **Seeders** — never seed admin users or password literals (the repo is public; credentials must come from env only).
- **Listeners** — class-string event listeners must expose a single `handle()` method.
- **Routes** — regenerate Wayfinder with `php artisan wayfinder:generate --with-form` (`.form()` helpers are required by auth pages).
- **Layouts** — mount `useFlashToast()` only in the global Toaster.

---

## Testing

Tests are written with **Pest 5** and live under `tests/`.

```bash
php artisan test --compact                      # Run the full suite
php artisan test --compact --filter=Booking     # Run a subset
```

Key areas covered in `tests/Feature/Carelink/`:

- `TripRequestTest` — trip request creation & CSV export
- `TripRequestBillingTest` — the full Stripe fee lifecycle: checkout creation, failed checkout fallback, webhook marking paid, duplicate-webhook idempotency, return-redirect reconciliation, status endpoint, tracking page
- `DashboardBookingsTest` — dashboard list/filter/edit/status/export behavior
- `CarelinkPagesTest` — every public page renders the right component with its props
- `CareerApplicationTest`, `AppointmentTest` — legacy flow regression coverage
- `Auth/**` and `Settings/**` — Fortify auth, 2FA, passkeys, profile/security settings

Stripe API calls are mocked with `tests/Support/FakeStripeClient.php` — bind it in feature tests via `app()->bind(StripeClient::class, fn () => new FakeStripeClient)`. Inertia POST tests must **not** send the `X-Inertia` header when asserting rendered page data.

---

## Code Quality & Tooling

| Tool | Command | Notes |
| --- | --- | --- |
| Laravel Pint | `composer lint` / `composer lint:check` | PHP code style (`pint.json`) |
| Larastan / PHPStan | `composer types:check` | `phpstan.neon`, level configured for strict analysis |
| ESLint | `npm run lint` / `npm run lint:check` | JS/TS linting |
| Prettier | `npm run format` / `npm run format:check` | Formatting (`resources/`) |
| TypeScript | `npm run types:check` | `tsc --noEmit` |
| Full CI check | `composer ci:check` | Lint + format + types + tests |
| All-in-one | `composer test` | Config clear → lint → phpstan → tests |

Run Pint on dirty PHP files before finishing a change: `vendor/bin/pint --dirty --format agent`.

---

## Stripe Webhook Setup

The booking-fee flow depends on the **`checkout.session.completed`** webhook (via Cashier's `stripe/webhook` route).

**Locally** with the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:8000/stripe/webhook
# Copy the printed whsec_... value into STRIPE_WEBHOOK_SECRET
```

Then trigger a test checkout, or send a manual event:

```bash
stripe trigger checkout.session.completed
```

**In production** (Stripe Dashboard → Developers → Webhooks): point the endpoint at `https://your-domain.com/stripe/webhook`, subscribe to the `checkout.session.completed` event, and set the signing secret as `STRIPE_WEBHOOK_SECRET`.

---

## Deployment Notes

- This is a standard Laravel app — deploy with [Laravel Cloud](https://cloud.laravel.com/), Forge, or any PHP host. Build assets with `npm run build` (or `npm run build:ssr` if you enable SSR).
- Ensure `APP_URL` matches the production domain (it feeds the Stripe `success_url`/`cancel_url` and passkey relying-party origin).
- Run `php artisan migrate --force` and `php artisan db:seed` (content seed is idempotent via `updateOrCreate`).
- Keep the **queue worker** running for queued mail, and register the Stripe webhook (above).
- The `local` disk stores trip CSV exports — back it up or move exports to S3 (`FILESYSTEM_DISK=s3`) if persistence matters.
- **Security**: the repo is public — never commit `.env`, real Stripe keys, or hardcoded credentials.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `ViteException: Unable to locate file in Vite manifest` | Run `npm run build`, or keep `npm run dev` / `composer run dev` running |
| Frontend changes not visible | Run `npm run build` (or restart `npm run dev`) |
| Checkout opens but payment never confirms | Check the Stripe webhook is registered and `STRIPE_WEBHOOK_SECRET` matches; verify the booking's `session_id` return path |
| `tsc --noEmit` fails on missing `.form()` helpers | Regenerate routes: `php artisan wayfinder:generate --with-form` |
| Toasts appear twice | `useFlashToast()` is being called outside the global `Toaster` |
| Booking form fields look gray / no date picker | Native date/time inputs were used — use the custom `DatePicker`/`TimePicker` components |

---

## License

Proprietary — this application belongs to **Carelink Medical Transportation LLC**.
