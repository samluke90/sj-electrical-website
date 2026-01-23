# Requirements: SJ Electrical Contractors Website

**Defined:** 2026-01-22
**Core Value:** Potential customers can quickly understand what services are offered, trust the business (NICEIC certification), and easily get in touch for a quote.

## v1.2 Requirements

Requirements for Quote Form Enhancements milestone.

### Form Features

- [x] **FORM-01**: User can send quote request via WhatsApp with pre-filled message
- [x] **FORM-02**: User can record voice message describing electrical issue (60s max)
- [x] **FORM-03**: User sees guided diagnostic questions for Fault Finding service
- [x] **FORM-04**: User sees guided diagnostic questions for Rewiring service
- [x] **FORM-05**: User sees guided diagnostic questions for Consumer Unit service
- [x] **FORM-06**: Contact preferences reach n8n webhook correctly

### Testing

- [ ] **TEST-01**: Voice recording works in Chrome desktop
- [ ] **TEST-02**: Voice recording works in Firefox desktop
- [ ] **TEST-03**: Voice recording works in Safari desktop
- [ ] **TEST-04**: Voice recording works on mobile browsers (iOS Safari, Android Chrome)
- [ ] **TEST-05**: WhatsApp button opens correctly on desktop and mobile

### Polish

- [ ] **PLSH-01**: New components styled correctly in dark mode
- [ ] **PLSH-02**: New components styled correctly in light mode
- [ ] **PLSH-03**: Voice recorder responsive on mobile
- [ ] **PLSH-04**: Symptom checker responsive on mobile

### Edge Cases

- [ ] **EDGE-01**: Graceful handling when microphone permission denied
- [ ] **EDGE-02**: Voice section hidden if MediaRecorder not supported
- [ ] **EDGE-03**: Form submission works without voice recording
- [ ] **EDGE-04**: WhatsApp button works even if form fields empty

## Future Requirements

Deferred to v1.3+.

### Content

- **CONT-01**: Real customer testimonials replace placeholders
- **CONT-02**: Real social media links replace placeholders
- **CONT-03**: Project gallery with completed work photos

## Out of Scope

| Feature | Reason |
|---------|--------|
| Video message upload | High complexity, bandwidth costs — voice is sufficient |
| Real-time chat | Overkill for quote requests |
| SMS fallback for WhatsApp | WhatsApp coverage sufficient in UK |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FORM-01 | Phase 6 | Complete |
| FORM-02 | Phase 6 | Complete |
| FORM-03 | Phase 6 | Complete |
| FORM-04 | Phase 6 | Complete |
| FORM-05 | Phase 6 | Complete |
| FORM-06 | Phase 6 | Complete |
| TEST-01 | Phase 7 | Pending |
| TEST-02 | Phase 7 | Pending |
| TEST-03 | Phase 7 | Pending |
| TEST-04 | Phase 7 | Pending |
| TEST-05 | Phase 7 | Pending |
| PLSH-01 | Phase 7 | Pending |
| PLSH-02 | Phase 7 | Pending |
| PLSH-03 | Phase 7 | Pending |
| PLSH-04 | Phase 7 | Pending |
| EDGE-01 | Phase 7 | Pending |
| EDGE-02 | Phase 7 | Pending |
| EDGE-03 | Phase 7 | Pending |
| EDGE-04 | Phase 7 | Pending |

**Coverage:**
- v1.2 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-01-22*
*Last updated: 2026-01-23 after Phase 6 completion*
