'use client';

import { useState } from 'react';

const workshops = [
    {
        badge: 'WORKSHOP 1',
        title: 'Startup Ideation & Validation',
        mentor: 'Gaurav Bansal',
        date: 'May 15, 2026 (Friday)  •  6:00 PM – 9:00 PM IST',
        duration: '3 hours',
        icon: 'fa-lightbulb',
        color: '#8b5cf6',
        tagline: 'Find & validate your billion-dollar idea',
        modules: [
            { title: '12 Proven Methods to Generate Billion-Dollar Ideas', points: ['From passion projects to market gaps', 'Learn how Uber, Airbnb & Notion found breakthrough ideas', 'Systematic frameworks to identify opportunities'] },
            { title: 'The Validation Framework', points: ['Stop building products nobody wants', 'Test your idea before writing a single line of code', 'Market sizing and demand validation techniques'] },
            { title: 'From Idea to Action Plan', points: ['Convert rough concepts into executable business models', 'Risk assessment and competitive positioning', 'Build your first business canvas'] },
        ],
        deliverables: ['12-method ideation framework', 'Validated business idea', 'One-page business model canvas', 'Market validation checklist'],
        calendarLinks: [
            {
                label: 'Add to Google Calendar',
                url: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Startup+Ideation+%26+Validation+%E2%80%94+AI+Workshop+Series&dates=20260515T123000Z%2F20260515T153000Z&details=Workshop+1+by+Gaurav+Bansal+%7C+The+Startup+School+%7C+Live+on+Zoom&location=Live+on+Zoom',
            },
        ],
    },
    {
        badge: 'WORKSHOP 2',
        title: 'Mastering AI with Claude Pro for Startups',
        mentor: 'Atul Pandey',
        date: 'May 16 (Saturday, 2 sessions) + May 17 (Sunday, 1 session)',
        duration: '7.5 hours across 3 sessions',
        icon: 'fa-robot',
        color: '#d946ef',
        tagline: 'Build an AI-powered startup — no coding required',
        modules: [
            { title: 'Session 1: Understand & Use Claude Pro', points: ['Claude Pro platform walkthrough & prompt engineering basics', 'Key concepts: tokens, context window (200K), system prompts', 'MCP — connect Claude Pro to Google Drive, Slack, Salesforce', 'Hands-on: set up your workspace & run first business prompt'] },
            { title: 'Session 2: Ideation & Market Research', points: ['Structured brainstorming & idea stress-testing with Claude Pro', 'Market research: sizing markets, identifying trends', 'Customer persona development with AI-assisted research', 'Business model canvas creation, SWOT & risk assessment'] },
            { title: 'Session 3: Prototype Your MVP', points: ['Generate landing pages, pitch decks, mockups, financial models', 'Introduction to Claude Pro Code and "vibe coding"', 'Build functional web apps using natural language', 'GTM plans, email sequences, social media content'] },
        ],
        deliverables: ['Confidence using Claude Pro for business tasks', 'Validated business idea with market analysis', 'Working MVP prototype built during workshop', 'Practical prompt templates and reusable workflows'],
        calendarLinks: [
            {
                label: 'Session 1 — May 16, 10 AM – 12:30 PM',
                url: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mastering+AI+with+Claude+Pro+%E2%80%93+Session+1+%E2%80%94+AI+Workshop+Series&dates=20260516T043000Z%2F20260516T070000Z&details=Workshop+2+Session+1+by+Atul+Pandey+%7C+The+Startup+School+%7C+Live+on+Zoom&location=Live+on+Zoom',
            },
            {
                label: 'Session 2 — May 16, 3 PM – 5:30 PM',
                url: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mastering+AI+with+Claude+Pro+%E2%80%93+Session+2+%E2%80%94+AI+Workshop+Series&dates=20260516T093000Z%2F20260516T120000Z&details=Workshop+2+Session+2+by+Atul+Pandey+%7C+The+Startup+School+%7C+Live+on+Zoom&location=Live+on+Zoom',
            },
            {
                label: 'Session 3 — May 17, 3 PM – 5:30 PM',
                url: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mastering+AI+with+Claude+Pro+%E2%80%93+Session+3+%E2%80%94+AI+Workshop+Series&dates=20260517T093000Z%2F20260517T120000Z&details=Workshop+2+Session+3+by+Atul+Pandey+%7C+The+Startup+School+%7C+Live+on+Zoom&location=Live+on+Zoom',
            },
        ],
    },
    {
        badge: 'WORKSHOP 3',
        title: 'AI Filmmaking & Video Marketing Masterclass',
        mentor: 'Amey Asuti',
        date: 'May 17, 2026 (Sunday)  •  10:00 AM – 12:30 PM IST',
        duration: '2.5–3 hours',
        icon: 'fa-film',
        color: '#8b5cf6',
        tagline: 'Create a professional AI film in one session',
        modules: [
            { title: 'Idea to Story', points: ['Simple storytelling framework: Hook, Build, Payoff', 'Converting raw ideas into 30-60 second scripts', 'Writing for visual-first storytelling'] },
            { title: 'Visual Creation Pipeline', points: ['Prompting for T2I: style, character, environment', 'Image-to-Video (I2V) workflows & motion control (Grok / Kling)', 'Build multi-shot visual sequences'] },
            { title: 'Voice, Sound, Editing & Agentic Layer', points: ['Voice generation (ElevenLabs), background music & sound design', 'Fast editing workflows (Canva / DaVinci)', 'Intro to Remotion for programmatic video at scale'] },
        ],
        deliverables: ['1 complete AI-generated film (30-60 seconds)', 'Script + prompts + all production assets', 'Repeatable workflow to produce content at scale'],
        calendarLinks: [
            {
                label: 'Add to Google Calendar',
                url: 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=AI+Filmmaking+%26+Video+Marketing+%E2%80%94+AI+Workshop+Series&dates=20260517T043000Z%2F20260517T070000Z&details=Workshop+3+by+Amey+Asuti+%7C+The+Startup+School+%7C+Live+on+Zoom&location=Live+on+Zoom',
            },
        ],
    },
];

