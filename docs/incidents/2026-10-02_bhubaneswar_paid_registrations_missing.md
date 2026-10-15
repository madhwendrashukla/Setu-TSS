# Incident: paid Bhubaneswar registrations missing from admin Registrations tab

| | |
|---|---|
| **Status** | Root cause confirmed: the browser never sent `verify-payment`. Scope: these 3 buyers only. Recovery pending |
| **Detected** | 2026-10-15 |
| **Event** | Chai & Conversation – Bhubaneswar (2 Oct / 3 Oct sessions) |
| **Impact** | 3 buyers paid ₹1.00 (Razorpay: Captured, settled 5 Oct, `setl_Tk9FbJeYRyN6lB`) but do not appear as registrations |

## Affected payments

| # | Payment (IST) | Payment ID | Order ID | Method |
|---|---|---|---|---|
| 1 | Thu 1 Oct 21:17 | `pay_TihNSET8MDHNMT` | `order_TihNMI67eOU0HF` | UPI `@oksbi`, bank account |
| 2 | Fri 2 Oct 11:05 | `pay_TivUeIVcQNihOH` | `order_TivURqcYkTE9b4` | UPI `@ybl`, bank account |
| 3 | Fri 2 Oct 11:16 | `pay_Tivfprffc01dcD` | `order_TivfiqPJjg8Oyn` | UPI `@ybl`, credit card |

All three payments carry the description `Enrollment for Chai & Conversation- Bhubaneswar`, which is the string `DynamicCheckoutModal` builds. So all three came through the standard event checkout.

## How an event payment is recorded (code as live on 1–2 Oct, commit `26e4666`)

1. `POST /api/payments/create-order` creates the Razorpay order **first**, then writes or updates an
   `event_registrations` row with `status = PENDING` and `razorpay_order_id = <order>`.
2. The buyer pays inside the Razorpay modal.
3. Razorpay calls the JS `handler` **in the buyer's browser**, and the handler calls
   `POST /api/payments/verify-payment`.
4. `verify-payment` checks the signature, then runs `updateMany({ razorpay_order_id }) → COMPLETED`.
5. Admin → Registrations calls `GET /api/admin/registrations` with no status, and that endpoint returns
   **only `COMPLETED`** rows (`server.js`, unchanged since 15 Sep).

Step 3 is the only path to `COMPLETED`. Event payments have no Razorpay webhook (course payments
are a separate system). Razorpay showing "Captured" therefore proves nothing about our database.

The payment code was the same on 1–2 Oct as it is today. The 9 Oct commits (`eb21912`, `f8148e5`) only touched lead cleanup and email rendering. So this was not caused by a since-fixed bug in the payment logic.

## Ruled out

- **Price or create-order failure.** The orders exist in Razorpay. The checkout only opens after create-order
  returns 200, and create-order writes the DB row before returning. So a PENDING row **was** written for each order.
- **Seed or clone scripts.** None of the backend or trash scripts touch `event_registrations`.
- **Admin delete button** (`d9d940f`, 1 Oct). The tab only lists COMPLETED rows, so an admin could not
  have seen these rows to delete them.
- **CORS / CSP / old domain.** The checkout switched to same-origin `/api` in `8e079e4` (1 Oct 19:26),
  before all three payments, and `create-order` evidently succeeded on the same origin.

## Candidate root causes

| Code | Path | Fits the evidence because |
|---|---|---|
| **A** | Browser never delivered `verify-payment` | All 3 paid by UPI app (GPay/PhonePe). On mobile the browser tab is backgrounded during the app switch and is often reloaded or killed, so the handler never runs. This is a known Razorpay failure mode, and it's why Razorpay requires webhooks. |
| **A′** | `verify-payment` hit a backend that was down or restarting | Payment 1 (21:17) came 25 s after commit `e129994` (21:16:51), during an evening of repeated deploys and `pm2 restart all` (PORT crash at 18:49 and Prisma crash at 19:09 that day). The 1 Oct DoS report also records event-loop starvation that froze checkout. |
| **B** | Paid order's id overwritten by a retry | `create-order` reuses the buyer's PENDING row and **replaces** `razorpay_order_id`. If the buyer opened checkout twice and the first UPI request completed, `verify-payment` matches 0 rows and **still returns `success: true`**. |
| **C** | Signature check failed → row `FAILED` | Unlikely: the key ID has been served from the backend since `26e4666`. |
| **D** | Row absent | Would mean it was deleted, or written to a different database. |

## Evidence to collect (decides between A / A′ / B / C / D)

1. **Diagnostic script on prod (read-only):**
   `cd ~/Setu-TSS/backend && node scripts/diagnoseEventPayment.js pay_TihNSET8MDHNMT pay_TivUelVcQNihOH pay_Tivfprffc01dcD`
   This prints a verdict per payment.
2. **Nginx access log.** Was `verify-payment` ever requested, and with what status?
   Server time is UTC: 1 Oct 15:47 and 2 Oct 05:35 / 05:46.
   `sudo zgrep -h "/api/payments/" /var/log/nginx/access.log* | grep -E "01/Oct/2026:1[56]:|02/Oct/2026:0[56]:"`
   - Only `create-order`, no `verify-payment` → **A**
   - `verify-payment` returned 502/504 → **A′**
   - `verify-payment` returned 200 → **B**: the request arrived but matched no row
