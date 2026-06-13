import { Mentors } from "@/components/sections/Mentors";

export const metadata = {
    title: 'Learn from Masters. | The Startup School',
    description: 'Get mentored by industry titans',
};

async function getMentors() {
    try {
        const res = await fetch('http://localhost:5000/api/mentors', { next: { revalidate: 60 } });
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
            <div className="max-w-4xl mx-auto px-6 mb-12 text-center">
                <h1 className="text-5xl md:text-5xl font-black text-white tracking-[-0.04em] mb-6">
                    Learn from <span className="text-white/40">Masters.</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary font-light leading-relaxed max-w-2xl mx-auto">
                    Get mentored by industry titans
                </p>
            </div>

            <Mentors data={mentors} />
        </div>
    );
}
