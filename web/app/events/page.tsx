import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Events & Workshops | Setu - TheStartupSchool',
    description: 'Upcoming and past events, workshops, and startup testimonials at Setu - TheStartupSchool.',
};

type Course = {
    id: string;
    title: string;
    smallDescription: string | null;
    price: number; // rupees (as stored by the LMS)
    duration: number;
    level: string;
    category: string | null;
    slug: string;
    fileKey: string | null; // full CDN URL of the course thumbnail
};

async function getCourses(): Promise<Course[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}

const formatPrice = (rupees: number) =>
    rupees <= 0 ? 'Free' : `₹${rupees.toLocaleString('en-IN')}`;

async function getEvents() {
    try {
        const upcomingRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?upcoming=true`, { cache: 'no-store' });
        const pastRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events?past=true`, { cache: 'no-store' });
        
        const upcoming = upcomingRes.ok ? await upcomingRes.json() : [];
        const past = pastRes.ok ? await pastRes.json() : [];
        
        return { upcoming, past };
    } catch (e) {
        return { upcoming: [], past: [] };
    }
}

export default async function EventsPage() {
    const [{ upcoming, past }, allCourses] = await Promise.all([getEvents(), getCourses()]);

    // Unified Events: a course linked to a LIVE event appears exactly once —
    // as that event's card (builder landing page). While its event is still
    // hidden (publish → design phase) the course card keeps covering it here.
    const linkedSlugs = new Set(
        [...upcoming, ...past]
            .map((e: any) => e.lms_course_slug)
            .filter((s: string | null): s is string => Boolean(s))
    );
    const courses = allCourses.filter((c) => !linkedSlugs.has(c.slug));

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="text-center mb-24 max-w-4xl mx-auto">
                    <span className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">THE GATHERINGS</span>
                    <h1 className="text-5xl md:text-5xl font-black text-text-primary mb-6 tracking-[-0.04em] leading-tight">
                        Real <span className="text-text-primary/40">Conversations.</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-text-secondary font-light">
                        Join our immersive sessions to learn from the best, network with peers, and accelerate your startup journey.
                    </p>
                </div>

                {/* Courses (LMS) */}
                {courses.length > 0 && (
                    <section id="courses" className="mb-32 scroll-mt-32">
                        <h2 className="text-2xl font-bold text-text-primary mb-10 tracking-tight pb-4 border-b border-black/10">Courses & Cohorts</h2>

                        {/* Cards deliberately omit .glass-card: its unlayered white background overrides the bg-[#13113B] utility */}
                        <div className="grid lg:grid-cols-2 gap-8">
                            {courses.map((course) => (
                                <div key={course.id} className="rounded-3xl p-8 border border-functional-border/20 bg-[#13113B] flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                                    <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden relative shrink-0 bg-[#A855F7]">
                                        {course.fileKey ? (
                                            <img src={course.fileKey} alt={course.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src="/ai-workshop-banner.webp" alt={course.title} className="w-full h-full object-contain opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-widest">
                                        <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
                                            {course.level}
                                        </span>
                                        {course.category && (
                                            <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full">
                                                {course.category}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">{course.title}</h3>
                                    {course.smallDescription && (
                                        <p className="text-gray-400 mb-6 flex-grow">{course.smallDescription}</p>
                                    )}
                                    <div className="flex justify-between items-center mt-auto pt-6 border-t border-white/10">
                                        <span className="text-xl font-black text-white">{formatPrice(course.price)}</span>
                                        <Link
                                            href={`/courses/${course.slug}`}
                                            className="text-[#A855F7] font-bold uppercase text-sm hover:text-[#9333ea] transition-colors"
                                        >
                                            Enroll Now {"→"}
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Upcoming Workshops Tab */}
                <section className="mb-32">
                    <h2 className="text-2xl font-bold text-text-primary mb-10 tracking-tight pb-4 border-b border-black/10">Upcoming Workshops</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {upcoming.length === 0 ? (
                            <div className="glass-card hover-glow rounded-3xl p-8 md:p-10 border border-dashed border-black/10 flex flex-col items-center justify-center text-center h-full min-h-[300px] lg:col-span-2">
                                <div className="w-16 h-16 rounded-full bg-accent-blue hover:bg-accent-royal text-white/5 border border-black/10 flex items-center justify-center text-text-secondary mb-6">
                                    <i className="fas fa-bullhorn text-2xl"></i>
                                </div>
                                <p className="text-text-primary font-bold text-xl mb-2 tracking-tight">More events being scheduled.</p>
                                <p className="text-text-secondary text-lg">Stay tuned for updates.</p>
                            </div>
                        ) : (
                            upcoming.map((event: any) => (
                                <div key={event.id} className="glass-card rounded-3xl p-8 border border-functional-border/20 bg-[#13113B] flex flex-col shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                                    {event.banner_url ? (
                                        <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden relative shrink-0 bg-[#A855F7]">
                                            <img src={encodeURI(event.banner_url)} alt={event.title} className="w-full h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-full aspect-video mb-6 rounded-2xl overflow-hidden relative shrink-0 bg-[#A855F7]">
                                            <img src="/ai-workshop-banner.webp" alt="Event Banner" className="w-full h-full object-contain opacity-50" />
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-white mb-4">{event.title}</h3>
                                    <p className="text-gray-400 mb-6 flex-grow">{event.description}</p>
                                    <div className="flex gap-4 text-sm text-gray-400 mb-6">
                                        <span><i className="fas fa-map-marker-alt text-gray-400 w-4"></i> {event.venue}</span>
                                        <span><i className="far fa-calendar text-gray-400 w-4"></i> {new Date(event.start_date).toLocaleDateString()}</span>
                                    </div>
                                    {(event.slug || event.registration_url) && (
                                        <Link 
                                            href={event.slug ? `/events/${event.slug}` : event.registration_url} 
                                            target={event.slug ? "_self" : "_blank"} 
                                            rel={event.slug ? "" : "noopener noreferrer"} 
                                            className="text-[#A855F7] font-bold uppercase text-sm hover:text-[#9333ea] transition-colors"
                                        >
                                            {event.slug ? "View Event Details \u2192" : "Register Now \u2192"}
                                        </Link>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Past Events Tab */}
                <section className="mb-32">
                    <h2 className="text-2xl font-bold text-text-primary mb-10 tracking-tight pb-4 border-b border-black/10">Past Events</h2>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {past.map((event: any) => (
                            <div key={event.id} className="glass-card hover-glow rounded-3xl p-8 md:p-10 border border-functional-border/20 relative group h-full flex flex-col bg-[#13113B] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                                {event.banner_url ? (
                                    <div className="w-full aspect-video mb-8 rounded-2xl overflow-hidden relative shrink-0 bg-[#A855F7]">
                                        <img src={encodeURI(event.banner_url)} alt={event.title} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                ) : (
                                    <div className="w-full aspect-video mb-8 rounded-2xl overflow-hidden relative shrink-0 bg-[#A855F7]">
                                        <img src="/ai-workshop-banner.webp" alt="Past Event" className="w-full h-full object-contain opacity-50 group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-white/10 border border-white/20 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                                        Concluded
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4 tracking-[-0.02em] leading-tight group-hover:text-[#A855F7] transition duration-300">{event.title}</h3>
                                <p className="text-gray-400 text-lg leading-relaxed mb-10 flex-grow">{event.description}</p>

                                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center mt-auto pt-8 border-t border-white/10">
                                    <div className="space-y-2">
                                        <div className="flex items-center text-gray-400 font-medium tracking-wide">
                                            <i className="far fa-calendar text-gray-400 w-6"></i> {new Date(event.start_date).toLocaleDateString()} (Past)
                                        </div>
                                        <div className="flex items-center text-gray-400 font-medium tracking-wide">
                                            <i className="fas fa-map-marker-alt text-gray-400 w-6"></i> {event.venue}
                                        </div>
                                    </div>
                                    {(event.slug || event.registration_url) && (
                                        <Link 
                                            href={event.slug ? `/events/${event.slug}` : event.registration_url} 
                                            target={event.slug ? "_self" : "_blank"} 
                                            rel={event.slug ? "" : "noopener noreferrer"} 
                                            className="w-full sm:w-auto bg-[#A855F7] hover:bg-[#9333ea] text-white px-8 py-3 rounded-full font-bold transition duration-300 text-center"
                                        >
                                            View Event Details
                                        </Link>
                                    )}
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
