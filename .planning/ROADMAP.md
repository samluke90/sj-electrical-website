# Roadmap: SJ Electrical Contractors Website

## Milestones

- ✅ **v1.0 MVP** - Phases 1-3 (shipped 2026-01-22)
- ✅ **v1.1 Form Functionality** - Phases 4-5 (shipped 2026-01-22)
- ✅ **v1.2 Quote Form Enhancements** - Phases 6-7 (shipped 2026-01-26)
- 🔄 **v1.3 Branding & Polish** - Phases 8-9 (in progress)

## Phases

<details>
<summary>✅ v1.0 MVP (Phases 1-3) - SHIPPED 2026-01-22</summary>

### Phase 1: UX Cleanup
**Goal**: Remove distracting elements and establish clean dark-first design
**Plans**: 2 plans

Plans:
- [x] 01-01: Remove spark cursor effect
- [x] 01-02: Implement session-based loading animation

### Phase 2: Design System
**Goal**: Establish consistent color scheme and typography
**Plans**: 2 plans

Plans:
- [x] 02-01: Set up dark-first color palette (black/white/orange)
- [x] 02-02: Apply Outfit font and minimalist layout

### Phase 3: Content Update
**Goal**: Complete business information and service details
**Plans**: 2 plans

Plans:
- [x] 03-01: Update business details and NICEIC certification
- [x] 03-02: Complete services list and placeholder content

</details>

<details>
<summary>✅ v1.1 Form Functionality (Phases 4-5) - SHIPPED 2026-01-22</summary>

### Phase 4: Styling Fixes
**Goal**: Fix styling inconsistencies in dark mode
**Plans**: 1 plan

Plans:
- [x] 04-01: Fix form inputs, footer, and button styling

### Phase 5: Form Functionality
**Goal**: Implement functional quote form with n8n webhook
**Plans**: 1 plan

Plans:
- [x] 05-01: Implement form submission and error handling

</details>

<details>
<summary>✅ v1.2 Quote Form Enhancements (Phases 6-7) - SHIPPED 2026-01-26</summary>

**Milestone Goal:** Formalize, test, and polish the quote form enhancements (WhatsApp handoff, voice recording, symptom checker) with comprehensive cross-browser testing and edge case handling.

#### Phase 6: Formalize Implementation
**Goal**: Verify and commit existing quote form enhancements
**Depends on**: Phase 5
**Requirements**: FORM-01, FORM-02, FORM-03, FORM-04, FORM-05, FORM-06
**Success Criteria** (what must be TRUE):
  1. User can send quote request via WhatsApp with pre-filled message containing service and details
  2. User can record voice message up to 60 seconds describing electrical issue
  3. User sees guided diagnostic questions for Fault Finding, Rewiring, and Consumer Unit services
  4. Contact preferences (email/phone/WhatsApp checkboxes) reach n8n webhook correctly
  5. All form features work as expected when manually tested in one browser
**Plans**: 1 plan

Plans:
- [x] 06-01-PLAN.md - Verify features and commit implementation

#### Phase 7: Testing & Polish
**Goal**: Ensure cross-browser compatibility, responsive design, and graceful error handling
**Depends on**: Phase 6
**Requirements**: TEST-01, TEST-02, TEST-03, TEST-04, TEST-05, PLSH-01, PLSH-02, PLSH-03, PLSH-04, EDGE-01, EDGE-02, EDGE-03, EDGE-04
**Success Criteria** (what must be TRUE):
  1. Voice recording works in Chrome, Firefox, Safari (desktop and mobile browsers)
  2. WhatsApp button opens correctly on desktop and mobile with proper message formatting
  3. All new components (voice recorder, symptom checker, WhatsApp button) styled correctly in both dark and light modes
  4. Voice recorder and symptom checker are fully responsive on mobile devices
  5. Form gracefully handles edge cases (microphone denied, MediaRecorder unsupported, form submission without voice, WhatsApp with empty fields)
**Plans**: 2 plans

Plans:
- [x] 07-01-PLAN.md — Cross-browser compatibility and edge case handling
- [x] 07-02-PLAN.md — Responsive touch targets and styling polish

</details>

<details open>
<summary>🔄 v1.3 Branding & Polish (Phases 8-9) - IN PROGRESS</summary>

**Milestone Goal:** Audit and fix logo/branding changes across all pages, add NICEIC badge visibility, and fix contact form to use n8n webhook.

#### Phase 8: Branding & Badge Audit
**Goal**: Ensure consistent logo display and proper NICEIC badge visibility across all pages
**Depends on**: Phase 7
**Requirements**: BRAND-01, BRAND-02, BADGE-01, BADGE-02, BADGE-03
**Success Criteria** (what must be TRUE):
  1. Header logo displays correctly on all 5 pages (index, about, services, quote, contact)
  2. Footer logo displays correctly on all 5 pages
  3. NICEIC badge visible in index page hero/credentials section
  4. NICEIC badge displays as rectangular image in all footers (not circular)
  5. NICEIC badge visible in about page credentials section
**Plans**: 1 plan

Plans:
- [ ] 08-01-PLAN.md — Fix CSS conflict and replace styled text with actual NICEIC badge image

#### Phase 9: Contact Form Fix
**Goal**: Make contact form functional with n8n webhook backend
**Depends on**: Phase 8
**Requirements**: FORM-01, FORM-02
**Success Criteria** (what must be TRUE):
  1. Contact form submits successfully to n8n webhook
  2. User sees success confirmation after form submission
  3. Form shows appropriate error message on failure
  4. Form fields reset after successful submission
**Plans**: TBD (will be created during planning)

Plans:
- [ ] 09-01-PLAN.md — Contact form n8n integration

</details>

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. UX Cleanup | v1.0 | 2/2 | Complete | 2026-01-22 |
| 2. Design System | v1.0 | 2/2 | Complete | 2026-01-22 |
| 3. Content Update | v1.0 | 2/2 | Complete | 2026-01-22 |
| 4. Styling Fixes | v1.1 | 1/1 | Complete | 2026-01-22 |
| 5. Form Functionality | v1.1 | 1/1 | Complete | 2026-01-22 |
| 6. Formalize Implementation | v1.2 | 1/1 | Complete | 2026-01-23 |
| 7. Testing & Polish | v1.2 | 2/2 | Complete | 2026-01-26 |
| 8. Branding & Badge Audit | v1.3 | 0/1 | Pending | — |
| 9. Contact Form Fix | v1.3 | 0/1 | Pending | — |
