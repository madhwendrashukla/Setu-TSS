const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const authMiddleware = require('../middleware/auth');

// Get all coupons (Admin)
router.get('/admin', authMiddleware, async (req, res) => {
    try {
        const coupons = await prisma.coupon.findMany({
            orderBy: { created_at: 'desc' },
            include: {
                usages: {
                    orderBy: { used_at: 'desc' }
                },
                _count: {
                    select: { usages: true }
                }
            }
        });
        res.json(coupons);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch coupons" });
    }
});

// Create a coupon (Admin)
router.post('/admin', authMiddleware, async (req, res) => {
    try {
        const data = req.body;
        // Validate
        if (!data.code || !data.type || data.discount_value === undefined) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const existing = await prisma.coupon.findUnique({ where: { code: data.code.toUpperCase() } });
        if (existing) {
            return res.status(400).json({ error: "Coupon code already exists" });
        }

        const coupon = await prisma.coupon.create({
            data: {
                code: data.code.toUpperCase(),
                type: data.type,
                discount_value: parseFloat(data.discount_value),
                is_active: data.is_active ?? true,
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                max_uses: data.max_uses ? parseInt(data.max_uses) : null,
                max_uses_per_user: data.max_uses_per_user ? parseInt(data.max_uses_per_user) : null,
                applicable_emails: data.applicable_emails || [],
                referrer_id: data.referrer_id || null,
            }
        });
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to create coupon" });
    }
});

// Update a coupon (Admin)
router.put('/admin/:id', authMiddleware, async (req, res) => {
    try {
        const data = req.body;
        const coupon = await prisma.coupon.update({
            where: { id: req.params.id },
            data: {
                code: data.code ? data.code.toUpperCase() : undefined,
                type: data.type,
                discount_value: data.discount_value !== undefined ? parseFloat(data.discount_value) : undefined,
                is_active: data.is_active,
                start_date: data.start_date ? new Date(data.start_date) : null,
                end_date: data.end_date ? new Date(data.end_date) : null,
                max_uses: data.max_uses ? parseInt(data.max_uses) : null,
                max_uses_per_user: data.max_uses_per_user ? parseInt(data.max_uses_per_user) : null,
                applicable_emails: data.applicable_emails,
                referrer_id: data.referrer_id || null,
            }
        });
        res.json(coupon);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update coupon" });
    }
});

// Delete a coupon (Admin)
router.delete('/admin/:id', authMiddleware, async (req, res) => {
    try {
        await prisma.coupon.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete coupon" });
    }
});

const { validateCouponForCourse } = require('../utils/coupons');

// Validate a coupon (Public)
router.post('/validate', async (req, res) => {
    try {
        const { code, email, eventSlug } = req.body;
        
        if (!code) {
            return res.status(400).json({ valid: false, error: "No coupon code provided" });
        }

        const normalizedCode = String(code).trim().toUpperCase();
        const buyerEmail = email ? String(email).trim().toLowerCase() : null;

        const result = await validateCouponForCourse({ code: normalizedCode, email: buyerEmail });
        if (!result.ok) {
            return res.status(400).json({ valid: false, error: result.error });
        }

        const coupon = result.coupon;

        // Check if event-specific coupon linkage exists
        if (eventSlug) {
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventSlug);
            const event = await prisma.event.findFirst({
                where: {
                    OR: [
                        { slug: eventSlug },
                        ...(isUuid ? [{ id: eventSlug }] : [])
                    ]
                }
            });
            if (event && event.page_blocks) {
                let pageData;
                try {
                    pageData = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : event.page_blocks;
                } catch (e) {}
                
                if (pageData && pageData.applicable_coupons && pageData.applicable_coupons.length > 0) {
                    if (!pageData.applicable_coupons.includes(coupon.code)) {
                        return res.status(400).json({ valid: false, error: "This coupon code is not valid for this specific event." });
                    }
                }
            }
        }

        res.json({
            valid: true,
            coupon: {
                id: coupon.id,
                code: coupon.code,
                type: coupon.type,
                discount_value: coupon.discount_value
            }
        });

    } catch (error) {
        console.error("Coupon validation error:", error);
        res.status(500).json({ error: "Failed to validate coupon" });
    }
});

module.exports = router;
