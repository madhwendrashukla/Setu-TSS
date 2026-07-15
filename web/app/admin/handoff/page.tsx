"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// SSO-lite landing for the LMS → website admin jump (Unified Events).
// Exchanges the one-time token from the URL for an admin session, then
// forwards to `next` (admin pages only — no open redirects).

function HandoffInner() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        const next = searchParams.get("next") || "/admin/events";
        const safeNext = next.startsWith("/admin") ? next : "/admin/events";

        if (!token) {
            setError("Missing sign-in token — go back to the LMS and click the button again.");
            return;
        }

        (async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/handoff-exchange`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json().catch(() => ({}));
                if (!res.ok || !data.token) {
                    setError(data.error || "Sign-in failed — go back to the LMS and click the button again.");
                    return;
                }
                localStorage.setItem("adminToken", data.token);
                router.replace(safeNext);
            } catch {
                setError("Could not reach the server — please retry.");
            }
        })();
    }, [searchParams, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md">
                {error ? (
                    <>
                        <p className="text-red-600 font-bold mb-2">Sign-in link problem</p>
                        <p className="text-sm text-gray-600">{error}</p>
                    </>
                ) : (
                    <>
                        <i className="fas fa-circle-notch fa-spin text-2xl text-purple-600 mb-4"></i>
                        <p className="font-bold text-gray-800">Signing you in…</p>
                        <p className="text-sm text-gray-500 mt-1">Taking you to the event builder.</p>
                    </>
                )}
            </div>
        </div>
    );
}

export default function AdminHandoffPage() {
    return (
        <Suspense fallback={null}>
            <HandoffInner />
        </Suspense>
    );
}
