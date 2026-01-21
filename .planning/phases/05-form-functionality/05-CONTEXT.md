# Phase 5: Form Functionality - Context

**Gathered:** 2026-01-21
**Status:** Ready for planning

<domain>
## Phase Boundary

Users can submit the quote form and receive confirmation of their request. Form submits to Formspree, which delivers to info@sjec.uk. Form HTML already exists from v1.0.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User delegated all implementation choices. Claude will use these sensible defaults:

**Success feedback:**
- Replace form with success message after submission
- Keep user on same page (no redirect)
- Clear confirmation: "Thanks! We'll be in touch within 24 hours."

**Error handling:**
- Inline validation errors under fields (red text, clear message)
- Submission failures show banner/toast above form
- User can retry immediately after failure

**Loading state:**
- Disable submit button during submission
- Button text changes to "Sending..." while in progress
- No spinner needed (form is simple, submission is fast)

**Form validation:**
- Required fields: name, email, message (minimum viable for quote request)
- Email format validation (basic pattern check)
- Phone optional, no format enforcement

</decisions>

<specifics>
## Specific Ideas

No specific requirements — standard form submission patterns apply.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 05-form-functionality*
*Context gathered: 2026-01-21*
