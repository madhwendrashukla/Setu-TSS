// Seeds the course-page builder with exactly what the page hardcoded before
// issue 1, so deploying changes nothing a visitor sees.
//
// Idempotent: it does nothing at all if any '*' rows already exist, so a second
// run can never duplicate the defaults or resurrect ones an admin has since
// deleted — deleting a default is a supported action, and a seed that undid it
// would be worse than no seed.
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const DEFAULTS = [
  // Pills. `label` is what the ADMIN sees in the builder; for builtin rows the
  // page renders live course data instead of this text.
  { kind: 'pill', builtin: 'level',    label: 'Course level',      tone: 'violet', position: 10 },
  { kind: 'pill', builtin: 'duration', label: 'Hours of content',  tone: 'slate',  position: 20 },
  { kind: 'pill', builtin: null,       label: 'Enrolling now',     tone: 'green',  position: 30 },

  // Sections, in the order they appear down the page.
  { kind: 'section', builtin: 'thumbnail', label: 'Course image',      position: 10 },
  { kind: 'section', builtin: 'about',     label: 'About this course', position: 20 },
  { kind: 'section', builtin: 'included',  label: "What's included",   position: 30 },

  // The rows inside "What's included".
  { kind: 'included', builtin: null, label: 'Full access in your LMS learning portal',     position: 10 },
  { kind: 'included', builtin: null, label: 'Recorded video lessons you can revisit anytime', position: 20 },
  { kind: 'included', builtin: null, label: 'Downloadable notes, slides & resources',      position: 30 },
  { kind: 'included', builtin: null, label: 'Live session reminders + calendar invites',   position: 40 },
  { kind: 'included', builtin: null, label: 'Certificate of completion',                   position: 50 },
];

(async () => {
  const existing = await prisma.coursePageItem.count({ where: { scope: '*' } });
  if (existing > 0) {
    console.log(`course-page defaults already present (${existing} rows) — nothing to do`);
    await prisma.$disconnect();
    return;
  }
  await prisma.coursePageItem.createMany({
    data: DEFAULTS.map((d) => ({ ...d, scope: '*' })),
  });
  console.log(`seeded ${DEFAULTS.length} default course-page rows`);
  await prisma.$disconnect();
})().catch(async (e) => {
  console.error('seed failed:', e.message);
  await prisma.$disconnect();
  process.exit(1);
});
