const { Pool } = require('pg');

// Read-only connection to the LMS's `jjlms` database on the shared RDS
// instance. LMS_DATABASE_URL_RO must use the `website_ro` Postgres role,
// which holds SELECT-only grants — writes are refused by the database
// itself, not by convention in this code.
//
// The LMS owns the Course table and all migrations against it; the website
// only ever reads. Column/table identifiers are quoted because the LMS's
// Prisma schema has no @@map directives (PascalCase/camelCase identifiers).
//
// UNIT WARNING: Course.price is in RUPEES (verified against the LMS admin
// form, "Price: (₹)"), NOT paise — convert to paise only where a payment
// gateway requires it.
// AWS RDS requires TLS; the `pg` driver defaults to no-SSL (unlike psql/
// Prisma, which negotiate it), so RDS rejects the connection with a
// pg_hba "no encryption" error. Enable SSL automatically for RDS hosts,
// leave it off for a plain local Postgres in dev. rejectUnauthorized:false
// accepts RDS's managed certificate without bundling the CA chain.
const usesRds = (process.env.LMS_DATABASE_URL_RO || '').includes('amazonaws.com');

const lmsPool = new Pool({
  connectionString: process.env.LMS_DATABASE_URL_RO,
  max: 5,
  idleTimeoutMillis: 30_000,
  ssl: usesRds ? { rejectUnauthorized: false } : false,
});

lmsPool.on('error', (err) => {
  console.error('LMS read-only pool error:', err.message);
});

const COURSE_COLUMNS = `
  id, title, "smallDescription", description, price, duration,
  level, category, slug, status, "fileKey", "createdAt",
  "deliveryMode", city
`;

// Public website catalog (/events "Courses & Cohorts"). Only courses the admin
// has made LIVE on the website (websiteLive = true) are listed — a course can
// be PUBLISHED (sellable via its /courses/[slug] checkout) yet hidden from the
// public catalog by leaving websiteLive off. Toggle it from the LMS course
// editor's "Publish to website" card (Go live = show, Hide = hide).
async function listPublishedCourses() {
  const { rows } = await lmsPool.query(
    `SELECT ${COURSE_COLUMNS} FROM "Course"
     WHERE status = 'PUBLISHED' AND "websiteLive" = true
     ORDER BY "createdAt" DESC`
  );
  return rows;
}

async function getCourseBySlug(slug) {
  const { rows } = await lmsPool.query(
    `SELECT ${COURSE_COLUMNS} FROM "Course" WHERE slug = $1 AND status = 'PUBLISHED' LIMIT 1`,
    [slug]
  );
  const course = rows[0] ?? null;
  if (!course) return null;
  course.tags = await getCourseTags(course.id);
  return course;
}

// The topics a course covers (LMS item 18) — the micro tags only. Hidden tags
// are left out, which is how an admin retires one without deleting it.
//
// 🔴 NEEDS `GRANT SELECT` ON "Tag" AND "_CourseMicroTags" TO website_ro.
// This role is SELECT-only and grants are per table, so a new table is
// invisible to it until granted — the symptom is a 500 from /api/courses/:slug
// in production while everything works locally as the owner. Failing soft here
// on purpose: tags are decoration on a sales page, and losing them must never
// take the page down.
async function getCourseTags(courseId) {
  try {
    const { rows } = await lmsPool.query(
      `SELECT t.name
         FROM "_CourseMicroTags" j
         JOIN "Tag" t ON t.id = j."B"
        WHERE j."A" = $1 AND t.hidden = false
        ORDER BY t.position ASC, t.name ASC`,
      [courseId]
    );
    return rows.map((r) => r.name);
  } catch (error) {
    console.error('Course tags unavailable (check website_ro grants):', error.message);
    return [];
  }
}

// Course bundles: if the given course is a bundle (has CourseBundleItem rows),
// returns the ordered list of member course ids to enrol the buyer into.
// Empty array = not a bundle (caller enrols in the course itself). Read-only
// via website_ro (needs SELECT on CourseBundleItem).
async function getBundleMemberCourseIds(bundleCourseId) {
  const { rows } = await lmsPool.query(
    `SELECT "courseId" FROM "CourseBundleItem" WHERE "bundleId" = $1 ORDER BY position ASC, "createdAt" ASC`,
    [bundleCourseId]
  );
  return rows.map((r) => r.courseId);
}

module.exports = { lmsPool, listPublishedCourses, getCourseBySlug, getCourseTags, getBundleMemberCourseIds };
