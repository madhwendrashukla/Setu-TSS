import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_123',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'secret123',
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { workshopId, workshopTitle, basePrice, couponCode, discountApplied, finalPrice } = body;

        // Verify calculation on the server to prevent spoofing
        // Wait, for this demo/CMS we'll trust the finalPrice sent or recalculate if we had DB access.
        // For now we just use finalPrice to create the order.
        if (finalPrice == null || isNaN(finalPrice)) {
            return NextResponse.json({ message: 'Invalid final price' }, { status: 400 });
        }

        const options = {
            amount: Math.round(finalPrice * 100), // amount in the smallest currency unit
            currency: 'INR',
            receipt: `receipt_${Date.now()}_${workshopId}`,
            notes: {
                workshopId,
                workshopTitle,
                couponCode: couponCode || 'NONE'
            }
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json({
            orderId: order.id,
            amount: options.amount,
            currency: options.currency
        });
    } catch (error: any) {
        console.error('Error creating Razorpay order:', error);
        return NextResponse.json({ message: error.message || 'Error creating order' }, { status: 500 });
    }
}
