# SJ Electrical Contractors Website

## What This Is

A professional website for SJ Electrical Contractors Limited, a London-based NICEIC Approved Contractor. Features a dark-first minimalist design (black/white/orange), session-based loading animation, complete business information, and an enhanced quote form with WhatsApp handoff, voice recording, and service-specific diagnostic questions.

## Core Value

Potential customers can quickly understand what services are offered, trust the business (NICEIC certification), and easily get in touch for a quote.

## Requirements

### Validated

- ✓ Basic site structure with multiple pages — existing
- ✓ Quote request form — existing
- ✓ Dark/light mode toggle — existing
- ✓ Responsive design — existing
- ✓ Black background as default color scheme — v1.0
- ✓ White text for primary content — v1.0
- ✓ Orange accent color for highlights/CTAs — v1.0
- ✓ Modern geometric sans-serif typography (Outfit) — v1.0
- ✓ Minimalist layout with ample whitespace — v1.0
- ✓ Light mode works with design system — v1.0
- ✓ Business name "SJ Electrical Contractors Limited" — v1.0
- ✓ Contact details (address, email, phone) — v1.0
- ✓ Service area "London and surrounding areas" — v1.0
- ✓ NICEIC Approved Contractor certification displayed — v1.0
- ✓ Complete services list — v1.0
- ✓ Placeholder testimonials structure — v1.0
- ✓ Placeholder social media links — v1.0
- ✓ Spark cursor effect removed — v1.0
- ✓ Session-based loading animation (first visit only) — v1.0
- ✓ Skip animation on internal navigation — v1.0
- ✓ Form inputs use dark background with light text — v1.1
- ✓ Footer uses subtle dark background (#111) with light text — v1.1
- ✓ Buttons on orange backgrounds use dark fill with white text — v1.1
- ✓ Quote form sends email via webhook to info@sjec.uk — v1.1
- ✓ WhatsApp handoff button with pre-filled message — v1.2
- ✓ Voice message recording (60s max, cross-browser) — v1.2
- ✓ Electrical symptom checker (Fault Finding, Rewiring, Consumer Unit) — v1.2
- ✓ Contact preferences fix (checkboxes reaching n8n) — v1.2
- ✓ Cross-browser voice recording (Safari audio/mp4 format detection) — v1.2
- ✓ Dark/light mode styling for new components — v1.2
- ✓ 44px WCAG touch targets for mobile accessibility — v1.2
- ✓ Progressive enhancement (voice section hidden if unsupported) — v1.2

### Active

<!-- v1.3: Branding & Polish -->

- [ ] Logo/branding audit — header and footer consistency across all pages
- [ ] NICEIC badge on index page hero section
- [ ] NICEIC badge rectangular display in footer (not circular)
- [ ] NICEIC badge fixes on about page
- [ ] Contact form working with n8n webhook

<!-- v1.4+: Future enhancements (content from client) -->

- [ ] Real customer testimonials replace placeholders
- [ ] Real social media links replace placeholders
- [ ] Project gallery with completed work photos

### Out of Scope

- Social media integration — no accounts yet, use placeholders
- Online booking system — simple contact form is sufficient for now
- Blog/news section — not needed for v1
- Customer portal/login — overkill for this business
- Mobile app — PWA approach works well
- Offline mode — real-time not a core requirement

## Context

**Shipped v1.2** with 4,733 LOC (HTML/CSS/JS static site).

**Tech stack:** Static HTML/CSS/JS, Outfit font, CSS custom properties for theming, n8n webhook for form submission, MediaRecorder API for voice recording, WhatsApp Web API for message handoff.

**Current state:**
- Dark-first design (#0a0a0a background, #FF8C00 orange accent)
- Session-based loader with cross-tab sync
- FOLT prevention via blocking script
- Enhanced quote form with WhatsApp handoff and voice recording
- Service-specific symptom checker (Fault Finding, Rewiring, Consumer Unit)
- Cross-browser compatible (Safari audio/mp4, Chrome/Firefox audio/webm)
- Mobile-accessible 44px touch targets
- Placeholder testimonials and social links ready for real content

**Business details:**
- Business name: SJ Electrical Contractors Limited
- Address: 157 Waltham Way, Chingford, London, E4 8AG
- Email: info@sjec.uk
- Phone: 07875 210 678
- Service area: London and surrounding areas
- Certification: NICEIC Approved Contractor

**Services offered:**
- Rewiring
- Fuse box / consumer unit upgrades
- Lighting installation
- Socket and switch installation
- Electrical inspections / testing (EICR)
- Fault finding
- Emergency callouts
- Domestic electrical work
- Commercial electrical work

## Constraints

- **Tech stack**: Static HTML/CSS/JS (no framework changes)
- **Hosting**: Must remain static-site compatible
- **Browser support**: Modern browsers, mobile-first responsive

## Future Considerations

- **Photo upload limit**: Currently 5 photos max in quote form. May increase in future if needed (update MAX_FILES in js/quote-form.js)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Black as default, keep toggle | User wants dark aesthetic but flexibility for light mode | ✓ Good |
| Orange (#FF8C00) accent color | Matches inspiration image, works with electrical theme | ✓ Good |
| Remove spark cursor | Too playful for professional look | ✓ Good |
| Session-based loading animation | Good first impression but annoying on repeat | ✓ Good |
| Outfit font | Modern geometric sans-serif matches brand aesthetic | ✓ Good |
| Blocking theme script | Prevents flash of light theme on page load | ✓ Good |
| 64px section padding | Creates minimalist whitespace feel | ✓ Good |
| data-placeholder attribute | Easy identification of content needing future updates | ✓ Good |
| BroadcastChannel + storage fallback | Cross-tab sync works in all browsers including Safari private | ✓ Good |
| Explicit #111111 for footer | Legacy --dark token maps to white text (confusing naming) | ✓ Good |
| n8n webhook instead of Formspree | More control over form processing and notifications | ✓ Good |
| Accessible error display (showError) | ARIA attributes provide screen reader feedback | ✓ Good |
| Orange focus ring | Matches site brand colors and design system | ✓ Good |
| MediaRecorder API for voice recording | Browser-native, no external libraries needed | ✓ Good |
| 60-second recording limit | Prevents oversized uploads, encourages concise descriptions | ✓ Good |
| WhatsApp Web API (wa.me) | Pre-filled message handoff, works on all devices | ✓ Good |
| Service-specific diagnostic questions | Fault Finding, Rewiring, Consumer Unit only | ✓ Good |
| Format detection (webm > mp4) | Safari compatibility via isTypeSupported check | ✓ Good |
| Progressive enhancement for voice | Hide section if MediaRecorder unavailable | ✓ Good |
| 44px minimum touch targets | WCAG 2.5.8 compliance for mobile accessibility | ✓ Good |

## Current Milestone: v1.3 Branding & Polish

**Goal:** Audit and fix logo/branding changes, add NICEIC badge to key pages, and fix the contact form.

**Target features:**
- Logo consistency audit (header/footer across all 5 pages)
- NICEIC badge visible on index and about pages
- Contact form functional with n8n backend

---
*Last updated: 2026-02-02 after v1.3 milestone started*
