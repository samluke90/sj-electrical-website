# Phase 2: Design System - Research

**Researched:** 2026-01-20
**Domain:** CSS Design System, Typography, Dark Mode First Design
**Confidence:** HIGH

## Summary

This phase transforms the current blue/yellow color scheme to a minimalist black/white/orange aesthetic with modern geometric typography. The existing codebase already has a solid CSS variable system and functioning dark/light mode toggle, making this primarily a design token and typography update rather than a structural rewrite.

Key findings:
- The current CSS uses CSS variables extensively (`:root` and `[data-theme="dark"]`), making color updates straightforward
- The light switch toggle mechanism is already implemented and stores preference in localStorage
- Current fonts (Montserrat + Open Sans) should be replaced with a more geometric alternative like **Outfit** or **Space Grotesk** for the Glancyr-inspired look
- Orange accent colors require careful selection for WCAG compliance - black text on orange is more accessible than white text on orange

**Primary recommendation:** Implement dark-mode-first by making the current "dark" theme the default (no data-theme attribute = dark), and create a new light theme. Use Outfit font for both headings and body text. Use `#FF8C00` as the primary orange accent with adjustments for accessibility.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| CSS Custom Properties | Native | Design tokens, theming | Browser-native, no build step, existing in codebase |
| Google Fonts | CDN | Typography delivery | Fast, reliable, free, already used |
| prefers-color-scheme | Native | System theme detection | Progressive enhancement |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| CSS color-mix() | Native | Color variations | Deriving hover states from base colors |
| localStorage | Native | Theme persistence | Already implemented in codebase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Google Fonts | Self-hosted fonts | Better privacy but more setup, unnecessary for this project |
| CSS variables | Tailwind CSS | Would require rewrite of entire CSS structure |
| Manual dark mode | light-dark() CSS function | Newer function has limited browser support |

**Installation:**
```html
<!-- Replace current Google Fonts link in HTML head -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

## Architecture Patterns

### Recommended CSS Variable Structure
```css
/* Dark mode as default (no attribute) */
:root {
    /* Core colors */
    --color-bg-primary: #0a0a0a;
    --color-bg-secondary: #141414;
    --color-bg-tertiary: #1a1a1a;

    /* Text colors */
    --color-text-primary: #ffffff;
    --color-text-secondary: rgba(255, 255, 255, 0.7);
    --color-text-muted: rgba(255, 255, 255, 0.5);

    /* Accent */
    --color-accent: #FF8C00;
    --color-accent-hover: #FFa333;
    --color-accent-text: #0a0a0a; /* Black text on orange for accessibility */

    /* Semantic */
    --color-success: #00C853;
    --color-error: #FF5252;

    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;
    --space-3xl: 64px;

    /* Typography */
    --font-family: 'Outfit', sans-serif;
    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;

    /* Transitions */
    --transition-fast: 150ms ease;
    --transition-base: 300ms ease;
}

/* Light mode (toggled) */
[data-theme="light"] {
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f5f5f5;
    --color-bg-tertiary: #eeeeee;

    --color-text-primary: #0a0a0a;
    --color-text-secondary: rgba(0, 0, 0, 0.7);
    --color-text-muted: rgba(0, 0, 0, 0.5);

    /* Orange stays the same but may need adjustment for light backgrounds */
    --color-accent: #E67E00; /* Slightly darker for light mode contrast */
    --color-accent-hover: #CC7000;
}
```

### Pattern 1: Dark Mode First Toggle Logic
**What:** Invert the current toggle logic so absence of data-theme attribute means dark
**When to use:** When dark mode should be the default experience
**Example:**
```javascript
// Updated toggle logic in effects.js
function initLightSwitch() {
    const lightSwitch = document.createElement('div');
    // ... existing HTML creation ...

    const switchToggle = lightSwitch.querySelector('.switch-toggle');

    // Check for saved theme preference - light mode is now the "opt-in"
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        switchToggle.classList.remove('off'); // Toggle is "on" for light
    } else {
        // Dark mode is default - switch is "off" (down position)
        switchToggle.classList.add('off');
    }

    lightSwitch.addEventListener('click', function() {
        const isLightMode = document.documentElement.getAttribute('data-theme') === 'light';

        if (isLightMode) {
            // Switch to dark (default)
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
            switchToggle.classList.add('off');
        } else {
            // Switch to light
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            switchToggle.classList.remove('off');
        }

        // ... existing flicker effect code ...
    });
}
```

### Pattern 2: Typography Scale
**What:** Consistent type scale with geometric proportions
**When to use:** All text elements
**Example:**
```css
/* Typography scale using Outfit */
h1 {
    font-family: var(--font-family);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.02em;
}

h2 {
    font-family: var(--font-family);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    line-height: 1.15;
    letter-spacing: -0.01em;
}

h3 {
    font-family: var(--font-family);
    font-size: clamp(1.5rem, 3vw, 2rem);
    font-weight: 600;
    line-height: 1.2;
}

