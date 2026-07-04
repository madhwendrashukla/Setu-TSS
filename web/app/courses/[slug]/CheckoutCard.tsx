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

const formatPrice = (paise: number) =>
    paise <= 0 ? 'Free' : `₹${(paise / 100).toLocaleString('en-IN')}`;

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

export default function CheckoutCard({ slug, title, price }: { slug: string; title: string; price: number }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);

    // Free courses are enrolled inside the LMS, not purchased here.
    if (price <= 0) {
        return (
            <aside className="h-fit rounded-2xl border border-functional-border bg-white p-8 lg:sticky lg:top-28">
                <p className="text-3xl font-black text-text-primary mb-4">Free</p>
                <a
                    href={`/lms/courses/${slug}`}
                    className="block w-full rounded-full bg-gradient-primary text-white text-center font-semibold py-3"
                >
                    Enroll free on the LMS
                </a>
            </aside>
        );
    }

    if (status === "success") {
        return (
            <aside className="h-fit rounded-2xl border border-functional-border bg-white p-8 lg:sticky lg:top-28 text-center">
                <p className="text-2xl font-black text-functional-success mb-3">Payment successful 🎉</p>
                <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    You&apos;re enrolled in <strong>{title}</strong>. Check <strong>{email}</strong> for
                    your LMS login details (new students receive a temporary password).
                </p>
                <a
                    href="/lms/login"
                    className="block w-full rounded-full bg-gradient-primary text-white text-center font-semibold py-3"
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
            const orderRes = await fetch(`${API}/api/payments/create-order`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    name,
                    email,
                    phone: phone || undefined,
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
                    const verifyRes = await fetch(`${API}/api/payments/verify`, {
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
        <aside className="h-fit rounded-2xl border border-functional-border bg-white p-8 lg:sticky lg:top-28">
            <p className="text-3xl font-black text-text-primary mb-6">{formatPrice(price)}</p>
            <form onSubmit={pay} className="space-y-4">
                <input
                    type="text"
                    required
                    placeholder="Full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-lg border border-functional-border px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <input
                    type="email"
                    required
                    placeholder="Email (your LMS login)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-functional-border px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <input
                    type="tel"
                    placeholder="Phone (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-functional-border px-4 py-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-blue"
                />
                <button
                    type="submit"
                    disabled={status === "paying"}
                    className="w-full rounded-full bg-gradient-primary text-white font-semibold py-3 disabled:opacity-60"
                >
                    {status === "paying" ? "Opening checkout…" : "Buy now"}
                </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <p className="mt-4 text-xs text-text-secondary leading-relaxed">
                Secure payment via Razorpay. After payment you&apos;ll get LMS access with
                credentials sent to your email.
            </p>
        </aside>
    );
}
