const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Course sales page builder (issue 1, 19 Aug 2026).
//
// Everything on /courses/[slug] that used to be hardcoded — the pills, the
// thumbnail, the About block, the "What's included" list — is a row now, and
// every one of them can be reworded, hidden, reordered or deleted, including
// the defaults. Admins can add their own pills and sections too.
//
// The admin half is mounted under /api/admin so it inherits authMiddleware
// (which since 19 Aug requires role='admin'). The public read is deliberately
// open: it is the content of a public sales page.

const KINDS = new Set(['pill', 'section', 'included']);
const TONES = new Set(['violet', 'slate', 'green', 'amber']);
// A builtin row renders live course data. The set is closed because the
// renderer switches on it — an unknown value would render nothing at all.
const BUILTINS = new Set(['level', 'duration', 'thumbnail', 'about', 'included']);

function clean(v, max) {
  return String(v ?? '').trim().slice(0, max);
}

function validate(body, { partial = false } = {}) {
  const out = {};
  if (!partial || body.kind !== undefined) {
    const kind = clean(body.kind, 20);
    if (!KINDS.has(kind)) return { error: 'kind must be pill, section or included' };
    out.kind = kind;
  }
  if (!partial || body.label !== undefined) {
    const label = clean(body.label, 200);
    if (!label) return { error: 'A label is required' };
    out.label = label;
  }
  if (body.builtin !== undefined) {
    const b = clean(body.builtin, 20);
    if (b && !BUILTINS.has(b)) return { error: 'Unknown builtin' };
    out.builtin = b || null;
  }
  if (body.body !== undefined) out.body = clean(body.body, 4000) || null;
  if (body.tone !== undefined) {
    const t = clean(body.tone, 20);
    if (t && !TONES.has(t)) return { error: 'Unknown tone' };
    out.tone = t || null;
  }
  if (body.scope !== undefined) out.scope = clean(body.scope, 200) || '*';
  if (body.hidden !== undefined) out.hidden = body.hidden === true;
  if (body.position !== undefined) {
    const n = Number(body.position);
    out.position = Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  return { data: out };
}

// ── Admin (mounted under /api/admin, so authMiddleware already applied) ──────
const adminRouter = express.Router();

adminRouter.get('/', async (req, res) => {
  const scope = clean(req.query.scope, 200) || undefined;
  const items = await prisma.coursePageItem.findMany({
    where: scope ? { scope } : undefined,
    orderBy: [{ scope: 'asc' }, { kind: 'asc' }, { position: 'asc' }],
  });
  res.json(items);
});

adminRouter.post('/', async (req, res) => {
  const { data, error } = validate(req.body || {});
  if (error) return res.status(400).json({ error });
  // New rows land at the end of their own kind+scope group, so adding a pill
  // never drops it into the middle of the sections.
  const last = await prisma.coursePageItem.findFirst({
    where: { scope: data.scope ?? '*', kind: data.kind },
    orderBy: { position: 'desc' },
    select: { position: true },
  });
  const item = await prisma.coursePageItem.create({
    data: { ...data, scope: data.scope ?? '*', position: (last?.position ?? 0) + 10 },
  });
  res.status(201).json(item);
});

adminRouter.put('/:id', async (req, res) => {
  const { data, error } = validate(req.body || {}, { partial: true });
  if (error) return res.status(400).json({ error });
  try {
    const item = await prisma.coursePageItem.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch {
    res.status(404).json({ error: 'That item no longer exists' });
  }
});

// 🔴 Deletes anything, defaults included — that is the point of the feature.
// The page is built entirely from these rows, so an empty list renders a bare
// page rather than silently falling back to old hardcoded content.
adminRouter.delete('/:id', async (req, res) => {
  try {
    await prisma.coursePageItem.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(404).json({ error: 'That item no longer exists' });
  }
});

// Swap with the neighbour in the same scope+kind group.
adminRouter.post('/:id/move', async (req, res) => {
  const dir = req.body?.direction === 'up' ? 'up' : 'down';
  const row = await prisma.coursePageItem.findUnique({ where: { id: req.params.id } });
  if (!row) return res.status(404).json({ error: 'That item no longer exists' });
  const neighbour = await prisma.coursePageItem.findFirst({
    where: {
      scope: row.scope,
      kind: row.kind,
      position: dir === 'up' ? { lt: row.position } : { gt: row.position },
    },
    orderBy: { position: dir === 'up' ? 'desc' : 'asc' },
  });
  if (!neighbour) return res.json({ ok: true, moved: false });
  await prisma.$transaction([
    prisma.coursePageItem.update({ where: { id: row.id }, data: { position: neighbour.position } }),
    prisma.coursePageItem.update({ where: { id: neighbour.id }, data: { position: row.position } }),
  ]);
  res.json({ ok: true, moved: true });
});

// ── Public read, resolved for one course ────────────────────────────────────
const publicRouter = express.Router();

publicRouter.get('/:slug', async (req, res) => {
  const slug = clean(req.params.slug, 200);
  const rows = await prisma.coursePageItem.findMany({
    where: { hidden: false, scope: { in: [slug, '*'] } },
    orderBy: [{ position: 'asc' }],
  });
  // Per-kind override: a course with its own rows for a kind replaces the
  // shared '*' rows for that kind, rather than appending to them — otherwise a
  // course could never REMOVE a default, only add to it.
  const out = {};
  for (const kind of KINDS) {
    const own = rows.filter((r) => r.kind === kind && r.scope === slug);
    out[kind] = own.length ? own : rows.filter((r) => r.kind === kind && r.scope === '*');
  }
  res.json(out);
});

module.exports = { adminRouter, publicRouter, BUILTINS, KINDS, TONES };