export function AIWorkshopCurriculum() {
    const [open, setOpen] = useState<number>(0);

    return (
        <section className="py-16 md:py-24 relative" id="curriculum">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Workshop Breakdown</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4" />
                    <p className="text-slate-300 text-base md:text-lg font-light max-w-2xl mx-auto">Three battle-tested workshops designed to take you from zero to launch.</p>
                </div>

                <div className="space-y-6">
                    {workshops.map((ws, wi) => (
                        <div key={wi} className={`bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-2xl md:rounded-3xl border overflow-hidden transition-all duration-500 ${open === wi ? 'border-[#8b5cf6]/40 shadow-[0_0_30px_rgba(139,92,246,0.13)]' : 'border-slate-700/50 hover:border-slate-700/50'}`}>
                            {/* Header — clicking anywhere toggles */}
                            <button
                                className="w-full text-left px-6 md:px-10 py-6 md:py-8 flex items-start gap-4 md:gap-6 group"
                                onClick={() => setOpen(open === wi ? -1 : wi)}
                            >
                                <div className="mt-1 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110" style={{ background: `${ws.color}18`, borderColor: `${ws.color}35` }}>
                                    <i className={`fa-solid ${ws.icon} text-base md:text-lg`} style={{ color: ws.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-extrabold rounded uppercase tracking-widest text-slate-50 shadow-sm" style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}>{ws.badge}</span>
                                        <span className="text-sm md:text-base font-semibold text-slate-50">{ws.date}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-50 mb-1">{ws.title}</h3>
                                    <p className="text-sm text-slate-300 font-light">by <span className="text-slate-50 font-medium">{ws.mentor}</span> · {ws.duration}</p>
                                    <p className="text-xs md:text-sm mt-2 font-medium" style={{ color: ws.color }}>{ws.tagline}</p>

                                    {/* Google Calendar buttons */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {ws.calendarLinks.map((cl, ci) => (
                                            <a
                                                key={ci}
                                                href={cl.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff0a] border border-slate-700/50 text-[11px] md:text-xs text-slate-300 font-medium hover:bg-white/15 hover:border-[#4285F4]/50 hover:text-slate-50 transition-all"
                                            >
                                                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972a6.033 6.033 0 110-12.064c1.498 0 2.866.549 3.921 1.453l2.814-2.814A9.969 9.969 0 0012.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" fill="#4285F4"/>
                                                </svg>
                                                {cl.label}
                                            </a>
                                        ))}
                                    </div>

                                    {/* Know More + brand — stacked on mobile, side-by-side on desktop */}
                                    <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setOpen(open === wi ? -1 : wi); }}
                                            className="self-start whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded md:rounded-lg text-xs md:text-sm font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-slate-50"
                                            style={open === wi
                                                ? { background: `linear-gradient(135deg, ${ws.color}cc, ${ws.color})`, boxShadow: `0 4px 18px ${ws.color}55` }
                                                : { background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', boxShadow: '0 4px 18px rgba(139,92,246,0.4)' }
                                            }
                                        >
                                            {open === wi
                                                ? <><span>Show Less</span><i className="fa-solid fa-arrow-up text-[9px] md:text-xs" /></>
                                                : <><span>Know More</span><i className="fa-solid fa-arrow-right text-[9px] md:text-xs" /></>}
                                        </button>

                                        {/* Brand watermark */}
                                        <span className="whitespace-nowrap text-sm md:text-base font-black select-none md:text-right" style={{ letterSpacing: '0.08em' }}>
                                            <span className="text-slate-50">THE </span><span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP</span><span className="text-slate-50"> SCHOOL.in</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Chevron — top-right, all screens */}
                                <div className={`shrink-0 mt-2 transition-transform duration-300 ${open === wi ? 'rotate-180' : ''}`}>
                                    <i className="fa-solid fa-chevron-down text-slate-300" />
                                </div>
                            </button>

                            {/* Expanded content */}
                            {open === wi && (
                                <div className="px-6 md:px-10 pb-8 md:pb-10 border-t border-slate-700/50">
                                    <div className="mt-8 grid md:grid-cols-2 gap-6 lg:gap-10">
                                        {/* Modules */}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-50 mb-5 flex items-center gap-2">
                                                <i className="fa-solid fa-book-open text-[#8b5cf6]" /> What You&apos;ll Learn
                                            </h4>
                                            <div className="space-y-5">
                                                {ws.modules.map((mod, mi) => (
                                                    <div key={mi} className="relative pl-4 border-l-2" style={{ borderColor: `${ws.color}50` }}>
                                                        <h5 className="text-sm font-bold text-slate-50 mb-2">{mod.title}</h5>
                                                        <ul className="space-y-1.5">
                                                            {mod.points.map((point, pi) => (
                                                                <li key={pi} className="flex items-start gap-2 text-xs text-slate-300 font-light">
                                                                    <i className="fa-solid fa-circle-dot mt-1 shrink-0 text-[8px]" style={{ color: `${ws.color}80` }} />
                                                                    {point}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deliverables */}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-50 mb-5 flex items-center gap-2">
                                                <i className="fa-solid fa-gift text-[#d946ef]" /> Your Deliverables
                                            </h4>
                                            <div className="bg-white/5 rounded-xl p-5 border border-slate-700/50">
                                                <ul className="space-y-3">
                                                    {ws.deliverables.map((d, di2) => (
                                                        <li key={di2} className="flex items-start gap-3">
                                                            <i className="fa-solid fa-check mt-0.5 text-xs shrink-0" style={{ color: ws.color }} />
                                                            <span className="text-sm text-slate-300 font-light">{d}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Google Calendar links moved to header */}


                                            <a href="#pricing" className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-50 transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}>
                                                Book Seat Now for this workshop <i className="fa-solid fa-arrow-right" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
