# Directory Structure

**Analysis Date:** 2026-01-19

## Overview

```
Website/
├── index.html              # Homepage
├── services.html           # Services page
├── quote.html              # Quote request form
├── about.html              # About company page
├── contact.html            # Contact page
├── css/
│   └── styles.css          # All CSS styles (2246 lines)
├── js/
│   ├── main.js             # Core functionality (137 lines)
│   ├── quote-form.js       # Quote form logic (223 lines)
│   └── effects.js          # Visual effects (560 lines)
├── images/                 # Empty - no images yet
├── .planning/
│   └── codebase/           # Codebase documentation
└── .git/                   # Git repository
```

## Key Locations

**HTML Pages (Root):**
- `index.html` - Homepage with hero, services overview, testimonials, CTA
- `services.html` - Detailed service descriptions
- `quote.html` - Quote request form with photo upload
- `about.html` - Company info, certifications, service areas
- `contact.html` - Contact details, hours, contact form

**Styles:**
- `css/styles.css` - Single CSS file containing all styles

**JavaScript:**
- `js/main.js` - Mobile menu, smooth scroll, header effects, scroll animations
- `js/quote-form.js` - File upload, form validation, submission handling
- `js/effects.js` - Light switch toggle, spark cursor, page loader, voltage meter

**Assets:**
- `images/` - Empty directory (site uses inline SVGs)

## Naming Conventions

**Files:**
- HTML: lowercase, hyphenated (`quote.html`, `about.html`)
- CSS: lowercase (`styles.css`)
- JavaScript: lowercase, hyphenated (`main.js`, `quote-form.js`)

**Directories:**
- Lowercase, short names (`css/`, `js/`, `images/`)

**CSS Classes:**
- BEM-inspired, hyphenated (`.hero-content`, `.service-card`, `.form-group`)
- State classes: `.active`, `.show`, `.error`, `.loaded`
- Modifier classes: `.btn-primary`, `.btn-lg`, `.btn-outline`

**JavaScript Functions:**
- camelCase with descriptive prefixes
- `init*` for initialization: `initMobileMenu()`, `initSmoothScroll()`
- `create*` for DOM creation: `createSpark()`, `createPreview()`
- `handle*` for event handlers: `handleFiles()`

**HTML IDs:**
- camelCase: `quoteForm`, `uploadZone`, `photoUpload`

## File Responsibilities

**index.html (Homepage):**
- Hero section with CTA buttons
- Services overview grid
- Why choose us section
- Photo quote CTA
- Testimonials
- Credentials badge
- Footer

**services.html (Services):**
- Page hero
- Detailed service sections (Domestic, Commercial, Emergency, EV Charger)
- Service detail grids with icons

**quote.html (Quote Form):**
- Form with sections: Your Details, Job Details, Photo Upload, Contact Preferences
- Drag-and-drop photo upload zone
- Image preview gallery
- Form submission handling

**about.html (About):**
- Company introduction
- Statistics (jobs completed, satisfaction rate)
- Certifications section
- Service areas list

**contact.html (Contact):**
- Contact methods (phone, email, address)
- Opening hours
- Contact form
- Google Maps embed (placeholder)

**css/styles.css:**
1. CSS Variables (lines 1-30)
2. Reset & Base (lines 31-100)
3. Utility Classes (lines 101-200)
4. Header & Navigation (lines 201-400)
5. Hero Section (lines 401-550)
6. Services Section (lines 551-700)
7. Why Us Section (lines 701-800)
8. Testimonials (lines 801-900)
9. CTA Section (lines 901-1000)
10. Footer (lines 1001-1150)
11. Services Page (lines 1151-1300)
12. Quote Form Page (lines 1301-1500)
13. About Page (lines 1501-1580)
14. Contact Page (lines 1581-1700)
15. Responsive Design (lines 1701-1900)
16. Animations (lines 1901-1950)
17. Utility Classes (lines 1951-1980)
18. Dark Mode (lines 1981-2050)
19. Light Switch Toggle (lines 2051-2120)
20. Spark Cursor Effect (lines 2121-2180)
21. Lightbulb Loading (lines 2181-2320)
22. Voltage Meter (lines 2321-2446)

**js/main.js:**
- `initMobileMenu()` - Hamburger menu toggle
- `initSmoothScroll()` - Anchor link smooth scrolling
- `initHeaderScroll()` - Header shadow on scroll
- `initScrollAnimations()` - Intersection Observer animations
- `formatPhoneForTel()` - Phone number utility
- Active nav link highlighting

**js/quote-form.js:**
- Drag-and-drop file upload zone
- File validation (type, size, count)
- Image preview creation/removal
- Form submission with fetch API
- Input validation with visual feedback

**js/effects.js:**
- `initPageLoader()` - Lightbulb loading animation
- `initLightSwitch()` - Dark mode toggle with sound
- `initSparkCursor()` - Electric spark mouse effects
- `initVoltageMeter()` - Form progress meter (quote page only)
- Sound effect functions (Web Audio API)

## Important Patterns

**Shared Header/Footer:**
Header and footer HTML is duplicated in every page file. Changes require updating all 5 HTML files.

**Script Loading Order:**
```html
<script src="js/main.js"></script>
<script src="js/quote-form.js"></script>  <!-- Only on quote.html -->
<script src="js/effects.js"></script>
```

**CSS Loading:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
```

---

*Structure analysis: 2026-01-19*
