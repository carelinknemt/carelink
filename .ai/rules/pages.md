---
paths:
  - resources/js/pages/book.tsx
---

# Pages

## Book page uses TripRequest flow, not old modal
The /book page is the public booking form backed by TripRequest (POST bookings.store, wayfinder store). The old ride_bookings / AppointmentController flow (appointment-modal.tsx) is legacy and unreachable — do not wire the modal back into headers. Inertia v3: form.wasSuccessful is a boolean property, not a method. The Button ui component has no orange variant; use default + bg-[#E64A19] for brand orange.

## Book form: DatePicker/TimePicker + FIELD_BG, no native date/time inputs
Do not use native inputs type=date/time on the book form — they render inconsistently (gray, no picker) on deployed browsers. Use components/carelink/date-picker.tsx (react-day-picker v10, calendar captionLayout="dropdown" for dates, disabled before TODAY) and time-picker.tsx (15-min slots, "07:00 AM" 12h format matching dispatch). All controls need FIELD_BG (bg-white + dark: overrides) or they look gray on surfaced panels. day-picker v10: focus prop is autoFocus (initialFocus was removed).

## Submit requires review confirmation gate
The review step's Submit button is type="button" (never a native submit) and stays disabled until reviewReady (800ms after arriving on the review step). This prevents double-click/Enter from submitting the trip while the reviewer is still on earlier steps; pressing Enter on earlier steps only advances via handleSubmit.
