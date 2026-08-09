# Carelink NEMT System Design Specification

This document provides a comprehensive overview of the design architecture, user experience systems, and typographic and visual specifications implemented within the Carelink Non-Emergency Medical Transportation (NEMT) platform.

---

## 1. Design Philosophy & Visual Language

Carelink’s design centers on accessibility, security, and high trust. As a medical transportation provider serving non-ambulatory, elderly, and fragile patient groups in Northern California, the aesthetic avoids high-intensity gradients, glowing effects, and generic tech-startup clichés ("AI Slop").

### A. Color Palette
The colors are selected to maximize readability, pass strict WCAG AA contrast ratios, and establish an eye-safe, calming clinical layout:
*   **Primary Corporate Navy:** `#004B87` (Deep Blue) — Establishes corporate authority and dependability.
*   **A11y/Primary Accents:** `#7E3B81` (Plum/Purple) — Reserved for accessibility (ADA) interactive controls to distinguish them visually from booking pathways.
*   **Secondary Fresh Highlights:** `#06B6D4` (Cyan) and `#22D3EE` (Teal) — Used for state labels, active highlights, icons, and focus indicators.
*   **Neutrals:** `#F8FAFC` (Slate 50) and `#FFFFFF` (White) — Soft backgrounds mixed with `<5%` saturation to maintain warmth and reduce eye strain.

### B. Typography & Spatial Layout
*   **Scale archetype:** Low-contrast Major Second (1.125) for application and dashboard density.
*   **Baseline Readability:** Minimum body size is `16px` on desktop and `14px` on mobile, maintaining line heights of `1.5` to `1.7` for dense yet legible text layout.
*   **Line-Width limits:** Standard paragraphs are capped at `65ch` to guarantee optimal visual scanning.

---


## 2. Platform Sections & Structure

The Carelink NEMT platform is built with a highly cohesive, single-page architecture backed by modular page overlays:

### A. Core Homepage Sections
1.  **Hero Carousel Section (`Hero.tsx`):** An interactive slide sequence showing Carelink’s primary value proposition. Replaced busy, unrequested feature cards with a clean, high-contrast display layout and a primary "Book a Ride" CTA.
2.  **Core NEMT Services (`CommittedExcellence.tsx`):** A streamlined service grid showcasing Wheelchair, Group Transit Shuttle, Ambulatory, and Hospital Discharge transit. Features visual category tags and instant "View Details" overlays.
3.  **Google Patient Reviews (`SmileThatShine.tsx`):** An eye-catching infinite marquee loop hosting verified Google rating indicators and real testimonials from dialysis patients, social workers, and family members.
4.  **Authorized Leaders (`SpecializedTeam.tsx`):** Clean leadership profile grid showcasing operational staff using beautiful vector avatars and professional backgrounds to highlight compliance and security.
5.  **Contacts & Operating Hours (`ContactAndHours.tsx`):** Comprehensive block detailing operational schedules, real-time dispatch hotline, and regional coverage across Northern California (Humboldt, Shasta, and surrounding regions).

### B. Modular Navigation Sub-Pages
*   **Our Fleet (`FleetPage.tsx`):** Showcases modern, ADA-compliant vehicles categorized by type (Wheelchair, Transit Shuttles, Ambulatory) with precise passenger capacities, safety certifications, and specialized equipment specifications.
*   **Careers Hub (`CareersPage.tsx`):** Features active position openings (Drivers, Dispatchers, Fleet Technicians) highlighting compensation, standard employee benefits, and onboarding requirements.
*   **Partnerships & B2B (`PartnershipsPage.tsx`):** Optimized for medical centers, hospitals, and dialysis clinics to coordinate regular, recurring transport services. Includes dedicated secure inquiry channels.
*   **Resource Center & Blog (`BlogPage.tsx`):** Medical transportation resources, state compliance articles, senior safety tips, and regional wellness updates.
*   **Frequently Asked Questions (`FAQPage.tsx`):** Clean, searchable accordion directory resolving top user questions about insurance coverage, dispatch response times, booking windows, and companion regulations.

---

## 3. Refined Component Implementations

### A. Dynamic Sticky Header
Designed with a clean, space-saving behavior on mobile and desktop viewports:
*   **Top Utility Bar:** Includes certified NEMT credentials and instant contact phones.
*   **Scroll Tracking:** Incorporates a passive scroll event listener that slides the top bar away gracefully when scrolling down (`window.scrollY > 20`), allowing maximum space for core content navigation.
*   **Reduced Mobile Logo:** Optimized dynamic scale (`h-7` to `h-8` with max widths) to ensure action items like "Book a Ride" and the "ADA Controls" sit perfectly on a single line without wrapping.

### B. Google Patient Reviews (Infinite Marquee Slider)
Instead of static feature cards, Carelink displays real patient testimonies inside an infinite looping marquee track:
*   **Fluid Slider Movement:** An infinite `marquee` keyframe CSS animation shifts the reviews smoothly from right to left.
*   **Visual Fade Masks:** Utilizes horizontal linear-gradient masks (`mask-gradient`) to fade the left and right edges seamlessly into the background.
*   **Pause on Hover:** Integrates standard hover/interaction triggers that pause the slide speed instantly when a user holds their mouse over a specific card.

### C. Standardized Team View
Following clear, professional design guidelines, team pages omit temporary mock photos:
*   **Vector User Avatars:** Uses styled, centralized Lucide `User` icon structures nested within smooth `bg-cyan-100` circular boundaries.
*   **Trust Labels:** Emphasizes authorization and authority with strict uppercase text markers ("Authorized Leader").

### D. Responsive Modal Containers
Both the **Appointment Booking Modal** and the **Accessibility Widgets** are structured for touch-target safety:
*   **Viewport Constraints:** Constrained to `max-h-[90vh]` on desktop and `max-h-[85vh]` on mobile to guarantee headers and bottom action footers never clip outside the screen.
*   **Overscroll Isolation:** Utilizes `overscroll-contain` and `min-h-0` inside the scrollable scroll tracks to isolate modal scrolling, preventing the underlying page content from shifting.
*   **Enhanced Touch Targets:** All interactive control buttons, toggle selectors, and close handlers are padded to meet or exceed the standard `44px` mobile tap grid target.

---



