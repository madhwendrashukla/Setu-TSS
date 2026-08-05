"use client";
import React, { useState } from 'react';
import { PageData } from '@/types/cms';
import { getEmbedUrl } from '@/lib/video';

export function DynamicVideoGallery({ data }: { data: PageData }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!data?.video_gallery || !data.video_gallery.videos || data.video_gallery.videos.length === 0) return null;

    const { video_gallery } = data;
    const videos = video_gallery.videos;

    const nextVideo = () => setCurrentIndex((prev) => (prev + 1) % videos.length);
    const prevVideo = () => setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);

    // Get current video and format URL securely to bypass SAMEORIGIN policy
    const videoUrl = videos[currentIndex];
    const embedUrl = getEmbedUrl(videoUrl);

    return (
        <section className="py-24 bg-slate-900 relative overflow-hidden">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="max-w-2xl">
                    {video_gallery.headline && (
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white" dangerouslySetInnerHTML={{ __html: video_gallery.headline }} />
                    )}
                </div>
                
                {videos.length > 1 && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={prevVideo}
                            className="w-12 h-12 flex items-center justify-center rounded-xl border border-slate-700 text-white hover:bg-white/10 hover:border-slate-500 transition-all focus:outline-none"
                            aria-label="Previous video"
                        >
                            <i className="fas fa-arrow-left"></i>
                        </button>
                        <button 
                            onClick={nextVideo}
                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all focus:outline-none shadow-md"
                            aria-label="Next video"
                        >
                            <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="w-full bg-slate-800 rounded-3xl overflow-hidden aspect-video shadow-2xl border border-slate-700 relative group transition-opacity duration-300">
                    <iframe 
                        key={currentIndex} /* Force re-render on index change */
                        src={embedUrl} 
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                    ></iframe>
                </div>
                
                {/* Optional dots indicator for larger galleries */}
                {videos.length > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        {videos.map((_, idx) => (
                            <button 
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-2.5 h-2.5 rounded-full transition-colors ${idx === currentIndex ? 'bg-white' : 'bg-white/30 hover:bg-white/50'}`}
                                aria-label={`Go to video ${idx + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
