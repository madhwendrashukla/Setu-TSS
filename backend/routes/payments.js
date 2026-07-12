const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret123',
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
    const decoded = jwt.verify(token, process.env.GUEST_TOKEN_SECRET || 'tss_guest_otp_secret_2026');
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

    res.json({ success: true, message: 'Lead captured', id: newLead.id });
  } catch (error) {
    console.error('Error capturing lead:', error);
    res.status(500).json({ error: 'Failed to capture lead' });
  }
});

// Create Order Route — accepts guest token OR regular JWT
router.post('/create-order', flexAuth, async (req, res) => {
  try {
    const { eventId, ticketTier, workshopId, basePrice, couponCode, discountApplied, finalPrice, workshopTitle } = req.body;

    const actualEventId = eventId || workshopId;
    const actualTicketTier = ticketTier || workshopTitle;

    if (finalPrice == null || isNaN(finalPrice)) {
      return res.status(400).json({ error: 'Invalid final price' });
    }

    const options = {
      amount: Math.round(finalPrice * 100), // paise
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
            amount: Math.round(finalPrice)
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
            amount: Math.round(finalPrice),
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
            amount: Math.round(finalPrice),
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
            amount: Math.round(finalPrice),
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
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'secret123')
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      await prisma.eventRegistration.updateMany({
        where: { razorpay_order_id: razorpay_order_id },
        data: {
          razorpay_payment_id: razorpay_payment_id,
          status: 'COMPLETED'
        }
      });
      
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
