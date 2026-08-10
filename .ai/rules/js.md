---
paths:
  - 'resources/js/**'
---

# Js

## Never partial-object setData with Inertia v3 useForm
Inertia v3 trap: useForm's OBJECT form setData({...}) REPLACES the entire data object instead of merging — partial updates wipe every other field (undefined values, radios/checkboxes flip to uncontrolled, validation crashes on .trim()). Always use the key/value pair form setData('field', value). Registers for admin/login.tsx are safe only because they set every field at once.
