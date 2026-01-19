# Coding Conventions

**Analysis Date:** 2025-01-19

## Naming Patterns

**Files:**
- HTML pages: lowercase with hyphens for multi-word names (e.g., `index.html`, `quote.html`)
- JavaScript files: lowercase with hyphens, descriptive names (e.g., `main.js`, `quote-form.js`, `effects.js`)
- CSS files: lowercase, descriptive (e.g., `styles.css`)
- Directories: lowercase, short names (e.g., `js/`, `css/`, `images/`)

**Functions (JavaScript):**
- camelCase naming: `initMobileMenu()`, `initSmoothScroll()`, `handleFiles()`
- Prefix with `init` for initialization functions: `initLightSwitch()`, `initSparkCursor()`, `initVoltageMeter()`
- Prefix with `create` for DOM element creation: `createSpark()`, `createSparkBurst()`, `createPreview()`
- Prefix with `play` for audio functions: `playClickSound()`, `playPowerOnSound()`
- Prefix with `validate` for validation: `validateInput()`
- Prefix with `update` for state updates: `updateMeter()`, `updateFileInput()`

**Variables (JavaScript):**
- camelCase for all variables: `uploadedFiles`, `lastSparkTime`, `currentPercentage`
- UPPER_SNAKE_CASE for constants: `MAX_FILES`, `MAX_FILE_SIZE`
- Descriptive names preferred over abbreviations: `mobileNav` not `mNav`

**CSS Classes:**
- BEM-inspired but simplified: `.service-card`, `.hero-content`, `.form-group`
- Hyphen-separated for component names: `.mobile-menu-btn`, `.quote-form-card`
- State classes: `.active`, `.show`, `.error`, `.dragover`, `.loaded`
- Modifier suffixes: `.btn-primary`, `.btn-secondary`, `.btn-lg`, `.btn-outline`

**CSS Variables:**
- Prefix with `--`: `--primary`, `--secondary`, `--dark`, `--light`
- Descriptive semantic names: `--primary-dark`, `--shadow-lg`, `--radius-lg`

**HTML IDs:**
- camelCase: `quoteForm`, `uploadZone`, `photoUpload`, `imagePreviews`
- Descriptive and unique per page

## Code Style

**Formatting:**
- Tool used: None configured (manual formatting)
- Indentation: 4 spaces in JavaScript and CSS
- Indentation: 4 spaces in HTML
- No trailing semicolons enforced, but consistently used in JavaScript
- Single quotes not enforced, double quotes commonly used in HTML attributes

**Linting:**
- Tool used: None configured
- No ESLint, Prettier, or other formatters detected

**Line Length:**
- No strict limit, but generally under 120 characters
- Long CSS property values allowed on single lines

**Braces:**
- Opening brace on same line as statement
- Closing brace on its own line

```javascript
// Correct pattern
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    if (menuBtn && mobileNav) {
        menuBtn.addEventListener('click', function() {
            // ...
        });
    }
}
```

## Import Organization

**HTML Script Loading:**
1. Core functionality first: `main.js`
2. Page-specific scripts: `quote-form.js` (only on quote.html)
3. Enhancement scripts last: `effects.js`

```html
<!-- Scripts -->
<script src="js/main.js"></script>
<script src="js/quote-form.js"></script>  <!-- page-specific, when needed -->
<script src="js/effects.js"></script>
```

**CSS Loading:**
- Single stylesheet approach: all styles in `css/styles.css`
- Google Fonts loaded before local CSS
- Use preconnect for external resources

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=..." rel="stylesheet">
<link rel="stylesheet" href="css/styles.css">
```

**Path Aliases:**
- None used (static site with relative paths)
- All paths relative to HTML file location

## Error Handling

**Patterns:**
- Try-catch blocks for Web Audio API calls (browser compatibility)
- Guard clauses for DOM elements that may not exist
- User-facing alerts for validation errors
- Console.error for development debugging

```javascript
// Guard clause pattern
function initVoltageMeter() {
    const quoteForm = document.getElementById('quoteForm');
    if (!quoteForm) return; // Only run on quote page
    // ...
}

