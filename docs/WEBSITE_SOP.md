# 📘 Setu — The Startup School: Standard Operating Procedure (SOP)
### Website Platform — Complete Functional Reference

**Domain:** `thestartupschool.in`  
**Stack:** Next.js (Frontend, Port 3000) + Express.js (Backend API, Port 5000) + PostgreSQL via Prisma (AWS RDS)  
**Architecture:** Single-domain path-based reverse proxy via NGINX (`/api/*` → Express, `/*` → Next.js)

---

## TABLE OF CONTENTS

1. [Global Layout & Persistent Components](#1-global-layout--persistent-components)
2. [Homepage — Section-by-Section Reference](#2-homepage--section-by-section-reference)
3. [Events System](#3-events-system)
4. [Mentors Page (`/mentors`)](#4-mentors-page-mentors)
5. [Tools & Resources Hub (`/tools`)](#5-tools--resources-hub-tools)
6. [Workshop Landing Pages](#6-workshop-landing-pages)
7. [About Page (`/about`)](#7-about-page-about)
8. [Admin Panel (`/admin`)](#8-admin-panel-admin)
9. [Legal Pages](#9-legal-pages)
10. [Backend API Reference](#10-backend-api-reference)
11. [CMS & Admin Control Reference (Section Toggles)](#11-cms--admin-control-reference-section-toggles)
12. [Design System Reference](#12-design-system-reference)

---

## 1. Global Layout & Persistent Components

These components are mounted in `web/app/layout.tsx` and appear on **every page** of the site.

### 1.1 PromoBar
- **Location:** Top of every page, above the Navbar.
- **Source:** `web/components/layout/PromoBar.tsx`
- **Data Source:** `GET /api/homepage` → `siteSettings.promo_bar` field.
- **Behavior:** Renders a thin, full-width notification bar. Content, link, and visibility are controlled by the admin panel. If hidden by admin, the component returns `null`.
- **Interaction:** The entire bar is a clickable link pointing to a configurable destination URL.

### 1.2 Navbar
- **Location:** Fixed to top, `z-50`, present on all pages.
- **Source:** `web/components/layout/Navbar.tsx`
- **Design:** Premium glassmorphism effect (`backdrop-blur`) with a subtle border. Transparent on top, solidifies on scroll.
- **Navigation Links:**
  - **Home** → `/`
  - **Events** → `/events`
  - **Mentors** → `/mentors`
  - **Tools** → `/tools`
  - **About** → `/about`
- **CTA Button — "Apply Now":**
  - **Behavior:** Smooth-scrolls to the `#contact` section on the homepage. On interior pages, navigates to `/#contact`.
  - **Design:** Purple accent button (`bg-[#A855F7]`), rounded, with hover lift animation.
- **Mobile:** Collapses into a hamburger menu. Clicking the hamburger toggles a full-screen overlay navigation drawer.

### 1.3 Footer
- **Location:** Bottom of every page.
- **Source:** `web/components/layout/FooterLoader.tsx` → lazy loads `web/components/layout/Footer.tsx`
- **Content Sections:**
  - **Logo + Tagline:** Branding column with site name and one-line description.
  - **Quick Links:** Internal links to key pages (Home, Events, Mentors, Tools, About).
  - **Social Links:** Icons linking to Instagram, LinkedIn, YouTube, and WhatsApp communities.
  - **Legal Links:** Privacy Policy, Terms of Use.
- **Bottom Bar:** Copyright notice with current year.

### 1.4 ChatBotGate
- **Location:** Floating widget, bottom-right corner of every page.
- **Source:** `web/components/layout/ChatBotGate.tsx`
- **Behavior:** Conditionally injects the Kickkers AI chatbot widget based on admin settings. Provides a persistent floating button that opens the AI chatbot interface in a drawer.
- **ChatBot Icon:** Chat bubble / robot icon (`fas fa-robot`). Clicking expands the Kickkers AI chat panel.

### 1.5 Google Analytics & Tag Manager
- **Implementation:** Google Tag Manager (Container `GTM-MSC2KFNM`) injected in `layout.tsx` with `strategy="afterInteractive"`. Counter.dev analytics loaded `lazyOnload` on the homepage only.

---

## 2. Homepage — Section-by-Section Reference

**Route:** `/`  
**Source:** `web/app/page.tsx`  
**Data Fetch:** `GET /api/homepage` (no-cache, always fresh)  
**Toggle System:** Sections conditionally rendered based on `siteSettings.section_toggles` JSON from the database.

---

### Section 1: Hero
- **Component:** `web/components/sections/Hero.tsx`
- **Toggle:** Always visible (no toggle).
- **Layout:** Full-width, two-column on desktop (text left, image/slider right), stacked on mobile.
- **Content (from `/api/homepage` → `homepageContent`):**
  - **Badge:** Small pill label above the heading (e.g., "India's #1 Startup School").
  - **Main Heading (H1):** Large primary headline. Supports HTML for gradient text styling.
  - **Subheading:** Supporting paragraph below the heading.
  - **CTA Button — "Register / Join":** Smooth-scrolls to the `#contact` section.
  - **Stats Row:** Three stat chips below the heading (e.g., "500+ Founders", "40+ Mentors").
- **Hero Slides:** If multiple slides exist in the database, the right column renders an auto-advancing image carousel (5-second interval).

### Section 2: Upcoming Events Showcase
- **Component:** `web/components/sections/WorkshopPreview.tsx`
- **Toggle Key:** `show_pinned_event`
- **Data Source:** `GET /api/events/pinned` (client-side fetch, cache-busting timestamp).
- **Layout:** Full-width card — text column (left), banner image (right).
- **Behavior:**
  - If multiple pinned events exist, auto-advances every 5 seconds.
  - Shows "New Events Coming Soon" placeholder if no events returned.
- **Content Per Event:**
  - **Live Indicator Pill:** Pulsing purple dot + "Live Event • [Date] • [Location]"
  - **Event Title:** Large H3 headline.
  - **Event Description:** 3-line clamp.
  - **Banner Image:** Right column, falls back to `/ai-workshop-banner.webp`.
- **Buttons:**
  - **"Know More" CTA:** Entire card is a `<Link>`. Routes to `/events/{slug}` (internal) or `registration_url` (external `_blank`).
  - **Navigation Dots:** Clickable dot indicators to jump between slides.

### Section 3: Mentors Preview
- **Component:** `web/components/sections/MentorsPreview.tsx`
- **Toggle Key:** `show_mentors`
- **Data Source:** `data.mentors` from `/api/homepage`
- **Layout:** Horizontal auto-scrolling infinite ticker (two rows, alternating scroll directions).
- **LinkedIn Toggle:** If admin sets `show_mentors_linkedin: true`, LinkedIn links appear on cards.
- **CTA Button — "Meet Our Mentors":** Links to `/mentors`.

### Section 4: Tools & Resources Showcase
- **Component:** `web/components/sections/ToolsShowcase.tsx`
- **Toggle Key:** `show_tools`
- **Layout:** Responsive 3-column grid of tool cards.
- **Tool Cards (each with its own admin toggle):**

  | Tool | Route | Admin Toggle |
  |---|---|---|
  | Government Grants & Schemes | `/tools/grants` | `tool_grants` |
  | Pitch Deck Library | `/tools/pitch-decks` | `tool_pitch_decks` |
  | Events Calendar | `/tools/founder-calendar` | `tool_calendar` |
  | Incubators & Accelerators | `/tools/incubators-accelerators` | `tool_incubators` |
  | Investor Database | `/tools/incubator-search/investors` | `tool_investors` |

- **Status Values:** `live` (clickable), `coming_soon` (badge, unclickable), `upcoming` (badge, unclickable), `disabled` (hidden).
- **Card Design:** Dark indigo background (`#13113B`), hover lift + purple shadow.
- **"View all resources" Button:** Links to `/tools`.

### Section 5: Events Gallery
- **Component:** `web/components/sections/EventsGallery.tsx`
- **Toggle Key:** `show_past_events`
- **Data Source:** `GET /api/events` (client-side)
- **Layout:** Horizontal scrollable row of event cards.
- **Filters:** "Upcoming" and "Past" tab pills filter events client-side.
- **Each Card:** Banner image, title, date, city/venue, short description, "View Details" link.

### Section 6: Community Gallery
- **Component:** `web/components/sections/Gallery.tsx`
- **Toggle Key:** `show_community_gallery`
- **Data Source:** `data.galleryItems` from `/api/homepage`
- **Layout:** Masonry-style image grid, lazy-loaded.
- **Lightbox:** Click any image to open full-screen lightbox. Arrow buttons navigate between images. Click outside or press `Escape` to close.

### Section 7: Video Gallery
- **Component:** `web/components/sections/VideoAndGallery.tsx`
- **Toggle Key:** `show_video_gallery`
- **Behavior:** Delegates to `DynamicVideoGallery` CMS component. YouTube `watch?v=` URLs auto-converted to `embed/` format (bypasses X-Frame-Options).

### Section 8: Testimonials — "What Founders Say"
- **Component:** `web/components/sections/Testimonials.tsx`
- **Toggle Key:** `show_testimonials`
- **Data Source:** `data.testimonials` from `/api/homepage`
- **Layout:** Carousel/slider with arrow navigation.
- **Content Types:**
  - **Video Cards:** YouTube embeds in `embed/` format. Placeholder/dummy video IDs filtered by backend.
  - **Text Cards:** Quote body, author name, designation. Gibberish entries filtered by backend `isGibberish` sanitizer.
- **Navigation:**
  - **Prev (‹) / Next (›) Arrows:** Move one card at a time.
  - **Dot Indicators:** Jump directly to any card.

### Section 9: Students From
- **Component:** `web/components/sections/StudentsFrom.tsx`
- **Toggle Key:** `show_students_from`
- **Data Source:** `data.studentsFrom` from `/api/homepage`
- **Layout:** Grid or ticker of universities, companies, or cities where students have joined from.

### Section 10: Ecosystem Partners
- **Component:** `web/components/sections/EcosystemPartners.tsx`
- **Toggle Key:** `show_partners`
- **Data Source:** `data.partners` from `/api/homepage`
- **Layout:** Auto-scrolling horizontal logo ticker of partner organizations.

### Section 11: Certifications
- **Component:** `web/components/sections/Certifications.tsx`
- **Toggle:** Always visible.
- **Data Source:** `data.certifications` from `/api/homepage`
- **Content:** Trust/certification badges (DPIIT recognition, awards, etc.).

### Section 12: Upcoming Programs
- **Component:** `web/components/sections/Programs.tsx`
- **Toggle Key:** `show_programs`
- **Data Source:** `data.programs` from `/api/homepage`
- **Layout:** Two-column grid of dark program cards.
- **Content Per Card:** Program label, title, subtitle, description, duration/location bullet list.
- **CTA Button — "[Apply Now / cta_text]":**
  - **Behavior:** Smooth-scrolls to `#contact` form. URL hash cleared via `window.history.replaceState()` to prevent navigation desync ("dead button" prevention).
  - **Design:** Full-width solid purple button with `ArrowRight` icon.

### Section 13: Contact / Inquiry Form
- **Component:** `web/components/sections/Contact.tsx`
- **Toggle:** Always visible.
- **Anchor ID:** `#contact` — the scroll target for all "Apply Now" and "Register" CTAs sitewide.
- **Form Fields:**

  | Field | Type | Validation |
  |---|---|---|
  | Full Name | text | Required |
  | City | text | Required |
  | Contact Number | tel | Required, 10-digit numeric |
  | Email Address | email | Required |
  | What are you interested in? | select | Required, dynamic options |

- **Dropdown Source:** `GET /api/lead-sources` populates the interest dropdown dynamically.
- **Submit Button — "Submit Inquiry":**
  - **Endpoint:** `POST /api/leads`
  - **Loading State:** Shows "Submitting…" and disables button.
  - **Success:** Green confirmation "Thank you! We have received your inquiry." pill. Form resets after 5 seconds.
  - **Error:** Red "Something went wrong. Please try again later." pill.

### Section 14: Founder Manifesto
- **Component:** `web/components/sections/FounderManifesto.tsx`
- **Toggle Key:** `show_founder_manifesto`
- **Layout:** Full-width editorial with founder quote, photo, and large manifesto text in serif font (Merriweather).

### Section 15: Startups Mentored
- **Component:** `web/components/sections/StartupsMentored.tsx`
- **Toggle Key:** `show_startups`
- **Data Source:** `data.mentoredStartups` from `/api/homepage`
- **Layout:** Grid or ticker of mentored startup logos/names.

### Section 16: Bottom Video Gallery
- **Component:** `web/components/sections/BottomVideoGallery.tsx`
- **Toggle:** Always visible (renders `null` if no data).
- **Data Source:** `data.bottomVideos` from `/api/homepage`
- **Layout:** 3-column responsive grid; 16:9 aspect ratio YouTube embeds.
- **URL Handling:** Uses `URL` constructor to safely extract video ID from any YouTube URL format, constructs `youtube.com/embed/{id}` to bypass SAMEORIGIN restrictions.
- **Card Footer:** Video title displayed below each embed.

### Section 17: What Is Setu?
- **Component:** `web/components/sections/WhoIsSetuFor.tsx`
- **Layout:** Full-width animated SVG curve with three milestone points annotated along the curve.
- **Animation (framer-motion):** SVG `pathLength: 0 → 1` draw animation on scroll entry. Three annotation points fade in sequentially with staggered delays.
- **Three Points:**
  1. **Mentorship & Guidance** — "Get expert guidance to navigate the startup world."
  2. **Alternate B-School** — "Real-world education through workshops and courses."
  3. **Ecosystem & Tools** — "Free access to premium tools and deep ecosystem immersion."

---

## 3. Events System

### 3.1 Events & Workshops Listing Page (`/events`)
- **Source:** `web/app/events/page.tsx`
- **Data Sources:** 
  - `GET /api/events?upcoming=true`
  - `GET /api/events?past=true`
  - `GET /api/courses` (from the LMS)
- **Unified Events & Courses Logic:** 
  - Courses fetched from the LMS API are displayed in the "Courses & Cohorts" section.
  - **Deduplication:** The code maps through all events to collect any defined `lms_course_slug`. If an LMS course's slug matches one of these tied slugs, the LMS course card is **hidden** from the top grid. This ensures that a single offering doesn't appear twice (once as an LMS course and once as an Event).
- **Layout Sections:**
  1. **Courses & Cohorts:** Displays LMS courses. Clicking "Enroll Now →" routes to `/courses/[slug]`. Prices are formatted in INR via `formatPrice`.
  2. **Upcoming Workshops:** Renders active future events. If the event has a `slug`, clicking routes to `/events/[slug]`. If it lacks a slug but has a `registration_url`, clicking opens the external registration link in a new tab.
  3. **Past Events:** Displays concluded events. Cards feature a hover scale effect (`group-hover:scale-105`) and "Concluded" badge.

### 3.2 Event Detail Page (Builder) (`/events/[slug]`)
- **Source:** `web/app/events/[slug]/page.tsx`
- **Data Source:** `GET /api/events/slug/{slug}`
- **Security:** API strips `lms_course_slug`, `coupon`, and `applicable_coupons` from the payload before sending to the client.
- **Layout Generation:** Renders a dynamic page strictly from the `page_blocks` JSON array created in the Admin Event Builder. 
- **Registration Buttons:** Link to `registration_url` (external `_blank`).
- **Not Found:** Renders `not-found.tsx` — clean 404 page with a "Back to Events" link.

### 3.3 Course Detail Page (`/courses/[slug]`)
- **Source:** `web/app/courses/[slug]/page.tsx`
- **Purpose:** Handles detailed view and checkout for LMS-managed courses. The standalone `/courses` index redirects to `/events#courses`.

---

## 4. Mentors Page (`/mentors`)

- **Route:** `/mentors`
- **Source:** `web/app/mentors/page.tsx`
- **Data Source:** `GET /api/homepage` → `data.mentors`

### Mentor Card — 3D Flip Interaction
- **Component:** `web/components/sections/Mentors.tsx` → `MentorCard`
- **Front Face:** Full-bleed portrait photo with name and title overlay.
  - **Flip Icon (↻, top-right):** Click to flip the card. Desktop hover also triggers flip.
- **Back Face:** Name, title, bio text, LinkedIn button.
  - **"Connect on LinkedIn" Button:** External `_blank` link to mentor's LinkedIn. Only shown if `linkedin_url` is set.
  - **Close Icon (✕, mobile only):** Flips card back to front.

### "Apply to be a Mentor" Button
- **Component:** `web/components/sections/MentorCTA.tsx`
- **Behavior:** Opens a full-screen modal overlay.
- **Modal Form Fields:**

  | Field | Type | Constraint |
  |---|---|---|
  | Full Name | text | Required, max 100 chars |
  | Email Address | email | Required, max 200 chars |
  | Phone Number | tel | Optional, max 15 chars |
  | LinkedIn Profile URL | url | Required, max 300 chars |
  | Short Description / Bio | textarea | Required, max 1000 chars |

- **Submit Button:** `POST /api/leads` with `source: 'mentor_application'`. Success replaces form with a green confirmation card that auto-closes after 3 seconds.

---

## 5. Tools & Resources Hub (`/tools`)

### 5.1 Tools Index (`/tools`)
- **Source:** `web/app/tools/page.tsx`
- **Layout:** Centered card grid. Live tools are clickable cards; disabled/coming-soon show as non-clickable with status badges based on Admin Toggles.

### 5.2 Grants & Schemes Directory (`/tools/grants`)
- **Source:** `web/app/tools/grants/page.tsx`
- **Data Handling:** Pulls statically typed array from `lib/data/grants.ts`.
- **Localization:** Supports 6 languages (EN, HI, KN, TA, TE, MR). State held in `LanguageKey`. Changes UI text, but grant payload data remains English.
- **Filters (Client-side useMemo):**
  - **Keyword Search:** Checks `name`, `provider`, `focusSector`, `criteria`, `location`, `fundingSupport`.
  - **Region:** Dropdown options like "Delhi NCR", "Karnataka", "Pan India".
  - **Stage:** "Idea", "MVP", "MVP, Revenue, Scaling", "Revenue, Scaling".
  - **Sector:** "DeepTech, AI/ML, SaaS", "AgriTech, FoodTech", etc.
  - **Funding Type:** "Grant", "Debt/Equity-free Loan", "Seed Equity", "Incubation Support".
- **Interactions:**
  - **Card Click:** Opens a slide-in Detail Drawer Modal covering the viewport.
  - **Drawer Modal:** Shows detailed guidelines, dynamic document checklist, and an "Apply" button pointing to the official `website`. 

### 5.3 Pitch Deck Repo (`/tools/pitch-decks`)
- **Source:** `web/app/tools/pitch-decks/page.tsx`
- **Data Handling:** Pulls statically typed array from `lib/data/globalPitchDecks.ts`.
- **Logo Fetching:** Uses a custom `DOMAIN_MAP` to fetch favicons via Clearbit (`logo.clearbit.com/{domain}`) and falls back to Google Favicon API. If both fail, generates a colored letter avatar based on company name.
- **Filters:** Text search by company/tagline/tags, and an Economic Sector dropdown.
- **"View Pitch Deck":** Navigates to a sub-page `/tools/pitch-decks/[id]` (often embedding the PDF or slides).

### 5.4 Founder Calendar (`/tools/founder-calendar`)
- **Source:** `web/app/tools/founder-calendar/page.tsx`
- **Data Handling:** Pulls from `lib/data/events.ts`.
- **Logic / Interactions:**
  - Auto-categorizes events into broad sectors (Tech, Healthcare, Auto, FinTech, Agri, Infra) via substring matching in `getSectorFromEvent`.
  - Custom date parsing logic (`parseEventSortDate`) handles strings like "13-15 Mar".
  - **"Add to Google Calendar":** Generates an `href` to `calendar.google.com/calendar/render` prefilled with details.
  - **"Download .ics":** Uses `IcsDownloadButton` to generate and download a standard calendar file client-side.

### 5.5 Incubators & Accelerators (`/tools/incubators-accelerators`)
- **Source:** `web/app/tools/incubators-accelerators/page.tsx`
- **Data Handling:** Static list from `lib/data/Incubators and Accelerators/incubators.ts`.
- **Logo Parsing:** Tries to extract the raw domain from `website` or `contactDetails` to fetch Clearbit/Google favicons.
- **Filters:** Sector, Location, Stage (Seed, Pre-Seed, Early Traction, Growth), and Type (Incubator vs Accelerator).

### 5.6 Investor Database (`/tools/incubator-search/investors`)
- **Layout:** Searchable table/card grid.
- **Filters:** Stage (Angel/Pre-Seed/Seed/Series A), Sector, City.
- **Card:** Photo, name, fund/firm, portfolio highlights, LinkedIn link.

### 5.7 Cap Table Simulator (`/tools/cap-table-simulator`)
- **Source:** `web/app/tools/cap-table-simulator/page.tsx`
- **Behavior:** 100% Client-side React logic. No backend interaction.
- **Features:** 
  - Allows editing pre-money valuation, total shares, and currency (INR/USD).
  - Users can manually edit the shares of the Founder and Option Pool.
  - Simulates an investment round: Add investor name, investment amount, and target post-money valuation.
  - Automatically calculates price per share and issues new shares, showing the diluted cap table in a donut chart and detailed table.

### 5.8 Financial Modeler (`/tools/financial-modeler`)
- **Source:** `web/app/tools/financial-modeler/page.tsx` (Component in `web/components/tools/FinancialModeler.tsx`)
- **Behavior:** Interactive client-side dashboard tool. No backend dependency.
- **Features:** Inputs for Current Cash, Monthly Revenue, Monthly Expenses, and Monthly Growth Rate. Instantly computes Net Burn, Runtime (Months of Runway), and charts the "Default Alive" vs "Default Dead" cash trajectory over 24 months.

---

## 6. Workshop Landing Pages

Standalone promotional pages with a custom dark theme (`#0f172a` slate background). Do **not** inherit the global Navbar/Footer.

### 6.1 Fundraising Workshop (`/fundraising-workshop-15apr`)
- **Sections:** `WorkshopHero`, `WorkshopOutcome`, `WorkshopWhyUs`, `WorkshopCurriculum`, `WorkshopPricing` (registration buttons disabled as event has passed), `WorkshopMentor`, `WorkshopProof`, `WorkshopGuestMentors`, `WorkshopFinal`, `BottomSheetCTA` (mobile), and `KickkersGate` (chatbot).
- **Accessibility:** All secondary text uses `text-slate-300` for WCAG contrast compliance on dark backgrounds.

### 6.2 AI Workshop (`/AI-workshop-15may`)
- Mirror structure of the Fundraising Workshop, themed for the May AI Workshop event.

### 6.3 Founders Dating (`/founders-dating-14feb26`)
- Dedicated landing page for networking event.

### 6.4 Order/Confirmation Pages
- `/ON15AprFund-Av`, `/ON15AprFund-B` — Order confirmation/upsell pages.
- `/ON15MAY-AI-SUCCESS` — Payment success page.

---

## 7. Informational Pages

### 7.1 About Page (`/about`)
- **Source:** `web/app/about/page.tsx`
- **Layout:** Full editorial page containing:
  - Mission Statement block
  - Founder bio section (Gaurav Bansal — photo, story, credentials)
  - "What We Believe" manifesto block in Merriweather serif
  - Community stats (founders, mentors, cities covered)
  - CTA linking back to the `#contact` form

### 7.2 Gaurav Bansal Profile (`/gaurav-bansal`)
- **Source:** `web/app/gaurav-bansal/page.tsx`
- **Purpose:** Personal digital business card / bio page for the founder.
- **Actions:** 
  - **Copy Link:** Copies `window.location.href` to clipboard.
  - **Download Contact (vCard):** Generates and downloads `Gaurav_Bansal.vcf` dynamically via a client-side Blob containing VCARD 3.0 formatting.

---


## 8. Admin Panel (`/admin`) — Complete Field Reference

**Authentication System:**
- JWT stored in `localStorage` as key `adminToken` AND as a `SameSite=Strict; path=/; max-age=86400` HTTP cookie.
- The cookie is read by Next.js Edge Middleware to protect every `/admin/*` route at request time — without JavaScript executing first.
- Token lifespan: **24 hours** from login.
- On every admin sub-page load, the layout verifies the token via `GET /api/admin/verify`. If verification fails, token is cleared from storage and cookie, and user is redirected to the login page.
- The only exception: `/admin/handoff` — this route renders without auth so the LMS can exchange a one-time token.

### Admin Sidebar — Navigation Groups

Rendered by `web/app/admin/layout.tsx`. A sticky, scrollable sidebar on the left with six grouped sections. The active page link gets a purple left-border highlight and bold text.

| Sidebar Group | Page Label | Route |
|---|---|---|
| **Overview** | Dashboard | `/admin/dashboard` |
| **Core Pages** | Hero & Homepage | `/admin/hero` |
| | Events & Workshops | `/admin/events` |
| | Programs | `/admin/programs` |
| **Sales & Data** | Registrations | `/admin/registrations` |
| | Leads | `/admin/leads` |
| | Helpdesk Tickets | `/admin/helpdesk` |
| | Coupons | `/admin/coupons` |
| | Mass Mailer | `/admin/mailer` |
| **People & Entities** | Mentors | `/admin/mentors` |
| | Partners | `/admin/partners` |
| | Mentored Startups | `/admin/mentored-startups` |
| **Content & Widgets** | Gallery | `/admin/gallery` |
| | Bottom Videos | `/admin/bottom-videos` |
| | Testimonials | `/admin/testimonials` |
| | Tools & Resources | `/admin/tools` |
| | Chat Widgets | `/admin/chat-widgets` |
| **System** | Site Settings | `/admin/settings` |

**Log Out Button** (bottom of sidebar):
- Clears `adminToken` from `localStorage`.
- Overwrites cookie: `adminToken=; path=/; max-age=0; SameSite=Strict` (immediate expiry).
- Hard-redirects to `/admin` login page via `window.location.href`.

---

### 8.0 Admin Login Page (`/admin`)
**Source:** `web/app/admin/page.tsx` | **Auth required:** No

| Field | Input Type | Constraint | Notes |
|---|---|---|---|
| Email Address | `<input type="email">` | Required, must be valid email format | Browser-native email validation |
| Password | `<input type="password">` | Required | No min/max enforced on frontend — backend validates against stored hash |

**"Sign In" Button (`type="submit"`):**
- Calls `POST /api/admin/login` with `{ email, password }` as JSON.
- While submitting: shows spinner icon + "Authenticating…" text, button is `disabled`.
- **Success:** Saves JWT to `localStorage.adminToken`, sets cookie, redirects to `/admin/dashboard`.
- **Failure:** Shows red error banner with the server error message (e.g., "Invalid credentials").

---

### 8.1 Dashboard (`/admin/dashboard`)
**Source:** `web/app/admin/dashboard/page.tsx` | **Data:** `GET /api/admin/dashboard-stats`

**Read-only overview page.** No editable fields.

| Stat Card | What It Shows | Visual Style |
|---|---|---|
| Active Events | Count of `is_active: true` events | White card, calendar icon |
| Active Mentors | Count of `is_active: true` mentors | White card, users icon |
| New Leads | Leads from recent period + badge showing total all-time leads | Gradient card (purple→fuchsia) |
| Programs | Total program records | Grey mini-card |
| Gallery Items | Total gallery image records | Grey mini-card |
| Partners | Total partner logo records | Grey mini-card |

**Quick Action Buttons (bottom of page):**
- **"Manage Events"** → navigates to `/admin/events`
- **"View Leads"** → navigates to `/admin/leads`

---

### 8.2 Hero & Homepage (`/admin/hero`)
**Source:** `web/app/admin/hero/page.tsx`

This page has **three independent save panels**. Each panel has its own Save button; saving one does not affect the others.

---

#### Panel 1 — Hero Text (3 Scenes)

**Editor type:** ReactQuill rich-text editor (WYSIWYG). Available toolbar buttons:
- **Block format:** Paragraph, Heading 1 (H1), Heading 2 (H2), Heading 3 (H3)
- **Font family:** Browser default + system fonts
- **Inline:** Bold (`Ctrl+B`), Italic (`Ctrl+I`), Underline (`Ctrl+U`), Strikethrough, Blockquote
- **Lists:** Ordered list (numbered), Unordered list (bullet)
- **Color:** Text colour picker (full RGB palette), Background colour picker
- **Alignment:** Left, Centre, Right, Justify
- **Links:** Insert hyperlink (URL + display text)
- **Clear:** Remove all formatting

**Output format:** HTML string stored in the database. The homepage Hero component renders this HTML directly via `dangerouslySetInnerHTML`, so HTML tags like `<span style="color:#A855F7">` will render as purple gradient text.

**DB Model:** `HomepageContent` table (`homepage_content`)

| Scene | Field Name (DB) | DB Column | Required | Notes |
|---|---|---|---|---|
| **Scene 1: The Hook** | Main Heading | `hero_heading` | ✅ Yes | The primary H1 text. Visible on initial page load. HTML allowed. |
| **Scene 1: The Hook** | Tagline | `hero_tagline` | ✅ Yes | Supporting subheading below the main heading. HTML allowed. |
| **Scene 2: The Bridge** | Bridge Heading | `hero_scene1_heading` | ❌ Optional | Second slide heading. HTML allowed. |
| **Scene 2: The Bridge** | Bridge Tagline | `hero_scene1_tagline` | ❌ Optional | Second slide tagline. HTML allowed. |
| **Scene 3: The Roadmap** | Roadmap Heading | `hero_scene2_heading` | ❌ Optional | Third slide heading. HTML allowed. |
| **Scene 3: The Roadmap** | Roadmap Tagline | `hero_scene2_tagline` | ❌ Optional | Third slide tagline. HTML allowed. |

**No hard character limit** enforced by the database (PostgreSQL `TEXT` column). Keep headings under ~80 characters for clean layout. Taglines under ~200 characters.

**"Save Text Settings" Button:**
- `PUT /api/admin/homepage_content`
- Sends all 6 scene fields + current `hero_rotation_seconds` as JSON.
- **Loading state:** "Saving…" text, button disabled.
- **Success:** Green "✓ Saved" flash message (auto-hides after 3 seconds).

---

#### Panel 2 — Homepage Section Headings

**Purpose:** Override the title and subtitle text above each homepage section. If left empty, the frontend uses a hardcoded default.

**Editor type:** Same ReactQuill rich-text editor (full formatting toolbar) — supports HTML for colour styling.

**DB:** Stored as JSON in `SiteSetting.section_headings` column. Each key is a section identifier string.

| Section Key | Default Main Title | Default Subtitle | Notes |
|---|---|---|---|
| `tools_showcase` | "Tools & Resources." (with purple "Resources.") | "Access our curated suite of tools…" | Change the word "Resources." colour via HTML colour picker |
| `mentors_preview` | "Learn from people who've **built.**" (purple "built.") | *(empty)* | The H2 above the mentor ticker |
| `events_gallery` | "Events Gallery" | *(empty)* | Above the events cards row |
| `community_gallery` | "Community Gallery, **Connect Offline**" | "Engage with other learners…" | Can add linebreak `<br>` via HTML |
| `video_gallery` | "Video & Media Gallery" | *(empty)* | Above the video cards section |
| `programs` | "Programs Launching Soon" | "For all those who have 'KEEDA' and 'HIMMAT'" | The coloured words use inline `<span style>` |
| `founder_manifesto` | "The Founder's Manifesto" | *(empty)* | |
| `startups_mentored` | "Startups Mentored By Us" | "We take pride in guiding passionate founders…" | |
| `testimonials` | "What **Founders Say**" (purple "Founders Say") | "Real stories from our community members." | |
| `partners` | "Ecosystem Partners" | "NETWORK" | Subtitle is used as an eyebrow label |
| `students_from` | "Our Students Come From" | "NETWORK" | Subtitle is used as an eyebrow label |

**"Save Headings" Button:**
- `PUT /api/admin/site_settings` with `{ section_headings: {...} }`
- **Loading state:** "Saving…" text, button disabled.
- **Success:** Green "✓ Saved" flash (auto-hides after 3 seconds).

---

#### Panel 3 — Hero Background Slides & Timing

**"Time per slide" input:**
- `<input type="number" min="1" max="30">` — integer only, range 1–30 seconds.
- **Auto-saves on change** (no separate button) via `PUT /api/admin/homepage_content`.
- Controls how long each hero slide is displayed before advancing.

**Slide Limit:** Maximum **6 active slides**. After 6, the upload button still works but additional slides will exceed the display intent.

**"Upload Slide" Form:**

| Field | Input Type | Constraint | Notes |
|---|---|---|---|
| Image File | `<input type="file" accept="image/*">` | Required; max **5 MB** per upload | Accepts: JPEG, PNG, WebP, GIF, SVG. Uploaded directly to AWS S3. |

**"Upload Slide" Button:**
- `POST /api/admin/hero_slides` as `multipart/form-data` with fields: `image` (file), `display_order` (auto-assigned as next sequential integer).
- **Loading state:** "Uploading…" text, button disabled.
- **Error:** Alert popup with server error message if upload fails.

**Existing Slides Grid (after upload):**
- **Thumbnail:** 16:9 aspect ratio preview image.
- **Order Badge (top-left of each slide):** Shows "Order: N".
  - **← Chevron button:** Moves this slide one position earlier (`display_order--`). Disabled on the first slide.
  - **→ Chevron button:** Moves this slide one position later (`display_order++`). Disabled on the last slide.
  - Reordering calls `PUT /api/admin/hero_slides/{id}` for *every* slide in the array to reassign `display_order` sequentially (1, 2, 3…), preventing duplicate order values.
- **"Delete" Button (appears on hover):** Confirmation dialog → `DELETE /api/admin/hero_slides/{id}`.

---

### 8.3 Events & Workshops (`/admin/events`)
**Source:** `web/app/admin/events/page.tsx` | **DB Model:** `Event` (`tss_events`)

**List view table columns:** Title, Status badges (Live / Past / Pinned), Start Date, City, Actions.

**"+ New Event" Button:** Opens an event creation form/modal.

#### Event Form — Full Field Reference

**DB Model fields (from `schema.prisma`):**

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Title | `text` input | `title` | ✅ Yes | Unlimited (TEXT) | Event name shown on cards and detail page. |
| Description | Rich-text textarea | `description` | ✅ Yes | Unlimited (TEXT) | Full description. HTML supported. |
| Slug | `text` input | `slug` | ❌ Optional | Must be **unique** across all events; URL-safe characters only (letters, numbers, hyphens). No spaces. | Used in the URL: `thestartupschool.in/events/{slug}`. If blank, the event links to `registration_url` externally instead. |
| Banner Image | `<input type="file">` | `banner_url` (stores S3 URL) | ❌ Optional | Any image format; recommended ≥ 1200×600px for best display | Uploaded to S3. URL stored in DB. Falls back to `/ai-workshop-banner.webp` on frontend if missing. |
| Venue | `text` input | `venue` | ❌ Optional | Unlimited (TEXT) | Physical venue name or "Online". |
| City | `text` input | `city` | ❌ Optional | Unlimited (TEXT) | City displayed on the event card. |
| Start Date | `<input type="date">` | `start_date` | ❌ Optional | ISO date format (`YYYY-MM-DD`), stored as `@db.Date` | Date stored without time component. |
| Start Time | `text` input | `start_time` | ❌ Optional | Free-text, e.g. "10:00 AM" | Not a time picker — stored as a string. |
| End Date | `<input type="date">` | `end_date` | ❌ Optional | ISO date format | |
| End Time | `text` input | `end_time` | ❌ Optional | Free-text | |
| Registration URL | `url` input | `registration_url` | ❌ Optional (defaults to `""`) | Must be a valid full URL | External Razorpay / Instamojo / Google Form / custom registration link. |
| LMS Course Slug | `text` input (admin-only) | `lms_course_slug` | ❌ Optional | Must be **unique** if set | Links this event to an LMS course. When set, event CTAs route through the LMS checkout instead of `registration_url`. **Never exposed in the public API.** |
| Is Pinned | `checkbox` | `is_pinned` (Boolean) | — | Default: `false` | **ON** → event appears in the homepage `WorkshopPreview` auto-carousel. Multiple pinned events cycle every 5 seconds. |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **OFF** → event is completely hidden from all public APIs and pages. |
| Is Past | `checkbox` | `is_past` (Boolean) | — | Default: `false` | **ON** → moves the event to the "Past Events" tab in the Events listing page. |

**Save/Delete:**
- **"Save Event" Button:** `POST /api/admin/events` (create) or `PUT /api/admin/events/{id}` (update).
- **"Delete" Button:** `DELETE /api/admin/events/{id}` with browser `confirm()` dialog.

#### Event Page Builder (`/admin/events/[id]/builder`)

A visual JSON block editor that builds the `page_blocks` JSON column in the `Event` record.

**How blocks work:** Each block is a JSON object with a `type` key and type-specific fields. The public event detail page renders them in order as distinct UI sections.

| Block Type | Fields Available | Notes |
|---|---|---|
| `hero` | `heading`, `subheading`, `badge_text` | Rendered as a full-width banner |
| `schedule` | `items[]` → `time`, `title`, `description` | Timeline / agenda block |
| `speakers` | `items[]` → `name`, `title`, `photo_url`, `bio` | Speaker grid |
| `pricing` | `tiers[]` → `name`, `price`, `features[]`, `cta_text`, `cta_url` | Pricing cards |
| `faq` | `items[]` → `question`, `answer` | Expandable accordion |
| `text` | `content` (HTML) | Generic rich-text block |
| `image` | `url`, `caption`, `alt` | Full-width image block |

**Builder Actions:**
- **"Add Block" dropdown:** Select block type → click "Add" → new empty block appended at bottom.
- **▲ / ▼ arrows:** Reorder blocks (swaps JSON array positions).
- **✕ Delete button:** Removes block from array (with confirmation).
- **"Save Page" Button:** `PUT /api/admin/events/{id}` with `{ page_blocks: [...] }`. The `page_blocks` field is of type `JSON` in the DB schema.
- **⚠️ Important:** Saving the page builder does **not** save other event fields (title, dates etc.) — those are saved separately from the main event form.

**LMS Handoff Access:** From the LMS admin, click "Manage Event" → browser redirects to `/admin/handoff?token={one_time_token}&next=/admin/events/{id}/builder` → the handoff page exchanges the token for a full admin JWT and forwards here automatically.

---

### 8.4 Programs (`/admin/programs`)
**Source:** `web/app/admin/programs/page.tsx` | **DB Model:** `Program` (`programs`)

**List table columns:** Title, Subtitle, Duration, Price, Lead Tag (monospace badge), Status (Active/Hidden), Actions.

**"+ Add New Program" Button:** Opens a modal.

#### Program Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Title | `text` input | `title` | ✅ Yes (`required` attr) | Unlimited (TEXT) | e.g., "7 Day Sprint". Shown as the card's main label. |
| Subtitle | `text` input | `subtitle` | ❌ Optional | Unlimited (TEXT) | e.g., "The Spark". Shown as a small eyebrow label above the title on the card. |
| Description | `<textarea>` | `description` | ❌ Optional | Min-height 80px; no hard character limit | Paragraph text shown in the card body. |
| Duration | `text` input | `duration` | ❌ Optional | Unlimited (TEXT) | e.g., "3 Days", "4 Weeks". Shown as a bullet point on the card. |
| Price | `text` input | `price` | ❌ Optional | Unlimited (TEXT) | Free-text — can be "₹4,999", "Free", "By Application". Shown as a bullet point. |
| Lead Source Tag | `text` input | `lead_source_tag` | ❌ Optional | Unlimited (TEXT); should be lowercase with underscores (e.g., `spark_interest`) | When a user clicks "Apply Now" on this card and submits the contact form, the lead's `source` field is automatically set to this tag. Allows tracking which program drove the lead. |
| CTA Text | `text` input | `cta_text` | ❌ Optional | Unlimited; **default value pre-filled:** "Show your interest" | The text on the Apply/Register button on the card. Changing this changes only the button label — the button always scrolls to `#contact`. |
| Display Order | `<input type="number">` | `display_order` | ❌ Optional | Integer; controls left-to-right card order in the 2-column grid | Lower number = displayed first. |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **Checked (ON)** → card visible on homepage under "Upcoming Programs". **Unchecked (OFF)** → card hidden from public site. In the admin table: shows green "Active" badge or grey "Hidden" badge. |

**Save/Delete:**
- **"Save Program" Button:** `POST /api/admin/programs` (create) or `PUT /api/admin/programs/{id}` (edit).
- **"Delete" Button:** Browser `confirm()` → `DELETE /api/admin/programs/{id}`.

---

### 8.5 Registrations (`/admin/registrations`)
**Source:** `web/app/admin/registrations/page.tsx` | **DB Model:** `EventRegistration` (`event_registrations`) | **Read-only**

**Data Source:** `GET /api/admin/registrations` + `GET /api/events` (for event name mapping).

#### Filters (applied client-side after initial fetch)

| Filter | Input Type | Notes |
|---|---|---|
| Filter by Event | `<select>` dropdown | Options populated from all events fetched from `/api/events`. Selecting an event filters registrations to that event only. |
| Filter by Ticket Tier | `<select>` dropdown | Populated dynamically from unique `ticket_tier` values in the loaded dataset. |
| Filter by Status | Status pills | `PENDING` / `PAID` / `FAILED` (or whatever values exist in DB). |

#### Table Columns (all read-only)

| Column | DB Field | Notes |
|---|---|---|
| User Name | `user.name` (via relation) | The registered user's full name |
| User Email | `user.email` | |
| Event | `event_id` mapped to event title | |
| Ticket Tier | `ticket_tier` | e.g., "Early Bird", "Standard" |
| Status | `status` | PENDING / PAID / FAILED |
| Amount | `amount` | In paisa (÷ 100 = rupees). Displayed as ₹ amount. |
| Razorpay Order ID | `razorpay_order_id` | |
| Razorpay Payment ID | `razorpay_payment_id` | |
| Guest Name | `guest_name` | If a different person attended |
| Guest Email | `guest_email` | |
| Guest Phone | `guest_phone` | |
| Created At | `created_at` | ISO datetime |

**"Export to Excel" Button:**
- Exports currently visible (filtered) rows as a `.xlsx` file.
- Done **100% client-side** using the `xlsx` npm library — no API call is made for the export.
- File is automatically named and downloaded to the browser's Downloads folder.

---

### 8.6 Leads (`/admin/leads`)
**Source:** `web/app/admin/leads/page.tsx` | **DB Model:** `Lead` (`leads`) | **Read-only**

**Data Source:** `GET /api/admin/leads`

#### Table Columns

| Column | DB Field | Notes |
|---|---|---|
| Full Name | `full_name` | |
| Email | `email` | |
| Phone | `phone` | |
| City | `city` | |
| Source | `source` | The lead source tag: e.g., `contact_section`, `mentor_application`, `spark_interest`. Identifies which form/button the user submitted. |
| Status | `status` | Default: `new`. Can be `new`, `contacted`, `converted` — updated manually or via CRM. |
| Message | `message` | Optional message attached to the lead |
| Submitted At | `created_at` | |

**Filter/Search:** Client-side filtering by source tag. Text search by name or email.

**"Export" Button:** Downloads leads as CSV or Excel (similar to Registrations).

---

### 8.7 Helpdesk Tickets (`/admin/helpdesk`)
**Source:** `web/app/admin/helpdesk/page.tsx` | **DB Model:** `HelpdeskTicket` (`helpdesk_tickets`)

**Data Source:** `GET /api/admin/helpdesk`

#### Ticket Card Details

| DB Field | Notes |
|---|---|
| `id` | UUID (auto-generated) |
| `email` | Submitter's email (optional) |
| `message` | The support request body (TEXT, no char limit in DB) |
| `attachment_url` | S3 URL of any attachment the user uploaded |
| `status` | `new` (default) or `resolved` |
| `created_at` | Submission timestamp |

**Actions per ticket:**
- **"Mark as Resolved" Button:** `PATCH /api/admin/helpdesk/{id}` with `{ status: "resolved" }`.
- **"Delete" Button:** Browser `confirm()` → `DELETE /api/admin/helpdesk/{id}`.

---

### 8.8 Coupons (`/admin/coupons`)
**Source:** `web/app/admin/coupons/page.tsx` | **DB Model:** `Coupon` (`coupons`)

**Data Source:** `GET /api/coupons/admin` (note: this is under `/api/coupons/admin`, not `/api/admin/coupons`)

**List table columns:** Code, Type, Discount Value, Active toggle, Start Date, End Date, Max Uses / Current Uses, Actions.

**"+ New Coupon" Button:** Opens a modal with the coupon form.

#### Coupon Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Code | `text` input | `code` (UNIQUE) | ✅ Yes | No spaces; conventionally UPPERCASE (e.g., `SETU20`). Must be unique across all coupons. | What the user types at checkout. Stored in DB as `@unique` — duplicate codes will cause a "Failed to save coupon" error. |
| Type | `<select>` | `type` | ✅ Yes | Options: `"percentage"` or `"flat"` (also called "fixed" internally) | `percentage`: deducts a % of the total. `flat`: deducts a fixed ₹ amount. |
| Discount Value | `<input type="number">` | `discount_value` (Float) | ✅ Yes | Any positive number. For `percentage`: 0–100 (e.g., `20` = 20% off). For `flat`: ₹ amount (e.g., `500` = ₹500 off). | Stored as a Float in DB — decimal values like `12.5` are allowed. |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **Checked** → coupon can be used at checkout. **Unchecked** → coupon exists but returns "invalid" at checkout. Use this to pause a promotion without deleting it. |
| Start Date | `<input type="date">` | `start_date` (DateTime?) | ❌ Optional | ISO datetime stored. Leave blank for no start restriction. | Coupon is invalid before this date. |
| End Date | `<input type="date">` | `end_date` (DateTime?) | ❌ Optional | Leave blank for no expiry. | Coupon is invalid after this date. |
| Max Uses (global) | `<input type="number">` | `max_uses` (Int?) | ❌ Optional | Integer ≥ 1. Leave blank = unlimited total redemptions. | `current_uses` counter in the DB increments every time the coupon is redeemed. When `current_uses >= max_uses`, coupon is invalid at checkout. |
| Max Uses per User | `<input type="number">` | `max_uses_per_user` (Int?) | ❌ Optional | Integer ≥ 1. Leave blank = unlimited per user. | Checks the `CouponUsage` table for the specific `user_email`. |
| Applicable Emails | `text` input | `applicable_emails` (String[]) | ❌ Optional | Comma-separated list of email addresses (e.g., `alice@gmail.com, bob@startup.com`). Leave blank = available to ALL users. | The frontend form sends these as a comma-separated string; the admin parses it into an array before saving. Only the listed emails can redeem this coupon. Useful for partner/referral codes. |
| Referrer ID | `text` input | `referrer_id` (UUID) | ❌ Optional | Must be a valid UUID matching an existing user record if provided. | Links this coupon to a specific referrer user for commission tracking in the referral system. |

**"Save Coupon" Button:** `POST /api/coupons/admin` (create) or `PUT /api/coupons/admin/{id}` (edit).

**"Delete" Button:** Browser `confirm()` → `DELETE /api/coupons/admin/{id}`. This is a hard delete — it also cascades to delete all `CouponUsage` records for this coupon.

**"View Usages" Button (per coupon):** Opens a sub-panel showing:
- Every usage entry from the `CouponUsage` table: `user_email`, `used_at` timestamp.
- Useful for auditing who redeemed a code and when.

**⚠️ Security:** Coupon codes are **stripped from all public API responses**. The `/api/events/slug/:slug` endpoint removes `page_blocks.coupon` and `page_blocks.applicable_coupons` before responding. They are only accessible via the authenticated `/api/coupons/admin` endpoint.

---

### 8.9 Mass Mailer (`/admin/mailer`)
**Source:** `web/app/admin/mailer/page.tsx` | **No DB model** — fires live email sends

**Two-tab UI:**

#### Tab 1 — Compose

| Field | Input Type | Required | Notes |
|---|---|---|---|
| Subject | `text` input | ✅ Yes | Validated before send. Shows alert if blank. |
| Message Body | `<textarea>` | ✅ Yes | Plain text or basic HTML. Validated before send. |
| Recipients JSON | `<textarea>` | ✅ Yes | Must be a valid **JSON array** of objects. Each object must have an `email` field. `name` is optional. Example format shown in the UI: `[{ "email": "founder@startup.com", "name": "Rahul Sharma" }, ...]` |

**JSON Validation (client-side, before send):**
1. Parses the textarea as JSON. If invalid, shows: *"Invalid JSON: [parser error message]"*
2. Checks that the parsed value is an array. If not, shows: *"JSON must be an array."*
3. Checks that every item has an `email` field. If any item is missing it, shows: *"Item at index N is missing 'email' field."*

**"Send to All" Button:**
- Shows a browser `confirm()` dialog: *"Send to N recipient(s)?"*
- If confirmed:
  - Switches to the Results tab automatically.
  - Sends emails **one by one**, looping through the recipients array. Each email sends a `POST /api/admin/mailer/send` with `{ email, name, subject, message }`.
  - While sending, `isSending` state is `true` — button is not re-clickable.

#### Tab 2 — Results

| Column | Notes |
|---|---|
| Email | Recipient address |
| Name | Recipient name (if provided) |
| Status | Live-updating: **"Pending"** (grey, while waiting), **"Sent ✓"** (green, delivered), **"Failed ✗"** (red, with error message) |

**Summary Row** (appears after all sends complete): *"X sent, Y failed."* with a list of any failed email addresses and their errors.

---

### 8.10 Mentors (`/admin/mentors`)
**Source:** `web/app/admin/mentors/page.tsx` | **DB Model:** `Mentor` (`mentors`)

**Display:** Photo grid of all mentors. Each card shows the photo, name, title, and active/inactive status.

**"+ Add Mentor" Button:** Opens a modal/form.

#### Mentor Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Full Name | `text` input | `name` | ✅ Yes | Unlimited (TEXT) | Displayed on front face of flip card (overlay text) |
| Title / Designation | `text` input | `title` | ✅ Yes | Unlimited (TEXT) | e.g., "Co-Founder & CEO at Startup XYZ". Shown on front face overlay and back face. |
| Bio | `<textarea>` | `bio` | ❌ Optional | Unlimited (TEXT). Recommend ≤ 250 characters for clean card layout. | Displayed on the back face of the flip card. If too long, the back card will scroll or overflow. |
| Photo | `<input type="file" accept="image/*">` | `photo_url` (stored as S3 URL) | ❌ Optional | No size constraint specified; recommend ≤ 2 MB, square or portrait crop. Min 400×400px for quality. | Uploaded to AWS S3. URL stored in DB. **Fallback if missing:** `https://ui-avatars.com/api/?name={name}` — generates an avatar with initials. |
| LinkedIn URL | `url` input | `linkedin_url` | ❌ Optional | Must be a full URL, e.g., `https://linkedin.com/in/handle`. | Appears as "Connect on LinkedIn" button on the back face of the flip card. **Only shows if this field is non-empty.** |
| Show LinkedIn | `checkbox` | `show_linkedin` (Boolean) | — | Default: `true` | If unchecked, the LinkedIn button is hidden even if `linkedin_url` is set. Note: The global `show_mentors_linkedin` toggle in Site Settings can also hide LinkedIn across all cards at once. |
| Display Order | `<input type="number">` | `display_order` | ✅ Yes | Integer. Controls left-to-right, top-to-bottom position in the mentor grid. | Lower = shown first. |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **OFF** → mentor is hidden from the public-facing `/mentors` page and the homepage mentor ticker. |

**Save/Delete:**
- **"Save Mentor":** `POST /api/admin/mentors` or `PUT /api/admin/mentors/{id}`.
- **"Delete":** `DELETE /api/admin/mentors/{id}`.

---

### 8.11 Partners (`/admin/partners`)
**Source:** `web/app/admin/partners/page.tsx` | **DB Model:** `CommunityPartner` (`community_partners`)

#### Partner Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Partner Name | `text` input | `name` | ✅ Yes | Unlimited (TEXT) | Alt text / fallback label if logo fails to load |
| Logo Image | `<input type="file">` | `logo_url` (S3 URL) | ❌ Optional | Recommend: transparent PNG or SVG, ≤ 1 MB | Logo shown in the homepage auto-scrolling partners ticker |
| Website URL | `url` input | `website_url` | ❌ Optional | Full URL | Makes the logo clickable (links to partner's site). If blank, logo is non-clickable. |
| Display Order | number | `display_order` | ✅ Yes | Integer | Controls position in the ticker |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **OFF** → partner logo is hidden from the public partners ticker section |

---

### 8.12 Mentored Startups (`/admin/mentored-startups`)
**Source:** `web/app/admin/mentored-startups/page.tsx` | **DB Model:** `MentoredStartup` (`mentored_startups`)

#### Mentored Startup Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Startup Name | `text` input | `name` | ✅ Yes | Unlimited (TEXT) | Alt text / label |
| Logo Image | `<input type="file">` | `logo_url` (S3 URL) | ❌ Optional | Transparent PNG preferred | Displayed in the "Startups Mentored By Us" homepage section |
| Website URL | `url` input | `website_url` | ❌ Optional | Full URL | Makes the logo clickable |
| Display Order | number | `display_order` | ✅ Yes | Integer | Controls order |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **OFF** → startup is hidden from the homepage section |

---

### 8.13 Gallery (`/admin/gallery`)
**Source:** `web/app/admin/gallery/page.tsx` | **DB Model:** `GalleryItem` (`gallery_items`)

**⚠️ Content Limit: Maximum 20 active gallery images** (noted in the admin Dashboard welcome message). Exceeding this is technically possible via the API but degrades page performance.

#### Upload Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Image File | `<input type="file" accept="image/*">` | `media_url` (S3 URL) | ✅ Yes | Any image format. Recommend ≤ 3 MB per image. Minimum 800px wide for masonry quality. | Uploaded to AWS S3. |
| Caption | `text` input | `caption` | ❌ Optional | Unlimited (TEXT) | Short description; not currently displayed on the public gallery (used for accessibility `alt` text). |
| Type | Auto-set | `type` | — | Always set to `"image"` for gallery uploads | DB also supports `"video"` type but the admin gallery form only handles image uploads. |
| Display Order | Auto-set | `display_order` | — | Auto-assigned as next sequential integer | Can be manually edited later. |
| Is Active | Checkbox | `is_active` (Boolean) | — | Default: `true` | **OFF** → image hidden from the public gallery and lightbox. |

**"Upload" Button:** `POST /api/admin/gallery` as `multipart/form-data`.

**Per-image Delete (✕ button on hover):**
- Browser `confirm()` dialog.
- `DELETE /api/admin/gallery/{id}` — deletes the database record AND the S3 object.

---

### 8.14 Bottom Videos (`/admin/bottom-videos`)
**Source:** `web/app/admin/bottom-videos/page.tsx` | **DB Model:** `BottomVideoGallery` (`bottom_video_gallery`)

#### Add Video Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| YouTube URL | `url` input | `youtube_url` | ✅ Yes | Must be a standard YouTube URL. Accepted formats: `https://www.youtube.com/watch?v=VIDEO_ID` or `https://youtu.be/VIDEO_ID`. **Do NOT paste `/embed/` URLs** — they will fail the URL constructor parser on the frontend. | The frontend `BottomVideoGallery` component uses JavaScript's `new URL(youtube_url)` to extract `searchParams.get('v')` and constructs `youtube.com/embed/{id}` automatically to bypass SAMEORIGIN restrictions. |
| Title | `text` input | `title` | ❌ Optional | Unlimited (TEXT) | Caption text shown below the video embed on the public homepage. |
| Display Order | `<input type="number">` | `display_order` (default: 0) | ❌ Optional | Integer. Lower = left/top position in the 3-column grid. | If multiple videos share the same order value, their display order is undefined. Avoid duplicates. |
| Is Active | `checkbox` | `is_active` (Boolean) | — | Default: `true` | **OFF** → video hidden from the public bottom video gallery. |

**"Add Video" Button:** `POST /api/admin/bottom_videos`.

**Per-entry Actions:**
- **Edit Button:** Opens inline edit or modal pre-filled with existing data → `PUT /api/admin/bottom_videos/{id}`.
- **Delete Button:** `DELETE /api/admin/bottom_videos/{id}`.

---

### 8.15 Testimonials (`/admin/testimonials`)
**Source:** `web/app/admin/testimonials/page.tsx` | **DB Model:** `Testimonial` (`testimonials`)

**Two tabs in the list view:** "Text Testimonials" and "Video Testimonials". Each tab shows only entries of that `type`. Tab switching is client-side (no API call).

- **Text testimonials** are sorted by `created_at` descending (newest first).
- **Video testimonials** are sorted by `display_order` ascending (lowest first).

**"+ Add Testimonial" Button:** Opens modal. New video entries auto-suggest the next `display_order` value.

#### Testimonial Form — Type Selector (applies to both modes)

| Field | Input Type | DB Column | Notes |
|---|---|---|---|
| Type | `<select>` | `type` (String) | Options: `"Text Testimonial"` (value: `text`) or `"Video Testimonial"` (value: `video`). **Selecting a type shows/hides the conditional fields below.** |
| Rating | `<select>` | `rating` (Int?, default: 5) | Options: "None (No Rating)", "5 Stars" (★★★★★), "4 Stars", "3 Stars", "2 Stars", "1 Star". Stars rendered as ★ symbols in the admin list and on the public carousel card. |
| Event Tag | `text` input | `event_tag` | Optional. Free-text label like "Fundraising Workshop Apr '25". Appears as a small grey badge on the testimonial card in the admin list. Not displayed on the public frontend currently. |

#### Text Testimonial Fields (visible when type = `text`)

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Name | `text` input | `name` | ✅ Yes (`required` attr) | Unlimited (TEXT) | The founder's/student's name. Displayed on the testimonial card. **⚠️ Gibberish check:** If this looks like keyboard-smash (e.g., "jhg", "asdfgh"), the backend `isGibberish` filter will hide it from the public API. |
| Title / Designation | `text` input | `designation` | ❌ Optional | Unlimited (TEXT) | e.g., "Founder, XYZ Startup" or "MBA Student, IIM-A". Shown below the name. **⚠️ Gibberish check applies.** |
| City | `text` input | `city` | ❌ Optional | Unlimited (TEXT) | City of the person. Shown alongside designation. |
| Quote | `<textarea rows="4">` | `quote` | ✅ Yes (`required` attr) | Unlimited (TEXT). Recommend ≤ 300 characters for clean card display (longer quotes get clamped with `line-clamp`). | The testimonial body text. **⚠️ Gibberish check applies** — if the quote looks like test data, it will be filtered from the public API. |
| Photo | `<input type="file" accept="image/*">` | `photo_url` (S3 URL) | ❌ Optional | Any image format | Displayed as a small avatar next to the quote. |

#### Video Testimonial Fields (visible when type = `video`)

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Display Order | `<input type="number">` | `display_order` | ✅ Yes (`required` attr for video type) | Integer. Auto-suggested as max existing order + 1. | Controls the position of this video in the carousel. |
| Name (Optional) | `text` input | `name` | ❌ Optional | Unlimited (TEXT) | Optional label shown alongside the video (e.g., founder name). |
| YouTube Embed URL | `text` input | `youtube_url` | ✅ Yes (`required` attr) | Must be a full YouTube URL (any format: `watch?v=`, `youtu.be/`, or already `embed/`). **⚠️ Warning:** Do NOT use blacklisted placeholder IDs (`dQw4w9WgXcQ`, `jNQXAC9IVRw`) — the backend filters these out and the video will never appear publicly. | The URL is stored as-is; the frontend component converts it to an embed URL. |
| Video Title | `text` input | `video_heading` | ❌ Optional | Unlimited (TEXT) | Headline shown above or below the video player |
| Video Description | `<textarea rows="4">` | `video_description` | ❌ Optional | Unlimited (TEXT) | Supporting text. |
| Show Description | `checkbox` | `show_description` (Boolean, default: `false`) | — | **Checked** → `video_description` text is visible on the public carousel card. **Unchecked** → description is stored but hidden from public view. |

**Save/Delete:**
- **"Save" Button:** `POST /api/admin/testimonials` (create) or `PUT /api/admin/testimonials/{id}` (edit). Sent as `multipart/form-data` (to support photo upload).
- **"Delete" Button:** Browser `confirm()` → `DELETE /api/admin/testimonials/{id}`.

---

### 8.16 Tools & Resources (`/admin/tools`)
**Source:** `web/app/admin/tools/page.tsx` | **DB Models:** `Grant`, `PitchDeck`, `Investor`, `Incubator`, `FounderEvent`

This page contains sub-sections for each tool directory.

#### Grants — Full Field Reference (`Grant` model, `grants` table)

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Title | `text` | `title` | ✅ Yes | Unlimited (TEXT) | Grant name, e.g., "DPIIT Startup India Seed Fund" |
| Description | `<textarea>` | `description` | ❌ Optional | Unlimited (TEXT) | Full description of what the grant offers |
| Amount | `text` | `amount` | ❌ Optional | Unlimited (TEXT); free-text | e.g., "Up to ₹20 Lakhs" |
| Deadline | `text` | `deadline` | ❌ Optional | Free-text date string | e.g., "31 March 2026" or "Rolling basis" |
| Eligibility | `<textarea>` | `eligibility` | ❌ Optional | Unlimited (TEXT) | Who can apply; conditions |
| Official URL (Link) | `url` | `link` | ❌ Optional | Full URL | "Visit Official Site" button on the grant card |
| Ministry / Authority | `text` | `ministry` | ❌ Optional | Unlimited | e.g., "Ministry of Commerce" |
| Sectors | `text` | `sectors` | ❌ Optional | Comma-separated or free-text | e.g., "Technology, Agriculture, Manufacturing" |
| Benefits | `<textarea>` | `benefits` | ❌ Optional | Unlimited | What the grantee receives |
| Benefit Tags | `text` | `benefitTags` | ❌ Optional | Comma-separated | Short tags for filter pills (e.g., "Equity Free, Non-Dilutive") |
| Tenure | `text` | `tenure` | ❌ Optional | Free-text | Duration of funding or repayment period |
| How to Apply | `<textarea>` | `howToApply` | ❌ Optional | Unlimited | Step-by-step application instructions |
| Documents Needed | `<textarea>` | `documentsNeeded` | ❌ Optional | Unlimited | Checklist of required documents |
| Affiliation | `text` | `affiliation` | ❌ Optional | Unlimited | e.g., "Government of India", "State Government", "NGO" |
| Verified | `checkbox` | `verified` (Boolean, default: `false`) | — | **Checked** → shows a "Verified" badge on the public grant card | |
| Is Active | `checkbox` | `is_active` (Boolean, default: `true`) | — | **OFF** → grant hidden from the public Grants Directory | |

**Bulk Import:** Paste or upload a JSON array of grant objects matching the above schema. Each object is validated and inserted/updated via a batch API call.

---

### 8.17 Chat Widgets (`/admin/chat-widgets`)
**Source:** `web/app/admin/chat-widgets/page.tsx` | **DB Model:** `ChatWidget` (`chat_widgets`)

**Purpose:** These widgets appear in the `ChatBotGate` floating action area (bottom-right corner of every page). Each widget renders as a circular floating button.

**"+ Add New Widget" Button:** Opens a modal.

#### Chat Widget Form — Full Field Reference

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Title | `text` input | `title` | ✅ Yes | Unlimited (TEXT) | Display label shown as tooltip or label next to the button (e.g., "WhatsApp Support") |
| Subtitle | `text` input | `subtitle` | ❌ Optional | Unlimited (TEXT) | Secondary smaller label (e.g., "Reply within 2 hours") |
| Icon | `text` input | `icon` | ❌ Optional | Font Awesome CSS class string | Must be a valid Font Awesome 5 class, e.g., `fab fa-whatsapp`, `fas fa-comments`, `fas fa-phone`. The icon renders inside the floating circle button. |
| Link | `url` input | `link` | ✅ Yes | Full URL | Where clicking the widget takes the user. Examples: `https://wa.me/919999999999` (WhatsApp), `tel:+919999999999` (phone call), `https://kickkers.ai/widget/...` (chatbot). |
| Display Order | `<input type="number">` | `display_order` (Integer) | ✅ Yes | Lower number = shown higher in the stack | Controls which widget appears first in the vertical floating stack. |
| Is Active | `checkbox` | `is_active` (Boolean, default: `true`) | — | **OFF** → widget is hidden from the public site | |

**Save/Delete:**
- **"Save Widget":** `POST /api/chat-widgets` or `PUT /api/chat-widgets/{id}`.
- **"Delete":** `DELETE /api/chat-widgets/{id}`.

---

### 8.18 Site Settings (`/admin/settings`)
**Source:** `web/app/admin/settings/page.tsx` | **DB Model:** `SiteSetting` (`site_settings`) + `PromoBar` (`promo_bar`)

**This is the master control centre.** Three independent save forms on this page.

---

#### Panel 1 — Footer Details

Saved via `PUT /api/admin/site_settings`. Stored in `SiteSetting` table.

| Field | Input Type | DB Column | Required | Constraint | Notes |
|---|---|---|---|---|---|
| Registered Address | `<textarea>` (min-height 100px) | `address` | ❌ Optional | Unlimited (TEXT) | The company's official address. Displayed in the website footer and/or contact section. Multi-line text supported. Example: "123 Startup Lane, Bengaluru, Karnataka — 560001" |
| Contact Email | `<input type="email">` | `contact_email` | ❌ Optional | Valid email format enforced by browser | Displayed in the footer and may be used in email headers. Example: `hello@thestartupschool.in` |
| Contact Phone | `<input type="text">` | `contact_phone` | ❌ Optional | No format enforced — free-text. Include country code for international display: `+91 98765 43210` | Displayed in footer. |

**"Save Settings" Button:** `PUT /api/admin/site_settings` with `{ address, contact_email, contact_phone, section_toggles, section_headings }` (all in one payload).

---

#### Panel 2 — Section Visibility (Homepage)

Each row is a **toggle switch** (styled `<input type="checkbox" class="sr-only">` with a custom sliding pill overlay). Blue pill = ON. Grey pill = OFF.

**Logic:** `checked={formData.section_toggles[key] !== false}` — meaning if the key is missing from the JSON or is `true`, the switch is ON. It's only OFF when explicitly `false`.

| Toggle Label | Toggle Key | Effect when OFF (`false`) |
|---|---|---|
| Pinned Event / Workshop Preview | `show_pinned_event` | Hides the `WorkshopPreview` card on the homepage. The auto-rotating upcoming event card disappears entirely. |
| Mentors Preview | `show_mentors` | Hides the auto-scrolling mentor ticker section (`MentorsPreview` component) and its section heading. |
| Tools Showcase | `show_tools` | Hides the entire Tools & Resources section (`ToolsShowcase` component) including all tool cards. |
| Founder Manifesto | `show_founder_manifesto` | Hides the `FounderManifesto` full-width editorial section with the founder's quote and photo. |
| Programs Launching Soon | `show_programs` | Hides the `Programs` section — the dark program cards grid and its heading disappear. |
| Video & Gallery | `show_video_gallery` | Hides the `VideoAndGallery` section (dynamic video gallery CMS component). |
| Events Gallery | `show_past_events` | Hides the `EventsGallery` horizontal scrollable events card row. |
| Community Gallery | `show_community_gallery` | Hides the masonry image gallery section (`Gallery` component). The lightbox is also unavailable. |
| Startups Mentored | `show_startups` | Hides the `StartupsMentored` grid/ticker of mentored startup logos. |
| Testimonials | `show_testimonials` | Hides the entire `Testimonials` carousel. No "What Founders Say" section appears. |
| Ecosystem Partners | `show_partners` | Hides the `EcosystemPartners` auto-scrolling logo ticker. |
| Students From | `show_students_from` | Hides the `StudentsFrom` section showing origin universities/companies. |

**Additional Testimonial Type Toggles** (sub-section within Panel 2):

| Toggle Label | Toggle Key | Effect when OFF |
|---|---|---|
| Video Testimonials | `testi_video` | Video testimonial cards are excluded from the carousel even if `show_testimonials` is ON. |
| Text Testimonials | `testi_text` | Text testimonial cards are excluded from the carousel even if `show_testimonials` is ON. |

**"Save Visibility Settings" Button:** `PUT /api/admin/site_settings` (same endpoint as Footer Details — sends the complete settings object).

---

#### Individual Tool Visibility Controls (sub-section of Panel 2)

Each tool has **two independent controls** side by side:

**Control A — "Visible" toggle switch:**
- **ON** → tool card appears in the Tools Showcase section on the homepage.
- **OFF** → tool card is hidden from the homepage Tools section (but the tool page itself at `/tools/grants` etc. may still be accessible by direct URL).

**Control B — "Status" dropdown (`live` or `upcoming`):**
- **`live`** → tool card is fully clickable with a working link to the tool page.
- **`upcoming`** → tool card shows a "Coming Soon" / "Upcoming" badge and is **not clickable**. Users can see the card but cannot access the tool.

The combination of both controls produces these 4 actual stored values:

| Visible toggle | Status dropdown | Stored value in `section_toggles` | What the user sees on the homepage |
|---|---|---|---|
| ON | Live | `"live"` | Clickable tool card with "Access Tool →" link |
| ON | Upcoming | `"upcoming"` | Non-clickable card with "Upcoming" badge |
| OFF | Live | `"disabled_live"` | Tool card hidden from homepage |
| OFF | Upcoming | `"disabled_upcoming"` | Tool card hidden from homepage |

| Tool | Toggle Key |
|---|---|
| Government Grants | `tool_grants` |
| Pitch Deck Library | `tool_pitch_decks` |
| Events Calendar | `tool_calendar` |
| Incubators & Accelerators | `tool_incubators` |
| Investor Database | `tool_investors` |

---

#### Panel 3 — Promo Bar Settings

Saved via `PUT /api/admin/promo_bar`. Stored in the `PromoBar` table (separate from `SiteSetting`).

**Master Active Toggle** (large pill, top-right of the panel header):
- **ON (blue pill)** → the promo bar renders at the very top of every page (above the Navbar), visible to all visitors.
- **OFF (grey pill)** → the promo bar is completely hidden from the entire site. All other fields still save but have no effect while toggled off.

| Field | Input Type | DB Column | Required | Example Value | Notes |
|---|---|---|---|---|---|
| Title | `<input type="text">` | `title` | ✅ Yes | "2 Day Gen-AI Mastermind" | The headline announcement text shown prominently in the bar. Keep under 60 characters for single-line display on desktop. |
| Button Text | `<input type="text">` | `button_text` | ✅ Yes | "Join the free Mastermind" | The CTA button label inside the promo bar. Keep under 30 characters. |
| Button Link | `<input type="text">` | `button_link` | ✅ Yes | `/events` or `https://rzp.io/...` | Can be an internal path (e.g., `/fundraising-workshop-15apr`) or an external URL. The entire promo bar is a clickable link to this URL. |
| Price Text | `<input type="text">` | `price_text` | ❌ Optional | "₹24,999 Free" | Shown with special formatting (often crossed-out old price + free). Leave blank to hide this element. |
| Subtext | `<input type="text">` | `subtext` | ❌ Optional | "Offer expires in 04:53" | Smaller supporting text. Useful for urgency messaging. Leave blank to hide. |

**"Save Promo Bar" Button:** `PUT /api/admin/promo_bar`.  
**Loading state:** "Saving…" text, button disabled.  
**Success:** Green "✓ Saved successfully" flash (auto-hides after 3 seconds).

---

#### Panel 4 — Certifications & Badges (Future)

- **Status:** Placeholder UI only. Badge upload requires S3 configuration — noted as "coming in Phase 2".
- Currently shows a grey italic notice: *"Badge upload requires S3 configuration — coming in Phase 2."*
- No save button is available for this panel yet.

---

### 8.19 LMS Handoff (`/admin/handoff`)
**Source:** `web/app/admin/handoff/page.tsx` | **Auth required:** No (renders without sidebar)

**Purpose:** A zero-UI, instant-redirect bridge for SSO-lite login from the Setu LMS platform.

**Flow:**
1. LMS admin clicks "Manage Event" on an LMS course.
2. LMS generates a one-time token (server-side, stored temporarily) and redirects to: `/admin/handoff?token={ONE_TIME_TOKEN}&next=/admin/events/{event_id}/builder`
3. The handoff page's `useEffect` reads both URL parameters.
4. Calls `POST /api/admin/handoff-exchange` with `{ token: "{ONE_TIME_TOKEN}" }`.
5. The backend validates the token (checks it exists, hasn't expired, hasn't been used), returns a full admin JWT.
6. JWT is stored as `adminToken` in `localStorage`.
7. Browser is redirected to the `next` URL using `router.replace()` (no browser history entry).

**Security Guardrail:** The `next` parameter is validated. If it does NOT start with `/admin`, it is replaced with `/admin/events`. This prevents open redirect attacks.

**Error State:** If the token exchange fails (expired, already used, invalid), a red error card is shown: *"Sign-in link problem — [error from server]. Go back to the LMS and click the button again."*

**Loading State:** While the exchange is in progress, shows a purple spinning icon + "Signing you in… Taking you to the event builder."

---



**Access:** JWT-based authentication. Token stored in `localStorage` as `adminToken` AND as a `SameSite=Strict` cookie for Edge middleware route protection. Token expires after 24 hours (`max-age=86400`).  
**Login API:** `POST /api/admin/login` → `{ email, password }` → returns `{ token }`.  
**Token Verify:** `GET /api/admin/verify` with `Authorization: Bearer {token}` header.

### Admin Sidebar Navigation Groups

The admin layout (`web/app/admin/layout.tsx`) renders a persistent left sidebar with these grouped navigation categories:

| Group | Links |
|---|---|
| **Overview** | Dashboard |
| **Core Pages** | Hero & Homepage, Events & Workshops, Programs |
| **Sales & Data** | Registrations, Leads, Helpdesk Tickets, Coupons, Mass Mailer |
| **People & Entities** | Mentors, Partners, Mentored Startups |
| **Content & Widgets** | Gallery, Bottom Videos, Testimonials, Tools & Resources, Chat Widgets |
| **System** | Site Settings |

**Log Out Button:** Bottom of sidebar. Clears `adminToken` from `localStorage` and removes the auth cookie. Redirects to `/admin` login page.

---

### 8.0 Admin Login Page (`/admin`)
- **Access:** Public page (no auth required).
- **Form Fields:**
  - **Email Address** (`email`, required)
  - **Password** (`password`, required)
- **"Sign In" Button:** Calls `POST /api/admin/login`. On success, saves JWT to localStorage and sets cookie, then redirects to `/admin/dashboard`. On failure, shows red error banner.

---

### 8.1 Dashboard (`/admin/dashboard`)
- **Data Source:** `GET /api/admin/dashboard-stats` (authenticated)
- **Primary KPI Stat Cards (row 1):**
  - **Active Events** — count of all `is_active: true` events currently live on site.
  - **Active Mentors** — count of all `is_active: true` mentors.
  - **New Leads** — count of leads received in the current period, with total cumulative lead count shown as a badge.
- **Secondary Stat Cards (row 2):**
  - **Programs** — total programs in database.
  - **Gallery Items** — total gallery image count.
  - **Partners** — total partner logos.
- **Quick Action Buttons:**
  - **"Manage Events"** → navigates to `/admin/events`.
  - **"View Leads"** → navigates to `/admin/leads`.

---

### 8.2 Hero & Homepage (`/admin/hero`)
- **Source:** `web/app/admin/hero/page.tsx`
- **Editor:** Uses the **ReactQuill** rich-text editor (toolbar supports: headings H1–H3, bold, italic, underline, strike, blockquote, ordered/unordered lists, text color, background color, text alignment, links, clear formatting).

**Panel 1 — Hero Text (3 Scenes)**

Each scene has a "Main Heading" and "Tagline" rich-text editor field. Changes saved via `PUT /api/admin/homepage_content`.

| Scene | Fields | Purpose |
|---|---|---|
| **Scene 1: The Hook** | `hero_heading`, `hero_tagline` | Primary hero statement. Large H1 visible on initial load. |
| **Scene 2: The Bridge** | `hero_scene1_heading`, `hero_scene1_tagline` | Transition slide showing the problem/gap. |
| **Scene 3: The Roadmap** | `hero_scene2_heading`, `hero_scene2_tagline` | CTA-driving final slide showing the solution. |

- **Save Button — "Save Text Settings":** `PUT /api/admin/homepage_content` with all 6 fields + `hero_rotation_seconds`. Shows "Saving…" state and green "✓ Saved" flash.

**Panel 2 — Homepage Section Headings**

Override the **Main Title** and **Subtitle** for each of these 11 homepage sections (each with its own ReactQuill editor pair):

| Section Key | Display Name |
|---|---|
| `tools_showcase` | Tools & Resources |
| `mentors_preview` | Mentors Preview |
| `events_gallery` | Events Gallery |
| `community_gallery` | Community Gallery |
| `video_gallery` | Video & Media Gallery |
| `programs` | Upcoming Programs |
| `founder_manifesto` | Founder Manifesto |
| `startups_mentored` | Startups Mentored |
| `testimonials` | Testimonials |
| `partners` | Ecosystem Partners |
| `students_from` | Students From |

- **Save Button — "Save Headings":** `PUT /api/admin/site_settings` with `{ section_headings: {...} }`. Shows "Saving…" and green "✓ Saved" flash.

**Panel 3 — Hero Background Slides & Timing**

- **Time per slide (sec):** Number input (1–30). Changes auto-save immediately via `PUT /api/admin/homepage_content` on blur.
- **Slide Limit:** Maximum 6 active slides.
- **"Upload Slide" form:**
  - **Image File** (`file`, `image/*`, max 5MB): Select a new image file from disk.
  - **"Upload Slide" Button:** `POST /api/admin/hero_slides` (multipart/form-data with `image` + `display_order`). Uploads to S3 and saves URL in database.
- **Existing Slide Management (grid view):**
  - Hover reveals a red **"Delete"** button → calls `DELETE /api/admin/hero_slides/{id}` with confirmation prompt.
  - **Order badge** on each slide shows `Order: N`.
  - **← → arrow buttons** on each slide badge: re-order slides. Calls `PUT /api/admin/hero_slides/{id}` for each affected slide to update `display_order` sequentially, then refreshes.

---

### 8.3 Events & Workshops (`/admin/events`)
- **Source:** `web/app/admin/events/page.tsx`
- **Displays:** Full table of all events (past and upcoming) with sortable columns.
- **Table Columns:** Title, Status (Live/Past/Pinned), Date, City, Actions.
- **"+ New Event" Button:** Opens a full-page form or modal to create a new event.

**Event Form Fields (Create & Edit):**

| Field | Type | Notes |
|---|---|---|
| Title | text | Required |
| Description | textarea (rich text) | Required |
| Slug | text | URL-safe slug for `/events/{slug}`. Must be unique. |
| Banner Image | file upload | Uploaded to AWS S3; URL saved to database. |
| Venue | text | Physical venue name or "Online" |
| City | text | City name |
| Start Date | date | Required |
| End Date | date | Required |
| Start Time | time | Optional |
| End Time | time | Optional |
| Registration URL | url | External Razorpay/Instamojo/other link |
| Is Pinned | checkbox | Shows event in the homepage `WorkshopPreview` card |
| Is Active | checkbox | Controls visibility on the public site |
| Is Past | checkbox | Marks event as past; moves to "Past Events" tab |

- **"Save Event" Button:** `POST /api/admin/events` (new) or `PUT /api/admin/events/{id}` (edit).
- **"Delete" Button:** `DELETE /api/admin/events/{id}` with confirmation prompt.

**Event Page Builder (`/admin/events/[id]/builder`)**

A visual JSON block editor for the event detail page content:
- **Block Types Available:** Hero, Schedule, Speakers, Pricing Tier, FAQ, Text Block, Image Block.
- **Add Block Button:** Appends a new block of the selected type to the `page_blocks` JSON array.
- **Reorder Blocks:** Drag or use up/down arrows to rearrange blocks.
- **Delete Block:** Red ✕ button on each block removes it.
- **Save Page Builder Button:** `PUT /api/admin/events/{id}` with the updated `page_blocks` JSON payload.
- **LMS Handoff Access:** If the LMS admin triggers a "Manage Event" action, the browser is redirected to `/admin/handoff?token={one-time-token}&next=/admin/events/{id}/builder`. The handoff page exchanges the one-time token for a full admin JWT without requiring a password login (SSO-lite).

---

### 8.4 Programs (`/admin/programs`)
- **Source:** `web/app/admin/programs/page.tsx`
- **Displays:** List of all programs with title and active toggle.

**Program Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Title | text | e.g., "7 days Sprint" |
| Subtitle | text | e.g., "The Spark" |
| Description | textarea | Displayed on the program card |
| Duration / Bullet Points | text | Comma-separated; each renders as a bullet on the card |
| CTA Text | text | Button label, e.g., "Apply Now" |
| Is Active | checkbox | Hides/shows the card on homepage |

- **"Save Program" Button:** `POST` (new) or `PUT /api/admin/programs/{id}` (edit).
- **"Delete" Button:** `DELETE /api/admin/programs/{id}` with confirmation.

---

### 8.5 Registrations (`/admin/registrations`)
- **Source:** `web/app/admin/registrations/page.tsx`
- **Data Source:** `GET /api/admin/registrations` (authenticated)
- **Read-only** view. Shows all paid registrations across all events.

**Table Columns:**
- User Name, User Email, Event (dropdown filter), Ticket Tier (filter), Status (filter: `paid` / `pending` / `failed`), Amount (₹), Razorpay Order ID, Razorpay Payment ID, Guest Name, Guest Email, Guest Phone, Created At.

**Filters:**
- **Filter by Event:** Dropdown of all events.
- **Filter by Tier:** Dropdown populated from unique ticket tiers in registrations data.
- **Filter by Status:** `paid` / `pending` / `failed` pills.

**"Export to Excel" Button:** Generates and downloads a `.xlsx` file of the filtered registrations list using the `xlsx` library (client-side). No API call required for export.

---

### 8.6 Leads (`/admin/leads`)
- **Source:** `web/app/admin/leads/page.tsx`
- **Data Source:** `GET /api/admin/leads` (authenticated)
- **Read-only** table of all contact form submissions.

**Table Columns:** Name, Email, Phone, City, Source (e.g., `contact_section`, `mentor_application`), Submitted At.

**Filter/Search:** Filter by source tag. Search by name or email.

**"Export" Button:** Download leads as CSV/Excel.

---

### 8.7 Helpdesk Tickets (`/admin/helpdesk`)
- **Source:** `web/app/admin/helpdesk/page.tsx`
- **Data Source:** `GET /api/admin/helpdesk` (authenticated)
- **Displays:** List of all support tickets submitted by users via the helpdesk form.

**Ticket Card Details:** Ticket ID, User name, User email, Subject, Message body, Status (Open/Resolved), Submitted At.

**Actions per ticket:**
- **Mark as Resolved button:** Updates ticket status to `resolved` via `PATCH /api/admin/helpdesk/{id}`.
- **Delete button:** `DELETE /api/admin/helpdesk/{id}`.

---

### 8.8 Coupons (`/admin/coupons`)
- **Source:** `web/app/admin/coupons/page.tsx`
- **Data Source:** `GET /api/coupons/admin` (authenticated)
- **Displays:** Table of all discount coupons with usage stats.

**"+ New Coupon" Button:** Opens a modal with the coupon form.

**Coupon Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Code | text | The discount code string (e.g., `SETU20`) |
| Type | select | `percentage` or `flat` |
| Discount Value | number | % off (if percentage) or ₹ off (if flat) |
| Is Active | checkbox | Enables/disables the coupon |
| Start Date | date | Optional activation date |
| End Date | date | Optional expiry date |
| Max Uses (total) | number | Global usage cap; leave blank for unlimited |
| Max Uses per User | number | Per-user cap; leave blank for unlimited |
| Applicable Emails | text | Comma-separated email whitelist; blank = open to all |
| Referrer ID | text | Optional internal referrer tagging |

- **"Save Coupon" Button:** `POST /api/coupons/admin` (new) or `PUT /api/coupons/admin/{id}` (edit).
- **"Delete" Button:** `DELETE /api/coupons/admin/{id}` with confirmation.
- **"View Usages" Button:** Opens a panel showing every redemption of the coupon — user email, order ID, timestamp.
- **⚠️ Security Note:** Coupon codes are **never** exposed in the public `/api/events` or `/api/events/slug/:slug` responses. They only appear in the authenticated admin API.

---

### 8.9 Mass Mailer (`/admin/mailer`)
- **Source:** `web/app/admin/mailer/page.tsx`
- **Purpose:** Send a bulk email to a manually-specified list of recipients.
- **Tabs:** "Compose" (write the email) and "Results" (live delivery progress).

**Compose Tab Fields:**

| Field | Type | Notes |
|---|---|---|
| Subject | text | Email subject line |
| Message Body | textarea | Plain text or HTML email body |
| Recipients JSON | textarea (JSON) | Array of `{ email, name }` objects. Example format is provided in the UI. |

- **JSON Validation:** Parsed client-side before send. Shows specific error if JSON is malformed or if any entry is missing an `email` field.
- **"Send to All" Button:** Requires confirmation prompt showing recipient count. Sends emails one-by-one via `POST /api/admin/mailer/send` for each recipient. Switches to Results tab automatically.

**Results Tab:**
- Shows a live updating list with status per recipient: **Pending** (grey), **Sent ✓** (green), **Failed ✗** (red + error message).
- **Summary row** at top: "X sent, Y failed."

---

### 8.10 Mentors (`/admin/mentors`)
- **Source:** `web/app/admin/mentors/page.tsx`
- **Data Source:** `GET /api/admin/mentors` (authenticated)
- **Displays:** Grid or table of all mentors with photo preview, name, and active toggle.

**"+ Add Mentor" Button:** Opens modal/form.

**Mentor Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Full Name | text | Required |
| Title / Designation | text | e.g., "Co-Founder & CEO at XYZ" |
| Bio | textarea | Displayed on the back face of the flip card |
| Photo | file upload | Uploaded to AWS S3; URL saved to database. Falls back to `ui-avatars.com` if missing. |
| LinkedIn URL | url | Link for the "Connect on LinkedIn" button |
| Is Active | checkbox | Hides/shows mentor from the public site |

- **"Save Mentor" Button:** `POST /api/admin/mentors` (new) or `PUT /api/admin/mentors/{id}` (edit).
- **"Delete" Button:** `DELETE /api/admin/mentors/{id}`.
- **Order:** Mentors are displayed in database insertion order. No drag-reorder UI currently.

---

### 8.11 Partners (`/admin/partners`)
- **Source:** `web/app/admin/partners/page.tsx`
- **Data Source:** `GET /api/admin/partners` (authenticated)
- **Displays:** List of ecosystem partner logos for the auto-scrolling ticker section.

**Partner Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Partner Name | text | Required |
| Logo Image | file upload | Uploaded to S3 |
| Website URL | url | Optional link |
| Is Active | checkbox | Controls visibility in the ticker |

- **"Save Partner" / "Delete" Buttons:** Standard CRUD via `/api/admin/partners`.

---

### 8.12 Mentored Startups (`/admin/mentored-startups`)
- **Source:** `web/app/admin/mentored-startups/page.tsx`
- **Purpose:** Manage the logos/names displayed in the "Startups Mentored By Us" homepage section.

**Startup Entry Fields:**

| Field | Type | Notes |
|---|---|---|
| Startup Name | text | Required |
| Logo Image | file upload | Uploaded to S3 |
| Website URL | url | Optional |
| Is Active | checkbox | |

---

### 8.13 Gallery (`/admin/gallery`)
- **Source:** `web/app/admin/gallery/page.tsx`
- **Data Source:** `GET /api/admin/gallery` (authenticated)
- **Displays:** Masonry or grid view of all uploaded community gallery images.
- **Content Limit:** Maximum 20 gallery images (as noted in the dashboard welcome message).

**"Upload Image" Form:**
- **Image File** (`file`, `image/*`): Select file from disk.
- **Caption** (`text`, optional): Image description.
- **"Upload" Button:** Sends `POST /api/admin/gallery` as multipart/form-data. Image is uploaded to AWS S3; URL saved to database.

**Existing Image Actions:**
- **Delete (✕) Button:** `DELETE /api/admin/gallery/{id}` with confirmation. Also deletes the S3 object.

---

### 8.14 Bottom Videos (`/admin/bottom-videos`)
- **Source:** `web/app/admin/bottom-videos/page.tsx`
- **Purpose:** Manage YouTube videos displayed in the 3-column "Bottom Video Gallery" on the homepage.

**"Add Video" Form Fields:**

| Field | Type | Notes |
|---|---|---|
| YouTube URL | url | Full YouTube URL (`watch?v=` or `youtu.be/`). Admin enters the standard consumer URL — the frontend component parses and converts it to `embed/` format automatically. |
| Title | text | Caption shown below the embed on the frontend |
| Display Order | number | Controls position in the grid |

- **"Add Video" Button:** `POST /api/admin/bottom_videos`.
- **Edit / Delete Buttons:** Per-entry inline editing or `DELETE /api/admin/bottom_videos/{id}`.
- **Important:** Do **not** paste `/embed/` URLs directly; paste the standard `https://www.youtube.com/watch?v=...` URL.

---

### 8.15 Testimonials (`/admin/testimonials`)
- **Source:** `web/app/admin/testimonials/page.tsx`
- **Purpose:** Manage the "What Founders Say" testimonials carousel on the homepage.

**Testimonial Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Type | select | `video` or `text` |
| Video URL | url | (Video type only) Standard YouTube `watch?v=` URL. Frontend auto-converts to `embed/`. |
| Quote | textarea | (Text type only) The testimonial quote body |
| Author Name | text | (Text type only) Required for text testimonials |
| Designation / Company | text | (Text type only) e.g., "Founder, XYZ Startup" |
| Is Active | checkbox | |

- **⚠️ Sanitization Warning:** The backend `isGibberish` filter on `GET /api/homepage` will automatically **hide** text testimonials where the quote, author name, or designation consists of keyboard-smash / test data (e.g., "jghgf", "sdfgh"). Always enter real, meaningful content.
- **⚠️ Video Placeholder Warning:** The backend also filters out hardcoded placeholder YouTube video IDs (`dQw4w9WgXcQ`, `jNQXAC9IVRw`). Use real video URLs only.
- **"Save Testimonial" / "Delete" Buttons:** Standard CRUD via `/api/admin/testimonials`.

---

### 8.16 Tools & Resources (`/admin/tools`)
- **Source:** `web/app/admin/tools/page.tsx`
- **Purpose:** Manage the content within the tool directories (primarily the Grants & Schemes directory).

**Grants Management Sub-section:**

| Field | Type | Notes |
|---|---|---|
| Grant Name | text | Required |
| Category | text/select | e.g., "Equity Free", "State Subsidy" |
| Description | textarea | Full description |
| Eligibility | textarea | Who can apply |
| Official URL | url | Link to the government/agency website |
| Language | select | English / Hindi / Regional |
| Is Active | checkbox | |

- **Bulk Import:** Supports importing a JSON array of grant objects from a file upload.
- **"Save Grant" / "Delete" Buttons:** Standard CRUD via `/api/admin/grants`.

---

### 8.17 Chat Widgets (`/admin/chat-widgets`)
- **Source:** `web/app/admin/chat-widgets/page.tsx`
- **Purpose:** Manage the floating chat/contact widgets displayed in the `ChatBotGate` component (e.g., WhatsApp link, chatbot toggle buttons).

**"+ Add New Widget" Button:** Opens a modal.

**Widget Form Fields:**

| Field | Type | Notes |
|---|---|---|
| Title | text | Widget label (e.g., "WhatsApp Support") |
| Subtitle | text | Secondary label or description |
| Icon | text | Font Awesome class string (e.g., `fab fa-whatsapp`) |
| Link | url | The action URL when clicked |
| Display Order | number | Controls order in the floating stack |
| Is Active | checkbox | Shows/hides this widget |

- **"Save Widget" Button:** `POST /api/chat-widgets` (new) or `PUT /api/chat-widgets/{id}` (edit).
- **"Delete" Button:** `DELETE /api/chat-widgets/{id}`.

---

### 8.18 Site Settings (`/admin/settings`)
- **Source:** `web/app/admin/settings/page.tsx`
- **This is the master control panel.** All changes take effect immediately on the next public page load.

**Panel 1 — Promo Bar Settings**

Controls the top-of-page promotional banner visible on every page.

| Field | Type | Notes |
|---|---|---|
| Title / Main Text | text | The headline message in the bar |
| Button Text | text | CTA button label |
| Button Link | url | Where the CTA button points |
| Price Text | text | Optional price display (e.g., "₹999") |
| Sub-text | text | Secondary smaller text |
| Is Active | toggle/checkbox | Shows or hides the entire promo bar |

- **"Save Promo Bar" Button:** `PUT /api/admin/promo_bar`.

**Panel 2 — Site Contact Details**

| Field | Type | Notes |
|---|---|---|
| Address | text | Physical office address (used in footer/contact) |
| Contact Email | email | Public contact email |
| Contact Phone | tel | Public contact number |

**Panel 3 — Section Toggles**

A grid of **ON/OFF toggle switches** controlling visibility of every major homepage section. Each toggle immediately reflects on the site without a build step.

| Toggle | Controls |
|---|---|
| `show_pinned_event` | Upcoming Events Showcase card |
| `show_mentors` | Mentors Preview ticker |
| `show_mentors_linkedin` | LinkedIn links on mentor cards |
| `show_tools` | Tools & Resources section |
| `show_past_events` | Events Gallery section |
| `show_community_gallery` | Community Image Gallery |
| `show_video_gallery` | Video Gallery section |
| `show_testimonials` | Testimonials carousel |
| `show_students_from` | Students From section |
| `show_partners` | Ecosystem Partners ticker |
| `show_programs` | Upcoming Programs section |
| `show_founder_manifesto` | Founder Manifesto section |
| `show_startups` | Startups Mentored section |

**Tool Card Status Controls** (each can be set to `true`, `"coming_soon"`, or `"disabled"`):

| Toggle | Controls |
|---|---|
| `tool_grants` | Grants & Schemes tool card |
| `tool_pitch_decks` | Pitch Deck Library card |
| `tool_calendar` | Founder Calendar card |
| `tool_incubators` | Incubators & Accelerators card |
| `tool_investors` | Investor Database card |

- **"Save Settings" Button:** `PUT /api/admin/site_settings` with `{ address, contact_email, contact_phone, section_toggles, section_headings }`.

---

### 8.19 LMS Handoff (`/admin/handoff`)
- **Source:** `web/app/admin/handoff/page.tsx`
- **Purpose:** SSO-lite bridge allowing the Setu LMS platform to grant admin access without re-entering credentials.
- **Flow:** LMS generates a one-time token and redirects the admin browser to `/admin/handoff?token={one_time_token}&next=/admin/events/{id}/builder`. The handoff page calls `POST /api/admin/handoff-exchange` with the token, receives a full admin JWT, stores it, and immediately forwards to the `next` URL. If the exchange fails, a clear error message is shown with instructions to retry from the LMS.
- **Security:** The `next` parameter is validated — it must begin with `/admin`. Any other value is defaulted to `/admin/events`.



---

## 9. Legal Pages

### 9.1 Privacy Policy (`/privacy-policy`)
- **Source:** `web/app/privacy-policy/page.tsx`
- **Purpose:** Outlines data collection, handling, and cookie usage.
- **Components:** Contains a single static block with standard typography (`prose` classes). It inherits the global header and footer. No API calls or database interaction required.

### 9.2 Terms of Use (`/terms-of-use`)
- **Source:** `web/app/terms-of-use/page.tsx`
- **Purpose:** Outlines terms of service, liabilities, and intellectual property.
- **Components:** Static page utilizing standard `prose` classes.

---

## 10. Backend API Reference

**Base URL (Production):** `https://thestartupschool.in/api`  
**Source:** `backend/server.js` (Express.js)

### Public Endpoints
| Endpoint | Method | Description |
|---|---|---|
| `/api/homepage` | GET | Full homepage data: content, mentors, testimonials, gallery, programs, partners, certifications, studentsFrom, mentoredStartups, bottomVideos, siteSettings. Gibberish testimonials + placeholder video IDs filtered server-side. |
| `/api/events` | GET | All active events. Supports `?upcoming=true` and `?past=true` query parameters. |
| `/api/events/pinned` | GET | Only `is_pinned: true` events. |
| `/api/events/past-rolling` | GET | `is_past: true` events, paginated. |
| `/api/events/slug/:slug` | GET | Full event object by slug. Sensitive fields (`lms_course_slug`, `page_blocks.coupon`, `page_blocks.applicable_coupons`) stripped before response. |
| `/api/leads` | POST | Submit contact/inquiry lead. Body: `{ name, city, phone, email, source }`. |
| `/api/lead-sources` | GET | Dynamic dropdown options for the Contact form. |
| `/api/grants` | GET | All grants from the `grants` table for the Grants Directory. |
| `/api/mentors` | GET | All active mentors. |
| `/api/testimonials` | GET | Sanitized testimonials. |
| `/api/helpdesk` | POST | Submit a support/helpdesk ticket. |
| `/api/chat-widgets` | GET | Active floating chat widgets. |

### Protected Endpoints (Admin JWT required)
| Endpoint | Method | Description |
|---|---|---|
| `/api/admin/login` | POST | Admin login. Returns JWT token and sets `adminToken` cookie. |
| `/api/admin/verify` | GET | Verifies token validity on page load. |
| `/api/admin/dashboard-stats` | GET | Returns aggregates for Dashboard KPIs. |
| `/api/admin/homepage_content` | PUT | Update Hero texts and auto-slide timings. |
| `/api/admin/hero_slides` | POST/PUT/DELETE | Manage hero background slider images and display order. |
| `/api/admin/site_settings` | PUT | Manage `section_headings`, `section_toggles`, and contact info. |
| `/api/admin/promo_bar` | PUT | Manage Top Promo bar status and content. |
| `/api/admin/events` | GET/POST/PUT/DELETE | CRUD operations for events. |
| `/api/admin/events/:id` | PUT | Update specific event fields and `page_blocks` JSON array. |
| `/api/admin/programs` | GET/POST/PUT/DELETE | CRUD for programs. |
| `/api/admin/mentors` | GET/POST/PUT/DELETE | CRUD for mentors. |
| `/api/admin/partners` | GET/POST/PUT/DELETE | CRUD for partners/startups. |
| `/api/admin/gallery` | GET/POST/PUT/DELETE | Manage community image gallery. |
| `/api/admin/bottom_videos`| GET/POST/PUT/DELETE | Manage YouTube embeds gallery. |
| `/api/admin/testimonials`| GET/POST/PUT/DELETE | Manage text/video testimonials. |
| `/api/admin/handoff-exchange`| POST | Used by `/admin/handoff` to securely exchange LMS one-time token for JWT. |
| `/api/admin/registrations`| GET | Returns all paid LMS course registrations. |
| `/api/admin/leads` | GET | Returns all submitted leads and contact forms. |

### Security Headers applied globally (via Helmet/Express):
- `Content-Security-Policy: default-src 'none'; ...`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Powered-By` header suppressed via `app.disable('x-powered-by')`
- `Server` version suppressed via nginx `server_tokens off`

---

## 11. CMS & Admin Control Reference (Section Toggles)

All toggles stored as a JSON object in `siteSettings.section_toggles` in the database. When switched off in the admin panel, the corresponding frontend component returns `null`.

| Toggle Key | Section Controlled | Default |
|---|---|---|
| `show_pinned_event` | Upcoming Events Showcase | `true` |
| `show_mentors` | Mentors Preview ticker | `true` |
| `show_mentors_linkedin` | LinkedIn links on mentor cards | `true` |
| `show_tools` | Tools & Resources section | `true` |
| `show_past_events` | Events Gallery section | `true` |
| `show_community_gallery` | Image Gallery section | `true` |
| `show_video_gallery` | Video Gallery section | `true` |
| `show_testimonials` | Testimonials carousel | `true` |
| `show_students_from` | Students From section | `true` |
| `show_partners` | Ecosystem Partners ticker | `true` |
| `show_programs` | Upcoming Programs section | `true` |
| `show_founder_manifesto` | Founder Manifesto section | `true` |
| `show_startups` | Startups Mentored section | `true` |

**Tool Card Status Controls** (each can be set to `true`, `"coming_soon"`, or `"disabled"`):
- `tool_grants`
- `tool_pitch_decks`
- `tool_calendar`
- `tool_incubators`
- `tool_investors`
- `tool_cap_table`
- `tool_financial_modeler`

---

## 12. Design System Reference

**Source:** `web/app/globals.css` (`@theme` block, Tailwind v4)

### Color Tokens

| Token | Hex Value | Usage |
|---|---|---|
| `bg-main` | `#EEF2FF` | Global page background (light indigo wash) |
| `bg-surface` | `#FFFFFF` | Card and modal backgrounds |
| `text-primary` | `#13113B` | Primary body text, headings |
| `text-secondary` | `#4B5563` | Secondary text — **light bg only**; use `text-slate-300` on dark backgrounds |
| `accent-blue` | `#7C3AED` | Primary Royal Violet — buttons, links, icons |
| `accent-violet` | `#A855F7` | Accent Lavender — highlights, hover states |
| `accent-royal` | `#5A1EEB` | Dark primary — hover states for dark buttons |
| `accent-lavender` | `#B395E6` | Light accent — subtle decorative elements |
| `functional-success` | `#16A34A` | Success indicators |
| `functional-border` | `#E5E7EB` | Card borders, dividers |

### Typography

| Font | Variable | Usage |
|---|---|---|
| Inter | `--font-sans` | All UI text, body copy, buttons |
| Merriweather | `--font-serif` | Editorial/manifesto text (`.manifesto-font` class) |

### Reusable CSS Classes

| Class | Effect |
|---|---|
| `.gradient-text` | Purple-to-violet gradient text fill |
| `.glass-card` | Semi-transparent white glass card with blur, border, and shadow |
| `.hover-glow` | Purple lift shadow + `-4px` translateY on hover |
| `.bg-pattern` | Dotted grid pattern overlay on main background |
| `.manifesto-font` | Applies Merriweather serif font |

### Animations

| Name | Duration | Usage |
|---|---|---|
| `scrollLeft` | 40s linear infinite | Horizontal left ticker (Mentors, Partners) |
| `scrollRight` | 40s linear infinite | Horizontal right ticker (reverse row) |
| `photo-scroll` | 30s linear infinite | Photo/gallery horizontal scroll |
| `mentors-scroll` | 50s linear infinite | Slower mentors ticker |

### Dark Card Theme (Workshop & Programs Sections)
- **Background:** `#13113B` (deep navy indigo). Note: Remove `.glass-card` when using this class to avoid opacity conflicts.
- **Border:** `border-functional-border/20` (very subtle)
- **Shadow:** `shadow-[0_8px_30px_rgba(0,0,0,0.2)]`
- **Hover Shadow:** `hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)]`
- **Text:** White headings, `text-gray-400` body copy.

---

## 13. System Setup & Deployment

### Environment Variables
**Backend (`backend/.env`):**
```
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/setu_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
AWS_ACCESS_KEY_ID="..."
AWS_SECRET_ACCESS_KEY="..."
AWS_REGION="ap-south-1"
S3_BUCKET_NAME="setu-assets"
```

**Frontend (`web/.env.local`):**
```
NEXT_PUBLIC_API_URL="http://localhost:5000"  # Changes to https://thestartupschool.in/api in production
```

### Deployment Steps
1. **Database:** Deploy Postgres instance and run `npx prisma db push` from the backend folder to initialize schema.
2. **Backend:** Host Express server using PM2 or Docker. Make sure to bind to the specified port and set up an Nginx reverse proxy.
3. **Frontend:** Run `npm run build` in the `web` folder. Deploy `.next` output using PM2 (`pm2 start npm --name "setu-web" -- start`) or push directly to Vercel/Netlify. Ensure `NEXT_PUBLIC_API_URL` points to the production backend URL.

---

# PART 2: ADMIN OPERATIONS & USER MANUAL (Idiot-Proof Guide)

This section is written for a non-technical administrator. It explains exactly what buttons to click, what fields to fill out, and how to manage the website step-by-step.

## 1. How to Manage Events (Event Builder)

The Event Builder allows you to create highly customized landing pages for your events and workshops. 

### Step 1.1: Creating the Base Event
1. Go to **Events & Workshops** in the left sidebar.
2. Click the **+ New Event** button.
3. **Fill out the Basics:**
   - **Title:** The name of the event (e.g., "AI Masterclass").
   - **Description:** A short 1-2 line summary.
   - **Slug:** This forms the URL. If you type `ai-masterclass`, the link will be `thestartupschool.in/events/ai-masterclass`. *Do not use spaces.*
   - **Banner Image:** Click to upload the cover photo.
   - **Venue & City:** Where it’s happening.
   - **Dates/Times:** Pick the start and end.
   - **Registration URL:** Paste the link to your Razorpay/Instamojo payment page here.
4. **Toggles:**
   - **Is Active:** Check this to make the event visible on the public `/events` page.
   - **Is Pinned:** Check this to make the event show up on the Homepage in the big "Upcoming Event" showcase.
   - **Is Past:** Check this ONLY when the event is completely over to move it to the "Past Events" tab.
5. Click **Save Event**.

### Step 1.2: Building the Event Page (The Builder)
After saving, click **Page Builder** next to the event in the table. This opens the dynamic drag-and-drop editor.

1. **Adding a Block:** Click the dropdown that says "Select Block Type", choose a block, and click **+ Add Block**.
2. **Reordering Blocks:** Use the **↑ Up** and **↓ Down** arrow buttons on any block to move it higher or lower on the page.
3. **Deleting a Block:** Click the red **🗑️ Trash** icon in the top right of the block.

### Step 1.3: Guide to Specific Blocks
- **Hero Block:** Add this first. Type your main headline (e.g., "Learn AI in 2 Days"). Upload a high-quality background image.
- **Schedule Block:**
  - Click "+ Add Day".
  - For each day, click "+ Add Timeline Event" to add rows like "10:00 AM - Opening Keynote".
- **Speaker / Mentor Grid:**
  - Click "+ Add Speaker".
  - **Image:** Upload a square headshot.
  - **Credentials:** Type a bullet point (e.g., "Ex-Google") and click "Add Item" to add more.
- **Pricing Tier:**
  - Add this to show ticket options.
  - Set the Price (e.g., 999).
  - Add features using the "Features List" (e.g., "Full 2 Day Access").
  - Use the "Is Popular / Highlight" checkbox to make this card stand out with a purple border.
- **Testimonials:**
  - Choose between **Video** (paste a YouTube link) or **Text** (type the quote and author name).
  - *Warning:* Do not type gibberish (like "asdfgh") into testimonials. The system will automatically detect fake text and hide it from the public site!
- **FAQ Block:**
  - Click "+ Add FAQ".
  - Type the Question and the Answer. Set the "Order" number (1, 2, 3) to sort them.
- **Save Your Work:** When you are done adding blocks, click the big **Save Page Builder** button at the bottom.

---

## 2. How to Manage the Homepage

### Step 2.1: Changing the Hero (Top Auto-Sliding Text)
1. Go to **Hero & Homepage** in the sidebar.
2. In **Panel 1 (Hero Text)**, you will see 3 "Scenes". The homepage auto-types these scenes one after another.
3. Change the **Heading** and **Tagline** for any scene.
4. Set the **Time per slide (sec)** (e.g., 5 seconds).
5. Click **Save Text Settings**. The homepage will update instantly.

### Step 2.2: Changing Homepage Background Images
1. Still in **Hero & Homepage**, scroll down to **Panel 3 (Hero Background Slides)**.
2. **To Add:** Click "Choose File", select an image, and click "Upload Slide".
3. **To Delete:** Hover over any existing image and click the red "Delete" button.
4. **To Reorder:** Click the left (←) or right (→) arrows on the image to change which one shows up first.

### Step 2.3: Turning Homepage Sections ON or OFF
1. Go to **Site Settings** in the sidebar.
2. Scroll to **Panel 3 — Section Toggles**.
3. You will see switches for every part of the site (e.g., `show_mentors`, `show_video_gallery`, `show_testimonials`).
4. Simply uncheck the box and click **Save Settings**. That section will instantly disappear from the live website. Check the box again to bring it back.

---

## 3. How to Manage Tools & Resources

### Step 3.1: Hiding or Showing a Tool
1. Go to **Site Settings** in the sidebar.
2. Scroll to the bottom of the **Section Toggles** panel.
3. You will see dropdowns for `tool_grants`, `tool_pitch_decks`, etc.
4. Set it to **"true"** (Live and clickable), **"coming_soon"** (Shows a yellow badge, cannot be clicked), or **"disabled"** (Completely hidden).

### Step 3.2: Adding a New Grant
1. Go to **Tools & Resources** in the sidebar.
2. Click **+ Add Grant**.
3. Fill out the Name, Category, Description, and Eligibility.
4. **Official URL:** Paste the government application link here.
5. Click **Save**. It will immediately appear in the Grants Directory (`/tools/grants`).

---

## 4. How to Manage People (Mentors & Partners)

### Step 4.1: Adding a Mentor
1. Go to **Mentors** in the sidebar.
2. Click **+ Add Mentor**.
3. Fill in their Name, Title, and LinkedIn URL.
4. Upload their photo.
5. Check **Is Active** and click **Save**. They will now appear on the `/mentors` page and scrolling ticker.

### Step 4.2: Managing Testimonials
1. Go to **Testimonials** in the sidebar.
2. When adding a Video Testimonial, go to YouTube, copy the standard link (e.g., `https://www.youtube.com/watch?v=abcd123`), and paste it in. The website will automatically convert it so it plays perfectly on the site.
3. **Warning:** Do not test this page by typing random letters (like "jghgf"). The system's gibberish detector will block it from showing up.

---

## 5. How to View Sales and Leads

### Step 5.1: Viewing Course Registrations
1. Go to **Registrations** in the sidebar.
2. Use the top dropdowns to filter by **Event Name** or **Ticket Tier**.
3. You can see who paid, their email, and their Razorpay Order ID.
4. Click **Export to Excel** to download the list for your team.

### Step 5.2: Viewing Contact Form Leads
1. Go to **Leads** in the sidebar.
2. Anyone who fills out the "Contact Us" form or "Apply to be a Mentor" form appears here.
3. You can search by their name or filter by where they applied from.
4. Click **Export** to download the list as a spreadsheet.

---

*Document compiled from source code analysis of the Setu — TheStartupSchool platform as of July 2026.*  
*Maintained by the development team. Keep this document updated when new sections or admin toggles are added.*
