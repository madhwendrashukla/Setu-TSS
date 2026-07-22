"use client";

import React, { useRef } from 'react';

export const Testimonials = ({ data, toggles = {}, headings = {} }: { data?: any[], toggles?: any, headings?: any }) => {
    // Fallback data if none provided
    const testimonials = data && data.length > 0 ? data : [
        { id: 1, type: 'video', youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', video_heading: 'Incredible Experience', video_description: 'This program changed my startup trajectory.', show_description: true },
        { id: 2, type: 'text', name: 'Rahul Sharma', quote: 'The mentorship was exactly what I needed to raise my seed round.', city: 'Bangalore' },
        { id: 3, type: 'text', name: 'Sneha Patel', quote: 'Met my co-founder here. Best decision ever.', city: 'Mumbai' },
        { id: 4, type: 'text', name: 'Vikram Singh', quote: 'The community is unmatched. You learn so much just by being in the room.', city: 'Delhi' },
    ];

    let videoTestimonials = testimonials.filter(t => t.type === 'video').slice(0, 9);
    let textTestimonials = testimonials.filter(t => t.type === 'text')
        .sort((a, b) => {
            if (a.created_at && b.created_at) {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            }
            return 0;
        });

    if (toggles.testi_video === false) videoTestimonials = [];
    if (toggles.testi_text === false) textTestimonials = [];

    if (videoTestimonials.length === 0 && textTestimonials.length === 0) return null;

    const videoRef = useRef<HTMLDivElement>(null);
    const scrollVideo = (direction: 'left' | 'right') => {
        if (videoRef.current) {
            const scrollAmount = window.innerWidth > 768 ? 424 : window.innerWidth * 0.85 + 24;
            videoRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="card-section py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary tracking-tight mb-2" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'What <span class="text-[#A855F7]">Founders Say</span>' }} />
                    <p className="text-text-secondary" dangerouslySetInnerHTML={{ __html: headings?.subtitle || 'Real stories from our community members.' }} />
                </div>
                {videoTestimonials.length > 4 && (
                    <div className="flex gap-3 shrink-0">
                        <button onClick={() => scrollVideo('left')} className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Previous testimonial videos">
                            <i className="fas fa-arrow-left text-text-primary text-lg"></i>
                        </button>
                        <button onClick={() => scrollVideo('right')} className="w-12 h-12 rounded-xl border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Next testimonial videos">
                            <i className="fas fa-arrow-right text-text-primary text-lg"></i>
                        </button>
                    </div>
                )}
            </div>

            {/* Video Testimonials */}
            {videoTestimonials.length > 0 && (
                <div 
                    ref={videoRef}
                    className="max-w-7xl mx-auto px-6 mb-16 flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
                >
                    {videoTestimonials.map(t => (
                        <div key={t.id} className={`w-[85vw] md:w-[400px] shrink-0 snap-start rounded-2xl overflow-hidden border border-functional-border bg-bg-surface flex flex-col ${!t.show_description ? 'self-start' : 'h-full'}`}>
                            <div className="relative w-full pt-[56.25%] bg-accent-blue hover:bg-accent-royal text-white">
                                <iframe 
                                    src={t.youtube_url} 
                                    title={t.video_heading || 'Testimonial Video'}
                                    className="absolute top-0 left-0 w-full h-full border-0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                ></iframe>
                            </div>
                            {t.show_description && (
                                <div className="p-4 flex flex-col grow">
                                    {t.rating !== null && t.rating !== undefined && (
                                        <div className="text-yellow-500 text-sm mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                                    )}
                                    <h3 className="text-text-primary font-bold text-lg mb-1 leading-tight">{t.video_heading}</h3>
                                    {t.name && <h4 className="text-text-secondary font-semibold text-sm mb-2">{t.name}</h4>}
                                    <p className="text-text-secondary text-sm">{t.video_description}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Text Testimonials Rolling Marquee */}
            {textTestimonials.length > 0 && (
                <div className="relative flex overflow-x-hidden py-4">
                    
                    
                    <div className="animate-marquee-slow flex whitespace-nowrap space-x-6 px-4">
                        {textTestimonials.map(text => (
                            <div key={text.id} className="inline-block w-[300px] md:w-[450px] p-8 rounded-xl border border-[#3b4a7a] bg-[#1f3160] flex flex-col flex-shrink-0 shadow-lg whitespace-normal">
                                <p className="text-white text-base md:text-lg mb-8 leading-relaxed font-light">"{text.quote}"</p>
                                <div className="mt-auto">
                                    <h4 className="text-white font-bold text-lg mb-1 tracking-tight">{text.name}</h4>
                                    <p className="text-white/80 text-sm mb-4 font-medium">{text.designation || 'Student'}</p>
                                    <div className="flex gap-1 text-[#FBBF24]">
                                        {"★".repeat(text.rating || 5)}{"☆".repeat(5 - (text.rating || 5))}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Duplicate for marquee */}
                        {textTestimonials.map(text => (
                            <div key={text.id + 'dup'} className="inline-block w-[300px] md:w-[450px] p-8 rounded-xl border border-[#3b4a7a] bg-[#1f3160] flex flex-col flex-shrink-0 shadow-lg whitespace-normal">
                                <p className="text-white text-base md:text-lg mb-8 leading-relaxed font-light">"{text.quote}"</p>
                                <div className="mt-auto">
                                    <h4 className="text-white font-bold text-lg mb-1 tracking-tight">{text.name}</h4>
                                    <p className="text-white/80 text-sm mb-4 font-medium">{text.designation || 'Student'}</p>
                                    <div className="flex gap-1 text-[#FBBF24]">
                                        {"★".repeat(text.rating || 5)}{"☆".repeat(5 - (text.rating || 5))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style dangerouslySetInnerHTML={{__html: `
                @keyframes marqueeSlow {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee-slow {
                    animation: marqueeSlow 40s linear infinite;
                }
                .animate-marquee-slow:hover {
                    animation-play-state: paused;
                }
            `}} />
        </section>
    );
};
