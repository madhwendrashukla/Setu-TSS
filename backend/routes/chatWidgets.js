const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all widgets
router.get('/', async (req, res) => {
  try {
    const widgets = await prisma.chatWidget.findMany({
      orderBy: { display_order: 'asc' },
    });
    res.json(widgets);
  } catch (error) {
    console.error("Error fetching chat widgets:", error);
    res.status(500).json({ error: 'Failed to fetch chat widgets' });
  }
});

// Create widget
router.post('/', async (req, res) => {
  try {
    const { title, subtitle, icon, link, is_active, display_order } = req.body;
    const widget = await prisma.chatWidget.create({
      data: {
        title,
        subtitle,
        icon,
        link,
        is_active: is_active ?? true,
        display_order: display_order || 0
      }
    });
    res.status(201).json(widget);
  } catch (error) {
    console.error("Error creating chat widget:", error);
    res.status(500).json({ error: 'Failed to create chat widget' });
  }
});

// Update widget
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, icon, link, is_active, display_order } = req.body;
    const widget = await prisma.chatWidget.update({
      where: { id },
      data: { title, subtitle, icon, link, is_active, display_order }
    });
    res.json(widget);
  } catch (error) {
    console.error("Error updating chat widget:", error);
    res.status(500).json({ error: 'Failed to update chat widget' });
  }
});

// Delete widget
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.chatWidget.delete({ where: { id } });
    res.json({ message: 'Widget deleted successfully' });
  } catch (error) {
    console.error("Error deleting chat widget:", error);
    res.status(500).json({ error: 'Failed to delete chat widget' });
  }
});

module.exports = router;
