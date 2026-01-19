# Phase 1: UX Cleanup - Context

**Gathered:** 2025-01-19
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove the spark cursor effect and optimize the lightbulb loading animation to show only on first site visit per session. Site interactions should feel professional and non-intrusive.

</domain>

<decisions>
## Implementation Decisions

### Spark cursor removal
- Delete the spark/particle cursor effect entirely
- Revert to standard browser cursor
- No replacement effect needed

### First visit detection
- Animation shows once per browser session
- Shared across tabs — if user opens new tab in same session, no animation
- Resets only when browser is fully closed and reopened
- Use storage mechanism that persists across tabs but clears on browser close

### Animation timing
- Speed up the lightbulb animation to 1-2 seconds (quick flash)
- Simplify the visual style to match the new minimalist aesthetic
- Brief visual flourish, then immediately show content

### Claude's Discretion
- Exact storage implementation (localStorage with session tracking vs other approaches)
- Specific animation easing and transitions
- How to simplify the lightbulb visual while keeping it recognizable

</decisions>

<specifics>
## Specific Ideas

- Animation should be a "quick flash" — noticeable but not lingering
- Minimalist aesthetic should carry through to the animation (simpler, cleaner)

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-ux-cleanup*
*Context gathered: 2025-01-19*
