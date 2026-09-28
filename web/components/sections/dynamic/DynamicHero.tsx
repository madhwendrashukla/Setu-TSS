"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicHero({ data }: { data: PageData }) {
    if (!data?.hero) return null;

    const { hero } = data;

    return (
        <section className="relative w-full min-h-[50vh] sm:min-h-[60vh] md:min-h-[70vh] flex items-center justify-center pt-14 pb-10 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 px-4 sm:px-6 overflow-hidden isolate">
            {/* Ambient Glowing Orbs for Depth */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[550px] h-[300px] sm:h-[380px] bg-gradient-to-tr from-purple-400/20 via-indigo-300/15 to-pink-400/15 rounded-full blur-[80px] sm:blur-[130px] opacity-75"></div>
                <div className="absolute -top-10 right-[10%] w-48 sm:w-72 h-48 sm:h-72 bg-blue-400/15 rounded-full blur-[80px] opacity-60"></div>
                <div className="absolute -bottom-10 left-[10%] w-48 sm:w-72 h-48 sm:h-72 bg-purple-300/15 rounded-full blur-[80px] opacity-50"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center w-full">
                {hero.top_badge && (
                    <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full border border-purple-200/80 bg-gradient-to-r from-purple-50/90 via-white to-purple-50/90 shadow-sm shadow-purple-500/10 mb-5 sm:mb-7 hover:border-purple-300 transition-all duration-300 hover:scale-[1.02]">
                        <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse shadow-[0_0_8px_rgba(147,51,234,0.6)]"></span>
                        <span className="text-[11px] sm:text-xs md:text-sm font-bold text-purple-900 tracking-wide">{hero.top_badge}</span>
                    </div>
                )}
                
                {hero.headline && (
                    <h1 
                        className="w-full text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-4 sm:mb-6 md:mb-8 tracking-tight md:tracking-tighter leading-[1.18] sm:leading-[1.1] !whitespace-normal [&_span]:text-transparent [&_span]:bg-clip-text [&_span]:bg-gradient-to-r [&_span]:from-purple-600 [&_span]:to-indigo-600"
                        dangerouslySetInnerHTML={{ __html: hero.headline.replace(/&nbsp;/g, ' ') }} 
                    />
                )}
                
                {hero.description && (
                    <div 
                        className="w-full text-sm sm:text-base md:text-xl text-slate-600 font-normal sm:font-medium max-w-3xl mb-6 sm:mb-8 md:mb-10 leading-relaxed px-1 sm:px-4 overflow-hidden !whitespace-normal"
                        dangerouslySetInnerHTML={{ __html: hero.description.replace(/&nbsp;/g, ' ') }}
                    />
                )}
                
                {hero.key_highlights && hero.key_highlights.length > 0 && (
                    <div className="w-full flex justify-center mb-4 sm:mb-6 px-2">
                        <div className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-4 md:gap-6 text-xs sm:text-sm md:text-base text-slate-800 font-bold tracking-wide bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-md shadow-slate-200/60 px-4 py-2 sm:px-6 sm:py-3 rounded-2xl hover:shadow-lg transition-shadow duration-300">
                            {hero.key_highlights.map((stat: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                                        <i className="fas fa-check-circle text-purple-500 text-xs"></i>
                                        {stat}
                                    </span>
                                    {idx < hero.key_highlights.length - 1 && (
                                        <span className="text-slate-300 font-normal hidden sm:inline">•</span>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
