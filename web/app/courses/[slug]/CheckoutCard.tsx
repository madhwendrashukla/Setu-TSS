"use client";

import { useState } from "react";

// Razorpay checkout for a paid LMS course. Flow:
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

    // The LMS is login-access-only (no self-enrollment), so free offerings
    // have no self-serve path yet — access is granted by the team
    // (LMS admin manual enrollment) until a ₹0 flow is built.
    if (price <= 0) {
        return (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28">
                <p className="text-3xl font-black text-[#0B1120] mb-4">Free</p>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Access to this free workshop is provided by The Startup School team.
                </p>
                <a
                    href="/lms/login"
                    className="block w-full rounded-full bg-accent-violet text-white text-center font-bold py-3 transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5"
                >
                    Already enrolled? Log in →
                </a>
            </aside>
        );
    }

    if (status === "success") {
        return (
            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-28 text-center">
                <p className="text-2xl font-black text-green-600 mb-3">Payment successful 🎉</p>
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

    const pay = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setStatus("paying");
        try {
            const orderRes = await fetch(`${API}/api/course-payments/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    name,
                    email,
                    phone: phone || undefined,
                    couponCode: coupon?.code || undefined,
                    utmSource: new URLSearchParams(window.location.search).get("utm_source") || undefined,
                    utmMedium: new URLSearchParams(window.location.search).get("utm_medium") || undefined,
                    utmCampaign: new URLSearchParams(window.location.search).get("utm_campaign") || undefined,
                }),
            });
            const order = await orderRes.json();
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
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
                <input
                    type="email"
                    required
                    placeholder="Email (your LMS login)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-violet"
                />
                <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-accent-violet"
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
                Secure payment via Razorpay. After payment you&apos;ll get LMS access with
                credentials sent to your email.
            </p>
        </aside>
    );
}
