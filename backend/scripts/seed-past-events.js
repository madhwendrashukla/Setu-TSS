// ─────────────────────────────────────────────────────────────────────────────
// seed-past-events.js  —  runner (idempotent, dry-run capable, self-verifying)
//
// Usage:
//   node scripts/seed-past-events.js              ← real insert
//   node scripts/seed-past-events.js --dry-run    ← preview only, no DB writes
// ─────────────────────────────────────────────────────────────────────────────

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PAST_EVENTS }  = require('./seed-past-events-data');

const prisma   = new PrismaClient();
const DRY_RUN  = process.argv.includes('--dry-run');

// ── helpers ───────────────────────────────────────────────────────────────────

function log(msg)  { console.log(`  ${msg}`); }
function ok(msg)   { console.log(`  ✅ ${msg}`); }
function skip(msg) { console.log(`  ⏭  ${msg}`); }
function warn(msg) { console.warn(`  ⚠️  ${msg}`); }
function err(msg)  { console.error(`  ❌ ${msg}`); }

// ── pre-flight ────────────────────────────────────────────────────────────────

async function preflight() {
  log('Running pre-flight checks…');

  // 1. DB connectivity
  await prisma.$queryRaw`SELECT 1`;
  ok('Database connection OK');

  // 2. tss_events table exists
  const tableCheck = await prisma.$queryRaw`
    SELECT to_regclass('public.tss_events')::text AS t
  `;
  if (!tableCheck[0]?.t) throw new Error('Table tss_events does not exist — run prisma db push first.');
  ok('Table tss_events exists');

  // 3. Validate every event has a unique slug and required fields
  const slugsSeen = new Set();
  for (const ev of PAST_EVENTS) {
    if (!ev.slug)  throw new Error(`Event missing slug: "${ev.title}"`);
    if (!ev.title) throw new Error(`Event missing title (slug: ${ev.slug})`);
    if (slugsSeen.has(ev.slug)) throw new Error(`Duplicate slug in data file: "${ev.slug}"`);
    slugsSeen.add(ev.slug);
  }
  ok(`Data file has ${PAST_EVENTS.length} event(s) with unique slugs`);
}

// ── seed ──────────────────────────────────────────────────────────────────────

async function seedEvents() {
  const results = { seeded: [], skipped: [], failed: [] };

  for (const ev of PAST_EVENTS) {
    const { slug, title } = ev;

    // Idempotency check — never duplicate an existing slug
    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      if (DRY_RUN) {
        skip(`"${title}" (slug: ${slug}) already exists — would update page_blocks`);
        results.skipped.push(slug);
        continue;
      }
      // Update page_blocks, title, description in case data changed
      await prisma.event.update({
        where: { slug },
        data: { page_blocks: ev.page_blocks, title: ev.title, description: ev.description },
      });
      ok(`Updated page_blocks for: "${title}" (slug: ${slug})`);
      results.seeded.push(slug);
      continue;
    }

    if (DRY_RUN) {
      log(`[DRY RUN] Would insert: "${title}" (slug: ${slug})`);
      log(`          is_past=${ev.is_past}, is_active=${ev.is_active}`);
      log(`          start_date=${ev.start_date?.toISOString().split('T')[0]}`);
      log(`          page_blocks sections: ${Object.keys(ev.page_blocks?.section_visibility || {}).join(', ')}`);
      results.seeded.push(slug);
      continue;
    }

    try {
      await prisma.event.create({ data: ev });
      ok(`Inserted: "${title}" (slug: ${slug})`);
      results.seeded.push(slug);
    } catch (e) {
      err(`Failed to insert "${title}": ${e.message}`);
      results.failed.push({ slug, error: e.message });
    }
  }

  return results;
}

// ── verify ────────────────────────────────────────────────────────────────────

async function verify(seededSlugs) {
  if (DRY_RUN || seededSlugs.length === 0) return;

  console.log('\n── Verification ─────────────────────────────────────────────');
  for (const slug of seededSlugs) {
    const row = await prisma.event.findUnique({
      where: { slug },
      select: {
        id: true, title: true, slug: true,
        is_past: true, is_active: true,
        start_date: true, page_blocks: true,
      },
    });

    if (!row) {
      err(`VERIFY FAIL — slug "${slug}" not found after insert!`);
      continue;
    }

    const blocks       = typeof row.page_blocks === 'string' ? JSON.parse(row.page_blocks) : row.page_blocks;
    const sectionCount = blocks?.section_visibility ? Object.values(blocks.section_visibility).filter(Boolean).length : 0;
    const workshopCount = blocks?.workshops?.length ?? 0;
    const faqCount     = blocks?.faqs?.length ?? 0;
    const mentorCount  = blocks?.mentors?.items?.length ?? 0;

    ok(`"${row.title}"`);
    log(`    id         : ${row.id}`);
    log(`    slug       : ${row.slug}`);
    log(`    is_past    : ${row.is_past}`);
    log(`    is_active  : ${row.is_active}`);
    log(`    start_date : ${row.start_date?.toISOString().split('T')[0]}`);
    log(`    sections   : ${sectionCount} visible`);
    log(`    workshops  : ${workshopCount}`);
    log(`    mentors    : ${mentorCount}`);
    log(`    faqs       : ${faqCount}`);
    log(`    public URL : http://localhost:3000/events/${row.slug}`);
  }
}

// ── main ──────────────────────────────────────────────────────────────────────

(async () => {
  console.log('');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(DRY_RUN
    ? ' 🔍  SEED PAST EVENTS  [DRY RUN — no DB writes]'
    : ' 🌱  SEED PAST EVENTS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    await preflight();

    console.log('\n── Seeding ──────────────────────────────────────────────────');
    const results = await seedEvents();

    await verify(results.seeded);

    console.log('\n── Summary ──────────────────────────────────────────────────');
    if (DRY_RUN) {
      log(`Would insert : ${results.seeded.length} event(s)`);
      log(`Would skip   : ${results.skipped.length} event(s) (already exist)`);
      log('No changes made. Remove --dry-run to execute.');
    } else {
      ok(`Inserted : ${results.seeded.length} event(s)`);
      if (results.skipped.length)  skip(`Skipped  : ${results.skipped.length} (already existed)`);
      if (results.failed.length)   err(`Failed   : ${results.failed.length}`);
    }
    console.log('');

  } catch (e) {
    console.log('');
    err(`Seed aborted: ${e.message}`);
    console.log('');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
})();
