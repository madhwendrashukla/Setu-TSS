const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

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

// Download ticket attachment
router.get('/:id/attachment', async (req, res) => {
  try {
    const ticket = await prisma.helpdeskTicket.findUnique({
      where: { id: req.params.id }
    });
    
    if (!ticket || !ticket.attachment_url) {
      return res.status(404).json({ error: 'Attachment not found' });
    }

    // Extract the S3 key from the URL (e.g. from https://bucket-name.s3.region.amazonaws.com/helpdesk/filename.ext)
    const urlObj = new URL(ticket.attachment_url);
    const key = decodeURIComponent(urlObj.pathname.substring(1)); // Removes the leading '/'

    const getObjectParams = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key
    };

    const command = new GetObjectCommand(getObjectParams);
    const s3Response = await s3Client.send(command);

    // Extract original filename for the Content-Disposition header
    const fileName = key.split('/').pop() || 'attachment';

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', s3Response.ContentType || 'application/octet-stream');
    
    // Pipe the S3 readable stream to the response
    s3Response.Body.pipe(res);
  } catch (error) {
    console.error("Failed to fetch attachment:", error);
    res.status(500).json({ error: 'Failed to download attachment' });
  }
});

module.exports = router;
