# Phase 03: Content Update - Research

**Researched:** 2026-01-20
**Domain:** Static HTML content update, CSS card components
**Confidence:** HIGH

## Summary

This phase involves updating placeholder content across 5 HTML files with accurate SJ Electrical business information. The codebase is a static HTML/CSS website with well-established component patterns. No external libraries are needed -- all styling uses existing CSS classes.

Key findings:
- Business name appears in 6 locations per page (header logo, footer logo, copyright, meta tags)
- Contact details appear in 8-10 locations across all pages (footer, contact page, emergency CTAs)
- Service cards already have a well-defined pattern (`.service-card` class with icon, title, description structure)
- The site uses inline SVG icons throughout -- no icon library needed
- NICEIC badge already has CSS styling (`.niceic-badge` class) that can be reused

**Primary recommendation:** Use a systematic file-by-file approach, updating each content type (business name, contact info, services) across all files to ensure consistency.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| HTML5 | N/A | Page structure | Static HTML files |
| CSS3 | N/A | Styling | Single stylesheet `css/styles.css` |
| Inline SVG | N/A | Icons | Feather-style icons embedded in HTML |

### Supporting
| Technology | Purpose | When to Use |
|------------|---------|-------------|
| CSS Variables | Theming | Already defined in `:root` |
| Existing CSS Classes | Component styling | Reuse existing card/section patterns |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Inline SVG | Icon font (Font Awesome) | Would add dependency, inline SVGs are already working well |
| Manual editing | Template engine | Overkill for 5 pages, adds build complexity |

## Architecture Patterns

### Existing HTML Structure

```
Files to update:
- index.html (home page - main content hub)
- services.html (service details page)
- quote.html (quote request form)
- about.html (about us page)
- contact.html (contact details page)
```

### Content Locations by Type

**Business Name Locations (per page):**
1. Header logo text: `<span>SJ</span> Electrical`
2. Footer logo text: `<span>SJ</span> Electrical`
3. Copyright text: `SJ Electrical Contractors Limited`
4. Meta description
5. Page title
6. Various body text mentions

**Contact Details Locations:**
1. Footer phone link: `<a href="tel:02012345678">`
2. Footer email link: `<a href="mailto:info@sjelectrical.co.uk">`
3. Footer address text
4. Contact page phone, email, address cards
5. Emergency CTA buttons with phone numbers
6. Hero section call buttons
7. Services page emergency call buttons

**Service Area Locations:**
1. Hero section text: "East London"
2. About page "Areas We Serve" section
3. Footer description
4. Meta descriptions

### Pattern 1: Service Card Structure (Existing)
**What:** Card component for displaying individual services
**When to use:** Home page services grid, potential new services display
**Example:**
```html
<!-- Source: index.html lines 169-179 -->
<div class="service-card" data-animate>
    <div class="service-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <!-- SVG path here -->
        </svg>
    </div>
    <h3>Service Title</h3>
    <p>Service description text here.</p>
    <a href="services.html#anchor" class="btn btn-outline">Learn More</a>
</div>
```

### Pattern 2: Service Detail Card (New Pattern for Phase 3)
**What:** Static service card with icon, title, and bullet points
**When to use:** New services display per CONTEXT.md decision
**Example structure:**
```html
<div class="service-card" data-animate>
    <div class="service-icon">
        <svg><!-- icon --></svg>
    </div>
    <h3>Service Name</h3>
    <ul class="service-bullets">
        <li>What's included point 1</li>
        <li>What's included point 2</li>
        <li>What's included point 3</li>
    </ul>
</div>
```

### Pattern 3: NICEIC Badge (Existing)
**What:** Certification badge for trust signals
**When to use:** About page, index page credentials section
**Example:**
```html
<!-- Source: index.html lines 285-288, CSS lines 605-628 -->
<div class="niceic-badge">
    <span>NICEIC</span>
    <span>REGISTERED</span>
</div>
```

### Pattern 4: Testimonial Card (Existing - for placeholder structure)
**What:** Customer testimonial display
**When to use:** Structuring placeholder testimonials (CONT-06)
**Example:**
```html
<!-- Source: index.html lines 355-365 -->
<div class="testimonial-card" data-animate>
    <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p class="testimonial-text">"Testimonial text here..."</p>
    <div class="testimonial-author">
        <div class="author-avatar">JT</div>
        <div class="author-info">
            <h4>Name</h4>
            <p>Location</p>
        </div>
    </div>
</div>
```

