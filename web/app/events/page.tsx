import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Events & Workshops | Setu - TheStartupSchool',
    description: 'Upcoming and past events, workshops, and startup testimonials at Setu - TheStartupSchool.',
};

async function getEvents() {
    try {
        const upcomingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?upcoming=true`, { next: { revalidate: 60 } });
        const pastRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?past=true`, { next: { revalidate: 60 } });
        
        const upcoming = upcomingRes.ok ? await upcomingRes.json() : [];
        const past = pastRes.ok ? await pastRes.json() : [];
        
        return { upcoming, past };
    } catch (e) {
        return { upcoming: [], past: [] };
    }
}

export default async function EventsPage() {
    const { upcoming, past } = await getEvents();

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <span className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">THE GATHERINGS</span>
                    <h1 className="text-5xl md:text-5xl font-black text-white mb-6 tracking-[-0.04em] leading-tight">
                        Real <span className="text-white/40">Conversations.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-secondary font-light">
                        Join our immersive sessions to learn from the best, network with peers, and accelerate your startup journey.
                    </p>
                </div>

                {/* Upcoming Workshops Tab */}
                <section className="mb-32">
                    <h2 className="text-2xl font-bold text-white mb-10 tracking-tight pb-4 border-b border-white/10">Upcoming Workshops</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {upcoming.length === 0 ? (
                            <div className="glass-card hover-glow rounded-3xl p-8 md:p-10 border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-full min-h-[300px] lg:col-span-2">
                                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary mb-6">
                                    <i className="fas fa-bullhorn text-2xl"></i>
                                </div>
                                <p className="text-white font-bold text-xl mb-2 tracking-tight">More events being scheduled.</p>
                                <p className="text-text-secondary text-lg">Stay tuned for updates.</p>
                            </div>
                        ) : (
                            upcoming.map((event: any) => (
                                <div key={event.id} className="glass-card rounded-3xl p-8 border border-white/5 bg-bg-surface">
                                    <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                                    <p className="text-text-secondary mb-6">{event.description}</p>
                                    <div className="flex gap-4 text-sm text-text-secondary mb-6">
                                        <span>📍 {event.city} - {event.venue}</span>
                                        <span>📅 {new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                    <Link href={`/events/${event.slug}`} className="text-accent-blue font-bold uppercase text-sm">View Details &rarr;</Link>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Past Events Tab */}
                <section className="mb-32">
                    <h2 className="text-2xl font-bold text-white mb-10 tracking-tight pb-4 border-b border-white/10">Past Events</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {past.map((event: any) => (
                            <div key={event.id} className="glass-card hover-glow rounded-3xl p-8 md:p-10 border border-white/5 relative group h-full flex flex-col bg-bg-surface">
                                <div className="flex justify-between items-start mb-8">
                                    <div className="bg-white/10 border border-white/20 text-text-secondary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        Concluded
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4 tracking-[-0.02em] leading-tight group-hover:text-accent-blue transition duration-300">{event.title}</h3>
                                <p className="text-text-secondary text-lg leading-relaxed mb-10 flex-grow">{event.description}</p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mt-auto pt-8 border-t border-white/5">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-text-secondary font-medium tracking-wide">
                                            <i className="far fa-calendar text-white/50 w-6"></i> {new Date(event.start_date).toLocaleDateString()} (Past)
                                        </div>
                                        <div className="flex items-center text-text-secondary font-medium tracking-wide">
                                            <i className="fas fa-map-marker-alt text-white/50 w-6"></i> {event.venue}, {event.city}
                                        </div>
                                    </div>
                                    <Link href={`/events/${event.slug}`} className="w-full sm:w-auto bg-white/10 hover:bg-white text-white hover:text-black px-8 py-3 rounded-full font-bold transition duration-300 text-center">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {past.length === 0 && (
                            <p className="text-text-secondary">No past events found.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}
