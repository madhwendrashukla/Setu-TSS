'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfileLink {
    id: string;
    label: string;
    sublabel?: string;
    url: string;
    icon: string;
    style: 'primary' | 'glass';
    color: string;
    display_order: number;
    is_active: boolean;
}

interface GauravProfileData {
    id: string;
    name: string;
    tagline: string;
    photo_url?: string;
    org: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    vcard_filename: string;
    ecosystem_links: ProfileLink[];
    founder_links: ProfileLink[];
    footer_brand_name: string;
    footer_tagline: string;
}

// ── Color styles mapping for light theme ─────────────────────────────────────

const COLOR_CLASSES: Record<string, { bg: string; text: string; hoverBg: string; hoverText: string }> = {
    violet: {
        bg: 'bg-purple-100/90',
        text: 'text-[#7C3AED]',
        hoverBg: 'group-hover:bg-[#7C3AED]',
        hoverText: 'group-hover:text-white',
    },
    blue: {
        bg: 'bg-blue-100/80',
        text: 'text-[#0A66C2]',
        hoverBg: 'group-hover:bg-[#0A66C2]',
        hoverText: 'group-hover:text-white',
    },
    pink: {
        bg: 'bg-pink-100/80',
        text: 'text-[#E1306C]',
        hoverBg: 'group-hover:bg-[#E1306C]',
        hoverText: 'group-hover:text-white',
    },
    red: {
        bg: 'bg-red-100/80',
        text: 'text-[#E11D48]',
        hoverBg: 'group-hover:bg-[#E11D48]',
        hoverText: 'group-hover:text-white',
    },
    green: {
        bg: 'bg-emerald-100/80',
        text: 'text-[#059669]',
        hoverBg: 'group-hover:bg-[#059669]',
        hoverText: 'group-hover:text-white',
    },
    amber: {
        bg: 'bg-amber-100/80',
        text: 'text-[#D97706]',
        hoverBg: 'group-hover:bg-[#D97706]',
        hoverText: 'group-hover:text-white',
    },
    white: {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        hoverBg: 'group-hover:bg-slate-800',
        hoverText: 'group-hover:text-white',
    },
    indigo: {
        bg: 'bg-indigo-100/80',
        text: 'text-[#4F46E5]',
        hoverBg: 'group-hover:bg-[#4F46E5]',
        hoverText: 'group-hover:text-white',
    },
};

// ── Default Fallback Data ───────────────────────────────────────────────────

