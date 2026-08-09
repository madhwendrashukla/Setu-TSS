# Sync notes — heads-up for whoever owns the builder and the CMS

**Added 9 August 2026.** Same spirit as `prisma/SCHEMA_DRIFT_NOTE.md`: a short note about a
change that touches something you own, so it does not surprise you later.

---

## The problem this fixes

There were **two prices for the same course** and nothing kept them equal.

- **What the buyer is CHARGED** — `Course.price` in the LMS. `routes/coursePayments.js`
  (`create-order`) resolves it server-side through `getCourseBySlug()` and never trusts a
  client-supplied amount.
- **What the page DISPLAYS** — `pricing.actual_price` on the builder's pricing cards.

Any pricing card that names a course sends the buyer to the LMS-priced checkout —
`components/sections/dynamic/DynamicSections.tsx` resolves
`card?.course_slug || lmsCourseSlug` and navigates to `/courses/<slug>`. So the number typed
into the builder was **rendered and then ignored at checkout**. Change it and the page
advertises one price while the customer is billed another.

They happened to agree; nothing enforced it.

## What changed

Both admin panels remain editable and the two values are now mirrored.

| Direction | Trigger | Code |
|---|---|---|
| **Website → LMS** | saving an event (`POST`/`PUT /api/admin/events`) | `utils/priceSync.js` → `pushPricesToLms()` |
| **LMS → website** | any course edit (the resync that already existed) | `routes/lmsEvents.js`, price branch |

Signed the same way as the enrolment webhook — `x-tss-signature`, HMAC-SHA256 of the raw body
under `LMS_WEBHOOK_SECRET`, plus a signed `ts` against replay.

## The bit that concerns you

⚠️ **`routes/lmsEvents.js` now writes `page_blocks` — in exactly one place.**

That file carries a deliberate comment saying it never touches `page_blocks`, because the
landing-page design is yours. Mirroring the price requires writing into that structure, so
there is now a single narrow exception:

- it sets **`pricing.actual_price`** only,
- **only** on cards whose course matches the one being synced,
- **only** when the value actually differs.

Nothing else in the block is read or rewritten. If you would rather this worked another way,
it is one function (`applyPriceToPageBlocks` in `utils/priceSync.js`) and easy to change.

## Things worth knowing before you touch it

- **Loop safety.** Each side writes only when the stored value differs, so the mirrored update
  on the far side is a no-op. That is what stops the two panels echoing a number back and
  forth. Remove that check and you get an update storm.
- **Both `page_blocks` shapes are handled** — the legacy array-of-blocks and the unified
  object. The traversal mirrors `getPriceFromEvent()` in `routes/payments.js` so the reader
  and the writer cannot drift apart. Change one, change both.
- **Pushes are fire-and-forget.** A builder save must never fail because the LMS is briefly
  unreachable. Failures are logged with a `[priceSync]` prefix — grep for that if a price
  looks out of step.
- **A price of `0` makes a course unbuyable.** `create-order` rejects `price <= 0`; free
  access is granted by admin enrolment instead. The sync accepts `0`, the storefront will not.
- **Non-integer prices are dropped, not rounded.** `Course.price` is an `Int` in rupees.

## Visibility is now controlled from the CMS too (9 Aug)

The events list showed a HIDDEN pill with no way to change it — visibility was
only ever set by the LMS. There is now a **Visible** toggle on each row, beside Pin.
`is_active` was already writable through `PUT /api/admin/events`, so this is a UI
addition rather than a change of ownership.

Flipping it pushes `Course.websiteLive` to the LMS, so the two panels agree.

> 🔴 **The trap here, and why the push is narrow.**
>
> `is_active` and `Course.websiteLive` look like the same flag. They are not:
>
> | Field | Question |
> |---|---|
> | `tss_events.is_active` | is this **event** listed on `/events`? |
> | `Course.websiteLive` | is this **course** in the `/events` catalogue grid? |
>
> **AI Startup Launchpad deliberately runs `is_active=true` with
> `websiteLive=false`** so the event card shows while the course stays out of the
> grid. Remove that and `/events` lists the same offering twice — the duplicate
> fixed on 6 August.
>
> The first version of this pushed on every event save, which would have set
> `websiteLive=true` the next time anyone edited that builder page for an
> unrelated reason and silently re-created the duplicate. It now pushes **only
> when the request actually flips `is_active`**, and `POST /api/admin/events`
> never pushes at all.

## "Uses the LMS" is now an explicit toggle (9 Aug)

Whether a pricing card sold through `/courses/<slug>` or the on-page modal used to
depend on whether it happened to carry a `course_slug` — invisible to the admin
and impossible to set deliberately.

It is now a real setting, resolved in `web/lib/lms-routing.ts`:

- **Event level** — a checkbox beside *Registrations Open* in the builder.
- **Per card** — a select beside *Course Slug*: inherit / force LMS / force non-LMS.
- Card beats event; absent means LMS, so **every existing event is unchanged**.

Non-LMS buyers previously got `alert("Payment Successful!")` and nothing else.
They now land on `/events/<slug>/success`, which shows the event title and payment
reference and **no personal data** — echoing a name or email out of the query
string would let anyone craft a URL displaying someone else's details.

## Also changed in your flow — please review (9 Aug)

**`routes/payments.js` used to charge the client-supplied price. It has been fixed.**

The old code resolved a server price and compared it to `finalPrice` — but the lookup keys on
`workshopId` / `workshopTitle`, **both sent by the client**. A request naming a card that does
not exist made the lookup miss, skipped the comparison entirely, and fell through to
*"Falling back to client price"*. The guard only ever caught honest browsers; an attacker
turned it off by making the lookup fail, then named their own amount.

What it does now:

1. **Fails closed.** If the price cannot be resolved, the order is refused. No fallback.
2. **Charges its own figure.** `basePrice` / `discountApplied` / `finalPrice` are still
   accepted from older clients but ignored — Razorpay and the stored registration both use
   the server's number.
3. **Prefers a stable card id.** The checkout now sends `pricingCardId` (the builder card's
   `id`). Title matching still works but is logged, because a rename would otherwise turn
   into failed purchases now that there is no fallback.
4. **Validates coupons properly.** It previously checked only `is_active`, so an expired or
   fully redeemed coupon still discounted an event order. It now uses
   `validateCouponForCourse` — the same validator the course checkout uses — and honours the
   builder's `applicable_coupons` allowlist.

Verified on the live server: a request with a bogus card and `finalPrice: 1` is refused,
while a legitimate one prices at ₹290 (29000 paise) **even when the body claims ₹1**.

Revert as one unit with `git revert -m 1 b0877dd` if you disagree with the approach.
