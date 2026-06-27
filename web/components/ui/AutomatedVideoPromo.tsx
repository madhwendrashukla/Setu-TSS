"use client";

import Image from 'next/image';
import { useState, useEffect } from 'react';

const HERO_SLIDES = [
    '/images/hero-bg/slide-2.png',
    '/images/hero-bg/slide-3.png',
    '/images/hero-bg/slide-4.png',
    '/images/hero-bg/slide-5.png',
    '/images/hero-bg/slide-6.png',
    '/images/hero-bg/slide-7.png',
];

export function AutomatedVideoPromo({ data }: { data?: any }) {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slidesData = data?.heroSlides && data.heroSlides.length > 0 
        ? data.heroSlides 
        : [
            { image_url: '/images/hero-bg/slide-2.png' },
            { image_url: '/images/hero-bg/slide-3.png' },
            { image_url: '/images/hero-bg/slide-4.png' },
            { image_url: '/images/hero-bg/slide-5.png' },
            { image_url: '/images/hero-bg/slide-6.png' },
            { image_url: '/images/hero-bg/slide-7.png' }
        ];

    const rotationTime = data?.homepageContent?.hero_rotation_seconds 
        ? data.homepageContent.hero_rotation_seconds * 1000 
        : 4000;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slidesData.length);
        }, rotationTime);
        return () => clearInterval(interval);
    }, [slidesData.length, rotationTime]);

    return (
        <section className="relative w-full h-screen min-h-[600px] overflow-hidden border-b border-black/5">
            
            {/* Slideshow Background Images */}
            {slidesData.map((slide: any, index: number) => (
                <div 
                    key={`bg-${index}`}
                    className={`absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out w-full h-full ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
                >
                    <Image
                        src={slide.image_url}
                        alt={`Hero Background Slide ${index + 1}`}
                        fill
                        className="object-cover object-center"
                        priority={index === 0}
                        quality={75}
                        sizes="100vw"
                        unoptimized
                    />
                </div>
            ))}

            {/* Light Overlays for readability (as seen in the newest screenshot) */}
            <div className="absolute inset-0 z-0 bg-white/70"></div>
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/90 via-white/40 to-transparent"></div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-white/30 to-white/90"></div>

            {/* Main Content Area */}
            <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center justify-center text-center h-full">
                
                {slidesData.map((_: any, index: number) => {
                    const sceneIndex = index % 3;
                    let finalHeading = "";
                    let finalTagline = "";

                    if (sceneIndex === 0) {
                        finalHeading = data?.homepageContent?.hero_heading || "Stop Ideating.<br />Start <span class=\"text-accent-violet\">Building.</span>";
                        finalTagline = data?.homepageContent?.hero_tagline || "Join the alternate B-school for Aspiring Founders.";
                    } else if (sceneIndex === 1) {
                        finalHeading = data?.homepageContent?.hero_scene1_heading || "<span class=\"text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block\">THE BRIDGE</span>The 0 &rarr; 1 Bridge<br />Where Founders Are Built.";
                        finalTagline = data?.homepageContent?.hero_scene1_tagline || "We close 4 deadly gaps: Learning, Access, Mentoring, Community";
                    } else {
                        finalHeading = data?.homepageContent?.hero_scene2_heading || "<span class=\"text-xs md:text-sm font-bold tracking-[0.2em] text-accent-violet uppercase mb-4 block\">THE ROADMAP</span>3 days of ignition sprint<br /><span class=\"text-text-secondary text-2xl md:text-3xl block my-2\">to</span><span class=\"text-accent-violet\">100 days of Deep Dive Immersion cohorts</span>";
                        finalTagline = data?.homepageContent?.hero_scene2_tagline || "<i class=\"font-normal\">Choose the program that fits you the best</i>";
                    }

                    return (
                        <div 
                            key={`text-${index}`} 
                            className={`absolute flex flex-col items-center justify-center transition-all duration-1000 ease-in-out w-full px-4 ${index === currentSlide ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
                        >
                            <h1 
                                className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-black leading-[1.2] mb-6"
                                dangerouslySetInnerHTML={{ __html: finalHeading }}
                            />
                            
                            <p 
                                className="text-base md:text-xl font-medium text-text-secondary max-w-2xl mx-auto tracking-wide"
                                dangerouslySetInnerHTML={{ __html: finalTagline }}
                            />
                        </div>
                    );
                })}

            </div>
        </section>
    );
}
