# Codebase Concerns

**Analysis Date:** 2025-01-19

## Tech Debt

**Placeholder API Key in Forms:**
- Issue: Web3Forms API key is set to placeholder value `YOUR_WEB3FORMS_ACCESS_KEY` in both forms
- Files: `quote.html` (line 85), `contact.html` (line 138)
- Impact: Form submissions will fail entirely - users cannot submit quote requests or contact messages
- Fix approach: Replace placeholder with actual Web3Forms access key or implement alternative form backend

**Hardcoded Placeholder Contact Information:**
- Issue: Phone number uses placeholder `020 1234 5678` and email uses `info@sjelectrical.co.uk` throughout
- Files: All HTML files (`index.html`, `about.html`, `contact.html`, `quote.html`, `services.html`)
- Impact: Users will call/email incorrect contact details
- Fix approach: Replace all instances with actual business phone and email

**Duplicated Header/Footer Markup:**
- Issue: Identical header and footer HTML repeated in every page (5 copies each)
- Files: `index.html`, `about.html`, `contact.html`, `quote.html`, `services.html`
- Impact: Any change to navigation/footer requires editing 5 files; prone to inconsistencies
- Fix approach: Consider using static site generator or JavaScript includes to centralize navigation

**Inline Styles in HTML:**
- Issue: Multiple inline `style` attributes scattered throughout HTML files
- Files: `contact.html` (lines 128, 134, 143, 148, 158, 170, 206-211), `about.html` (lines 229, 245-247)
- Impact: Harder to maintain consistent styling, bypasses CSS cascade
- Fix approach: Move all inline styles to `css/styles.css` with appropriate class selectors

**Empty Images Directory:**
- Issue: `images/` directory exists but contains no files
- Files: `images/` directory
- Impact: No actual images on site; relies entirely on inline SVGs and CSS backgrounds
- Fix approach: Add actual images if needed (company photos, project gallery, etc.)

## Known Bugs

**Google Maps Embed Invalid URL:**
- Symptoms: Map may not display correctly or show generic location
- Files: `contact.html` (lines 192-200)
- Trigger: The embed URL contains placeholder coordinates that may not resolve to actual E4 8AG location
- Workaround: None - map likely displays but may not show correct location

**Unused Variable in main.js:**
- Symptoms: No visible bug but indicates incomplete code
- Files: `js/main.js` (line 82, `lastScroll` variable)
- Trigger: `lastScroll` is assigned but never used after assignment
- Workaround: Harmless but should be cleaned up

## Security Considerations

**Form Submissions via Third-Party Service:**
- Risk: All form data (including photos) sent to Web3Forms external API
- Files: `quote.html` (line 83), `contact.html` (line 136)
- Current mitigation: HTTPS used for API endpoint
- Recommendations: Consider adding CSRF protection, rate limiting, honeypot fields for spam prevention

**Client-Side Only Validation:**
- Risk: Form validation relies entirely on HTML5 `required` and client-side JavaScript
- Files: `js/quote-form.js` (lines 176-198)
- Current mitigation: None
- Recommendations: Add server-side validation through form backend; current approach allows bypassing validation via browser devtools

**No Content Security Policy:**
- Risk: No CSP headers defined, making site vulnerable to XSS attacks
- Files: All HTML files (no CSP meta tags)
- Current mitigation: None
- Recommendations: Add CSP meta tag or configure server headers to restrict script sources

**External Font Loading:**
- Risk: Google Fonts loaded from external CDN could be a tracking/privacy concern
- Files: All HTML files (font preconnect and stylesheet links)
- Current mitigation: None
- Recommendations: Consider self-hosting fonts for privacy-conscious users

## Performance Bottlenecks

**Large Single CSS File:**
- Problem: All CSS in single 2246-line file including unused component styles on every page
- Files: `css/styles.css`
- Cause: No code splitting or page-specific CSS
- Improvement path: Split into base styles and page-specific stylesheets, or use build tool for tree-shaking

**Multiple Blocking Script Loads:**
- Problem: JavaScript files loaded synchronously at end of body
- Files: All HTML files load 2-3 JS files (main.js, effects.js, quote-form.js)
- Cause: No async/defer attributes
- Improvement path: Add `defer` attribute to script tags for non-blocking load

