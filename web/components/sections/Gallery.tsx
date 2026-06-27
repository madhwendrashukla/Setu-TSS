

"use client";

import Image from "next/image";

const GALLERY_PHOTOS = [
    "/gallery/IMG_0845.webp",
    "/gallery/IMG_1280.webp",
    "/gallery/IMG_1318.webp",
    "/gallery/IMG_1319.webp",
    "/gallery/IMG_1342.webp",
    "/gallery/IMG_1371.webp",
    "/gallery/IMG_1378.webp",
    "/gallery/IMG_1380.webp",
];

function PhotoMarquee({ photos, reverse = false }: { photos: string[]; reverse?: boolean }) {
    return (
        <div className="relative overflow-hidden w-full">
            <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
            <div className="absolute right-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
            <div
                className="flex w-max animate-photo-scroll hover:[animation-play-state:paused] will-change-transform"
                style={{ animationDirection: reverse ? "reverse" : "normal" }}
            >
                {[...photos, ...photos].map((src, i) => {
                    // Fix orientation specifically for IMG_1378.webp and IMG_1380.webp which are rotated
                    const isRotatedImage = src.includes("IMG_1378.webp") || src.includes("IMG_1380.webp");
                    
                    return (
                        <div
                            key={i}
                            className="flex-shrink-0 w-80 h-56 mx-3 rounded-[24px] overflow-hidden border border-black/5 hover:border-[#6B21FB]/30 hover:shadow-[0_10px_40px_rgba(90,58,247,0.15)] hover:-translate-y-2 transition-all duration-300 group bg-gray-100 flex items-center justify-center relative"
                        >
                            <Image
                                src={encodeURI(src)}
                                alt={`Community moment ${i + 1}`}
                                fill
                                className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${isRotatedImage ? '-rotate-90 scale-[1.35]' : ''}`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export function Gallery({ data = [] }: { data?: any[] }) {
    const validData = data && data.length > 0 ? data : GALLERY_PHOTOS.map(url => ({ media_url: url }));
    const photos = validData.map(item => item.media_url);
    
    // Split photos for two rows
    const half = Math.ceil(photos.length / 2);
    const row1 = photos.slice(0, half);
    const row2 = photos.slice(half).reverse();

    return (
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
                <PhotoMarquee photos={row1} />
                <PhotoMarquee photos={row2} reverse />
            </div>
        </section>
    );
}
