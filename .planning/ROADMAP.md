# Roadmap: SJ Electrical Contractors Website

## Overview

Transform the existing SJ Electrical website from its current state into a professional, minimalist black/white/orange design with accurate business information. The work naturally divides into three phases: cleaning up interaction effects, establishing the new design system, and updating all content with real business details.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: UX Cleanup** - Remove spark cursor, optimize loading animation
- [x] **Phase 2: Design System** - Implement black/white/orange minimalist aesthetic
- [x] **Phase 3: Content Update** - Replace all placeholder content with real business info

## Phase Details

### Phase 1: UX Cleanup
**Goal**: Site interactions feel professional and non-intrusive
**Depends on**: Nothing (first phase)
**Requirements**: UXFX-01, UXFX-02, UXFX-03
**Success Criteria** (what must be TRUE):
  1. User sees no spark/particle effects following their cursor
  2. User sees lightbulb animation on first visit to site
  3. User navigating between pages does not see loading animation repeat
  4. Returning visitor in same session sees no loading animation
**Plans**: 2 plans

Plans:
- [x] 01-01-PLAN.md - Remove spark cursor effect (preserve light switch burst)
- [x] 01-02-PLAN.md - Session-based loading animation with cross-tab sync

### Phase 2: Design System
**Goal**: Site presents a cohesive black/white/orange minimalist aesthetic
**Depends on**: Phase 1
**Requirements**: DSGN-01, DSGN-02, DSGN-03, DSGN-04, DSGN-05, DSGN-06
**Success Criteria** (what must be TRUE):
  1. Site loads with black background by default
  2. All primary text is white and readable against black
  3. CTAs and highlights use orange accent color consistently
  4. Typography appears modern and geometric across all pages
  5. Layout has generous whitespace, no visual clutter
  6. Light mode toggle produces a coherent light theme (not broken/inverted)
**Plans**: 2 plans

Plans:
- [x] 02-01-PLAN.md - Core design system (CSS tokens, typography, theme inversion)
- [x] 02-02-PLAN.md - Theme flash prevention and spacing refinement

### Phase 3: Content Update
**Goal**: All content reflects accurate SJ Electrical business information
**Depends on**: Phase 2
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04, CONT-05, CONT-06, CONT-07
**Success Criteria** (what must be TRUE):
  1. Business name "SJ Electrical Contractors Limited" appears in header/footer
  2. Contact page shows correct address, email, and phone number
  3. Services page lists all offered services (rewiring, consumer units, EICR, etc.)
  4. NICEIC Approved Contractor certification is visibly displayed
  5. Service area "London and surrounding areas" is stated
  6. Testimonials section exists with placeholder structure
  7. Social media links section exists with placeholder structure
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md - Update contact details, service area, NICEIC, and testimonial placeholders
- [x] 03-02-PLAN.md - Add social media placeholder links to all footers

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. UX Cleanup | 2/2 | Complete | 2025-01-19 |
| 2. Design System | 2/2 | Complete | 2026-01-20 |
| 3. Content Update | 2/2 | Complete | 2026-01-21 |

---
*Roadmap created: 2025-01-19*
*Phase 1 planned: 2025-01-19*
*Phase 2 planned: 2026-01-20*
*Phase 3 planned: 2026-01-20*
