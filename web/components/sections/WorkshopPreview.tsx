"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, MapPin, Clock, Sparkles } from 'lucide-react';
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
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 md:mt-10 mb-12 md:mb-16">
            {/* Optional Section Header if headings are passed */}
            {headings?.title && (
                <div className="text-center mb-8">
                    {headings.tag && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 mb-2">
                            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                            {headings.tag}
                        </span>
                    )}
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                        {headings.title}
                    </h2>
                    {headings.subtitle && (
                        <p className="mt-2 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
                            {headings.subtitle}
                        </p>
                    )}
                </div>
            )}

            <div className="relative w-full">
                {events.map((event, index) => {
                    const fullDateStr = formatEventWhen(event);
                    const isOnline = event.venue?.toLowerCase().includes('online') || !event.venue;
                    const locationLabel = isOnline ? "Online Live" : (event.city ? `${event.city}` : "Offline In-Person");
                    const targetUrl = event.slug ? `/events/${event.slug}` : (event.registration_url || "#");
                    const targetAttr = event.slug ? "_self" : (event.registration_url ? "_blank" : "_self");

                    const isCurrent = index === currentIndex;

                    return (
                        <Link 
                            key={event.id || index}
                            href={targetUrl} 
                            target={targetAttr}
                            rel={targetAttr === "_blank" ? "noopener noreferrer" : ""} 
                            className={`block w-full rounded-3xl md:rounded-[36px] overflow-hidden border border-slate-200/90 bg-white shadow-[0_12px_36px_rgba(15,23,42,0.06)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.12)] transition-all duration-700 ease-in-out group isolate ${
                                isCurrent ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
                            }`}
                        >
                            <div className="flex flex-col lg:flex-row w-full items-stretch">
                                {/* Left Content Column */}
                                <div className="w-full lg:w-7/12 p-6 sm:p-9 md:p-12 lg:p-14 flex flex-col justify-center relative z-10 order-2 lg:order-1">
                                    
                                    {/* Clean Badges Row */}
                                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs">
                                            <span className="w-2 h-2 rounded-full bg-purple-600 shrink-0 animate-pulse"></span>
                                            Featured Event
                                        </span>

                                        {fullDateStr && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80" suppressHydrationWarning>
                                                <Clock className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                                                <span>{fullDateStr}</span>
                                            </span>
                                        )}

                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 border border-slate-200/80">
                                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                            <span>{locationLabel}</span>
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-[1.2] text-slate-900 mb-3.5 group-hover:text-purple-700 transition-colors duration-300">
                                        {event.title}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-slate-600 text-sm sm:text-base md:text-lg font-normal leading-relaxed mb-6 line-clamp-3">
                                        {event.description}
                                    </p>

                                    {/* CTA Button */}
                                    <div className="pt-1">
                                        <div className="inline-flex items-center gap-2.5 px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-sm sm:text-base text-white bg-gradient-to-r from-[#7C3AED] via-[#8B3DFF] to-[#A855F7] shadow-md shadow-purple-500/20 group-hover:shadow-lg group-hover:shadow-purple-500/35 group-hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                                            <span>Know More</span>
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Right Image Banner Column */}
                                <div className="w-full lg:w-5/12 p-4 sm:p-7 md:p-9 flex items-center justify-center bg-gradient-to-br from-purple-50/70 via-slate-50/60 to-indigo-50/40 order-1 lg:order-2 border-b lg:border-b-0 lg:border-l border-slate-100">
                                    <div className="relative w-full aspect-[16/10] max-w-[540px] rounded-2xl overflow-hidden shadow-md border border-slate-200/80 bg-white group-hover:shadow-xl transition-all duration-500 flex items-center justify-center">
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
                    <div className="flex justify-center items-center gap-2 mt-6">
                        {events.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setCurrentIndex(idx);
                                }}
                                className={`transition-all duration-300 rounded-full cursor-pointer ${
                                    idx === currentIndex ? 'w-8 h-2.5 bg-purple-600' : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
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
