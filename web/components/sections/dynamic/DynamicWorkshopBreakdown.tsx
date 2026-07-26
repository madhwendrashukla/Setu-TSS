"use client";
import React, { useState } from 'react';
import { PageData, WorkshopData } from '@/types/cms';

export function DynamicWorkshopBreakdown({ data, onCheckoutClick }: { data: PageData, onCheckoutClick?: (id: string) => void }) {
    if (!data?.workshops || data.workshops.length === 0) return null;

    // Sort by priority_order
    const sortedWorkshops = [...data.workshops].sort((a, b) => (a.priority_order || 0) - (b.priority_order || 0));

    return (
        <section className="py-16 md:py-24 relative z-10 bg-slate-50" id="workshop-breakdown">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 text-slate-900">Workshop Breakdown</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4"></div>
                    <p className="text-slate-500 text-base md:text-lg font-medium max-w-2xl mx-auto">Three battle-tested workshops designed to take you from zero to launch.</p>
                </div>
                <div className="space-y-6">
                    {sortedWorkshops.map((workshop: WorkshopData, idx: number) => {
                        if (!workshop.visible) return null;
                        
                        // Assign different colors based on index for the icons
                        const colors = [
                            { primary: '#8b5cf6', secondary: '#d946ef', bg: '#8b5cf615', border: '#8b5cf630' },
                            { primary: '#d946ef', secondary: '#8b5cf6', bg: '#d946ef15', border: '#d946ef30' },
                            { primary: '#8b5cf6', secondary: '#d946ef', bg: '#8b5cf615', border: '#8b5cf630' },
                        ];
                        const theme = colors[idx % colors.length];

                        return (
                            <WorkshopBreakdownCard 
                                key={workshop.id || idx} 
                                workshop={workshop} 
                                index={idx}
                                theme={theme}
                                onCheckoutClick={onCheckoutClick}
                                registrations_open={data.registrations_open}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function WorkshopBreakdownCard({ workshop, index, theme, onCheckoutClick, registrations_open }: { workshop: WorkshopData, index: number, theme: any, onCheckoutClick?: (id: string) => void, registrations_open?: boolean }) {
    const [expanded, setExpanded] = useState(true);

    return (
        <div className={`bg-white rounded-2xl md:rounded-3xl border overflow-hidden transition-all duration-500 border-slate-200 hover:border-slate-300 shadow-xl hover:shadow-2xl`}>
            <div onClick={() => setExpanded(!expanded)} className="w-full text-left px-6 md:px-10 py-6 md:py-8 flex items-start gap-4 md:gap-6 group relative cursor-pointer">
                
                <div className="mt-1 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform group-hover:scale-110" style={{ background: theme.bg, borderColor: theme.border }}>
                    <i className={`fas fa-${workshop.icon || 'lightbulb'} text-base md:text-lg`} style={{ color: theme.primary }}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                        {workshop.heading && (
                            <span className="inline-block px-3 py-1 text-[10px] md:text-xs font-extrabold rounded uppercase tracking-widest text-white shadow-sm" style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}>
                                {workshop.heading}
                            </span>
                        )}
                        {(() => {
                            if (workshop.sessions && workshop.sessions.length > 0) {
                                return null; // We render sessions as individual calendar pills below instead
                            }
                            if (workshop.date && workshop.start_time && workshop.end_time) {
                                const dateObj = new Date(workshop.date);
                                const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : workshop.date;
                                const formatTime = (t: string) => {
                                    if (!t || !t.includes(':')) return t;
                                    const [h, m] = t.split(':');
                                    const hNum = parseInt(h);
                                    const ampm = hNum >= 12 ? 'PM' : 'AM';
                                    return `${hNum % 12 || 12}:${m} ${ampm}`;
                                };
                                return (
                                    <span className="text-sm md:text-base font-bold text-slate-700" suppressHydrationWarning>
                                        {dateStr} &bull; {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                                    </span>
                                );
                            }
                            if (workshop.pricing?.date_time_bullets && workshop.pricing.date_time_bullets[0]) {
                                return (
                                    <span className="text-sm md:text-base font-bold text-slate-700">
                                        <span dangerouslySetInnerHTML={{ __html: workshop.pricing.date_time_bullets[0] }} />
                                    </span>
                                );
                            }
                            return null;
                        })()}
                    </div>
                    
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">{workshop.title}</h3>
                    
                    {(workshop.mentor || workshop.duration) && (
                        <p className="text-sm text-slate-500 font-medium mb-1">
                            {workshop.mentor && <>by <span className="text-slate-900 font-bold">{workshop.mentor}</span></>}
                            {workshop.mentor && workshop.duration && ' · '}
                            {workshop.duration && <>{workshop.duration}</>}
                        </p>
                    )}
                    
                    {workshop.key_features && (
                        <div 
                            className="text-xs md:text-sm mt-2 font-medium text-slate-600"
                            dangerouslySetInnerHTML={{ __html: workshop.key_features }}
                        />
                    )}

                    {/* Google Calendar Link Logic */}
                    {(() => {
                        const sessions = workshop.sessions || [];
                        const oldHasDateAndTime = workshop.date && workshop.start_time && workshop.end_time;
                        
                        if (sessions.length > 0) {
                            return (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {sessions.map((session: any, sIdx: number) => {
                                        let calendarUrl = '#';
                                        try {
                                            const startIstStr = `${session.date}T${session.start_time}:00+05:30`;
                                            const endIstStr = `${session.date}T${session.end_time}:00+05:30`;
                                            const startDate = new Date(startIstStr);
                                            const endDate = new Date(endIstStr);
                                            
                                            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                                                const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
                                                const title = encodeURIComponent(`${workshop.title || "Startup Workshop"} - ${session.title}`);
                                                const details = encodeURIComponent((workshop.key_features || "").replace(/<[^>]*>?/gm, ''));
                                                calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${details}`;
                                            }
                                        } catch (e) {
                                            console.error('Error generating calendar link', e);
                                        }

                                        const formatTime = (t: string) => {
                                            if (!t || !t.includes(':')) return t;
                                            const [h, m] = t.split(':');
                                            const hNum = parseInt(h);
                                            const ampm = hNum >= 12 ? 'PM' : 'AM';
                                            return `${hNum % 12 || 12}:${m} ${ampm}`;
                                        };
                                        const dateObj = new Date(session.date);
                                        const dateStr = !isNaN(dateObj.getTime()) ? dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : session.date;

                                        return (
                                            <a key={sIdx} href={calendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] md:text-xs text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer" suppressHydrationWarning>
                                                <i className="fa-brands fa-google text-blue-500"></i> {session.title} — {dateStr}, {formatTime(session.start_time)} — {formatTime(session.end_time)}
                                            </a>
                                        );
                                    })}
                                </div>
                            );
                        }

                        let calendarUrl = '#';
                        if (oldHasDateAndTime) {
                            try {
                                const startIstStr = `${workshop.date}T${workshop.start_time}:00+05:30`;
                                const endIstStr = `${workshop.date}T${workshop.end_time}:00+05:30`;
                                const startDate = new Date(startIstStr);
                                const endDate = new Date(endIstStr);
                                
                                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                                    const formatGCalDate = (d: Date) => d.toISOString().replace(/-|:|\.\d\d\d/g, '');
                                    const title = encodeURIComponent(workshop.title || "Startup Workshop");
                                    const details = encodeURIComponent((workshop.key_features || "").replace(/<[^>]*>?/gm, ''));
                                    calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatGCalDate(startDate)}/${formatGCalDate(endDate)}&details=${details}`;
                                }
                            } catch (e) {
                                console.error('Error generating calendar link', e);
                            }
                        }

                        if (oldHasDateAndTime && calendarUrl !== '#') {
                            return (
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <a href={calendarUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-[11px] md:text-xs text-slate-600 font-bold hover:bg-slate-200 transition-all cursor-pointer">
                                       <i className="fa-brands fa-google text-blue-500"></i> Add to Google Calendar
                                    </a>
                                </div>
                            );
                        }
                        return null;
                    })()}
                    
                    <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-4">
                        <button onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }} className="self-start whitespace-nowrap inline-flex items-center gap-1.5 px-4 py-2 md:px-5 md:py-2.5 rounded md:rounded-lg text-xs md:text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95 text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm cursor-pointer relative z-20">
                            <span>{expanded ? "Show Less" : "Know More"}</span>
                            <i className={`fa-solid fa-arrow-${expanded ? 'up' : 'right'} text-[9px] md:text-xs`}></i>
                        </button>
                    </div>
                </div>

                <div className={`shrink-0 mt-2 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
                    <i className="fa-solid fa-chevron-down text-slate-400"></i>
                </div>
            </div>

            {expanded && (
                <div className="px-6 md:px-10 pb-8 md:pb-10 border-t border-slate-100">
                    <div className="mt-8 grid md:grid-cols-2 gap-6 lg:gap-10">
                        {/* Left Column: What you'll learn */}
                        {workshop.detail_bullets?.what_youll_learn && (Array.isArray(workshop.detail_bullets.what_youll_learn) ? workshop.detail_bullets.what_youll_learn.length > 0 : workshop.detail_bullets.what_youll_learn.trim() !== '') && (
                            <div>
                                <h4 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <i className="fa-solid fa-book-open text-[#8b5cf6]"></i> What You'll Learn
                                </h4>
                                
                                {Array.isArray(workshop.detail_bullets.what_youll_learn) ? (
                                    <div className="space-y-5">
                                        <div className="relative pl-4 border-l-2 border-slate-200">
                                            <ul className="space-y-3">
                                                {workshop.detail_bullets.what_youll_learn.map((item: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                                                        <i className="fa-solid fa-circle-dot mt-1.5 shrink-0 text-[8px]" style={{ color: theme.primary }}></i>
                                                        <span dangerouslySetInnerHTML={{ __html: item }} />
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="relative pl-4 border-l-2 border-slate-200">
                                        <div 
                                            className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-slate-600 [&_li]:font-medium [&_li]:marker:text-[var(--marker-color)] text-sm"
                                            style={{'--marker-color': theme.primary} as React.CSSProperties}
                                            dangerouslySetInnerHTML={{ __html: workshop.detail_bullets.what_youll_learn }} 
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Right Column: Your Deliverables */}
                        {workshop.detail_bullets?.your_deliverables && (Array.isArray(workshop.detail_bullets.your_deliverables) ? workshop.detail_bullets.your_deliverables.length > 0 : workshop.detail_bullets.your_deliverables.trim() !== '') && (
                            <div>
                                <h4 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                    <i className="fa-solid fa-gift text-[#d946ef]"></i> Your Deliverables
                                </h4>
                                
                                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                                    {Array.isArray(workshop.detail_bullets.your_deliverables) ? (
                                        <ul className="space-y-3">
                                            {workshop.detail_bullets.your_deliverables.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3">
                                                    <i className="fa-solid fa-check mt-0.5 text-xs shrink-0" style={{ color: theme.primary }}></i>
                                                    <span className="text-sm text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: item }} />
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div 
                                            className="[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-slate-700 [&_li]:font-medium [&_li]:marker:text-[var(--marker-color)] text-sm"
                                            style={{'--marker-color': theme.primary} as React.CSSProperties}
                                            dangerouslySetInnerHTML={{ __html: workshop.detail_bullets.your_deliverables }} 
                                        />
                                    )}
                                </div>
                                
                                {registrations_open !== false ? (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
                                        style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}
                                    >
                                        {workshop.cta?.text || "Book Seat Now for this workshop"} <i className="fa-solid fa-arrow-down"></i>
                                    </button>
                                ) : (
                                    <div className="mt-5 w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold bg-slate-800 text-slate-400 cursor-not-allowed opacity-90">
                                        Registration Closed
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* Fallback button if there's no right column */}
                        {!(workshop.detail_bullets?.your_deliverables && (Array.isArray(workshop.detail_bullets.your_deliverables) ? workshop.detail_bullets.your_deliverables.length > 0 : workshop.detail_bullets.your_deliverables.trim() !== '')) && (
                             <div className="col-span-1 md:col-span-2 mt-4">
                                {registrations_open !== false ? (
                                    <button 
                                        onClick={(e) => { 
                                            e.stopPropagation(); 
                                            document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 shadow-lg hover:shadow-xl"
                                        style={{ background: `linear-gradient(135deg, #8b5cf6, #d946ef)` }}
                                    >
                                        {workshop.cta?.text || "Book Seat Now for this workshop"} <i className="fa-solid fa-arrow-down"></i>
                                    </button>
                                ) : (
                                    <div className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-slate-800 text-slate-400 cursor-not-allowed opacity-90">
                                        Registration Closed
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
