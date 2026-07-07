'use client';

import { useState } from 'react';
import { WorkshopData } from '../../types/cms';

export function DynamicCurriculum({ data }: { data: any }) {
    if (!data) return null;
    
    // Sort by priority_order and filter by visible
    const workshops: WorkshopData[] = (data.workshops || [])
        .filter((ws: WorkshopData) => ws.visible !== false)
        .sort((a: WorkshopData, b: WorkshopData) => (a.priority_order || 0) - (b.priority_order || 0));

    const [open, setOpen] = useState<number>(0);

    return (
        <section className="py-16 md:py-24 relative" id="curriculum">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Workshop Breakdown</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4" />
                    <p className="text-slate-600 text-base md:text-lg font-light max-w-2xl mx-auto">Three battle-tested workshops designed to take you from zero to launch.</p>
                </div>

                <div className="space-y-6">
                    {workshops.map((ws, wi) => (
                        <div key={ws.id || wi} className={`bg-white shadow-xl rounded-2xl md:rounded-3xl border overflow-hidden transition-all duration-500 ${open === wi ? 'border-[#8b5cf6]/40 shadow-[0_0_30px_rgba(139,92,246,0.13)]' : 'border-slate-200 hover:border-slate-200'}`}>
                            {/* Header — clicking anywhere toggles */}
                            <button
                                className="w-full text-left px-6 md:px-10 py-6 md:py-8 flex items-start gap-4 md:gap-6 group"
                                onClick={() => setOpen(open === wi ? -1 : wi)}
                            >
                                <div className="mt-1 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110" style={{ background: `${ws.color || '#8b5cf6'}18`, borderColor: `${ws.color || '#8b5cf6'}35` }}>
                                    <i className={`fa-solid ${ws.icon || 'fa-lightbulb'} text-base md:text-lg`} style={{ color: ws.color || '#8b5cf6' }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-3 mb-2">
                                        <span className="inline-block px-3 py-1 text-xs font-extrabold rounded uppercase tracking-widest text-slate-900 shadow-sm" style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}>{ws.heading || ws.badge}</span>
                                        <span className="text-sm md:text-base font-semibold text-slate-900">{ws.pricing?.date_time_bullets?.[0] || (ws.pricing?.date_time_bullets || []).join(' ')}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-1">{ws.title}</h3>
                                    <p className="text-sm text-slate-600 font-light">by <span className="text-slate-900 font-medium">{ws.mentor}</span> · {ws.duration}</p>
                                    <div 
                                        className="text-xs md:text-sm mt-2 font-medium" 
                                        style={{ color: ws.color || '#8b5cf6' }}
                                        dangerouslySetInnerHTML={{ __html: ws.key_features || '' }}
                                    />

                                    {/* Google Calendar buttons */}
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {(ws.calendarLinks || []).map((cl, ci) => (
                                            <a
                                                key={ci}
                                                href={cl.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ffffff0a] border border-slate-200 text-[11px] md:text-xs text-slate-600 font-medium hover:bg-white/15 hover:border-[#4285F4]/50 hover:text-slate-900 transition-all"
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
                                            className="self-start whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded md:rounded-lg text-xs md:text-sm font-extrabold transition-all duration-200 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-slate-900"
                                            style={open === wi
                                                ? { background: `linear-gradient(135deg, ${ws.color || '#8b5cf6'}cc, ${ws.color || '#8b5cf6'})`, boxShadow: `0 4px 18px ${ws.color || '#8b5cf6'}55` }
                                                : { background: 'linear-gradient(135deg, #8b5cf6, #d946ef)', boxShadow: '0 4px 18px rgba(139,92,246,0.4)' }
                                            }
                                        >
                                            {open === wi
                                                ? <><span>Show Less</span><i className="fa-solid fa-arrow-up text-[9px] md:text-xs" /></>
                                                : <><span>Know More</span><i className="fa-solid fa-arrow-right text-[9px] md:text-xs" /></>}
                                        </button>

                                        {/* Brand watermark */}
                                        <span className="whitespace-nowrap text-sm md:text-base font-black select-none md:text-right" style={{ letterSpacing: '0.08em' }}>
                                            <span className="text-slate-900">THE </span><span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP</span><span className="text-slate-900"> SCHOOL.in</span>
                                        </span>
                                    </div>
                                </div>

                                {/* Chevron — top-right, all screens */}
                                <div className={`shrink-0 mt-2 transition-transform duration-300 ${open === wi ? 'rotate-180' : ''}`}>
                                    <i className="fa-solid fa-chevron-down text-slate-600" />
                                </div>
                            </button>

                            {/* Expanded content */}
                            {open === wi && (
                                <div className="px-6 md:px-10 pb-8 md:pb-10 border-t border-slate-200">
                                    <div className="mt-8 grid md:grid-cols-2 gap-6 lg:gap-10">
                                        {/* Modules */}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                                <i className="fa-solid fa-book-open text-[#8b5cf6]" /> What You&apos;ll Learn
                                            </h4>
                                            <div className="space-y-5">
                                                {(ws.detail_bullets?.what_youll_learn || []).map((mod, mi) => (
                                                    <div key={mi} className="relative pl-4 border-l-2" style={{ borderColor: `${ws.color || '#8b5cf6'}50` }}>
                                                        <div 
                                                            className="text-sm text-slate-600 font-light" 
                                                            dangerouslySetInnerHTML={{ __html: mod }} 
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Deliverables */}
                                        <div>
                                            <h4 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                                <i className="fa-solid fa-gift text-[#d946ef]" /> Your Deliverables
                                            </h4>
                                            <div className="bg-white/5 rounded-xl p-5 border border-slate-200">
                                                <ul className="space-y-3">
                                                    {(ws.detail_bullets?.your_deliverables || []).map((d, di2) => (
                                                        <li key={di2} className="flex items-start gap-3">
                                                            <i className="fa-solid fa-check mt-0.5 text-xs shrink-0" style={{ color: ws.color || '#8b5cf6' }} />
                                                            <span 
                                                                className="text-sm text-slate-600 font-light" 
                                                                dangerouslySetInnerHTML={{ __html: d }}
                                                            />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Google Calendar links moved to header */}


                                            <a href="#pricing" className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-slate-900 transition-all hover:opacity-90" style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}>
                                                {ws.cta?.text || 'Book Seat Now'} <i className="fa-solid fa-arrow-right" />
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
