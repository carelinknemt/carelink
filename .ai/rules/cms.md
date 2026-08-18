---
paths:
  - 'app/Http/Controllers/Carelink/Cms/**'
---

# Cms

## CMS controllers: null-safe lists and NOT NULL defaults
Laravel's TrimStrings + ConvertEmptyStringsToNull middlewares turn whitespace-only form inputs into null, so CMS list/table handling must filter nulls before trim. Also, store/update payloads must default every DB NOT NULL column ('' for text, 0 for numerics) in values() — the editor sends all fields, but partial payloads otherwise hit NOT NULL constraint failures.
