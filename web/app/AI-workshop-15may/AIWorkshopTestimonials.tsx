'use client';

import { useState } from 'react';

// Video testimonial data — 2 from Startup Ideation, 2 from Fundraising Masterclass
const testimonials = [
    {
        name: 'Loyan Dsouza',
        role: 'CSPO, Elevate',
        location: 'United Arab Emirates',
        workshop: 'Fundraising Masterclass',
        workshopTag: 'Fundraising Masterclass',
        tagColor: '#d946ef',
        quote: '"The kind of detail and the depth that especially the startup school has given, I think I would rate it as 10 out of 10. It was practical and actionable."',
        avatar: 'LD',
        rating: 5,
        duration: '0:28',
        youtubeId: '9Hl6C4UKbVE',
        thumbGradient: 'from-[#d946ef] to-[#a21caf]',
        thumbIcon: 'fa-indian-rupee-sign',
        videoLabel: 'Fundraising Masterclass — Loyan\'s Story',
    },
    {
        name: 'Akanksha Bajaj',
        role: 'Director Marketing, ResearchAyu',
        location: 'Mumbai',
        workshop: 'Fundraising Masterclass',
        workshopTag: 'Fundraising Masterclass',
        tagColor: '#d946ef',
        quote: '"I really loved all the sessions because it felt like future planning for me. I\'m going to research more on the topics discussed. So yeah, really grateful for these sessions."',
        avatar: 'AB',
        rating: 5,
        duration: '0:39',
        youtubeId: 'QA4fekV9LA8',
        thumbGradient: 'from-[#c026d3] to-[#86198f]',
        thumbIcon: 'fa-handshake',
        videoLabel: 'Fundraising Masterclass — Akanksha\'s Story',
    },
    {
        name: 'Kush Bhatia',
        role: 'CEO & Co-Founder, JobGen.AI',
        location: 'Sydney',
        workshop: 'Fundraising Masterclass',
        workshopTag: 'Fundraising Masterclass',
        tagColor: '#d946ef',
        quote: '"From pitch deck to everything, I loved it. Your sessions have been very helpful in my journey. I really loved Ashish\'s session; it was one of my favorites."',
        avatar: 'KB',
        rating: 5,
        duration: '1:31',
        youtubeId: 'zqk2SOTdiAk',
        thumbGradient: 'from-[#d946ef] to-[#a21caf]',
        thumbIcon: 'fa-indian-rupee-sign',
        videoLabel: 'Fundraising Masterclass — Kush\'s Story',
    },
    {
        name: 'Shivay Shakti',
        role: 'Founder, MayaAgent.AI',
        location: 'New Delhi',
        workshop: 'Fundraising Masterclass',
        workshopTag: 'Fundraising Masterclass',
        tagColor: '#d946ef',
        quote: '"This is exceptional as you don\'t skip technical details that people struggle with. I really appreciate the depth. When I joined this session, it was beautiful. Thank you."',
        avatar: 'SS',
        rating: 5,
        duration: '1:02',
        youtubeId: 'CIUhf_k1bOw',
        thumbGradient: 'from-[#c026d3] to-[#86198f]',
        thumbIcon: 'fa-handshake',
        videoLabel: 'Fundraising Masterclass — Shivay\'s Story',
    },
];

function VideoCard({ t, i }: { t: typeof testimonials[0]; i: number }) {
    const [played, setPlayed] = useState(false);

    return (
        <div className="bg-[rgba(15,23,42,0.7)] backdrop-blur-[16px] border border-functional-border rounded-2xl overflow-hidden hover:border-functional-border transition-all duration-300 hover:-translate-y-1 group flex flex-col h-full">
            {/* Video Thumbnail */}
            <div
                className={`relative h-44 bg-bg-main flex items-center justify-center cursor-pointer overflow-hidden group/thumb shrink-0`}
                onClick={() => setPlayed(true)}
            >
                {!played ? (
                    <>
                        {/* YouTube Thumbnail */}
                        <img 
                            src={`https://img.youtube.com/vi/${(t as any).youtubeId}/hqdefault.jpg`} 
                            alt={t.name} 
                            className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover/thumb:opacity-100 group-hover/thumb:scale-105 transition duration-700" 
                        />
                        {/* Ambient overlay */}
                        <div className="absolute inset-0 bg-accent-blue hover:bg-accent-royal text-white/20" />
                        
                        {/* Play button */}
                        <div className="relative z-10 flex flex-col items-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-red-600/90 backdrop-blur-sm border border-functional-border flex items-center justify-center group-hover/thumb:scale-110 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.4)]">
                                <i className="fa-solid fa-play text-text-primary text-lg ml-1" />
                            </div>
                        </div>
                        {/* Duration badge */}
                        <span className="absolute bottom-2 right-2 bg-accent-blue hover:bg-accent-royal text-white/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">{(t as any).duration}</span>
                    </>
                ) : (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube-nocookie.com/embed/${(t as any).youtubeId}?autoplay=1&modestbranding=1&rel=0`}
                        title={t.videoLabel}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="relative z-10"
                    ></iframe>
                )}
            </div>

            {/* Content */}
            <div className="p-5 flex-grow flex flex-col">
                {/* Workshop tag */}
                <div>
                    <span
                        className="inline-block px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest text-text-primary mb-3"
                        style={{ background: `${t.tagColor}30`, border: `1px solid ${t.tagColor}50`, color: t.tagColor }}
                    >
                        {t.workshopTag}
                    </span>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, si) => (
                        <i key={si} className="fa-solid fa-star text-amber-400 text-xs" />
                    ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-text-secondary font-light leading-relaxed mb-6 italic flex-grow">
                    {t.quote}
                </p>

                {/* Person */}
                <div className="flex items-center gap-3 border-t border-functional-border pt-4 mt-auto">
                    <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold text-text-primary shrink-0"
                        style={{ background: `linear-gradient(135deg, ${t.tagColor}, ${t.tagColor}80)` }}
                    >
                        {t.avatar}
                    </div>
                    <div>
                        <p className="text-sm font-bold text-text-primary">{t.name}</p>
                        <p className="text-[11px] text-slate-500 leading-tight">{t.role} <br/> {t.location}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function AIWorkshopTestimonials() {
    return (
        <section className="py-16 md:py-24 relative border-t border-functional-border" id="testimonials">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[160px] opacity-[0.07] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-functional-border text-xs text-text-secondary font-medium uppercase tracking-widest mb-5">
                        <i className="fa-solid fa-quote-left text-[#8b5cf6]" /> Student Stories
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-text-primary mb-4">
                        Hear it from those who&apos;ve{' '}
                        <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">been there</span>
                    </h2>
                    <p className="text-text-secondary text-base md:text-lg font-light max-w-xl mx-auto">
                        Real founders. Real results. From past workshops.
                    </p>
                </div>

                {/* Video cards grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
                    {testimonials.map((t, i) => (
                        <VideoCard key={i} t={t} i={i} />
                    ))}
                </div>

                {/* Aggregate social proof bar */}
                <div className="mt-10 md:mt-14 flex flex-wrap items-center justify-center gap-6 md:gap-12">
                    {[
                        { num: '150+', label: 'Founders Trained' },
                        { num: '56+', label: 'NPS Score' },
                        { num: '3', label: 'Live Cohorts Done' },
                    ].map((s, i) => (
                        <div key={i} className="text-center">
                            <div className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">{s.num}</div>
                            <div className="text-xs text-slate-500 mt-1 font-medium">{s.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
