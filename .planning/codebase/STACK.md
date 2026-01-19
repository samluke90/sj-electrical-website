# Technology Stack

**Analysis Date:** 2026-01-19

## Languages

**Primary:**
- HTML5 - All page structure (`index.html`, `services.html`, `quote.html`, `about.html`, `contact.html`)
- CSS3 - Styling and animations (`css/styles.css`)
- JavaScript (ES6+) - Client-side interactivity (`js/main.js`, `js/quote-form.js`, `js/effects.js`)

**Secondary:**
- SVG - Inline icons throughout HTML files

## Runtime

**Environment:**
- Browser-based (no server-side runtime)
- Modern browser required (ES6+ features: async/await, arrow functions, template literals)
- Web Audio API used for sound effects

**Package Manager:**
- None - No build tools or package management
- Static HTML/CSS/JS site

## Frameworks

**Core:**
- None - Vanilla HTML, CSS, JavaScript (no frameworks)

**Testing:**
- None detected

**Build/Dev:**
- None - No build process, bundler, or transpilation

## Key Dependencies

**External Resources (CDN):**
- Google Fonts (Montserrat, Open Sans)
  - `https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500;600&display=swap`
  - Preconnected: `fonts.googleapis.com`, `fonts.gstatic.com`

**Browser APIs Used:**
- Fetch API - Form submission to Web3Forms
- File API - Photo upload handling with FileReader, DataTransfer
- Web Audio API - Sound effects (oscillator, gain nodes)
- Intersection Observer API - Scroll animations
- LocalStorage - Theme persistence (dark mode)

## Configuration

**Environment:**
- No environment variables
- No `.env` file
- Web3Forms API key placeholder in HTML forms: `YOUR_WEB3FORMS_ACCESS_KEY`

**Build:**
- No build configuration
- No compilation step required

## CSS Architecture

**Approach:**
- Single CSS file (`css/styles.css` - 2246 lines)
- CSS Custom Properties (variables) for theming
- Mobile-first responsive design with media queries
- BEM-like class naming convention

**Key Variables (`:root`):**
```css
--primary: #0066CC
--primary-dark: #004d99
--secondary: #FFD700
--secondary-dark: #e6c200
--dark: #2D2D2D
--light: #F8F9FA
--white: #FFFFFF
--radius: 8px
--radius-lg: 16px
--transition: all 0.3s ease
```

**Dark Mode:**
- Implemented via `[data-theme="dark"]` attribute on `<html>`
- Full color scheme override in CSS

## JavaScript Architecture

**Pattern:**
- Module pattern with IIFE-style functions
- Event-driven initialization via DOMContentLoaded
- No module bundling or imports

**File Responsibilities:**
- `js/main.js` (137 lines): Mobile menu, smooth scroll, header effects, scroll animations
- `js/quote-form.js` (223 lines): Drag-drop upload, file validation, form submission
- `js/effects.js` (560 lines): Light switch, spark cursor, page loader, voltage meter

## Platform Requirements

**Development:**
- Any text editor
- Local file server or browser file:// access
- No Node.js or build tools required

**Production:**
- Static web hosting (any web server)
- No server-side processing required
- HTTPS recommended for Web3Forms API

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- ES6+ required (no polyfills)
- Web Audio API (optional - graceful degradation)

---

*Stack analysis: 2026-01-19*
