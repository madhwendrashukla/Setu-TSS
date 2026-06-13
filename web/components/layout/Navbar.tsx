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
            <nav className="fixed w-full z-50 bg-[#0F111A]/80 backdrop-blur-2xl border-b border-white/5 saturate-[1.8]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14 md:h-16">
                        <div className="flex items-center flex-shrink-0">
                            <Link href="/" className="text-xl md:text-2xl font-black text-white tracking-tighter whitespace-nowrap hidden md:flex items-center gap-3">
                                <Image src="/logo.png" alt="Setup School Logo" width={32} height={32} className="rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.3)] object-cover bg-white p-[1px]" priority />
                                <span>THE <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP</span> SCHOOL</span>
                            </Link>
                            <Link href="/" className="text-lg sm:text-xl font-black text-white tracking-tighter whitespace-nowrap md:hidden flex items-center gap-2.5">
                                <Image src="/logo.png" alt="TSS" width={28} height={28} className="rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.3)] object-cover bg-white p-[1px]" priority />
                                <span>THE <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP</span> SCHOOL</span>
                            </Link>
                        </div>
                        {/* Desktop Menu - High contrast, small text, dense tracking */}
                        <div className="hidden md:flex items-center space-x-8 text-xs font-semibold tracking-wide">
                            <Link href="/mentors" className={`${isActive('/mentors') ? 'text-white' : 'text-text-secondary'} hover:text-white transition duration-300`}>MENTORS</Link>
                            <Link href="/events" className={`${isActive('/events') ? 'text-white' : 'text-text-secondary'} hover:text-white transition duration-300`}>EVENTS</Link>
                            <Link href="/tools" className={`${isActive('/tools') || pathname.startsWith('/tools/') ? 'text-white' : 'text-text-secondary'} hover:text-white transition duration-300`}>TOOLS</Link>
                            <Link href="/#contact" className="bg-white/10 hover:bg-white text-white hover:text-black px-4 py-1.5 rounded-full font-medium transition duration-300 border border-white/10">
                                Connect
                            </Link>
                        </div>
                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-text-primary hover:text-white focus:outline-none transition-colors">
                                {isOpen ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
            {/* Mobile Menu - Full screen overlay style */}
            <div className={`${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'} md:hidden fixed inset-0 top-[56px] bg-[#0F111A] z-40 transition-opacity duration-300 overflow-y-auto`}>
                <div className="px-6 py-8 flex flex-col space-y-6 text-2xl font-bold tracking-tight">
                    <Link href="/mentors" onClick={closeMenu} className="text-text-primary hover:text-accent-blue transition-colors border-b border-white/10 pb-4">Mentors</Link>
                    <Link href="/events" onClick={closeMenu} className="text-text-primary hover:text-accent-blue transition-colors border-b border-white/10 pb-4">Events</Link>
                    <Link href="/tools" onClick={closeMenu} className="text-text-primary hover:text-accent-blue transition-colors border-b border-white/10 pb-4">Tools</Link>
                    <Link href="/#contact" onClick={closeMenu} className="text-accent-blue mt-4">Connect &rarr;</Link>
                </div>
            </div>
        </>
    );
}
