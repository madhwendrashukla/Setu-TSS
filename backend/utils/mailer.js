const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // false for STARTTLS (port 587)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send a single email
 * @param {string} to - recipient email
 * @param {string} subject - email subject
 * @param {string} html - HTML body
 * @param {string} [text] - plain text fallback
 */
async function sendMail(to, subject, html, text) {
  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"The Startup School" <noreply@foundersschool.in>',
    to,
    subject,
    html,
    text: text || html.replace(/<[^>]+>/g, ''),
  });
  return info;
}

/**
 * Send bulk emails with a delay to avoid SMTP rate limits
 * @param {Array<{email: string, name: string}>} recipients
 * @param {string} subject
 * @param {string} htmlTemplate - can use {{name}} placeholder
 * @param {number} [delayMs=500] - delay between sends
 * @returns {Promise<{sent: number, failed: number, errors: string[]}>}
 */
async function sendBulkMail(recipients, subject, htmlTemplate, delayMs = 500) {
  let sent = 0, failed = 0;
  const errors = [];

  for (const recipient of recipients) {
    try {
      const personalizedHtml = htmlTemplate
        .replace(/\{\{name\}\}/g, recipient.name || '')
        .replace(/\{\{email\}\}/g, recipient.email || '');

      await sendMail(recipient.email, subject, personalizedHtml);
      sent++;
    } catch (err) {
      failed++;
      errors.push(`${recipient.email}: ${err.message}`);
    }
    // Throttle between sends
    if (delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  return { sent, failed, errors };
}

/**
 * Generate OTP email HTML
 */
function otpEmailHtml(name, otp) {
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#8b5cf6,#d946ef);padding:32px;text-align:center;">
            <p style="margin:0;color:#fff;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;opacity:0.8;">The Startup School</p>
            <h1 style="margin:8px 0 0;color:#fff;font-size:26px;font-weight:800;letter-spacing:-0.5px;">Verify Your Email</h1>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 36px;">
            <p style="margin:0 0 16px;color:#374151;font-size:15px;">Hi <strong>${name || 'there'}</strong>,</p>
            <p style="margin:0 0 28px;color:#6b7280;font-size:14px;line-height:1.7;">Use the code below to verify your email and complete your enrollment. This code expires in <strong>10 minutes</strong>.</p>
            <div style="background:#f3f4f6;border:2px dashed #d1d5db;border-radius:12px;padding:24px;text-align:center;margin-bottom:28px;">
              <span style="font-size:42px;font-weight:900;letter-spacing:12px;color:#111827;font-family:'Courier New',monospace;">${otp}</span>
            </div>
            <p style="margin:0;color:#9ca3af;font-size:12px;">If you didn't request this, ignore this email. Do not share this code with anyone.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 36px;border-top:1px solid #f3f4f6;text-align:center;">
            <p style="margin:0;color:#d1d5db;font-size:11px;">© 2026 The Startup School. All rights reserved.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = { sendMail, sendBulkMail, otpEmailHtml };