body {
    font-family: var(--font-family);
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.6;
    color: var(--color-text-primary);
    background: var(--color-bg-primary);
}
```

### Pattern 3: Button Styling with Orange Accent
**What:** CTA buttons using orange with accessible text
**When to use:** Primary call-to-action buttons
**Example:**
```css
.btn-primary {
    background: var(--color-accent);
    color: var(--color-accent-text); /* Black text for AA compliance */
    border: none;
    padding: var(--space-md) var(--space-xl);
    font-family: var(--font-family);
    font-weight: 600;
    border-radius: 8px;
    transition: var(--transition-fast);
}

.btn-primary:hover {
    background: var(--color-accent-hover);
    transform: translateY(-2px);
}
```

### Anti-Patterns to Avoid
- **Pure black (#000000) backgrounds:** Too harsh. Use near-black like #0a0a0a for softer appearance
- **Pure white (#ffffff) text on dark:** Can cause eye strain. Use #f0f0f0 or slightly off-white
- **White text on orange buttons:** Fails WCAG AA (3.1:1 ratio). Use black text on orange (6.55:1 ratio)
- **Overusing orange:** Should be accent only. Reserve for CTAs and key highlights
- **Forgetting transition states:** All theme-aware colors need smooth transitions

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Color contrast checking | Manual ratio calculations | WebAIM Contrast Checker | Accurate WCAG compliance verification |
| Font loading optimization | Custom preload logic | Google Fonts display=swap | Handles FOIT/FOUT automatically |
| Theme persistence | Custom cookie system | localStorage (already used) | Simple, works, already in codebase |
| Responsive typography | Multiple breakpoint rules | CSS clamp() | Single rule, fluid scaling |
| Color variations | Hardcoded hex values | CSS color-mix() | Dynamic, maintainable |

**Key insight:** The existing codebase already has most infrastructure in place. This phase is primarily a design token update, not a system rewrite.

## Common Pitfalls

### Pitfall 1: Flash of Light Theme (FOLT)
**What goes wrong:** Page briefly shows light theme before JavaScript applies saved dark preference
**Why it happens:** CSS loads before JS runs, default light styles show first
**How to avoid:**
1. Make dark mode the CSS default (no attribute required)
2. Add blocking script in `<head>` to apply saved theme before render:
```html
<script>
    if (localStorage.getItem('theme') === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    }
</script>
```
**Warning signs:** White flash on page load for users with dark mode saved

### Pitfall 2: Orange Accessibility Failure
**What goes wrong:** White text on orange buttons fails WCAG AA
**Why it happens:** Orange is a mid-range color; white only achieves 3.1:1 contrast
**How to avoid:** Use black (#0a0a0a) text on orange backgrounds (achieves 6.55:1)
**Warning signs:** Failing automated accessibility tests

### Pitfall 3: Forgetting Secondary UI States
**What goes wrong:** Hover, focus, disabled states not updated for new color scheme
**Why it happens:** Focus on primary colors, secondary states overlooked
**How to avoid:** Create comprehensive state variables:
```css
--color-accent-hover: #FFa333;
--color-accent-active: #E67E00;
--color-accent-disabled: rgba(255, 140, 0, 0.4);
```
**Warning signs:** Inconsistent hover colors, missing focus indicators

### Pitfall 4: Breaking the Existing Light Switch
**What goes wrong:** Toggle no longer functions after reversing theme logic
**Why it happens:** State management and CSS selectors get inverted inconsistently
**How to avoid:**
1. Update CSS selectors: default = dark, `[data-theme="light"]` = light
2. Update JS: remove attribute for dark, add for light
3. Update toggle visual state to match (off = dark, on = light)
**Warning signs:** Clicking toggle has no effect or wrong effect

### Pitfall 5: Font Weight Rendering Differences
**What goes wrong:** Fonts appear thinner on dark backgrounds
**Why it happens:** Anti-aliasing renders differently on light vs dark
**How to avoid:** Test on both themes, potentially use slightly heavier weights for dark mode:
```css
body {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}
```
**Warning signs:** Text feels "lighter" or harder to read in dark mode

## Code Examples

Verified patterns from official sources:

### Complete Color Variable Migration
```css
/* OLD (current) variables */
:root {
    --primary: #0066CC;        /* Blue - REMOVE */
    --secondary: #FFD700;      /* Yellow - REMOVE */
    --dark: #2D2D2D;          /* Dark gray */
    --light: #F8F9FA;         /* Light gray */
    --white: #FFFFFF;         /* White */
}

/* NEW dark-first variables */
:root {
    /* Backgrounds */
    --color-bg-primary: #0a0a0a;
    --color-bg-secondary: #141414;
    --color-bg-elevated: #1f1f1f;

    /* Text */
    --color-text-primary: #ffffff;
    --color-text-secondary: rgba(255, 255, 255, 0.7);
    --color-text-muted: rgba(255, 255, 255, 0.5);

    /* Accent (Orange) */
    --color-accent: #FF8C00;
    --color-accent-hover: #FFa333;
    --color-accent-text: #0a0a0a;

    /* Borders & Dividers */
    --color-border: rgba(255, 255, 255, 0.1);
    --color-border-hover: rgba(255, 255, 255, 0.2);

    /* Shadows (for dark mode, use glows instead) */
    --shadow-sm: 0 0 10px rgba(255, 140, 0, 0.1);
    --shadow-md: 0 4px 20px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 40px rgba(0, 0, 0, 0.6);
}

