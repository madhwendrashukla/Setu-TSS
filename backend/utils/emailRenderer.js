/**
 * Dynamic Email Renderer for Event Registrations (Setu Startup School)
 * Universal support for Paid, Free, and LMS hybrid events.
 * Anti-Spam deliverability optimized with clean HTML & plain-text fallback.
 * Light/White Theme matching the website with Setu brand colors (#6B21FB, #10B981, #0F172A).
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

  // 1. Subject Line
  const rawSubject = isCustomEnabled && templateConfig.subject
    ? templateConfig.subject
    : `Registration Confirmed: {{event_title}}`;
  const subject = substituteVariables(rawSubject, vars);

  // 2. Heading
  const rawHeading = isCustomEnabled && templateConfig.heading
    ? templateConfig.heading
    : `Registration Confirmed!`;
  const heading = substituteVariables(rawHeading, vars);

  // 3. Message Body
  let rawBody = '';
  if (isCustomEnabled && templateConfig.message_body) {
    rawBody = templateConfig.message_body;
  } else {
    rawBody = registration.amount > 0
      ? `Your payment has been successfully verified. Your seat for <strong>{{event_title}}</strong> is secured. We look forward to seeing you!`
      : `Your registration for <strong>{{event_title}}</strong> is confirmed. We are excited to have you join us!`;
  }
  let messageBody = substituteVariables(rawBody, vars);

  // Check if messageBody already starts with a greeting like "Hi ..." or "Hello ..."
  const hasGreetingInBody = /^\s*(hi|hello|dear|hey)\b/i.test(messageBody.replace(/<[^>]+>/g, '').trim());
  const greetingHtml = hasGreetingInBody
    ? ''
    : `<p style="margin:0 0 14px;color:#0F172A;font-size:15px;font-weight:600;line-height:1.6;">Hi ${guestName},</p>`;

  // 4. Custom Notes
  const rawNotes = isCustomEnabled && templateConfig.custom_notes ? templateConfig.custom_notes : '';
  const customNotes = substituteVariables(rawNotes, vars);

  // 5. Action Buttons (No emojis, clean modern buttons)
  const buttons = [];
  if (whatsappLink) {
    buttons.push(`
      <a href="${whatsappLink}" target="_blank" style="display:inline-block;background:#10B981;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;margin:6px 8px 6px 0;">
        Join WhatsApp Community
      </a>
    `);
  }
  if (zoomLink) {
    buttons.push(`
      <a href="${zoomLink}" target="_blank" style="display:inline-block;background:#6B21FB;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;margin:6px 8px 6px 0;">
        Join Zoom Session
      </a>
    `);
  }
  if (otherLink) {
    buttons.push(`
      <a href="${otherLink}" target="_blank" style="display:inline-block;background:#0F172A;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;margin:6px 8px 6px 0;">
        ${otherLinkLabel}
      </a>
    `);
  }
  const actionButtonsHtml = buttons.length > 0 ? `
    <div style="margin:24px 0 16px;">
      ${buttons.join('')}
    </div>
  ` : '';

  // 6. Summary Card (Clean white/light theme with slate borders)
  const includeDetails = templateConfig.include_details_card !== false;
  const summaryHtml = includeDetails ? `
    <div style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:20px;margin:22px 0;">
      <p style="margin:0 0 14px;color:#6B21FB;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;">Registration Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:7px 0;color:#64748B;font-size:13px;width:120px;">Package / Tier</td>
          <td style="padding:7px 0;color:#0F172A;font-size:13px;font-weight:600;">${ticketTier}</td>
        </tr>
        ${eventDate ? `
        <tr>
          <td style="padding:7px 0;color:#64748B;font-size:13px;width:120px;">Date & Time</td>
          <td style="padding:7px 0;color:#334155;font-size:13px;font-weight:500;">${eventDate}</td>
        </tr>` : ''}
        ${eventVenue ? `
        <tr>
          <td style="padding:7px 0;color:#64748B;font-size:13px;width:120px;">Venue / Mode</td>
          <td style="padding:7px 0;color:#334155;font-size:13px;font-weight:500;">${eventVenue}</td>
        </tr>` : ''}
        <tr>
          <td style="padding:7px 0;color:#64748B;font-size:13px;width:120px;">Amount</td>
          <td style="padding:7px 0;color:#059669;font-size:13px;font-weight:800;">${amountStr}</td>
        </tr>
        <tr>
          <td style="padding:7px 0;color:#64748B;font-size:13px;width:120px;">Ref ID</td>
          <td style="padding:7px 0;color:#64748B;font-size:12px;font-family:'Courier New',Consolas,monospace;">${paymentRef}</td>
        </tr>
      </table>
    </div>
  ` : '';

  // 7. Custom Notes Box (No emojis, clean brand styling)
  const notesHtml = customNotes ? `
    <div style="background:#FAF5FF;border-left:4px solid #7C3AED;border-radius:0 10px 10px 0;padding:14px 18px;margin:20px 0;color:#374151;font-size:13px;line-height:1.6;">
      <strong style="color:#6B21FB;display:block;margin-bottom:4px;font-size:12px;text-transform:uppercase;letter-spacing:0.5px;">Instructions & Notes</strong>
      <span style="white-space:pre-wrap;color:#334155;">${customNotes}</span>
    </div>
  ` : '';

  // 8. Full HTML Email (Clean White Background, Setu Brand Violet Accent)
  const formattedBody = messageBody.includes('<p>') || messageBody.includes('<div>') 
    ? messageBody 
    : messageBody.replace(/\n\n/g, '</p><p style="margin:0 0 12px;color:#334155;font-size:14px;line-height:1.7;">').replace(/\n/g, '<br/>');

  const html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#0F172A;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:32px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:16px;overflow:hidden;border:1px solid #E2E8F0;box-shadow:0 4px 20px rgba(15,23,42,0.06);">
              <!-- Top Gradient Accent Bar -->
              <tr>
                <td style="height:5px;background:linear-gradient(90deg,#6B21FB 0%,#8B5CF6 50%,#06B6D4 100%);"></td>
              </tr>
              <!-- Clean Brand Header (No broken images) -->
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
              <!-- Main Content Section -->
              <tr>
                <td style="padding:32px 32px 28px;">
                  <!-- Status Pill -->
                  <div style="display:inline-block;padding:4px 12px;background:#ECFDF5;border:1px solid #A7F3D0;border-radius:20px;color:#059669;font-size:11px;font-weight:700;margin-bottom:16px;text-transform:uppercase;letter-spacing:0.8px;">
                    Registration Confirmed
                  </div>

                  <h1 style="margin:0 0 16px;color:#0F172A;font-size:22px;font-weight:800;letter-spacing:-0.4px;line-height:1.3;">
                    ${heading}
                  </h1>
                  
                  ${greetingHtml}
                  
                  <div style="color:#334155;font-size:14px;line-height:1.7;">
                    ${formattedBody}
                  </div>

                  ${summaryHtml}

                  ${actionButtonsHtml}

                  ${notesHtml}

                  <p style="margin:26px 0 0;color:#64748B;font-size:12px;line-height:1.6;border-top:1px solid #F1F5F9;padding-top:18px;">
                    Have questions? Reply directly to this email or reach our support team at <a href="mailto:support@setustartupschool.com" style="color:#6B21FB;text-decoration:none;font-weight:600;">support@setustartupschool.com</a>.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 32px;background:#F8FAFC;border-top:1px solid #E2E8F0;text-align:center;">
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

  // 9. Plain-Text Fallback
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
    text: plainText
  };
}

module.exports = {
  renderRegistrationEmail,
  formatEventDate,
  substituteVariables
};
