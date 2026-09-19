# Carelink Medical Transportation — Additional Features Delivered Beyond the Service Level Agreement

This document records features implemented and delivered on the Carelink NEMT web platform that
exceed the scope expressly listed in Sections 3.1 (Sitemap and Page-Level Scope) and 3.2 (Core
System Functionality) of the Web Platform Development and Service Level Agreement (the "SLA").
Each feature below was not part of the agreed scope and is delivered as additional value. Where a
capability enhances an in-scope system without extending beyond it, it is described under
"Enhancements Within Listed Scope" for reference, rather than claimed as an additional feature.

All additional features remain governed by the terms of the SLA (including warranty, intellectual
property assignment, and confidentiality), and nothing herein modifies the scope in Section 3 of
the SLA without a written Change Order.

## Additional Features (Out of SLA Scope)

### 1. Booking & Dispatch Management Console

A complete operational console for the client's dispatch team:

- **Booking list & detail pages** with searchable/sortable columns and a rich filter set,
  including exports of the booking register to CSV and per-trip CSV exports.
- **Full trip status workflow** driving the entire dispatch lifecycle — _Pending Dispatch →
  Bambi Dispatched → In Transit → Completed → Cancelled_.
- **Trip editing** and status updates on an admin-approved basis, with an automatic reversal
  (refund) on cancellation.
- **Per-trip audit trail** recording which staff member changed what, from which value, to which
  value, and when — a full accountability history for every booking.

_Why it is beyond the SLA:_ dispatch operations, filtering, exports, and audit logging are not
listed anywhere in Sections 3.1 or 3.2.

### 2. Automatic Refunds & Balance Billing

- **One-click cancellation with automatic refund**: cancelling a paid trip triggers a Stripe
  refund automatically, records refund timestamps and reasons, and notifies the passenger by
  email. Free cancellation is additionally documented for trips cancelled at least two hours
  before pickup.
- **Balance billing for additional charges**: dispatchers can add a charge to any paid trip for
  services rendered after the fact (e.g. extra waiting time, additional miles). Each charge gets
  its own secure, expiring payment link, an emailed notice with the link, and SMS-ready copy
  dispatchers can send directly to the passenger.

_Why it is beyond the SLA:_ the SLA covers only "PCI-compliant payment processing via Stripe or
Square for private-pay clients". Refund automation, charge creation, and follow-on collection are
not part of that scope.

### 3. Client Trip Tracking

- A public, bookmarkable **tracking page** identified by the trip's unique booking reference that
  shows live status and payment state.
- **Automatic page refresh** while a payment is pending, plus a **Resume Payment** link for
  abandoned checkouts and a **copy tracking link** action for staff to share with clients.

_Why it is beyond the SLA:_ no client-facing booking visibility existed in the agreed scope.

### 4. Transparent Distance-Based Fare Estimation

- **Real route distance** computed over actual road/route geometry (via OSRM) at booking time,
  with the distance shown on the booking review step alongside a map preview of the route.
- A **server-side fare estimate** (base rate for the first miles + per-mile rate) that previews an
  expected price before submission — an estimate, not a binding quote.

_Why it is beyond the SLA:_ the SLA's Fleet Choice Engine deliberately avoided "upfront price
commitments"; a live fare estimator and route preview were not agreed.

### 5. Role-Based Access Control & Staff Management

- **Granular roles** — Admin, Dispatcher, Manager, and Driver — that govern exactly what each
  staff member can see and do across the dashboard.
- **Staff invitations** created by admins, including driver invites that do not require an email
  address.
- **Ban/restore** of user accounts, and **employee profiles** with contact details plus a secure
  document store (upload/view/download of certifications, licenses, and related files).

_Why it is beyond the SLA:_ authentication, staff administration, roles, bans, and document
management are not part of the agreed scope.

### 6. Fleet Maintenance & Compliance Module

- **Vehicle registry** for the fleet with VIN and license-plate numbers managed separately from
  the public fleet showcase.
- **Scheduled maintenance log** with per-vehicle records, attached document storage, and a
  **printable maintenance report (PDF)** for compliance and record-keeping.

_Why it is beyond the SLA:_ the SLA's Fleet section covers only the public vehicle showcase,
accessibility features, and safety protocols — not maintenance tracking or reporting.

### 7. Payments & Operations Analytics

- A **payments ledger** summarizing totals (booked / collected / pending / refunded) with a
  refunded-payments filter for reconciliation.
- An **analytics dashboard** with date-range controls including a one-year quick filter and a
  custom range, covering booking and revenue activity.

_Why it is beyond the SLA:_ no reporting or analytics of any kind was in scope.

### 8. Passenger Safety & Service Controls

- **Passenger blacklist** with passenger names, search, edit, and delete — protecting drivers and
  staff from repeat no-shows or abusive incidents.
