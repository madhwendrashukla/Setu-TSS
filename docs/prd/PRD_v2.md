# PRODUCT REQUIREMENTS DOCUMENT
## Dynamic Workshop Landing Page CMS
**VERSION 2.0**
**Setu — The Startup School**
**Reference page:** foundersschool.in/AI-workshop-15may
**Date:** July 6, 2026
**Prepared for:** Gaurav Bansal, Sai, Monarch
**Author:** Madhwendra Shukla

**Changelog from v1:** Incorporates full field-level spec (mentor/pricing/workshop/contact sections), input-type classification (plain text vs. rich text), per-section and per-CTA visibility toggles with priority ordering, Razorpay checkout integration, and global coupon-code discount system.

## Table of Contents
1. Overview & Version History
2. Goals & Non-Goals
3. Input Type System (Legend)
4. Data Architecture Overview
5. Section-by-Section Field Specification
   5.1 Hero Section
   5.2 Story Section
   5.3 The Output (What You Get)
   5.4 Workshop Breakdown
   5.5 Pricing & Checkout
   5.6 Mentors Section
   5.7 Video Gallery
   5.8 Testimonials (Video)
   5.9 FAQs
   5.10 Contact Us
6. Visibility & Toggle System
7. Payments: Razorpay Integration
8. Coupon Code System
9. Entity Relationships
10. Extras (Nudges, Footer, Chatbot)
11. JSON Schema (Reference)
12. Admin/CMS User Flows
13. Non-Functional Requirements
14. Open Questions
15. Rollout Plan

## 1. Overview & Version History
This document defines the requirements to convert the AI Entrepreneurship Workshop landing page (foundersschool.in/AI-workshop-15may) from a fully hardcoded, single-use page into a reusable, data-driven template. Every future cohort — new dates, mentors, pricing, workshops, coupons — should be publishable by editing structured content, not by rebuilding the page in code.

Version 2 supersedes Version 1 in full. It replaces the earlier general module descriptions with an exact field-by-field specification (per stakeholder walkthrough), adds explicit input-type classification for every field, and introduces two new capabilities not present in v1: Razorpay payment integration and a global coupon-code discount system.

### 1.1 What changed from v1
| Area | V1 | V2 |
|---|---|---|
| Module detail | General description per section ("customizable: photos, names, roles") | Exact field list per section with input type (Plain Text / Rich Text / Number / Toggle / Image / Video / Dropdown) |
| Pricing model | Abstract pricing_tiers[] referencing workshop_ids[] (bundle concept) | Pricing lives directly on each workshop card: heading, title, description, strike-through price, actual price, date/time, mode, address, CTA |
| Visibility | Section-level + item-level toggle only | Adds a third layer: per-CTA-button toggle, independent of section visibility (e.g. close registration without hiding the pricing card itself) |
| Ordering | Implicit array order | Explicit priority-order field for Workshops and FAQs so admin can reorder without re-uploading content |
| Payments | Not specified | Razorpay checkout wired to each workshop/pricing card's final computed price |
| Discounts | Not specified | Global coupon-code system: admin-created code + X% discount, applies uniformly across all workshops |
| New sections | — | Story Section, Video Gallery (separate from Testimonials), Contact Us lead-gen form |
| Mentor spec | Generic bio + credentials + quote | Explicit: image, name, professional headline, professional description, bullets — LinkedIn link explicitly excluded |

## 2. Goals & Non-Goals
### 2.1 Goals
*   Specify every content field on the page at the granularity needed for a developer to build the CMS/admin form directly from this document — no follow-up clarification needed for field names or types.
*   Classify every field's required input control (plain text box vs. rich-text/bullet editor vs. number vs. toggle vs. image/video upload vs. dropdown).
*   Support N workshops with independent priority ordering, each carrying its own curriculum, pricing, schedule, and CTA visibility.
*   Support three layers of visibility control: section-level, item-level, and field/CTA-level.
*   Integrate Razorpay checkout so each workshop's "Book your seat" CTA completes a real payment, not just a link.
*   Support a single global coupon code (admin-managed) providing a percentage discount applied uniformly across all workshops at checkout.
*   Preserve the current visual design and section order; this is a content/data-layer change, not a redesign.

