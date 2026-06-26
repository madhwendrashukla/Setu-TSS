const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', async (req, res) => {
  try {
    const data = await prisma.founderEvent.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch founder events' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.founderEvent.findUnique({
      where: { id: req.params.id, is_active: true }
    });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

// Protected Admin Routes
router.post('/', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.founderEvent.create({ data: req.body });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create' });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const data = await prisma.founderEvent.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.founderEvent.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array of items' });
    const data = await prisma.founderEvent.createMany({ data: items });
    res.json({ success: true, count: data.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk insert' });
  }
});

module.exports = router;
