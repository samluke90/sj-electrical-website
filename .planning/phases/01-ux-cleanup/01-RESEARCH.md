# Phase 1: UX Cleanup - Research

**Researched:** 2025-01-19
**Domain:** Browser session detection, CSS animation optimization, JavaScript cleanup
**Confidence:** HIGH

## Summary

This phase involves three distinct tasks: removing the spark cursor effect, implementing cross-tab session detection for the loading animation, and simplifying/speeding up the lightbulb animation. The codebase is a vanilla JavaScript/CSS website with no frameworks.

The spark cursor implementation is contained entirely in `js/effects.js` (lines 198-358) with supporting CSS in `styles.css` (lines 1746-1842). Removal is straightforward deletion. The loading animation uses a combination approach: `sessionStorage` for per-tab state that automatically clears when browser closes, combined with `localStorage` + `BroadcastChannel` API for cross-tab synchronization. Animation simplification involves reducing keyframe complexity and shortening durations.

**Primary recommendation:** Use sessionStorage as the primary mechanism (auto-clears on browser close) with localStorage for cross-tab coordination, and BroadcastChannel for real-time sync when new tabs open.

## Standard Stack

This is a vanilla JavaScript project - no libraries needed.

### Core (Already in project)
| Technology | Version | Purpose | Notes |
|------------|---------|---------|-------|
| Vanilla JavaScript | ES6+ | All functionality | No framework dependencies |
| CSS3 | Current | Animations and styling | Native animations |

### Browser APIs to Use
| API | Purpose | Browser Support | Fallback |
|-----|---------|-----------------|----------|
| sessionStorage | Auto-clear on browser close | Universal | None needed |
| localStorage | Cross-tab persistence check | Universal | None needed |
| BroadcastChannel | Real-time cross-tab sync | Chrome, Firefox, Edge, Safari 15.4+ | localStorage `storage` event |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| sessionStorage + localStorage | Session cookies | Cookies would work but add HTTP overhead; storage APIs are simpler |
| BroadcastChannel | localStorage `storage` event only | Storage events are slightly slower, but work everywhere including older Safari |

## Architecture Patterns

### Current Code Organization
```
js/
├── main.js           # Core site functionality (mobile menu, scroll, etc.)
├── effects.js        # All visual effects (loader, light switch, spark cursor, voltage meter)
└── quote-form.js     # Quote form specific logic

css/
└── styles.css        # All styles including animation keyframes
```

### Pattern 1: Session Detection with Cross-Tab Sync
**What:** Check if animation has been shown this browser session, shared across all tabs
**When to use:** Any "show once per session" feature that should sync across tabs

```javascript
// Source: Research synthesis from MDN and best practices
function hasSeenAnimation() {
    // Check localStorage for cross-tab persistence within session
    return localStorage.getItem('sj_animation_shown') === 'true';
}

function markAnimationShown() {
    // Set in localStorage for cross-tab access
    localStorage.setItem('sj_animation_shown', 'true');

    // Broadcast to other tabs
    if (window.BroadcastChannel) {
        const channel = new BroadcastChannel('sj_session');
        channel.postMessage({ type: 'animation_shown' });
        channel.close();
    }
}

function clearAnimationOnNewSession() {
    // sessionStorage is unique per tab AND clears on browser close
    // If sessionStorage doesn't have our marker, this is a fresh browser session
    if (!sessionStorage.getItem('sj_session_active')) {
        // Fresh browser session - clear the localStorage flag
        localStorage.removeItem('sj_animation_shown');
        sessionStorage.setItem('sj_session_active', 'true');
    }
}
```

### Pattern 2: Code Removal (Spark Cursor)
**What:** Complete removal of a feature with cleanup
**When to use:** Removing deprecated or unwanted features

Steps:
1. Remove JavaScript initialization call
2. Remove JavaScript functions
3. Remove CSS styles
4. Remove dynamically injected CSS (the `sparkStyle` element)

### Anti-Patterns to Avoid
- **Using only sessionStorage for cross-tab sync:** sessionStorage is tab-isolated; tabs cannot share data directly
- **Relying on `beforeunload` to clear localStorage:** Unreliable, especially on mobile
- **Using cookies for session state:** Unnecessary HTTP overhead for client-side-only state

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cross-tab communication | Custom polling or window references | BroadcastChannel API | Native, efficient, purpose-built |
| Session expiry detection | Timer-based checking | sessionStorage existence check | sessionStorage auto-clears on browser close |
| Animation timing | setTimeout chains | CSS animation with proper duration | More reliable, GPU-accelerated |

**Key insight:** The browser already provides sessionStorage (clears on browser close) and BroadcastChannel (cross-tab messaging) - no custom session management needed.

## Common Pitfalls

