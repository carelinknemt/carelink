---
paths:
  - 'tests/Feature/Carelink/**'
---

# Carelink

## Route names vs Inertia page names differ
The FAQ route is named `faq` (route('faq')) but renders Inertia page `faqs`. Admin routes are `admin.login` (GET) / `admin.login.attempt` (POST), `admin.bookings.update-status`, `admin.services.update-rates`. Guests hitting `/admin*` are redirected to `/admin/login` via redirectGuestsTo in bootstrap/app.php.
