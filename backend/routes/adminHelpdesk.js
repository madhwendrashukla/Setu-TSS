const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get all helpdesk tickets
router.get('/', async (req, res) => {
  try {
    const tickets = await prisma.helpdeskTicket.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.json(tickets);
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    res.status(500).json({ error: 'Failed to fetch helpdesk tickets' });
  }
});

// Update ticket status
router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await prisma.helpdeskTicket.update({
      where: { id: req.params.id },
      data: { status }
    });
    res.json(updated);
  } catch (error) {
    console.error("Failed to update ticket:", error);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
});

// Delete a ticket
router.delete('/:id', async (req, res) => {
  try {
    await prisma.helpdeskTicket.delete({
      where: { id: req.params.id }
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete ticket:", error);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
});

module.exports = router;
