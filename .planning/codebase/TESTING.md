# Testing Patterns

**Analysis Date:** 2025-01-19

## Test Framework

**Runner:**
- None configured
- No test files detected in codebase
- No test configuration files (jest.config.*, vitest.config.*, etc.)

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
# No test commands available
# This is a static website with no testing infrastructure
```

## Test File Organization

**Location:**
- No test files exist
- No `__tests__/`, `tests/`, or `spec/` directories

**Naming:**
- Not applicable (no tests)

**Structure:**
- Not applicable

## Test Structure

**Current State:**
This codebase has no automated testing. It is a static HTML/CSS/JavaScript website without a build system or test framework.

**Recommended Patterns (if testing is added):**

For a static site like this, consider:

1. **E2E Testing with Playwright or Cypress:**
```javascript
// Example: tests/e2e/quote-form.spec.js
describe('Quote Form', () => {
    beforeEach(() => {
        cy.visit('/quote.html');
    });

    it('should show validation errors for empty required fields', () => {
        cy.get('#submitBtn').click();
        cy.get('#name:invalid').should('exist');
    });

    it('should accept valid file uploads', () => {
        cy.get('#photoUpload').attachFile('test-image.jpg');
        cy.get('.preview-item').should('have.length', 1);
    });
});
```

2. **Visual Regression Testing:**
```javascript
// For testing dark mode, animations, responsive layouts
it('should match dark mode snapshot', () => {
    cy.get('.light-switch').click();
    cy.matchImageSnapshot('dark-mode-homepage');
});
```

## Mocking

**Framework:** Not applicable

**Patterns:**
Not applicable - no tests exist.

**What Would Need Mocking (if tests added):**
- `fetch()` calls to Web3Forms API
- `window.AudioContext` for sound effects
- `localStorage` for theme persistence
- `IntersectionObserver` for scroll animations
- `DataTransfer` API for file uploads

**Example Mock Pattern:**
```javascript
// Mocking fetch for form submission tests
beforeEach(() => {
    cy.intercept('POST', 'https://api.web3forms.com/submit', {
        statusCode: 200,
        body: { success: true }
    }).as('formSubmit');
});
```

## Fixtures and Factories

**Test Data:**
Not applicable - no tests exist.

**Recommended Fixtures (if testing added):**
```
tests/
  fixtures/
    test-image.jpg       # For file upload testing
    large-image.jpg      # For file size validation (>5MB)
    invalid-file.txt     # For file type validation
```

**Location:**
- No fixtures directory exists

## Coverage

**Requirements:** None enforced

**View Coverage:**
```bash
# No coverage tooling configured
```

**Current Coverage:** 0% (no tests)

## Test Types

**Unit Tests:**
- Not implemented
- Could test: `formatPhoneForTel()`, `validateInput()`, file validation logic

**Integration Tests:**
- Not implemented
- Could test: form submission flow, file upload with preview, theme toggle persistence

**E2E Tests:**
- Not implemented
- Could test: complete user journeys (quote submission, navigation, mobile menu)

**Visual Tests:**
- Not implemented
- Could test: responsive layouts, dark mode, animations

## Common Patterns

**Async Testing:**
Not applicable - no tests exist.

**Example Pattern (if implemented):**
```javascript
// Testing async form submission
it('should show success message after form submission', async () => {
    // Fill form
    cy.get('#name').type('John Smith');
    cy.get('#phone').type('07123456789');
    cy.get('#email').type('john@example.com');
    cy.get('#postcode').type('E4 8AG');
    cy.get('#service').select('Domestic - Rewiring');
    cy.get('#description').type('Need full house rewire');

    // Submit and wait
    cy.get('#submitBtn').click();
    cy.wait('@formSubmit');

    // Verify success
    cy.get('#formSuccess').should('be.visible');
    cy.get('#quoteForm').should('not.be.visible');
});
```

**Error Testing:**
Not applicable - no tests exist.

**Example Pattern (if implemented):**
```javascript
// Testing form submission error handling
it('should show error alert when submission fails', () => {
    cy.intercept('POST', 'https://api.web3forms.com/submit', {
        statusCode: 500,
        body: { success: false, message: 'Server error' }
    }).as('formSubmitError');

    // Fill and submit form...
    cy.get('#submitBtn').click();
    cy.wait('@formSubmitError');

    cy.on('window:alert', (text) => {
        expect(text).to.contain('error submitting');
    });
});
```

## Manual Testing Checklist

Since no automated tests exist, manual testing should cover:

**Functionality:**
- [ ] Mobile menu opens/closes correctly
- [ ] Smooth scroll works for anchor links
- [ ] Header shadow appears on scroll
- [ ] Scroll animations trigger on element visibility
- [ ] Quote form validates required fields
- [ ] File upload accepts valid images
- [ ] File upload rejects invalid files (wrong type, too large, >5 files)
- [ ] Image previews display correctly
- [ ] Image removal works
- [ ] Form submission sends to Web3Forms
- [ ] Success message displays after submission
- [ ] Dark mode toggle works
- [ ] Theme persists in localStorage
- [ ] Spark cursor effects display on mouse move/click
- [ ] Voltage meter updates as form fields are filled
- [ ] Page loader animation plays on initial load

**Cross-Browser:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

**Responsive:**
- [ ] Desktop (1200px+)
- [ ] Tablet (768px - 991px)
- [ ] Mobile (< 768px)

## Recommendations

To add testing to this project:

1. **Install Cypress for E2E testing:**
```bash
npm init -y
npm install --save-dev cypress
npx cypress open
```

2. **Create basic test structure:**
```
tests/
  e2e/
    navigation.cy.js
    quote-form.cy.js
    dark-mode.cy.js
  fixtures/
    test-image.jpg
```

3. **Add npm scripts:**
```json
{
  "scripts": {
    "test": "cypress run",
    "test:open": "cypress open",
    "serve": "npx serve ."
  }
}
```

4. **Configure Cypress:**
```javascript
// cypress.config.js
module.exports = {
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: false
  }
}
```

---

*Testing analysis: 2025-01-19*
