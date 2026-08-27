"use client";
import { useState, useEffect, useRef } from "react";
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
            { href: "/admin/course-page", label: "Course Page", icon: "fas fa-graduation-cap" },
        ]
    },
    {
        title: "Sales & Data",
        links: [
            { href: "/admin/registrations", label: "Registrations", icon: "fas fa-ticket-alt" },
            { href: "/admin/leads", label: "Leads", icon: "fas fa-envelope-open-text" },
            { href: "/admin/helpdesk", label: "Helpdesk Tickets", icon: "fas fa-headset" },
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
            { href: "/admin/bottom-videos", label: "Bottom Videos", icon: "fas fa-video" },
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

const PANEL_INFO: Record<string, string> = {
    "/admin/dashboard": "View overall platform metrics, total revenue, and high-level statistics at a glance.",
    "/admin/hero": "Update the main homepage hero banner, central title, and primary call-to-action button.",
    "/admin/events": "Create and manage upcoming events, workshops, their dates, and ticketing details.",
    "/admin/programs": "Manage long-term programs, bootcamps, and their associated modules.",
    "/admin/course-page": "Edit the curriculum, syllabus, and promotional details for the main course offering.",
    "/admin/registrations": "View all user event registrations, attendee details, and their payment statuses.",
    "/admin/leads": "Manage contact inquiries, newsletter signups, and potential leads collected from the site.",
    "/admin/helpdesk": "Review, assign status, and respond to support tickets submitted by users via the chat widget.",
    "/admin/coupons": "Generate and track discount codes applied to courses and events.",
    "/admin/mailer": "Send bulk emails to specific user segments (like leads or attendees) and track delivery.",
    "/admin/mentors": "Add or remove mentors showcased on the platform, including their photos and designations.",
    "/admin/partners": "Manage community partners, hiring partners, and their logos displayed on the site.",
    "/admin/mentored-startups": "Highlight successful startups and companies mentored by the program.",
    "/admin/gallery": "Upload and organize images for the public event gallery and timeline.",
    "/admin/bottom-videos": "Configure promotional YouTube videos shown at the bottom of the landing pages.",
    "/admin/testimonials": "Manage student and partner testimonials, ratings, and feedback.",
    "/admin/tools": "Add useful downloadable resources, ICS files, and tools for students.",
    "/admin/chat-widgets": "Configure floating chat widgets or external help integrations like WhatsApp.",
    "/admin/settings": "Update global site settings like contact emails, physical addresses, and phone numbers."
};

function AdminTopBar({ onToggleMenu, pathname }: { onToggleMenu: () => void, pathname: string }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showInfo, setShowInfo] = useState(false);
    const [searchResults, setSearchResults] = useState<{href: string, label: string, category: string}[]>([]);
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }
        
        const q = query.toLowerCase();
        const results: {href: string, label: string, category: string}[] = [];
        
        NAV_CATEGORIES.forEach(cat => {
            cat.links.forEach(link => {
                const infoText = PANEL_INFO[link.href] || "";
                if (link.label.toLowerCase().includes(q) || cat.title.toLowerCase().includes(q) || infoText.toLowerCase().includes(q)) {
                    results.push({ ...link, category: cat.title });
                }
            });
        });
        
        setSearchResults(results);
    };

    const handleResultClick = (href: string) => {
        setSearchQuery("");
        setSearchResults([]);
        router.push(href);
    };

    const infoText = PANEL_INFO[pathname];
    const currentLink = NAV_CATEGORIES.flatMap(c => c.links).find(l => l.href === pathname);

    return (
        <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 md:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={onToggleMenu}
                    className="md:hidden text-gray-600 hover:text-gray-900 focus:outline-none p-2 -ml-2"
                >
                    <i className="fas fa-bars text-xl"></i>
                </button>
                
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-gray-400 font-medium">Admin Panel</span>
                    <span className="text-gray-300">/</span>
                    <span className="text-gray-900 font-bold">{currentLink?.label || 'Dashboard'}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6 flex-1 justify-end">
                {/* Global Search */}
                <div className="relative w-full max-w-md" ref={searchRef}>
                    <div className="relative flex items-center">
                        <i className="fas fa-search absolute left-3 text-gray-400"></i>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            onFocus={handleSearch}
                            placeholder="Search admin panels (e.g., 'tickets')"
                            className="w-full bg-gray-50 border border-gray-200 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                        />
                    </div>
                    
                    {searchResults.length > 0 && (
                        <div className="absolute top-full mt-2 left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden max-h-[60vh] overflow-y-auto">
                            {searchResults.map(result => (
                                <button
                                    key={result.href}
                                    onClick={() => handleResultClick(result.href)}
                                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex flex-col gap-1"
                                >
                                    <span className="text-sm font-bold text-gray-900">{result.label}</span>
                                    <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{result.category}</span>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Info Button */}
                {infoText && (
                    <div className="relative">
                        <button 
                            onClick={() => setShowInfo(!showInfo)}
                            className="w-9 h-9 shrink-0 rounded-full bg-blue-50 text-accent-blue hover:bg-accent-blue hover:text-white flex items-center justify-center transition-colors focus:outline-none shadow-sm"
                            title="Panel Information"
                        >
                            <i className="fas fa-info"></i>
                        </button>
                        
                        {showInfo && (
                            <>
                                <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowInfo(false)}></div>
                                <div className="absolute right-0 top-full mt-3 w-72 md:w-80 bg-white border border-gray-100 rounded-2xl shadow-2xl p-5 z-50 transform origin-top-right">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                                            <i className="fas fa-info-circle text-accent-blue"></i> About this Panel
                                        </h4>
                                        <button onClick={() => setShowInfo(false)} className="text-gray-400 hover:text-gray-600">
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {infoText}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("adminToken");
            if (!token) {
                setIsAuthenticated(false);
                setIsLoading(false);
                router.push("/admin");
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
                    document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Strict';
                    setIsAuthenticated(false);
                    router.push("/admin");
                }
            } catch (err) {
                console.error("Token verification failed:", err);
                setIsAuthenticated(false);
                router.push("/admin");
            }
            setIsLoading(false);
        };

        verifyToken();
    }, [pathname, router]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-900">
            <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-accent-blue rounded-full animate-spin"></div>
                <p className="text-gray-500 tracking-widest text-sm uppercase font-bold">Loading Workspace</p>
            </div>
        </div>
    );

    if (!isAuthenticated && typeof window !== "undefined") {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col md:flex-row relative overflow-hidden">
            {/* Subtle background ambient glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Mobile Sidebar Backdrop */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 md:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {isAuthenticated && (
                <aside className={`fixed inset-y-0 left-0 z-50 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 w-64 md:w-72 bg-white/95 backdrop-blur-xl border-r border-gray-200 p-6 flex flex-col h-screen overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] scrollbar-hide`}>
                    <button 
                        onClick={() => setIsMobileMenuOpen(false)} 
                        className="md:hidden absolute top-6 right-6 text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                        <i className="fas fa-times text-xl"></i>
                    </button>
                    
                    <div className="mb-8 shrink-0">
                        <Link href="/" className="block group mb-3" onClick={() => setIsMobileMenuOpen(false)}>
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
                                <span className="text-[10px] md:text-[11px] font-black tracking-[0.2em] text-[#0B1120] uppercase"><span className="text-accent-blue">Startup</span> School</span>
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
                                            onClick={() => setIsMobileMenuOpen(false)}
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
                            onClick={() => { 
                                localStorage.removeItem("adminToken"); 
                                document.cookie = 'adminToken=; path=/; max-age=0; SameSite=Strict';
                                window.location.href = "/admin"; 
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 group"
                        >
                            <i className="fas fa-sign-out-alt w-5 text-center group-hover:-translate-x-1 transition-transform"></i>
                            <span className="text-sm font-bold tracking-wide">Log Out</span>
                        </button>
                    </div>
                </aside>
            )}
            
            <main className="flex-1 overflow-y-auto bg-transparent z-10 relative min-h-screen flex flex-col">
                {isAuthenticated && (
                    <AdminTopBar 
                        onToggleMenu={() => setIsMobileMenuOpen(true)} 
                        pathname={pathname}
                    />
                )}
                <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-grow">
                    {children}
                </div>
            </main>
        </div>
    );
}