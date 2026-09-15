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
 * Generate OTP email HTML matching Setu website clean white theme
 */
function otpEmailHtml(name, otp) {
  const currentYear = new Date().getFullYear();
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Setu Startup School</title>
    </head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#0F172A;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:36px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
              <!-- Top Gradient Accent Bar -->
              <tr>
                <td style="height:5px;background:linear-gradient(90deg,#6B21FB 0%,#8B5CF6 50%,#06B6D4 100%);"></td>
              </tr>
              <!-- Brand Header -->
              <tr>
                <td style="padding:28px 32px 20px;text-align:center;border-bottom:1px solid #F1F5F9;background:#FFFFFF;">
                  <div style="font-size:19px;font-weight:900;letter-spacing:-0.5px;color:#0F172A;text-transform:uppercase;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                    <span style="color:#6B21FB;">SETU</span> STARTUP SCHOOL
                  </div>
                  <div style="font-size:10px;font-weight:700;letter-spacing:1.8px;color:#64748B;text-transform:uppercase;margin-top:3px;">
                    The Startup School
                  </div>
                </td>
              </tr>
              <!-- Content Section -->
              <tr>
                <td style="padding:32px 32px 28px;text-align:center;">
                  <div style="display:inline-block;padding:4px 14px;background:#FAF5FF;border:1px solid #DDD6FE;border-radius:20px;color:#6B21FB;font-size:11px;font-weight:700;margin-bottom:14px;text-transform:uppercase;letter-spacing:1px;">
                    Email Verification
                  </div>
                  <h1 style="margin:0 0 16px;color:#0F172A;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Verify Your Email</h1>
                  <p style="margin:0 0 10px;color:#0F172A;font-size:15px;font-weight:600;line-height:1.6;">Hi ${name || 'Founder'},</p>
                  <p style="margin:0 0 24px;color:#64748B;font-size:14px;line-height:1.6;">Use the 6-digit verification code below to confirm your email and complete your enrollment. This code expires in <strong style="color:#6B21FB;">10 minutes</strong>.</p>
                  
                  <!-- OTP Box -->
                  <div style="background:#F8FAFC;border:2px dashed #7C3AED;border-radius:14px;padding:20px 16px;text-align:center;margin:0 auto 24px;max-width:300px;">
                    <span style="font-size:36px;font-weight:900;letter-spacing:10px;color:#6B21FB;font-family:'Courier New',Consolas,monospace;display:inline-block;padding-left:10px;">${otp}</span>
                  </div>
                  
                  <!-- Security Notice (No emojis) -->
                  <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:10px;padding:12px 16px;margin:0 auto;text-align:center;max-width:400px;">
                    <p style="margin:0;color:#64748B;font-size:12px;line-height:1.5;">If you did not request this code, please ignore this email. Do not share this code with anyone.</p>
                  </div>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 24px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
                  <p style="margin:0 0 4px;color:#64748B;font-size:12px;font-weight:500;">© ${currentYear} Setu Startup School. All rights reserved.</p>
                  <p style="margin:0;color:#94A3B8;font-size:11px;">Empowering Founders to Build, Scale & Fundraise</p>
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
