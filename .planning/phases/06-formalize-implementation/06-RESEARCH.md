# Phase 6: Formalize Implementation - Research

**Researched:** 2026-01-23
**Domain:** Manual verification testing, feature validation, and formal commit practices
**Confidence:** MEDIUM

## Summary

This research covers verification and formalization of existing quote form enhancements (WhatsApp handoff, voice recording, symptom checker) implemented in Phase 5. The phase focuses on manual testing verification rather than implementation, as features are already built. This is a "formalization" phase that confirms existing work meets requirements before committing.

Key findings:
- Manual testing remains essential for verifying UI/UX features that automated tests miss
- Happy path testing should be prioritized for Phase 6, with edge cases deferred to Phase 7
- Form validation testing follows established checklists (required fields, email format, file uploads)
- MediaRecorder API has 75% browser compatibility score (full support in modern Chrome, Firefox, Safari)
- WhatsApp links use `https://wa.me/<phone>?text=<message>` format with URL encoding
- n8n webhooks provide test/production URLs with 120-second test event listening
- Conventional Commits provide standard format for verification/feature commits

**Primary recommendation:** Follow manual testing best practices with happy path focus, verify each requirement individually in Firefox, document findings, and commit with descriptive conventional commit messages. Trust Phase 5 implementation for webhook delivery; optional to verify n8n receives data.

## Standard Stack

The established tools for manual verification testing:

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Browser DevTools | Native | Inspect network, console, elements | Built-in debugging for all browsers |
| Manual Testing Checklist | N/A | Systematic verification | Industry standard for web form testing |
| Firefox Developer Edition | Latest | Primary test browser | User's daily browser, good DevTools |
| n8n Test Webhook | Built-in | Webhook verification (optional) | 120s test event listener for debugging |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| Browser Console | Native | Log errors, MediaRecorder state | Voice recording debugging |
| Network Tab | Native | Monitor fetch requests | Form submission verification |
| Application Tab | Native | Inspect localStorage, IndexedDB | Not needed for Phase 6 |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Manual Testing | Cypress E2E | No test infrastructure exists, Phase 6 is verification not implementation |
| Firefox | Chrome | User specified Firefox as daily browser |
| DevTools Network | Webhook testing tools | DevTools sufficient for happy path |

**Installation:**
No installation needed - using browser-native tools and manual testing.

## Architecture Patterns

### Recommended Testing Structure
```
Manual Testing Workflow:
1. Load quote.html in Firefox
2. Test each requirement individually
3. Document pass/fail for each
4. Commit verified features
```

### Pattern 1: Happy Path Testing (Phase 6 Focus)

**What:** Test the ideal, error-free user journey where everything works as expected
**When to use:** Phase 6 verification (edge cases deferred to Phase 7)
**Priority:** HIGH - "Happy path testing takes precedence because it has the most immediate impact on user satisfaction and system stability"

**Example Test Flow:**
```
FORM-01 (WhatsApp Handoff):
1. Fill out form with valid data (name, email, phone, postcode, service, description)
2. Click "Send via WhatsApp" button
3. Verify: WhatsApp opens with pre-filled message
4. Verify: Message contains service + description (not full form summary)
5. Verify: Message format matches context decisions

FORM-02 (Voice Recording):
1. Click "Record" button
2. Allow microphone permission (first time)
3. Speak for 5-10 seconds
4. Click "Stop" button
5. Verify: Audio playback appears
6. Verify: Timer shows correct duration
7. Verify: Can play back recording
8. Verify: Can delete and re-record

FORM-03/04/05 (Symptom Checker):
1. Select service (Fault Finding, Rewiring, or Consumer Unit)
2. Verify: Diagnostic questions appear
3. Answer optional questions
4. Verify: Questions are not required
5. Verify: Can submit form without answering
```

### Pattern 2: Field Validation Testing

**What:** Verify required fields, email format, and data integrity
**When to use:** Standard form validation verification
**Example:**
```javascript
// Test required fields
1. Leave name field empty
2. Click submit
3. Verify: Browser shows "Please fill out this field" message

// Test email validation
1. Enter "invalid-email" in email field
2. Click submit
3. Verify: Browser shows "Please include an '@' in the email address"

// Test contact preferences checkboxes
1. Check multiple contact methods
2. Submit form (or check Network tab for FormData)
3. Verify: All checked values included (Phase 5 fixed this)
```

