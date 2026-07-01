import { Mentors } from "@/components/sections/Mentors";
import { MentorCTA } from "@/components/sections/MentorCTA";

export const metadata = {
    title: 'Learn from Masters. | Setu - TheStartupSchool',
    description: 'Get mentored by industry titans',
};

async function getMentors() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mentors`, { cache: 'no-store' });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

export default async function MentorsPage() {
    const mentors = await getMentors();

    return (
        <div className="pt-24 pb-20 min-h-screen bg-bg-main flex flex-col items-center">
            <div className="max-w-4xl mx-auto px-6 mb-4 text-center">
                <h1 className="text-5xl md:text-6xl font-black text-[#0f172a] tracking-[-0.04em] mb-4">
                    Learn from <span className="text-accent-blue">Masters.</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                    Get mentored by industry titans
                </p>
            </div>

            <Mentors data={mentors} />

            <div className="mt-8 mb-12">
                <MentorCTA />
            </div>
        </div>
    );
}
