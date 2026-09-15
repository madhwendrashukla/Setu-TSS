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
  const plainText = text || html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const fromAddress = process.env.SMTP_FROM || '"Setu Startup School" <no-reply@setustartupschool.com>';

  const info = await transporter.sendMail({
    from: fromAddress,
    replyTo: 'support@setustartupschool.com',
    to,
    subject,
    html,
    text: plainText,
    headers: {
      'X-Entity-Ref-ID': `tss-${Date.now()}`,
      'List-Unsubscribe': '<mailto:support@setustartupschool.com?subject=unsubscribe>',
    }
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
 * Generate OTP email HTML matching Setu website color theme
 */
function otpEmailHtml(name, otp) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Setu Startup School</title>
    </head>
    <body style="margin:0;padding:0;background:#0B091E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B091E;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#13113B;border-radius:20px;overflow:hidden;border:1px solid rgba(139,92,246,0.35);box-shadow:0 20px 50px rgba(0,0,0,0.5);">
              <!-- Gradient Top Bar -->
              <tr>
                <td style="height:5px;background:linear-gradient(90deg,#5A1EEB 0%,#7C3AED 50%,#A855F7 100%);"></td>
              </tr>
              <!-- Brand Header -->
              <tr>
                <td style="text-align:center;padding:28px 24px 20px;background:#161244;border-bottom:1px solid rgba(139,92,246,0.2);">
                  <div style="display:inline-block;padding:8px 18px;background:rgba(255,255,255,0.08);border-radius:12px;margin-bottom:10px;">
                    <img src="https://thestartupschool.in/setu-logo-nav.png" alt="Setu Startup School" height="28" style="height:28px;max-height:28px;display:block;border:0;outline:none;" />
                  </div>
                  <p style="margin:0;color:#C4B5FD;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Setu Startup School</p>
                </td>
              </tr>
              <!-- Content Section -->
              <tr>
                <td style="padding:32px 28px 24px;text-align:center;">
                  <div style="display:inline-block;padding:4px 14px;background:rgba(124,58,237,0.15);border:1px solid rgba(168,85,247,0.3);border-radius:20px;color:#C084FC;font-size:11px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px;">
                    Email Verification
                  </div>
                  <h1 style="margin:0 0 16px;color:#FFFFFF;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Verify Your Email</h1>
                  <p style="margin:0 0 12px;color:#E2E8F0;font-size:15px;line-height:1.6;">Hi <strong style="color:#FFFFFF;">${name || 'Founder'}</strong>,</p>
                  <p style="margin:0 0 24px;color:#94A3B8;font-size:14px;line-height:1.6;">Use the 6-digit verification code below to confirm your email and complete your enrollment. This code expires in <strong style="color:#C084FC;">10 minutes</strong>.</p>
                  
                  <!-- OTP Box -->
                  <div style="background:#0B091E;border:2px dashed #7C3AED;border-radius:14px;padding:20px 16px;text-align:center;margin:0 auto 24px;max-width:320px;box-shadow:0 0 25px rgba(124,58,237,0.2);">
                    <span style="font-size:38px;font-weight:900;letter-spacing:10px;color:#FFFFFF;font-family:'Courier New',Consolas,monospace;display:inline-block;padding-left:10px;">${otp}</span>
                  </div>
                  
                  <!-- Security Notice -->
                  <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:10px;padding:12px 16px;margin:0 auto;text-align:center;max-width:400px;">
                    <p style="margin:0;color:#94A3B8;font-size:12px;line-height:1.5;">🔒 If you didn't request this code, please ignore this email. Do not share this code with anyone.</p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:18px 24px;background:#0F0D2E;border-top:1px solid rgba(139,92,246,0.2);text-align:center;">
                  <p style="margin:0 0 4px;color:#64748B;font-size:11px;">© ${currentYear} Setu Startup School. All rights reserved.</p>
                  <p style="margin:0;color:#475569;font-size:10px;">Empowering Founders to Build, Scale & Fundraise</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

module.exports = { sendMail, sendBulkMail, otpEmailHtml };
