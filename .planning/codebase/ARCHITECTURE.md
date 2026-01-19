# Architecture Overview

**Analysis Date:** 2026-01-19

## Pattern

**Type:** Static Multi-Page Website (MPA)

**Description:**
Traditional static HTML website with separate HTML pages for each route. No client-side routing, no server-side rendering, no build process. Each page is a complete HTML document with shared header/footer markup duplicated.

## Layers

**Presentation Layer:**
- HTML5 pages (`index.html`, `services.html`, `quote.html`, `about.html`, `contact.html`)
- CSS styling (`css/styles.css`)
- Client-side JavaScript for interactivity

**No Data Layer:**
- Static content only
- Form submissions sent to external service (Web3Forms)
- Theme preference stored in localStorage

**External Services:**
- Web3Forms API for form submissions
- Google Fonts CDN for typography

## Data Flow

```
User Interaction
       │
       ▼
┌──────────────────┐
│   HTML Pages     │ ◄─── Static content
│   (Presentation) │
└───────┬──────────┘
        │
        ▼
┌──────────────────┐
│   JavaScript     │ ◄─── Event handlers, DOM manipulation
│   (main.js,      │
│   effects.js,    │
│   quote-form.js) │
└───────┬──────────┘
        │
        ▼
┌──────────────────┐
│   CSS Styling    │ ◄─── Visual presentation, animations
│   (styles.css)   │
└───────┬──────────┘
        │
        ▼ (Forms only)
┌──────────────────┐
│   Web3Forms API  │ ◄─── External form submission handler
│   (External)     │
└──────────────────┘
```

## Key Abstractions

**Page Template Pattern:**
Each HTML page follows a consistent structure:
1. `<head>` - Meta tags, fonts, CSS
2. `<header>` - Navigation (duplicated across pages)
3. `<section>` - Page-specific content sections
4. `<footer>` - Footer content (duplicated across pages)
5. `<script>` - JavaScript includes at end of body

**CSS Architecture:**
- CSS Custom Properties (`:root` variables) for theming
- Section-based organization with comment headers
- Dark mode via `[data-theme="dark"]` attribute selector
- Responsive design with desktop-first media queries

**JavaScript Architecture:**
- Module pattern with init functions
- DOMContentLoaded event for initialization
- Feature-based file organization:
  - `main.js` - Core site functionality
  - `quote-form.js` - Form-specific logic
  - `effects.js` - Visual enhancements

## Entry Points

**User Entry Points:**
- `index.html` - Homepage (main landing page)
- `services.html` - Services listing
- `quote.html` - Quote request form
- `about.html` - Company information
- `contact.html` - Contact information and form

**JavaScript Initialization:**
```javascript
// main.js - Entry point
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
});

// effects.js - Entry point
document.addEventListener('DOMContentLoaded', function() {
    initPageLoader();
    initLightSwitch();
    initSparkCursor();
    initVoltageMeter();  // Only on quote.html
});
```

## State Management

**Client-Side State:**
- Theme preference: `localStorage.getItem('theme')`
- Form file uploads: In-memory array (`uploadedFiles`)
- No global state management library

**URL State:**
- Static pages with no query parameters
- Hash anchors for same-page navigation (`#services`)

## Key Decisions

**Static HTML over SPA:**
- No JavaScript framework (React, Vue, etc.)
- Each page is a complete HTML document
- SEO-friendly without additional configuration
- No build process required

**CSS-in-CSS (No CSS-in-JS):**
- Single CSS file for all styles
- CSS Custom Properties for theming
- No preprocessor (Sass, Less)

**Vanilla JavaScript:**
- No framework dependencies
- Direct DOM manipulation
- Browser APIs used directly

**External Form Service:**
- Web3Forms handles form submissions
- No backend server required
- Serverless architecture

## Dependencies

**Runtime Dependencies:**
- Google Fonts (Montserrat, Open Sans)
- Web3Forms API (form submissions)

**Browser APIs:**
- Fetch API (form submission)
- Intersection Observer (scroll animations)
- Web Audio API (sound effects)
- File API (photo uploads)
- LocalStorage (theme persistence)

---

*Architecture analysis: 2026-01-19*
