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
        const dateStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        
        return (
            <div key={event.id + keySuffix} className="inline-block w-[300px] md:w-[400px] glass-card rounded-2xl overflow-hidden border border-white/5 group flex-shrink-0">
                <div className="relative h-48 w-full overflow-hidden bg-black/20">
                    {event.banner_url && (
                        <Image 
                            src={encodeURI(event.banner_url)} 
                            alt={event.title} 
                            fill 
                            className="object-cover group-hover:scale-105 transition duration-500" 
                            unoptimized={true}
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] uppercase tracking-widest px-2 py-1 rounded-md mb-2 inline-block">Concluded</span>
                        <h3 className="text-white font-bold text-lg whitespace-normal leading-tight">{event.title}</h3>
                    </div>
                </div>
                <div className="p-4 bg-bg-surface flex justify-between items-center">
                    <div className="text-text-secondary text-sm flex gap-3">
                        <span>📍 {event.city}</span>
                        <span>📅 {dateStr}</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="mb-32 overflow-hidden w-full bg-bg-main py-10 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Past Workshops</h2>
                <p className="text-text-secondary mt-1">Glimpses of our previous sessions</p>
            </div>
            
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee flex whitespace-nowrap space-x-6 px-4 hover:![animation-play-state:paused]">
                    {pastEvents.map((event: any) => renderCard(event, ''))}
                    {/* Duplicate for infinite loop effect */}
                    {pastEvents.map((event: any) => renderCard(event, 'dup'))}
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
