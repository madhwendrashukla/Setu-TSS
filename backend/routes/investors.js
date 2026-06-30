const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Public routes
router.get('/', async (req, res) => {
  try {
    const data = await prisma.investor.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'desc' }
    });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch investors' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const data = await prisma.investor.findUnique({
      where: { id: req.params.id, is_active: true }
    });
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
});

const { upload, compressMultipleImages } = require('../utils/upload');

// Protected Admin Routes
router.post('/', authMiddleware, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'pocPhoto', maxCount: 1 }]), compressMultipleImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.logo) data.logo_url = req.files.logo[0].url;
    if (req.files?.pocPhoto) data.poc_photo = req.files.pocPhoto[0].url;
    
    // Convert arrays if sent as comma-separated strings
    if (typeof data.stages === 'string') data.stages = data.stages.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof data.sectors === 'string') data.sectors = data.sectors.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof data.portfolio_cos === 'string') data.portfolio_cos = data.portfolio_cos.split(',').map(s => s.trim()).filter(Boolean);
    
    const newInvestor = await prisma.investor.create({ data });
    res.json(newInvestor);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create' });
  }
});

router.put('/:id', authMiddleware, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'pocPhoto', maxCount: 1 }]), compressMultipleImages, async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.files?.logo) data.logo_url = req.files.logo[0].url;
    if (req.files?.pocPhoto) data.poc_photo = req.files.pocPhoto[0].url;
    
    // Convert arrays if sent as comma-separated strings
    if (typeof data.stages === 'string') data.stages = data.stages.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof data.sectors === 'string') data.sectors = data.sectors.split(',').map(s => s.trim()).filter(Boolean);
    if (typeof data.portfolio_cos === 'string') data.portfolio_cos = data.portfolio_cos.split(',').map(s => s.trim()).filter(Boolean);

    const updated = await prisma.investor.update({
      where: { id: req.params.id },
      data
    });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update' });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await prisma.investor.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete' });
  }
});

router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array of items' });
    const data = await prisma.investor.createMany({ data: items });
    res.json({ success: true, count: data.count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to bulk insert' });
  }
});

module.exports = router;
