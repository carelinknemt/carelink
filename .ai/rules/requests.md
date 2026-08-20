---
paths:
  - app/Http/Requests/StoreCareerApplicationRequest.php
  - app/Http/Requests/StoreTripRequestRequest.php
---

# Requests

## Career applications need specific role and resume
Career applications require ONE specific role: career_id is required + exists:careers,id (no general/unspecified applications). resume is required file, mimes pdf/doc/docx, max 5120 KB. CareersController::store sets user_id from auth()->user()?->id (nullable, public form), stores the file on the 'local' (private) disk, and saves resume_name = original client name.

## Bookings reject pickup times outside dispatch hours
pickup_time must fall within the dispatch_hours CMS windows for the trip_date weekday (App\Cms\DispatchHours parses "7:00 a.m.-6:00 p.m." rows; start/close inclusive, missing days and unparseable times are invalid). Do not bypass this check when changing booking submission.