### Pitfall 1: sessionStorage Tab Isolation
**What goes wrong:** Assuming sessionStorage shares between tabs like localStorage does
**Why it happens:** Both are "storage" APIs with similar syntax, easy to confuse
**How to avoid:** Use sessionStorage only for "is this a new browser session?" detection; use localStorage for actual cross-tab state
**Warning signs:** Animation shows on every new tab even in same session

### Pitfall 2: BroadcastChannel Safari Quirks
**What goes wrong:** BroadcastChannel doesn't work in Safari private browsing
**Why it happens:** Safari restricts this API in private mode
**How to avoid:** Always check `window.BroadcastChannel` exists AND have a fallback (localStorage `storage` event)
**Warning signs:** Cross-tab sync works in Chrome but not Safari private mode

### Pitfall 3: Race Condition on Page Load
**What goes wrong:** Animation starts before session check completes
**Why it happens:** Loading animation is initialized before DOMContentLoaded
**How to avoid:** Session check must happen synchronously at the very start of initPageLoader()
**Warning signs:** Brief flash of animation before it's hidden

### Pitfall 4: Forgetting to Remove Event Listeners
**What goes wrong:** Memory leaks from orphaned mousemove/click handlers
**Why it happens:** Deleting function but not the addEventListener calls that reference it
**How to avoid:** Remove all event listener registrations when removing spark cursor
**Warning signs:** Console errors about undefined functions

### Pitfall 5: Animation Duration Mismatch
**What goes wrong:** JavaScript timers don't match CSS animation duration
**Why it happens:** Changing CSS duration without updating corresponding setTimeout values
**How to avoid:** Define duration once as a constant, use in both JS timers and CSS
**Warning signs:** Animation cuts off abruptly or loader hides before animation completes

## Code Examples

### Current Spark Cursor Code Location (TO BE REMOVED)

**JavaScript in `js/effects.js` (lines 198-358):**
- `initSparkCursor()` - Main initialization with event listeners
- `createSpark(x, y)` - Creates spark on mouse move
- `createSparkBurst(x, y)` - Creates burst on click (KEEP - used by light switch)
- `createElectricArc(x, y)` - Creates arc on click
- Dynamic CSS injection at end of file

**CSS in `css/styles.css` (lines 1746-1842):**
- `.spark` and `.spark-particle` classes
- `.electric-arc` and `.arc-line` classes
- `@keyframes sparkFade`, `sparkMove1-5`, `arcBurst`

### Current Loading Animation Code Location (TO BE MODIFIED)

**JavaScript in `js/effects.js` (lines 18-107):**
- `initPageLoader()` - Creates loader HTML, manages timing
- `playPowerOnSound()` - Audio feedback

**CSS in `css/styles.css` (lines 1844-2075):**
- `.page-loader` - Full-screen overlay
- `.lightbulb`, `.bulb-glass`, `.bulb-glow`, etc. - Lightbulb structure
- `@keyframes bulbFlicker`, `filamentFlicker`, `textPulse`

### Session Detection Implementation

```javascript
// Source: Synthesized from MDN sessionStorage/localStorage docs and BroadcastChannel API
// Place at very start of effects.js, before initPageLoader call

(function() {
    // IMMEDIATELY check if this is a new browser session
    // sessionStorage is empty when browser was fully closed and reopened
    if (!sessionStorage.getItem('sj_session_active')) {
        // New browser session - clear any previous animation flag
        localStorage.removeItem('sj_animation_shown');
        sessionStorage.setItem('sj_session_active', 'true');
    }
})();

function shouldShowAnimation() {
    return localStorage.getItem('sj_animation_shown') !== 'true';
}

function markAnimationShown() {
    localStorage.setItem('sj_animation_shown', 'true');

    // Notify other tabs
    try {
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('sj_electrical_session');
            channel.postMessage({ type: 'animation_complete' });
            channel.close();
        }
    } catch (e) {
        // BroadcastChannel not available (e.g., Safari private mode)
    }
}

// Listen for other tabs completing the animation
function listenForAnimationComplete() {
    try {
        if (window.BroadcastChannel) {
            const channel = new BroadcastChannel('sj_electrical_session');
            channel.onmessage = (event) => {
                if (event.data.type === 'animation_complete') {
                    // Another tab showed the animation - hide ours if still showing
                    const loader = document.getElementById('pageLoader');
                    if (loader) {
                        loader.classList.add('loaded');
                        setTimeout(() => loader.remove(), 500);
                    }
                }
            };
        }
    } catch (e) {
        // Fallback: listen for localStorage changes
        window.addEventListener('storage', (event) => {
            if (event.key === 'sj_animation_shown' && event.newValue === 'true') {
                const loader = document.getElementById('pageLoader');
                if (loader) {
                    loader.classList.add('loaded');
                    setTimeout(() => loader.remove(), 500);
                }
            }
        });
    }
}
```

### Simplified Animation Timing (1-2 seconds total)