[data-theme="light"] {
    --color-bg-primary: #ffffff;
    --color-bg-secondary: #f8f8f8;
    --color-bg-elevated: #ffffff;

    --color-text-primary: #0a0a0a;
    --color-text-secondary: rgba(0, 0, 0, 0.7);
    --color-text-muted: rgba(0, 0, 0, 0.5);

    --color-accent: #E67E00;
    --color-accent-hover: #CC7000;

    --color-border: rgba(0, 0, 0, 0.1);
    --color-border-hover: rgba(0, 0, 0, 0.2);

    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 30px rgba(0, 0, 0, 0.15);
}
```

### Google Fonts Link Update
```html
<!-- OLD -->
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500;600&display=swap" rel="stylesheet">

<!-- NEW -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Updated Typography Rules
```css
body {
    font-family: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-text-primary);
    background-color: var(--color-bg-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4, h5, h6 {
    font-family: 'Outfit', sans-serif;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1rem;
    color: var(--color-text-primary);
}
```

### Whitespace / Minimalist Spacing
```css
/* Increase section padding for breathing room */
.services,
.why-us,
.testimonials,
.about-intro,
.contact-section {
    padding: var(--space-3xl) 0; /* 64px */
}

/* Generous margins between content blocks */
.section-header {
    margin-bottom: var(--space-2xl); /* 48px */
}

/* Card spacing */
.service-card,
.testimonial-card {
    padding: var(--space-xl); /* 32px */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Light mode default | Dark mode default | 2024-2025 | 82% of mobile users prefer dark mode |
| prefers-color-scheme only | Manual toggle + system pref | 2023 | Users want control over their preference |
| Fixed font sizes | clamp() fluid typography | 2022 | Eliminates need for many breakpoints |
| hex color codes | CSS Custom Properties | 2020 | Easy theming, maintenance |
| Montserrat + Open Sans | Single geometric family | 2024 | Cleaner, more consistent aesthetic |

**Deprecated/outdated:**
- Using `[data-theme="dark"]` for dark mode in a dark-first design: Should use light as the toggled state
- Separate heading and body fonts when a single family suffices: Outfit handles both well

## Open Questions

Things that couldn't be fully resolved:

1. **Exact orange shade for optimal brand feel**
   - What we know: #FF8C00 (dark orange) is accessible and electrical-themed
   - What's unclear: Whether slightly warmer (#FF9500) or cooler (#FF7B00) better matches Glancyr inspiration
   - Recommendation: Start with #FF8C00, allow for adjustment during implementation

2. **Loading animation color update**
   - What we know: Current lightbulb animation uses `--secondary` (#FFD700 yellow)
   - What's unclear: Whether to change to orange or keep yellow for the "warm light" effect
   - Recommendation: Keep yellow (#FFD700) for the bulb glow as it's thematically appropriate for light

3. **Voltage meter gradient colors**
   - What we know: Current gradient goes from red to green
   - What's unclear: Whether to adjust to match new color scheme
   - Recommendation: Keep functional colors (red = low, green = full) as they're intuitive

## Sources

### Primary (HIGH confidence)
- [Google Fonts - Outfit specimen](https://fonts.google.com/specimen/Outfit) - Font characteristics, weights
- [Google Fonts - Geometric glossary](https://fonts.google.com/knowledge/glossary/geometric) - Geometric font definition
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - WCAG contrast verification
- [Material Design Dark Theme](https://blog.prototypr.io/how-to-design-a-dark-theme-for-your-android-app-3daeb264637) - Dark mode best practices

### Secondary (MEDIUM confidence)
- [Dark Mode Best Practices 2025](https://medium.com/@jackbrownkarmaa/dark-mode-in-web-design-best-practices-in-2025-445d8d6463a3) - Industry patterns
- [Orange Accessibility Case Study](https://www.bounteous.com/insights/2019/03/22/orange-you-accessible-mini-case-study-color-ratio/) - Orange contrast findings
- [Figma Dark Orange Color Guide](https://www.figma.com/colors/dark-orange/) - Orange hex values

### Tertiary (LOW confidence)
- Various design blogs - General trends (validated against official sources)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Native CSS, no dependencies
- Architecture: HIGH - Building on existing codebase patterns
- Typography: HIGH - Verified Google Fonts specifications
- Color accessibility: HIGH - WCAG standards well-documented
- Pitfalls: MEDIUM - Based on common patterns, some edge cases possible

**Research date:** 2026-01-20
**Valid until:** 2026-03-20 (60 days - CSS/design standards stable)
