"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";

const GALLERY_PHOTOS = [
    "/gallery/IMG_0845.webp",
    "/gallery/IMG_1280.webp",
    "/gallery/IMG_1318.webp",
    "/gallery/IMG_1319.webp",
    "/gallery/IMG_1342.webp",
    "/gallery/IMG_1371.webp",
    "/gallery/IMG_1380.webp",
    "/gallery/IMG_0845.webp", // Repeating for demo
];

function getYouTubeData(url: string) {
    let videoId = "";
    const watchMatch = url.match(/watch\?v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    const embedMatch = url.match(/embed\/([^?]+)/);
    
    if (watchMatch) videoId = watchMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];

    if (videoId) {
        return {
            embedUrl: `https://www.youtube.com/embed/${videoId}`,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
        };
    }
    return { embedUrl: url, thumbnailUrl: url };
}

export function Gallery({ data = [] }: { data?: any[] }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const validData = data && data.length > 0 ? data : GALLERY_PHOTOS.map(url => ({ media_url: url }));

    // Helper to render an image item safely
    const renderImage = (item: any, className: string) => {
        if (!item || !item.media_url) return null;
        
        const src = item.media_url;
        const isRotated = src.includes('IMG_1378.webp') || src.includes('IMG_1380.webp');
        const isVideo = item.type === 'video' || src.includes('youtube.com') || src.includes('youtu.be');
        
        let thumbnailUrl = src;
        if (isVideo) {
            thumbnailUrl = getYouTubeData(src).thumbnailUrl;
        }

        // Fallback for unconfigured domains in Next.js Image
        const isExternal = thumbnailUrl.startsWith('http');

        return (
            <div className={`relative overflow-hidden rounded-2xl group border border-black/5 bg-gray-100 ${className}`}>
                {isExternal ? (
                    <img
                        src={thumbnailUrl}
                        alt="Gallery image"
                        className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${isRotated ? '-rotate-90 scale-[1.35]' : ''}`}
                    />
                ) : (
                    <Image
                        src={encodeURI(thumbnailUrl)}
                        alt="Gallery image"
                        fill
                        className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isRotated ? '-rotate-90 scale-[1.35]' : ''}`}
                    />
                )}
                {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-6 h-6 text-[#6B21FB] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <section className="w-full bg-white py-24 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight mb-4">
                        Learn Online, <span className="text-[#6B21FB]">Connect Offline</span>
                    </h2>
                    <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
                        Engage with other learners, alumni, and mentors and attend community sessions to learn from each other in our curated community.
                    </p>
                </div>
                
                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => scroll('left')}
                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all focus:outline-none"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-gray-900 text-white hover:bg-black transition-all focus:outline-none shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Masonry Grid */}
            <div className="w-full max-w-7xl mx-auto px-6">
                <div 
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-10 pt-4 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {/* Column 1: Tall then Short */}
                    <div className="flex flex-col gap-6 w-[280px] md:w-[320px] shrink-0 snap-start">
                        {renderImage(validData[0] || { media_url: GALLERY_PHOTOS[0] }, "h-[380px]")}
                        {renderImage(validData[1] || { media_url: GALLERY_PHOTOS[1] }, "h-[220px]")}
                    </div>

                    {/* Column 2: Short then Tall */}
                    <div className="flex flex-col gap-6 w-[280px] md:w-[320px] shrink-0 snap-start">
                        {renderImage(validData[2] || { media_url: GALLERY_PHOTOS[2] }, "h-[220px]")}
                        {renderImage(validData[3] || { media_url: GALLERY_PHOTOS[3] }, "h-[380px]")}
                    </div>

                    {/* Column 3: Very Tall then Short */}
                    <div className="flex flex-col gap-6 w-[280px] md:w-[320px] shrink-0 snap-start">
                        {renderImage(validData[4] || { media_url: GALLERY_PHOTOS[4] }, "h-[440px]")}
                        {renderImage(validData[5] || { media_url: GALLERY_PHOTOS[5] }, "h-[160px]")}
                    </div>

                    {/* Column 4: Tall then Short */}
                    <div className="flex flex-col gap-6 w-[280px] md:w-[320px] shrink-0 snap-start">
                        {renderImage(validData[6] || { media_url: GALLERY_PHOTOS[6] }, "h-[360px]")}
                        {renderImage(validData[7] || { media_url: GALLERY_PHOTOS[0] }, "h-[240px]")}
                    </div>
                    
                    {/* Column 5: Short then Tall (Extra for scrolling) */}
                    <div className="flex flex-col gap-6 w-[280px] md:w-[320px] shrink-0 snap-start">
                        {renderImage(validData[8] || { media_url: GALLERY_PHOTOS[1] }, "h-[240px]")}
                        {renderImage(validData[9] || { media_url: GALLERY_PHOTOS[2] }, "h-[360px]")}
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{__html: `
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
            `}} />
        </section>
    );
}
