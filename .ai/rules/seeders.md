---
paths:
  - 'database/seeders/**'
---

# Seeders

## Never seed admin users or default passwords
The admin UI was removed; CarelinkContentSeeder no longer seeds an admin user. Never re-add admin seeding or any password literal (the repo is public on GitHub — 'carelink2026' was committed and later scrubbed). Credentials must come from env only, with no fallback default.
