'use client';

import { useState } from 'react';
import { CouponData, WorkshopData } from '@/types/cms';
import Script from 'next/script';
import { 
    X, 
    Check, 
    UserCheck, 
    ChevronRight, 
    Ticket, 
    ShieldCheck, 
    Lock, 
    Sparkles, 
    AlertCircle, 
    Loader2 
} from 'lucide-react';
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
    const isFreeEvent = basePrice === 0;

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

    // ── Free Registration (no Razorpay) ─────────────────────────────────────
    const handleFreeRegister = async (overrideUser?: typeof guestUser) => {
        const activeUser = overrideUser || guestUser;
        if (!activeUser) return;

        setIsProcessing(true);
        setError(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
            const res = await fetch(`${apiUrl}/api/payments/register-free`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${activeUser.guestToken}`
                },
                body: JSON.stringify({
                    eventId: eventSlug,
                    ticketTier: (workshop as any).heading
                        ? `${(workshop as any).heading} - ${workshop.title}`
                        : workshop.title,
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Registration failed');
            // Success — fire onSuccess with a synthetic free-ref
            onSuccess({ razorpay_payment_id: `free_${data.registrationId || 'ok'}` });
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleCheckout = async () => {
        if (!isVerified) {
            setShowOtpModal(true);
            return;
        }
        if (isFreeEvent) {
            handleFreeRegister();
        } else {
            startPayment();
        }
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
                    // The stable builder-card id. The server prices the order
                    // from this; matching on the display title breaks the
                    // moment an admin renames a card.
                    pricingCardId: workshop.id,
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
                name: 'Setu Startup School',
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
                    color: '#7C3AED'
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

                <div className="absolute inset-0 bg-[#0B1120]/75 backdrop-blur-md" onClick={onClose} />

                <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_25px_60px_-15px_rgba(124,58,237,0.3)] border border-slate-100 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent-blue block mb-0.5">Summary</span>
                            <h3 className="font-extrabold text-text-primary text-lg">Checkout Order</h3>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="p-1.5 rounded-full text-slate-400 hover:text-text-primary hover:bg-slate-100 transition-colors" 
                            aria-label="Close checkout modal"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* User Identity Bar — shows if already verified */}
                        {isVerified && guestUser ? (
                            <div className="mb-5 flex items-center gap-3 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl px-4 py-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                    <Check size={16} className="text-emerald-600 font-bold" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-text-primary truncate">{guestUser.name}</p>
                                    <p className="text-xs text-text-secondary truncate">{guestUser.email} · {guestUser.phone}</p>
                                </div>
                                <button
                                    onClick={() => setShowOtpModal(true)}
                                    className="text-xs text-accent-blue font-bold shrink-0 hover:underline"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowOtpModal(true)}
                                className="mb-5 w-full flex items-center gap-3 border-2 border-dashed border-accent-blue/30 rounded-2xl px-4 py-3 hover:border-accent-blue hover:bg-accent-blue/5 transition-all group"
                            >
                                <div className="w-8 h-8 rounded-full bg-accent-blue/10 flex items-center justify-center shrink-0">
                                    <UserCheck size={16} className="text-accent-blue" />
                                </div>
                                <div className="flex-1 text-left">
                                    <p className="text-sm font-bold text-text-primary">Verify Your Details</p>
                                    <p className="text-xs text-text-secondary">Enter name, email & phone to continue</p>
                                </div>
                                <ChevronRight size={16} className="text-slate-400 group-hover:text-accent-blue transition-colors" />
                            </button>
                        )}

                        {/* Item Details */}
                        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <p className="text-[10px] font-black text-accent-blue uppercase tracking-widest mb-1">{workshop.heading || workshop.badge || 'Workshop'}</p>
                            <h4 className="text-base font-extrabold text-text-primary leading-snug">{workshop.title}</h4>
                            {workshop.mentor && <p className="text-xs text-text-secondary mt-1 font-medium">with {workshop.mentor}</p>}
                        </div>

                        {isFreeEvent ? (
                            /* ── FREE EVENT UI ──────────────────────────────────────────────── */
                            <>
                                {/* Free badge */}
                                <div className="mb-6 flex items-center justify-center gap-3 bg-emerald-50 border border-emerald-200/80 rounded-2xl px-4 py-3.5">
                                    <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                                        <Ticket size={18} className="text-emerald-600" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-emerald-950">Free Registration</p>
                                        <p className="text-xs text-emerald-700">No payment required — confirm your spot now</p>
                                    </div>
                                    <span className="text-2xl font-black text-emerald-600">₹0</span>
                                </div>

                                {/* Error */}
                                {error && !isProcessing && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2">
                                        <AlertCircle size={16} className="shrink-0 text-red-500" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Confirm Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full relative group block"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-[0.99]">
                                        {isProcessing ? (
                                            <><Loader2 size={18} className="animate-spin" /> Registering...</>
                                        ) : !isVerified ? (
                                            <><ShieldCheck size={18} /> Verify & Register Free</>
                                        ) : (
                                            <><Check size={18} /> Confirm Registration</>
                                        )}
                                    </div>
                                </button>

                                <p className="text-center text-[11px] text-text-secondary mt-4 flex items-center justify-center gap-1.5">
                                    <Lock size={12} className="text-slate-400" />
                                    <span>Your details are secure and will never be shared.</span>
                                </p>
                            </>
                        ) : (
                            /* ── PAID EVENT UI ────────────────────────────────── */
                            <>
                                {/* Coupon Section */}
                                {couponConfig?.active && (
                                    <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        {couponConfig.code && !isCouponApplied && (
                                            <div className="mb-4 bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-3 flex items-center justify-between">
                                                <div>
                                                    <p className="text-xs font-bold text-accent-royal mb-0.5 flex items-center gap-1">
                                                        <Sparkles size={13} className="text-accent-violet" /> Featured Offer!
                                                    </p>
                                                    <p className="text-xs text-text-secondary">Use code <span className="font-extrabold text-accent-royal">{couponConfig.code}</span> for {couponConfig.discount_percent}% off!</p>
                                                </div>
                                                <button
                                                    onClick={() => handleApplyCoupon(couponConfig.code)}
                                                    disabled={isProcessing}
                                                    className="px-3 py-1.5 bg-accent-blue text-white text-xs font-bold rounded-lg hover:bg-accent-royal transition-colors disabled:opacity-50"
                                                >
                                                    Apply
                                                </button>
                                            </div>
                                        )}
                                        <label className="block text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Have a coupon code?</label>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={couponCode}
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="Enter code"
                                                disabled={isCouponApplied}
                                                className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20 uppercase disabled:bg-slate-100 disabled:text-slate-500"
                                            />
                                            <button
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode || isCouponApplied}
                                                className="px-4 py-2 bg-text-primary text-white text-sm font-bold rounded-xl hover:bg-black disabled:opacity-50 transition-all"
                                            >
                                                {isCouponApplied ? 'Applied ✓' : 'Apply'}
                                            </button>
                                        </div>
                                        {error && !isProcessing && (
                                            <p className="text-xs text-red-500 mt-2 font-medium flex items-center gap-1">
                                                <AlertCircle size={13} /> {error}
                                            </p>
                                        )}
                                        {isCouponApplied && validatedCoupon && (
                                            <p className="text-xs text-emerald-600 mt-2 font-semibold flex items-center gap-1">
                                                <Check size={14} /> Coupon applied! Saved {validatedCoupon.type === 'percentage' ? `${validatedCoupon.discount_value}%` : `₹${validatedCoupon.discount_value}`}!
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* Price Breakdown */}
                                <div className="space-y-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                                    <div className="flex justify-between text-sm text-text-secondary">
                                        <span>Base Price</span>
                                        <span className="font-semibold text-text-primary">₹{basePrice}</span>
                                    </div>
                                    {isCouponApplied && validatedCoupon && (
                                        <div className="flex justify-between items-center text-emerald-600 text-sm font-semibold">
                                            <span>Discount ({validatedCoupon.code})</span>
                                            <span>-₹{discount}</span>
                                        </div>
                                    )}
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="font-extrabold text-text-primary text-base">Total Due</span>
                                        <span className="text-2xl font-black text-accent-blue">₹{finalPrice}</span>
                                    </div>
                                </div>

                                {/* Error Display */}
                                {error && isProcessing === false && !couponConfig?.active && (
                                    <div className="mb-4 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-xs font-medium flex items-center gap-2">
                                        <AlertCircle size={16} className="shrink-0 text-red-500" />
                                        <span>{error}</span>
                                    </div>
                                )}

                                {/* Pay Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={isProcessing}
                                    className="w-full relative group block"
                                >
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-royal via-accent-blue to-accent-violet rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-300" />
                                    <div className="relative w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent-royal to-accent-blue hover:from-accent-blue hover:to-accent-royal text-white font-bold py-4 rounded-xl text-base transition-all shadow-md active:scale-[0.99] disabled:opacity-70">
                                        {isProcessing ? (
                                            <><Loader2 size={18} className="animate-spin" /> Processing Order...</>
                                        ) : !isVerified ? (
                                            <><ShieldCheck size={18} /> Verify & Pay ₹{finalPrice}</>
                                        ) : (
                                            <><ShieldCheck size={18} /> Pay ₹{finalPrice} Securely</>
                                        )}
                                    </div>
                                </button>

                                <p className="text-center text-[11px] text-text-secondary mt-3 flex items-center justify-center gap-1.5">
                                    <ShieldCheck size={13} className="text-emerald-500" />
                                    <span>256-bit SSL encrypted & powered by Razorpay</span>
                                </p>
                            </>
                        )}
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
                    // Auto-proceed: free events skip Razorpay entirely
                    if (isFreeEvent) {
                        handleFreeRegister(user);
                    } else {
                        startPayment(user);
                    }
                }}
            />
        </>
    );
}

