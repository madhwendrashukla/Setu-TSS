"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

const NAV_LINKS = [
    { href: "/admin/dashboard", label: "Dashboard", icon: "fas fa-chart-pie" },
    { href: "/admin/hero", label: "Hero & Homepage", icon: "fas fa-home" },
    { href: "/admin/events", label: "Events & Workshops", icon: "fas fa-calendar-alt" },
    { href: "/admin/programs", label: "Programs", icon: "fas fa-rocket" },
    { href: "/admin/mentors", label: "Mentors", icon: "fas fa-users" },
    { href: "/admin/partners", label: "Partners", icon: "fas fa-handshake" },
    { href: "/admin/mentored-startups", label: "Mentored Startups", icon: "fas fa-lightbulb" },
    { href: "/admin/gallery", label: "Gallery", icon: "fas fa-images" },
    { href: "/admin/testimonials", label: "Testimonials", icon: "fas fa-quote-left" },
    { href: "/admin/chat-widgets", label: "Chat Widgets", icon: "fas fa-comment-dots" },
    { href: "/admin/leads", label: "Leads", icon: "fas fa-envelope-open-text" },
    { href: "/admin/tools", label: "Tools & Resources", icon: "fas fa-toolbox" },
    { href: "/admin/settings", label: "Site Settings", icon: "fas fa-cog" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (token) {
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            if (pathname !== "/admin") {
                router.push("/admin");
            }
        }
        setIsLoading(false);
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
                <aside className="w-full md:w-72 bg-white/80 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col z-10 sticky top-0 h-screen overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
                    <div className="mb-10">
                        <Link href="/" className="block group">
                            <h2 className="text-xl md:text-2xl font-black tracking-tight mb-1 group-hover:scale-[1.02] transition-transform">
                                THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]">STARTUP</span>
                            </h2>
                            <h2 className="text-xl md:text-2xl font-black tracking-tight text-gray-900 mb-2 group-hover:scale-[1.02] transition-transform">SCHOOL</h2>
                        </Link>
                        <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gray-100 px-2 py-1 rounded text-gray-600 shadow-inner">Admin Panel</span>
                    </div>
                    
                    <nav className="flex flex-col gap-2 flex-grow">
                        {NAV_LINKS.map(link => {
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                                        isActive 
                                            ? 'bg-gradient-to-r from-accent-blue/10 to-purple-500/10 text-gray-900 shadow-[inset_2px_0_0_#8b5cf6] border border-gray-200/50' 
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'
                                    }`}
                                >
                                    <i className={`${link.icon} w-5 text-center ${isActive ? 'text-accent-blue' : 'text-gray-400 group-hover:text-gray-600 transition-colors'}`}></i>
                                    <span className={`font-medium ${isActive ? 'font-bold tracking-tight' : ''}`}>{link.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    
                    <div className="mt-8 pt-6 border-t border-gray-100">
                        <button 
                            onClick={() => { localStorage.removeItem("adminToken"); window.location.href = "/admin"; }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center group-hover:-translate-x-1 transition-transform"></i>
                            <span className="font-bold tracking-wide">Log Out</span>
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
