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
    <div className="flex-shrink-0 w-[85vw] sm:w-[280px] md:w-[320px] mx-3 bg-white rounded-3xl p-6 flex flex-col group border border-black/5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgba(0,0,0,0.08)] transition-all duration-300">
        <div className="w-32 h-32 mx-auto relative rounded-full overflow-hidden mb-8 bg-gradient-to-b from-[#f3e8ff] to-[#f8fafc] border-[4px] border-white shadow-sm">
            <Image
                src={encodeURI(mentor.photo_url)}
                alt={mentor.name}
                fill
                sizes="128px"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                unoptimized={true}
            />
        </div>
        <div className="flex flex-col flex-grow text-left">
            <h4 className="text-xl font-bold text-black mb-1.5 tracking-tight leading-tight">{mentor.name}</h4>
            <p className="text-text-secondary font-medium text-sm mb-6">{mentor.title}</p>
            
            <div className="flex items-center justify-between mt-auto">
                <span className="px-3 py-1.5 bg-[#f3e8ff] text-[#6B21FB] rounded-full text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                    {mentor.bio?.substring(0, 25) || "Industry Expert"}
                </span>
                <div className="w-8 h-8 rounded-full border border-[#6B21FB]/30 flex items-center justify-center text-[#6B21FB] group-hover:bg-[#6B21FB] group-hover:text-white transition-colors cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </div>
    </div>
);

export function MentorsPreview({ data = [] }: { data?: MentorProfile[] }) {
    // Duplicate for seamless infinite loop
    const track = [...data, ...data];

    return (
        <section id="mentors-preview" className="card-section py-16 md:py-24">
            {/* Background Pattern overlay (optional dotted mesh effect as in image) */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

            {/* Header */}
            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
                <div className="flex flex-col items-start text-left">
                    <div className="inline-flex items-center gap-2 text-[#6B21FB] font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4">
                        <Sparkles className="w-4 h-4" /> OUR MENTORS
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-4 leading-[1.15]">
                        Learn from <br className="hidden md:block" /> people who've <span className="text-[#6B21FB]">built.</span>
                    </h2>
                    
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-8">
                        <span className="text-black/40 font-bold text-xs md:text-sm uppercase tracking-widest">Trusted By</span>
                        <div className="flex flex-wrap items-center gap-4 text-text-secondary font-medium text-sm md:text-base">
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B21FB]"></div> IIT Alumni</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B21FB]"></div> IIM Alumni</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B21FB]"></div> Startup Founders</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B21FB]"></div> Industry Specialists</span>
                            <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#6B21FB]"></div> Investors</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel — full bleed */}
            <div className="relative w-full overflow-hidden py-4 pb-12">
                {/* Left fade */}
                <div className="absolute left-0 top-0 h-full w-12 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
                {/* Right fade */}
                <div className="absolute right-0 top-0 h-full w-12 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />

                <div className="flex w-max animate-mentors-scroll hover:[animation-play-state:paused] will-change-transform">
                    {track.map((mentor, idx) => (
                        <MentorCard key={`marquee-mentor-${idx}`} mentor={mentor} />
                    ))}
                </div>
            </div>

        </section>
    );
}
