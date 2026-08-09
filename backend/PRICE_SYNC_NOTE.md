# Price sync — heads-up for whoever owns the builder

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

## Unrelated, but found while doing this — worth your attention

**`routes/payments.js` falls back to the client-supplied price.** In the event-registration
flow, when `getPriceFromEvent()` cannot resolve a server price it logs *"Falling back to
client price"* and accepts whatever the browser sent. A crafted request could pay ₹1 for an
event. Our course checkout does not have this (the price is always read server-side).

Left alone because it is your flow and the fix is a product decision: reject the order, or
fall back to a stored event price.