### 2.2 Non-Goals
*   No new visual design, layout, or branding changes beyond what's needed to support the fields specified here.
*   Multiple simultaneous coupons, stacked discounts, or per-workshop-specific coupons are out of scope for this version (see Section 8 for confirmed scope: single global coupon, admin-managed only).
*   Full custom CMS admin UI build-out is not mandated in Phase 1 — a structured content model plus a basic admin form covering the fields in Section 5 is sufficient to start.
*   Chatbot functionality is noted as an Extra (Section 10) but is explicitly not specified in this version — to be scoped separately.

## 3. Input Type System (Legend)
A recurring requirement from stakeholder review: most fields cannot be a single plain text input, because the underlying content itself contains formatting (bullet lists, bold emphasis, line breaks). Every field in Section 5 is tagged with one of the following input types so the CMS build has no ambiguity about which UI control to use.

**Input Type Legend**
* Plain Text
* Rich Text
* Number
* Toggle
* Image
* Dropdown
* Video

### 3.1 Definitions
*   **Plain Text** — a single-line or short multi-line text input. No formatting needed (names, titles, short labels, addresses, phone numbers).
*   **Rich Text** — a lightweight WYSIWYG editor supporting bold and bullet lists (and optionally bullet-style selection, e.g. checkmark vs. cross vs. standard dot). Used wherever content is a list of points or needs emphasis, not full document formatting.
*   **Number** — numeric input only (prices, discount percentages, priority/order values).
*   **Toggle** — a simple on/off switch (visibility flags, CTA active/inactive, registrations open/closed).
*   **Image** — file upload for a single image asset (mentor photo, output-section graphic).
*   **Video** — file upload or embed URL for a video asset (testimonial clips).
*   **Dropdown** — a fixed set of pre-defined choices (e.g. Mode: Online / Offline).

Rule of thumb: if the current live page shows the field as a bulleted list or contains inline emphasis, it is Rich Text. If it's a single fact (a name, a number, a date), it is Plain Text or Number. This distinction was raised explicitly because using plain inputs for bullet-style content would force admins to hand-type raw dashes/newlines, which renders poorly and is painful to maintain.

