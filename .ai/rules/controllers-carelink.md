---
paths:
  - 'app/Http/Controllers/Carelink/**'
---

# Controllers Carelink

## Career applications submit via POST /careers/apply
The careers page posts employment applications to `careers.apply` (POST /careers/apply), validated by StoreCareerApplicationRequest, stored in `career_applications` (career_id nullable for general applications). Success flashes an Inertia `toast` and returns back. Apply Now buttons preselect the position in the form.
