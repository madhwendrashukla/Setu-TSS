"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar } from 'lucide-react';
export function WorkshopPreview() {
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
                        setEvents([data]); // fallback in case API returns single object
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
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [events.length]);
    
    if (loading) return null;

    if (!events || events.length === 0) {
        return (
            <div className="w-full max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] border border-functional-border bg-bg-surface/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.2)] mt-10 p-12 md:p-20 flex flex-col items-center justify-center text-center isolate">
                <div className="w-16 h-16 rounded-2xl bg-[#A855F7]/10 flex items-center justify-center mb-6 border border-[#A855F7]/20">
                    <Calendar className="w-8 h-8 text-[#A855F7]" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 text-text-primary tracking-tight">New Events Coming Soon</h3>
                <p className="text-text-secondary text-lg max-w-2xl font-medium">We are currently curating our next set of exclusive offline meetups and workshops for founders. Stay tuned!</p>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-7xl mx-auto mt-10">
            {events.map((event, index) => {
                const start = new Date(event.start_date);
                const end = new Date(event.end_date);
                const dateStr = start.getTime() === end.getTime() 
                    ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
                
                const timeStr = event.start_time ? (event.end_time ? ` @ ${event.start_time} - ${event.end_time}` : ` @ ${event.start_time}`) : '';
                const fullDateStr = dateStr + timeStr;
                    
                const isOnline = event.venue?.toLowerCase().includes('online') || !event.venue;
                const locationStr = isOnline ? "Online" : `Offline • Venue: ${event.venue}${event.city ? `, ${event.city}` : ''}`;

                const targetUrl = event.slug ? `/events/${event.slug}` : (event.registration_url || "#");
                const targetAttr = event.slug ? "_self" : (event.registration_url ? "_blank" : "_self");

                return (
                    <Link 
                        key={event.id}
                        href={targetUrl} 
                        target={targetAttr}
                        rel={targetAttr === "_blank" ? "noopener noreferrer" : ""} 
                        className={`absolute top-0 left-0 w-full block rounded-[32px] md:rounded-[48px] overflow-hidden border border-functional-border shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.1)] bg-bg-surface cursor-pointer group isolate transition-all duration-1000 ease-in-out ${
                            index === currentIndex ? 'opacity-100 z-10 translate-x-0' : 'opacity-0 z-0 translate-x-8 pointer-events-none'
                        }`}
                    >
                        <div className="flex flex-col md:flex-row w-full h-full">
                            {/* Text Content Column */}
                            <div className="w-full md:w-1/2 px-8 py-12 md:px-16 md:py-20 flex flex-col justify-center relative z-10 order-2 md:order-1">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-functional-border text-[10px] md:text-xs font-bold mb-6 w-fit text-text-primary uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-[#A855F7] animate-pulse"></span>
                                    <span>Live Event • {fullDateStr} • {locationStr}</span>
                                </div>

                                <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight text-text-primary">
                                    {event.title}
                                </h3>
                                
                                <p className="text-text-secondary text-sm md:text-base lg:text-lg font-medium mb-10 leading-relaxed line-clamp-3">
                                    {event.description}
                                </p>

                                <div className="relative inline-block w-fit">
                                    <div className="bg-[#A855F7] text-text-primary px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition duration-300 group-hover:bg-[#9333ea] group-hover:shadow-lg group-hover:-translate-y-0.5">
                                        Know More <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                                    </div>
                                </div>
                            </div>

                            {/* Image Column */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative order-1 md:order-2 shrink-0 bg-gray-50/50 flex items-center justify-center p-4">
                                {event.banner_url ? (
                                    <img 
                                        src={encodeURI(event.banner_url)} 
                                        alt={event.title} 
                                        className="w-full h-full object-contain rounded-xl shadow-sm"
                                    />
                                ) : (
                                    <img 
                                        src="/ai-workshop-banner.webp" 
                                        alt={event.title} 
                                        className="w-full h-full object-contain opacity-60 mix-blend-multiply"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
                            </div>
                        </div>
                    </Link>
                );
            })}
            
            {/* To maintain layout height since elements are absolute */}
            <div className="w-full invisible pointer-events-none">
                <div className="flex flex-col md:flex-row w-full h-full">
                    <div className="w-full h-64 md:hidden shrink-0"></div>
                    <div className="w-full md:w-1/2 px-8 py-12 md:px-16 md:py-20 flex flex-col justify-center">
                        <div className="h-8 mb-6"></div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 leading-tight">Placeholder Text For Height</h3>
                        <p className="text-lg font-medium mb-10 line-clamp-3 leading-relaxed">Description placeholder for multiple lines of text that might take up space</p>
                        <div className="px-8 py-4 h-14"></div>
                    </div>
                </div>
            </div>

            {/* Navigation Dots */}
            {events.length > 1 && (
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
                    {events.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`transition-all duration-300 rounded-full ${
                                idx === currentIndex ? 'w-6 h-2 bg-[#A855F7]' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
