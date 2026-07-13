'use client';

import { useState } from 'react';
import { CouponData, WorkshopData } from '@/types/cms';
import Script from 'next/script';
import { useGuestUser } from '@/hooks/useGuestUser';
import { OtpVerifyModal } from './OtpVerifyModal';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    workshop: WorkshopData | null;
    eventSlug?: string;
    couponConfig?: CouponData;
    onSuccess: (response: any) => void;
}

export function DynamicCheckoutModal({ isOpen, onClose, workshop, eventSlug, couponConfig, onSuccess }: CheckoutModalProps) {
    const [couponCode, setCouponCode] = useState('');
    const [isCouponApplied, setIsCouponApplied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showOtpModal, setShowOtpModal] = useState(false);

    const [validatedCoupon, setValidatedCoupon] = useState<any>(null);

    const { guestUser, setGuestUser, isVerified } = useGuestUser();

    if (!isOpen || !workshop) return null;

    const basePrice = workshop.pricing?.actual_price || 0;

    let discount = 0;
    if (isCouponApplied && validatedCoupon) {
        if (validatedCoupon.type === 'percentage') {
            discount = Math.floor(basePrice * (validatedCoupon.discount_value / 100));
        } else {
            discount = validatedCoupon.discount_value;
        }
    }
    const finalPrice = Math.max(0, basePrice - discount);

    const handleApplyCoupon = async (codeToApply?: string | React.MouseEvent) => {
        const code = typeof codeToApply === 'string' ? codeToApply : couponCode;
        setError(null);
        if (!code) {
            setError('Please enter a coupon code.');
            return;
        }
        
        setIsProcessing(true);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/coupons/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    code: code, 
                    email: guestUser?.email || '',
                    eventSlug: eventSlug
                })
            });
            const data = await res.json();
            
            if (res.ok && data.valid) {
                setValidatedCoupon(data.coupon);
                setIsCouponApplied(true);
                setCouponCode(code); // ensure input shows it
            } else {
                setError(data.error || 'Invalid coupon code.');
                setIsCouponApplied(false);
                setValidatedCoupon(null);
            }
        } catch (err) {
            setError('Failed to validate coupon.');
            setIsCouponApplied(false);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (!isVerified) {
            setShowOtpModal(true);
            return;
        }
        startPayment();
    };

    const startPayment = async (overrideUser?: typeof guestUser) => {
        const activeUser = overrideUser || guestUser;
        if (!activeUser) return;

        setIsProcessing(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

            const res = await fetch(`${apiUrl}/api/payments/create-order`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeUser.guestToken}`
                },
                body: JSON.stringify({
                    eventId: eventSlug,
                    ticketTier: (workshop as any).heading ? `${(workshop as any).heading} - ${workshop.title}` : workshop.title,
                    workshopId: eventSlug || workshop.id,
                    workshopTitle: workshop.title,
                    basePrice: basePrice,
                    couponCode: isCouponApplied ? validatedCoupon?.code : null,
                    discountApplied: discount,
                    finalPrice: finalPrice
                })
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || data.message || 'Failed to create order');
            }

            const { orderId, amount, currency } = data;

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
                amount: amount,
                currency: currency,
                name: 'The Startup School',
                description: `Enrollment for ${workshop.title}`,
                order_id: orderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await fetch(`${apiUrl}/api/payments/verify-payment`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${activeUser.guestToken}`
                            },
                            body: JSON.stringify({
                                ...response,
                                couponCode: isCouponApplied ? validatedCoupon?.code : null,
                                email: activeUser.email
                            })
                        });
                        const verifyData = await verifyRes.json();
                        if (verifyData.success) {
                            onSuccess(response);
                        } else {
                            setError('Payment verification failed. Please contact support.');
                        }
                    } catch (e) {
                        setError('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: activeUser.name || '',
                    email: activeUser.email || '',
                    contact: activeUser.phone || ''
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
        <>
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
                        {/* User Identity Bar — shows if already verified */}
                        {isVerified && guestUser ? (
                            <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-check text-green-500 text-xs" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-900 truncate">{guestUser.name}</p>
                                    <p className="text-xs text-slate-500 truncate">{guestUser.email} · {guestUser.phone}</p>
                                </div>
                                <button
                                    onClick={() => setShowOtpModal(true)}
                                    className="text-xs text-[#8b5cf6] font-semibold shrink-0 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowOtpModal(true)}
                                className="mb-5 w-full flex items-center gap-3 border-2 border-dashed border-[#8b5cf6]/40 rounded-xl px-4 py-3 hover:border-[#8b5cf6] hover:bg-[#8b5cf6]/5 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center shrink-0">
                                    <i className="fa-solid fa-user-check text-[#8b5cf6] text-xs" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-slate-900">Verify Your Details</p>
                                    <p className="text-xs text-slate-400">Enter name, email & phone to continue</p>
                                </div>
                                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-[#8b5cf6] text-xs transition-colors" />
                            </button>
                        )}

                        {/* Item Details */}
                        <div className="mb-6">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{workshop.heading || workshop.badge || 'Workshop'}</p>
                            <h4 className="text-lg font-extrabold text-slate-900">{workshop.title}</h4>
                            {workshop.mentor && <p className="text-sm text-slate-600 mt-1">by {workshop.mentor}</p>}
                        </div>

                        {/* Coupon Section */}
                        {couponConfig?.active && (
                            <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                {couponConfig.code && !isCouponApplied && (
                                    <div className="mb-4 bg-purple-50 border border-purple-200 rounded-xl p-3 flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-bold text-purple-900 mb-0.5">🎉 Featured Offer!</p>
                                            <p className="text-sm font-medium text-purple-700">Use code <span className="font-extrabold">{couponConfig.code}</span> to get {couponConfig.discount_percent}% off!</p>
                                        </div>
                                        <button 
                                            onClick={() => handleApplyCoupon(couponConfig.code)}
                                            disabled={isProcessing}
                                            className="px-3 py-1.5 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                )}
                                
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
                                        {isCouponApplied ? 'Applied ✓' : 'Apply'}
                                    </button>
                                </div>
                                {error && !isProcessing && <p className="text-xs text-red-500 mt-2 font-medium">{error}</p>}
                                {isCouponApplied && validatedCoupon && (
                                    <p className="text-xs text-green-500 mt-2 font-medium">
                                        Coupon applied! You saved {validatedCoupon.type === 'percentage' ? `${validatedCoupon.discount_value}%` : `₹${validatedCoupon.discount_value}`}!
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Price Breakdown */}
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between text-sm text-slate-600">
                                <span>Base Price</span>
                                <span className="font-medium">₹{basePrice}</span>
                            </div>
                            {isCouponApplied && validatedCoupon && (
                                <div className="flex justify-between items-center text-green-600">
                                    <span>Discount ({validatedCoupon.code})</span>
                                    <span>-₹{discount}</span>
                                </div>
                            )}
                            <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                <span className="font-bold text-slate-900">Total Due</span>
                                <span className="text-2xl font-extrabold text-[#8b5cf6]">₹{finalPrice}</span>
                            </div>
                        </div>

                        {/* Error Display */}
                        {error && isProcessing === false && !couponConfig?.active && (
                            <p className="text-xs text-red-500 mb-4 font-medium text-center">{error}</p>
                        )}

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
                                ) : !isVerified ? (
                                    <><i className="fa-solid fa-shield-check text-sm" /> Verify & Pay ₹{finalPrice}</>
                                ) : (
                                    <>Pay ₹{finalPrice} Securely <i className="fa-solid fa-lock text-xs opacity-70" /></>
                                )}
                            </div>
                        </button>

                        <p className="text-center text-[10px] text-slate-500 mt-4 flex items-center justify-center gap-1.5">
                            <i className="fa-brands fa-cc-stripe" /> Secure checkout powered by Razorpay
                        </p>
                    </div>
                </div>
            </div>

            {/* OTP Modal layered on top */}
            <OtpVerifyModal
                isOpen={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                prefillEmail={guestUser?.email}
                eventId={eventSlug}
                ticketTier={(workshop as any).heading ? `${(workshop as any).heading} - ${workshop.title}` : workshop.title}
                onVerified={(user) => {
                    setGuestUser(user);
                    setShowOtpModal(false);
                    // Auto-proceed to payment after verification
                    startPayment(user);
                }}
            />
        </>
    );
}
