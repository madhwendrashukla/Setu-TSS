# ⚠️ Schema drift found & reconciled — 2026-07-07

**For: whoever owns the Mentor / SiteSetting / Event models (Madhwendra).**

## What happened

During the LMS integration deploy, running `prisma db push` against the
**live production database** (RDS) reported it would **DROP four columns that
contain live data**:

| Table | Column | Live definition |
|-------|--------|-----------------|
| `mentors` | `show_linkedin` | `boolean NOT NULL DEFAULT true` (12 rows had values) |
| `site_settings` | `section_toggles` | `jsonb NOT NULL DEFAULT '{}'` (1 row had a value) |
| `tss_events` | `start_time` | `text NULL` (2 rows had values) |
| `tss_events` | `end_time` | `text NULL` (2 rows had values) |

These four columns **existed in the live database but were NOT in the
committed `schema.prisma`**. That means at some point they were added directly
to the production DB (via a `db push` from an uncommitted local schema) and the
schema change was never committed to git.

**The push was refused (no `--accept-data-loss` flag) and nothing was dropped.**
The live data is intact.

## What I did

Added the four columns to `schema.prisma` (this commit), matching the live
definitions exactly. `prisma db push` is now a no-op for these — the schema and
the live DB agree, so a future sync will not try to drop them.

## What you should check

1. Confirm these column definitions match what your code expects (they were
   introspected straight from the live DB, so they're accurate to production).
2. Going forward: **always commit `schema.prisma` in the same PR as any
   `prisma db push`** so the repo stays the source of truth. If you have other
   local schema edits that were pushed to prod but not committed, reconcile
   those too — the next person's `db push` will hit the same wall.

## Update 2026-07-10 — coupons drift

Same situation again, caught by a pre-deploy `prisma migrate diff`: the live DB
has `coupons` and `coupon_usages` tables (with data — 1 live coupon) that were
not in the committed schema. A plain `db push` would have DROPPED them.

Added `Coupon` and `CouponUsage` models to `schema.prisma` (this commit),
introspected 1:1 from the live DDL. `migrate diff` against prod is now an empty
migration — schema and DB fully agree.

Madhwendra: if the code that creates/uses these tables lives on your machine,
please commit it (and its schema) so the repo stays the source of truth.
