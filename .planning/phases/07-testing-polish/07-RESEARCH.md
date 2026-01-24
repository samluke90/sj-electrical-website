# Phase 7: Testing & Polish - Research

**Researched:** 2026-01-24
**Domain:** Cross-browser testing, responsive design, graceful error handling
**Confidence:** HIGH

## Summary

This research covers testing and polish requirements for the v1.2 quote form enhancements: voice recording (MediaRecorder API), WhatsApp handoff (wa.me URLs), symptom checker, and dark/light mode theming. The existing implementation in `quote-form.js` and `styles.css` is already functional -- this phase validates cross-browser compatibility and adds graceful error handling for edge cases.

Key findings: MediaRecorder has excellent browser support (95%+ global coverage) but requires format detection for Safari/iOS which prefers `audio/mp4` over `audio/webm`. The WhatsApp wa.me URL is universally compatible across mobile and desktop. The existing CSS custom properties system handles dark/light mode well but needs verification of component styling in both modes. Touch targets need validation against WCAG 2.5.8 (minimum 24x24px, recommended 44x44px).

**Primary recommendation:** Implement browser feature detection with `MediaRecorder.isTypeSupported()` for audio format selection, add explicit fallback UI when voice recording is unavailable, and validate all interactive elements meet 44x44px touch targets.

## Standard Stack

No new libraries required -- this phase uses manual testing and native browser APIs.

### Core Testing Requirements

| Browser | Versions | Priority | Notes |
|---------|----------|----------|-------|
| Chrome | 100+ | HIGH | Primary desktop/Android browser |
| Firefox | 100+ | HIGH | Major desktop browser |
| Safari | 14.5+ | HIGH | macOS/iOS - different MediaRecorder codecs |
| Edge | 100+ | MEDIUM | Chromium-based, similar to Chrome |
| Samsung Internet | 15+ | LOW | Uses Chromium, Android only |

### Supporting APIs

| API | Browser Support | Purpose | Fallback |
|-----|-----------------|---------|----------|
| MediaRecorder | 95.07% global | Voice recording | Hide voice section |
| getUserMedia | 97%+ global | Microphone access | Show permission instructions |
| DataTransfer | 99%+ global | Photo upload | Works everywhere modern |
| CSS Custom Properties | 98%+ global | Dark/light mode | Already implemented |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual testing | BrowserStack/LambdaTest | Overkill for static site |
| Feature detection | User-Agent sniffing | UA is unreliable, feature detection is standard |
| Audio format hardcoding | isTypeSupported() | Must use isTypeSupported for Safari compatibility |

## Architecture Patterns

### Pattern 1: Progressive Enhancement for Voice Recording

**What:** Check for API support before showing voice recording UI
**When to use:** Features that depend on browser APIs not universally available
**Example:**
```javascript
// Source: MDN MediaRecorder documentation + WebKit blog
function initVoiceRecording() {
    const voiceSection = document.getElementById('voiceSection');

    // Check for required APIs
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        voiceSection.style.display = 'none';
        return;
    }

    if (typeof MediaRecorder === 'undefined') {
        voiceSection.style.display = 'none';
        return;
    }

    // Show section, user can attempt recording
    voiceSection.style.display = 'block';
}
```

### Pattern 2: Format Detection for MediaRecorder (Safari Compatibility)

**What:** Detect supported audio formats in order of preference
**When to use:** When creating MediaRecorder instances
**Example:**
```javascript
// Source: https://www.buildwithmatija.com/blog/iphone-safari-mediarecorder-audio-recording-transcription
function getSupportedMimeType() {
    const types = [
        'audio/webm;codecs=opus',  // Chrome/Firefox preference
        'audio/webm',              // Generic webm
        'audio/mp4',               // Safari preference
        'audio/ogg;codecs=opus',   // Firefox fallback
    ];

    for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
            return type;
        }
    }

    return ''; // Let browser choose default
}

// Usage
const mimeType = getSupportedMimeType();
const options = mimeType ? { mimeType } : {};
const mediaRecorder = new MediaRecorder(stream, options);
```

### Pattern 3: Permission Handling with User Feedback

