---
phase: 09-contact-form-fix
plan: 01
subsystem: forms
tags: [contact-form, webhook, accessibility, cors, v1.3]

# Dependency graph
requires:
  - phase: 08-branding-badge-audit
    provides: v1.3 branding baseline complete
provides:
  - Contact form submits via FormData to receptionist/n8n endpoint
  - Accessible success and error states for Contact page enquiries
  - Honeypot spam protection matching quote form pattern
  - v1.3 Branding & Polish complete
affects: [lead-capture, future-form-updates, receptionist-webhook]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Use FormData for cross-origin form submissions to receptionist.jenk0.uk"
    - "Treat response.ok as success instead of requiring JSON body"
    - "Inline accessible success/error regions instead of alert() popups"

key-files:
  created:
    - js/contact-form.js
    - .planning/phases/09-contact-form-fix/09-01-PLAN.md
  modified:
    - contact.html
    - css/styles.css
    - .planning/ROADMAP.md
    - .planning/STATE.md
    - .planning/MILESTONES.md
  moved:
    - .planning/todos/pending/2026-02-01-audit-logo-changes.md -> .planning/todos/done/2026-02-01-audit-logo-changes.md

key-decisions:
  - "Mirrored the quote form submission pattern rather than keeping the contact form's JSON handler"
  - "Avoided a real live webhook submission during testing; used headless Chromium with fetch stubbed locally"
  - "Archived stale logo audit todo because Phase 8 already consumed it"

patterns-established:
  - "Contact and quote forms both post FormData to the receptionist endpoint"
  - "Success path resets fields; failure path preserves fields for retry"

# Metrics
duration: 25min
completed: 2026-04-29
---

# Phase 09 Plan 01: Contact Form Fix Summary

**Contact form now uses the working FormData webhook pattern with accessible success/error UI.**

## Accomplishments

- Replaced fragile inline JSON contact form handler with `js/contact-form.js`.
- Contact form now posts `FormData` to `https://receptionist.jenk0.uk/api/contact` without explicit `Content-Type` headers.
- Added accessible error region (`role="alert"`) and success region (`role="status"`).
- Added loading state with `aria-busy` while submission is in progress.
- Added hidden `_honeypot` field matching the quote form spam-protection pattern.
- On success: form resets, success confirmation appears, focus moves to the success message.
- On failure: error message appears, fields remain filled for retry.
- Archived the stale logo audit todo consumed by Phase 8.

## Verification

- `node --check js/contact-form.js` — passed.
- HTML parser check across all 5 pages — passed.
- Headless Chromium/CDP success-path test with stubbed fetch — passed:
  - endpoint: `https://receptionist.jenk0.uk/api/contact`
  - method: `POST`
  - body: `FormData`
  - explicit headers: `false`
  - success shown: `true`
  - errors visible: `false`
  - fields reset: `true`
  - `aria-busy`: `false`
- Headless Chromium/CDP failure-path test with stubbed 500 response — passed:
  - success shown: `false`
  - errors visible: `true`
  - fields preserved for retry: `true`
  - `aria-busy`: `false`

## Files Created/Modified

- `js/contact-form.js` — new contact form submission handler.
- `contact.html` — added success/error containers, honeypot, multipart form encoding, submit button id, and script include.
- `css/styles.css` — added `.contact-form-success` styling.
- `.planning/phases/09-contact-form-fix/09-01-PLAN.md` — created execution plan.
- `.planning/phases/09-contact-form-fix/09-01-SUMMARY.md` — this summary.
- `.planning/ROADMAP.md` — marked Phase 9 and v1.3 complete.
- `.planning/STATE.md` — updated current position.
- `.planning/MILESTONES.md` — added v1.3 shipped note.
- `.planning/todos/done/2026-02-01-audit-logo-changes.md` — moved and closed stale todo.

## User Setup Required

None from the website side.

If we want absolute end-to-end proof, Sam can submit one real contact-form test on the live site after deploy so the receptionist/n8n side receives an actual message. I avoided doing that automatically to prevent fake customer noise.

## Next Phase Ideas

- Real testimonials / Google review snippets.
- Project gallery with before/after photos.
- Better local SEO landing pages for nearby areas.
- Replace the slightly dubious embedded map URL with a clean Google Maps embed/place link.

---
*Phase: 09-contact-form-fix*  
*Completed: 2026-04-29*