## 4. Data Architecture Overview
The page remains structured as a fixed section order, each section backed by its own content object. Workshops are the central repeatable entity — pricing, schedule, and CTA state now live inside each workshop record directly (a simplification from v1's separate pricing_tiers[] abstraction, per the detailed walkthrough).

```text
Page (fixed section order, each section independently visible)
├── hero                    (singular)
├── story                    (singular, section-level toggle)
├── output                   (singular — "What You Get")
├── workshops[]               ← core repeatable entity, has priority order
│     ├── heading, title
│     ├── key_features / description   (rich text)
│     ├── detail_bullets                (rich text)
│     ├── pricing{ strike_price, actual_price, date_time_bullets, mode, address }
│     ├── cta{ text, active_toggle }
│     └── visible
├── mentors[]                 (referenced conceptually per workshop, shown as a set)
├── video_gallery[]           (1-4 videos)
├── testimonials[]            (video-based)
├── faqs[]                    (priority order)
├── contact                   (singular — WhatsApp CTA + lead-gen form)
├── coupon                    (single global object: code, discount %, active toggle)
└── section_visibility{}      (master per-section on/off)
```

## 5. Section-by-Section Field Specification
This section is the primary build reference. Every field below reflects the exact walkthrough given for the page, including default states, editability, and exclusions (e.g. no LinkedIn link on mentor cards).

### 5.1 Hero Section
| Field | Input Type | Notes |
|---|---|---|
| Main Headline | Rich Text | Text editor + color editor. No images allowed — text only. Default font family and size to be finalized by design before build. |
| Description | Rich Text | Supporting sub-headline / paragraph beneath the main headline. |
| Key Features / Highlights row | Rich Text | e.g. "3 Mentors • 3 Days • 5 Sessions • 12+ Hr • Live on Zoom" — short highlight strip, editable as a list of short phrases. |

### 5.2 Story Section
Section-level visibility toggle (on/off) — this entire section can be hidden for cohorts that don't need a narrative block.

| Field | Input Type | Notes |
|---|---|---|
| Main Headline | Rich Text | Text + color editable. |
| Description Text | Rich Text | Paragraph-level content. |
| Boxes (repeatable) | Rich Text | Each box: Title, Title Description, and Pointers (bullets). Bullet style options: checkmark (✓) and cross (✗) to represent "included / not included" style comparisons, as seen on the reference page. |

### 5.3 The Output ("What You Get in This Workshop")
Purpose: convey to the learner exactly what they walk away with — the outcome of the workshop.

| Field | Input Type | Notes |
|---|---|---|
| Image | Image | Supporting graphic (as shown in reference: a visual term-cloud / illustrative image alongside the checklist). |
| Headline | Rich Text | Editable text with color, e.g. "What do you get in this workshop?" |
| Pointers (bullets) | Rich Text | List of outcomes/deliverables. Bullet style should be selectable if the editor supports it; otherwise a standard check-style bullet is the fallback. |

### 5.4 Workshop Breakdown
This is the core repeatable module. Multiple workshop cards are supported, each with an explicit priority-order value so admins can control display sequence without reordering the underlying data array.

| Field | Input Type | Notes |
|---|---|---|
| Priority / Order | Number | Determines display sequence among workshop cards. |
| Workshop Heading | Plain Text | e.g. "WORKSHOP 1" label/tag shown above the title. |
| Workshop Title | Plain Text | e.g. "Startup Ideation & Validation" |
| Key Features / Description | Rich Text | Short descriptive block under the title. |
| Detail Bullets | Rich Text | "What You'll Learn" / "Your Deliverables" style bulleted detail blocks, as seen in the reference screenshot (detail-1 title + detail-1 bullets). |
| CTA Button Text | Plain Text | e.g. "Book your seat now" — editable, not compulsory (can be left as system default). |
| CTA Active Toggle | Toggle | Independent on/off — allows closing bookings for this specific workshop without hiding the workshop card itself. |

Note: the pricing fields for each workshop (strike-through price, actual price, date/time, mode, address) are specified separately in Section 5.5, but they are attached per-workshop, not as a standalone global pricing list.

### 5.5 Pricing & Checkout
| Field | Input Type | Notes |
|---|---|---|
| Workshop Heading | Plain Text | Reused/synced from the workshop's own heading (Section 5.4) — not re-entered separately. |
| Workshop Title | Plain Text | Same — synced from workshop title. |
| Workshop Description | Rich Text | Short pricing-card-specific description. |
| Strike-through Price | Number | Original price, shown struck through. |
| Actual Price | Number | Current sale price. |
| Date & Time | Rich Text | Displayed as bullet points (e.g. "May 15, 2026 (Friday) • 6:15 PM – 9:00 PM IST"). |
| Mode | Dropdown | Online / Offline. |
| Address | Plain Text | Shown only if Mode = Offline; venue address text box. |
| CTA Button Text | Plain Text | e.g. "Book Your Seat Now" — editable, not compulsory. |
| CTA Active Toggle | Toggle | Independent on/off. This is the field that lets the team close registrations (switch CTA off) after a cohort fills up or the window closes, without touching any other content. |

This CTA toggle is intentionally separate from the workshop's own visibility flag (Section 5.4) and from the page-wide section visibility (Section 6) — three independent layers, confirmed in stakeholder walkthrough: "after the registrations are closed we should be able to switch that off" refers specifically to this CTA-level toggle.

### 5.6 Mentors Section
Section headline: "Learn from the Masters" (fixed suggested copy, editable).

| Field | Input Type | Notes |
|---|---|---|
| Section Headline | Rich Text | "Learn from the Masters" or custom equivalent. |
| Mentor Image | Image | Profile photo. |
| Mentor Name | Plain Text | |
| Professional Headline | Plain Text | e.g. "AI & Startup Technology Expert" |
| Professional Description | Rich Text | Short bio paragraph. |
| Credential Bullets | Rich Text | e.g. "Claude Pro implementation for business", "No-code/low-code MVP development" — bulleted list of highlight credentials. |

*   Explicitly excluded: LinkedIn link. The reference design originally showed a LinkedIn link on mentor cards — this has been removed by instruction and should not be included in the field set.
*   Mentor is the key selling feature of any workshop per stakeholder note — this section's visual prominence and credential bullets should not be trimmed for space in implementation.

### 5.7 Video Gallery
| Field | Input Type | Notes |
|---|---|---|
| Headline | Rich Text | Not required — section can display without a headline if left blank. |
| Videos | Video | 1 to 4 video uploads/embeds supported. |

This is distinct from the Testimonials section below — Video Gallery is a general supporting video block (e.g. promotional or explainer clips), not attributed to a specific student.

### 5.8 Testimonials — Videos
| Field | Input Type | Notes |
|---|---|---|
| Headline | Rich Text | Not required — optional. |
| Testimonial Video | Video | Short video clip per testimonial. |
| Student Name | Plain Text | |
| Role / Title | Plain Text | e.g. "CEO & Co-Founder, JobGenAI" |
| Company | Plain Text | |
| City | Plain Text | e.g. "Mumbai", "Sydney" |
| Rating | Number | Star rating, typically out of 5. |
| Quote / Review Text | Rich Text | Short testimonial quote shown alongside/under the video thumbnail. |

### 5.9 FAQs
| Field | Input Type | Notes |
|---|---|---|
| Priority / Order | Number | Controls display sequence of FAQ items. |
| Question | Plain Text | |
| Answer | Rich Text | May include bullet points or emphasis depending on complexity of the answer. |

### 5.10 Contact Us
Two components on this section: a direct WhatsApp CTA, and a lead-generation contact form.

#### WhatsApp Block
| Field | Input Type | Notes |
|---|---|---|
| Headline | Plain Text | e.g. "WhatsApp Us" |
| Description | Plain Text | e.g. "Get instant replies for your queries directly from our team." |
| Button Text | Plain Text | e.g. "Message Now" |
| WhatsApp Number/Link | Plain Text | Destination for the CTA. |

#### Lead-Gen Form Block
| Field | Input Type | Notes |
|---|---|---|
| Headline (stylized) | Rich Text | e.g. "Hai Keeda? Hai Himmat? To Kar Startup!" — multi-color/multi-line stylized heading. |
| Form Sub-text | Plain Text | e.g. "To know more about our programs, drop your details below" |
| Form Fields | Plain Text (each) | Name, City, Email Address, Contact Number — standard input fields, not admin-editable content but user-facing form inputs. |
| Admin Description Box | Plain Text (editable) | A description box in the admin panel to set the destination Email and Contact Number where form submissions/leads are sent. This must be editable by the admin, not hardcoded. |
| Submit Button Text | Plain Text | e.g. "Send via Email" |

Stakeholder note captured verbatim: "if possible add a description box in contact us to add email n contact number and it should be editable" — this confirms the admin-side lead-destination email/number must be a configurable field, not hardcoded into the form's backend logic.

## 6. Visibility & Toggle System
Three independent layers of visibility/state control are required — this is more granular than v1's two-layer model, based directly on stakeholder feedback that CTA state must be controllable separately from section or item visibility.

### 6.1 Layer 1 — Section-level visibility
A master list controls which page sections render at all, in what order (Hero → Story → Output → Workshops → Mentors → Video Gallery → Testimonials → FAQs → Contact). Story section is explicitly called out as needing its own on/off toggle.

### 6.2 Layer 2 — Item-level visibility
Within any repeatable section (Workshops, Mentors, Testimonials, FAQs), each individual item carries its own visible flag — e.g. hiding one cancelled workshop while keeping others live.

### 6.3 Layer 3 — CTA/field-level toggle (new in v2)
Certain individual fields — specifically the CTA button on each Workshop/Pricing card — need their own independent on/off switch, separate from whether the card itself is visible. This directly addresses the stakeholder requirement: registrations can close (CTA switched off) while the workshop card, its content, and its schedule entry remain fully visible on the page.

| Layer | Controls | Example use case |
|---|---|---|
| Section-level | Entire module on/off | Hide Story section entirely for a cohort that doesn't need it |
| Item-level | One entry within a section | Hide one specific mentor or testimonial without deleting it |
| CTA/field-level | A single interactive element within an item | Close booking on one workshop (CTA off) while its info stays visible |

Precedence: if a section is hidden, none of its items or their CTAs render, regardless of lower-layer flags. If an item is hidden, its CTA state is irrelevant. CTA toggles only matter when both the section and the item are visible.

## 7. Payments: Razorpay Integration
Each workshop/pricing card's CTA button, when active, must trigger a real Razorpay checkout rather than a static link, per the confirmed requirement.

### 7.1 Checkout flow
*   User clicks the workshop's CTA ("Book Your Seat Now").
*   System computes the final payable amount: Actual Price, minus the global coupon discount if a valid coupon code is applied (see Section 8).
*   A Razorpay order is created for that computed amount, tagged with metadata identifying which workshop it belongs to.
*   Razorpay checkout modal/page opens; user completes payment.
*   On success: registration is recorded against that workshop, and a confirmation is triggered (email and/or WhatsApp — channel to be confirmed with the team).
*   On failure/cancellation: user is returned to the pricing card with an appropriate retry message; no registration is recorded.

### 7.2 Data requirements
| Field | Purpose |
|---|---|
| workshop_id | Identifies which workshop the order is for |
| base_price | Actual Price at time of order, before discount |
| coupon_code_used | Records which coupon (if any) was applied, or null |
| discount_percent_applied | The X% deducted, for reconciliation |
| final_amount | The amount actually charged via Razorpay |
| razorpay_order_id / payment_id | Standard Razorpay reference IDs for reconciliation |
| registrant details | Name, email, phone captured at checkout |

### 7.3 Scope boundary
Per v1's non-goals, deep Razorpay backend/webhook architecture (e.g. settlement, refund flows) is not detailed in this document — this section specifies only the data and triggering logic needed at the front end and order-creation level. Backend payment reconciliation logic should be scoped with Sai/Monarch separately if not already covered in existing Setu payment infrastructure (Razorpay is already used elsewhere in Setu per prior work).

## 8. Coupon Code System
Confirmed scope: a single, global, admin-managed coupon code providing a percentage discount, applied uniformly across all workshops. No per-workshop coupon mapping and no auto-generated coupons (e.g. no automatic early-bird logic) in this version.

### 8.1 Admin-side fields
| Field | Input Type | Notes |
|---|---|---|
| Coupon Code | Plain Text | e.g. "STARTUP20" — the code users enter at checkout |
| Discount Percentage | Number | X% off — applies to the Actual Price of whichever workshop is being purchased |
| Active Toggle | Toggle | Enables/disables the coupon without deleting it |
| Expiry Date (optional) | Date | If set, coupon auto-deactivates after this date |

### 8.2 Checkout-side behavior
*   A coupon input field is shown at checkout (on the pricing card or in the Razorpay pre-checkout step).
*   User enters a code; system validates it against the single active admin-set coupon.
*   If valid: price display updates to show Original (strike-through) → Actual Price → Final Price After Coupon, and this final amount is what's sent to Razorpay.
*   If invalid/expired/inactive: an error message is shown; the Actual Price remains the checkout amount.

### 8.3 Explicitly out of scope for this version
*   Multiple simultaneous or stacked coupons.
*   Per-workshop-specific coupon codes (confirmed: global only, applies the same way to every workshop).
*   Auto-generated coupons or automatic discount rules (confirmed: admin creates coupons manually only).

## 9. Entity Relationships
Simplified from v1: pricing now lives inside the workshop record directly rather than as a separate tier collection. The coupon is a single global object, not linked to any specific workshop.

| Entity | Relationship | Notes |
|---|---|---|
| workshops[] | self-contained | Each workshop carries its own pricing, schedule, and CTA state — no external tier reference needed |
| coupon | applies to → all workshops | Single global object; discount computed against whichever workshop's actual_price is being purchased |
| razorpay_order | references → workshop_id + coupon_code_used | Created at checkout time with the final computed amount |
| schedule (derived) | derived from → workshops[].pricing.date_time_bullets | If a consolidated schedule view is needed, it should read from this field rather than being separately maintained |

## 10. Extras (Nudges, Footer, Chatbot)
*   **Workshop booking nudges**: a recurring prompt/banner encouraging booking, inserted after every 2 sections down the page.
*   **Footer**: standard footer, consistent with the rest of the Setu site — no page-specific customization needed.
*   **Chatbot**: flagged as a possible future addition. Not specified in this version — to be scoped in a separate discussion once priority is confirmed.

## 11. JSON Schema (Reference)
Complete reference structure combining all modules specified in Section 5, plus the visibility, payment, and coupon systems from Sections 6-8.

```json
{
  "section_visibility": {
    "hero": true, "story": true, "output": true, "workshops": true,
    "mentors": true, "video_gallery": true, "testimonials": true,
    "faqs": true, "contact": true
  },
  "hero": {
    "headline": { "text": "...", "color": "#FFFFFF", "font": "default", "size": "default" },
    "description": "...",
    "key_highlights": ["3 Mentors", "3 Days", "5 Sessions", "12+ Hr", "Live on Zoom"]
  },
  "story": {
    "visible": true,
    "headline": "...",
    "description": "...",
    "boxes": [
      { "title": "...", "description": "...", "bullets": [
        { "text": "...", "style": "check" },
        { "text": "...", "style": "cross" }
      ]}
    ]
  },
  "output": {
    "image_url": "...",
    "headline": { "text": "What do you get in this workshop?", "color": "#A855F7" },
    "bullets": ["...", "..."]
  },
  "workshops": [
    {
      "id": "workshop_1",
      "priority_order": 1,
      "heading": "WORKSHOP 1",
      "title": "Startup Ideation & Validation",
      "key_features": "...",
      "detail_bullets": {
        "what_youll_learn": ["...", "..."],
        "your_deliverables": ["...", "..."]
      },
      "pricing": {
        "strike_price": 999,
        "actual_price": 469,
        "date_time_bullets": ["May 15, 2026 (Friday)", "6:15 PM - 9:00 PM IST"],
        "mode": "online",
        "address": null
      },
      "cta": { "text": "Book Your Seat Now", "active": true },
      "visible": true
    }
  ],
  "mentors": {
    "section_headline": "Learn from the Masters",
    "items": [
      {
        "id": "mentor_1",
        "image_url": "...",
        "name": "...",
        "professional_headline": "...",
        "professional_description": "...",
        "credential_bullets": ["...", "..."],
        "visible": true
      }
    ]
  },
  "video_gallery": {
    "headline": null,
    "videos": ["url1", "url2"]
  },
  "testimonials": [
    {
      "id": "t1", "video_url": "...", "name": "...", "role": "...",
      "company": "...", "city": "...", "rating": 5, "quote": "...", "visible": true
    }
  ],
  "faqs": [
    { "id": "f1", "priority_order": 1, "question": "...", "answer": "...", "visible": true }
  ],
  "contact": {
    "whatsapp": { "headline": "WhatsApp Us", "description": "...", "button_text": "Message Now", "link": "..." },
    "lead_form": {
      "headline": "Hai Keeda? Hai Himmat? To Kar Startup!",
      "subtext": "To know more about our programs, drop your details below",
      "submit_text": "Send via Email",
      "destination_email": "...",
      "destination_contact_number": "..."
    }
  },
  "coupon": {
    "code": "STARTUP20",
    "discount_percent": 20,
    "active": true,
    "expiry_date": "2026-08-01"
  },
  "extras": {
    "workshop_nudges": { "enabled": true, "frequency_sections": 2 },
    "footer": "standard",
    "chatbot": { "enabled": false, "note": "to be discussed / scoped separately" }
  }
}
```

## 12. Admin / CMS User Flows
### 12.1 Launching a new cohort
*   Duplicate previous cohort's content object as a starting template.
*   Update workshops[] — titles, detail bullets, pricing, date/time, mode/address, priority order.
*   Set/replace the global coupon if a new discount code is running for this cohort.
*   Add or hide testimonials/video-gallery items as available.
*   Turn on each workshop's CTA toggle when ready to accept bookings; turn on the relevant section visibility flags.

### 12.2 Closing registrations for one workshop
*   Ops switches that specific workshop's CTA Active Toggle to off (Section 5.4 / 5.5).
*   Workshop card, its content, and schedule entry remain visible — only the booking action is disabled.

### 12.3 Running a discount period
*   Admin creates/activates the coupon code with the desired discount percentage and optional expiry date.
*   No per-workshop configuration needed — the coupon applies uniformly the moment it's active.
*   Admin deactivates the coupon (toggle off) when the promotion ends, without deleting the code for future reuse.

### 12.4 Adding or removing a workshop
*   **Add**: append a new workshop object with its own `priority_order`; it renders automatically in sequence.
*   **Remove**: set `visible: false` to retain historical data, or delete outright if no longer needed.

## 13. Non-Functional Requirements
*   **Visual parity**: the rebuilt page must render equivalent to the current live page for existing cohort content — no visual regression from this data-layer change.
*   **Content update turnaround**: a non-developer should be able to launch a new cohort or update pricing/coupon in under 30 minutes without a code deployment.
*   **Payment reliability**: Razorpay order creation must use the exact final computed amount (post-coupon) — no client-side price tampering should be possible; final amount must be validated server-side before order creation.
*   **Coupon validation** must happen server-side at order-creation time, not just client-side, to prevent manipulation of the discount percentage.
*   **No orphaned references**: removing a workshop that has existing paid registrations should be handled carefully (e.g. soft-hide rather than hard-delete) to preserve order history.

## 14. Open Questions
*   Confirmation channel after successful payment — email, WhatsApp, or both?
*   Should the coupon input be shown on the pricing card itself, or only at the Razorpay pre-checkout step?
*   Is there an existing Razorpay account/integration already wired into Setu's backend (per earlier Razorpay business-account migration work) that this should plug into, or is this a fresh integration for this page specifically?
*   Chatbot — priority and scope to be discussed separately, not detailed in this version.
*   Should past cohort pages remain live/archived at their own URLs after a new cohort launches?
*   Default font family/size for the Hero headline — needs a design decision before the rich-text editor's defaults can be set.

## 15. Rollout Plan
| Phase | Scope |
|---|---|
| Phase 1 | Build the data model per Section 5's field spec; refactor the frontend to consume it. Migrate current live cohort's content into this structure with visual parity confirmed. |
| Phase 2 | Implement the three-layer visibility system (Section 6) — section, item, and CTA-level toggles. |
| Phase 3 | Razorpay integration (Section 7) — order creation, checkout flow, success/failure handling, registration recording. |
| Phase 4 | Coupon code system (Section 8) — admin fields, checkout-side validation, server-side enforcement. |
| Phase 5 | Lightweight admin/CMS interface covering all fields in Section 5, so non-developers can manage content directly (per Section 12 flows). |