**What:** Handle microphone permission states gracefully
**When to use:** Before and during getUserMedia calls
**Example:**
```javascript
// Source: MDN getUserMedia + Permissions API
async function checkMicrophonePermission() {
    try {
        const permission = await navigator.permissions.query({ name: 'microphone' });

        if (permission.state === 'denied') {
            showError('Microphone access blocked. Please enable in browser settings.');
            return false;
        }

        return true;
    } catch (err) {
        // Permissions API not supported, try getUserMedia directly
        return true;
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Success - proceed with recording
    } catch (err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            showError('Microphone access denied. Please allow microphone access to record.');
        } else if (err.name === 'NotFoundError') {
            showError('No microphone found. Please connect a microphone.');
        } else {
            showError('Could not access microphone. Voice recording unavailable.');
        }
    }
}
```

### Pattern 4: Accessible Error Display with ARIA

**What:** Error messages that screen readers announce
**When to use:** All form validation and error states
**Example:**
```javascript
// Source: MDN ARIA + TetraLogical form validation guide
// HTML structure (already present in quote.html):
// <div id="form-errors" role="alert" aria-live="assertive" aria-atomic="true"></div>

function showError(message) {
    const errorContainer = document.getElementById('form-errors');
    errorContainer.textContent = message;
    errorContainer.classList.add('visible');

    // Focus for keyboard users
    errorContainer.setAttribute('tabindex', '-1');
    errorContainer.focus();

    // Scroll into view
    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function clearErrors() {
    const errorContainer = document.getElementById('form-errors');
    errorContainer.textContent = '';
    errorContainer.classList.remove('visible');
}
```

### Anti-Patterns to Avoid

- **Alert boxes for errors:** Use inline accessible error containers, not `alert()`
- **Silent failures:** Always inform user when something doesn't work
- **User-Agent detection:** Use feature detection (`typeof MediaRecorder !== 'undefined'`)
- **Hardcoded MIME types:** Use `isTypeSupported()` for cross-browser audio formats
- **Missing aria-invalid:** Always set `aria-invalid="true"` on invalid form fields

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Audio format detection | Hardcode webm | `MediaRecorder.isTypeSupported()` | Safari uses mp4, Chrome uses webm |
| Permission state checking | Nothing | Permissions API query | Better UX before prompting |
| URL encoding for WhatsApp | Manual string replace | `encodeURIComponent()` | Handles all special characters correctly |
| Touch target sizing | Guessing | WCAG 2.5.8 standards (24px min, 44px recommended) | Research-backed accessibility |
| Error announcements | Custom solution | `role="alert"` + `aria-live="assertive"` | Native screen reader support |

**Key insight:** Browser APIs have built-in methods for feature detection and encoding. Using them ensures compatibility without maintenance overhead.

## Common Pitfalls

### Pitfall 1: Safari MediaRecorder MIME Type Rejection

**What goes wrong:** Safari rejects `audio/webm` causing recording to fail silently
**Why it happens:** Safari prefers `audio/mp4` with AAC codec, not webm with opus
**How to avoid:** Always use `isTypeSupported()` to select format
**Warning signs:** Recording works in Chrome but fails in Safari

### Pitfall 2: getUserMedia on Non-HTTPS

**What goes wrong:** `navigator.mediaDevices` is `undefined`, causing TypeError
**Why it happens:** getUserMedia requires secure context (HTTPS or localhost only)
**How to avoid:** Test on localhost or HTTPS; production must be HTTPS
**Warning signs:** Works locally, fails on deployed HTTP site

### Pitfall 3: DataTransfer Constructor Safari Incompatibility

**What goes wrong:** `new DataTransfer()` fails on older Safari versions
**Why it happens:** DataTransfer constructor not supported until Safari 14.1
**How to avoid:** The current implementation uses DataTransfer for file management; verify Safari 14.1+ or implement fallback
**Warning signs:** Photo upload file management fails on Safari

### Pitfall 4: Touch Targets Too Small on Mobile

**What goes wrong:** Users repeatedly miss buttons, causing frustration
**Why it happens:** Buttons sized for mouse, not finger (< 44px)
**How to avoid:** Verify all interactive elements are at least 44x44 CSS pixels
**Warning signs:** Rage taps, accidental clicks on wrong element

### Pitfall 5: Dark Mode Component Styling Inconsistency

**What goes wrong:** Some components appear wrong in dark or light mode
**Why it happens:** CSS variables not consistently applied to all states
**How to avoid:** Test every component in both modes; check hover, focus, active states
**Warning signs:** Text invisible against background, low contrast buttons

### Pitfall 6: WhatsApp URL Special Characters

**What goes wrong:** Message appears garbled or truncated in WhatsApp
**Why it happens:** Special characters (newlines, asterisks) not properly encoded
**How to avoid:** Use `encodeURIComponent()` for the entire message
**Warning signs:** Line breaks missing, formatting broken in WhatsApp

