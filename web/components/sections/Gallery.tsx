

import Image from "next/image";
import Link from "next/link";

// ─── Gallery photos from /public/gallery/ ─────────────────────────────
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

// ─── Simple inline marquee ─────────────────────────────────────────────
function PhotoMarquee({ photos, reverse = false }: { photos: string[]; reverse?: boolean }) {
    return (
        <div className="relative overflow-hidden w-full">
            <div className="absolute left-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-r from-bg-main to-transparent" />
            <div className="absolute right-0 top-0 h-full w-40 z-10 pointer-events-none bg-gradient-to-l from-bg-main to-transparent" />
            <div
                className="flex w-max animate-photo-scroll hover:[animation-play-state:paused] will-change-transform"
                style={{ animationDirection: reverse ? "reverse" : "normal" }}
            >
                {[...photos, ...photos].map((src, i) => (
                    <div
                        key={i}
                        className="flex-shrink-0 w-72 h-52 mx-2 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 hover:-translate-y-1.5 transition-all duration-300 group"
                    >
                        <Image
                            src={encodeURI(src)}
                            alt={`Community moment ${i + 1}`}
                            width={288}
                            height={208}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                            unoptimized={true}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Main export ───────────────────────────────────────────────────────
export function Gallery({ data = [] }: { data?: any[] }) {
    // Row 1: first half, Row 2: second half reversed
    const validData = data && data.length > 0 ? data : GALLERY_PHOTOS.map(url => ({ media_url: url }));
    const photos = validData.map(item => item.media_url);
    const half = Math.ceil(photos.length / 2);
    const row1 = photos.slice(0, half);
    const row2 = photos.slice(half).reverse();

    return (
        <section className="py-20 bg-bg-main relative overflow-hidden w-full border-t border-white/5">
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Row 1 — left to right */}
            <div className="mb-4">
                <PhotoMarquee photos={row1} />
            </div>

            {/* Row 2 — right to left */}
            <div className="mb-14">
                <PhotoMarquee photos={row2} reverse />
            </div>

        </section>
    );
}
