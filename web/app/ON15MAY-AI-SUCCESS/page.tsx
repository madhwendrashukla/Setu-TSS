'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

/* ── Workshop data keyed by query param ?1 ?2 ?3 ?4 ── */
const WORKSHOPS: Record<string, {
    title: string;
    subtitle: string;
    mentor: string;
    date: string;
    whatsappLink: string;
    color: string;
    icon: string;
}> = {
    '1': {
        title: 'Startup Ideation & Validation',
        subtitle: 'Workshop 1 of the AI Startup Bootcamp',
        mentor: 'Gaurav Bansal',
        date: 'May 15, 2026  •  6–9 PM IST',
        whatsappLink: 'https://chat.whatsapp.com/Cu042iW5LeHJ9tqkROkkn7?mode=gi_t', // 🔁 Replace with actual group link
        color: '#8b5cf6',
        icon: 'fa-lightbulb',
    },
    '2': {
        title: 'Zero-to-MVP using Claude Pro AI',
        subtitle: 'Workshop 2 of the AI Startup Bootcamp',
        mentor: 'Atul Pandey',
        date: 'May 16–17, 2026  •  3 Live Sessions',
        whatsappLink: 'https://chat.whatsapp.com/JyOBZrgImfeI19AP6AXR7R?mode=gi_t', // 🔁 Replace with actual group link
        color: '#d946ef',
        icon: 'fa-robot',
    },
    '3': {
        title: 'AI Filmmaking & Video Marketing using Claude Pro AI',
        subtitle: 'Workshop 3 of the AI Startup Bootcamp',
        mentor: 'Amey Asuti',
        date: 'May 17, 2026  •  10 AM–12:30 PM IST',
        whatsappLink: 'https://chat.whatsapp.com/BEPC1SJ9oZgCSchybnaIah?mode=gi_t', // 🔁 Replace with actual group link
        color: '#8b5cf6',
        icon: 'fa-film',
    },
    '4': {
        title: 'Complete AI Launchpad Bundle (All mentors).',
        subtitle: '⭐ All 3 Workshops — Early Bird',
        mentor: 'Gaurav Bansal, Atul Pandey & Amey Asuti',
        date: 'May 15–17, 2026  •  All 5 Sessions',
        whatsappLink: 'https://chat.whatsapp.com/Hbgn7u3fkozDTFyCOOZt8p?mode=gi_t', // 🔁 Replace with actual group link
        color: '#d946ef',
        icon: 'fa-rocket',
    },
};


