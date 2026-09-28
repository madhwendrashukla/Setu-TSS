"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock, Sparkles } from 'lucide-react';
import { formatEventWhen } from '@/lib/event-date';

interface WorkshopPreviewProps {
    headings?: {
        tag?: string;
        title?: string;
        subtitle?: string;
    };
}

export function WorkshopPreview({ headings }: WorkshopPreviewProps) {
    const [events, setEvents] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/events/pinned?_t=${Date.now()}`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setEvents(data);
                    } else if (data) {
                        setEvents([data]);
                    }
                }
            } catch (e) {
                console.error("Failed to fetch pinned events", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    useEffect(() => {
        if (events.length > 1) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % events.length);
            }, 7000);
            return () => clearInterval(timer);
        }
    }, [events.length]);
    
    if (loading) return null;

    if (!events || events.length === 0) {
        return null;
    }

    return (
        <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-4 md:mt-8 mb-10 md:mb-14">
            {/* Optional Section Header if headings are passed */}
            {headings?.title && (
                <div className="text-center mb-6">
                    {headings.tag && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            {headings.tag}
                        </span>
                    )}
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {headings.title}
                    </h2>
                    {headings.subtitle && (
                        <p className="mt-1.5 text-sm md:text-base text-slate-600 max-w-xl mx-auto">
                            {headings.subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="relative w-full">
                {events.map((event, index) => {
                    const fullDateStr = formatEventWhen(event);
                    const isOnline = event.venue?.toLowerCase().includes('online') || !event.venue;
                    const locationLabel = isOnline 
                        ? "Online Live" 
                        : (event.city ? event.city : (event.venue || "Offline"));
                        
                    const targetUrl = event.slug ? `/events/${event.slug}` : (event.registration_url || "#");
                    const targetAttr = event.slug ? "_self" : (event.registration_url ? "_blank" : "_self");

                    const isCurrent = index === currentIndex;

                    return (
                        <Link 
                            key={event.id || index}
                            href={targetUrl} 
                            target={targetAttr}
                            rel={targetAttr === "_blank" ? "noopener noreferrer" : ""} 
                            className={`block w-full rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200/90 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_rgba(124,58,237,0.12)] transition-all duration-500 ease-in-out group isolate ${
                                isCurrent ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row w-full items-stretch">
                                {/* Left Content Column */}
                                <div className="w-full lg:w-7/12 p-5 sm:p-7 md:p-8 flex flex-col justify-center relative z-10 order-2 lg:order-1">
                                    
                                    {/* Clean Badges Row (No Featured Event Tag) */}
                                    <div className="flex flex-wrap items-center gap-2 mb-3.5">
                                        {fullDateStr && (
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80" suppressHydrationWarning>
                                                <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                                <span>{fullDateStr}</span>
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80">
                                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                            <span>{locationLabel}</span>
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-xl sm:text-2xl md:text-[26px] font-black tracking-tight leading-snug text-slate-900 mb-2.5 group-hover:text-purple-700 transition-colors duration-300">
                                        {event.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-slate-600 text-xs sm:text-sm md:text-[15px] font-normal leading-relaxed mb-5 line-clamp-2">
                                        {event.description}
                                    </p>

                                    {/* CTA Button */}
                                    <div>
                                        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-[#7C3AED] via-[#8B3DFF] to-[#A855F7] shadow-md shadow-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/35 group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                            <span>Know More</span>
                                            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Image Banner Column */}
                                <div className="w-full lg:w-5/12 p-3 sm:p-5 md:p-6 flex items-center justify-center bg-gradient-to-br from-purple-50/50 via-slate-50/40 to-indigo-50/30 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-slate-100">
                                    <div className="relative w-full aspect-[16/10] max-w-[420px] rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-200/80 bg-white group-hover:shadow-md transition-all duration-500 flex items-center justify-center">
                                        {event.banner_url ? (
                                            <img 
                                                src={encodeURI(event.banner_url)} 
                                                alt={event.title} 
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                            />
                                        ) : (
                                            <img 
                                                src="/ai-workshop-banner.webp" 
                                                alt={event.title} 
                                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}

                {/* Pagination Dots (if multiple pinned events) */}
                {events.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {events.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentIndex(idx);
                                }}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    idx === currentIndex ? 'w-7 h-2 bg-purple-600' : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
