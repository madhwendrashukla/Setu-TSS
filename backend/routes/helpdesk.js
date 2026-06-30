const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const multer = require('multer');

// Configure multer to store file in memory
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post('/', upload.single('attachment'), async (req, res) => {
  try {
    const { message, email } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Configure Nodemailer
    // Note: Provide actual SMTP details in your .env or fallback to Ethereal for testing
    let transporter;
    if (process.env.SMTP_HOST) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    } else {
        // Fallback to ethereal for testing if no SMTP provided
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, 
            auth: {
                user: testAccount.user, 
                pass: testAccount.pass, 
            },
        });
    }

    const mailOptions = {
      from: '"Helpdesk Chatbot" <no-reply@yourcompany.com>',
      to: process.env.CONTACT_EMAIL || 'support@yourcompany.com',
      subject: 'New Helpdesk Request via Chat Widget',
      text: `You have received a new helpdesk request.\n\nFrom: ${email || 'Anonymous'}\n\nMessage:\n${message}`,
    };

    if (req.file) {
      mailOptions.attachments = [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        }
      ];
    }

    const info = await transporter.sendMail(mailOptions);
    console.log("Helpdesk message sent: %s", info.messageId);

    // If using ethereal, log the preview URL
    if (!process.env.SMTP_HOST) {
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error("Error sending helpdesk email:", error);
    res.status(500).json({ error: 'Failed to send helpdesk message' });
  }
});

module.exports = router;