3. **PM2 restarts:** `pm2 describe tss-backend | grep -iE "restarts|uptime|created"`.
4. **Confirmation email.** Did the buyers get the registration email? It is only sent from a successful
   `verify-payment` that found the row.
5. **Razorpay dashboard → Orders**, searched by buyer email. Two or more orders per buyer → **B**.
6. **Admin → Leads**, searched by buyer. Leads are deleted on successful verification. A remaining
   `checkout_…` lead with status `pending` means verification never completed.

## Findings

`diagnoseEventPayment.js` run on prod, 2026-10-15. Event row: `cccaf75e-2683-4594-b5d1-89f856bd4374` (lead source `checkout_bhubaneswar-2oct`).

| # | Device | Lead / row created | create-order (nginx) | Payment created | Row last updated | Attempts | DB row | verify-payment in nginx | Verdict |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Android, Chrome | 21:16:10 | 21:17:10 → 200 | 21:17:16 | 21:17:10 | 1 | PENDING, no payment ID | **none** | **A** |
| 2 | Android, Chrome | 11:04:51 | 11:05:36 → 200 | 11:05:47 | 11:05:36 | 1 | PENDING, no payment ID | **none** | **A** |
| 3 | iPhone, Safari | 11:15:37 | 11:16:16 → 200 | 11:16:22 | 11:16:16 | 1 | PENDING, no payment ID | **none** | **A** |

(Payment #2's real ID is `pay_TivUeIVcQNihOH`; the screenshot was misread.)

Nginx shows the full sequence for each buyer: `capture-lead` (OTP step) → `create-order` 200 →
**no `verify-payment` request at all**. That was checked in each payment's 10-minute window; any later
call would have left the row COMPLETED or FAILED, and it is neither.

What this establishes for #1 and #3:
- **B is ruled out.** Each order had exactly one attempt, and the row still holds the paid order ID.
- **C is ruled out.** The row is not `FAILED`, so no signature check ever failed.
- **The row was never touched after create-order.** `updated_at` equals the order creation time. Nothing
  wrote to it after the buyer paid, so `verify-payment` either never arrived or failed before its first DB write.
- The checkout lead (`checkout_bhubaneswar-2oct`, `pending`) still exists. It would have been deleted
  by a successful verification.

- **A′ is ruled out.** The backend answered `create-order` with 200 seconds before each payment. The
  `ReferenceError: PORT is not defined` crash loop in the PM2 log ran 1 Oct 12:57–13:16 UTC
  (18:27–18:46 IST), hours before payment #1. No `Error verifying payment` was logged.

**Root cause (confirmed for all 3):** the buyer's browser never sent `POST /api/payments/verify-payment`
after a successful UPI payment. Because that browser call is the only path to `COMPLETED`, and there is no
server-side webhook, the rows stayed PENDING and the Registrations tab (COMPLETED only) hid them.

**Scope: per-buyer, not systematic (checked 2026-10-15).**
- `verify-payment` *does* reach the server for other buyers: 16 requests across the retained nginx logs
  (`access.log.14.gz`: 10, `.13.gz`: 5, `.8.gz`: 1), and 12 paid registrations are COMPLETED.
- `findPaidPendingRegistrations.js` over **all events** finds exactly these 3 paid-but-PENDING rows. No other buyer is affected.
- 4 other PENDING rows reference orders Razorpay does not know (`order_ThscyUzhOI5oza`, `order_ThtG8kXUmBvHN8`,
  `order_TiEp9092QZYg3S`, `order_TiX3xKayTkKBcA`). These are orders made under the earlier test key, with no money involved.

**Why these 3 browsers didn't call back.** This can't be observed from the server. All 3 paid through a UPI app on a phone. The
known failure mode is that the browser tab gets reloaded, killed or closed during the switch to the UPI app and back, so Razorpay's
in-page `handler` never runs. The design flaw is that this in-page callback is the *only* way a
registration becomes COMPLETED. Razorpay explicitly recommends a server-to-server webhook for this reason.

## Remediation

- [ ] Restore the 3 registrations to `COMPLETED` with their payment IDs:
      `node scripts/completePaidPendingRegistrations.js` (dry run), then add `--apply` to write.
- [ ] Add a Razorpay `payment.captured` / `order.paid` webhook for event registrations, so the outcome no longer depends on the buyer's browser.
- [ ] `verify-payment`: return an error and log loudly when `updateMany` matches 0 rows, instead of returning `success: true`.
- [ ] `create-order`: stop overwriting the order ID on an existing PENDING row (append, or keep one row per order).
- [ ] Admin Registrations: show "PENDING with order ID" rows so paid-but-unverified buyers are visible.
- [ ] Daily reconciliation: compare captured Razorpay payments with COMPLETED registrations and alert on any gap.
- [ ] Deploy discipline: avoid deploying with `pm2 restart all` while registrations are open.
