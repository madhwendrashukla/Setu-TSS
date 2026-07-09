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

// Create Order Route — accepts guest token OR regular JWT
router.post('/create-order', flexAuth, async (req, res) => {
  try {
    const { workshopId, basePrice, couponCode, discountApplied, finalPrice, workshopTitle } = req.body;

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
        where: { user_id: req.userId, event_id: workshopId, status: 'COMPLETED' }
      });
      if (existingReg) {
        return res.status(400).json({ error: 'You have already registered for this event.' });
      }

      await prisma.eventRegistration.create({
        data: {
          user_id: req.userId,
          event_id: workshopId,
          razorpay_order_id: order.id,
          status: 'PENDING',
          amount: Math.round(finalPrice),
        }
      });
    } else if (req.guestUser) {
      // Guest OTP-verified user — store with guest_email field (no user_id)
      // We create a minimal pending registration using guest email as identifier
      await prisma.eventRegistration.create({
        data: {
          user_id: null,
          event_id: workshopId,
          razorpay_order_id: order.id,
          status: 'PENDING',
          amount: Math.round(finalPrice),
          guest_name: req.guestUser.name || null,
          guest_email: req.guestUser.email || null,
          guest_phone: req.guestUser.phone || null,
        }
      });
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
