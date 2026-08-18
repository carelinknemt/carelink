---
paths:
  - routes/web.php
---

# Routes 2

## /admin redirects to login; no admin.* routes exist
There is no admin panel: /admin is a Route::redirect to /login, and the old admin.login / admin.login.attempt / admin.bookings.update-status routes no longer exist. Guests on /dashboard* are sent to route('login') via redirectGuestsTo in bootstrap/app.php.
