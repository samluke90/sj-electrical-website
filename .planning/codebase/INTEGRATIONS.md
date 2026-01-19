# External Integrations

**Analysis Date:** 2026-01-19

## APIs & External Services

**Form Submission:**
- Web3Forms - Email delivery for form submissions
  - Endpoint: `https://api.web3forms.com/submit`
  - Auth: Hidden input `access_key` (placeholder: `YOUR_WEB3FORMS_ACCESS_KEY`)
  - Used in: `quote.html` (quote form), `contact.html` (contact form)
  - Method: POST with FormData (supports file attachments)
  - Response: JSON with `success` boolean and optional `message`

**Typography:**
- Google Fonts API
  - Fonts loaded: Montserrat (600, 700), Open Sans (400, 500, 600)
  - URL: `https://fonts.googleapis.com/css2?family=Montserrat:wght@600;700&family=Open+Sans:wght@400;500;600&display=swap`
  - Preconnect hints used for performance

**Maps:**
- Google Maps Embed
  - Used in: `contact.html`
  - Location: Chingford, London E4 8AG
  - Implementation: iframe embed
  - No API key required (embed mode)

## Data Storage

**Databases:**
- None - Static website with no database

**File Storage:**
- None - Photos uploaded via forms are sent to Web3Forms, not stored locally

**Caching:**
- Browser caching only (no service worker detected)
- LocalStorage used for theme preference (dark mode)
  - Key: `theme`
  - Values: `'light'` | `'dark'`

## Authentication & Identity

**Auth Provider:**
- None - No user authentication

**Form Access:**
- Web3Forms access key (public, embedded in HTML)
  - Must be replaced with valid key for production
  - Located: `quote.html` line 85, `contact.html` line 138

## Monitoring & Observability

**Error Tracking:**
- None - No error tracking service integrated

**Logs:**
- Console.error for form submission errors (`quote-form.js` line 164)
- No centralized logging

**Analytics:**
- None detected - No Google Analytics, Plausible, or similar

## CI/CD & Deployment

**Hosting:**
- Unknown - No deployment configuration files detected
- Static hosting ready (Netlify, Vercel, GitHub Pages, traditional web server)

**CI Pipeline:**
- None detected - No GitHub Actions, CI config files

## Environment Configuration

**Required for production:**
- Web3Forms API key (replace `YOUR_WEB3FORMS_ACCESS_KEY` in two files)
  - `quote.html` line 85
  - `contact.html` line 138
- Valid Google Maps embed URL (currently using placeholder coordinates)
  - `contact.html` line 193

**Optional:**
- Custom domain configuration (depends on hosting provider)
- SSL certificate (recommended, may be automatic with modern hosts)

## Webhooks & Callbacks

**Incoming:**
- None - Static site, no server endpoints

**Outgoing:**
- Web3Forms receives form data and sends email notifications
- No other outbound webhooks

## Third-Party Embeds

**Google Maps:**
- Embedded iframe in contact page
- Loads from `google.com/maps/embed`
- Lazy loaded (`loading="lazy"`)

## Security Considerations

**API Keys:**
- Web3Forms key is client-side visible (by design - service is built for this)
- No sensitive server-side credentials

**Form Validation:**
- Client-side only
- File type validation: `image/(jpeg|jpg|png|gif|webp)`
- File size limit: 5MB per file
- Max files: 5

**CORS:**
- Web3Forms handles CORS for form submissions
- Google Fonts/Maps have permissive CORS

## Integration Code Examples

**Web3Forms Submission (`js/quote-form.js`):**
```javascript
const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
});
const result = await response.json();
if (result.success) {
    // Success handling
}
```

**LocalStorage Theme (`js/effects.js`):**
```javascript
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
}
// On toggle:
localStorage.setItem('theme', newTheme);
```

---

*Integration audit: 2026-01-19*
