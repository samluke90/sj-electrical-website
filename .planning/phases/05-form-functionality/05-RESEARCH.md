# Phase 5: Form Functionality - Research

**Researched:** 2026-01-21
**Domain:** Form submission, validation, and Formspree integration
**Confidence:** HIGH

## Summary

This research covers implementing form submission functionality for a static HTML/CSS/JS site using Formspree as the backend service. The existing quote form (quote.html) already has complete HTML markup with all fields, photo upload capability, and a success message container. The current implementation uses Web3Forms - this needs to be migrated to Formspree per the requirements.

Key findings:
- Formspree provides a straightforward REST endpoint for form submissions
- AJAX submission requires the `Accept: application/json` header for JSON responses
- File uploads are supported with `enctype="multipart/form-data"`
- Client-side validation should combine HTML5 native validation with the Constraint Validation API
- Accessibility requires ARIA live regions for dynamic error announcements

**Primary recommendation:** Keep the existing form structure, replace Web3Forms with Formspree endpoint, update JavaScript to handle Formspree's response format, and enhance validation/error handling with accessible patterns.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Formspree | N/A (SaaS) | Form backend service | No server code needed, free tier available, email delivery built-in |
| Fetch API | Native | AJAX form submission | Browser-native, no dependencies, supports FormData |
| Constraint Validation API | Native | Form validation | Browser-native, accessible, works with HTML5 validation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| FormData | Native | Serialize form data | Always - handles file uploads and multipart data |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Formspree | Web3Forms (current) | Web3Forms is similar but requirements specify Formspree |
| Formspree | Netlify Forms | Only works on Netlify hosting |
| Custom server | Formspree | Custom requires backend infrastructure |

**Installation:**
No npm packages needed - using browser-native APIs and Formspree SaaS.

## Architecture Patterns

### Recommended Implementation Structure
```
js/
├── quote-form.js    # Form submission, validation, file handling (exists)
```

### Pattern 1: AJAX Form Submission with Formspree
**What:** Submit form data via fetch() with JSON response handling
**When to use:** All form submissions (avoids page redirect)
**Example:**
```javascript
// Source: Formspree AJAX documentation
async function handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    try {
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success - show confirmation
            showSuccess();
        } else {
            const data = await response.json();
            if (data.errors) {
                // Formspree validation errors
                showErrors(data.errors.map(e => e.message));
            } else {
                showError('Submission failed. Please try again.');
            }
        }
    } catch (error) {
        // Network error
        showError('Network error. Please check your connection and try again.');
    }
}
```

### Pattern 2: Client-Side Validation with Constraint Validation API
**What:** Use native HTML5 validation enhanced with custom JavaScript
**When to use:** Before form submission to provide immediate feedback
**Example:**
```javascript
// Source: MDN Constraint Validation API
function validateField(field) {
    // Reset custom validity
    field.setCustomValidity('');

    // Check native validation
    if (!field.validity.valid) {
        if (field.validity.valueMissing) {
            field.setCustomValidity('This field is required');
        } else if (field.validity.typeMismatch) {
            field.setCustomValidity('Please enter a valid ' + field.type);
        }
        return false;
    }
    return true;
}
```

### Pattern 3: Accessible Error Announcement
**What:** Use ARIA live regions to announce errors to screen readers
**When to use:** Any dynamic error message display
**Example:**
```html
<!-- Error container must exist in DOM on page load -->
<div id="form-errors" role="alert" aria-live="assertive" aria-atomic="true"></div>
```
```javascript
// Source: W3C WCAG ARIA19
function showError(message) {
    const errorContainer = document.getElementById('form-errors');
    errorContainer.textContent = message;
    errorContainer.classList.add('visible');
}
```

### Pattern 4: Loading State Management
**What:** Disable submit button and show loading indicator during submission
**When to use:** Prevent double-submission and provide user feedback
**Example:**
```javascript
function setLoading(button, isLoading) {
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Sending...' : 'Submit Quote Request';
    button.setAttribute('aria-busy', isLoading);
}
```

### Anti-Patterns to Avoid
- **Alert() for errors:** Disrupts user flow, not accessible. Use inline messages instead.
- **Validating only on submit:** Frustrating UX. Validate on blur for required fields.
- **Hiding errors after timeout:** User might not see them. Keep visible until corrected.
- **Generic error messages:** "Error" is useless. Be specific: "Email address is required."

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form backend | Node/PHP server | Formspree | Hosting, email delivery, spam protection included |
| Email validation regex | Custom regex | HTML5 type="email" | Browser-native, maintained, accessible |
| File type checking | Custom checks | accept attribute + JS validation | Simpler, reliable |
| Spam prevention | CAPTCHA | Formspree honeypot + _gotcha | Non-intrusive, no user friction |
| Form serialization | Manual JSON building | FormData API | Handles files, encoding, edge cases |

