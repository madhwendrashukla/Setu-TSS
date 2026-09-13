"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, FileText, Landmark, ArrowRight, Building2, Wallet, TrendingUp, PieChart } from 'lucide-react';

const CATEGORIES = [
    {
        title: "Government Grants & Schemes",
        description: "Explore equity-free capital, subsidies, and government-backed hubs designed for founders.",
        icon: <Landmark className="w-8 h-8 text-[#A855F7]" />,
        href: "/tools/incubator-search/grants",
        color: "bg-[#A855F7]/10"
    },
    {
        title: "Pitch Deck Library",
        description: "Study 35+ successful funding decks from global unicorns to master your own pitch.",
        icon: <FileText className="w-8 h-8 text-[#A855F7]" />,
        href: "/tools/pitch-decks",
        color: "bg-[#A855F7]/10"
    },
    {
        title: "Events Calendar",
        description: "Discover and sync the most important B2B startup summits and offline meetups across India.",
        icon: <Calendar className="w-8 h-8 text-[#A855F7]" />,
        href: "/tools/founder-calendar",
        color: "bg-[#A855F7]/10"
    },
    {
        title: "Incubators & Accelerators",
        description: "An intelligent mapping tool to discover workspaces and accelerator programs across the startup landscape.",
        icon: <Building2 className="w-8 h-8 text-[#A855F7]" />,
        href: "/tools/incubators-accelerators",
        color: "bg-[#A855F7]/10"
    },
    {
        title: "Investor Database",
        description: "Connect with 250+ active angel investors and VCs tailored to your startup's stage and industry.",
        icon: <Wallet className="w-8 h-8 text-[#A855F7]" />,
        href: "/tools/incubator-search/investors",
        color: "bg-[#A855F7]/10"
    }
];

export function ToolsShowcase({ toggles = {}, headings = {} }: { toggles?: any, headings?: any }) {
    const displayCategories = CATEGORIES.map(cat => {
        let rawToggleVal: any = true;
        
        if (cat.title === "Government Grants & Schemes") rawToggleVal = toggles.tool_grants;
        if (cat.title === "Pitch Deck Library") rawToggleVal = toggles.tool_pitch_decks;
        if (cat.title === "Events Calendar") rawToggleVal = toggles.tool_calendar;
        if (cat.title === "Incubators & Accelerators") rawToggleVal = toggles.tool_incubators;
        if (cat.title === "Investor Database") rawToggleVal = toggles.tool_investors;

        let status = 'live';
        if (typeof rawToggleVal === 'boolean') {
            status = rawToggleVal ? 'live' : 'disabled';
        } else if (typeof rawToggleVal === 'string') {
            status = rawToggleVal;
        }

        return { ...cat, status };
    });

    if (displayCategories.length === 0) return null;

    const rawSubtitle = headings?.subtitle || 'Access our curated suite of tools designed to help you raise capital, build your product, and scale your startup.';
    const cleanSubtitle = typeof rawSubtitle === 'string'
        ? rawSubtitle.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim()
        : rawSubtitle;

    return (
        <section className="card-section pt-16 md:pt-24 pb-0 relative">
            {/* Background Pattern overlay (dotted mesh effect) */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-12 md:mb-16 text-center">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary tracking-tight mb-4 [&_p]:inline [&_p]:m-0" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Tools & <span style="color: #A855F7">Resources.</span>' }} />
                <div className="text-base sm:text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed text-center [&_p]:inline [&_p]:m-0" dangerouslySetInnerHTML={{ __html: cleanSubtitle }} />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-wrap justify-center gap-6">
                {displayCategories.map((category, idx) => {
                    const isUnclickable = category.status !== 'live';
                    
                    let badgeText = "";
                    if (category.status === 'coming_soon') badgeText = "COMING SOON";
                    else if (category.status === 'upcoming') badgeText = "UPCOMING";
                    else if (category.status === 'disabled') badgeText = "HIDDEN";

                    return (
                        <Link 
                            key={idx} 
                            href={category.href}
                            className={`w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] group flex flex-col p-7 sm:p-8 md:p-9 bg-[#13113B] border border-functional-border/30 rounded-[32px] transition-all duration-300 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.2)] ${isUnclickable ? 'opacity-80 cursor-not-allowed' : 'hover:border-purple-500/40 hover:shadow-[0_12px_45px_rgba(168,85,247,0.22)] hover:-translate-y-1 hover:bg-[#181547]'}`}
                            onClick={(e) => { if (isUnclickable) e.preventDefault(); }}
                        >
                            <div className="flex items-start justify-between w-full mb-6">
                                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${category.color} flex items-center justify-center shrink-0 ${!isUnclickable && 'group-hover:scale-110'} transition-transform duration-500 shadow-sm border border-purple-500/10`}>
                                    {category.icon}
                                </div>
                                {badgeText && (
                                    <span className={`text-[10px] font-bold tracking-widest uppercase border border-functional-border px-3 py-1.5 rounded-full ${category.status === 'disabled' ? 'text-red-400 bg-red-500/10 border-red-500/20' : category.status === 'upcoming' ? 'text-orange-400 bg-white/5' : 'text-text-secondary bg-white/5'}`}>
                                        {badgeText}
                                    </span>
                                )}
                            </div>
                            
                            <h3 className={`text-xl sm:text-2xl font-bold mb-3 tracking-tight ${isUnclickable ? 'text-white/60' : 'text-white group-hover:text-purple-200 transition-colors'}`}>
                                {category.title}
                            </h3>
                            <p className="text-gray-400 font-medium text-sm sm:text-base leading-relaxed mb-8 flex-1">
                                {category.description}
                            </p>
                            
                            <div className="mt-auto pt-2">
                                {isUnclickable ? (
                                    <div className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-white/5 text-gray-500 flex items-center justify-center gap-2 border border-white/5 cursor-not-allowed">
                                        <span>Coming Soon</span>
                                    </div>
                                ) : (
                                    <div className="w-full py-3.5 px-5 rounded-xl font-bold text-sm bg-gradient-to-r from-[#A855F7] to-[#7C3AED] group-hover:from-[#9333ea] group-hover:to-[#6D28D9] text-white flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(168,85,247,0.35)] group-hover:shadow-[0_8px_25px_rgba(168,85,247,0.5)] group-hover:scale-[1.02] active:scale-[0.99] transition-all duration-300">
                                        <span>Explore Now</span>
                                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                    </div>
                                )}
                            </div>
                        </Link>
                    )
                })}
            </div>

            <div className="mt-8 text-center relative z-10">
                <Link href="/tools" className="group inline-flex items-center gap-3 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] hover:from-[#9333ea] hover:to-[#6D28D9] text-white px-9 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_6px_20px_rgba(168,85,247,0.3)] hover:shadow-[0_10px_28px_rgba(168,85,247,0.45)] hover:-translate-y-0.5">
                    <span>View all resources</span>
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            </div>
        </section>
    );
}
