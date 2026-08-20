"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatEventDateRange } from '@/lib/event-date';

export function EventsGallery({ headings = {} }: { headings?: any }) {
    const [events, setEvents] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'upcoming' | 'concluded'>('upcoming');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data || []);
                }
            } catch (e) {
                console.error("Failed to fetch events", e);
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const upcomingEvents = events.filter(e => !e.is_past);
    const concludedEvents = events.filter(e => e.is_past);

    const displayEvents = activeTab === 'upcoming' ? upcomingEvents : concludedEvents;

    return (
        <section className="card-section py-16 md:py-24 bg-bg-main relative" id="events-gallery">
            <div className="max-w-7xl mx-auto px-6 mb-12 text-center md:text-left">
                <h2 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-8" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Events Gallery' }} />
                
                {/* Tabs */}
                <div className="flex items-center justify-center md:justify-start gap-4 mb-8 border-b border-functional-border pb-4">
                    <button 
                        onClick={() => setActiveTab('upcoming')}
                        className={`text-lg md:text-xl font-bold transition-colors pb-2 relative ${activeTab === 'upcoming' ? 'text-[#A855F7]' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Upcoming
                        {activeTab === 'upcoming' && <div className="absolute -bottom-[17px] left-0 w-full h-1 bg-[#A855F7] rounded-full"></div>}
                    </button>
                    <button 
                        onClick={() => setActiveTab('concluded')}
                        className={`text-lg md:text-xl font-bold transition-colors pb-2 relative ${activeTab === 'concluded' ? 'text-[#A855F7]' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        Concluded
                        {activeTab === 'concluded' && <div className="absolute -bottom-[17px] left-0 w-full h-1 bg-[#A855F7] rounded-full"></div>}
                    </button>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto px-6">
                {loading ? (
                    <div className="h-64 flex items-center justify-center">
                        <span className="text-text-secondary animate-pulse">Loading events...</span>
                    </div>
                ) : displayEvents.length === 0 ? (
                    <div className="h-64 flex items-center justify-center bg-bg-surface border border-functional-border rounded-3xl">
                        <span className="text-text-secondary font-medium">
                            {activeTab === 'upcoming' ? 'New events announcing soon!' : 'No past events available yet.'}
                        </span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayEvents.map((event) => {
                            // This card shows the date only — no time. (fullDateStr was
                            // computed here and never rendered, even before the helper.)
                            const dateStr = formatEventDateRange(event.start_date, event.end_date);
                            
                            const isOnline = event.venue?.toLowerCase().includes('online') || !event.venue;
                            const locationStr = isOnline ? "Live Cohort (Online)" : `${event.venue}${event.city ? `, ${event.city}` : ''}`;

                            const CardContent = (
                                <div className={`w-full glass-card rounded-[24px] overflow-hidden border border-functional-border group flex flex-col h-full bg-[#13113B] transition-all duration-300 ${activeTab === 'upcoming' ? 'hover:shadow-[0_8px_40px_rgba(168,85,247,0.15)] cursor-pointer' : ''}`}>
                                    <div className="relative h-56 w-full overflow-hidden bg-white/5 shrink-0 flex items-center justify-center p-2">
                                        <Image 
                                            src={event.banner_url ? encodeURI(event.banner_url) : "/ai-workshop-banner.webp"} 
                                            alt={event.title} 
                                            fill 
                                            className={`object-contain rounded-xl ${activeTab === 'upcoming' ? 'group-hover:scale-105 transition duration-500' : ''}`} 
                                            unoptimized={true}
                                        />
                                        {/* 🔴 THE POSTER IS LEFT ALONE. The title used to sit on top of
                                            it under a darkening scrim, which fought the artwork — worst on
                                            posters that already carry their own title, where the two
                                            collided — and `line-clamp-2` cut long titles mid-word
                                            ("…before hittin…"). Title and scrim both moved off the image;
                                            the title now reads in full below, and the artwork is shown as
                                            designed. Only the small CONCLUDED status chip stays, pinned to
                                            a corner where it covers almost nothing. */}
                                        {activeTab === 'concluded' && (
                                            <span className="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-md font-bold">CONCLUDED</span>
                                        )}
                                    </div>
                                    <div className="p-5 bg-white flex flex-col justify-center items-start grow text-left rounded-b-[24px] gap-2">
                                        <h3 className="text-[#0B1120] font-black text-lg leading-tight tracking-tight text-balance">{event.title}</h3>
                                        <div className="text-gray-600 text-sm font-semibold flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">📍 {locationStr}</span>
                                            <span className="flex items-center gap-1.5 whitespace-nowrap" suppressHydrationWarning>📅 {dateStr}</span>
                                        </div>
                                    </div>
                                </div>
                            );

                            const sanitizeExternalUrl = (url: string) => {
                                if (!url || url === "#") return "#";
                                return /^https?:\/\//i.test(url) ? url : `https://${url}`;
                            };
                            const targetUrl = event.slug ? `/events/${event.slug}` : sanitizeExternalUrl(event.registration_url);
                            const targetAttr = event.slug ? "_self" : "_blank";

                            return activeTab === 'upcoming' ? (
                                <Link key={event.id} href={targetUrl} target={targetAttr} rel={targetAttr === "_blank" ? "noopener noreferrer" : ""} className="block h-full">
                                    {CardContent}
                                </Link>
                            ) : (
                                <div key={event.id} className="block h-full cursor-default">
                                    {CardContent}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </section>
    );
}
