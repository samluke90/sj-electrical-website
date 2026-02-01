---
created: 2026-02-01T22:18
title: Audit logo and branding changes
area: ui
files:
  - assets/images/logo-horizontal.png
  - assets/images/logo-white.png
  - assets/images/logo-stacked.png
  - assets/images/logo-icon.png
  - assets/images/niceic-badge.jpg
  - index.html:29-31
  - about.html:29-31
  - contact.html:29-31
  - services.html:29-31
  - quote.html:29-31
  - css/styles.css:240-262
---

## Problem

Logo and branding assets were updated across the website. Need to audit changes to ensure:
- All 5 HTML pages have consistent header and footer logos
- Logo images display correctly at different screen sizes
- NICEIC badge appears properly in footer on all pages
- White logo variant has sufficient contrast on dark footer background

## Solution

Review changes made:
1. Header: Replaced SVG icon + text with `logo-horizontal.png` (horizontal Canva logo)
2. Footer: Replaced SVG logo with `logo-white.png` (white variant) + added NICEIC badge
3. CSS: Added `.logo-img`, `.footer-logo-img`, `.accreditation-badges`, `.niceic-badge` styles
4. Assets: Copied 5 image files from Downloads to `assets/images/`

Manual testing needed:
- Visual inspection on desktop/tablet/mobile
- Verify logo sizing and positioning
- Check NICEIC badge visibility and spacing
