/**
 * Dynamic Email Renderer for Event Registrations (Setu Startup School)
 * Universal support for Paid, Free, and LMS hybrid events.
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
  // Format variables
  const eventDate = formatEventDate(event.start_date, event.start_time);
  const eventVenue = event.venue || event.city || (event.mode === 'online' ? 'Online via Zoom' : 'Offline / Venue TBA');
  const amountStr = registration.amount > 0 ? `₹${registration.amount}` : 'Free';
  const paymentRef = registration.razorpay_payment_id || (registration.id ? `reg_${registration.id.slice(-8)}` : 'Confirmed');
  const guestName = registration.guest_name || 'Founder';
  const guestEmail = registration.guest_email || '';
  const guestPhone = registration.guest_phone || '';
  const ticketTier = registration.ticket_tier || 'Standard Pass';

  // Read zoom/whatsapp from templateConfig or event page_blocks fallback
  let customBlocks = {};
  if (event.page_blocks) {
    try {
      customBlocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
    } catch (_) {}
  }

  const zoomLink = templateConfig.zoom_link || customBlocks.zoom_link || customBlocks.meeting_link || '';
  const whatsappLink = templateConfig.whatsapp_link || customBlocks.whatsapp_link || customBlocks.whatsapp_group_link || '';

  const vars = {
    name: guestName,
    full_name: guestName,
    email: guestEmail,
    phone: guestPhone,
    event_title: event.title || 'Masterclass',
    title: event.title || 'Masterclass',
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
  };

  const isCustomEnabled = templateConfig && templateConfig.enabled === true;

  // 1. Subject line
  const rawSubject = isCustomEnabled && templateConfig.subject
    ? templateConfig.subject
    : `Registration Confirmed: {{event_title}} 🎉`;
  const subject = substituteVariables(rawSubject, vars);

  // 2. Heading
  const rawHeading = isCustomEnabled && templateConfig.heading
    ? templateConfig.heading
    : `Registration Confirmed! 🎉`;
  const heading = substituteVariables(rawHeading, vars);

  // 3. Message Body
  let rawBody = '';
  if (isCustomEnabled && templateConfig.message_body) {
    rawBody = templateConfig.message_body;
  } else {
    rawBody = registration.amount > 0
      ? `Your payment has been successfully processed and your seat for <strong>{{event_title}}</strong> is secured!`
      : `You're successfully registered for <strong>{{event_title}}</strong>. We're excited to have you join us!`;
  }
  const messageBody = substituteVariables(rawBody, vars);

  // 4. Custom Notes
  const rawNotes = isCustomEnabled && templateConfig.custom_notes ? templateConfig.custom_notes : '';
  const customNotes = substituteVariables(rawNotes, vars);

  // 5. Summary Card Rows
  const includeDetails = templateConfig.include_details_card !== false;
  const summaryHtml = includeDetails ? `
    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:22px;margin:24px 0;">
      <p style="margin:0 0 14px;color:#7c3aed;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:0.12em;">Enrollment Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">🎟️ Ticket Tier</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${ticketTier}</td></tr>
        ${eventDate ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">📅 Date & Time</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${eventDate}</td></tr>` : ''}
        ${eventVenue ? `<tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">📍 Location</td><td style="padding:6px 0;color:#111827;font-size:13px;font-weight:600;">${eventVenue}</td></tr>` : ''}
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">💳 Amount</td><td style="padding:6px 0;color:#7c3aed;font-size:14px;font-weight:800;">${amountStr}</td></tr>
        <tr><td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">🧾 Reference</td><td style="padding:6px 0;color:#6b7280;font-size:12px;font-family:monospace;">${paymentRef}</td></tr>
      </table>
    </div>
  ` : '';

  // 6. Action Buttons (Zoom / WhatsApp)
  const buttons = [];
  if (whatsappLink) {
    buttons.push(`
      <a href="${whatsappLink}" target="_blank" style="display:inline-block;background:#25D366;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;margin:6px 8px 6px 0;">
        💬 Join WhatsApp Community
      </a>
    `);
  }
  if (zoomLink) {
    buttons.push(`
      <a href="${zoomLink}" target="_blank" style="display:inline-block;background:#7c3aed;color:#ffffff;text-decoration:none;font-size:13px;font-weight:700;padding:12px 22px;border-radius:10px;margin:6px 8px 6px 0;">
        📹 Join Zoom / Meeting
      </a>
    `);
  }
  const actionButtonsHtml = buttons.length > 0 ? `
    <div style="margin:20px 0 16px;">
      ${buttons.join('')}
    </div>
  ` : '';

  // 7. Custom Notes Box
  const notesHtml = customNotes ? `
    <div style="background:#f8fafc;border-left:4px solid #7c3aed;border-radius:0 10px 10px 0;padding:14px 16px;margin:20px 0;color:#334155;font-size:13px;line-height:1.6;">
      <strong>📌 Important Notes:</strong><br/>
      <span style="white-space:pre-wrap;">${customNotes}</span>
    </div>
  ` : `
    <p style="margin:20px 0 16px;color:#475569;font-size:13px;line-height:1.6;">
      📌 <strong>What's Next?</strong> Joining details, venue guides, and session materials will also be shared closer to the event date.
    </p>
  `;

  // HTML Body Assembly
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif;-webkit-font-smoothing:antialiased;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 40px rgba(124,58,237,0.08);border:1px solid #f1f5f9;">
        <!-- Gradient Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#5a1eeb,#7c3aed,#a855f7);padding:36px 32px;text-align:center;">
            <p style="margin:0;color:#ffffff;font-size:11px;font-weight:800;letter-spacing:0.2em;text-transform:uppercase;opacity:0.9;">Setu Startup School</p>
            <h1 style="margin:10px 0 0;color:#ffffff;font-size:25px;font-weight:800;letter-spacing:-0.5px;">${heading}</h1>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding:36px 32px;">
            <p style="margin:0 0 16px;color:#1e293b;font-size:16px;">Hi <strong>${guestName}</strong>,</p>
            <div style="color:#475569;font-size:14px;line-height:1.7;">
              ${messageBody.includes('<p>') || messageBody.includes('<div>') ? messageBody : messageBody.replace(/\n/g, '<br/>')}
            </div>

            ${summaryHtml}

            ${actionButtonsHtml}

            ${notesHtml}

            <p style="margin:24px 0 0;color:#94a3b8;font-size:12px;line-height:1.5;border-top:1px solid #f1f5f9;padding-top:16px;">
              Need help or have questions? Reply directly to this email or reach us at <a href="mailto:support@setustartupschool.com" style="color:#7c3aed;text-decoration:none;font-weight:600;">support@setustartupschool.com</a>.
            </p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:20px 32px;background:#f8fafc;border-top:1px solid #f1f5f9;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:11px;">© 2026 Setu Startup School · Empowering Next-Gen Founders</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  return {
    subject,
    html,
    vars
  };
}

module.exports = {
  renderRegistrationEmail,
  substituteVariables,
  formatEventDate
};
