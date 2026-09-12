"use client";

import { getEmbedUrl } from '@/lib/video';
import React, { useRef } from 'react';

export const BottomVideoGallery = ({ data = [] }: { data?: any[] }) => {
    const videos = data || [];
    
    // Do not render anything if there are no active videos
    if (videos.length === 0) return null;

    const scrollRef = useRef<HTMLDivElement>(null);
    const scrollVideo = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const scrollAmount = window.innerWidth > 768 ? 400 + 24 : window.innerWidth * 0.85 + 24;
            scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="w-full bg-bg-main py-16 md:py-24 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6 mb-8 flex items-center justify-end">
                {videos.length > 1 && (
                    <div className="flex gap-3 shrink-0">
                        <button onClick={() => scrollVideo('left')} className="w-12 h-12 rounded-xl border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Previous videos">
                            <i className="fas fa-arrow-left text-text-primary text-lg"></i>
                        </button>
                        <button onClick={() => scrollVideo('right')} className="w-12 h-12 rounded-xl border border-gray-100 bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex items-center justify-center hover:bg-gray-50 transition-colors" aria-label="Next videos">
                            <i className="fas fa-arrow-right text-text-primary text-lg"></i>
                        </button>
                    </div>
                )}
            </div>
            
            <div className="max-w-7xl mx-auto px-6">
                <div 
                    ref={scrollRef}
                    className="grid grid-flow-col auto-cols-[85vw] md:auto-cols-[400px] items-stretch gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbar pb-4"
                >
                    {videos.map((video) => (
                        <div key={video.id} className="snap-start w-full flex flex-col group">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/10 bg-black relative">
                                {(() => {
                                    const embedUrl = getEmbedUrl(video.youtube_url || video.url);
                                    if (embedUrl) {
                                        return (
                                            <iframe 
                                                className="w-full h-full absolute inset-0"
                                                src={embedUrl} 
                                                title={video.title || "Video"}
                                                frameBorder="0" 
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                                allowFullScreen
                                            ></iframe>
                                        );
                                    } else {
                                        return <div className="w-full h-full flex items-center justify-center text-white/50">Invalid Video URL</div>;
                                    }
                                })()}
                            </div>
                            {video.title && (
                                <h3 className="text-accent-violet font-semibold text-lg mt-4 px-2 group-hover:text-accent-blue transition-colors">
                                    {video.title}
                                </h3>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