const DEFAULT_PROFILE: GauravProfileData = {
    id: 'default',
    name: 'Gaurav Bansal',
    tagline: 'Building Bharat’s Launchpad for next generation of Entrepreneurs',
    photo_url: '/gaurav.webp',
    org: 'Setu - TheStartupSchool',
    title: 'Founder & Chief Mentor',
    phone: '+919289121121',
    email: 'Gauravbansal@foundersschool.in',
    website: 'https://foundersschool.in',
    address: 'Mumbai, Maharashtra, India',
    vcard_filename: 'Gaurav_Bansal',
    ecosystem_links: [
        {
            id: 'eco-1',
            label: 'Visit Website',
            sublabel: 'setustartupschool.com',
            url: 'https://setustartupschool.com',
            icon: 'fas fa-globe',
            style: 'primary',
            color: 'violet',
            display_order: 0,
            is_active: true,
        },
        {
            id: 'eco-2',
            label: 'Setu - TheStartupSchool LinkedIn',
            sublabel: 'Official Page',
            url: 'https://www.linkedin.com/company/the-startup-school-2026/',
            icon: 'fab fa-linkedin',
            style: 'glass',
            color: 'blue',
            display_order: 1,
            is_active: true,
        },
        {
            id: 'eco-3',
            label: 'Follow our Instagram',
            sublabel: '@the__startup__school',
            url: 'https://www.instagram.com/the__startup__school',
            icon: 'fab fa-instagram',
            style: 'glass',
            color: 'pink',
            display_order: 2,
            is_active: true,
        },
    ],
    founder_links: [
        {
            id: 'fnd-1',
            label: 'Connect with Gaurav',
            sublabel: 'LinkedIn Profile',
            url: 'https://www.linkedin.com/in/gauravbansal2/',
            icon: 'fab fa-linkedin-in',
            style: 'glass',
            color: 'blue',
            display_order: 0,
            is_active: true,
        },
        {
            id: 'fnd-2',
            label: "Founder's Hacks",
            sublabel: 'Masterclass Video',
            url: 'https://www.youtube.com/watch?v=tt_PVE_A3wU',
            icon: 'fab fa-youtube',
            style: 'glass',
            color: 'red',
            display_order: 1,
            is_active: true,
        },
    ],
    footer_brand_name: 'Setu Startup School',
    footer_tagline: 'AN ALTERNATE B-SCHOOL FOR ALL ASPIRING FOUNDERS',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const API = process.env.NEXT_PUBLIC_API_URL;

async function fetchProfile(): Promise<GauravProfileData> {
    try {
        if (API) {
            const res = await fetch(`${API}/api/gaurav-profile`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                return data;
            }
        }
    } catch {
        // Fallback to production if local backend is not reachable
    }

    try {
        const prodRes = await fetch('https://foundersschool.in/api/gaurav-profile', { cache: 'no-store' });
        if (prodRes.ok) {
            return await prodRes.json();
        }
    } catch {
        // Fallback to default
    }

    return DEFAULT_PROFILE;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function GauravBansalPage() {
    const [profile, setProfile] = useState<GauravProfileData>(DEFAULT_PROFILE);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile().then((data) => {
            setProfile(data || DEFAULT_PROFILE);
            setLoading(false);
        });
    }, []);

    const copyCurrentUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        });
    };

    const downloadVCard = () => {
        if (!profile) return;
        const vcard =
            'BEGIN:VCARD\n' +
            'VERSION:3.0\n' +
            `FN:${profile.name || 'Gaurav Bansal'}\n` +
            `ORG:${profile.org || 'Setu - TheStartupSchool'}\n` +
            `TITLE:${profile.title || 'Founder'}\n` +
            `TEL;TYPE=CELL:${profile.phone || '+919289121121'}\n` +
            `EMAIL:${profile.email || 'Gauravbansal@foundersschool.in'}\n` +
            `URL:${profile.website || 'https://foundersschool.in'}\n` +
            `ADR;TYPE=WORK:;;${profile.address || 'Malad West;Mumbai;;;'}\n` +
            'END:VCARD';

        const blob = new Blob([vcard], { type: 'text/vcard' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${profile.vcard_filename || 'Gaurav_Bansal'}.vcf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    const photoUrl = profile.photo_url || '/gaurav.webp';

    const ecosystemLinks = [...(profile.ecosystem_links ?? [])].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );
    const founderLinks = [...(profile.founder_links ?? [])].sort(
        (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
    );

    // ── Render link card ─────────────────────────────────────────────────────

    const renderLink = (link: ProfileLink) => {
        const colorConfig = COLOR_CLASSES[link.color] ?? COLOR_CLASSES['violet'];

        if (link.style === 'primary') {
            return (
                <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative overflow-hidden w-full group rounded-2xl md:rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-[#A855F7] via-[#8B3DFF] to-[#7C3AED] text-white shadow-[0_10px_30px_rgba(124,58,237,0.25)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-between"
                >
                    {/* Shimmer sweep */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

                    <div className="flex items-center gap-4 sm:gap-5 relative z-10">
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl sm:text-2xl text-white shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform">
                            <i className={link.icon}></i>
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="font-bold text-lg sm:text-xl md:text-2xl text-white tracking-tight leading-snug">
                                {link.label}
                            </span>
                            {link.sublabel && (
                                <span className="text-[11px] sm:text-xs text-white/80 font-semibold tracking-wider uppercase mt-0.5">
                                    {link.sublabel}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#7C3AED] transition-all duration-300 shadow-sm flex-shrink-0 ml-2">
                        <i className="fas fa-arrow-right text-sm sm:text-base group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                </a>
            );
        }

        // Glass card style
        return (
            <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-white/90 backdrop-blur-xl border border-functional-border hover:border-accent-blue/40 shadow-sm hover:shadow-xl hover:shadow-purple-950/5 hover:-translate-y-0.5 transition-all duration-300 rounded-2xl md:rounded-3xl p-4 sm:p-5 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4 sm:gap-5">
                    <div
                        className={`w-12 h-12 sm:w-13 sm:h-13 rounded-2xl flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 flex-shrink-0 shadow-sm ${colorConfig.bg} ${colorConfig.text} ${colorConfig.hoverBg} ${colorConfig.hoverText}`}
                    >
                        <i className={link.icon}></i>
                    </div>
                    <div className="text-left">
                        <span className="block font-bold text-[#13113B] text-base sm:text-lg group-hover:text-accent-blue transition-colors leading-snug">
                            {link.label}
                        </span>
                        {link.sublabel && (
                            <span className="text-xs text-text-secondary font-medium tracking-wide mt-0.5 block">
                                {link.sublabel}
                            </span>
                        )}
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-text-secondary/40 group-hover:text-accent-blue group-hover:translate-x-1 transition-all flex-shrink-0">
                    <i className="fas fa-chevron-right text-sm"></i>
                </div>
            </a>
        );
    };

    return (
        <div className="min-h-screen bg-bg-main relative pt-24 sm:pt-28 md:pt-36 pb-20 px-4 sm:px-6 flex flex-col items-center justify-start overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-accent-violet/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-[40%] right-[-10%] w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[100px] pointer-events-none" />

            <main className="w-full max-w-xl md:max-w-2xl flex flex-col items-center relative z-10">

                {/* ── 1. Profile Header ───────────────────────────────────── */}
                <header className="text-center w-full mb-8 flex flex-col items-center">
                    
                    {/* Badge Pill */}
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white border border-[#A855F7]/30 text-[#7C3AED] shadow-sm mb-6">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
                        Founder &amp; Chief Mentor
                    </div>

                    {/* Avatar with Gradient Halo */}
                    <div className="relative mb-6">
                        <div className="relative w-32 h-32 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full p-[3.5px] bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#C084FC] shadow-[0_12px_35px_rgba(124,58,237,0.22)]">
                            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-white bg-white shadow-inner flex items-center justify-center relative">
                                <img
                                    src={photoUrl}
                                    alt={profile.name}
                                    className="w-full h-full object-cover object-top"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                            profile.name
                                        )}&background=7C3AED&color=FFFFFF&size=256`;
                                    }}
                                />
                            </div>
                        </div>

                        {/* Verified Badge */}
                        <div
                            className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 bg-accent-blue text-white w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border-2 border-white shadow-md"
                            title="Verified Founder Profile"
                        >
                            <i className="fas fa-check text-xs"></i>
                        </div>
                    </div>

                    {/* Name & Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight mb-2">
                        {profile.name}
                    </h1>

                    <p className="text-sm sm:text-base font-semibold text-accent-blue tracking-wide mb-6">
                        {profile.title} • <span className="text-text-secondary">{profile.org}</span>
                    </p>

                    {/* Tagline / Manifesto Quote Box */}
                    <div className="w-full bg-white/90 backdrop-blur-2xl border border-functional-border shadow-xl shadow-purple-950/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden text-center">
                        <i className="fas fa-quote-left text-[#A855F7]/15 text-5xl absolute top-3 left-4 pointer-events-none"></i>
                        
                        <p className="text-base sm:text-lg md:text-xl text-text-primary manifesto-font italic leading-relaxed relative z-10 font-normal">
                            &ldquo;{profile.tagline}&rdquo;
                        </p>
                    </div>
                </header>

                {/* ── 2. Link Stack ───────────────────────────────────────── */}
                <div className="w-full space-y-8 mb-10">

                    {/* Ecosystem Section */}
                    {ecosystemLinks.length > 0 && (
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3 px-2">
                                <span className="text-xs font-extrabold text-accent-blue uppercase tracking-[0.25em]">
                                    Setu Ecosystem
                                </span>
                                <div className="h-px flex-1 bg-functional-border"></div>
                            </div>
                            <div className="space-y-3.5">
                                {ecosystemLinks.map(renderLink)}
                            </div>
                        </div>
                    )}

                    {/* Founder Section */}
                    {founderLinks.length > 0 && (
                        <div className="space-y-3.5">
                            <div className="flex items-center gap-3 px-2 pt-2">
                                <span className="text-xs font-extrabold text-accent-blue uppercase tracking-[0.25em]">
                                    Founder &amp; Content
                                </span>
                                <div className="h-px flex-1 bg-functional-border"></div>
                            </div>
                            <div className="space-y-3.5">
                                {founderLinks.map(renderLink)}
                            </div>
                        </div>
                    )}
                </div>

                {/* ── 3. Profile Actions ──────────────────────────────────── */}
                <div className="w-full space-y-3.5 mb-12">
                    {/* Save Contact Button */}
                    <button
                        onClick={downloadVCard}
                        className="w-full py-4 sm:py-4.5 px-8 rounded-2xl md:rounded-full bg-gradient-to-r from-[#7C3AED] via-[#8B3DFF] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-base sm:text-lg shadow-[0_8px_25px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <i className="fas fa-address-card text-lg"></i>
                        <span>Save Contact to Phone</span>
                    </button>

                    {/* Share Profile Button */}
                    <button
                        onClick={copyCurrentUrl}
                        className="w-full py-3.5 px-6 rounded-2xl md:rounded-full bg-white hover:bg-purple-50/50 text-text-primary border border-functional-border hover:border-accent-blue/40 font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <i className="fas fa-check text-green-600"></i>
                                <span className="text-green-600">Profile Link Copied!</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-share-nodes text-accent-blue"></i>
                                <span>Share Profile</span>
                            </>
                        )}
                    </button>
                </div>

                {/* ── 4. Footer Brand Card ────────────────────────────────── */}
                <div className="w-full text-center py-6 px-4 rounded-3xl bg-white/50 border border-functional-border/60 backdrop-blur-sm">
                    <div className="flex items-center justify-center gap-2.5 mb-2">
                        <span className="text-xl sm:text-2xl font-black tracking-tight text-text-primary">
                            SETU
                        </span>
                        <span className="text-xl sm:text-2xl font-bold tracking-tight text-accent-blue">
                            STARTUP SCHOOL
                        </span>
                    </div>
                    <p className="text-[11px] sm:text-xs uppercase tracking-[0.2em] font-bold text-text-secondary">
                        {profile.footer_tagline || 'An Alternate B-School for All Aspiring Founders'}
                    </p>
                </div>

            </main>
        </div>
    );
}
