import { Metadata } from 'next';
import dynamic from 'next/dynamic';

const DynamicHero = dynamic(() => import("@/components/sections/dynamic/DynamicHero").then(mod => mod.DynamicHero), { ssr: true });
const DynamicWhyUs = dynamic(() => import("@/components/sections/dynamic/DynamicWhyUs").then(mod => mod.DynamicWhyUs), { ssr: true });
const DynamicMentors = dynamic(() => import("@/components/sections/dynamic/DynamicMentors").then(mod => mod.DynamicMentors), { ssr: true });
const DynamicCurriculum = dynamic(() => import("@/components/sections/dynamic/DynamicCurriculum").then(mod => mod.DynamicCurriculum), { ssr: true });

async function getEventBySlug(slug: string) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/slug/${slug}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (e) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const event = await getEventBySlug(params.slug);
    return {
        title: event ? `${event.title} | Setu - TheStartupSchool` : 'Event Not Found | Setu',
        description: event?.description || 'Event details',
    };
}

export default async function DynamicEventPage({ params }: { params: { slug: string } }) {
    const event = await getEventBySlug(params.slug);

    if (!event) {
        return (
            <div className="pt-32 pb-20 min-h-screen bg-bg-main flex items-center justify-center">
                <h1 className="text-4xl font-bold">Event not found</h1>
            </div>
        );
    }

    const blocks = typeof event.page_blocks === 'string' ? JSON.parse(event.page_blocks) : (event.page_blocks || []);

    return (
        <main className="flex min-h-screen flex-col items-center justify-start bg-bg-main w-full overflow-x-hidden">
            {blocks.map((block: any, index: number) => {
                switch(block.type) {
                    case 'hero':
                        return <DynamicHero key={index} data={block.data} />;
                    case 'why_us':
                        return <DynamicWhyUs key={index} data={block.data} />;
                    case 'mentors':
                        return <DynamicMentors key={index} data={block.data} />;
                    case 'curriculum':
                        return <DynamicCurriculum key={index} data={block.data} />;
                    default:
                        return null;
                }
            })}
        </main>
    );
}
