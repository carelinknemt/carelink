---
paths:
  - 'app/Http/Controllers/Carelink/**'
  - app/Http/Controllers/Carelink/BookController.php
  - app/Http/Controllers/Carelink/DashboardBookingController.php
  - app/Http/Controllers/Carelink/DashboardAnalyticsController.php
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
