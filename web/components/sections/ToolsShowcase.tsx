"use client";

import React from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, FileText, Landmark, ArrowRight, Building2, Wallet, TrendingUp, PieChart } from 'lucide-react';

const CATEGORIES = [
    {
        title: "Government Grants & Schemes",
        description: "Explore equity-free capital, subsidies, and government-backed hubs designed for founders.",
        icon: <Landmark className="w-8 h-8 text-[#6B21FB]" />,
        href: "/tools/incubator-search/grants",
        color: "bg-[#f3e8ff]"
    },
    {
        title: "Pitch Deck Library",
        description: "Study 35+ successful funding decks from global unicorns to master your own pitch.",
        icon: <FileText className="w-8 h-8 text-[#6B21FB]" />,
        href: "/tools/pitch-decks",
        color: "bg-[#e0e7ff]"
    },
    {
        title: "Events Calendar",
        description: "Discover and sync the most important B2B startup summits and offline meetups across India.",
        icon: <Calendar className="w-8 h-8 text-[#6B21FB]" />,
        href: "/tools/founder-calendar",
        color: "bg-[#fce7f3]"
    },
    {
        title: "Incubators & Accelerators",
        description: "An intelligent mapping tool to discover workspaces and accelerator programs across the startup landscape.",
        icon: <Building2 className="w-8 h-8 text-[#6B21FB]" />,
        href: "/tools/incubators-accelerators",
        color: "bg-[#dcfce7]"
    },
    {
        title: "Investor Database",
        description: "Connect with 250+ active angel investors and VCs tailored to your startup's stage and industry.",
        icon: <Wallet className="w-8 h-8 text-[#6B21FB]" />,
        href: "/tools/incubator-search/investors",
        color: "bg-[#fef3c7]"
    }
];

export function ToolsShowcase() {
    return (
        <section className="card-section pt-16 md:pt-24 pb-0 relative">
            {/* Background Pattern overlay (dotted mesh effect) */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16 text-center">
                <div className="inline-flex items-center justify-center gap-2 text-[#6B21FB] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
                    <Sparkles className="w-4 h-4" /> PREMIUM RESOURCES
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight mb-4">
                    Tools &amp; <span className="text-[#6B21FB]">Resources.</span>
                </h2>
                <p className="text-sm md:text-lg text-text-secondary font-medium max-w-2xl mx-auto leading-relaxed">
                    Access our curated suite of tools designed to help you raise capital, <br className="hidden md:block" /> build your product, and scale your startup.
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {CATEGORIES.map((category, idx) => (
                    <Link 
                        key={idx} 
                        href={category.href}
                        className={`group flex flex-col p-8 md:p-10 bg-white border border-black/5 rounded-[32px] transition-all duration-300 relative overflow-hidden ${category.comingSoon ? 'opacity-80 cursor-not-allowed hover:bg-gray-50' : 'hover:border-[#6B21FB]/30 hover:shadow-[0_8px_40px_rgba(90,58,247,0.08)] hover:-translate-y-1'}`}
                        onClick={(e) => { if (category.comingSoon) e.preventDefault(); }}
                    >
                        <div className="flex items-start justify-between w-full mb-8">
                            <div className={`w-16 h-16 rounded-2xl ${category.color} flex items-center justify-center shrink-0 ${!category.comingSoon && 'group-hover:scale-110'} transition-transform duration-500`}>
                                {category.icon}
                            </div>
                            {category.comingSoon && (
                                <span className="text-[10px] font-bold text-black/40 tracking-widest uppercase border border-black/10 bg-gray-100 px-3 py-1.5 rounded-full">
                                    Coming Soon
                                </span>
                            )}
                        </div>
                        
                        <h3 className={`text-2xl font-bold mb-3 tracking-tight ${category.comingSoon ? 'text-black/60' : 'text-black'}`}>
                            {category.title}
                        </h3>
                        <p className="text-text-secondary font-medium leading-relaxed mb-10 flex-1">
                            {category.description}
                        </p>
                        
                        {!category.comingSoon && (
                            <div className="flex items-center gap-2 text-[#6B21FB] font-bold mt-auto group-hover:gap-3 transition-all">
                                Explore <ArrowRight className="w-5 h-5" />
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            <div className="mt-6 text-center relative z-10">
                <Link href="/tools" className="group inline-flex items-center gap-3 bg-[#6B21FB] hover:bg-[#4c31d1] text-white px-8 py-4 rounded-xl font-bold text-sm transition-all duration-300 shadow-[0_8px_20px_rgba(90,58,247,0.2)] hover:shadow-[0_12px_25px_rgba(90,58,247,0.3)] hover:-translate-y-0.5">
                    View all resources <span className="text-lg leading-none">→</span>
                </Link>
            </div>
        </section>
    );
}