**Key insight:** The browser and Formspree together handle 90% of form complexity. Custom code should only fill gaps.

## Common Pitfalls

### Pitfall 1: Missing Accept Header
**What goes wrong:** Formspree returns HTML redirect page instead of JSON
**Why it happens:** Default form behavior without header returns thank-you page
**How to avoid:** Always include `headers: { 'Accept': 'application/json' }` in fetch
**Warning signs:** Response is HTML text, not parseable JSON

### Pitfall 2: setCustomValidity Not Cleared
**What goes wrong:** Field stays invalid even after user corrects input
**Why it happens:** setCustomValidity('message') marks field invalid permanently until cleared
**How to avoid:** Always call setCustomValidity('') first when validating
**Warning signs:** Valid-looking input still shows as invalid

### Pitfall 3: Error Container Not in DOM on Load
**What goes wrong:** Screen readers don't announce dynamic errors
**Why it happens:** ARIA live regions must exist in DOM before content changes
**How to avoid:** Include empty error container in initial HTML markup
**Warning signs:** Sighted users see errors but screen reader users don't hear them

### Pitfall 4: File Upload Without enctype
**What goes wrong:** Files not transmitted, server receives empty file data
**Why it happens:** Default form encoding doesn't support binary data
**How to avoid:** Always use `enctype="multipart/form-data"` on forms with file inputs
**Warning signs:** Form submits but files are missing in Formspree dashboard

### Pitfall 5: Double Submission
**What goes wrong:** User clicks submit multiple times, form sent repeatedly
**Why it happens:** No loading state, button not disabled during submission
**How to avoid:** Disable button immediately on submit, re-enable only on error
**Warning signs:** Duplicate emails, multiple submissions in dashboard

### Pitfall 6: Validation Timing Too Aggressive
**What goes wrong:** Errors shown before user finishes typing
**Why it happens:** Validating on every keystroke (input event)
**How to avoid:** Validate on blur for initial feedback, then on input after first error
**Warning signs:** User complaints about "nagging" validation

## Code Examples

Verified patterns from official sources:

### Formspree Form Setup
```html
<!-- Source: Formspree documentation -->
<form id="quoteForm"
      action="https://formspree.io/f/{YOUR_FORM_ID}"
      method="POST"
      enctype="multipart/form-data">

    <!-- Honeypot spam protection -->
    <input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">

    <!-- Reply-to field (use customer email) -->
    <input type="hidden" name="_replyto" id="replyto">

    <!-- Email subject line -->
    <input type="hidden" name="_subject" value="New Quote Request - SJ Electrical">

    <!-- Form fields here -->
</form>
```

### Complete AJAX Submission Handler
```javascript
// Source: Formspree AJAX documentation + best practices
const form = document.getElementById('quoteForm');
const submitBtn = document.getElementById('submitBtn');
const formSuccess = document.getElementById('formSuccess');
const errorContainer = document.getElementById('form-errors');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    // Clear previous errors
    clearErrors();

    // Validate before submission
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    // Set loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';
    submitBtn.setAttribute('aria-busy', 'true');

    try {
        const formData = new FormData(form);

        // Set reply-to from email field
        const email = form.querySelector('#email').value;
        formData.set('_replyto', email);

        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Success
            form.style.display = 'none';
            formSuccess.classList.add('show');
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            const data = await response.json();
            if (data.errors) {
                showError(data.errors.map(e => e.message).join('. '));
            } else {
                showError('Something went wrong. Please try again or call us directly.');
            }
            resetButton();
        }
    } catch (error) {
        showError('Network error. Please check your connection and try again.');
        resetButton();
    }

    function resetButton() {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        submitBtn.setAttribute('aria-busy', 'false');
    }
});
```

### Accessible Error Display
```javascript
// Source: W3C WCAG techniques
function showError(message) {
    const errorContainer = document.getElementById('form-errors');
    errorContainer.textContent = message;
    errorContainer.classList.add('visible');
    // Focus error for keyboard users
    errorContainer.setAttribute('tabindex', '-1');
    errorContainer.focus();
}

function clearErrors() {
    const errorContainer = document.getElementById('form-errors');
    errorContainer.textContent = '';
    errorContainer.classList.remove('visible');
}
```

