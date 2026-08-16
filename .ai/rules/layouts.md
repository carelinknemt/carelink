---
paths:
  - 'resources/js/layouts/**'
---

# Layouts

## Mount useFlashToast only in the Toaster
useFlashToast() must be mounted exactly once globally — it lives inside components/ui/sonner.tsx Toaster. Do NOT call it in layouts or pages (carelink-layout, careers, admin/dashboard previously did and every flash toast fired twice).

## Auth pages share brand light-only layout with AccessibilityWidget
resources/js/layouts/auth/auth-simple-layout.tsx is the single shell for all pages under resources/js/pages/auth/*. It forces light theme (removes 'dark' class, bg-slate-50, orange top bar #E64A19, brand w/ #004B87, trust points, dispatch phone) and renders <AccessibilityWidget />. Keep the auth slug pages in sync: they share the same BRAND_BUTTON_CLASS constant (bg-[#004B87] hover:bg-[#003d75] focus-visible:ring-[#004B87]/50).
