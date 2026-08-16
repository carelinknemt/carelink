---
paths:
  - app/Http/Requests/StoreCareerApplicationRequest.php
---

# Requests

## Career applications need specific role and resume
Career applications require ONE specific role: career_id is required + exists:careers,id (no general/unspecified applications). resume is required file, mimes pdf/doc/docx, max 5120 KB. CareersController::store sets user_id from auth()->user()?->id (nullable, public form), stores the file on the 'local' (private) disk, and saves resume_name = original client name.
