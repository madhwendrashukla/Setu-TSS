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
            className="block w-full mx-auto rounded-[32px] md:rounded-[48px] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(139,92,246,0.15)] hover:shadow-[0_0_120px_rgba(168,85,247,0.25)] bg-[#0B0F19] transition-all duration-700 hover:scale-[1.02] cursor-pointer group mt-10 relative isolate"
        >
            {/* Background Grid */}
            <div className="absolute inset-0 pointer-events-none -z-10" 
                 style={{ 
                     backgroundImage: event.banner_url ? `url(${encodeURI(event.banner_url)})` : 'none', 
                     backgroundSize: 'cover', 
                     backgroundPosition: 'center', 
                     opacity: 0.15 
                 }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#13112E]/50 to-transparent opacity-80 pointer-events-none -z-10"></div>
            
            <div className="w-full px-4 md:px-12 py-12 md:py-16 flex flex-col justify-center relative z-10">
                <div className="text-center mb-10 text-white">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-medium mb-6 backdrop-blur-sm">
                        <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-pulse"></span>
                        <span className="text-gray-300">Live Event • {dateStr} • {event.venue}</span>
                    </div>

                    <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 tracking-[-0.02em] leading-tight max-w-4xl mx-auto">
                        {event.title}
                    </h3>
                    
                    <p className="text-gray-400 text-sm md:text-base lg:text-xl font-light max-w-2xl mx-auto mb-12 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="relative inline-block group/btn">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-lg blur opacity-40 group-hover/btn:opacity-75 transition duration-500"></div>
                        <div className="relative bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white px-8 py-4 rounded-lg font-bold flex items-center gap-2 shadow-[0_0_40px_rgba(139,92,246,0.4)]">
                            Secure Your Spot <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                    </div>
                </div>
            </div>
        </a>
    );
}