### Anti-Patterns to Avoid
- **Inconsistent naming:** Ensure business name is exactly "SJ Electrical Contractors Limited" everywhere
- **Hardcoded E4 references:** Update to "London and surrounding areas" per CONT-03
- **Missing tel:/mailto: links:** Ensure all phone/email have proper link protocols

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Service card styling | New CSS classes | `.service-card`, `.service-icon` | Already styled, tested, responsive |
| Badge styling | Custom badge CSS | `.niceic-badge`, `.hero-badge` | Existing patterns match design system |
| List styling | Custom list styles | `.service-list li` | Already has check-mark icons, proper spacing |
| Button styling | Custom buttons | `.btn .btn-primary`, `.btn-outline` | Consistent with site design |
| Section spacing | Manual padding | `.services`, `.why-us` section classes | Uses `var(--space-3xl)` already |

**Key insight:** The existing CSS has comprehensive component classes. All content updates should use existing patterns rather than creating new styles.

## Common Pitfalls

### Pitfall 1: Inconsistent Contact Details
**What goes wrong:** Phone number/email differs between pages
**Why it happens:** Copy-paste errors, forgetting locations
**How to avoid:** Create checklist of all locations, search-and-replace carefully
**Warning signs:** `tel:020` or `info@sjelectrical.co.uk` found after update

### Pitfall 2: Breaking Responsive Design
**What goes wrong:** New content overflows on mobile
**Why it happens:** Adding more service cards without testing
**How to avoid:** Test on mobile breakpoints (991px, 767px)
**Warning signs:** Horizontal scrolling, overlapping elements

### Pitfall 3: Missing href Updates
**What goes wrong:** Links still point to old phone/email
**Why it happens:** Updating visible text but not href attributes
**How to avoid:** Search for both `href="tel:` and `href="mailto:`
**Warning signs:** Clicking phone links dials wrong number

### Pitfall 4: NICEIC vs "Approved Contractor"
**What goes wrong:** Using wrong certification terminology
**Why it happens:** NICEIC has different membership levels
**How to avoid:** Use "NICEIC Approved Contractor" per CONT-04
**Warning signs:** Generic "NICEIC Registered" text (current state)

### Pitfall 5: Orphaned Service Links
**What goes wrong:** Footer/nav links point to removed service anchors
**Why it happens:** Updating services but not navigation
**How to avoid:** Check all internal links after service updates
**Warning signs:** 404 or missing anchor targets

## Code Examples

Verified patterns from the existing codebase:

### Contact Detail Update Pattern
```html
<!-- Phone: Update both href and visible text -->
<a href="tel:07875210678">07875 210 678</a>

<!-- Email: Update both href and visible text -->
<a href="mailto:info@sjec.uk">info@sjec.uk</a>

<!-- Address: Plain text -->
157 Waltham Way, Chingford, London, E4 8AG
```

### Business Name Update Pattern
```html
<!-- Header/Footer logo (keep span for styling) -->
<span>SJ</span> Electrical

<!-- Full company name in text -->
SJ Electrical Contractors Limited

<!-- Copyright -->
&copy; 2025 SJ Electrical Contractors Limited. All rights reserved.
```

### Service Card with Bullets (New for CONT-05)
```html
<!-- Recommended structure for new service cards -->
<div class="service-card" data-animate>
    <div class="service-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
    </div>
    <h3>Rewiring</h3>
    <ul class="service-list" style="text-align: left;">
        <li>Full house rewiring</li>
        <li>Partial rewiring</li>
        <li>Landlord compliance</li>
    </ul>
</div>
```

### NICEIC Approved Contractor Badge Update
```html
<!-- Update existing badge text -->
<div class="niceic-badge">
    <span>NICEIC</span>
    <span>APPROVED</span>
</div>
<!-- Or consider "APPROVED CONTRACTOR" if space permits -->
```

### Placeholder Testimonial Structure (CONT-06)
```html
<!-- Mark as placeholder with data attribute or comment -->
<div class="testimonial-card" data-animate data-placeholder="true">
    <div class="testimonial-stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
    <p class="testimonial-text">"[Customer testimonial coming soon]"</p>
    <div class="testimonial-author">
        <div class="author-avatar">??</div>
        <div class="author-info">
            <h4>Customer Name</h4>
            <p>Location</p>
        </div>
    </div>
</div>
```

