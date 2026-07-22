const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

// Hardened multer: 5MB file cap, 20 fields, 20KB per field
const _upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, fields: 20, fieldSize: 20 * 1024 },
});

// Wrap multer so MulterError never reaches Express default handler (which leaks stack traces)
function uploadWithGuard(req, res, next) {
  _upload.single('attachment')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE')   return res.status(413).json({ error: 'Attachment too large. Maximum 5 MB allowed.' });
    if (err.code === 'LIMIT_FIELD_COUNT') return res.status(400).json({ error: 'Too many form fields submitted.' });
    if (err.code === 'LIMIT_FIELD_VALUE') return res.status(400).json({ error: 'A form field value is too large.' });
    return res.status(400).json({ error: 'Invalid request payload.' });
  });
}

router.post('/', uploadWithGuard, async (req, res) => {
  try {
    const { message, email } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (message.length > 10000) return res.status(400).json({ error: 'Message too long. Maximum 10,000 characters allowed.' });

    let transporter;
    if (process.env.SMTP_HOST) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST, port: process.env.SMTP_PORT || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
    } else {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email', port: 587, secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
    }

    const mailOptions = {
      from: '"Helpdesk Chatbot" <no-reply@yourcompany.com>',
      to: process.env.CONTACT_EMAIL || 'support@yourcompany.com',
      subject: 'New Helpdesk Request via Chat Widget',
      text: `New helpdesk request.\n\nFrom: ${email || 'Anonymous'}\n\nMessage:\n${message}`,
    };
    if (req.file) {
      mailOptions.attachments = [{ filename: req.file.originalname, content: req.file.buffer }];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log('[helpdesk] sent:', info.messageId);
    if (!process.env.SMTP_HOST) console.log('[helpdesk] preview:', nodemailer.getTestMessageUrl(info));

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('[helpdesk] error:', error.message);
    res.status(500).json({ error: 'Failed to send helpdesk message' });
  }
});

module.exports = router;
