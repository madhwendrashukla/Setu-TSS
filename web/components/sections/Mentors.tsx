"use client";

import { mentorsData } from '@/lib/mentors';
import { useState } from 'react';
import Image from 'next/image';

// 3D Flip Card Component
const MentorCard = ({ mentor }: { mentor: any }) => {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div className="group w-full h-[400px] perspective-1000 cursor-pointer" onMouseLeave={() => setIsFlipped(false)} onClick={(e) => { e.preventDefault(); setIsFlipped(!isFlipped); }}>
            <div className={`relative w-full h-full duration-700 preserve-3d md:group-hover:rotate-y-180 ${isFlipped ? 'rotate-y-180' : ''}`}>

                {/* Front Face: Portrait & Highlight */}
                <div className={`absolute inset-0 backface-hidden glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center bg-bg-surface border border-white/5 shadow-2xl overflow-hidden md:group-hover:pointer-events-none ${isFlipped ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>

                    {/* Massive Portrait */}
                    <div className="absolute inset-0 z-0">
                        {mentor.photo_url || mentor.image ? (
                            <Image
                                src={encodeURI(mentor.photo_url || mentor.image)}
                                alt={mentor.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover group-hover:scale-105 transition-all duration-700"
                                onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mentor.name)}&background=1E293B&color=8B5CF6&size=400&font-size=0.33`; }}
                                unoptimized={true}
                            />
                        ) : null}
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-20 mt-auto w-full transform translate-y-4 group-hover:-translate-y-2 transition-transform duration-500 pointer-events-none">
                        <h4 className="text-2xl font-black text-white mb-1 tracking-tight drop-shadow-lg">{mentor.name}</h4>
                        <p className="text-accent-blue font-bold text-xs tracking-widest uppercase truncate drop-shadow-md">{mentor.title}</p>
                    </div>

                    {/* Hover Cue / Mobile Flip Button */}
                    <div 
                        className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-bg-main/50 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 md:text-white/50 md:group-hover:text-accent-blue md:group-hover:border-accent-blue transition-all cursor-pointer pointer-events-auto"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFlipped(true); }}
                    >
                        <i className="fas fa-sync-alt text-sm drop-shadow-lg"></i>
                    </div>
                </div>

                {/* Back Face: Details & LinkedIn */}
                <div className={`absolute inset-0 backface-hidden rotate-y-180 glass-card rounded-3xl p-8 flex flex-col justify-center text-center bg-bg-main border border-accent-blue/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] pointer-events-none md:group-hover:pointer-events-auto ${isFlipped ? 'pointer-events-auto' : ''}`}>
                    
                    {/* Close icon for mobile */}
                    <div 
                        className="absolute top-4 right-4 z-20 w-10 h-10 md:hidden rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/80 hover:bg-white/20 transition-all cursor-pointer pointer-events-auto"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFlipped(false); }}
                    >
                        <i className="fas fa-times text-sm"></i>
                    </div>

                    <div className="mb-6 mt-4 md:mt-0 pointer-events-none">
                        <h4 className="text-xl font-bold text-white tracking-tight leading-tight">{mentor.name}</h4>
                        <span className="text-accent-blue text-xs uppercase tracking-widest font-bold">{mentor.title}</span>
                    </div>

                    <p className="text-text-primary text-sm leading-relaxed mb-8 flex-grow overflow-y-auto font-light no-scrollbar text-white/90 pointer-events-none md:pointer-events-auto">
                        {mentor.bio || (Array.isArray(mentor.credentials) ? mentor.credentials.join(" ") : mentor.credentials)}
                    </p>

                    {(mentor.linkedin_url || mentor.linkedinUrl) && (
                        <a
                            href={mentor.linkedin_url || mentor.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-3 rounded-full bg-white text-black font-bold uppercase tracking-wider text-xs hover:bg-accent-blue hover:text-white transition-colors duration-300 flex justify-center items-center gap-2 relative z-50 pointer-events-auto"
                            onClick={(e) => e.stopPropagation()} 
                        >
                            Connect on LinkedIn <i className="fab fa-linkedin-in text-sm"></i>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export function Mentors({ data }: { data?: any[] }) {
    const displayMentors = data && data.length > 0 ? data : mentorsData;

    return (
        <section id="mentors" className="py-20 bg-bg-main relative w-full border-t border-white/5">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-accent-violet/5 rounded-[100%] blur-[120px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 w-full mb-16 text-center">
                <p className="text-text-secondary font-light text-sm max-w-2xl mx-auto hidden md:block">
                    Hover over any mentor to flip their card and view detailed credentials.
                </p>
                <p className="text-text-secondary font-light text-sm max-w-2xl mx-auto block md:hidden">
                    Tap on any mentor to view their detailed credentials.
                </p>
            </div>

            {/* Grid Layout */}
            <div className="max-w-[1400px] mx-auto px-6 w-full relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                    {displayMentors.map((mentor, idx) => (
                        <MentorCard key={`mentor-${idx}`} mentor={mentor} />
                    ))}
                </div>
            </div>
        </section>
    );
}
