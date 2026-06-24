import React from 'react';

async function getPinnedEvent() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/pinned`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function WorkshopPreview() {
    const event = await getPinnedEvent();
    
    if (!event) return null;

    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const dateStr = start.getTime() === end.getTime() 
        ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;

    return (
        <a 
            href={`/events/${event.slug}`} 
            className="block w-full max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(139,92,246,0.15)] hover:shadow-[0_0_120px_rgba(168,85,247,0.25)] bg-[#0B0F19] transition-all duration-700 hover:scale-[1.02] cursor-pointer group relative isolate mt-10"
        >
            <div className="flex flex-col md:flex-row w-full h-full">
                {/* Text Content Column */}
                <div className="w-full md:w-1/2 px-8 py-12 md:px-16 md:py-20 flex flex-col justify-center relative z-10 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-medium mb-6 w-fit">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></span>
                        <span className="text-gray-300">Live Event • {dateStr} • {event.venue}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-tight leading-tight text-white">
                        {event.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm md:text-base lg:text-lg font-light mb-10 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="relative inline-block group/btn w-fit">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-lg blur opacity-40 group-hover/btn:opacity-75 transition duration-500"></div>
                        <div className="relative bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                            Secure Your Spot <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                    </div>
                </div>

                {/* Image Column */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative order-1 md:order-2 shrink-0 bg-[#13112E]">
                    {event.banner_url ? (
                        <img 
                            src={encodeURI(event.banner_url)} 
                            alt={event.title} 
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <img 
                            src="/ai-workshop-banner.webp" 
                            alt={event.title} 
                            className="w-full h-full object-cover opacity-50"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-transparent to-[#0B0F19] pointer-events-none"></div>
                </div>
            </div>
        </a>
    );
}
