'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CalendarPlus, MapPin, ExternalLink, Filter, Search, Star, Info, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { eventsData, FounderEvent, parseEventStringDates } from '@/lib/data/events';
import { IcsDownloadButton } from '@/components/ecosystem/IcsDownloadButton';


function generateGoogleCalendarUrl(event: FounderEvent) {
    const text = encodeURIComponent(event.eventName);
    const details = encodeURIComponent(`Find out more: ${event.weblink || 'No link provided.'}\n\nDates: ${event.startDate} ${event.month}`);
    const location = encodeURIComponent(`${event.exhibitionCentre}, ${event.location}`);

    const datesInfo = parseEventStringDates(event);
    let datesParam = '';
    if (datesInfo) {
        datesParam = `&dates=${datesInfo.start}/${datesInfo.end}`;
    }

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}${datesParam}`;
}

// Map event names/tags to broad sectors
function getSectorFromEvent(event: FounderEvent): string {
    const name = event.eventName.toLowerCase();

    if (name.includes('tech') || name.includes('ai ') || name.includes('software') || name.includes('data') || name.includes('iot') || name.includes('internet of things') || name.includes('digital') || name.includes('cyber')) return 'Tech & AI';
    if (name.includes('health') || name.includes('medical') || name.includes('pharma') || name.includes('arogya') || name.includes('bio') || name.includes('neuro') || name.includes('radiology')) return 'Healthcare & Lifesciences';
    if (name.includes('auto') || name.includes('motor') || name.includes('ev ') || name.includes('mobility') || name.includes('vehicle')) return 'Automotive & Mobility';
    if (name.includes('startup') || name.includes('fintech') || name.includes('invest') || name.includes('fund') || name.includes('vc') || name.includes('pitch')) return 'Startups & Finance';
    if (name.includes('agri') || name.includes('food') || name.includes('horti') || name.includes('farm') || name.includes('gau')) return 'Agriculture & Food';
    if (name.includes('smart') || name.includes('city') || name.includes('infra') || name.includes('build') || name.includes('construct') || name.includes('real estate')) return 'Infrastructure & Real Estate';
    if (name.includes('manufactur') || name.includes('machine') || name.includes('equip') || name.includes('hardware') || name.includes('tool') || name.includes('plastic') || name.includes('pack') || name.includes('corr') || name.includes('paper') || name.includes('boiler') || name.includes('refractory')) return 'Manufacturing & Materials';
    if (name.includes('retail') || name.includes('fashion') || name.includes('garment') || name.includes('textile') || name.includes('life') || name.includes('wedding') || name.includes('shoe') || name.includes('footwear') || name.includes('sport')) return 'Retail & Lifestyle';
    if (name.includes('travel') || name.includes('tour') || name.includes('hotel') || name.includes('hospitality')) return 'Travel & Hospitality';
    if (name.includes('energy') || name.includes('power') || name.includes('electric') || name.includes('gas') || name.includes('oil')) return 'Energy & Utilities';
    if (name.includes('edu') || name.includes('learn') || name.includes('school')) return 'Education';
    if (name.includes('art') || name.includes('media') || name.includes('content') || name.includes('game') || name.includes('amuse')) return 'Media & Entertainment';

    return 'General B2B';
}

// Basic date parser for formats like "13-15 Mar", "29-Mar", "27 Feb To 1 Mar"
// Defaults to March 2026 if parsing fails so it doesn't break
function parseEventSortDate(event: FounderEvent): Date {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonthIdx = now.getMonth();

    let year = 2026;
    let monthIdx = 2; // Default Mar
    let day = 1;

    const str = `${event.startDate}`.toLowerCase().trim();
    const monthStr = (event.month || '').toLowerCase();

    // Try to extract year (2024-2027)
    const yearMatch = str.match(/\b(202[4567])\b/);
    if (yearMatch) {
        year = parseInt(yearMatch[1], 10);
    }

    // Identify if it's a "TBA-style" event (no specific day)
    const isExplicitTBA = str.includes('tba') || str.includes('tbd') || monthStr === 'tba';
    
    // Check if there's a day mentioned (ignore the year)
    const allNumbers = str.match(/\d+/g) || [];
    const hasSpecificDay = allNumbers.some(n => n !== year.toString() && n.length <= 2);

    if (isExplicitTBA || !hasSpecificDay) {
        // Find month index
        const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
        for (let i = 0; i < monthOrder.length; i++) {
            if (str.includes(monthOrder[i]) || monthStr.includes(monthOrder[i])) {
                monthIdx = i;
                break;
            }
        }

        // If it's the current year and the month has passed, it's a past TBA
        if (year === currentYear && monthIdx < currentMonthIdx) {
            return new Date(year, monthIdx, 1);
        }
        
        // Otherwise, it's a future TBA
        return new Date(2099, monthIdx, 31);
    }

    // Extract day
    const dayMatch = allNumbers.find(n => n !== year.toString() && n.length <= 2);
    if (dayMatch) {
        day = parseInt(dayMatch, 10);
    }

    const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
    for (let i = 0; i < monthOrder.length; i++) {
        if (str.includes(monthOrder[i])) {
            monthIdx = i;
            break;
        }
    }

    if (monthIdx === 2 && !str.includes('mar')) {
        for (let i = 0; i < monthOrder.length; i++) {
            if (monthStr.includes(monthOrder[i])) {
                monthIdx = i;
                break;
            }
        }
    }

    return new Date(year, monthIdx, day);
}

export default function FounderCalendar() {
    const [selectedLocation, setSelectedLocation] = useState<string>('All Locations');
    const [selectedSector, setSelectedSector] = useState<string>('All Sectors');
    const [selectedMonth, setSelectedMonth] = useState<string>('All Months');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [showMustAttendOnly, setShowMustAttendOnly] = useState<boolean>(false);
    const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(false);

    const mappedEvents = useMemo(() => {
        return eventsData.map(ev => ({
            ...ev,
            sector: getSectorFromEvent(ev),
            parsedDate: parseEventSortDate(ev)
        }));
    }, []);

    const uniqueLocations = useMemo(() => {
        const locs = Array.from(new Set(eventsData.map(e => e.location))).filter(Boolean).sort();
        return ['All Locations', ...locs];
    }, []);

    const uniqueSectors = useMemo(() => {
        const secs = Array.from(new Set(mappedEvents.map(e => e.sector))).filter(Boolean).sort();
        return ['All Sectors', ...secs];
    }, [mappedEvents]);

    const uniqueMonths = useMemo(() => {
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const months = Array.from(new Set(eventsData.map(e => e.month))).filter(m => monthOrder.includes(m as string));
        const sortedMonths = months.sort((a, b) => monthOrder.indexOf(a as string) - monthOrder.indexOf(b as string));
        return ['All Months', ...sortedMonths];
    }, []);

    const filteredAndSortedEvents = useMemo(() => {
        // 1. Filter
        let filtered = mappedEvents;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonthIdx = now.getMonth(); // 0-indexed

        const monthOrder = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

        // Remove truly stale events (from years before the current year)
        filtered = filtered.filter(e => {
            const evYear = e.parsedDate.getFullYear();
            const evMonth = e.parsedDate.getMonth();
            const isTBA = evYear === 2099;

            if (isTBA) {
                const str = `${e.startDate}`.toLowerCase();
                const yearMatch = str.match(/\b(202\d)\b/);
                const tbaYear = yearMatch ? parseInt(yearMatch[1], 10) : 2026;

                // Keep all events from the current year onwards
                if (tbaYear < currentYear) return false;
            } else {
                // If it's a dated event from a past year, remove it
                if (evYear < currentYear) return false;
            }
            return true;
        });
        
        if (selectedLocation !== 'All Locations') {
            filtered = filtered.filter(e => e.location === selectedLocation);
        }
        if (selectedSector !== 'All Sectors') {
            filtered = filtered.filter(e => e.sector === selectedSector);
        }
        if (selectedMonth !== 'All Months') {
            filtered = filtered.filter(e => (e.month || '').toLowerCase() === selectedMonth.toLowerCase());
        }
        if (showMustAttendOnly) {
            filtered = filtered.filter(e => e.priority?.toLowerCase().includes('must attend'));
        }
        if (searchQuery.trim()) {
            const queries = searchQuery.toLowerCase().split(/\s+/).filter(Boolean);
            filtered = filtered.filter(e => {
                const combinedText = `${e.eventName} ${e.location} ${e.sector} ${e.description} ${e.exhibitionCentre} ${e.tag}`.toLowerCase();
                return queries.every(q => combinedText.includes(q));
            });
        }
        // 2. Sort by date proximity
        const nowTime = now.getTime();
        const todayTime = new Date(currentYear, currentMonthIdx, now.getDate()).getTime();
        
        // Identify TBA events (year 2099)
        const tbaThreshold = new Date(2098, 0, 1).getTime();
        
        // "Upcoming" includes everything from today onwards
        const allUpcoming = filtered.filter(e => e.parsedDate.getTime() >= todayTime);
        
        const upcomingDated = allUpcoming
            .filter(e => e.parsedDate.getTime() < tbaThreshold)
            .sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime());
            
        const upcomingTBA = allUpcoming
            .filter(e => e.parsedDate.getTime() >= tbaThreshold)
            .sort((a, b) => a.eventName.localeCompare(b.eventName));

        // "Past" is strictly earlier than today
        const past = filtered.filter(e => e.parsedDate.getTime() < todayTime)
            .sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());

        return { upcoming: [...upcomingDated, ...upcomingTBA], past };
    }, [mappedEvents, selectedLocation, selectedSector, selectedMonth, searchQuery, showMustAttendOnly]);

    const EventCard = ({ event, isPast: isPastProp }: { event: any, isPast?: boolean }) => {
        const isMustAttend = event.priority?.toLowerCase().includes('must attend');
        const now = new Date();
        const todayTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        // An event is past if it's explicitly marked OR if its date is before today and it's not a future TBA (2099)
        const isActuallyPast = isPastProp || (event.parsedDate && event.parsedDate.getTime() < todayTime && event.parsedDate.getFullYear() !== 2099);
        
        // Select an icon dynamically based on the sector, fallback to Leaf to match screenshot aesthetic
        let SectorIcon = (LucideIcons as any).Leaf;
        const sec = event.sector.toLowerCase();
        if (sec.includes('tech') || sec.includes('software')) SectorIcon = (LucideIcons as any).Cpu;
        else if (sec.includes('health')) SectorIcon = (LucideIcons as any).HeartPulse;
        else if (sec.includes('auto')) SectorIcon = (LucideIcons as any).Car;
        else if (sec.includes('startup') || sec.includes('finance')) SectorIcon = (LucideIcons as any).TrendingUp;
        else if (sec.includes('construct') || sec.includes('infra')) SectorIcon = (LucideIcons as any).Building2;
        
        let dateString = `${event.startDate}${String(event.startDate).includes(event.month) ? '' : ` ${event.month}`}`;
        if (!dateString.includes('2026') && event.parsedDate.getFullYear() !== 2099) {
            dateString += ' 2026';
        }
        if (event.parsedDate.getFullYear() === 2099) {
            dateString = 'Dates TBA';
        }

        return (
            <div className={`bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all group flex flex-col ${isActuallyPast ? 'opacity-60 saturate-50' : ''}`}>
                {/* Top Section */}
                <div className="flex justify-between items-start mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-violet-50 flex items-center justify-center text-[#4B0082] shrink-0 border border-violet-100/50">
                            <SectorIcon size={22} strokeWidth={1.5} />
                        </div>
                        <span className="text-gray-600 text-[10px] font-bold tracking-widest uppercase max-w-[100px] leading-tight">{event.sector}</span>
                    </div>
                    
                    <div className="bg-violet-50 text-[#4B0082] text-xs font-bold px-3 py-1.5 rounded-2xl flex flex-col items-end border border-violet-100/50 max-w-[120px] text-right">
                        {dateString}
                        {event.location && event.location !== 'TBA' && (
                             <span className="font-normal text-[10px] text-violet-500 opacity-90 truncate w-full mt-0.5">{event.location}</span>
                        )}
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-6"></div>

                {/* Middle Section */}
                <div className="flex-1 mb-6 flex flex-col">
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-[#4B0082] shrink-0 mt-1" strokeWidth={1.5} />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-2">{event.eventName}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                                {event.description || event.exhibitionCentre || 'No additional details provided.'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full h-px bg-gray-100 mb-5"></div>

                {/* Bottom Section */}
                <a
                    href={generateGoogleCalendarUrl(event)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-[#4B0082] hover:text-[#3a0066] transition-colors w-full group/btn"
                >
                    <div className="flex items-center gap-2.5 font-bold text-sm">
                        <CalendarPlus size={20} strokeWidth={1.5} />
                        Add to Google Calendar
                    </div>
                    <div className="text-gray-400 group-hover/btn:text-[#4B0082] group-hover/btn:translate-x-1 transition-all">
                        {/* Ensure LucideIcons.ChevronRight is loaded by replacing it with a standard svg if it's not imported. It is not in the imports, so I will use a raw SVG to avoid crashing */}
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                </a>
            </div>
        );
    };

    const hasEvents = filteredAndSortedEvents.upcoming.length > 0 || filteredAndSortedEvents.past.length > 0;

    return (
        <div className="pt-32 pb-20 min-h-screen bg-white relative flex flex-col items-center">
            {/* Extremely Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-100/50 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10 w-full">
                <div className="mb-12">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <Link href="/tools" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium flex items-center gap-2">
                            <span>&larr;</span> Back to Tools
                        </Link>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
                        Founder <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Events Calendar.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-light max-w-3xl leading-relaxed">
                        Never miss a crucial opportunity. We've mapped out the highest-leverage B2B events, exhibitions, and networking hubs for this month.
                        Add them to your calendar so you always know where you need to be.
                    </p>
                </div>

                {/* Filters */}
                <div className="p-4 md:p-6 mb-12 rounded-2xl border border-gray-200 flex flex-col gap-6 bg-white/80 backdrop-blur-md sticky top-24 z-20 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                    <div className="flex flex-col md:flex-row gap-4 items-center w-full">
                        <button 
                            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                            className="flex items-center gap-2.5 text-gray-500 hover:text-violet-600 transition-colors hidden md:flex min-w-fit outline-none group"
                        >
                            <Filter className="w-5 h-5 text-violet-600" />
                            <span className="font-bold uppercase tracking-widest text-xs">Search & Filter</span>
                            <LucideIcons.ChevronDown className={`w-4 h-4 transition-transform group-hover:text-violet-600 ${isFiltersOpen ? 'rotate-180' : ''}`} />
                            <div className="h-6 w-px bg-gray-200 mx-2"></div>
                        </button>

                        {/* Search Bar */}
                        <div className="relative w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search events, locations, keywords..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-gray-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-all font-light"
                            />
                            {searchQuery && (
                                <button 
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 hover:text-gray-900 text-gray-400 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>

                        {/* Must Attend Toggle */}
                        <button 
                            onClick={() => setShowMustAttendOnly(!showMustAttendOnly)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all whitespace-nowrap w-full md:w-auto justify-center ${showMustAttendOnly ? 'bg-red-50 border-red-200 text-red-500' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'}`}
                        >
                            <Star className={`w-4 h-4 ${showMustAttendOnly ? 'fill-current' : ''}`} />
                            <span className="text-xs font-bold uppercase tracking-widest">Must Attend</span>
                        </button>
                    </div>

                    {isFiltersOpen && (
                        <div className="flex flex-col md:flex-row gap-4 w-full pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                            <div className="flex-1 w-full">
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block px-1">Location</label>
                                <select
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-all font-light appearance-none cursor-pointer"
                                >
                                    {uniqueLocations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block px-1">Sector</label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => setSelectedSector(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-all font-light appearance-none cursor-pointer"
                                >
                                    {uniqueSectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
                                </select>
                            </div>
                            <div className="flex-1 w-full">
                                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block px-1">Month</label>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-violet-400 focus:bg-white transition-all font-light appearance-none cursor-pointer"
                                >
                                    {uniqueMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                </select>
                            </div>
                        </div>
                    )}
                </div>

                {!hasEvents && (
                    <div className="text-center py-20 border border-dashed border-gray-200 rounded-3xl bg-gray-50">
                        <h3 className="text-2xl text-gray-900 font-bold mb-2">No events found</h3>
                        <p className="text-gray-500 font-light">Try adjusting your filters to see more results.</p>
                        <button
                            onClick={() => { setSelectedLocation('All Locations'); setSelectedSector('All Sectors'); setSelectedMonth('All Months'); setSearchQuery(''); setShowMustAttendOnly(false); }}
                            className="mt-6 text-violet-600 font-bold tracking-widest uppercase text-sm px-6 py-2 border border-violet-200 rounded-full hover:bg-violet-50 transition-colors"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}

                {hasEvents && (
                    <div className="flex flex-col gap-16">
                        {/* Upcoming Events */}
                        {filteredAndSortedEvents.upcoming.length > 0 && (
                            <div>
                                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                                    <h2 className="text-3xl font-black text-gray-900 flex items-center gap-4">
                                        Upcoming Events
                                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-medium">{filteredAndSortedEvents.upcoming.length}</span>
                                    </h2>
                                    {selectedMonth === 'All Months' && (
                                        <p className="text-gray-400 text-sm font-light">Sorted by date proximity</p>
                                    )}
                                </div>

                                {selectedMonth === 'All Months' ? (
                                    <div className="space-y-16">
                                        {(() => {
                                            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                                            const now = new Date();
                                            const currentMonthIdx = now.getMonth();
                                            
                                            // Start grouping from the current month for a better logical flow
                                            const dynamicMonthOrder = [
                                                ...monthNames.slice(currentMonthIdx),
                                                ...monthNames.slice(0, currentMonthIdx),
                                                "TBA"
                                            ];

                                            const grouped = filteredAndSortedEvents.upcoming.reduce((acc, event) => {
                                                const m = event.month || 'TBA';
                                                if (!acc[m]) acc[m] = [];
                                                acc[m].push(event);
                                                return acc;
                                            }, {} as Record<string, typeof filteredAndSortedEvents.upcoming>);

                                            return dynamicMonthOrder
                                                .filter(m => grouped[m] && grouped[m].length > 0)
                                                .map(m => (
                                                    <div key={m}>
                                                        <div className="flex items-center gap-4 mb-8">
                                                            <div className="h-px flex-1 bg-gray-200"></div>
                                                            <h3 className="text-xl font-bold text-[#4B0082] uppercase tracking-[0.3em] px-4">
                                                                {m === 'TBA' ? 'Dates To Be Announced' : `${m} 2026`}
                                                            </h3>
                                                            <div className="h-px flex-1 bg-gray-200"></div>
                                                        </div>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                            {grouped[m].map((event, idx) => (
                                                                <EventCard key={`up-${m}-${idx}`} event={event as any} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                ));
                                        })()}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredAndSortedEvents.upcoming.map((event, idx) => (
                                            <EventCard key={`up-${idx}`} event={event as any} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Past Events */}
                        {filteredAndSortedEvents.past.length > 0 && (
                            <div>
                                <h2 className="text-3xl font-black text-gray-400 mb-6 flex items-center gap-4">
                                    Past Events
                                    <span className="bg-gray-50 border border-gray-200 text-gray-400 text-xs px-3 py-1 rounded-full font-medium">{filteredAndSortedEvents.past.length}</span>
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredAndSortedEvents.past.map((event, idx) => (
                                        <EventCard key={`past-${idx}`} event={event as any} isPast={true} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