### Field Validation with Custom Messages
```javascript
// Source: MDN Constraint Validation API
function setupFieldValidation(form) {
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
        // Validate on blur (first interaction)
        field.addEventListener('blur', function() {
            validateField(this);
        });

        // Re-validate on input after error shown
        field.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    // Clear custom validity first
    field.setCustomValidity('');

    const errorSpan = field.parentElement.querySelector('.field-error');

    if (!field.validity.valid) {
        let message = '';

        if (field.validity.valueMissing) {
            message = getRequiredMessage(field);
        } else if (field.validity.typeMismatch) {
            message = getTypeMismatchMessage(field);
        } else if (field.validity.patternMismatch) {
            message = field.title || 'Please match the requested format';
        }

        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');

        if (errorSpan) {
            errorSpan.textContent = message;
            field.setAttribute('aria-describedby', errorSpan.id);
        }

        return false;
    } else {
        field.classList.remove('error');
        field.removeAttribute('aria-invalid');

        if (errorSpan) {
            errorSpan.textContent = '';
        }

        return true;
    }
}

function getRequiredMessage(field) {
    const label = field.previousElementSibling?.textContent?.replace(' *', '') || 'This field';
    return `${label} is required`;
}

function getTypeMismatchMessage(field) {
    if (field.type === 'email') {
        return 'Please enter a valid email address';
    }
    return 'Please enter a valid value';
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| jQuery validation plugins | Native Constraint Validation API | 2015+ | No dependencies needed |
| Server-side only validation | Client + server validation | N/A | Better UX, server still required |
| alert() for errors | Inline error messages with ARIA | 2010s | Accessible, non-disruptive |
| Custom form backends | Formspree/Netlify Forms | 2015+ | Zero-config for static sites |
| reCAPTCHA for all forms | Honeypot + ML spam detection | 2020+ | Better UX, no user interaction |

**Deprecated/outdated:**
- XMLHttpRequest: Use Fetch API instead (cleaner, Promise-based)
- jQuery form plugins: Native APIs are sufficient for this use case
- Custom email regex: HTML5 type="email" handles this better

## Open Questions

Things that couldn't be fully resolved:

1. **Formspree free tier limits**
   - What we know: 50 submissions/month on free tier
   - What's unclear: Whether file uploads count differently
   - Recommendation: Monitor usage, upgrade if needed. Current form traffic likely under 50/month.

2. **Photo upload with Formspree**
   - What we know: Formspree supports file uploads with enctype="multipart/form-data"
   - What's unclear: Exact file size limits, max files per submission
   - Recommendation: Keep existing 5-file/5MB limits as reasonable defaults

3. **Existing Web3Forms implementation**
   - What we know: Current code uses Web3Forms API
   - What's unclear: Whether there's an existing Web3Forms account
   - Recommendation: Create new Formspree form, update endpoint. Web3Forms code can be adapted.

## Sources

### Primary (HIGH confidence)
- [Formspree AJAX Documentation](https://help.formspree.io/hc/en-us/articles/360013470814-Submit-forms-with-JavaScript-AJAX) - Core AJAX submission pattern
- [Formspree Special Fields](https://help.formspree.io/hc/en-us/articles/360062302854-Special-Fields) - _gotcha, _replyto, _subject fields
- [MDN Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation) - Native form validation
- [W3C ARIA19 Live Regions](https://www.w3.org/TR/WCAG20-TECHS/ARIA19.html) - Accessible error announcements
- [Cloudflare Formspree Tutorial](https://developers.cloudflare.com/pages/tutorials/add-an-html-form-with-formspree/) - Setup and integration

### Secondary (MEDIUM confidence)
- [Formspree File Uploads](https://help.formspree.io/hc/en-us/articles/115008380088-File-uploads) - File upload support
- [Formspree Honeypot Spam Filtering](https://help.formspree.io/hc/en-us/articles/360013580813-Honeypot-spam-filtering) - Spam prevention

### Tertiary (LOW confidence)
- Various blog posts on form validation patterns - General patterns verified with official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Formspree and native APIs are well-documented
- Architecture: HIGH - Patterns verified with MDN and W3C sources
- Pitfalls: HIGH - Common issues documented across multiple authoritative sources

**Research date:** 2026-01-21
**Valid until:** 2026-02-21 (Formspree API is stable, patterns are mature)

---

## Implementation Notes for Planner

### Existing Code Analysis
The current `quote-form.js` already implements:
- Drag-and-drop file upload
- Image preview with removal
- Loading state on submit
- Basic field validation on blur
- Success message display

**Changes needed:**
1. Replace Web3Forms endpoint with Formspree endpoint
2. Add `_gotcha` honeypot field
3. Add `_replyto` hidden field
4. Update error handling for Formspree response format
5. Add accessible error container with ARIA live region
6. Enhance validation with better error messages

### Form Structure (Existing)
The form already has:
- All required fields (name, phone, email, postcode, service, description)
- Photo upload zone
- Success message container (#formSuccess)
- Submit button (#submitBtn)

**Required attributes to add/update:**
- Change `action` from Web3Forms to Formspree endpoint
- Add honeypot input
- Add error container with role="alert"

### CSS Considerations
Existing CSS has:
- `.form-success` styles (show class toggles display)
- `.form-control` styling
- Error state uses inline border-color change

**CSS to add:**
- Error message text styles (red, small)
- Error container for submission failures
- `.error` class styling for invalid fields