### Pattern 3: MediaRecorder API Verification

**What:** Verify voice recording works in Firefox with proper permissions
**When to use:** FORM-02 requirement testing
**Example:**
```javascript
// Check browser support (already implemented in code)
if (!navigator.mediaDevices?.getUserMedia) {
    // Voice section hidden - expected behavior
}

// Happy path test
1. Click Record → permission prompt appears
2. Allow microphone → recording starts
3. Timer counts up, visual feedback shows
4. Stop recording → audio playback appears
5. Play audio → can hear recording

// 60-second limit behavior (discretionary implementation)
1. Record for 60+ seconds
2. Verify: Auto-stops at 60 seconds OR shows warning
   (Implementation choice per context)
```

### Pattern 4: WhatsApp URL Building

**What:** Verify WhatsApp link format and message encoding
**When to use:** FORM-01 requirement verification
**Format:** `https://wa.me/447875210678?text=<encoded_message>`

**Example Verification:**
```javascript
// In browser console, inspect the URL that opens:
const url = 'https://wa.me/447875210678?text=*Quote%20Request*%0A%0A...'

// Verify:
// 1. Phone number: 447875210678 (no + or spaces)
// 2. Message URL-encoded (%20 for spaces, %0A for newlines)
// 3. Contains: Selected service + user description
// 4. If voice recorded: Mentions "I've also recorded a voice message"
// 5. Does NOT contain: Full form field summary
```

### Pattern 5: Network Request Verification (Optional)

**What:** Monitor fetch request to n8n webhook
**When to use:** Optional verification that data reaches n8n (trust Phase 5 if skipped)
**Example:**
```
1. Open Firefox DevTools → Network tab
2. Fill form completely
3. Click Submit
4. In Network tab, find POST request to n8n webhook
5. Verify: Status 200 OK
6. Verify: FormData includes all fields

Optional: Use n8n "Listen for test event" (120s window)
1. In n8n, click "Listen for test event" on webhook node
2. Within 120 seconds, submit form
3. Verify: n8n shows received data with all fields
```

### Anti-Patterns to Avoid

- **Edge case testing in Phase 6:** User explicitly deferred to Phase 7 (cross-browser, error handling)
- **Automated test setup:** No test infrastructure exists, Phase 6 is manual verification only
- **Comprehensive webhook verification:** Optional - can trust Phase 5 implementation
- **Testing multiple browsers:** User specified Firefox only for Phase 6
- **Testing microphone denial:** Edge case handling deferred to Phase 7

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Form validation | Custom regex validators | Browser Constraint Validation API | Already implemented in Phase 5, HTML5 native |
| Voice recording | Custom audio capture | MediaRecorder API | Already implemented in Phase 5 |
| WhatsApp link | Manual string building | URL encoding + wa.me format | Already implemented in Phase 5 |
| Error display | console.log only | showError() with ARIA | Already implemented in Phase 5 |
| Test documentation | Mental notes | Written checklist | Manual testing requires documentation |

**Key insight:** Phase 6 is verification only - all features already implemented. Don't rebuild or refactor; just verify and commit.

## Common Pitfalls

### Pitfall 1: Scope Creep into Implementation

**What goes wrong:** Phase 6 verification uncovers bugs or missing features, tempting implementation
**Why it happens:** Verification naturally exposes issues
**How to avoid:** Document issues for Phase 7, stay focused on verifying existing implementation
**Warning signs:** Editing js/quote-form.js or quote.html during Phase 6

### Pitfall 2: Over-Testing in Phase 6

**What goes wrong:** Testing edge cases, multiple browsers, error handling (Phase 7 scope)
**Why it happens:** Thorough testing feels responsible
**How to avoid:** Happy path only for Phase 6 per context decisions
**Warning signs:** Testing microphone denial, network failures, Safari, mobile

### Pitfall 3: Forgetting URL Encoding in WhatsApp

**What goes wrong:** WhatsApp message displays with literal %20, %0A instead of spaces/newlines
**Why it happens:** Not using encodeURIComponent() in buildWhatsAppMessage()
**How to avoid:** Verify already implemented in Phase 5 code (line 280: encodeURIComponent)
**Warning signs:** WhatsApp message shows "%20" instead of spaces

### Pitfall 4: MediaRecorder MIME Type Compatibility