// Try-catch for optional features
function playClickSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // ...
    } catch (e) {
        // Audio not supported, fail silently
    }
}

// User feedback for errors
} catch (error) {
    console.error('Form submission error:', error);
    alert('Sorry, there was an error submitting your quote request. Please try again or call us directly.');
}
```

**Form Validation:**
- HTML5 `required` attribute for required fields
- Custom JavaScript validation on blur and input events
- Visual feedback via border color and `.error` class

## Logging

**Framework:** Browser console (no logging library)

**Patterns:**
- `console.error()` for caught exceptions in form submission
- No debug logging in production code
- Silent failure for non-critical features (audio effects)

## Comments

**When to Comment:**
- Section headers using block comments with `=` separators
- Inline comments for non-obvious logic
- No JSDoc or formal documentation

**Section Header Pattern:**
```javascript
/* ============================================
   SJ Electrical Contractors - Main JavaScript
   ============================================ */

/* Mobile Menu */
function initMobileMenu() {
    // ...
}
```

**CSS Section Headers:**
```css
/* ============================================
   Header & Navigation
   ============================================ */

/* ============================================
   Hero Section
   ============================================ */
```

## Function Design

**Size:**
- Functions generally 10-50 lines
- Single responsibility principle loosely followed
- Initialization functions may be larger (setup multiple listeners)

**Parameters:**
- Positional parameters preferred
- DOM elements passed directly: `handleFiles(files)`, `createPreview(file, index)`
- No destructuring or default parameters used

**Return Values:**
- Most functions are void (side effects on DOM)
- Early returns for guard clauses
- No explicit return statements for void functions

## Module Design

**Exports:**
- None (vanilla JavaScript, no module system)
- All functions in global scope
- IIFE pattern not used

**File Organization:**
- `main.js`: Core site functionality (menu, scroll, animations)
- `quote-form.js`: Quote form specific logic (file upload, validation, submission)
- `effects.js`: Visual effects (light switch, sparks, loading animation)

**Initialization Pattern:**
- Use `DOMContentLoaded` event listener
- Call init functions from single event handler

```javascript
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initSmoothScroll();
    initHeaderScroll();
    initScrollAnimations();
});
```

## CSS Organization

**Structure in `css/styles.css`:**
1. CSS Variables (`:root`)
2. Reset & Base styles
3. Utility classes (`.container`, `.btn`)
4. Component sections (Header, Hero, Services, etc.)
5. Page-specific styles (Quote Form, About, Contact)
6. Responsive breakpoints
7. Animations
8. Dark mode overrides
9. Special effects (light switch, sparks, loader)

**Responsive Breakpoints:**
- Desktop first approach
- `@media (max-width: 991px)` - Tablet
- `@media (max-width: 767px)` - Mobile

**CSS Variables Usage:**
```css
:root {
    --primary: #0066CC;
    --primary-dark: #004d99;
    --secondary: #FFD700;
    --dark: #2D2D2D;
    --light: #F8F9FA;
    --white: #FFFFFF;
    --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    --radius: 8px;
    --transition: all 0.3s ease;
}
```

## HTML Patterns

**Document Structure:**
- Semantic HTML5 elements: `<header>`, `<nav>`, `<section>`, `<footer>`
- Class-based styling (no inline styles except dynamic JS)
- SVG icons inline (not external files)
- Accessibility attributes: `aria-label` on buttons

**Repeated Components:**
- Header and footer duplicated across all HTML files
- No templating system (static HTML)

**Form Pattern:**
```html
<div class="form-group">
    <label for="fieldId">Label Text <span>*</span></label>
    <input type="text" id="fieldId" name="fieldName" class="form-control" placeholder="..." required>
</div>
```

---

*Convention analysis: 2025-01-19*