### Pitfall 7: Form Submission Without Voice (Edge Case)

**What goes wrong:** Form submission fails or behaves unexpectedly when voice is optional
**Why it happens:** Code assumes voiceBlob exists
**How to avoid:** Check `if (voiceBlob)` before appending to FormData (already implemented)
**Warning signs:** Form works with voice, fails without

## Code Examples

### Cross-Browser Audio Recording

```javascript
// Source: MDN MediaRecorder + WebKit blog research
class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.voiceBlob = null;
        this.mimeType = this.getSupportedMimeType();
    }

    getSupportedMimeType() {
        const types = [
            'audio/webm;codecs=opus',
            'audio/webm',
            'audio/mp4',
            'audio/ogg;codecs=opus'
        ];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                console.log('Using audio format:', type);
                return type;
            }
        }

        console.warn('No preferred format supported, using browser default');
        return '';
    }

    async start() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            const options = this.mimeType ? { mimeType: this.mimeType } : {};
            this.mediaRecorder = new MediaRecorder(stream, options);
            this.audioChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                this.audioChunks.push(e.data);
            };

            this.mediaRecorder.onstop = () => {
                const actualMimeType = this.mediaRecorder.mimeType || 'audio/webm';
                this.voiceBlob = new Blob(this.audioChunks, { type: actualMimeType });
                stream.getTracks().forEach(track => track.stop());
            };

            this.mediaRecorder.start();
            return true;

        } catch (err) {
            this.handleError(err);
            return false;
        }
    }

    handleError(err) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            showError('Microphone access denied. Allow microphone in browser settings to record.');
        } else if (err.name === 'NotFoundError') {
            showError('No microphone found. Connect a microphone to record.');
        } else if (err.name === 'NotSupportedError') {
            showError('Voice recording not supported in this browser.');
        } else {
            showError('Could not start recording. Voice message unavailable.');
            console.error('Recording error:', err);
        }
    }
}
```

### WhatsApp Message Builder

```javascript
// Source: WhatsApp Click-to-Chat documentation
function buildWhatsAppMessage() {
    const name = document.getElementById('name')?.value || '';
    const phone = document.getElementById('phone')?.value || '';
    const email = document.getElementById('email')?.value || '';
    const postcode = document.getElementById('postcode')?.value || '';
    const service = document.getElementById('service')?.value || '';
    const urgency = document.getElementById('urgency')?.value || '';
    const description = document.getElementById('description')?.value || '';
    const symptomDetails = collectSymptomAnswers();

    let message = '*Quote Request*\n\n';
    message += `Name: ${name}\n`;
    message += `Phone: ${phone}\n`;
    message += `Email: ${email}\n`;
    message += `Postcode: ${postcode}\n\n`;
    message += `Service: ${service}\n`;
    message += `Urgency: ${urgency}\n`;

    if (symptomDetails) {
        message += `\n${symptomDetails}\n`;
    }

    message += `\nDescription:\n${description}\n\n`;
    message += `(Sent from sjec.uk quote form)`;

    return message;
}

function openWhatsApp() {
    const message = buildWhatsAppMessage();
    const phoneNumber = '447875210678'; // UK format, no + or spaces
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Works on both mobile (opens app) and desktop (opens web)
    window.open(url, '_blank');
}
```

### Touch Target Verification Utility

