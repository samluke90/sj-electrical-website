# Phase 4: Styling Fixes - Research

**Researched:** 2026-01-21
**Domain:** CSS styling and contrast fixes for dark mode theming
**Confidence:** HIGH

## Summary

This research investigates the current CSS architecture and identifies the specific selectors and patterns needed to fix styling issues in dark mode. The site uses CSS custom properties for theming with dark mode as the default (`#0a0a0a` background, `#FF8C00` orange accent). A `[data-theme="light"]` attribute on `<html>` toggles light mode.

The codebase is well-structured with a single CSS file (`css/styles.css`) containing all styles. The existing CSS custom property system provides a solid foundation for the fixes. The main issues are:
1. Form inputs lack explicit dark background/light text styling for dark mode
2. Footer uses `var(--dark)` which maps incorrectly in dark mode
3. Buttons on orange backgrounds (`.photo-quote-cta`) need contrast fixes

**Primary recommendation:** Use targeted CSS rules leveraging existing custom properties to fix contrast issues without restructuring the theme system.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Theming variables | Already in use, browser-native |
| CSS Selectors | Native | Targeting elements | Direct, no dependencies |

### Existing Design Tokens

| Token | Dark Mode Value | Light Mode Value | Usage |
|-------|----------------|------------------|-------|
| `--color-bg-primary` | `#0a0a0a` | `#ffffff` | Main background |
| `--color-bg-secondary` | `#141414` | `#f8f8f8` | Section backgrounds |
| `--color-bg-elevated` | `#1f1f1f` | `#ffffff` | Cards, inputs |
| `--color-text-primary` | `#ffffff` | `#0a0a0a` | Primary text |
| `--color-text-secondary` | `rgba(255,255,255,0.7)` | `rgba(0,0,0,0.7)` | Secondary text |
| `--color-accent` | `#FF8C00` | `#E67E00` | Orange accent |
| `--color-accent-text` | `#0a0a0a` | `#0a0a0a` | Text on orange |

### Legacy Mappings (Potential Issue Source)
| Token | Maps To | Notes |
|-------|---------|-------|
| `--dark` | `var(--color-text-primary)` | Confusing name - is WHITE in dark mode |
| `--white` | `var(--color-bg-primary)` | Confusing name - is BLACK in dark mode |
| `--light` | `var(--color-bg-secondary)` | Used for backgrounds |

## Architecture Patterns

### Current Theme Toggle Implementation

```javascript
// In HTML <head> (blocking script)
if (localStorage.getItem('theme') === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
}

// Dark mode is DEFAULT (no attribute needed)
// Light mode: data-theme="light" on <html>
```

### CSS Override Pattern for Theme Fixes

```css
/* Pattern for dark mode specific fixes (default state) */
.selector {
    /* dark mode styles */
}

/* Pattern for light mode overrides */
[data-theme="light"] .selector {
    /* light mode styles */
}
```

### Recommended Project Structure for Fixes

All fixes should go in `css/styles.css` in the appropriate sections:
```
css/styles.css
├── CSS Variables (lines 6-68)
├── Form Controls (lines 1099-1127)
├── Footer (lines 812-934)
├── Photo Quote CTA (lines 643-743)
└── Light Mode Overrides (lines 1697-1772)
```

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dark/light theming | Custom toggle logic | Existing `[data-theme]` pattern | Already works, maintains consistency |
| Color values | Hardcoded hex values | CSS custom properties | Single source of truth, already defined |
| Form input styling | Individual input rules | `.form-control` class | All inputs use this class |

**Key insight:** The existing CSS custom property system is comprehensive. Fixes should extend it, not work around it.

## Common Pitfalls

### Pitfall 1: Forgetting Light Mode Overrides
**What goes wrong:** Fix works in dark mode but breaks light mode
**Why it happens:** Only adding dark mode styles without corresponding light mode rules
**How to avoid:** Always add `[data-theme="light"]` override when modifying default styles
**Warning signs:** Test BOTH modes after every change

### Pitfall 2: Using Legacy Token Names
**What goes wrong:** `--dark` and `--white` have inverted meanings in dark mode
**Why it happens:** Legacy naming convention where `--dark` = dark text color (white in dark mode)
**How to avoid:** Use new semantic tokens: `--color-text-primary`, `--color-bg-primary`
**Warning signs:** Footer uses `--dark` for background - this is why it appears white in dark mode

### Pitfall 3: Specificity Conflicts
**What goes wrong:** New rules don't apply because existing rules have higher specificity
**Why it happens:** Inline styles or more specific selectors already exist
**How to avoid:** Match or exceed existing specificity; check for inline styles in HTML
**Warning signs:** Changes don't appear in browser despite correct CSS

### Pitfall 4: Missing Select/Option Styling
**What goes wrong:** Form inputs look correct but dropdowns have wrong colors
**Why it happens:** `<select>` and `<option>` elements need explicit styling on some browsers
**How to avoid:** Include `select.form-control` and `option` in form styling rules
**Warning signs:** Dropdown menus appear with browser default colors

## Code Examples

### STYLE-01: Form Input Dark Mode Fix

**Current code (lines 1099-1118):**
```css
.form-control {
    width: 100%;
    padding: 14px 16px;
    font-size: 1rem;
    font-family: inherit;
    border: 2px solid var(--light);  /* --light = #141414 in dark mode */
    border-radius: var(--radius);
    transition: var(--transition);
    background: var(--white);        /* --white = #0a0a0a in dark mode */
}
```

