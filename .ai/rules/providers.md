---
paths:
  - 'app/Providers/**'
---

# Providers

## 404/5xx errors render Inertia error page with public layout
HTTP errors (403/404/500/503) are handled via Inertia::handleExceptionsUsing() in AppServiceProvider boot(), rendering page 'error' (resources/js/pages/error.tsx) with `status` prop and withSharedData(). 'error' and 'terms' are registered in the CarelinkLayout public-pages list in resources/js/app.tsx so they share the public header/footer. Error statuses are mapped to title/description in ERROR_DETAILS.
