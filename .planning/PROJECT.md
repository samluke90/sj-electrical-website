# SJ Electrical Contractors Website

## What This Is

A professional website for SJ Electrical Contractors Limited, a London-based NICEIC Approved Contractor. Features a dark-first minimalist design (black/white/orange), session-based loading animation, and complete business information for domestic and commercial customers.

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

### Active

<!-- v1.2+: Future requirements go here -->

(None — next milestone not yet planned)

### Out of Scope

- Social media integration — no accounts yet, use placeholders
- Online booking system — simple contact form is sufficient for now
- Blog/news section — not needed for v1
- Customer portal/login — overkill for this business
- Mobile app — PWA approach works well
- Offline mode — real-time not a core requirement

## Context

**Shipped v1.1** with 5,152 LOC (HTML/CSS/JS static site).

**Tech stack:** Static HTML/CSS/JS, Outfit font, CSS custom properties for theming, n8n webhook for form submission.

**Current state:**
- Dark-first design (#0a0a0a background, #FF8C00 orange accent)
- Session-based loader with cross-tab sync
- FOLT prevention via blocking script
- Functional quote form with accessible error handling
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

---
*Last updated: 2026-01-22 after v1.1 milestone completion*
