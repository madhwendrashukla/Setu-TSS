const express = require('express');
const { validateCouponForCourse } = require('../utils/coupons');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { requiredEnv } = require('../utils/requiredEnv');

const razorpay = new Razorpay({
  key_id: requiredEnv('RAZORPAY_KEY_ID'),
  key_secret: requiredEnv('RAZORPAY_KEY_SECRET'),
});

/**
 * Dual-auth middleware: accepts either:
 *   - Admin/user JWT (signed with JWT_SECRET, has decoded.id)
 *   - Guest OTP token (signed with GUEST_TOKEN_SECRET, has decoded.guest=true, decoded.email)
 */
function flexAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: no token provided' });

  // Try guest token first
  try {
    const decoded = jwt.verify(token, requiredEnv('GUEST_TOKEN_SECRET'));
    if (decoded.guest) {
      req.guestUser = decoded; // { guest: true, name, email, phone }
      return next();
    }
  } catch (_) {}

  // Try regular JWT
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    return next();
  } catch (_) {}

  return res.status(401).json({ error: 'Unauthorized: invalid token' });
}

// Abandoned Checkout Lead Capture
router.post('/capture-lead', async (req, res) => {
  try {
    const { name, email, phone, eventId, ticketTier, pendingLeadId } = req.body;
    if ((!email && !phone) || !eventId) return res.status(400).json({ error: 'Missing required fields' });

    let existing = null;
    if (pendingLeadId) {
      existing = await prisma.eventRegistration.findUnique({ where: { id: pendingLeadId } });
    }
    
    if (!existing) {
      // Check if an exact pending lead exists for this event and email/phone
      existing = await prisma.eventRegistration.findFirst({
        where: {
          event_id: eventId,
          status: 'PENDING',
          OR: [
            ...(email ? [{ guest_email: email }] : []),
            ...(phone ? [{ guest_phone: phone }] : [])
          ]
        }
      });
    }

    if (existing) {
      // Update phone/name/email if changed
      await prisma.eventRegistration.update({
        where: { id: existing.id },
        data: {
          guest_name: name || existing.guest_name,
          guest_email: email || existing.guest_email,
          guest_phone: phone || existing.guest_phone,
          ticket_tier: ticketTier || existing.ticket_tier
        }
      });

      // CRM Sync
      const leadSource = `checkout_${eventId}`;
      const leadStatus = phone ? 'pending' : 'new';
      if (email) {
        const crmLead = await prisma.lead.findFirst({ where: { email: email, source: leadSource } });
        if (crmLead) {
          await prisma.lead.update({
            where: { id: crmLead.id },
            data: {
              full_name: name || crmLead.full_name,
              phone: phone || crmLead.phone,
              status: crmLead.status === 'converted' ? 'converted' : leadStatus
            }
          });
        } else {
          await prisma.lead.create({
            data: { full_name: name || 'Guest Checkout', email, phone: phone || null, source: leadSource, status: leadStatus }
          });
        }
      }

      return res.json({ success: true, message: 'Lead updated', id: existing.id });
    }

    // Check if they already have a completed order, don't capture as pending lead
    const completed = await prisma.eventRegistration.findFirst({
      where: { 
        event_id: eventId, 
        status: 'COMPLETED',
        OR: [
          ...(email ? [{ guest_email: email }] : []),
          ...(phone ? [{ guest_phone: phone }] : [])
        ]
      }
    });
    if (completed) return res.json({ success: true, message: 'Already completed' });

    // Create new pending lead
    const newLead = await prisma.eventRegistration.create({
      data: {
        event_id: eventId,
        ticket_tier: ticketTier,
        status: 'PENDING',
        guest_name: name || null,
        guest_email: email || null,
        guest_phone: phone || null,
        amount: 0 // Will be updated if they actually create an order
      }
    });

    // CRM Sync
    const leadSource = `checkout_${eventId}`;
    const leadStatus = phone ? 'pending' : 'new';
    if (email) {
      const crmLead = await prisma.lead.findFirst({ where: { email: email, source: leadSource } });
      if (crmLead) {
        await prisma.lead.update({
          where: { id: crmLead.id },
          data: {
            full_name: name || crmLead.full_name,
            phone: phone || crmLead.phone,
            status: crmLead.status === 'converted' ? 'converted' : leadStatus
          }
        });
      } else {
        await prisma.lead.create({
          data: { full_name: name || 'Guest Checkout', email, phone: phone || null, source: leadSource, status: leadStatus }
        });
      }
    }

    res.json({ success: true, message: 'Lead captured', id: newLead.id });
  } catch (error) {
    console.error('Error capturing lead:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

/**
 * Resolve a card's price from the event's builder page, SERVER-SIDE.
 *
 * Returns { price, matchedBy } — matchedBy is 'cardId' | 'legacyId' | 'title' |
 * null. Callers must treat a null price as "cannot price this order" and
 * refuse it; there is deliberately no fallback to a client-supplied amount.
 *
 * Match order matters. `cardId` is the stable identifier from the builder
 * (e.g. "pt_ideation"); `title` is display text an admin can rename at any
 * time, so it is a last resort and is logged when used.
 */
function getPriceFromEvent(event, workshopId, workshopTitle, cardId) {
  if (!event || !event.page_blocks) return { price: null, matchedBy: null };
  
  let pageData;
  try {
    pageData = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
  } catch (err) {
    console.error('Error parsing page_blocks:', err);
    return { price: null, matchedBy: null };
  }

  let serverBasePrice = null;

  let matchedBy = null;
  const findPrice = (items) => {
    if (!items || !Array.isArray(items)) return null;
    // Strongest identifier first: an explicit card id from the checkout.
    for (const item of items) {
      if (cardId && item.id === cardId && item.pricing && item.pricing.actual_price != null) {
        matchedBy = 'cardId';
        return Number(item.pricing.actual_price);
      }
    }
    for (const item of items) {
      const byLegacyId = workshopId && item.id === workshopId;
      const byTitle = workshopTitle && item.title === workshopTitle;
      if ((byLegacyId || byTitle) && item.pricing && item.pricing.actual_price != null) {
        matchedBy = byLegacyId ? 'legacyId' : 'title';
        return Number(item.pricing.actual_price);
      }
    }
    return null;
  };

  if (Array.isArray(pageData)) {
    // Legacy array format
    for (const block of pageData) {
      if (block.type === 'pricing' && block.data && block.data.pricing_options) {
        serverBasePrice = findPrice(block.data.pricing_options);
        if (serverBasePrice != null) return { price: serverBasePrice, matchedBy };
      }
      if (block.type === 'workshops' && block.data && block.data.items) {
        serverBasePrice = findPrice(block.data.items);
        if (serverBasePrice != null) return { price: serverBasePrice, matchedBy };
      }
    }
  } else if (pageData && typeof pageData === 'object') {
    // Unified JSON format
    if (pageData.pricing_options) {
      serverBasePrice = findPrice(pageData.pricing_options);
      if (serverBasePrice != null) return { price: serverBasePrice, matchedBy };
    }
    if (pageData.workshops) {
      serverBasePrice = findPrice(pageData.workshops);
      if (serverBasePrice != null) return { price: serverBasePrice, matchedBy };
    }
  }
  
  return { price: serverBasePrice, matchedBy };
}

// Create Order Route — accepts guest token OR regular JWT
router.post('/create-order', flexAuth, async (req, res) => {
  try {
    // NOTE: basePrice / discountApplied / finalPrice may still arrive from older
    // clients. They are deliberately IGNORED — every rupee figure is computed
    // server-side below. The client supplies identifiers only.
    const { eventId, ticketTier, workshopId, couponCode, workshopTitle, pricingCardId } = req.body;

    const actualEventId = eventId || workshopId;
    const actualTicketTier = ticketTier || workshopTitle;

    // --- SECURE PRICING CHECK ---
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(actualEventId);
    const event = await prisma.event.findFirst({
      where: {
        OR: [
          { slug: actualEventId },
          ...(isUuid ? [{ id: actualEventId }] : [])
        ]
      }
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const { price: serverBasePrice, matchedBy } = getPriceFromEvent(
      event, workshopId, workshopTitle, pricingCardId
    );

    // FAIL CLOSED. Previously an unresolvable price fell through to the
    // client-supplied amount, and because the lookup keys on values the client
    // sends (workshopId / workshopTitle), an attacker could force the miss on
    // purpose and then name their own price. The guard only ever caught honest
    // browsers. There is no fallback now: if we cannot price it, we do not
    // sell it.
    if (serverBasePrice === null) {
      console.warn(
        `[pricing] refused: no server price for event=${actualEventId} card=${pricingCardId || '-'} title=${workshopTitle || '-'}`
      );
      return res.status(400).json({
        error: 'We could not verify the price for this ticket. Please refresh the page and try again.',
      });
    }
    if (matchedBy === 'title' || matchedBy === 'legacyId') {
      // Works, but breaks the moment an admin renames the card. The checkout
      // should be sending pricingCardId.
      console.warn(`[pricing] matched by ${matchedBy} for event=${actualEventId}; client should send pricingCardId`);
    }

    // Coupon is applied SERVER-SIDE too, so the discount cannot be inflated.
    //
    // This used to check only `is_active`, which meant an EXPIRED or fully
    // redeemed coupon still discounted an event order — end_date, max_uses and
    // max_uses_per_user were never consulted. validateCouponForCourse is the
    // same validator the course checkout uses, so both flows now enforce the
    // identical rules. courseSlug is omitted deliberately: that argument only
    // drives the per-course allowlist, and the event's own allowlist is
    // checked below against the event we have already loaded.
    let expectedFinalPrice = serverBasePrice;
    if (couponCode) {
      const buyerEmail = (req.guestUser && req.guestUser.email) || req.body.email || null;
      const result = await validateCouponForCourse({ code: couponCode, email: buyerEmail });
      if (!result.ok) {
        return res.status(400).json({ error: result.error });
      }
      const coupon = result.coupon;

      // Honour the builder's per-event allowlist (page_blocks.applicable_coupons):
      // a non-empty array is a whitelist for this event.
      try {
        const pd = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
        const allowed = pd && pd.applicable_coupons;
        if (Array.isArray(allowed) && allowed.length > 0 && !allowed.includes(coupon.code)) {
          return res.status(400).json({ error: 'This coupon code is not valid for this event' });
        }
      } catch (err) {
        console.error('[pricing] could not read applicable_coupons:', err.message);
      }

      let discount = 0;
      if (coupon.type === 'percentage') {
        discount = Math.floor(serverBasePrice * (coupon.discount_value / 100));
      } else {
        discount = coupon.discount_value;
      }
      expectedFinalPrice = Math.max(0, serverBasePrice - discount);
    }

    // From here on this is the ONLY amount used — for Razorpay and for the
    // stored registration. Nothing the client sent influences it.
    const chargeableRupees = expectedFinalPrice;
    // ----------------------------

    const options = {
      amount: Math.round(chargeableRupees * 100), // paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // For guest users: store registration with guest email; for auth users: use userId
    if (req.userId) {
      // Check duplicate
      const existingReg = await prisma.eventRegistration.findFirst({
        where: { user_id: req.userId, event_id: actualEventId, status: 'COMPLETED' }
      });
      if (existingReg) {
        return res.status(400).json({ error: 'You have already registered for this event.' });
      }

      // Find an existing PENDING lead to update, or create a new one
      const pendingLead = await prisma.eventRegistration.findFirst({
        where: { user_id: req.userId, event_id: actualEventId, status: 'PENDING' }
      });

      if (pendingLead) {
        await prisma.eventRegistration.update({
          where: { id: pendingLead.id },
          data: {
            ticket_tier: actualTicketTier,
            razorpay_order_id: order.id,
            amount: Math.round(chargeableRupees)
          }
        });
      } else {
        await prisma.eventRegistration.create({
          data: {
            user_id: req.userId,
            event_id: actualEventId,
            ticket_tier: actualTicketTier,
            razorpay_order_id: order.id,
            status: 'PENDING',
            amount: Math.round(chargeableRupees),
          }
        });
      }
    } else if (req.guestUser) {
      // Guest OTP-verified user — check for existing PENDING lead first
      const pendingLead = await prisma.eventRegistration.findFirst({
        where: { 
          event_id: actualEventId, 
          status: 'PENDING',
          OR: [
            ...(req.guestUser.email ? [{ guest_email: req.guestUser.email }] : []),
            ...(req.guestUser.phone ? [{ guest_phone: req.guestUser.phone }] : [])
          ]
        }
      });

      if (pendingLead) {
        await prisma.eventRegistration.update({
          where: { id: pendingLead.id },
          data: {
            ticket_tier: actualTicketTier,
            razorpay_order_id: order.id,
            amount: Math.round(chargeableRupees),
            guest_name: req.guestUser.name || pendingLead.guest_name,
            guest_email: req.guestUser.email || pendingLead.guest_email,
            guest_phone: req.guestUser.phone || pendingLead.guest_phone,
          }
        });
      } else {
        await prisma.eventRegistration.create({
          data: {
            user_id: null,
            event_id: actualEventId,
            ticket_tier: actualTicketTier,
            razorpay_order_id: order.id,
            status: 'PENDING',
            amount: Math.round(chargeableRupees),
            guest_name: req.guestUser.name || null,
            guest_email: req.guestUser.email || null,
            guest_phone: req.guestUser.phone || null,
          }
        });
      }
    }

    res.json({
      orderId: order.id,
      amount: options.amount,
      currency: options.currency
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: error.message || 'Error creating order' });
  }
});

// Verify Payment Route
/** Constant-time compare of two hex strings, length-checked first. */
function safeEqualHex(expected, incoming) {
  if (typeof incoming !== 'string') return false;
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(incoming, 'hex');
  if (a.length !== b.length || a.length === 0) return false;
  return crypto.timingSafeEqual(a, b);
}

router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', requiredEnv('RAZORPAY_KEY_SECRET'))
      .update(body.toString())
      .digest('hex');

    // 🔴 CONSTANT-TIME, NOT `===`. A plain string comparison returns as soon
    // as two characters differ, so the time it takes leaks how much of the
    // signature was correct — which is exactly how a signature gets guessed a
    // byte at a time. This is the money path; it gets the same treatment the
    // LMS already gives its webhooks (lib/hmac.ts, which says in as many words
    // "never use !== directly").
    const isAuthentic = safeEqualHex(expectedSignature, razorpay_signature);

    if (isAuthentic) {
      await prisma.eventRegistration.updateMany({
        where: { razorpay_order_id: razorpay_order_id },
        data: {
          razorpay_payment_id: razorpay_payment_id,
          status: 'COMPLETED'
        }
      });

      // Update CRM Lead to 'converted'
      const reg = await prisma.eventRegistration.findFirst({
        where: { razorpay_order_id: razorpay_order_id }
      });
      if (reg && reg.guest_email) {
        await prisma.lead.updateMany({
          where: { email: reg.guest_email, source: `checkout_${reg.event_id}` },
          data: { status: 'converted' }
        });
      }
      
      // Log coupon usage if a valid coupon was used
      if (req.body.couponCode) {
        try {
          const coupon = await prisma.coupon.findUnique({ where: { code: req.body.couponCode.toUpperCase() } });
          if (coupon) {
            await prisma.couponUsage.create({
              data: {
                coupon_id: coupon.id,
                user_email: req.body.email || null
              }
            });
            await prisma.coupon.update({
              where: { id: coupon.id },
              data: { current_uses: { increment: 1 } }
            });
          }
        } catch (err) {
          console.error("Failed to log coupon usage:", err);
        }
      }

      res.json({ success: true, message: 'Payment verified successfully' });
    } else {
      await prisma.eventRegistration.updateMany({
        where: { razorpay_order_id: razorpay_order_id },
        data: { status: 'FAILED' }
      });
      res.status(400).json({ success: false, error: 'Invalid signature' });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Error verifying payment' });
  }
});

module.exports = router;
