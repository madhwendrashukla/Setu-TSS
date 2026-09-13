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

export function Gallery({ data = [], headings = {} }: { data?: any[], headings?: any }) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const validData = data && data.length > 0 ? data : GALLERY_PHOTOS.map((url, i) => ({ media_url: url, display_order: i }));
    const TOTAL_SLOTS = 30;
    
    // Map items exactly to their assigned slot indices based on display_order
    const slots = Array.from({ length: TOTAL_SLOTS }).map((_, i) => {
        return validData.find(item => item.display_order === i) || null;
    });
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
        const isCurrentlyPlaying = activeVideo === src;

        return (
            <div className={`relative overflow-hidden rounded-2xl group border border-functional-border bg-[#1e293b] ${className}`}>
                {isCurrentlyPlaying ? (
                    <iframe
                        src={`${getYouTubeData(src).embedUrl}?autoplay=1`}
                        className="w-full h-full object-cover"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <>
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
                                unoptimized={true}
                                className={`object-cover transition-transform duration-700 group-hover:scale-110 ${isRotated ? '-rotate-90 scale-[1.35]' : ''}`}
                            />
                        )}
                        {isVideo && (
                            <div 
                                className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors cursor-pointer"
                                onClick={() => setActiveVideo(src)}
                            >
                                <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <svg className="w-6 h-6 text-[#6B21FB] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        );
    };

    return (
        <section className="w-full bg-bg-main py-12 md:py-24 relative overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-text-primary tracking-tight mb-3 md:mb-4 whitespace-normal break-words [&_p]:inline [&_p]:m-0" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Community Gallery, <span style="color: #A855F7">Connect Offline.</span>' }} />
                    <div className="text-text-secondary text-base sm:text-lg md:text-xl font-medium leading-relaxed [&_p]:inline [&_p]:m-0" dangerouslySetInnerHTML={{ __html: headings?.subtitle || 'Engage with other learners, alumni, and mentors and attend community sessions to learn from each other in our curated community.' }} />
                </div>
                
                {/* Navigation Arrows */}
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => scroll('left')}
                        aria-label="Scroll gallery left"
                        className="w-12 h-12 flex items-center justify-center rounded-xl border border-functional-border text-text-primary hover:bg-white/10 hover:border-white/30 transition-all focus:outline-none"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => scroll('right')}
                        aria-label="Scroll gallery right"
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/10 text-text-primary hover:bg-white/20 transition-all focus:outline-none shadow-md"
                    >
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Scrollable Masonry Grid */}
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6">
                <div 
                    ref={scrollContainerRef}
                    className="overflow-x-auto pb-10 pt-4 snap-x snap-mandatory hide-scrollbar"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    <div className="h-[660px]" style={{ columnWidth: '320px', columnGap: '24px' }}>
                        {validData.filter(item => item && item.media_url).map((item, i) => {
                            const rawCaption = item.caption || '';
                            let size = 'medium';
                            let cleanCaption = rawCaption;
                            
                            const sizeMatch = rawCaption.match(/^SIZE:([^|]+)\|/);
                            if (sizeMatch) {
                                size = sizeMatch[1];
                                cleanCaption = rawCaption.replace(/^SIZE:[^|]+\|/, '');
                            }

                            let heightClass = "h-[320px]"; // medium
                            if (size === 'small') heightClass = "h-[220px]";
                            else if (size === 'large') heightClass = "h-[420px]";
                            else if (size === 'tall') heightClass = "h-[640px]"; // Almost full height

                            // Mutate item to pass the cleaned caption for alt text (and to avoid bugs)
                            const renderItem = { ...item, caption: cleanCaption };

                            return (
                                <div key={item.id || i} className={`w-full mb-6 snap-start shrink-0 inline-block ${heightClass}`} style={{ breakInside: 'avoid', breakBefore: 'auto', breakAfter: 'auto' }}>
                                    {renderImage(renderItem, 'w-full h-full')}
                                </div>
                            );
                        })}
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
