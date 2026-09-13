"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicOutcomes({ data }: { data: PageData }) {
    if (!data?.output) return null;

    const { output } = data;

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Left: Graphic */}
                    {output.image_url && (
                        <div className="w-full lg:w-1/2 flex justify-center items-center">
                            <div className="relative w-full max-w-[500px] aspect-square rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 bg-white group flex items-center justify-center transition-all duration-300 hover:shadow-[0_20px_50px_rgba(139,92,246,0.15)]">
                                <img 
                                    src={output.image_url} 
                                    alt={output.headline ? output.headline.replace(/<[^>]*>?/gm, '') : "Workshop Overview"} 
                                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" 
                                />
                            </div>
                        </div>
                    )}

                    {/* Right: Checklist */}
                    <div className="w-full lg:w-1/2">
                        {output.headline && (
                            <div 
                                className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-10 leading-tight"
                                dangerouslySetInnerHTML={{ __html: output.headline }}
                            />
                        )}
                        
                        <div className="space-y-6">
                            {output.bullets && output.bullets.map((bullet: string, idx: number) => (
                                <div key={idx} className="flex items-start gap-5 group">
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1 group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300 shadow-sm">
                                        <i className="fas fa-check text-sm text-purple-600 group-hover:text-white transition-colors"></i>
                                    </div>
                                    <div 
                                        className="text-lg md:text-xl text-slate-700 leading-relaxed font-medium"
                                        dangerouslySetInnerHTML={{ __html: bullet }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