- **Will-call on-demand dispatch** — a booking option that dispatches on demand at pickup time
  rather than on a fixed schedule.
- **Medical passenger profile** including oxygen requirements (with liters-per-minute), infectious
  disease precautions, and stairs counts for pickup and drop-off.
- **Scheduling safeguards** that block bookings within 12 hours of pickup and direct last-minute
  requests to the dispatch hotline, plus double-submit protection.

_Why it is beyond the SLA:_ none of these safety, medical-detail, or scheduling controls are
listed in the agreed scope.

### 9. B2B Partnership Management

- A dashboard workflow to **review, approve, or reject** hospital/facility partnership
  applications, with automated **decision emails** sent to the applicant and business-volume
  context surfaced for each request.

_Why it is beyond the SLA:_ the SLA lists only the public partnership benefits hub and the
onboarding application portal; the internal approval pipeline is additional.

### 10. Recruitment & Talent Management

- **Job-opening management** — create, edit, activate/deactivate, and remove roles from the
  dashboard.
- **Application review workflow** — review submitted resumes, accept or reject candidates with
  automated email notifications, and delete records. Resumes are uploaded securely (PDF/DOC, size
  limited) during application.
- **QR-code job sharing** — share a vacancy via a QR code generated from the dashboard or the
  careers page, plus structured job-posting data for search engine visibility.

_Why it is beyond the SLA:_ the SLA lists only the public job openings pages and the online
application intake; the management, review, and sharing tooling is additional.

### 11. Expanded CMS Content Platform

The SLA's CMS page covers managing services and fleet vehicles. The delivered CMS goes
substantially further with an admin content platform that manages:

- **Homepage and page sections** (hero, booking steps, testimonials, trust signals, and more) with
  one-click restore of any section to its default content.
- **Services** including transport/service-level definitions **and their pricing rates** used by
  the live fare estimator.
- **Fleet vehicles**, **team members**, **FAQs**, and **blog posts** (with restore-to-default for
  each collection).
- **Image library** for uploading and reusing brand imagery across pages.
- **Booking-fee settings**, allowing the booking fee amount and its display label to be configured
  without code changes.

_Why it is beyond the SLA:_ the breadth of editable content, the image library, restore-to-default
controls, and CMS-managed pricing settings extend well past the agreed CMS scope.

### 12. Internal Training Knowledge Base (KMS)

- A password-protected **employee training wiki** inside the dashboard with categorized articles,
  full-text search, table of contents, and prev/next navigation.
- **Interactive guided tours** that walk staff step-by-step through real operations — viewing and
  filtering bookings, changing statuses, cancelling and auto-refunding, managing users, reviewing
  applications, approving partners — using **in-app simulated dashboard mockups**.

_Why it is beyond the SLA:_ staff training, documentation, and guided tours are not mentioned
anywhere in the agreed scope.

### 13. TCPA-Compliant SMS Consent & Texting Support

- A **mandatory SMS consent step** at the start of booking with full disclosure of how phone
  numbers are used (confirmation, reminders, driver updates, schedule changes, cancellation
  notices), STOP/HELP instructions, and a clear statement that consent is not a condition of
  purchase.
- A dedicated **SMS Terms page** and a text-message help dialog, plus phone validation that
  accepts standard US numbers.

_Why it is beyond the SLA:_ SMS consent, texting disclosures, and telephone-consumer protection
are not part of the agreed scope.

### 14. Automated Email Notifications

A transactional email layer covering booking confirmation, trip cancellation, charge-due
notices, application accepted/rejected, and partnership approved/rejected — delivered
automatically to customers, candidates, and partners.

_Why it is beyond the SLA:_ the SLA does not list any email or notification capability.

## Enhancements Within Listed Scope (For Reference)

The following are richer implementations of systems already listed in Sections 3.1/3.2. They are
delivered as part of scope and are not claimed as additional features:

- **Geographic verification** — delivered with Google Places address autocomplete restricted to
  California, a "use my current location" option, and a map-based "Check Location" dialog with a
  satellite map preview that confirms pick-up/drop-off coordinates before submission.
- **Bambi NEMT integration** — booking payloads are produced as a structured, Bambi-compatible
  CSV export (44-column contract) written at booking time and re-exportable from the dashboard,
  paired with the Bambi-aligned trip status lifecycle.
- **Local SEO optimization (Phase 5)** — implemented with a dynamically generated XML sitemap,
  robots.txt, per-page titles/descriptions/canonical URLs/breadcrumbs, and structured data.
- **Payment gateway for private-pay clients** — implemented with a guest self-service Stripe
  Checkout flow, webhook-backed payment confirmation, session expiry, and pending-payment status
  polling.

---

_This document is informational and does not alter the SLA. Any feature listed above remains
subject to the SLA's commitment, warranty, intellectual property, and confidentiality provisions.
Work outside the SLA scope continues to require a written Change Order under Section 7._