function SuccessContent() {
    const searchParams = useSearchParams();
    const [scrolled, setScrolled] = useState(false);

    // Detect ?1 ?2 ?3 ?4 — Next.js searchParams only captures key=value,
    // so Razorpay redirects like ?1 are read as key "1" with empty value
    const workshopKey = ['1', '2', '3', '4'].find(k => searchParams.has(k)) ?? null;

    useEffect(() => {
        if (!workshopKey) {
            const timer = setTimeout(() => {
                window.location.replace('https://thestartupschool.in/AI-workshop-15may');
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [workshopKey]);

    if (!workshopKey) {
        return (
            <div className="min-h-screen bg-[#0f172a] text-[#f8fafc] flex items-center justify-center p-6 overflow-hidden relative" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <style dangerouslySetInnerHTML={{ __html: `
                    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
                    .bg-grid-pattern {
                        background-image: linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                                          linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                        background-size: 30px 30px;
                    }
                    .glass-card {
                        background: rgba(15, 23, 42, 0.6);
                        backdrop-filter: blur(16px);
                        -webkit-backdrop-filter: blur(16px);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                    }
                    @keyframes spin-slow {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                    .animate-spin-slow { animation: spin-slow 2s linear infinite; }
                `}} />
                
                {/* Background Grid */}
                <div className="fixed inset-0 bg-grid-pattern z-0 pointer-events-none" />
                
                <div className="glass-card rounded-3xl p-8 md:p-12 text-center max-w-md w-full relative z-10 border-b-4 border-violet-500 shadow-2xl">
                    <div className="mb-8 relative inline-flex">
                        <div className="absolute inset-0 bg-violet-500 blur-2xl opacity-20 animate-pulse" />
                        <div className="relative w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                            <svg className="w-8 h-8 text-violet-400 animate-spin-slow" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">Redirecting...</h1>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                        Taking you to the launchpad. If you are not redirected automatically, click the link below.
                    </p>
                    
                    <a 
                        href="https://thestartupschool.in/AI-workshop-15may"
                        onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in/AI-workshop-15may'); }}
                        className="inline-flex items-center text-violet-400 hover:text-violet-300 font-bold text-sm transition-all gap-2 group"
                    >
                        go to ai startup launchpad page
                        <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1" />
                    </a>
                </div>
            </div>
        );
    }

    const workshop = WORKSHOPS[workshopKey];

    useEffect(() => {
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.location.replace('https://thestartupschool.in/AI-workshop-15may');
        };
        window.addEventListener('popstate', handlePopState);

        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

                .success-body {
                    background-color: #0f172a;
                    color: #f8fafc;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                .brand-gradient {
                    background: linear-gradient(to right, #8b5cf6, #d946ef);
                }
                .text-brand-gradient {
                    background: linear-gradient(to right, #8b5cf6, #d946ef);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                .glass-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                .bg-grid-pattern {
                    background-image:
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 30px 30px;
                }
                @keyframes blob {
                    0% { transform: translate(0px,0px) scale(1) }
                    33% { transform: translate(20px,-30px) scale(1.05) }
                    66% { transform: translate(-15px,15px) scale(0.95) }
                    100% { transform: translate(0px,0px) scale(1) }
                }
                .animate-blob { animation: blob 7s infinite; }
                @keyframes successPop {
                    0% { opacity:0; transform:scale(0.5) }
                    100% { opacity:1; transform:scale(1) }
                }
                .animate-success-pop { animation: successPop 0.5s cubic-bezier(0.175,0.885,0.32,1.275) forwards; }
                @keyframes shimmer {
                    0% { background-position: -200% center; }
                    100% { background-position: 200% center; }
                }
                .shimmer-btn {
                    background: linear-gradient(90deg, #25D366 0%, #20b858 40%, #7aeba0 60%, #25D366 100%);
                    background-size: 200% auto;
                    animation: shimmer 3s linear infinite;
                }
                header nav, footer.global-footer, .directory-advisor-bot {
                    display: none !important;
                }
            `}} />

            <div className="success-body antialiased selection:bg-[#8b5cf6] selection:text-white relative">

                {/* Background Grid */}
                <div className="fixed inset-0 bg-grid-pattern z-[-1] pointer-events-none" />

                {/* Nav */}
                <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'glass-card'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 md:h-20">
                            <a
                                href="https://thestartupschool.in"
                                onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in'); }}
                                className="flex-shrink-0 font-extrabold text-lg md:text-2xl tracking-tight flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity"
                            >
                                <img
                                    src="/logo.png"
                                    alt="Setu - TheStartupSchool"
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] object-cover"
                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=SS&background=8b5cf6&color=fff&rounded=true'; }}
                                />
                                <span>The <span className="text-brand-gradient">Startup</span> School</span>
                            </a>
                            <div className="relative group">
                                <div className="absolute -inset-0.5 brand-gradient rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300" />
                                <a
                                    href="https://thestartupschool.in/AI-workshop-15may"
                                    onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in/AI-workshop-15may'); }}
                                    className="relative inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg text-white bg-[#0f172a] border border-white/10 hover:bg-transparent transition-all gap-1.5 md:gap-2"
                                >
                                    <i className="fa-solid fa-arrow-left" /> Back to Workshop
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main */}
                <main className="flex-grow flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[90vh]">

                    {/* Background orbs */}
                    <div className="absolute top-1/4 -left-10 w-64 h-64 md:w-96 md:h-96 bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-blob pointer-events-none" />
                    <div className="absolute bottom-1/4 -right-10 w-64 h-64 md:w-96 md:h-96 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[100px] opacity-25 animate-blob pointer-events-none" style={{ animationDelay: '2000ms' }} />

                    <div className="w-full max-w-2xl relative z-10">
                        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border border-white/10 border-b-4 text-center"
                            style={{ borderBottomColor: workshop.color, boxShadow: `0 20px 50px -15px ${workshop.color}40` }}>

                            {/* Success icon */}
                            <div
                                className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mb-6 sm:mb-8 animate-success-pop"
                                style={{ background: `${workshop.color}20`, border: `1px solid ${workshop.color}50`, boxShadow: `0 0 30px ${workshop.color}40` }}
                            >
                                <i className="fa-solid fa-check text-4xl sm:text-5xl drop-shadow-lg" style={{ color: workshop.color }} />
                            </div>

                            {/* Headline */}
                            <div className="mb-2 flex justify-center">
                                <span className="inline-block text-[10px] sm:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-lg border text-center leading-relaxed"
                                    style={{ 
                                        color: workshop.color, 
                                        borderColor: `${workshop.color}40`, 
                                        background: `${workshop.color}15`,
                                        maxWidth: '100%' 
                                    }}>
                                    {workshop.subtitle}
                                </span>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2 tracking-tight leading-tight">
                                You&apos;re In! 🎉
                            </h1>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4" style={{ color: workshop.color }}>
                                {workshop.title}
                            </h2>

                            <p className="text-sm sm:text-base text-slate-300 font-light leading-relaxed mb-2">
                                Payment confirmed. Your seat is secured for:
                            </p>

                            {/* Workshop details card */}
                            <div className="mt-4 mb-6 rounded-xl p-4 text-left"
                                style={{ background: `${workshop.color}10`, border: `1px solid ${workshop.color}25` }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <i className={`fa-solid ${workshop.icon} text-sm`} style={{ color: workshop.color }} />
                                    <span className="text-white font-semibold text-sm">{workshop.title}</span>
                                </div>
                                <div className="flex items-center gap-3 mb-2">
                                    <i className="fa-solid fa-user text-sm" style={{ color: workshop.color }} />
                                    <span className="text-slate-300 text-sm">{workshop.mentor}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <i className="fa-solid fa-calendar text-sm" style={{ color: workshop.color }} />
                                    <span className="text-slate-300 text-sm">{workshop.date}</span>
                                </div>
                            </div>

                            <p className="text-xs sm:text-sm text-slate-400 font-light mb-6">
                                A confirmation will be sent to your registered email. Check your inbox (and spam folder).
                            </p>

                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6" />

                            {/* WhatsApp CTA */}
                            <div className="bg-[#0f172a]/50 rounded-2xl p-5 sm:p-6 md:p-8 border border-white/5 backdrop-blur-sm">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                    <i className="fa-brands fa-whatsapp text-[#25D366] text-xl" />
                                    Next Step: Join Your Workshop Group
                                </h3>
                                <p className="text-xs sm:text-sm text-slate-400 font-light mb-5">
                                    Join the exclusive WhatsApp group for <strong className="text-white">{workshop.title}</strong> to get Zoom link, schedule updates, and pre-session materials.
                                </p>

                                <div className="relative group block w-full">
                                    <div className="absolute -inset-1 bg-[#25D366] rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition duration-300" />
                                    <a
                                        href={workshop.whatsappLink}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="shimmer-btn relative flex items-center justify-center px-6 py-4 sm:py-5 text-base sm:text-lg font-black rounded-xl text-white border border-white/20 transition-all duration-300 transform group-hover:-translate-y-1 w-full shadow-lg"
                                    >
                                        <i className="fa-brands fa-whatsapp text-xl mr-2" />
                                        Join WhatsApp Group Now
                                        <i className="fa-solid fa-arrow-right ml-3 text-white/70 text-sm" />
                                    </a>
                                </div>

                                <p className="text-[10px] text-slate-600 mt-3 text-center">
                                    This is a private group for paid participants only.
                                </p>
                            </div>

                            {/* Return link */}
                            <div className="mt-8">
                                <a
                                    href="https://thestartupschool.in"
                                    onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in'); }}
                                    className="text-xs sm:text-sm text-slate-500 hover:text-slate-300 transition-colors underline underline-offset-2"
                                >
                                    Return to Setu - TheStartupSchool Homepage
                                </a>
                            </div>

                        </div>

                        {/* Footer note */}
                        <p className="text-center text-[11px] text-slate-600 mt-6">
                            Powered by <span className="text-slate-400 font-semibold">Setu - TheStartupSchool</span> · Ramsetu Alternate Education Solutions Pvt Ltd
                        </p>
                    </div>
                </main>
            </div>
        </>
    );
}

export default function AIWorkshopSuccess() {
    return (
        <Suspense fallback={
            <div style={{ background: '#0f172a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ color: '#8b5cf6', fontSize: '2rem' }}>⏳</div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