**What goes wrong:** Recording works in Chrome but fails in Firefox due to MIME type
**Why it happens:** Browsers support different codecs (Chrome: WebM/VP9, Firefox: WebM/VP8, Safari: MP4)
**How to avoid:** Code already uses default (audio/webm) without specifying codec
**Warning signs:** Recording fails silently, mediaRecorder.state never changes

### Pitfall 5: n8n Webhook Test Window Timeout

**What goes wrong:** Webhook verification fails because test event listener expired
**Why it happens:** n8n "Listen for test event" only active for 120 seconds
**How to avoid:** Click listener, then immediately submit form (or skip webhook verification)
**Warning signs:** n8n shows "Waiting for test event" with no data received

### Pitfall 6: Checkbox Value Collection

**What goes wrong:** Contact preferences send "[object HTMLInputElement]" instead of values
**Why it happens:** FormData doesn't auto-collect multiple checkboxes with same name
**How to avoid:** Phase 5 already fixed this (lines 169-174 in quote-form.js)
**Warning signs:** n8n receives contact_method: "Phone, Email" (correct) or "undefined" (broken)

### Pitfall 7: Committing Without Testing

**What goes wrong:** Features committed based on code review, not actual verification
**Why it happens:** Code looks correct, testing feels redundant
**How to avoid:** Phase 6's purpose is verification - test before commit
**Warning signs:** Skipping browser testing, assuming Phase 5 work is correct

## Code Examples

Verified patterns from existing implementation (Phase 5):

### WhatsApp Message Building (Already Implemented)
```javascript
// Source: /quote-form.js lines 285-313
function buildWhatsAppMessage() {
    const name = document.getElementById('name')?.value || '';
    const service = document.getElementById('service')?.value || '';
    const description = document.getElementById('description')?.value || '';

    // Collect symptom answers
    const symptomDetails = collectSymptomAnswers();

    let message = `*Quote Request*\n\n`;
    message += `Name: ${name}\n`;
    message += `Service: ${service}\n`;

    if (symptomDetails) {
        message += `\n${symptomDetails}\n`;
    }

    message += `\nDescription:\n${description}\n`;

    // If voice recorded, mention it
    if (voiceBlob) {
        message += `\n(I've also recorded a voice message about this)\n`;
    }

    return message;
}

// WhatsApp button click handler (lines 276-282)
whatsappBtn.addEventListener('click', function(e) {
    e.preventDefault();
    const message = buildWhatsAppMessage();
    const phoneNumber = '447875210678';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
});
```

**Verification test:** Click WhatsApp button, check opened URL contains encoded message with service + description.

### Voice Recording (Already Implemented)
```javascript
// Source: /quote-form.js lines 352-415
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (e) => {
            audioChunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            voiceBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const audioUrl = URL.createObjectURL(voiceBlob);
            voiceAudio.src = audioUrl;
            voicePlayback.classList.add('visible');
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        // ... UI updates, timer, 60s auto-stop
    } catch (err) {
        showError('Microphone access denied...');
    }
}
```

**Verification test:** Click Record → allow mic → speak → stop → verify playback works.

### Symptom Checker (Already Implemented)
```javascript
// Source: /quote-form.js lines 420-535
const symptomQuestions = {
    'Domestic - Fault Finding': {
        title: 'Help us diagnose the issue',
        questions: [
            { id: 'fault_symptom', label: "What's happening?",
              options: ['Lights flickering', 'Tripping breaker', ...] },
            { id: 'fault_area', label: 'Affecting which area?',
              options: ['One room', 'Multiple rooms', ...] },
            // ... more questions
        ]
    },
    // ... Rewiring, Consumer Unit configs
};

