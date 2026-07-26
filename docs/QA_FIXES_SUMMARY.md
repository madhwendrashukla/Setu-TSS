# QA Fixes Summary

## Overview
This document summarizes the fixes implemented based on the QA team's requirements. These fixes ensure compliance with WCAG accessibility standards and improve the integrity of the data displayed on the platform.

## 1. Accessibility & Color Contrast (Workshop Landing Page)
- **Issue:** Lighthouse accessibility audit flagged failing elements due to insufficient color contrast ratio between the background and text elements on the Fundraising Workshop landing page (`/fundraising-workshop-15apr`). Dark text on a dark background rendered sub-header content nearly unreadable.
- **Fix:** Updated the CSS class on secondary text and subheadings (e.g., `.text-text-secondary`) to `text-slate-300` within the dark theme components of the workshop landing pages. This significantly improved the contrast ratio, making the text legible on the `#0f172a` slate background and achieving WCAG contrast compliance.

## 2. Dummy Data Cleanup (Testimonials)
- **Issue:** The site was displaying gibberish or test data in the Testimonials carousel (e.g., "jghgf", "sdfgh") and embedding placeholder YouTube videos (e.g., `dQw4w9WgXcQ`).
- **Fix:** 
  - Implemented a backend sanitization filter (`isGibberish`) on the `GET /api/homepage` endpoint.
  - The API now automatically filters out and hides text testimonials where the quote, author name, or designation consists of keyboard-smash/test data.
  - Hardcoded placeholder YouTube video IDs are explicitly filtered out, ensuring only valid, user-submitted video testimonials are rendered on the frontend.

## 3. Structural Cleanup
- **Action:** Consolidated unused, unlinked, and deprecated code files, scripts, and legacy documentation (such as PRD, TRD, and scratch files) into a dedicated `/trash` directory.
- **Result:** The primary workspace is now clean, well-organized into appropriate sub-folders (like `/docs`), and streamlined for further development.
