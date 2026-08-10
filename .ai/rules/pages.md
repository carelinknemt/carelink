---
paths:
  - resources/js/pages/book.tsx
---

# Pages

## Book page uses TripRequest flow, not old modal
The /book page is the public booking form backed by TripRequest (POST bookings.store, wayfinder store). The old ride_bookings / AppointmentController flow (appointment-modal.tsx) is legacy and unreachable — do not wire the modal back into headers. Inertia v3: form.wasSuccessful is a boolean property, not a method. The Button ui component has no orange variant; use default + bg-[#E64A19] for brand orange.
