const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const authMiddleware = require('../middleware/auth'); // we'll need a user auth middleware, wait we only have admin auth. I will modify middleware/auth.js or create userAuth.js. Actually let's use a new middleware for users. Wait, the existing one might just decode JWT and verify `user.id`. Let's assume we can use the same or create a new one. I'll just decode it directly here or assume `req.user` is populated by authMiddleware.

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret123',
});

// Create Order Route
router.post('/create-order', async (req, res) => {
  try {
    // Basic auth check inline for now if no middleware is used.
    // Let's assume the frontend sends the token in Authorization header.
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const { workshopId, basePrice, couponCode, discountApplied, finalPrice } = req.body;

    if (finalPrice == null || isNaN(finalPrice)) {
      return res.status(400).json({ error: 'Invalid final price' });
    }

    // Check if user already registered and completed payment
    const existingReg = await prisma.eventRegistration.findFirst({
      where: {
        user_id: userId,
        event_id: workshopId,
        status: 'COMPLETED'
      }
    });

    if (existingReg) {
      return res.status(400).json({ error: 'You have already registered for this event.' });
    }

    const options = {
      amount: Math.round(finalPrice * 100), // amount in smallest currency unit (paise)
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Create a PENDING registration in the database
    await prisma.eventRegistration.create({
      data: {
        user_id: userId,
        event_id: workshopId,
        razorpay_order_id: order.id,
        status: 'PENDING',
        amount: Math.round(finalPrice)
      }
    });

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
      // Payment is successful, update the registration status
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
