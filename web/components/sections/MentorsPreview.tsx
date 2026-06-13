import Link from 'next/link';
import Image from 'next/image';

export interface MentorProfile {
    id: string;
    name: string;
    title: string;
    bio: string;
    photo_url: string;
    linkedin_url: string;
}

const MentorCard = ({ mentor }: { mentor: MentorProfile }) => (
    <div className="flex-shrink-0 w-[85vw] sm:w-[260px] md:w-[280px] mx-2 md:mx-3 glass-card rounded-3xl p-6 flex flex-col items-center text-center group bg-bg-main/60 border border-white/5 hover:border-accent-blue hover:shadow-[0_0_20px_rgba(45,212,191,0.2)] hover:scale-[1.05] hover:-translate-y-3 transition-all duration-500 ease-out">
        <div className="w-20 h-20 relative rounded-full overflow-hidden mb-5 border-2 border-white/10 group-hover:border-accent-blue/50 transition-colors duration-500 p-1">
            <Image
                src={encodeURI(mentor.photo_url)}
                alt={mentor.name}
                fill
                sizes="80px"
                loading="lazy"
                className="w-full h-full rounded-full object-cover group-hover:scale-110 group-hover:brightness-110 transition duration-700"
                unoptimized={true}
            />
        </div>
        <h4 className="text-base font-bold text-white mb-1 tracking-tight">{mentor.name}</h4>
        <p className="text-accent-blue font-semibold text-[10px] tracking-widest uppercase mb-3 leading-tight group-hover:text-white transition-colors">{mentor.title}</p>
        <p className="text-text-secondary text-xs leading-relaxed line-clamp-3 mb-4">{mentor.bio}</p>
        {mentor.linkedin_url && (
            <a
                href={mentor.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-text-secondary hover:bg-white hover:text-black hover:border-white transition-all duration-300 text-xs"
            >
                <i className="fab fa-linkedin-in"></i>
            </a>
        )}
    </div>
);

export function MentorsPreview({ data = [] }: { data?: MentorProfile[] }) {
    // Duplicate for seamless infinite loop
    const track = [...data, ...data];

    return (
        <section id="mentors-preview" className="py-16 md:py-32 bg-bg-main relative overflow-hidden w-full border-t border-white/5">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10 md:mb-20">

                    <h2 className="text-2xl md:text-5xl font-black text-white tracking-[-0.04em] mb-4 md:mb-6">
                        Learn from <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Masters.</span>
                    </h2>
                    <p className="text-base md:text-2xl text-text-secondary font-light max-w-2xl mx-auto">
                        Get mentored by industry titans
                    </p>
                </div>
            </div>

            {/* Carousel — full bleed */}
            <div className="relative w-full overflow-hidden">
                {/* Left fade */}
                <div className="absolute left-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-r from-bg-main to-transparent" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 h-full w-32 z-10 pointer-events-none bg-gradient-to-l from-bg-main to-transparent" />

                <div className="flex w-max animate-mentors-scroll hover:[animation-play-state:paused] will-change-transform">
                    {track.map((mentor, idx) => (
                        <MentorCard key={`marquee-mentor-${idx}`} mentor={mentor} />
                    ))}
                </div>
            </div>

            {/* CTA */}
            <div className="mt-10 md:mt-16 text-center relative z-10">
                <Link href="/mentors" className="group inline-flex items-center text-accent-blue hover:text-white font-bold text-lg transition duration-300">
                    View All Mentors
                    <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                </Link>
            </div>
        </section>
    );
}
