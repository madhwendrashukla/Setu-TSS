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
