---
paths:
  - 'resources/js/layouts/**'
---

# Layouts

## Mount useFlashToast only in the Toaster
useFlashToast() must be mounted exactly once globally — it lives inside components/ui/sonner.tsx Toaster. Do NOT call it in layouts or pages (carelink-layout, careers, admin/dashboard previously did and every flash toast fired twice).
