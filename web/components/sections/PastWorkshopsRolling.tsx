import Link from 'next/link';
import Image from 'next/image';

export const PastWorkshopsRolling = () => {
    // In a real scenario, you'd pass data down from the page component
    // We are mocking the data here for visual demonstration.
    const pastEvents = [
        { id: 1, title: 'Founders Dating', city: 'Mumbai', date: '14th Feb 2026', banner: '/gallery/IMG_0845.JPG' },
        { id: 2, title: 'AI Startup Launchpad', city: 'Online', date: '15th May 2026', banner: '/gallery/IMG_1280.JPG' },
        { id: 3, title: 'Fundraising Masterclass', city: 'Delhi', date: '10th Mar 2026', banner: '/gallery/IMG_1318.JPG' },
        { id: 4, title: 'Growth Hacks', city: 'Bangalore', date: '22nd Jan 2026', banner: '/gallery/IMG_1380.JPG' },
    ];

    return (
        <section className="mb-32 overflow-hidden w-full bg-bg-main py-10 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-6 mb-8">
                <h2 className="text-2xl font-bold text-white tracking-tight">Past Workshops</h2>
                <p className="text-text-secondary mt-1">Glimpses of our previous sessions</p>
            </div>
            
            <div className="relative flex overflow-x-hidden">
                <div className="animate-marquee flex whitespace-nowrap space-x-6 px-4">
                    {pastEvents.map((event) => (
                        <div key={event.id} className="inline-block w-[300px] md:w-[400px] glass-card rounded-2xl overflow-hidden border border-white/5 group flex-shrink-0">
                            <div className="relative h-48 w-full overflow-hidden bg-black/20">
                                <Image src={event.banner} alt={event.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">Concluded</span>
                                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                                </div>
                            </div>
                            <div className="p-4 bg-bg-surface flex justify-between items-center">
                                <div className="text-text-secondary text-sm flex gap-3">
                                    <span>📍 {event.city}</span>
                                    <span>📅 {event.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {/* Duplicate for infinite loop effect */}
                    {pastEvents.map((event) => (
                        <div key={event.id + 'dup'} className="inline-block w-[300px] md:w-[400px] glass-card rounded-2xl overflow-hidden border border-white/5 group flex-shrink-0">
                            <div className="relative h-48 w-full overflow-hidden bg-black/20">
                                <Image src={event.banner} alt={event.title} fill className="object-cover group-hover:scale-105 transition duration-500" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-white/20 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md mb-2 inline-block">Concluded</span>
                                    <h3 className="text-white font-bold text-lg">{event.title}</h3>
                                </div>
                            </div>
                            <div className="p-4 bg-bg-surface flex justify-between items-center">
                                <div className="text-text-secondary text-sm flex gap-3">
                                    <span>📍 {event.city}</span>
                                    <span>📅 {event.date}</span>
                                </div>
                            </div>
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
                .animate-marquee:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};
