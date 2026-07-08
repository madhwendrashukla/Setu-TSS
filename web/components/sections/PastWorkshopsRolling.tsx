import Link from 'next/link';
import Image from 'next/image';

async function getPastEvents() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/past-rolling`, { cache: 'no-store' });
        if (!res.ok) return [];
        return res.json();
    } catch (e) {
        return [];
    }
}

export const PastWorkshopsRolling = async () => {
    const pastEvents = await getPastEvents();

    if (!pastEvents || pastEvents.length === 0) {
        return null; // Don't render section if there are no past events
    }

    const renderCard = (event: any, keySuffix: string) => {
        const start = new Date(event.start_date);
        const end = event.end_date ? new Date(event.end_date) : start;
        
        const dateStr = start.getTime() === end.getTime() 
            ? start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}–${end.toLocaleDateString('en-US', { day: 'numeric', year: 'numeric' })}`;
            
        const timeStr = event.start_time ? (event.end_time ? ` @ ${event.start_time} - ${event.end_time}` : ` @ ${event.start_time}`) : '';
        const fullDateStr = dateStr + timeStr;
        
        return (
            <div key={event.id + keySuffix} className="inline-block w-[300px] md:w-[400px] glass-card rounded-2xl overflow-hidden border border-functional-border group flex-shrink-0">
                <div className="relative h-48 w-full overflow-hidden bg-white/5 flex items-center justify-center p-2">
                    <Image 
                        src={event.banner_url ? encodeURI(event.banner_url) : "/ai-workshop-banner.webp"} 
                        alt={event.title} 
                        fill 
                        className="object-contain rounded-xl group-hover:scale-105 transition duration-500" 
                        unoptimized={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13113B] to-transparent opacity-40"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <span className="bg-white/10 backdrop-blur-md text-text-primary text-[10px] uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block">Concluded</span>
                        <h3 className="text-text-primary font-bold text-lg whitespace-normal leading-tight line-clamp-2">{event.title}</h3>
                    </div>
                </div>
                <div className="p-4 bg-bg-surface flex justify-between items-center">
                    <div className="text-text-secondary text-sm flex gap-3 flex-wrap">
                        <span>📍 {event.venue || 'TBA'}</span>
                        <span>📅 {fullDateStr}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="card-section py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <h2 className="text-2xl font-bold text-text-primary tracking-tight">Past Workshops</h2>
                <p className="text-text-secondary mt-1">Glimpses of our previous sessions</p>
            </div>
            
            <div className="relative flex overflow-x-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-main to-transparent z-10 pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-main to-transparent z-10 pointer-events-none"></div>
                <div className="animate-marquee flex whitespace-nowrap space-x-6 px-4 hover:![animation-play-state:paused]">
                    {[...Array(6)].map((_, i) => (
                        <div key={`dup-${i}`} className="flex space-x-6">
                            {pastEvents.map((event: any) => renderCard(event, `dup-${i}`))}
                        </div>
                    ))}
                </div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 30s linear infinite;
                }
            `}} />
        </section>
    );
};