### Social Media Placeholder (CONT-07)
```html
<!-- Add to footer, styled but with # hrefs -->
<div class="footer-social">
    <h4>Follow Us</h4>
    <div class="social-links">
        <a href="#" aria-label="Facebook" class="social-link" data-placeholder="true">
            <svg><!-- Facebook icon --></svg>
        </a>
        <a href="#" aria-label="Instagram" class="social-link" data-placeholder="true">
            <svg><!-- Instagram icon --></svg>
        </a>
    </div>
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| NICEIC Registered | NICEIC Approved Contractor | CONT-04 requirement | More specific, accurate certification |
| East London focus | London and surrounding areas | CONT-03 requirement | Broader service area messaging |
| Placeholder phone (020 1234 5678) | Real phone (07875 210 678) | CONT-02 requirement | Actually callable |

**Deprecated/outdated:**
- Old email: `info@sjelectrical.co.uk` -> Now: `info@sjec.uk`
- Old phone: `020 1234 5678` -> Now: `07875 210 678`
- Service area: "E4 and surrounding areas" -> Now: "London and surrounding areas"

## Content Inventory

### Files and Content Locations

| File | Business Name | Phone | Email | Address | Service Area | Services |
|------|---------------|-------|-------|---------|--------------|----------|
| index.html | 3 | 3 | 1 | 1 | 2 | 4 cards |
| services.html | 2 | 2 | 1 | 1 | 1 | 4 sections |
| quote.html | 2 | 1 | 1 | 1 | 0 | dropdown |
| about.html | 3 | 1 | 1 | 1 | 2 | 0 |
| contact.html | 3 | 4 | 2 | 2 | 0 | 0 |

### Services List (CONT-05)
Required services to display:
1. Rewiring
2. Consumer Units (fuse box upgrades)
3. Lighting
4. Sockets/Switches
5. EICR (Electrical Installation Condition Report)
6. Fault Finding
7. Emergency Callouts
8. Domestic work
9. Commercial work

### Icon Suggestions for Services
Based on existing SVG patterns in the codebase:

| Service | Icon Suggestion | Source SVG |
|---------|-----------------|------------|
| Rewiring | Home icon | index.html line 172 (house path) |
| Consumer Units | Shield/lock icon | index.html line 116 (padlock) |
| Lighting | Lightbulb/sun | Could adapt existing |
| Sockets/Switches | Power/plug | index.html line 207 (battery) |
| EICR | Clipboard/document | about.html line 155 (file) |
| Fault Finding | Search/magnifying glass | New SVG needed |
| Emergency | Lightning bolt | index.html line 196 (bolt) |
| Domestic | Home icon | index.html line 172 |
| Commercial | Building icon | index.html line 183 (briefcase) |

## Open Questions

Things that couldn't be fully resolved:

1. **Service Grouping Strategy**
   - What we know: 9 services to display, user decided on card-based layout
   - What's unclear: Whether to group as Domestic/Commercial/Safety or display flat
   - Recommendation: Group into 3 categories for better organization (Claude's discretion per CONTEXT.md)

2. **Testimonial Placeholder Content**
   - What we know: Need placeholder structure (CONT-06)
   - What's unclear: Should placeholders have fake text or "[Coming soon]" message
   - Recommendation: Use realistic-looking placeholders that are obviously marked for replacement

3. **Social Media Icons**
   - What we know: Need placeholder links (CONT-07)
   - What's unclear: Which platforms to include
   - Recommendation: Facebook and Instagram (common for local trade businesses)

## Sources

### Primary (HIGH confidence)
- Direct codebase analysis of all 5 HTML files
- CSS stylesheet analysis (`css/styles.css`)
- Requirements document (`.planning/REQUIREMENTS.md`)
- Context document (`.planning/phases/03-content-update/03-CONTEXT.md`)

### Secondary (MEDIUM confidence)
- NICEIC certification terminology - industry standard

### Tertiary (LOW confidence)
- None - all findings verified against codebase

## Metadata

**Confidence breakdown:**
- Content locations: HIGH - Direct file inspection
- CSS patterns: HIGH - Verified in stylesheet
- Icon system: HIGH - Verified in HTML files
- Service grouping: MEDIUM - Claude's discretion area

**Research date:** 2026-01-20
**Valid until:** Indefinite (static content update)
