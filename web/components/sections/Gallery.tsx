

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const GALLERY_PHOTOS = [
    "/gallery/IMG_0845.webp",
    "/gallery/IMG_1280.webp",
    "/gallery/IMG_1318.webp",
    "/gallery/IMG_1319.webp",
    "/gallery/IMG_1342.webp",
    "/gallery/IMG_1371.webp",
    "/gallery/IMG_1380.webp",
];

type GalleryItemType = {
    media_url: string;
    type?: string;
};

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

function PhotoMarquee({ items, reverse = false, onItemClick }: { items: GalleryItemType[]; reverse?: boolean; onItemClick: (item: GalleryItemType) => void }) {
    return (
        <div className="relative overflow-hidden w-full group/marquee">
            <div className="absolute left-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            <div
                className="flex w-max animate-photo-scroll group-hover/marquee:[animation-play-state:paused] will-change-transform"
                style={{ animationDirection: reverse ? "reverse" : "normal" }}
            >
                {[...items, ...items].map((item, i) => {
                    // Fix orientation specifically for IMG_1378.webp and IMG_1380.webp which are rotated
                    const isRotatedImage = item.media_url.includes("IMG_1378.webp") || item.media_url.includes("IMG_1380.webp");
                    const isVideo = item.type === 'video';
                    
                    let thumbnailUrl = item.media_url;
                    if (isVideo) {
                        thumbnailUrl = getYouTubeData(item.media_url).thumbnailUrl;
                    }

                    // Fallback to regular img tag if it's an unconfigured external domain just in case
                    const isExternalUnconfigured = thumbnailUrl.startsWith('http') && !thumbnailUrl.includes('youtube.com') && !thumbnailUrl.includes('amazonaws.com') && !thumbnailUrl.includes('ui-avatars.com');

                    return (
                        <div
                            key={i}
                            onClick={() => onItemClick(item)}
                            className="flex-shrink-0 w-64 md:w-80 h-48 md:h-56 mx-3 rounded-[24px] overflow-hidden border border-black/5 hover:border-[#6B21FB]/30 hover:shadow-[0_10px_40px_rgba(90,58,247,0.15)] hover:-translate-y-2 transition-all duration-300 group bg-gray-100 flex items-center justify-center relative cursor-zoom-in"
                        >
                            {isExternalUnconfigured ? (
                                <img
                                    src={thumbnailUrl}
                                    alt={`Community moment ${i + 1}`}
                                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isRotatedImage ? '-rotate-90 scale-[1.35]' : ''}`}
                                />
                            ) : (
                                <Image
                                    src={encodeURI(thumbnailUrl)}
                                    alt={`Community moment ${i + 1}`}
                                    fill
                                    className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isRotatedImage ? '-rotate-90 scale-[1.35]' : ''}`}
                                />
                            )}
                            {isVideo && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="w-12 h-12 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                        <svg className="w-6 h-6 md:w-8 md:h-8 text-[#6B21FB] ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function Gallery({ data = [] }: { data?: any[] }) {
    const [selectedItem, setSelectedItem] = useState<GalleryItemType | null>(null);

    // Prevent body scroll when lightbox is open
    useEffect(() => {
        if (selectedItem) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [selectedItem]);

    const validData = data && data.length > 0 ? data : GALLERY_PHOTOS.map(url => ({ media_url: url, type: 'image' }));
    
    // Split photos for two rows
    const half = Math.ceil(validData.length / 2);
    const row1 = validData.slice(0, half);
    const row2 = validData.slice(half).reverse();

    return (
        <>
            <section className="card-section py-16 md:py-24">
                {/* Background Pattern overlay */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_20%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16">
                <div className="text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight mb-4">
                        Inside The <span className="text-[#6B21FB]">Startup School.</span>
                    </h2>
                    <p className="text-text-secondary text-lg font-medium max-w-2xl mx-auto">
                        Glimpses of our vibrant community, intense workshops, and founders in action.
                    </p>
                </div>
            </div>

            {/* Dynamic Gallery Rows */}
            <div className="relative z-10 flex flex-col gap-6">
                <PhotoMarquee items={row1} onItemClick={setSelectedItem} />
                <PhotoMarquee items={row2} reverse onItemClick={setSelectedItem} />
            </div>
        </section>

        {/* Lightbox Modal */}
        {selectedItem && (
            <div 
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 bg-black/90 backdrop-blur-md opacity-100 transition-opacity duration-300"
                onClick={() => setSelectedItem(null)}
            >
                <button 
                    className="absolute top-6 right-6 md:top-10 md:right-10 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all z-50"
                    onClick={() => setSelectedItem(null)}
                    title="Close"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div 
                    className="relative w-full h-full max-w-6xl max-h-[85vh] rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300 flex items-center justify-center"
                    onClick={e => e.stopPropagation()}
                >
                    {selectedItem.type === 'video' ? (
                        <iframe 
                            src={`${getYouTubeData(selectedItem.media_url).embedUrl}?autoplay=1`}
                            className="w-full h-full md:w-[80vw] md:h-[45vw] max-w-5xl max-h-[70vh] border-0 rounded-2xl bg-black"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    ) : (
                        <Image
                            src={encodeURI(selectedItem.media_url)}
                            alt="Gallery full preview"
                            fill
                            className={`object-contain ${selectedItem.media_url.includes('IMG_1378.webp') || selectedItem.media_url.includes('IMG_1380.webp') ? '-rotate-90 scale-125' : ''}`}
                        />
                    )}
                </div>
            </div>
        )}
        </>
    );
}
