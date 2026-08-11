---
paths:
  - 'app/Http/Controllers/Carelink/**'
  - app/Http/Controllers/Carelink/BookController.php
---

# Controllers Carelink

## Career applications submit via POST /careers/apply
The careers page posts employment applications to `careers.apply` (POST /careers/apply), validated by StoreCareerApplicationRequest, stored in `career_applications` (career_id nullable for general applications). Success flashes an Inertia `toast` and returns back. Apply Now buttons preselect the position in the form.

## TripRequest CSV must match docs/schema.csv exactly
TripRequest::CSV_COLUMNS order is the Bambi import contract — keep it in sync with docs/schema.csv. Booleans export as TRUE/FALSE, the id column exports empty, dates as YYYY-MM-DD. Booking numbers are CL-NEMT-XXXXXX (unique). Do not add columns to the CSV without updating schema.csv too.

## External redirects break Inertia POSTs — hand URL to client
Never return an external 303 redirect (e.g. $checkout->redirect() to checkout.stripe.com) from an Inertia endpoint — the browser XHR follows it and fails with a CORS HttpNetworkError. Return Inertia::render() with the external URL as a prop and let the client window.open(url, '_blank'). Payment state is polled via GET /bookings/{booking}/status (plain JSON) and tracked on GET /bookings/{booking} (bookings/track page).
