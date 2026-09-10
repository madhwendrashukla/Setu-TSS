const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Public route to get all active logos (optional, since /api/homepage does this)
router.get('/', async (req, res) => {
  try {
    const logos = await prisma.studentNetworkLogo.findMany({
      where: { is_active: true },
      orderBy: { display_order: 'asc' }
    });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch student network logos' });
  }
});

// Admin Routes (Protected)

// Get all logos including inactive ones for admin
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const logos = await prisma.studentNetworkLogo.findMany({
      orderBy: { display_order: 'asc' }
    });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all logos' });
  }
});

// Create a new logo
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.studentNetworkLogo.create({ data: req.body });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create logo' });
  }
});

// Update a logo
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.studentNetworkLogo.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update logo' });
  }
});

// Delete a logo
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.studentNetworkLogo.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete logo' });
  }
});

module.exports = router;
