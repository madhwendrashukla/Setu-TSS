"use client";

import React, { useState } from 'react';
import { PageData } from '@/types/cms';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export function DynamicOutcomes({ data }: { data: PageData }) {
    const output = data?.output || (data as any);
    const [imageError, setImageError] = useState(false);

    if (!output || (!output.headline && (!output.bullets || output.bullets.length === 0))) {
        return null;
    }

    const cleanAlt = (output.headline || 'Workshop Outcomes')
        .replace(/&nbsp;/gi, ' ')
        .replace(/<[^>]*>?/gm, '')
        .trim();

    const showImage = Boolean(output.image_url && !imageError);

    return (
        <section className="py-12 sm:py-16 md:py-24 bg-white relative overflow-hidden" id="outcomes">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {showImage ? (
                    /* 2-Column Layout when Image is present */
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                        {/* Left: Image / Visual */}
                        <div className="w-full lg:w-5/12 flex justify-center items-center">
                            <div className="relative w-full max-w-[480px] aspect-[4/3] sm:aspect-square rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-slate-50 group">
                                <img 
                                    src={output.image_url} 
                                    alt={cleanAlt} 
                                    onError={() => setImageError(true)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                                />
                            </div>
                        </div>

                        {/* Right: Checklist & Headline */}
                        <div className="w-full lg:w-7/12 flex flex-col justify-center">
                            <div className="mb-3 sm:mb-4">
                                <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 shadow-2xs">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                    What You&apos;ll Take Away
                                </span>
                            </div>

                            {output.headline && (
                                <div 
                                    className="text-xl sm:text-3xl md:text-4xl lg:text-[40px] font-black text-slate-900 mb-5 sm:mb-8 leading-[1.2] tracking-tight [&_p]:m-0 [&_span]:text-purple-600"
                                    dangerouslySetInnerHTML={{ __html: output.headline }}
                                />
                            )}
                            
                            <div className="space-y-3 sm:space-y-4">
                                {output.bullets && output.bullets.map((bullet: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-3 sm:gap-4 p-2 sm:p-3 rounded-xl sm:rounded-2xl hover:bg-slate-50 transition-colors group">
                                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 border border-purple-200/70 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 shadow-2xs">
                                            <i className="fas fa-check text-xs sm:text-sm text-purple-600 group-hover:text-white transition-colors"></i>
                                        </div>
                                        <div 
                                            className="text-sm sm:text-base md:text-lg text-slate-700 leading-relaxed font-medium [&_p]:m-0 [&_p]:inline"
                                            dangerouslySetInnerHTML={{ __html: bullet }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Centered Layout when No Image is present or image failed to load */
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-8 sm:mb-10">
                            <span className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-extrabold uppercase tracking-wider bg-purple-100 text-purple-700 border border-purple-200 mb-3 shadow-2xs">
                                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                                What You&apos;ll Take Away
                            </span>

                            {output.headline && (
                                <div 
                                    className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 mt-2 leading-[1.2] tracking-tight [&_p]:m-0 [&_span]:text-purple-600"
                                    dangerouslySetInnerHTML={{ __html: output.headline }}
                                />
                            )}
                        </div>

                        <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                            {output.bullets && output.bullets.map((bullet: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-3 sm:gap-4 p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-slate-50/80 border border-slate-200/80 hover:border-purple-200 hover:bg-purple-50/30 transition-all duration-300 shadow-2xs group">
                                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 border border-purple-200/70 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-300 shadow-2xs">
                                        <i className="fas fa-check text-xs sm:text-sm text-purple-600 group-hover:text-white transition-colors"></i>
                                    </div>
                                    <div 
                                        className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium [&_p]:m-0 [&_p]:inline"
                                        dangerouslySetInnerHTML={{ __html: bullet }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