```javascript
// Source: Best practice synthesis
// Original timing: 100ms delay + 1500ms flicker + 300ms on + 500ms fade = 2400ms total
// New timing: 100ms delay + 600ms flicker + 200ms on + 300ms fade = 1200ms total

function initPageLoader() {
    if (!shouldShowAnimation()) return; // Skip if already shown this session
    if (document.readyState === 'complete') return;

    // ... create loader HTML (simplified version) ...

    setTimeout(() => {
        const bulb = document.getElementById('lightbulb');
        if (bulb) {
            bulb.classList.add('flickering');

            setTimeout(() => {
                bulb.classList.remove('flickering');
                bulb.classList.add('on');
                // Removed: playPowerOnSound() - minimalist aesthetic

                setTimeout(() => {
                    const pageLoader = document.getElementById('pageLoader');
                    if (pageLoader) {
                        pageLoader.classList.add('loaded');
                        markAnimationShown(); // Mark as shown for cross-tab sync
                        setTimeout(() => pageLoader.remove(), 300);
                    }
                }, 200); // Reduced from 300ms
            }, 600); // Reduced from 1500ms
        }
    }, 100);
}
```

### Simplified CSS Animation Keyframes

```css
/* Source: CSS performance optimization best practices */
/* Simplified flicker - fewer keyframe steps, shorter duration */
@keyframes bulbFlicker {
    0% { opacity: 0; }
    20% { opacity: 0.5; }
    40% { opacity: 0.2; }
    60% { opacity: 0.8; }
    80% { opacity: 0.4; }
    100% { opacity: 1; width: 100px; height: 100px; filter: blur(30px); }
}

/* Match duration in CSS */
.lightbulb.flickering .bulb-glow {
    animation: bulbFlicker 0.6s ease-in-out; /* Reduced from 1.5s */
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Session cookies | sessionStorage + localStorage | Established | Simpler, no server involvement |
| localStorage polling | BroadcastChannel API | March 2022 (Safari 15.4) | Real-time cross-tab sync |
| Complex flicker animations | Simple 2-3 step animations | 2024 trend | Faster, more professional feel |
| Elaborate loading screens | Quick "flash" loaders | 2024-2025 UX trend | Users expect instant responsiveness |

**Deprecated/outdated:**
- Long loading animations: Users expect sub-2-second page loads
- Sound effects on page load: Generally considered intrusive without user consent

## Open Questions

None - all implementation details are well-documented and straightforward.

## Sources

### Primary (HIGH confidence)
- [MDN: Window sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) - Session storage behavior and browser close handling
- [MDN: Broadcast Channel API](https://developer.mozilla.org/en-US/docs/Web/API/Broadcast_Channel_API) - Cross-tab communication
- [MDN: CSS Performance](https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Performance/CSS) - Animation optimization

### Secondary (MEDIUM confidence)
- [Chrome Developers: BroadcastChannel](https://developer.chrome.com/blog/broadcastchannel) - Usage patterns and examples
- [KeyCDN: Animation Performance](https://www.keycdn.com/blog/animation-performance) - Animation best practices

### Tertiary (LOW confidence)
- Various Medium/DEV.to articles on cross-tab sync patterns - Confirmed against official docs

## Metadata

**Confidence breakdown:**
- Spark cursor removal: HIGH - Direct code deletion, locations identified
- Session detection: HIGH - Well-documented browser APIs
- Animation simplification: HIGH - Standard CSS animation techniques
- Cross-tab sync: HIGH - BroadcastChannel well-supported, fallback available

**Research date:** 2025-01-19
**Valid until:** No expiration - browser APIs are stable

## Implementation Notes for Planner

### Files to Modify
1. `js/effects.js` - Main changes
2. `css/styles.css` - Animation CSS changes

### Functions to Remove (Spark Cursor)
- `initSparkCursor()` - lines 198-236
- `createSpark(x, y)` - lines 239-275
- `createElectricArc(x, y)` - lines 319-342
- Dynamic style injection - lines 345-358
- **KEEP**: `createSparkBurst(x, y)` - used by light switch toggle

### Functions to Modify (Loading Animation)
- `initPageLoader()` - Add session check, reduce timing
- Remove `playPowerOnSound()` - minimalist aesthetic

### CSS to Remove
Lines 1746-1842:
- `.spark`, `.spark-particle`
- `.electric-arc`, `.arc-line`
- `@keyframes sparkFade`, `sparkMove1-5`, `arcBurst`

### CSS to Modify
Lines 1986-2046:
- `@keyframes bulbFlicker` - Simplify to fewer steps, 0.6s duration
- `@keyframes filamentFlicker` - Simplify to match
- `.loader-text span` animation - Reduce or remove text pulse

### Testing Scenarios
1. First visit: Animation plays
2. Refresh same tab: No animation
3. New tab same session: No animation
4. Close browser, reopen: Animation plays
5. Open site in two tabs simultaneously: Only first tab shows animation
