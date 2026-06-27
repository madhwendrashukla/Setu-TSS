"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const EXCLUDED_NAV_PATHS = ['/fundraising-workshop-15apr', '/AI-workshop-15may'];

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleMenu = () => setIsOpen(!isOpen);
    const closeMenu = () => setIsOpen(false);

    const isActive = (path: string) => pathname === path;

    if (EXCLUDED_NAV_PATHS.includes(pathname) || pathname.startsWith('/admin')) return null;

    return (
        <>
            <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 flex justify-center">
                <nav className="w-full bg-white/95 backdrop-blur-3xl border border-black/5 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] px-4 sm:px-6">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="flex items-center gap-3">
                                    <Image 
                                        src="/setu-logo-purple.png" 
                                        alt="Setu Logo" 
                                        width={85} 
                                        height={28} 
                                        className="object-contain"
                                        priority
                                    />
                                    <div className="h-5 w-px bg-black/20"></div>
                                    <span className="text-[10px] md:text-[13px] font-black tracking-[0.2em] text-[#0f172a] uppercase mt-0.5">The <span className="text-[#6d28d9]">Startup</span> School</span>
                                </div>
                            </Link>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-2 md:space-x-4 lg:space-x-8 text-[15px] font-bold tracking-wide">
                            <Link href="/mentors" className={`px-4 py-2 rounded-full transition duration-300 ${isActive('/mentors') ? 'bg-[#312e81]/5 text-[#312e81]' : 'text-[#4338ca] hover:bg-[#312e81]/5 hover:text-[#312e81]'}`}>Mentors</Link>
                            <Link href="/events" className={`px-4 py-2 rounded-full transition duration-300 ${isActive('/events') ? 'bg-[#312e81]/5 text-[#312e81]' : 'text-[#4338ca] hover:bg-[#312e81]/5 hover:text-[#312e81]'}`}>Events</Link>
                            <Link href="/tools" className={`px-4 py-2 rounded-full transition duration-300 ${isActive('/tools') || pathname.startsWith('/tools/') ? 'bg-[#312e81]/5 text-[#312e81]' : 'text-[#4338ca] hover:bg-[#312e81]/5 hover:text-[#312e81]'}`}>Tools</Link>
                            <Link href="/#contact" className="ml-4 bg-black text-white px-8 py-2.5 rounded-full font-bold transition duration-300 hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#1e1e1e]">
                                Connect
                            </Link>
                        </div>
                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-[#312e81] hover:text-[#4338ca] focus:outline-none transition-colors">
                                {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
            {/* Mobile Menu - Full screen overlay style */}
            <div className={`${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden fixed inset-0 top-[80px] bg-white z-40 transition-opacity duration-300 overflow-y-auto`}>
                <div className="px-6 py-8 flex flex-col space-y-6 text-2xl font-bold tracking-tight">
                    <Link href="/mentors" onClick={closeMenu} className="text-[#312e81] hover:text-[#4338ca] transition-colors border-b border-black/5 pb-4">Mentors</Link>
                    <Link href="/events" onClick={closeMenu} className="text-[#312e81] hover:text-[#4338ca] transition-colors border-b border-black/5 pb-4">Events</Link>
                    <Link href="/tools" onClick={closeMenu} className="text-[#312e81] hover:text-[#4338ca] transition-colors border-b border-black/5 pb-4">Tools</Link>
                    <Link href="/#contact" onClick={closeMenu} className="text-[#6d28d9] mt-4">Connect &rarr;</Link>
                </div>
            </div>
        </>
    );
}
