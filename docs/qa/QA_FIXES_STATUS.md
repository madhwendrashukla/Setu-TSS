# TSS Website QA Fixes Status

This document tracks the current status of all issues flagged in the July 2026 QA Security & UI audit.

## ✅ Fixed and Tested
These issues have been fully resolved in the codebase and successfully verified via local build and API stress testing.

### Backend Security
- **BUG #1:** `Multer` out-of-boundary exceptions leaking Node stack traces. 
  - *Fix:* Added `multer` exception wrapper and global Express error boundary. Tested via `curl` with 25KB string (returns safe `400 Bad Request`).
- **BUG #2:** Helpdesk POST fields missing string truncation limits.
  - *Fix:* Enforced a maximum of 20 fields and a 20KB buffer limit per field.
- **BUG #3:** Application termination on malformed API requests.
  - *Fix:* Added `(err, req, res, next)` global error handler in `server.js` to catch all fatal crashes.
- **BUG #4:** Payload saturation from oversized attachments.
  - *Fix:* Added `limits: { fileSize: 5 * 1024 * 1024 }` to the upload middleware.
- **BUG #6:** Form data input validation exposing XSS vectors in `/api/leads`.
  - *Fix:* Hand-rolled HTML/script tag sanitization and exact DB schema length truncation.

### Frontend Security
- **BUG #7:** Admin routes serving 200 OK SPA shells to unauthenticated users.
  - *Fix:* Added Next.js Edge `middleware.ts` to block `/admin/*` via HTTP cookies.
- **BUG #8:** Missing essential CSP/XSS headers.
  - *Fix:* Patched `next.config.ts` to include strict `Content-Security-Policy`, `X-Content-Type-Options`, and `Permissions-Policy`.

### UI & Layout
- **BUG #9:** Hero text overlapping/concatenation ("THE BRIDGEThe 0").
  - *Fix:* Added precise spacing and `<br/>` tags to `AutomatedVideoPromo.tsx`.
- **BUG #10:** Database string overflow on MentorCTA inputs.
  - *Fix:* Added `maxLength` properties to all inputs (Name: 100, Email: 200, Phone: 15, Bio: 1000).
- **BUG #11:** Unclickable dummy "Smile" emoji in helpdesk bot.
  - *Fix:* Developed a functional state-driven emoji picker tray in `DirectoryAdvisorBot.tsx`.
- **BUG #12:** Mobile view right-padding getting clipped in Gallery grid.
  - *Fix:* Moved the `px-6` constraints directly into the scroll container alongside an ARIA-hidden spacer in `Gallery.tsx`.
- **BUG #13:** Testimonial navigation arrows dropping off-screen on phones.
  - *Fix:* Forced header into column layout on mobile and added `shrink-0` to the button container.
- **BUG #14:** Hamburger menu missing screen-reader ARIA tags.
  - *Fix:* Added dynamic `aria-label` and `aria-expanded` attributes to `Navbar.tsx`.

---

## 🟡 Fixed and Need Testing (Staging/Production)
These issues are resolved in the codebase but should be verified by the QA team on the live staging environment.
- **Edge Middleware Session Auth**: Ensure the `/admin` login and logout flows successfully write and clear the Edge cookie across all major browsers (Safari, Chrome, Firefox) without caching loops.
- **File Upload Limits**: Ensure legitimate user uploads (like standard PDFs under 5MB) on the Helpdesk widget still work perfectly via production S3/Multer links.

---

## 🔴 Open for Fix (Manual Admin Action Required)
These issues are data-driven and cannot be resolved purely via source code. The administrative team must log into the dashboard to fix them.
- **Debug Toast Alert**: A "THIS IS TITLE / YES" alert renders on page load. A stale widget entry exists in the database.
  - *Action:* Go to `/admin/chat-widgets` and delete the debug row.
- **Dummy Testimonial Data**: The Rickroll embed (`dQw4w9WgXcQ`) and "jghgf" placeholder text are active in the database.
  - *Action:* Go to `/admin/testimonials` and delete the placeholder rows.

---

## 🚫 Not Applicable
- **BUG #5 (Admin self-deletion guard)**: QA noted that the admin can delete the only remaining admin account. The `thestartupschool-dev` backend has no `DELETE /api/admin/users` route. *This vulnerability belongs to the Monarch LMS codebase, which handles the core user identity management.*
