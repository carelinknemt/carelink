---
paths:
  - resources/js/pages/book.tsx
  - 'resources/js/pages/**'
  - 'resources/js/pages/*.tsx'
---

# Pages

## Book page uses TripRequest flow, not old modal
The /book page is the public booking form backed by TripRequest (POST bookings.store, wayfinder store). The old ride_bookings / AppointmentController flow (appointment-modal.tsx) is legacy and unreachable — do not wire the modal back into headers. Inertia v3: form.wasSuccessful is a boolean property, not a method. The Button ui component has no orange variant; use default + bg-[#E64A19] for brand orange.

## Book form: DatePicker/TimePicker + FIELD_BG, no native date/time inputs
Do not use native inputs type=date/time on the book form — they render inconsistently (gray, no picker) on deployed browsers. Use components/carelink/date-picker.tsx (react-day-picker v10, calendar captionLayout="dropdown" for dates, disabled before TODAY) and time-picker.tsx (15-min slots, "07:00 AM" 12h format matching dispatch). All controls need FIELD_BG (bg-white + dark: overrides) or they look gray on surfaced panels. day-picker v10: focus prop is autoFocus (initialFocus was removed).

## Submit requires review confirmation gate
The review step's Submit button is type="button" (never a native submit) and stays disabled until reviewReady (800ms after arriving on the review step). This prevents double-click/Enter from submitting the trip while the reviewer is still on earlier steps; pressing Enter on earlier steps only advances via handleSubmit.

## Public page content width matches blog (max-w-7xl)
All public pages outside the landing page use the same content container width as the blog page: mx-auto max-w-7xl with px-4 sm:px-6 lg:px-12 (blog.tsx is the reference). careers, faqs, book, business all use max-w-7xl now.

## Public pages use PageHero component
All public pages (except home/landing) use the shared full-bleed hero from components/carelink/page-hero.tsx (careers-style: border-b-8 orange, image background, badge pill optional, title/subtitle). Structure: min-h-screen bg-slate-50 pb-16 wrapper > PageHero > content div mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-12. Use PageHero for any new public page.
