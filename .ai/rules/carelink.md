---
paths:
  - 'tests/Feature/Carelink/**'
---

# Carelink

## Route names vs Inertia page names differ
The FAQ route is named `faq` (route('faq')) but renders Inertia page `faqs`. Admin routes are `admin.login` (GET) / `admin.login.attempt` (POST), `admin.bookings.update-status`, `admin.services.update-rates`. Guests hitting `/admin*` are redirected to `/admin/login` via redirectGuestsTo in bootstrap/app.php.

## assertInertia + FakeStripeClient in booking tests
Inertia's assertInertia() reads the rendered view's page data, so POST tests must NOT send X-Inertia: true (that returns JSON and fails "Not a valid Inertia response"). Mock Stripe API calls in feature tests with app()->bind(StripeClient::class, fn () => new FakeStripeClient) from tests/Support/FakeStripeClient.php — without it, store() hits the real test API.
