const { Pool } = require('pg');

// Read-only connection to the LMS's `jjlms` database on the shared RDS
// instance. LMS_DATABASE_URL_RO must use the `website_ro` Postgres role,
// which holds SELECT-only grants — writes are refused by the database
// itself, not by convention in this code.
//
// The LMS owns the Course table and all migrations against it; the website
// only ever reads. Column/table identifiers are quoted because the LMS's
// Prisma schema has no @@map directives (PascalCase/camelCase identifiers).
const lmsPool = new Pool({
  connectionString: process.env.LMS_DATABASE_URL_RO,
  max: 5,
  idleTimeoutMillis: 30_000,
});

lmsPool.on('error', (err) => {
  console.error('LMS read-only pool error:', err.message);
});

const COURSE_COLUMNS = `
  id, title, "smallDescription", description, price, duration,
  level, category, slug, status, "fileKey", "createdAt"
`;

async function listPublishedCourses() {
  const { rows } = await lmsPool.query(
    `SELECT ${COURSE_COLUMNS} FROM "Course" WHERE status = 'PUBLISHED' ORDER BY "createdAt" DESC`
  );
  return rows;
}

async function getCourseBySlug(slug) {
  const { rows } = await lmsPool.query(
    `SELECT ${COURSE_COLUMNS} FROM "Course" WHERE slug = $1 AND status = 'PUBLISHED' LIMIT 1`,
    [slug]
  );
  return rows[0] ?? null;
}

module.exports = { lmsPool, listPublishedCourses, getCourseBySlug };