```javascript
// Source: WCAG 2.5.8 Target Size guidelines
function verifyTouchTargets() {
    const minSize = 24;  // WCAG 2.5.8 minimum (Level AA)
    const recSize = 44;  // WCAG 2.5.5 enhanced / Apple/Google recommendation

    const interactive = document.querySelectorAll(
        'button, a, input, select, textarea, [role="button"], [tabindex="0"]'
    );

    const issues = [];

    interactive.forEach(el => {
        const rect = el.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (width < minSize || height < minSize) {
            issues.push({
                element: el,
                size: `${Math.round(width)}x${Math.round(height)}`,
                severity: 'CRITICAL',
                message: `Below minimum size (${minSize}px)`
            });
        } else if (width < recSize || height < recSize) {
            issues.push({
                element: el,
                size: `${Math.round(width)}x${Math.round(height)}`,
                severity: 'WARNING',
                message: `Below recommended size (${recSize}px)`
            });
        }
    });

    return issues;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Hardcoded audio/webm | isTypeSupported() detection | 2020+ | Safari compatibility |
| alert() for errors | ARIA live regions | 2018+ | Accessibility compliance |
| Fixed pixel breakpoints | Fluid layouts + container queries | 2023+ | Better responsive design |
| UA sniffing | Feature detection | 2015+ | Reliability |
| light-mode-only design | CSS custom properties + prefers-color-scheme | 2019+ | Dark mode support |

**Deprecated/outdated:**
- `navigator.getUserMedia()`: Deprecated, use `navigator.mediaDevices.getUserMedia()`
- `webkitGetUserMedia()`: Vendor prefix, no longer needed
- Fixed device breakpoints: Use content-based breakpoints instead

## Testing Checklist

### Cross-Browser Testing Matrix

| Feature | Chrome | Firefox | Safari | Mobile Safari | Edge |
|---------|--------|---------|--------|---------------|------|
| Voice record start | - | - | - | - | - |
| Voice record stop | - | - | - | - | - |
| Voice playback | - | - | - | - | - |
| Voice delete | - | - | - | - | - |
| Mic denied error | - | - | - | - | - |
| WhatsApp desktop | - | - | - | N/A | - |
| WhatsApp mobile | N/A | N/A | - | - | N/A |
| Symptom checker show | - | - | - | - | - |
| Symptom checker select | - | - | - | - | - |
| Photo upload | - | - | - | - | - |
| Photo preview | - | - | - | - | - |
| Photo remove | - | - | - | - | - |
| Form submit | - | - | - | - | - |
| Dark mode | - | - | - | - | - |
| Light mode | - | - | - | - | - |

### Mobile-Specific Tests

- [ ] Voice recorder touch targets >= 44px
- [ ] Symptom option pills tappable on mobile
- [ ] WhatsApp button opens app (not browser)
- [ ] Form scrolls properly in viewport
- [ ] Keyboard doesn't obscure input fields
- [ ] Recording indicator visible while recording

### Edge Case Tests

- [ ] Form submit without voice recording
- [ ] Form submit with empty optional fields
- [ ] WhatsApp with empty description
- [ ] WhatsApp with special characters (quotes, newlines)
- [ ] Mic permission denied before recording
- [ ] MediaRecorder unsupported (show graceful fallback)
- [ ] Network error during form submission

### Accessibility Tests

- [ ] Screen reader announces error messages
- [ ] Focus moves to error container on error
- [ ] aria-invalid set on invalid fields
- [ ] Symptom options keyboard accessible
- [ ] Recording status announced

## Open Questions

1. **Audio file size on Safari**
   - What we know: Safari's mp4 format produces larger files than webm
   - What's unclear: Whether file size will exceed n8n webhook limits
   - Recommendation: Test actual file sizes, consider compression if needed

2. **iOS Safari getUserMedia in PWA/WebView**
   - What we know: Works in Safari browser
   - What's unclear: Behavior in embedded WebViews
   - Recommendation: Test in standard browser only, note limitation

## Sources

### Primary (HIGH confidence)
- [MDN MediaRecorder](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) - API reference, compatibility
- [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia) - Permission handling, errors
- [Can I Use MediaRecorder](https://caniuse.com/mediarecorder) - Browser support data
- [WhatsApp Help Center Click-to-Chat](https://faq.whatsapp.com/5913398998672934) - URL format
- [WCAG 2.5.8 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) - Touch targets

### Secondary (MEDIUM confidence)
- [WebKit MediaRecorder Blog](https://webkit.org/blog/11353/mediarecorder-api/) - Safari implementation details
- [TetraLogical Form Validation](https://tetralogical.com/blog/2024/10/21/foundations-form-validation-and-error-messages/) - ARIA error patterns
- [Smashing Magazine Touch Targets](https://www.smashingmagazine.com/2023/04/accessible-tap-target-sizes-rage-taps-clicks/) - Touch target research
- [BrowserStack Breakpoints Guide](https://www.browserstack.com/guide/responsive-design-breakpoints) - Responsive testing

### Tertiary (LOW confidence)
- [Safari Audio Format Blog](https://www.buildwithmatija.com/blog/iphone-safari-mediarecorder-audio-recording-transcription) - iPhone Safari specifics (third-party)

## Metadata

**Confidence breakdown:**
- Browser compatibility: HIGH - Official MDN and Can I Use data
- Error handling patterns: HIGH - MDN and WCAG documentation
- Touch target requirements: HIGH - W3C WCAG specification
- Safari audio formats: MEDIUM - Mix of official WebKit and third-party sources
- Mobile-specific behaviors: MEDIUM - Some requires real device testing

**Research date:** 2026-01-24
**Valid until:** 60 days (browser APIs stable, testing patterns standard)
