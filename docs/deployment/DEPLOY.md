# Deploy Runbook — Setu-TSS Website (+ single-domain integration)

> 🔴 **Updated 13 Aug 2026 — the server moved.** The platform now runs on **SETU's own AWS
> account** at **<https://foundersschool.in>** (EC2 `setu-prod` `13.200.49.118` + RDS + S3,
> ap-south-1), not the Lightsail box at `65.1.142.47`. **There is no inbound SSH port** — shell
> access is tunnelled through AWS Systems Manager, so connect with **`ssh setu-prod`**; the old
> `ssh -i …pem ubuntu@<ip>` form times out by design. Full detail and setup:
> `N073/imp-docs/4 - Deployment Runbooks/MIGRATION - Lightsail to SETU AWS account.md` (§4.1a for
> access).

How the website is deployed on the production server, and the invariants that keep deploys safe. The website (this repo) and the LMS ([The-Startup-School-LMS](https://github.com/monarchsolanki/The-Startup-School-LMS)) are served under one domain by Nginx. This runbook is the **website** side; the LMS ships as a pre-built Docker image (see that repo's README).

## Topology

```
Browser ─HTTP:80─ Nginx ┌─ /        → Next.js frontend (PM2 tss-frontend, :3000)
                        ├─ /api/*    → Express backend  (PM2 tss-backend,  :5000)
                        └─ /lms      → LMS Docker container (:3001, loopback)
```

- **Server:** EC2 `setu-prod` `13.200.49.118` (SETU's AWS account, Ubuntu 24.04, Node 20, **4 GB RAM**, ap-south-1).
- **Shell:** `ssh setu-prod` (SSM tunnel — no inbound SSH port; `scp`/`rsync` work over it)
- **Branch deployed:** `main` (checked out in `~/Setu-TSS`). *(The `integration/single-domain` branch was retired 2026-07-13 — everyone commits to `main` directly now.)*
- **DB:** AWS RDS Postgres — website uses the `postgres` DB (Prisma); reads LMS courses from the `jjlms` DB via a SELECT-only `website_ro` role.
- **Reverse read (2026-07-19):** the LMS reads THIS database's `course_orders` + `coupons` tables (nothing else) via a SELECT-only **`lms_ro`** role — it powers the LMS admin's coupon-revenue dashboard. Conn string lives in `/opt/jj-lms/.env` as `WEBSITE_DB_URL_RO` (VPS backup: `~/lms-ro.txt`). Writes are denied at the Postgres level; if the role is ever dropped, only that dashboard degrades (shows "not connected").

## nginx hardening (2026-07-22, from QA D4/D5)

Applied to the shared nginx (backup at `/etc/nginx/sites-available/tss.bak-20260722`):
- **Edge rate limiting:** `/etc/nginx/conf.d/hardening.conf` defines `limit_req_zone $binary_remote_addr zone=ingress:10m rate=30r/s; limit_req_status 429;`. The dynamic locations (`/`, `/api/`, `/lms`) carry `limit_req zone=ingress burst=50 nodelay;`. Static-asset locations (`/_next/static/`, `/lms/_next/static/`) are intentionally NOT throttled.
- **Website security headers** on `location /` and `location /api/`: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Content-Security-Policy: frame-ancestors 'self'`. **`/lms` is deliberately omitted** — the LMS Next app sets its own headers; adding them at nginx would duplicate.
- **Still TODO (website, Madhwendra):** the website's Express `/api/helpdesk` still leaks stack traces on oversized multipart + has no admin view; add multer `limits{fieldSize,fields,parts}` + an error-catch that returns a clean JSON contract, and build a real site-wide CSP. HTTPS/HSTS lands at the DNS+SSL cutover.
- **Nginx config:** `/etc/nginx/sites-available/tss`.

## Standard deploy

```bash
ssh setu-prod
cd ~/Setu-TSS
git pull --ff-only

# --- backend (Express, plain JS — no build) ---
cd backend
npm install
npx prisma generate
# ⚠️ ALWAYS run the drop-check before db push (see "Schema discipline")
npx prisma migrate diff --from-url "$(grep '^DATABASE_URL' .env | cut -d= -f2- | tr -d '"')" \
  --to-schema-datamodel prisma/schema.prisma --script
# If that prints only additive statements (or "empty migration"), proceed. If it shows DROP, STOP.
npx prisma db push --skip-generate

# --- frontend (Next.js — build ON the VPS) ---
cd ../web
npm install
npm run build

# --- restart (clean restart picks up any new env vars) ---
cd ../backend && pm2 delete tss-backend && pm2 start server.js --name tss-backend && pm2 save
pm2 restart tss-frontend
```

Then smoke-test against the public URL (see below).

## Invariants — do not violate

- **`prisma db push` never `--accept-data-loss` on prod.** Run the `migrate diff` drop-check first. Prod has schema drift Madhwendra pushes from his own machine (`coupons`/`coupon_usages`, `event_registrations`, `users.role/name`); those are reconciled in `schema.prisma`. If a diff shows an unexpected DROP, it means new uncommitted drift — reconcile it into the schema (see `backend/prisma/SCHEMA_DRIFT_NOTE.md`), don't drop.
- **PM2 + new env vars → `pm2 delete` + `pm2 start`, never `pm2 restart`.** `restart` reuses the stale env snapshot; new `.env` vars won't load.
- **Build the frontend ON the VPS.** RAM is tight (911 MB) but builds succeed with swap. The LMS image, by contrast, is built on a Mac and shipped — the VPS can't build it.
- **Secrets never in git / never in chat.** `backend/.env` is gitignored. Edit on the VPS or `scp` from `~/N073/.secrets/`.
- **Rupees vs paise:** LMS `Course.price` is in **rupees**; `CourseOrder.amount` and Razorpay are in **paise**. Conversion (`×100`) happens exactly once, at order creation in `routes/coursePayments.js`.
- **Lockfile native binaries:** `web/package.json` pins `lightningcss-linux-x64-gnu` + `@tailwindcss/oxide-linux-x64-gnu` in `optionalDependencies`. A macOS-regenerated lockfile drops the linux entries (npm bug) and the VPS build fails on missing `.node` binaries — keep these pins.

## Required backend env (`~/Setu-TSS/backend/.env`)

Bare `KEY=value`. Beyond the standard `DATABASE_URL`/`JWT_SECRET`/`AWS_*`/`SMTP_*`:

| Var | Purpose |
|-----|---------|
| `LMS_DATABASE_URL_RO` | read-only conn to the `jjlms` DB (`website_ro` role) |
| `LMS_WEBHOOK_URL` | `http://127.0.0.1:3001/lms/api/webhooks/enrollment` (loopback, incl. `/lms`) |
| `LMS_WEBHOOK_SECRET` | shared HMAC secret (= LMS `WEBHOOK_SECRET`) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay (test keys currently; live at cutover) |
| `GUEST_TOKEN_SECRET` | Madhwendra's guest-checkout flexAuth |

## Two payment systems (do not re-collide)

- `/api/payments` → **Madhwendra's** event-registration payments (`routes/payments.js`, `EventRegistration`). Leave untouched.
- `/api/course-payments` → **our** LMS course orders (`routes/coursePayments.js`, `CourseOrder`) — server-side pricing, fires the signed enrollment webhook to the LMS.

## Post-deploy smoke test

```bash
B=https://foundersschool.in
for p in / /events /courses /courses/ai-startup-bootcamp /api/courses /api/homepage /lms/login; do
  printf "%-32s %s\n" "$p" "$(curl -s -o /dev/null -w '%{http_code} %{redirect_url}' "$B$p")"
done
# expect: / 200, /events 200, /courses 307→/events#courses, /courses/<slug> 200,
#         /api/courses 200, /api/homepage 200, /lms/login 200
curl -s -X POST "$B/api/course-payments/create-order" -H 'Content-Type: application/json' \
  -d '{"slug":"ai-startup-bootcamp","email":"smoke@example.com","name":"Smoke"}' -w '\n%{http_code}\n'
# expect 200 with {razorpayOrderId, amount, keyId}
```

## Rollback

The website deploy is code-only when `db push` is a no-op (the usual case). To roll back: `git checkout <prev-commit>` in `~/Setu-TSS`, `npm install` (both dirs), rebuild the frontend, `pm2 delete/start tss-backend` + `pm2 restart tss-frontend`. The last known-good pre-merge commit is `fa351c3`. The LMS is independent — `docker stop jj-lms` leaves the website untouched.

## Nginx / cron notes

- `/lms` proxies to `127.0.0.1:3001` with **no** trailing URI (the basePath app expects `/lms` intact — never write `.../lms/`).
- LMS session-reminder cron: `*/20 * * * * /opt/jj-lms/run-cron.sh` (Bearer `CRON_SECRET`), must run ≤ every 30 min.

## At DNS + SSL cutover (later)

Point DNS to the VPS, run Certbot, then: set the LMS `COOKIE_SECURE=true`; switch `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL`/`WEBSITE_BASE_URL` and the frontend `NEXT_PUBLIC_API_URL` to the `https://foundersschool.in` domain; rebuild the frontend and the LMS image; swap in **live** Razorpay keys; move SMTP to a transactional provider with a domain sender.

## Unified Events (feature/unified-events, 2026-07-15)

One offering = a website Event (marketing half, builder landing page) + an LMS Course (delivery half), linked via `tss_events.lms_course_slug`.

- **New internal endpoints** (HMAC `x-tss-signature` over the raw body with `LMS_WEBHOOK_SECRET`, signed `ts` ≤5 min): `POST /api/internal/lms-events/publish` (publish/golive/unpublish from the LMS; creates stubs HIDDEN until Go live; never touches `page_blocks`) and `POST /api/internal/admin-handoff` (one-time 60 s tokens for the LMS→builder jump; exchange at `POST /api/admin/handoff-exchange`, page `/admin/handoff`).
- **Coupons on course checkout**: `create-order` accepts `couponCode` (server-side validation against the shared coupon tables; `CouponUsage` recorded after payment); `POST /api/course-payments/validate-coupon` powers the checkout UI. `POST /api/course-payments/enroll-free` = self-serve ₹0 enrollment through the same enrollment webhook (`paymentStatus: 'free'`).
- **Additive schema** (drop-check before `db push`, as always): `tss_events.lms_course_slug`, `course_orders.coupon_code`, `course_orders.discount_amount`.
- **Optional env**: `ADMIN_HANDOFF_EMAIL` pins which account the handoff signs in as (default: role `admin` → `admin@foundersschool.in` → oldest user).
- LMS-linked events sell ONLY via `/courses/[slug]` (all landing CTAs route there); his `/api/payments` event checkout is untouched for pure marketing events.