**Page Loader Animation Delay:**
- Problem: Page loader adds artificial 1.5+ second delay before content visible
- Files: `js/effects.js` (lines 54-81)
- Cause: Flickering animation intentionally delays showing content
- Improvement path: Reduce animation duration or make it non-blocking; consider showing content immediately if page loads fast

**No Image Optimization:**
- Problem: No images currently but structure doesn't support responsive images
- Files: N/A (no images exist)
- Cause: No picture/srcset elements, no lazy loading
- Improvement path: When adding images, use responsive images with srcset and lazy loading

## Fragile Areas

**Quote Form Voltage Meter:**
- Files: `js/effects.js` (lines 363-558)
- Why fragile: Tightly coupled to specific form field IDs; if form structure changes, meter breaks silently
- Safe modification: Keep form field IDs consistent: `name`, `phone`, `email`, `postcode`, `address`, `service`, `description`
- Test coverage: None

**Dark Mode Implementation:**
- Files: `js/effects.js` (lines 112-168), `css/styles.css` (lines 1582-1640)
- Why fragile: Theme toggle creates/appends elements dynamically; CSS relies on `[data-theme="dark"]` selectors
- Safe modification: Test both themes after any CSS color changes
- Test coverage: None

**Mobile Menu Toggle:**
- Files: `js/main.js` (lines 20-55)
- Why fragile: Relies on exact DOM structure of hamburger menu spans; inline transform styles
- Safe modification: Do not change mobile menu HTML structure without updating JS
- Test coverage: None

**File Upload Preview System:**
- Files: `js/quote-form.js` (lines 79-123)
- Why fragile: Uses DataTransfer API which has inconsistent browser support; index tracking can desync if files removed in wrong order
- Safe modification: Test file add/remove operations in multiple browsers
- Test coverage: None

## Scaling Limits

**Static HTML Site:**
- Current capacity: Suitable for single small business
- Limit: No CMS; every content change requires code deployment
- Scaling path: Integrate with headless CMS or convert to static site generator (11ty, Astro, etc.)

**Form Submissions:**
- Current capacity: Web3Forms free tier (limited submissions/month)
- Limit: Unknown free tier limits; photos may hit size limits
- Scaling path: Self-host form backend or upgrade Web3Forms plan

## Dependencies at Risk

**Web3Forms External Dependency:**
- Risk: Third-party service; if service goes down, all form submissions fail
- Impact: Cannot collect leads or contact requests
- Migration plan: Implement self-hosted form handler (PHP, Node.js, Netlify Functions, etc.)

**Google Fonts CDN:**
- Risk: External CDN dependency; potential privacy concerns under GDPR
- Impact: If CDN slow/down, fonts load slowly or fall back to system fonts
- Migration plan: Self-host Montserrat and Open Sans font files

## Missing Critical Features

**No Analytics:**
- Problem: No way to track visitor behavior, conversions, or traffic sources
- Blocks: Business insights, marketing optimization

**No Cookie Consent:**
- Problem: If analytics or third-party services added, GDPR compliance will be needed
- Blocks: Legal compliance in EU/UK

**No Sitemap or robots.txt:**
- Problem: Search engines may not efficiently crawl the site
- Blocks: SEO optimization

**No Favicon:**
- Problem: No favicon defined in HTML head
- Blocks: Brand recognition in browser tabs/bookmarks

**No 404 Page:**
- Problem: No custom error page for broken links
- Blocks: User experience when encountering dead links

**No Privacy Policy or Terms:**
- Problem: No legal pages despite collecting personal data via forms
- Blocks: Legal compliance

## Test Coverage Gaps

**No Automated Tests:**
- What's not tested: Entire codebase has zero automated tests
- Files: All JavaScript files (`js/main.js`, `js/effects.js`, `js/quote-form.js`)
- Risk: Any refactoring could break functionality silently
- Priority: High - especially for form handling and file upload logic

**No Cross-Browser Testing Setup:**
- What's not tested: Browser compatibility
- Files: All files
- Risk: Features like DataTransfer API, Web Audio API may not work in all browsers
- Priority: Medium

**No Accessibility Testing:**
- What's not tested: Screen reader compatibility, keyboard navigation
- Files: All HTML files
- Risk: Users with disabilities may not be able to use the site
- Priority: Medium - especially for forms

**No Mobile Testing Setup:**
- What's not tested: Responsive behavior on actual devices
- Files: `css/styles.css` media queries
- Risk: Layout issues on specific device sizes
- Priority: Medium

---

*Concerns audit: 2025-01-19*