serviceSelect.addEventListener('change', function() {
    showSymptomQuestions(this.value);
});
```

**Verification test:** Select "Domestic - Fault Finding" → questions appear → answer (optional) → submit form without answering → success.

### Contact Preferences Fix (Already Implemented)
```javascript
// Source: /quote-form.js lines 168-174
// Collect contact method checkboxes as comma-separated string
const contactMethods = [];
document.querySelectorAll('input[name="contact_method"]:checked').forEach(cb => {
    contactMethods.push(cb.value);
});
formData.delete('contact_method');
formData.append('contact_method', contactMethods.join(', ') || 'Not specified');
```

**Verification test:** Check Phone + Email → submit → n8n receives "Phone, Email" (not undefined).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Web3Forms webhook | n8n webhook | Phase 5 (v1.1) | More control over processing |
| Alert dialogs for errors | Accessible error container with ARIA | Phase 5 (v1.1) | Screen reader support |
| No voice input | MediaRecorder API | Phase 5 (v1.2 dev) | Voice message option |
| No WhatsApp option | wa.me click-to-chat | Phase 5 (v1.2 dev) | Alternative contact method |
| Generic form questions | Service-specific symptom checker | Phase 5 (v1.2 dev) | Better diagnostic info |
| Checkbox values broken | Manual collection & join | Phase 5 (v1.2 dev) | FORM-06 requirement |

**Deprecated/outdated:**
- Formspree: Originally planned, switched to n8n for more control (PROJECT.md shows decision)

## Open Questions

Things that couldn't be fully resolved:

1. **Webhook Verification Necessity**
   - What we know: n8n provides test event listener (120s window), network tab shows 200 OK
   - What's unclear: Is end-to-end verification required or can we trust Phase 5 implementation?
   - Recommendation: Context says "Claude's discretion on webhook verification" - optional for Phase 6, trust implementation unless issues found

2. **60-Second Recording Limit Behavior**
   - What we know: Code auto-stops at 60 seconds (line 380-382)
   - What's unclear: User context says "Claude's discretion on 60-second limit behavior"
   - Recommendation: Test that auto-stop works correctly; no warning needed per implementation

3. **Symptom Checker Trigger Timing**
   - What we know: Questions appear immediately when service selected (change event)
   - What's unclear: Context mentions "immediate vs expandable" trigger timing
   - Recommendation: Verify immediate trigger works; expandable deferred unless user requests

4. **Test Order and Dependencies**
   - What we know: Six requirements (FORM-01 through FORM-06)
   - What's unclear: Best order for testing (independent vs dependent tests)
   - Recommendation: Test in requirement order; WhatsApp/voice/symptom are independent

5. **Definition of "Verified"**
   - What we know: Manual testing in Firefox, happy path only
   - What's unclear: Pass criteria - single successful test or multiple iterations?
   - Recommendation: Single successful happy path test per requirement is sufficient for Phase 6

## Sources

### Primary (HIGH confidence)
- [MDN MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder) - Browser compatibility, API usage
- [Can I use: MediaRecorder](https://caniuse.com/mediarecorder) - 75% browser compatibility score, full support in modern browsers
- [Conventional Commits Specification](https://www.conventionalcommits.org/en/v1.0.0/) - Commit message format for verification/feature commits
- [WhatsApp Click to Chat Documentation](https://faq.whatsapp.com/425247423114725) - Official wa.me URL format
- [n8n Webhook Node Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/) - Test webhook usage, 120s listener window

### Secondary (MEDIUM confidence)
- [How to Create a WhatsApp Link Guide](https://www.activecampaign.com/blog/how-to-create-a-whatsapp-link-your-complete-guide) - URL encoding examples
- [MediaRecorder MIME Types List](https://www.tutorialpedia.org/blog/all-mime-types-supported-by-mediarecorder-in-firefox-and-chrome/) - Browser codec support
- [Happy Path Testing Guide](https://www.qable.io/blog/happy-path-testing) - Happy path vs edge case scope
- [Web Form Testing Checklist](https://www.qed42.com/insights/a-checklist-for-web-form-testing) - Manual testing best practices
- [Verification vs Validation Guide](https://www.accelq.com/blog/verification-vs-validation/) - Testing methodology

### Tertiary (LOW confidence)
- [Software Testing Strategies 2026](https://www.index.dev/blog/top-software-testing-strategies) - Manual vs automated testing balance
- [How to Test n8n Webhooks Locally](https://softwareengineeringstandard.com/2025/08/31/n8n-webhook-2/) - Tunneling for local testing (not needed for Phase 6)

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM - Manual testing well-documented, but no project-specific test framework
- Architecture: HIGH - Clear happy path focus per context, form testing is well-established domain
- Pitfalls: HIGH - Phase 5 code reviewed, common issues documented from research

**Research date:** 2026-01-23
**Valid until:** ~30 days (manual testing practices stable, MediaRecorder API stable)

**Phase-specific notes:**
- This is a verification phase, not implementation
- All features already exist in codebase from Phase 5
- Phase 7 handles cross-browser testing and edge cases
- User explicitly wants Firefox-only testing for Phase 6
- Happy path testing is sufficient per context decisions