**Issue:** `--white` and `--light` have inverted meanings. In dark mode:
- `--white` = `#0a0a0a` (black background) - CORRECT but confusing
- Border uses `--light` = `#141414` - needs visibility improvement
- Text color NOT set - inherits page text (white) - CORRECT

**Fix pattern:**
```css
/* Form inputs - dark mode explicit styling */
.form-control {
    background: var(--color-bg-elevated);  /* #1f1f1f - slightly lighter */
    border-color: var(--color-border);     /* rgba(255,255,255,0.1) */
    color: var(--color-text-primary);      /* explicit white text */
}

.form-control:focus {
    border-color: var(--color-accent);
    box-shadow: 0 0 0 3px rgba(255, 140, 0, 0.2);
}
```

### STYLE-02: Footer Dark Background Fix

**Current code (lines 812-816):**
```css
.footer {
    background: var(--dark);  /* In dark mode, --dark = white text color! */
    color: var(--white);      /* In dark mode, --white = black background! */
    padding: 60px 0 20px;
}
```

**Issue:** Legacy tokens `--dark` and `--white` have inverted semantics. Footer appears light in dark mode.

**Fix pattern:**
```css
.footer {
    background: #111111;  /* Explicit dark background per requirement */
    color: var(--color-text-primary);
    padding: 60px 0 20px;
}
```

### STYLE-03: Buttons on Orange Backgrounds

**Current code - Photo Quote CTA section uses `.photo-quote-cta` (line 643-663):**
```css
.photo-quote-cta {
    padding: var(--space-3xl) 0;
    background: var(--color-accent);  /* Orange background */
}
```

**Current button inside this section (line 320 in index.html):**
```html
<a href="quote.html" class="btn btn-primary btn-lg">Start Your Quote</a>
```

**Issue:** `.btn-primary` has orange background on orange section - poor contrast.

**Fix pattern:**
```css
/* Buttons on orange backgrounds need dark fill with white text */
.photo-quote-cta .btn-primary {
    background: var(--color-bg-primary);  /* Dark background */
    color: var(--color-text-primary);     /* White text */
}

.photo-quote-cta .btn-primary:hover {
    background: var(--color-bg-secondary);
}
```

### STYLE-04: Light Mode Override Pattern

**Existing pattern (lines 1751-1759):**
```css
[data-theme="light"] .form-control {
    background: #ffffff;
    border-color: rgba(0, 0, 0, 0.1);
    color: #0a0a0a;
}
```

This pattern already exists and should be extended for any new dark mode fixes.

## Current State Analysis

### Files Affected

| File | Elements | Lines | Issue |
|------|----------|-------|-------|
| `css/styles.css` | `.form-control` | 1099-1127 | Input styling |
| `css/styles.css` | `.footer` | 812-934 | Background color |
| `css/styles.css` | `.photo-quote-cta` | 643-743 | Button contrast |
| `css/styles.css` | `[data-theme="light"]` | 1697-1772 | Light mode overrides |

### Form Input Locations (HTML)

| Page | Form ID | Input Count |
|------|---------|-------------|
| `quote.html` | `#quoteForm` | 10 inputs (text, email, tel, select, textarea) |
| `contact.html` | `#contactForm` | 5 inputs (text, email, tel, select, textarea) |

### Elements on Orange Backgrounds

| Page | Section | Elements |
|------|---------|----------|
| `index.html` | `.photo-quote-cta` | 1 button (`.btn-primary`) |
| `contact.html` | `.photo-quote-cta` style section | 1 button (`.btn-secondary`) - already correct |

## WCAG Contrast Requirements

| Element | Foreground | Background | Required Ratio | Applies To |
|---------|-----------|------------|----------------|------------|
| Body text | White #fff | Black #0a0a0a | 4.5:1 (AA) | Dark mode |
| Form inputs | White #fff | Dark #1f1f1f | 4.5:1 (AA) | Input text |
| Footer text | White #fff | Dark #111 | 4.5:1 (AA) | Footer content |
| Button on orange | Dark #0a0a0a | Orange #FF8C00 | 4.5:1 (AA) | CTA buttons |

**Note:** All proposed color combinations exceed WCAG AA requirements (4.5:1 for normal text).

## Open Questions

Things that couldn't be fully resolved:

1. **Select dropdown background in mobile browsers**
   - What we know: Desktop browsers respect `background` on `<select>`
   - What's unclear: iOS Safari may override dropdown colors
   - Recommendation: Test on iOS after implementation; may need `-webkit-appearance: none` with custom dropdown arrow

## Sources

### Primary (HIGH confidence)
- `css/styles.css` - Direct code inspection
- `quote.html`, `contact.html`, `index.html` - HTML structure verification
- `js/effects.js` - Theme toggle implementation

### Secondary (MEDIUM confidence)
- WCAG 2.1 contrast requirements - Standard web accessibility guidelines

## Metadata

**Confidence breakdown:**
- Form input selectors: HIGH - Direct code inspection
- Footer selectors: HIGH - Direct code inspection
- Button on orange: HIGH - Direct code inspection
- Theme system: HIGH - Code and JS verified

**Research date:** 2026-01-21
**Valid until:** Indefinite (static codebase analysis)
