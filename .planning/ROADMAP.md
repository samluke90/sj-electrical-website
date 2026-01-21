# Roadmap: SJ Electrical Website v1.1

**Milestone:** v1.1 (Color Fixes + Form Functionality)
**Phases:** 2
**Depth:** Quick
**Started:** 2026-01-21

## Overview

This milestone completes two finishing touches for the v1.0 website: fixing dark mode color issues (form inputs, footer, button contrast) and implementing functional form submission via Formspree. Both are independent workstreams that can be executed in any order.

## Phase 4: Styling Fixes

**Goal:** All UI elements display with proper contrast and consistent dark mode styling.

**Dependencies:** None (builds on v1.0 CSS)

**Requirements:**
- STYLE-01: Form inputs have dark background with light text in dark mode
- STYLE-02: Footer has subtle dark background (#111) with light text in dark mode
- STYLE-03: Buttons on orange backgrounds use dark fill with white text
- STYLE-04: All color combinations maintain readable contrast in both modes

**Success Criteria:**
1. Form input fields on quote page are clearly visible with dark background and light text
2. Footer section has distinct but subtle dark background that separates it from main content
3. CTA buttons on orange hero sections use dark fill (readable against orange)
4. Toggling between dark and light mode shows all text remains readable (no low-contrast combinations)

## Phase 5: Form Functionality

**Goal:** Users can submit the quote form and receive confirmation of their request.

**Dependencies:** None (form HTML already exists from v1.0)

**Requirements:**
- FORM-01: Quote form submits to Formspree endpoint
- FORM-02: Form submission sends email to info@sjec.uk
- FORM-03: User sees success message after submission
- FORM-04: User sees error message if submission fails

**Success Criteria:**
1. User fills out quote form and clicks submit - form data is sent to Formspree
2. Business owner receives email at info@sjec.uk with form contents
3. After successful submission, user sees a clear success message (form replaced or overlay)
4. If submission fails (network error, validation), user sees an error message with guidance

## Progress

| Phase | Status | Plans | Started | Completed |
|-------|--------|-------|---------|-----------|
| 4 - Styling Fixes | Pending | 0/? | - | - |
| 5 - Form Functionality | Pending | 0/? | - | - |

---
*Roadmap created: 2026-01-21*
*Last updated: 2026-01-21*
