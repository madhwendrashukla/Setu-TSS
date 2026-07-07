'use client';

import { useState } from 'react';
import { CouponData, WorkshopData } from '@/types/cms';
import Script from 'next/script';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    workshop: WorkshopData | null;
    couponConfig?: CouponData;
    onSuccess: (response: any) => void;
}

export function DynamicCheckoutModal({ isOpen, onClose, workshop, couponConfig, onSuccess }: CheckoutModalProps) {
    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen || !workshop) return null;

    const basePrice = workshop.pricing?.actual_price || 0;
    
    // Calculate discount
    let discount = 0;
    if (isCouponApplied && couponConfig && couponConfig.discount_percent) {
        discount = Math.floor(basePrice * (couponConfig.discount_percent / 100));
    }
    const finalPrice = basePrice - discount;

    const handleApplyCoupon = () => {
        setError(null);
        if (!couponConfig || !couponConfig.active) {
            setError('No active coupons available at this time.');
            return;
        }
        if (couponCode.toUpperCase() === couponConfig.code.toUpperCase()) {
            setIsCouponApplied(true);
        } else {
            setError('Invalid coupon code.');
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        setError(null);

        try {
            // Create order on backend
            const res = await fetch('/api/razorpay/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    workshopId: workshop.id,
                    workshopTitle: workshop.title,
                    basePrice: basePrice,
                    couponCode: isCouponApplied ? couponConfig?.code : null,
                    discountApplied: discount,
                    finalPrice: finalPrice
                })
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create order');
            }

            const { orderId, amount, currency } = await res.json();

            // Open Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '', 
                amount: amount,
                currency: currency,
                name: 'The Startup School',
                description: `Enrollment for ${workshop.title}`,
                order_id: orderId,
                handler: function (response: any) {
                    onSuccess(response);
                },
                prefill: {
                    name: '',
                    email: '',
                    contact: ''
                },
                theme: {
                    color: '#8b5cf6'
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                setError(response.error.description);
            });
            rzp.open();
        } catch (err: any) {
            setError(err.message || 'Something went wrong during checkout.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
            
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            
            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="font-bold text-slate-900 text-lg">Checkout Summary</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <i className="fa-solid fa-xmark text-xl" />
                    </button>
                </div>

                <div className="p-6">
                    {/* Item Details */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{workshop.heading || workshop.badge || 'Workshop'}</p>
                        <h4 className="text-lg font-extrabold text-slate-900">{workshop.title}</h4>
                        <p className="text-sm text-slate-600 mt-1">by {workshop.mentor}</p>
                    </div>

                    {/* Coupon Section */}
                    {couponConfig?.active && (
                        <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                            <label className="block text-xs font-bold text-slate-700 mb-2">Have a coupon code?</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    placeholder="Enter code"
                                    disabled={isCouponApplied}
                                    className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#8b5cf6] uppercase disabled:bg-slate-100 disabled:text-slate-500"
                                />
                                <button 
                                    onClick={handleApplyCoupon}
                                    disabled={!couponCode || isCouponApplied}
                                    className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-lg disabled:opacity-50 transition-opacity"
                                >
                                    {isCouponApplied ? 'Applied' : 'Apply'}
                                </button>
                            </div>
                            {error && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
                            {isCouponApplied && <p className="text-xs text-green-500 mt-2 font-medium">Coupon applied successfully! {couponConfig.discount_percent}% off.</p>}
                        </div>
                    )}

                    {/* Price Breakdown */}
                    <div className="space-y-3 mb-8">
                        <div className="flex justify-between text-sm text-slate-600">
                            <span>Base Price</span>
                            <span className="font-medium">₹{basePrice}</span>
                        </div>
                        {isCouponApplied && (
                            <div className="flex justify-between text-sm text-green-500">
                                <span>Discount ({couponConfig?.code})</span>
                                <span className="font-medium">-₹{discount}</span>
                            </div>
                        )}
                        <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-900">Total Due</span>
                            <span className="text-2xl font-extrabold text-[#8b5cf6]">₹{finalPrice}</span>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button 
                        onClick={handleCheckout}
                        disabled={isProcessing}
                        className="w-full relative group block"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                        <div className="relative w-full flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 rounded-xl">
                            {isProcessing ? (
                                <span className="animate-pulse">Processing...</span>
                            ) : (
                                <>Pay ₹{finalPrice} Securely <i className="fa-solid fa-lock text-xs opacity-70" /></>
                            )}
                        </div>
                    </button>
                    
                    <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                        <i className="fa-brands fa-cc-stripe" /> Secure checkout provided by Razorpay
                    </p>
                </div>
            </div>
        </div>
    );
}
