const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const nodemailer = require('nodemailer');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔴 THIS IS THE ONLY UNAUTHENTICATED UPLOAD ENDPOINT IN THE APPLICATION, AND
// IT WAS THE ONLY ONE WITHOUT A RATE LIMIT. express-rate-limit was already a
// dependency guarding five routes — coursePayments, lmsEvents, adminHandoff,
// internalAdmins, internalCoupons — every one of which requires either a
// signature or a login. The endpoint that needs it most had nothing, and nginx
// alone was the whole defence.
//
// ⚠️ THIS ONLY WORKS BECAUSE `app.set('trust proxy', 1)` IS NOW SET in
// server.js. Without it `req.ip` is 127.0.0.1 behind nginx and this limiter
// would be a single global bucket — one visitor could lock out everyone.
//
// Deliberately tighter than the other routes: a human opening a support widget
// sends one message, not ten a minute. The limit is on the ATTEMPT, so it also
// covers requests rejected later for size or file type.
const helpdeskLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many support requests. Please wait a minute and try again.' },
});

router.use(helpdeskLimiter);

// Configure AWS S3 Client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
});

// Hardened multer: Stream to S3, 5MB file cap, 20 fields, 20KB per field
const _upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const safeOriginalName = file.originalname.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9_-]/g, "-");
      const ext = file.originalname.includes('.') ? file.originalname.split('.').pop() : 'bin';
      cb(null, `helpdesk/${Date.now()}-${safeOriginalName}.${ext}`);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024, fields: 20, fieldSize: 20 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf', 'text/plain'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const err = new Error('Unsupported file type');
      err.code = 'UNSUPPORTED_FILE_TYPE';
      cb(err);
    }
  }
});

// Wrap multer so MulterError never reaches Express default handler (which leaks stack traces)
function uploadWithGuard(req, res, next) {
  _upload.single('attachment')(req, res, (err) => {
    if (!err) return next();
    if (err.code === 'LIMIT_FILE_SIZE')   return res.status(413).json({ error: 'Attachment too large. Maximum 5 MB allowed.' });
    if (err.code === 'LIMIT_FIELD_COUNT') return res.status(400).json({ error: 'Too many form fields submitted.' });
    if (err.code === 'LIMIT_FIELD_VALUE') return res.status(400).json({ error: 'A form field value is too large.' });
    if (err.code === 'UNSUPPORTED_FILE_TYPE') return res.status(422).json({ error: 'Unsupported file type. Only images, PDFs, and text files are permitted.' });
    return res.status(400).json({ error: 'Invalid request payload.' });
  });
}

// Global cached instances to prevent event-loop blocking from repeated setup
let cachedTransporter = null;
let cachedTestAccount = null;

async function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  if (process.env.SMTP_HOST) {
    cachedTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, 
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  } else {
    // Provision Ethereal test account exactly ONCE per server lifecycle
    cachedTestAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email', 
      port: 587, 
      secure: false,
      auth: { user: cachedTestAccount.user, pass: cachedTestAccount.pass },
    });
  }
  return cachedTransporter;
}

router.post('/', uploadWithGuard, async (req, res) => {
  try {
    const { message, email } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    if (message.length > 10000) return res.status(400).json({ error: 'Message too long. Maximum 10,000 characters allowed.' });

    // With multer-s3, the file is already uploaded, location holds the S3 URL.
    const attachmentUrl = req.file ? req.file.location : null;

    // Save to Database
    await prisma.helpdeskTicket.create({
      data: {
        email: email || null,
        message,
        attachment_url: attachmentUrl,
        status: 'new'
      }
    });

    // 🔴 THE SMTP ROUND-TRIP USED TO HAPPEN BEFORE THIS RESPONSE, AND IT IS WHY
    // THE LOAD TEST KEPT FAILING AFTER THE STORAGE FIX.
    //
    // Caching the transporter (below) stopped Ethereal being re-provisioned per
    // request, but the `await transporter.sendMail(...)` itself still sat in the
    // request path. Every helpdesk POST held its socket open for a full
    // connect-and-send to an EXTERNAL mail host before replying. Under 50
    // concurrent uploads that is 50 sockets parked on a third party we do not
    // control, which is exactly the "latency escalating to 23.32s" in the
    // 11-Aug retest.
    //
    // ⚠️ THE TICKET ROW IS THE DURABLE RECORD, NOT THE EMAIL. It is committed
    // above, before we answer. That is what makes replying early honest rather
    // than optimistic: if the mail later fails, the enquiry is still in the
    // database and visible at Admin → Helpdesk. The email is a notification,
    // not the system of record — so it must never decide how fast we answer,
    // and it must never be able to fail the request.
    res.status(200).json({ success: true, message: 'Message sent successfully' });

    // Fire-and-forget, AFTER responding. Errors are logged, never thrown: an
    // unhandled rejection here would take the whole process down and turn a
    // failed notification into an outage.
    void (async () => {
      try {
        const transporter = await getTransporter();

        let emailText = `New helpdesk request.\n\nFrom: ${email || 'Anonymous'}\n\nMessage:\n${message}`;
        if (attachmentUrl) {
          emailText += `\n\nAttachment: ${attachmentUrl}`;
        }

        const mailOptions = {
          // Must be a domain our SMTP server is authorised to relay for. This was
          // hardcoded to a placeholder (no-reply@yourcompany.com); Gmail quietly
          // rewrote it, but a real mail host rejects the whole message with
          // 550 "your domain is not allowed", so every helpdesk enquiry was lost.
          from: process.env.SMTP_FROM || '"Helpdesk" <no-reply@setustartupschool.com>',
          to: process.env.CONTACT_EMAIL || 'support@yourcompany.com',
          subject: 'New Helpdesk Request via Chat Widget',
          text: emailText,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('[helpdesk] sent:', info.messageId);
        if (!process.env.SMTP_HOST) console.log('[helpdesk] preview:', nodemailer.getTestMessageUrl(info));
      } catch (mailErr) {
        // Deliberately loud: the ticket is safe, but somebody has to notice that
        // notifications stopped arriving.
        console.error('[helpdesk] NOTIFICATION FAILED (ticket was saved):', mailErr.message);
      }
    })();
  } catch (error) {
    console.error('[helpdesk] error:', error.message);
    // ⚠️ Guard against a double send: everything after res.status(200) above is
    // detached, but a throw between the response and the end of the handler
    // would otherwise try to reply a second time and crash on ERR_HTTP_HEADERS_SENT.
    if (!res.headersSent) {
      res.status(500).json({ error: 'Failed to send helpdesk message' });
    }
  }
});

module.exports = router;
