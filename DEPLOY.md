# Deploy Runbook — Setu-TSS Website (+ single-domain integration)

How the website is deployed on the AWS Lightsail VPS, and the invariants that keep deploys safe. The website (this repo) and the LMS ([The-Startup-School-LMS](https://github.com/monarchsolanki/The-Startup-School-LMS)) are served under one domain by Nginx. This runbook is the **website** side; the LMS ships as a pre-built Docker image (see that repo's README).

## Topology

```
Browser ─HTTP:80─ Nginx ┌─ /        → Next.js frontend (PM2 tss-frontend, :3000)
                        ├─ /api/*    → Express backend  (PM2 tss-backend,  :5000)
                        └─ /lms      → LMS Docker container (:3001, loopback)
```

- **VPS:** `65.1.142.47` (Lightsail, Ubuntu 24.04, Node 20, 911 MB RAM, ap-south-1).
- **SSH:** `ssh -i ~/N073/.secrets/LightsailDefaultKey-ap-south-1.pem ubuntu@65.1.142.47`
- **Branch deployed:** `integration/single-domain` (checked out in `~/Setu-TSS`).
- **DB:** AWS RDS Postgres — website uses the `postgres` DB (Prisma); reads LMS courses from the `jjlms` DB via a SELECT-only `website_ro` role.
- **Nginx config:** `/etc/nginx/sites-available/tss`.

## Standard deploy

```bash
ssh -i ~/N073/.secrets/LightsailDefaultKey-ap-south-1.pem ubuntu@65.1.142.47
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
B=http://65.1.142.47
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

Point DNS to the VPS, run Certbot, then: set the LMS `COOKIE_SECURE=true`; switch `NEXTAUTH_URL`/`NEXT_PUBLIC_APP_URL`/`WEBSITE_BASE_URL` and the frontend `NEXT_PUBLIC_API_URL` to the `https://thestartupschool.in` domain; rebuild the frontend and the LMS image; swap in **live** Razorpay keys; move SMTP to a transactional provider with a domain sender.
