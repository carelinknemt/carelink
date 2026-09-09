---
paths:
  - '.github/workflows/**'
---

# Workflows

## Feature tests must not require a Vite build
`app.blade.php` uses `@vite`, whose `@vite` render calls the Vite manifest. In CI the frontend is never built on the PHP job, so tests fail with "Vite manifest not found at .../public/build/manifest.json". tests/Pest.php registers `$this->withoutVite()` on the Feature TestCase, which renders an empty placeholder instead. Keep using `withoutVite()` in Pest.php — never add an npm build step to php.yml just to satisfy tests.
