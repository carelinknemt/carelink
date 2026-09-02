---
paths:
  - app/Http/Requests/StoreCareerApplicationRequest.php
  - app/Http/Requests/StoreTripRequestRequest.php
  - app/Http/Requests/CancelTripRequestRequest.php
  - app/Http/Requests/UpdateTripRequestStatusRequest.php
---

# Requests

## Career applications need specific role and resume
Career applications require ONE specific role: career_id is required + exists:careers,id (no general/unspecified applications). resume is required file, mimes pdf/doc/docx, max 5120 KB. CareersController::store sets user_id from auth()->user()?->id (nullable, public form), stores the file on the 'local' (private) disk, and saves resume_name = original client name.

## Bookings reject last-minute pickup times within 12 hours
pickup_time on the public booking form no longer enforces dispatch hours CMS windows — any pickup time is accepted. Instead, a hard-block rejects any pickup time that falls within 12 hours of "now" (the booking time), with the message "Please call dispatch (707) 854-9350 for last minute ride request." Parsing is via Carbon::parse(trip_date.' '.pickup_time). Do not reintroduce the dispatch-hours restriction on the public form.

## Stairs are counts, not booleans
Both pickup_stairs and dropoff_stairs are stored as unsigned integers (count of stairs), valid integer min:0 max:999 in StoreTripRequestRequest and UpdateTripRequestRequest. pickup_stairs must NOT be in either request's BOOLEAN_FIELDS (it was converted via boolean() before). UpdateTripRequestRequest::BOOLEAN_FIELDS contains only will_call/passenger_is_bariatric/oxygen_required/must_provide_wheelchair/has_infectious_disease. Model casts both to 'integer'. On the public booking form and the detail card both render as full-width number inputs.

## Booking cancellation requires a reason
CancelTripRequestRequest (POST dashboard.bookings.cancel) requires a 'reason' field: string|min:10|max:2000. The reason is stored in trip_requests.cancellation_reason and in the audit log. No other fields are accepted.

## Status dropdown excludes CANCELLED
UpdateTripRequestStatusRequest validates status against TripRequest::DROPDOWN_STATUSES (PENDING_DISPATCH, BAMBI_DISPATCHED, IN_TRANSIT, COMPLETED) — CANCELLED is rejected with 422. Cancel is only via the dedicated cancel action, not the dropdown.
