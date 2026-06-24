"use client";

import { useEffect, useState } from "react";
import { MoveDown, BookOpen, Users, Wrench } from "lucide-react";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

const HERO_IMAGES = [
    '/images/hero-bg/slide-2.webp',
    '/images/hero-bg/slide-3.webp',
    '/images/hero-bg/slide-4.webp',
    '/images/hero-bg/slide-6.webp',
    '/images/hero-bg/slide-7.webp',
];

/* ── Compact Apply Now Form ─────────────────────────────────────────────── */
function HeroApplyForm() {
    const [form, setForm] = useState({ name: '', city: '', email: '', phone: '' });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const body = `Name: ${form.name}%0ACity: ${form.city}%0AEmail: ${form.email}%0APhone: ${form.phone}`;
        window.open(`mailto:info@thestartupschool.in?subject=Apply Now - Setu - TheStartupSchool&body=${body}`, '_blank');
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 4000);
    };

    if (submitted) {
        return (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
                <div className="text-4xl">🎉</div>
                <p className="text-green-400 font-bold text-lg">We'll be in touch soon!</p>
                <p className="text-text-secondary text-sm">Check your email for confirmation.</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
                <input
                    name="name" value={form.name} onChange={handleChange} required
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b5cf6] transition"
                />
                <input
                    name="city" value={form.city} onChange={handleChange}
                    placeholder="City (e.g. Mumbai)"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b5cf6] transition"
                />
            </div>
            <input
                name="email" type="email" value={form.email} onChange={handleChange} required
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b5cf6] transition"
            />
            <input
                name="phone" value={form.phone} onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#8b5cf6] transition"
            />
            <button
                type="submit"
                className="w-full py-3.5 rounded-xl font-bold text-white text-base transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]"
                style={{ background: 'linear-gradient(to right, #8b5cf6, #d946ef)' }}
            >
                Submit →
            </button>
            <p className="text-center text-white/30 text-xs">We respect your privacy. No spam, only fire. 🔥</p>
        </form>
    );
}

