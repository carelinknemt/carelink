---
paths:
  - 'resources/js/**'
---

# Js

## Never partial-object setData with Inertia v3 useForm
Inertia v3 trap: useForm's OBJECT form setData({...}) REPLACES the entire data object instead of merging — partial updates wipe every other field (undefined values, radios/checkboxes flip to uncontrolled, validation crashes on .trim()). Always use the key/value pair form setData('field', value). Registers for admin/login.tsx are safe only because they set every field at once.

## US-only phone input via shared PhoneInput component
Use components/carelink/phone-input.tsx for all phone fields (book.tsx passenger phone, dashboard booking edit phone fields). It uses libphonenumber-js, shows a +1 US country-code select next to the number, and stores the combined value like "+1 707-555-0192". isUsPhoneNumber() (US only, E.164 or national formats) is exported for client-side checks. Backend Store/UpdateTripRequestRequest enforce the same US format with a regex.
