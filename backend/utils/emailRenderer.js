/**
 * Dynamic Email Renderer for Event Registrations (Setu Startup School)
 * Universal support for Paid, Free, and LMS hybrid events.
 * Anti-Spam optimized with strict HTML standards & dual HTML/Text output.
 */

function formatEventDate(isoDate, timeStr) {
  if (!isoDate) return null;
  try {
    let formatted = new Date(isoDate).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    if (timeStr) formatted += ` • ${timeStr}`;
    return formatted;
  } catch {
    return null;
  }
}

function substituteVariables(text, vars) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g, (_, key) => {
    const lowerKey = key.toLowerCase();
    return vars[lowerKey] !== undefined ? vars[lowerKey] : `{{${key}}}`;
  });
}

function renderRegistrationEmail({ templateConfig = {}, registration = {}, event = {} }) {
  const currentYear = new Date().getFullYear();

  // Format variables
  const eventDate = formatEventDate(event.start_date, event.start_time);
  const eventVenue = event.venue || event.city || (event.mode === 'online' ? 'Online via Zoom' : 'Online / Venue TBA');
  const amountStr = (!registration.amount || registration.amount === 0) ? 'Free' : `₹${registration.amount}`;
  const paymentRef = registration.razorpay_payment_id || (registration.id ? `reg_${registration.id.slice(-8)}` : 'Confirmed');
  const guestName = registration.guest_name || registration.user?.name || 'Founder';
  const guestEmail = registration.guest_email || registration.user?.email || '';
  const guestPhone = registration.guest_phone || '';
  const ticketTier = registration.ticket_tier || 'Standard Workshop Pass';

  // Read links from templateConfig or event page_blocks fallback
  let customBlocks = {};
  if (event.page_blocks) {
    try {
      customBlocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
    } catch (_) {}
  }

  const whatsappLink = templateConfig.whatsapp_link || customBlocks.whatsapp_link || customBlocks.whatsapp_group_link || '';
  const zoomLink = templateConfig.zoom_link || customBlocks.zoom_link || customBlocks.meeting_link || '';
  const otherLink = templateConfig.other_link || customBlocks.other_link || customBlocks.resource_link || '';
  const otherLinkLabel = templateConfig.other_link_label || 'Access Resources & Materials';

  const vars = {
    name: guestName,
    full_name: guestName,
    email: guestEmail,
    phone: guestPhone,
    event_title: event.title || 'Startup Workshop',
    title: event.title || 'Startup Workshop',
    event_date: eventDate || 'Date to be announced',
    date: eventDate || 'Date to be announced',
    event_venue: eventVenue,
    venue: eventVenue,
    location: eventVenue,
    ticket_tier: ticketTier,
    tier: ticketTier,
    amount: amountStr,
    price: amountStr,
    payment_id: paymentRef,
    ref: paymentRef,
    zoom_link: zoomLink,
    whatsapp_link: whatsappLink,
    other_link: otherLink,
  };

  const isCustomEnabled = templateConfig && templateConfig.enabled === true;

  // 1. Subject Line (Clean, spam-safe)
  const rawSubject = isCustomEnabled && templateConfig.subject
    ? templateConfig.subject
    : `Registration Confirmed: {{event_title}}`;
  const subject = substituteVariables(rawSubject, vars);

  // 2. Heading
  const rawHeading = isCustomEnabled && templateConfig.heading
    ? templateConfig.heading
    : `Registration Confirmed`;
  const heading = substituteVariables(rawHeading, vars);

  // 3. Message Body
  let rawBody = '';
  if (isCustomEnabled && templateConfig.message_body) {
    rawBody = templateConfig.message_body;
  } else {
    rawBody = registration.amount > 0
      ? `Your payment has been successfully verified. Your seat for <strong>{{event_title}}</strong> is secured.`
      : `You are successfully registered for <strong>{{event_title}}</strong>. We are excited to have you with us.`;
  }
  const messageBody = substituteVariables(rawBody, vars);

  // 4. Custom Notes
  const rawNotes = isCustomEnabled && templateConfig.custom_notes ? templateConfig.custom_notes : '';
  const customNotes = substituteVariables(rawNotes, vars);

  // 5. Action Buttons (1. WhatsApp, 2. Zoom, 3. Other Link)
  const buttons = [];
  if (whatsappLink) {
    buttons.push(`
      <a href="${whatsappLink}" target="_blank" style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:10px;margin:5px 6px 5px 0;">
        💬 Join WhatsApp Community
      </a>
    `);
  }
  if (zoomLink) {
    buttons.push(`
      <a href="${zoomLink}" target="_blank" style="display:inline-block;background:#5A1EEB;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:10px;margin:5px 6px 5px 0;">
        📹 Join Zoom Session
      </a>
    `);
  }
  if (otherLink) {
    buttons.push(`
      <a href="${otherLink}" target="_blank" style="display:inline-block;background:#7C3AED;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 20px;border-radius:10px;margin:5px 6px 5px 0;">
        🔗 ${otherLinkLabel}
      </a>
    `);
  }
  const actionButtonsHtml = buttons.length > 0 ? `
    <div style="margin:22px 0 16px;">
      ${buttons.join('')}
    </div>
  ` : '';

  // 6. Summary Card
  const includeDetails = templateConfig.include_details_card !== false;
  const summaryHtml = includeDetails ? `
    <div style="background:#0E0C28;border:1px solid rgba(139,92,246,0.3);border-radius:14px;padding:20px;margin:22px 0;">
      <p style="margin:0 0 12px;color:#C084FC;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;">Registration Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;width:110px;">Package / Tier</td><td style="padding:6px 0;color:#FFFFFF;font-size:13px;font-weight:600;">${ticketTier}</td></tr>
        ${eventDate ? `<tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;width:110px;">Date & Time</td><td style="padding:6px 0;color:#E2E8F0;font-size:13px;font-weight:500;">${eventDate}</td></tr>` : ''}
        ${eventVenue ? `<tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;width:110px;">Venue / Mode</td><td style="padding:6px 0;color:#E2E8F0;font-size:13px;font-weight:500;">${eventVenue}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;width:110px;">Amount</td><td style="padding:6px 0;color:#34D399;font-size:13px;font-weight:800;">${amountStr}</td></tr>
        <tr><td style="padding:6px 0;color:#94A3B8;font-size:13px;width:110px;">Ref ID</td><td style="padding:6px 0;color:#94A3B8;font-size:12px;font-family:'Courier New',monospace;">${paymentRef}</td></tr>
      </table>
    </div>
  ` : '';

  // 7. Custom Notes Box
  const notesHtml = customNotes ? `
    <div style="background:#161244;border-left:4px solid #7C3AED;border-radius:0 10px 10px 0;padding:14px 16px;margin:20px 0;color:#E2E8F0;font-size:13px;line-height:1.6;">
      <strong style="color:#C084FC;">📌 Instructions & Notes:</strong><br/>
      <span style="white-space:pre-wrap;">${customNotes}</span>
    </div>
  ` : '';

  // 8. Full HTML Body (Website Brand Theme: #0B091E, #13113B, #5A1EEB)
  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="color-scheme" content="dark">
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#0B091E;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#0B091E;padding:36px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#13113B;border-radius:20px;overflow:hidden;border:1px solid rgba(139,92,246,0.35);box-shadow:0 20px 50px rgba(0,0,0,0.5);">
              <!-- Top Gradient Accent -->
              <tr>
                <td style="height:5px;background:linear-gradient(90deg,#5A1EEB 0%,#7C3AED 50%,#A855F7 100%);"></td>
              </tr>
              <!-- Brand Header -->
              <tr>
                <td style="text-align:center;padding:26px 24px 18px;background:#161244;border-bottom:1px solid rgba(139,92,246,0.2);">
                  <div style="display:inline-block;padding:8px 18px;background:rgba(255,255,255,0.08);border-radius:12px;margin-bottom:8px;">
                    <img src="https://thestartupschool.in/setu-logo-nav.png" alt="Setu Startup School" height="28" style="height:28px;max-height:28px;display:block;border:0;outline:none;" />
                  </div>
                  <p style="margin:0;color:#C4B5FD;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Setu Startup School</p>
                </td>
              </tr>
              <!-- Content Section -->
              <tr>
                <td style="padding:32px 28px 24px;">
                  <div style="display:inline-block;padding:4px 12px;background:rgba(16,185,129,0.15);border:1px solid rgba(16,185,129,0.35);border-radius:20px;color:#34D399;font-size:11px;font-weight:700;margin-bottom:12px;text-transform:uppercase;letter-spacing:1px;">
                    ✓ Registration Confirmed
                  </div>
                  <h1 style="margin:0 0 16px;color:#FFFFFF;font-size:22px;font-weight:800;letter-spacing:-0.5px;">${heading}</h1>
                  
                  <p style="margin:0 0 12px;color:#E2E8F0;font-size:15px;line-height:1.6;">Hi <strong style="color:#FFFFFF;">${guestName}</strong>,</p>
                  
                  <div style="color:#CBD5E1;font-size:14px;line-height:1.7;">
                    ${messageBody.includes('<p>') || messageBody.includes('<div>') ? messageBody : messageBody.replace(/\n/g, '<br/>')}
                  </div>

                  ${summaryHtml}

                  ${actionButtonsHtml}

                  ${notesHtml}

                  <p style="margin:24px 0 0;color:#94A3B8;font-size:12px;line-height:1.6;border-top:1px solid rgba(139,92,246,0.2);padding-top:16px;">
                    Have questions? Reply directly to this email or reach our support desk at <a href="mailto:support@setustartupschool.com" style="color:#A855F7;text-decoration:none;font-weight:600;">support@setustartupschool.com</a>.
                  </p>
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

  // 9. Clean Plain-Text Version (Anti-Spam deliverability)
  const plainText = `
SETU STARTUP SCHOOL - REGISTRATION CONFIRMED
============================================

Hi ${guestName},

${messageBody.replace(/<[^>]+>/g, '')}

--- REGISTRATION SUMMARY ---
Event: ${vars.event_title}
Ticket Tier: ${ticketTier}
${eventDate ? `Date: ${eventDate}\n` : ''}${eventVenue ? `Venue: ${eventVenue}\n` : ''}Amount: ${amountStr}
Reference ID: ${paymentRef}

${whatsappLink ? `WhatsApp Community: ${whatsappLink}\n` : ''}${zoomLink ? `Zoom Meeting Link: ${zoomLink}\n` : ''}${otherLink ? `${otherLinkLabel}: ${otherLink}\n` : ''}
${customNotes ? `Important Notes:\n${customNotes}\n\n` : ''}
Need help? Contact support@setustartupschool.com.
© ${currentYear} Setu Startup School. All rights reserved.
  `.trim();

  return {
    subject,
    html,
    text: plainText,
    vars
  };
}

module.exports = {
  renderRegistrationEmail,
  substituteVariables,
  formatEventDate
};