export function AutomatedVideoPromo({ data, slides }: { data?: any, slides?: any[] }) {
    const heroImages = slides && slides.length > 0 ? slides.map(s => encodeURI(s.image_url)) : HERO_IMAGES;
    const heroRotationMs = (data?.hero_rotation_seconds || 4) * 1000;
    const [currentScene, setCurrentScene] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const totalScenes = 4;
    const sceneDurationMs = 3500;

    const [currentBg, setCurrentBg] = useState(0);

    useEffect(() => {
        const syncInterval = setInterval(() => {
            setIsFadingOut(true);
            setTimeout(() => {
                setCurrentScene((prev) => (prev + 1) % totalScenes);
                setCurrentBg((prev) => (prev + 1) % heroImages.length);
                setIsFadingOut(false);
            }, 500);
        }, heroRotationMs);

        return () => {
            clearInterval(syncInterval);
        };
    }, [heroImages.length, heroRotationMs, totalScenes]);

    return (
        <section className="relative w-full min-h-[100svh] flex flex-col justify-center overflow-hidden bg-[#0A0F1C]">
            {/* Background Images Slider - Pre-fetching Transition Logic */}
            {heroImages.map((src, index) => {
                const isCurrent = index === currentBg;
                const isNext = index === (currentBg + 1) % heroImages.length;
                
                // Only keep the current and next images to minimize DOM weight
                if (!isCurrent && !isNext) return null;

                return (
                    <div
                        key={src}
                        className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out ${isCurrent ? 'opacity-40' : 'opacity-0'}`}
                    >
                        <Image
                            src={src}
                            alt="Hero Background"
                            fill
                            className="object-cover object-center md:object-top lg:object-center"
                            priority={index === 0 || index === 1}
                            fetchPriority={index === 0 ? "high" : "auto"}
                            quality={50}
                            sizes="100vw"
                            unoptimized={true}
                        />
                    </div>
                );
            })}


            {/* Dark/Gradient Overlays for readability and blending */}
            <div className="absolute inset-0 z-0 bg-bg-main/60"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-t from-bg-main via-transparent to-transparent"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-bg-main/80 via-transparent to-transparent"></div>

            {/* Extremely Subtle Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center justify-center text-center h-full min-h-[500px]">
                <div className={`transition-opacity duration-500 ease-in-out w-full flex flex-col items-center justify-center ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}>

                    {/* Scene 1: The Hook */}
                    {currentScene === 0 && (
                        <div className="flex flex-col items-center animate-in fade-in zoom-in duration-700">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-[-0.04em] text-white leading-[1.1] md:leading-[0.9] mb-4 md:mb-8 whitespace-pre-line">
                                {data?.hero_heading ? data.hero_heading : <>Stop <span className="text-white/40">Ideating.</span><br />Start <span className="gradient-text">Building.</span></>}
                            </h1>
                            <p className="text-xl md:text-3xl font-light text-text-secondary max-w-3xl mx-auto tracking-tight leading-relaxed whitespace-pre-line">
                                {data?.hero_tagline || "Join the alternate B-school for Aspiring Founders."}
                            </p>
                        </div>
                    )}

                    {/* Scene 2: The Problem */}
                    {currentScene === 1 && (
                        <div className="flex flex-col items-center max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-accent-blue text-sm font-bold tracking-[0.2em] uppercase mb-4">The Bridge</div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-4 md:mb-8 leading-tight text-center whitespace-pre-line">
                                {data?.hero_scene1_heading ? data.hero_scene1_heading : <>The 0 &rarr; 1 Bridge <br />
                                <span className="text-white/40">Where Founders Are Built.</span></>}
                            </h2>
                            <p className="text-xl md:text-2xl text-text-secondary font-light text-center whitespace-pre-line">
                                {data?.hero_scene1_tagline || "We close 4 deadly gaps: Learning, Access, Mentoring, Community"}
                            </p>
                        </div>
                    )}

                    {/* Scene 3: The Solution */}
                    {currentScene === 2 && (
                        <div className="flex flex-col items-center max-w-4xl mx-auto px-4 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="text-accent-violet text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4 text-center">The Roadmap</div>
                            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight mb-6 md:mb-10 leading-snug md:leading-tight text-center whitespace-pre-line">
                                {data?.hero_scene2_heading ? data.hero_scene2_heading : <>3 days of ignition sprint <br />
                                <span className="text-white/40 text-lg md:text-3xl block my-2 md:my-5">to</span>
                                <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">100 days of Deep Dive Immersion cohorts</span></>}
                            </h2>
                            <p className="text-xl md:text-2xl text-text-secondary font-light italic whitespace-pre-line">
                                {data?.hero_scene2_tagline || "Choose the program that fits you the best"}
                            </p>
                        </div>
                    )}

                    {/* Scene 4: The Hub / Scroll */}
                    {currentScene === 3 && (
                        <div className="flex flex-col items-center w-full animate-in fade-in zoom-in duration-700">
                            <span className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-text-secondary text-xs uppercase tracking-[0.2em] font-medium backdrop-blur-md mb-12">
                                Your Next-Gen Startup Ecosystem
                            </span>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl mb-16 px-2 md:px-4">
                                <div className="glass-card flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-bg-main/40 backdrop-blur-md hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-3 md:mb-5 text-accent-blue">
                                        <BookOpen size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <h4 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl text-center leading-tight">Learn Frameworks</h4>
                                </div>

                                <div className="glass-card flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-accent-violet/30 bg-accent-violet/5 backdrop-blur-md shadow-[0_0_30px_rgba(168,85,247,0.1)] hover:bg-accent-violet/10 transition-colors">
                                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-accent-violet/20 border border-accent-violet/20 flex items-center justify-center mb-3 md:mb-5 text-accent-violet">
                                        <Users size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <h4 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl text-center leading-tight">Find Mentors</h4>
                                </div>

                                <div className="glass-card flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-bg-main/40 backdrop-blur-md hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-3 md:mb-5 text-amber-400">
                                        <Wrench size={20} className="md:w-6 md:h-6 lg:w-7 lg:h-7" />
                                    </div>
                                    <h4 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl text-center leading-tight">Explore Tools</h4>
                                </div>

                                <div className="glass-card flex flex-col items-center justify-center p-4 md:p-6 lg:p-8 rounded-2xl md:rounded-3xl border border-white/10 bg-bg-main/40 backdrop-blur-md hover:bg-white/5 transition-colors">
                                    <div className="w-10 h-10 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-xl md:rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center mb-3 md:mb-5 text-green-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-blocks md:w-6 md:h-6 lg:w-7 lg:h-7"><rect width="7" height="7" x="14" y="3" rx="1" /><path d="M10 21V8a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-5a1 1 0 0 0-1-1H3" /></svg>
                                    </div>
                                    <h4 className="text-white font-bold text-xs sm:text-sm md:text-lg lg:text-xl text-center leading-tight">Build Together</h4>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-3 animate-bounce mt-4 cursor-pointer" onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}>
                                <span className="text-xs text-text-secondary uppercase tracking-widest font-bold">Scroll Down to Explore</span>
                                <div className="w-8 h-12 rounded-full border border-white/20 flex justify-center p-2 bg-bg-main/20 backdrop-blur-sm">
                                    <MoveDown className="w-4 h-4 text-accent-cyan animate-pulse" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>


        </section>
    );
}
