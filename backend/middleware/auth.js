const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔴 SECURITY FIX, 19 Aug 2026 — this middleware guards every /api/admin/*
// route, and it used to check only that the JWT signature was valid. Combined
// with /api/admin/login, which never looked at `role`, and public signup at
// /api/auth/signup, which creates users with role 'user', that meant ANY member
// of the public could sign up and then log into the website CMS: homepage,
// events, coupons, mass mailer, leads, registrations.
//
// The `role` column existed the whole time and was never read anywhere.
//
// ⚠️ The role is checked against the DATABASE, not against the token. That is
// deliberate and costs one indexed lookup per admin request:
//   • revoking someone takes effect immediately, instead of whenever their
//     token happens to expire;
//   • tokens minted before this fix (and the SSO handoff's, which carry no
//     role) keep working for genuine admins, so nobody is logged out by the fix.
const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(400).json({ error: 'Invalid token.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true },
    });
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' });
    }
    req.user = { ...decoded, id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    console.error('authMiddleware lookup failed:', err.message);
    return res.status(500).json({ error: 'Could not verify admin access.' });
  }
};

module.exports = authMiddleware;
