import { Metadata } from 'next';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { PageData } from '@/types/cms';
import { DynamicSections } from '@/components/sections/dynamic/DynamicSections';

// Legacy components for backwards compatibility with array blocks format
const DynamicHero = dynamic(() => import("@/components/sections/dynamic/DynamicHero").then(mod => mod.DynamicHero), { ssr: true });
const DynamicWhyUs = dynamic(() => import("@/components/sections/dynamic/DynamicWhyUs").then(mod => mod.DynamicWhyUs), { ssr: true });
const DynamicMentors = dynamic(() => import("@/components/sections/dynamic/DynamicMentors").then(mod => mod.DynamicMentors), { ssr: true });
const DynamicCurriculum = dynamic(() => import("@/components/sections/dynamic/DynamicCurriculum").then(mod => mod.DynamicCurriculum), { ssr: true });
const DynamicStoryline = dynamic(() => import("@/components/sections/dynamic/DynamicStoryline").then(mod => mod.DynamicStoryline), { ssr: true });
const DynamicPricing = dynamic(() => import("@/components/sections/dynamic/DynamicPricing").then(mod => mod.DynamicPricing), { ssr: true });
const DynamicOutcomes = dynamic(() => import("@/components/sections/dynamic/DynamicOutcomes").then(mod => mod.DynamicOutcomes), { ssr: true });
const DynamicTestimonials = dynamic(() => import("@/components/sections/dynamic/DynamicTestimonials").then(mod => mod.DynamicTestimonials), { ssr: true });
const DynamicSchedule = dynamic(() => import("@/components/sections/dynamic/DynamicSchedule").then(mod => mod.DynamicSchedule), { ssr: true });
const DynamicFAQ = dynamic(() => import("@/components/sections/dynamic/DynamicFAQ").then(mod => mod.DynamicFAQ), { ssr: true });

async function getEventBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/events/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const event = await getEventBySlug(resolvedParams.slug);
    return {
        title: event ? `${event.title} | Setu - TheStartupSchool` : 'Event Not Found | Setu',
        description: event?.description || 'Event details',
    };
}

export default async function DynamicEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const event = await getEventBySlug(resolvedParams.slug);

    if (!event) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
                <h1 className="text-4xl font-bold">Event not found</h1>
            </div>
        );
    }

    // Try to parse page_data or fallback to page_blocks (which might hold the unified JSON now)
    let rawData = event.page_data || event.page_blocks;
    let pageData: PageData | null = null;

    if (typeof rawData === 'string') {
        try {
            pageData = JSON.parse(rawData);
        } catch(e) {}
    } else {
        pageData = rawData as PageData;
    }

    if (!pageData) {
        return (
            <div className="pt-32 pb-20 min-h-screen flex items-center justify-center" style={{ backgroundColor: '#0f172a', color: '#f8fafc' }}>
                <h1 className="text-4xl font-bold">Invalid Page Data</h1>
            </div>
        );
    }

    // If it's the old array format, we can't render it with the new unified layout, but we'll try to handle gracefully if needed.
    const isArrayFormat = Array.isArray(pageData);

    return (
        <div className="antialiased relative pb-16 bg-white text-slate-900 overflow-x-hidden">
            {/* Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-0" style={{
                backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)',
                backgroundSize: '30px 30px',
            }} />
            {/* Custom Pill Navigation (Matching Global Nav Style but only with CTA) */}
            <div className="fixed top-2 sm:top-4 left-1/2 -translate-x-1/2 w-[96%] sm:w-[95%] max-w-5xl z-50 flex justify-center">
                <nav className="w-full bg-white/90 backdrop-blur-3xl border border-slate-200/60 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] px-2 sm:px-4 md:px-6">
                    <div className="flex justify-between items-center h-12 sm:h-14 md:h-16">
                        <div className="flex items-center flex-shrink-0 overflow-hidden">
                            <Link href="/" className="flex items-center gap-1.5 sm:gap-3">
                                <div className="flex items-center gap-1.5 sm:gap-3">
                                    <img 
                                        src="/setu-logo-nav.png" 
                                        alt="Setu Logo" 
                                        className="w-[50px] sm:w-[65px] md:w-[85px] h-auto object-contain flex-shrink-0"
                                    />
                                    <div className="h-4 sm:h-5 w-px bg-slate-300 flex-shrink-0"></div>
                                    <span className="text-[7px] sm:text-[9px] md:text-[13px] font-black tracking-[0.1em] sm:tracking-[0.2em] text-[#0B1120] uppercase mt-0.5 truncate max-w-[120px] sm:max-w-none">The <span className="text-accent-violet">Startup</span> School</span>
                                </div>
                            </Link>
                        </div>
                        <div className="flex-shrink-0 ml-1 sm:ml-4">
                            {!event.is_past && event.registration_url ? (
                                <a href="#pricing" className="bg-accent-violet text-white px-3 sm:px-5 py-1.5 sm:py-2 md:px-8 md:py-2.5 rounded-full text-[10px] sm:text-xs md:text-sm font-bold transition duration-300 hover:shadow-[0_8px_20px_rgba(168,85,247,0.3)] hover:-translate-y-0.5 whitespace-nowrap block">
                                    Enroll Now
                                </a>
                            ) : (
                                <span className="bg-slate-100 text-slate-500 border border-slate-200 px-3 sm:px-4 py-1.5 sm:py-2 md:px-6 md:py-2.5 rounded-full text-[9px] sm:text-[10px] md:text-sm font-bold cursor-not-allowed whitespace-nowrap block">
                                    Closed
                                </span>
                            )}
                        </div>
                    </div>
                </nav>
            </div>

            <main className="relative z-10 pt-20">
                {isArrayFormat ? (
                    // Legacy Support if needed
                    (pageData as any).map((block: any, index: number) => {
                        const blockDataWithStatus = { ...block.data, event_status: { is_past: event.is_past, url: event.registration_url } };
                        switch(block.type) {
                            case 'hero': return <DynamicHero key={index} data={blockDataWithStatus} />;
                            case 'why_us': return <DynamicWhyUs key={index} data={blockDataWithStatus} />;
                            case 'mentors': return <DynamicMentors key={index} data={blockDataWithStatus} />;
                            case 'curriculum': return <DynamicCurriculum key={index} data={blockDataWithStatus} />;
                            case 'storyline': return <DynamicStoryline key={index} data={blockDataWithStatus} />;
                            case 'pricing': return <DynamicPricing key={index} data={blockDataWithStatus} />;
                            case 'outcomes': return <DynamicOutcomes key={index} data={blockDataWithStatus} />;
                            case 'testimonials': return <DynamicTestimonials key={index} data={blockDataWithStatus} />;
                            case 'schedule': return <DynamicSchedule key={index} data={blockDataWithStatus} />;
                            case 'faq': return <DynamicFAQ key={index} data={blockDataWithStatus} />;
                            default: return null;
                        }
                    })
                ) : (
                    // New Unified Support
                    <DynamicSections pageData={pageData} />
                )}
            </main>

        </div>
    );
}
