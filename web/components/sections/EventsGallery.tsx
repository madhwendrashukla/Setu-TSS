"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export function EventsGallery() {
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
                <h2 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-8">Events Gallery</h2>
                
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
                            const start = new Date(event.start_date);
                            const end = new Date(event.end_date);
                            const dateStr = start.getTime() === end.getTime() 
                                ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                : `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
                            
                            const timeStr = event.start_time ? (event.end_time ? ` @ ${event.start_time} - ${event.end_time}` : ` @ ${event.start_time}`) : '';
                            const fullDateStr = dateStr + timeStr;
                            
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
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#13113B] to-transparent opacity-40"></div>
                                        <div className="absolute bottom-4 left-4 right-4">
                                            {activeTab === 'concluded' && (
                                                <span className="bg-white/10 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block font-bold">CONCLUDED</span>
                                            )}
                                            <h3 className="text-white font-black text-xl whitespace-normal leading-tight line-clamp-2 drop-shadow-md">{event.title}</h3>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-white flex flex-col justify-center items-start grow text-left rounded-b-[24px]">
                                        <div className="text-gray-600 text-sm font-semibold flex items-center gap-4 flex-wrap">
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">📍 {locationStr}</span>
                                            <span className="flex items-center gap-1.5 whitespace-nowrap">📅 {dateStr}</span>
                                        </div>
                                    </div>
                                </div>
                            );

                            return activeTab === 'upcoming' ? (
                                <a key={event.id} href={event.registration_url || "#"} target="_blank" rel="noopener noreferrer" className="block h-full">
                                    {CardContent}
                                </a>
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
