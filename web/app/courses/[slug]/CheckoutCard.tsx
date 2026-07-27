"use client";

import { useState } from "react";

// Razorpay checkout for a paid LMS course. Flow:
//   (email verification via OTP — reuses /api/otp/send + /api/otp/verify)
//   create-order (server fetches the real price from the LMS DB)
//   → checkout.razorpay.com modal
//   → verify (server-side signature check)
//   → the backend fires the signed enrollment webhook to the LMS,
//     which creates the account and emails login credentials.

declare global {
    interface Window {
        Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
    }
}

const API = process.env.NEXT_PUBLIC_API_URL;

// price prop is in RUPEES (LMS convention); the create-order response's
// `amount` is in PAISE (Razorpay convention).
const formatPrice = (rupees: number) =>
    rupees <= 0 ? 'Free' : `₹${rupees.toLocaleString('en-IN')}`;

function loadRazorpayScript(): Promise<boolean> {
    return new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
}

type Status = "idle" | "paying" | "success" | "error";

type AppliedCoupon = {
    code: string;
    amount: number; // paise payable after discount
    discount: number; // paise
    originalAmount: number; // paise
};

const inputCls =
    "w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-violet";

export default function CheckoutCard({ slug, title, price }: { slug: string; title: string; price: number }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    const [couponInput, setCouponInput] = useState("");
    const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);
    const [couponError, setCouponError] = useState<string | null>(null);
    const [couponChecking, setCouponChecking] = useState(false);

    // Email verification (OTP) — reuses the existing /api/otp/send + /api/otp/verify.
    const [guestToken, setGuestToken] = useState<string | null>(null);
    const [otpMode, setOtpMode] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpBusy, setOtpBusy] = useState(false);
    const [otpError, setOtpError] = useState<string | null>(null);
    const [resendIn, setResendIn] = useState(0);
    const [pending, setPending] = useState<null | "pay" | "free">(null);

    const utm = () => {
        const q = new URLSearchParams(window.location.search);
        return {
            utmSource: q.get("utm_source") || undefined,
            utmMedium: q.get("utm_medium") || undefined,
            utmCampaign: q.get("utm_campaign") || undefined,
        };
    };

    const authHeaders = (token?: string | null): Record<string, string> => {
        const t = token ?? guestToken;
        return t ? { Authorization: `Bearer ${t}` } : {};
    };

    // Immature-lead capture — grab the email the moment it's entered (on blur),
    // even if the visitor never finishes. Best-effort; failures are ignored.
    const captureLead = () => {
        const e = email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return;
        fetch(`${API}/api/course-payments/capture-lead`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: e, name: name || undefined, phone: phone || undefined, slug }),
        }).catch(() => { });
    };

    const sendOtp = async () => {
        setOtpError(null);
        setOtpBusy(true);
        try {
            const res = await fetch(`${API}/api/otp/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, name, phone: phone || undefined }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Could not send the code — please retry");
            setOtpMode(true);
            setStatus("idle");
            setResendIn(60);
            const t = setInterval(
                () => setResendIn((r) => { if (r <= 1) { clearInterval(t); return 0; } return r - 1; }),
                1000,
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not send the code");
            setStatus("error");
        } finally {
            setOtpBusy(false);
        }
    };

    const verifyOtp = async () => {
        setOtpError(null);
        setOtpBusy(true);
        try {
            const res = await fetch(`${API}/api/otp/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok || !data.guestToken) throw new Error(data.error || "Incorrect code — please try again");
            setGuestToken(data.guestToken);
            setOtpMode(false);
            setOtp("");
            const action = pending;
            setPending(null);
            if (action === "pay") pay(undefined, data.guestToken);
            else if (action === "free") enrollFree(undefined, data.guestToken);
        } catch (err) {
            setOtpError(err instanceof Error ? err.message : "Verification failed");
        } finally {
            setOtpBusy(false);
        }
    };

    const applyCoupon = async () => {
        const code = couponInput.trim();
        if (!code) return;
        setCouponChecking(true);
        setCouponError(null);
        try {
            const res = await fetch(`${API}/api/course-payments/validate-coupon`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, code, email: email || undefined }),
            });
            const data = await res.json();
            if (!res.ok || !data.valid) {
                setCoupon(null);
                setCouponError(data.error || "Invalid coupon code");
            } else {
                setCoupon({
                    code: data.code,
                    amount: data.amount,
                    discount: data.discount,
                    originalAmount: data.originalAmount,
                });
            }
        } catch {
            setCoupon(null);
            setCouponError("Could not check the coupon — please retry");
        } finally {
            setCouponChecking(false);
        }
    };

    const enrollFree = async (e?: React.FormEvent, token?: string) => {
        e?.preventDefault();
        setError(null);
        setStatus("paying");
        try {
            const res = await fetch(`${API}/api/course-payments/enroll-free`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({ slug, name, email, phone: phone || undefined, ...utm() }),
            });
            const body = await res.json().catch(() => ({}));
            if (res.status === 403 && body.code === "EMAIL_NOT_VERIFIED") {
                setPending("free");
                await sendOtp();
                return;
            }
            if (!res.ok) throw new Error(body.error || "Could not enroll — please retry");
            setStatus("success");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setStatus("error");
        }
    };

    const pay = async (e?: React.FormEvent, token?: string) => {
        e?.preventDefault();
        setError(null);
        setStatus("paying");
        try {
            const orderRes = await fetch(`${API}/api/course-payments/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeaders(token) },
                body: JSON.stringify({
                    slug,
                    name,
                    email,
                    phone: phone || undefined,
                    couponCode: coupon?.code || undefined,
                    ...utm(),
                }),
            });
            const order = await orderRes.json();
            if (orderRes.status === 403 && order.code === "EMAIL_NOT_VERIFIED") {
                setPending("pay");
                await sendOtp();
                return;
            }
            if (!orderRes.ok) throw new Error(order.error || "Could not start checkout");

            if (!(await loadRazorpayScript()) || !window.Razorpay) {
                throw new Error("Could not load the payment window — please retry");
            }

            const rzp = new window.Razorpay({
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "The Startup School",
                description: title,
                order_id: order.razorpayOrderId,
                prefill: { name, email, contact: phone },
                theme: { color: "#6B21FB" },
                modal: { ondismiss: () => setStatus("idle") },
                handler: async (response: {
                    razorpay_order_id: string;
                    razorpay_payment_id: string;
                    razorpay_signature: string;
                }) => {
                    const verifyRes = await fetch(`${API}/api/course-payments/verify`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(response),
                    });
                    if (verifyRes.ok) {
                        setStatus("success");
                    } else {
                        const body = await verifyRes.json().catch(() => ({}));
                        setError(body.error || "Payment verification failed — contact support with your payment ID");
                        setStatus("error");
                    }
                },
            });
            rzp.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setStatus("error");
        }
    };

    // ── Email verification step (shared by the free + paid flows) ──────────────
    if (otpMode) {
        return (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28">
                <p className="text-xl font-black text-[#0B1120] mb-1">Verify your email</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-1">
                    We sent a 6-digit code to <strong>{email}</strong>.
                </p>
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-5">
                    Can&apos;t find it? Check your <strong>spam folder</strong> — it sometimes lands there.
                </p>
                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    autoFocus
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 6)); setOtpError(null); }}
                    className={`${inputCls} tracking-[0.4em] text-center text-lg font-bold`}
                />
                {otpError && <p className="mt-3 text-sm text-red-600">{otpError}</p>}
                <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={otpBusy || otp.length !== 6}
                    className="mt-4 w-full rounded-full bg-accent-violet text-white font-bold py-3 transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {otpBusy ? "Verifying…" : "Verify & continue"}
                </button>
                <div className="mt-4 flex items-center justify-between text-xs">
                    <button
                        type="button"
                        onClick={() => { setOtpMode(false); setOtp(""); setOtpError(null); setStatus("idle"); }}
                        className="font-semibold text-slate-500 hover:underline"
                    >
                        ← Change email
                    </button>
                    <button
                        type="button"
                        onClick={sendOtp}
                        disabled={otpBusy || resendIn > 0}
                        className="font-semibold text-accent-blue hover:underline disabled:text-slate-400 disabled:no-underline"
                    >
                        {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend code"}
                    </button>
                </div>
            </aside>
        );
    }

    if (price <= 0 && status !== "success") {
        return (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28">
                <p className="text-3xl font-black text-[#0B1120] mb-4">Free</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Enroll with your email — your login details arrive in your inbox.
                </p>
                <form onSubmit={enrollFree} className="space-y-4">
                    <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputCls}
                    />
                    <input
                        type="email"
                        required
                        placeholder="Email (your LMS login)"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={captureLead}
                        className={inputCls}
                    />
                    <button
                        type="submit"
                        disabled={status === "paying"}
                        className="w-full rounded-full bg-accent-violet text-white font-bold py-3 transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                    >
                        {status === "paying" ? "Enrolling…" : "Enroll free"}
                    </button>
                </form>
                {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                <p className="mt-4 text-xs text-slate-500">
                    Already enrolled?{' '}
                    <a href="/lms/login" className="text-accent-blue font-semibold hover:underline">
                        Log in →
                    </a>
                </p>
            </aside>
        );
    }

    if (status === "success") {
        return (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 text-center">
                <p className="text-2xl font-black text-green-600 mb-3">
                    {price <= 0 ? "You're enrolled 🎉" : "Payment successful 🎉"}
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                    You&apos;re enrolled in <strong>{title}</strong>. Check <strong>{email}</strong> for
                    your login details (new students receive a temporary password).
                </p>
                {/* Until the domain + transactional-email cutover, welcome emails
                    can land in spam — never leave a paying student stranded. */}
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
                    Can&apos;t find the email? Check your <strong>spam folder</strong> — it sometimes lands there.
                </p>
                <a
                    href="/lms/login"
                    className="block w-full rounded-full bg-accent-violet text-white text-center font-bold py-3 transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5"
                >
                    Log in to the LMS →
                </a>
            </aside>
        );
    }

    return (
        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28">
            {coupon ? (
                <div className="mb-6">
                    <p className="text-3xl font-black text-[#0B1120]">
                        {`₹${(coupon.amount / 100).toLocaleString('en-IN')}`}
                        <span className="ml-3 text-lg font-semibold text-slate-400 line-through">
                            {formatPrice(price)}
                        </span>
                    </p>
                    <p className="mt-1 text-xs font-semibold text-green-700">
                        Coupon {coupon.code} applied — you save ₹{(coupon.discount / 100).toLocaleString('en-IN')}
                    </p>
                </div>
            ) : (
                <p className="text-3xl font-black text-[#0B1120] mb-6">{formatPrice(price)}</p>
            )}
            <form onSubmit={pay} className="space-y-4">
                <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls}
                />
                <input
                    type="email"
                    required
                    placeholder="Email (your LMS login)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={captureLead}
                    className={inputCls}
                />
                <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputCls}
                />
                {coupon ? (
                    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
                        <span className="text-sm font-semibold text-green-700">{coupon.code}</span>
                        <button
                            type="button"
                            onClick={() => { setCoupon(null); setCouponInput(""); setCouponError(null); }}
                            className="text-xs font-semibold text-green-700 underline hover:text-green-900"
                        >
                            Remove
                        </button>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="Coupon code (optional)"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(null); }}
                            className="flex-1 rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 uppercase placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                        />
                        <button
                            type="button"
                            onClick={applyCoupon}
                            disabled={couponChecking || !couponInput.trim()}
                            className="rounded-lg border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                        >
                            {couponChecking ? "Checking…" : "Apply"}
                        </button>
                    </div>
                )}
                {couponError && <p className="text-xs text-red-600">{couponError}</p>}
                <button
                    type="submit"
                    disabled={status === "paying"}
                    className="w-full rounded-full bg-accent-violet text-white font-bold py-3 transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                >
                    {status === "paying" ? "Opening checkout…" : "Buy now"}
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <p className="mt-4 text-xs text-slate-500 leading-relaxed">
                Secure payment via Razorpay. We verify your email first, then after payment
                you&apos;ll get LMS access with credentials sent to your email.
            </p>
        </aside>
    );
}
