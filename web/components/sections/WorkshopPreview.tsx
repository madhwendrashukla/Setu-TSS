import React from 'react';
import { Calendar } from 'lucide-react';

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
    
    if (!event) {
        return (
            <div className="w-full max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] border border-black/5 bg-white/70 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] mt-10 p-12 md:p-20 flex flex-col items-center justify-center text-center isolate">
                <div className="w-16 h-16 rounded-2xl bg-accent-violet/10 flex items-center justify-center mb-6 border border-accent-violet/20">
                    <Calendar className="w-8 h-8 text-accent-violet" />
                </div>
                <h3 className="text-3xl md:text-5xl font-black mb-4 text-black tracking-tight">New Events Coming Soon</h3>
                <p className="text-text-secondary text-lg max-w-2xl font-medium">We are currently curating our next set of exclusive offline meetups and workshops for founders. Stay tuned!</p>
            </div>
        );
    }

    const start = new Date(event.start_date);
    const end = new Date(event.end_date);
    const dateStr = start.getTime() === end.getTime() 
        ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;

    return (
        <a 
            href={event.registration_url || "#"} 
            target={event.registration_url ? "_blank" : "_self"}
            rel="noopener noreferrer" 
            className="block w-full max-w-7xl mx-auto rounded-[32px] md:rounded-[48px] overflow-hidden border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] bg-white transition-all duration-700 hover:scale-[1.01] cursor-pointer group relative isolate mt-10"
        >
            <div className="flex flex-col md:flex-row w-full h-full">
                {/* Text Content Column */}
                <div className="w-full md:w-1/2 px-8 py-12 md:px-16 md:py-20 flex flex-col justify-center relative z-10 order-2 md:order-1">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/5 text-[10px] md:text-xs font-bold mb-6 w-fit text-black uppercase tracking-wider">
                        <span className="w-2 h-2 rounded-full bg-[#872DFB] animate-pulse"></span>
                        <span>Live Event • {dateStr} • {event.venue}</span>
                    </div>

                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-black mb-6 tracking-tight leading-tight text-black">
                        {event.title}
                    </h3>
                    
                    <p className="text-text-secondary text-sm md:text-base lg:text-lg font-medium mb-10 leading-relaxed">
                        {event.description}
                    </p>

                    <div className="relative inline-block w-fit">
                        <div className="bg-black text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition duration-300 group-hover:bg-[#1e1e1e] group-hover:shadow-lg group-hover:-translate-y-0.5">
                            Secure Your Spot <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                        </div>
                    </div>
                </div>

                {/* Image Column */}
                <div className="w-full md:w-1/2 h-64 md:h-auto relative order-1 md:order-2 shrink-0 bg-gray-100">
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
                            className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-l from-white/20 to-transparent pointer-events-none"></div>
                </div>
            </div>
        </a>
    );
}
