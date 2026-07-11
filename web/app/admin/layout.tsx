"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

const NAV_CATEGORIES = [
    {
        title: "Overview",
        links: [
            { href: "/admin/dashboard", label: "Dashboard", icon: "fas fa-chart-pie" },
        ]
    },
    {
        title: "Core Pages",
        links: [
            { href: "/admin/hero", label: "Hero & Homepage", icon: "fas fa-home" },
            { href: "/admin/events", label: "Events & Workshops", icon: "fas fa-calendar-alt" },
            { href: "/admin/programs", label: "Programs", icon: "fas fa-rocket" },
        ]
    },
    {
        title: "Sales & Data",
        links: [
            { href: "/admin/registrations", label: "Registrations", icon: "fas fa-ticket-alt" },
            { href: "/admin/leads", label: "Leads", icon: "fas fa-envelope-open-text" },
            { href: "/admin/coupons", label: "Coupons", icon: "fas fa-tags" },
            { href: "/admin/mailer", label: "Mass Mailer", icon: "fas fa-paper-plane" },
        ]
    },
    {
        title: "People & Entities",
        links: [
            { href: "/admin/mentors", label: "Mentors", icon: "fas fa-users" },
            { href: "/admin/partners", label: "Partners", icon: "fas fa-handshake" },
            { href: "/admin/mentored-startups", label: "Mentored Startups", icon: "fas fa-lightbulb" },
        ]
    },
    {
        title: "Content & Widgets",
        links: [
            { href: "/admin/gallery", label: "Gallery", icon: "fas fa-images" },
            { href: "/admin/testimonials", label: "Testimonials", icon: "fas fa-quote-left" },
            { href: "/admin/tools", label: "Tools & Resources", icon: "fas fa-toolbox" },
            { href: "/admin/chat-widgets", label: "Chat Widgets", icon: "fas fa-comment-dots" },
        ]
    },
    {
        title: "System",
        links: [
            { href: "/admin/settings", label: "Site Settings", icon: "fas fa-cog" },
        ]
    }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                if (pathname !== "/admin") router.push("/admin");
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/verify`, {
                    headers: { "Authorization": `Bearer ${token}` }
                });
                if (res.ok) {
                    setIsAuthenticated(true);
                } else {
                    localStorage.removeItem("adminToken");
                    setIsAuthenticated(false);
                    if (pathname !== "/admin") router.push("/admin");
                }
            } catch (err) {
                console.error("Token verification failed:", err);
                setIsAuthenticated(false);
                if (pathname !== "/admin") router.push("/admin");
            }
            setIsLoading(false);
        };

        verifyToken();
    }, [pathname, router]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent-blue rounded-full animate-spin"></div>
                <p className="text-gray-500 tracking-widest text-sm uppercase font-bold">Loading Workspace</p>
            </div>
        </div>
    );

    if (!isAuthenticated && typeof window !== "undefined" && window.location.pathname !== "/admin") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row relative overflow-hidden">
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {isAuthenticated && (
                <aside className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col z-10 sticky top-0 h-screen overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] scrollbar-hide">
                    <div className="mb-8 shrink-0">
                        <Link href="/" className="block group mb-3">
                            <div className="flex flex-col gap-3">
                                <Image 
                                    src="/setu-logo-nav.png" 
                                    alt="Setu Logo" 
                                    width={100} 
                                    height={32} 
                                    className="object-contain"
                                    priority
                                />
                                <div className="h-px w-full bg-gray-200"></div>
                                <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-[#0B1120] uppercase">The <span className="text-accent-blue">Startup</span> School</span>
                            </div>
                        </Link>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gray-100 px-2 py-1 rounded text-gray-600 shadow-inner">Admin Panel</span>
                    </div>
                    
                    <nav className="flex flex-col gap-6 flex-grow">
                        {NAV_CATEGORIES.map((category, idx) => (
                            <div key={idx} className="flex flex-col gap-1.5">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 px-4">{category.title}</h3>
                                {category.links.map(link => {
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link 
                                            key={link.href} 
                                            href={link.href} 
                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group ${
                                                isActive 
                                                    ? 'bg-gradient-to-r from-accent-blue/10 to-purple-500/10 text-gray-900 shadow-[inset_2px_0_0_#8b5cf6] border border-gray-200/50' 
                                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                                            }`}
                                        >
                                            <i className={`${link.icon} w-5 text-center text-sm ${isActive ? 'text-accent-blue' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}`}></i>
                                            <span className={`text-sm font-medium ${isActive ? 'font-bold tracking-tight' : ''}`}>{link.label}</span>
                                        </Link>
                                    );
                                })}
                            </div>
                        ))}
                    </nav>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100 shrink-0">
                        <button 
                            onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/admin"; }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center group-hover:-translate-x-1 transition-transform"></i>
                            <span className="text-sm font-bold tracking-wide">Log Out</span>
                        </button>
                    </div>
                </aside>
            )}
            
            <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-transparent z-10 relative min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
