"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicHero({ data }: { data: PageData }) {
    if (!data?.hero) return null;

    const { hero } = data;

    const headlineHtml = typeof hero.headline === 'string' 
        ? hero.headline 
        : (hero.headline as any)?.text || '';

    const descriptionHtml = typeof hero.description === 'string'
        ? hero.description
        : (hero.description as any)?.text || '';

    return (
        <section className="relative w-full min-h-[50vh] md:min-h-[70vh] flex items-center justify-center pt-20 pb-12 md:pt-28 md:pb-20 lg:pt-32 lg:pb-28 px-4 sm:px-6 overflow-hidden isolate">
            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center w-full">
                {hero.top_badge && (
                    <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-gray-200 bg-white/80 shadow-sm mb-6 md:mb-8 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse"></span>
                        <span className="text-xs sm:text-sm font-semibold text-text-secondary tracking-wide">{hero.top_badge}</span>
                    </div>
                )}
                
                {headlineHtml && (
                    <h1 
                        className="w-full text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-text-primary mb-6 md:mb-8 tracking-tight md:tracking-tighter leading-[1.15] sm:leading-[1.1] !whitespace-normal ![&_*]:whitespace-normal ![&_*]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: headlineHtml.replace(/&nbsp;/g, ' ') }} 
                    />
                )}
                
                {descriptionHtml && (
                    <div 
                        className="w-full text-base sm:text-xl md:text-3xl text-text-secondary font-medium max-w-3xl mb-8 md:mb-12 leading-relaxed px-2 sm:px-4 overflow-hidden !whitespace-normal ![&_*]:whitespace-normal ![&_*]:max-w-full"
                        dangerouslySetInnerHTML={{ __html: descriptionHtml.replace(/&nbsp;/g, ' ') }}
                    />
                )}
                
                {hero.key_highlights && hero.key_highlights.length > 0 && (
                    <div className="w-full flex justify-center mb-8 md:mb-10 px-2">
                        <div className="inline-flex flex-wrap items-center justify-center gap-x-2 gap-y-1 sm:gap-4 md:gap-6 text-[11px] sm:text-xs md:text-base text-text-primary font-bold tracking-wide glass-card px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl w-full sm:w-auto">
                            {hero.key_highlights.map((stat: string, idx: number) => (
                                <React.Fragment key={idx}>
                                    <span 
                                        className="whitespace-normal sm:whitespace-nowrap [&_p]:inline [&_p]:m-0 [&_a]:underline [&_a]:text-accent-blue"
                                        dangerouslySetInnerHTML={{ __html: (stat || '').replace(/&nbsp;/g, ' ') }}
                                    />
                                    {idx < hero.key_highlights.length - 1 && (
                                        <span className="text-accent-violet font-extrabold opacity-50 sm:opacity-100 shrink-0">•</span>
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
