import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';

export interface MentorProfile {
    id: string;
    name: string;
    title: string;
    bio: string;
    photo_url: string;
    linkedin_url: string;
}

const MentorCard = ({ mentor }: { mentor: MentorProfile }) => (
    <div className="flex-shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] mx-3 bg-[#13113B] rounded-3xl p-8 flex flex-col items-center text-center group border border-functional-border shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.15)] transition-all duration-300">
        <div className="w-24 h-24 relative rounded-full overflow-hidden mb-6 bg-gradient-to-b from-[#2e1065] to-[#1e1b4b] border-[3px] border-[#0B0F19] shadow-md shrink-0">
            <Image
                src={encodeURI(mentor.photo_url)}
                alt={mentor.name}
                fill
                sizes="96px"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                unoptimized={true}
            />
        </div>
        
        <h4 className="text-lg font-bold text-white mb-2 tracking-tight leading-tight">{mentor.name}</h4>
        
        <p className="text-[#A855F7] font-bold text-[10px] sm:text-xs tracking-widest uppercase mb-4 leading-relaxed">
            {mentor.title}
        </p>
        
        <p className="text-gray-400 font-medium text-sm leading-relaxed line-clamp-4 mt-auto">
            {mentor.bio || "Industry Expert"}
        </p>
    </div>
);

export function MentorsPreview({ data = [] }: { data?: MentorProfile[] }) {
    // Duplicate for seamless infinite loop
    const track = [...data, ...data];

    return (
        <section id="mentors-preview" className="card-section py-16 md:py-24">
            {/* Background Pattern overlay (optional dotted mesh effect as in image) */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

            {/* Heading */}
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-4 leading-[1.15]">
                        Learn from <br className="hidden md:block" /> people who've <span className="text-[#A855F7]">built.</span>
                    </h2>
                    <div className="flex items-center justify-center gap-4 mt-8">
                        <div className="h-px bg-white/10 w-12 md:w-24"></div>
                        <span className="text-text-primary/40 font-bold text-xs md:text-sm uppercase tracking-widest">Trusted By</span>
                        <div className="flex flex-wrap items-center gap-4 text-text-secondary font-medium text-sm md:text-base">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></div> IIT Alumni</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></div> IIM Alumni</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></div> Startup Founders</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#A855F7]"></div> Industry Specialists</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel — full bleed */}
            <div className="relative w-full overflow-hidden py-4 pb-12">
                {/* Left Fade */}
                {/* Right Fade */}

                <div className="flex w-max animate-mentors-scroll hover:[animation-play-state:paused] will-change-transform">
                    {track.map((mentor, idx) => (
                        <MentorCard key={`marquee-mentor-${idx}`} mentor={mentor} />
                    ))}
                </div>
            </div>

        </section>
    );
}
