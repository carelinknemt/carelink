---
paths:
  - app/Http/Requests/StoreCareerApplicationRequest.php
  - app/Http/Requests/StoreTripRequestRequest.php
---

# Requests

## Career applications need specific role and resume
Career applications require ONE specific role: career_id is required + exists:careers,id (no general/unspecified applications). resume is required file, mimes pdf/doc/docx, max 5120 KB. CareersController::store sets user_id from auth()->user()?->id (nullable, public form), stores the file on the 'local' (private) disk, and saves resume_name = original client name.

## Bookings reject last-minute pickup times within 12 hours
pickup_time on the public booking form no longer enforces dispatch hours CMS windows — any pickup time is accepted. Instead, a hard-block rejects any pickup time that falls within 12 hours of "now" (the booking time), with the message "Please call dispatch (707) 854-9350 for last minute ride request." Parsing is via Carbon::parse(trip_date.' '.pickup_time). Do not reintroduce the dispatch-hours restriction on the public form.
