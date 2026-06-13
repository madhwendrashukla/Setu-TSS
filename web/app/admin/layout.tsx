"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            if (window.location.pathname !== "/admin") {
                router.push("/admin");
            }
        }
        setIsLoading(false);
    }, [router]);

    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-black text-white">Loading...</div>;

    if (!isAuthenticated && typeof window !== "undefined" && window.location.pathname !== "/admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {isAuthenticated && (
                <aside className="w-full md:w-64 bg-zinc-900 border-r border-white/10 p-6 flex flex-col">
                    <h2 className="text-xl font-bold mb-8 tracking-tight text-accent-blue">Startup School Admin</h2>
                    <nav className="flex flex-col gap-4 flex-grow">
                        <a href="/admin/dashboard" className="hover:text-accent-blue transition-colors">Dashboard Overview</a>
                        <a href="/admin/events" className="hover:text-accent-blue transition-colors">Events & Workshops</a>
                        <a href="/admin/mentors" className="hover:text-accent-blue transition-colors">Mentors</a>
                        <a href="/admin/gallery" className="hover:text-accent-blue transition-colors">Gallery (Media)</a>
                        <a href="/admin/testimonials" className="hover:text-accent-blue transition-colors">Testimonials</a>
                        <a href="/admin/leads" className="hover:text-accent-blue transition-colors">Lead Submissions</a>
                        <a href="/admin/settings" className="hover:text-accent-blue transition-colors">Site Settings</a>
                    </nav>
                    <button 
                        onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/admin"; }}
                        className="mt-auto pt-8 border-t border-white/10 text-red-500 hover:text-red-400 text-left"
                    >
                        Log Out
                    </button>
                </aside>
            )}
            <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-black">
                {children}
            </main>
        </div>
    );
}
