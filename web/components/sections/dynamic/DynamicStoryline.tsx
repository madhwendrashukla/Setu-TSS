"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicStoryline({ data }: { data: PageData }) {
    if (!data?.story || !data.story.visible) return null;

    const { story } = data;

    return (
        <section className="py-20 bg-slate-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {story.headline && (
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">{story.headline}</h2>
                    )}
                    {story.description && (
                        <div 
                            className="text-lg text-slate-600"
                            dangerouslySetInnerHTML={{ __html: story.description }}
                        />
                    )}
                </div>

                {story.boxes && story.boxes.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {story.boxes.map((box: any, idx: number) => (
                            <div key={idx} className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-shadow relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{box.title}</h3>
                                <p className="text-sm text-slate-500 mb-6 pb-6 border-b border-slate-100">{box.description}</p>
                                
                                <ul className="space-y-4">
                                    {box.bullets && box.bullets.map((bullet: any, bIdx: number) => (
                                        <li key={bIdx} className="flex items-start gap-3">
                                            {bullet.style === 'check' ? (
                                                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <i className="fas fa-check text-[10px] text-green-600"></i>
                                                </div>
                                            ) : (
                                                <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                                                    <i className="fas fa-times text-[10px] text-red-600"></i>
                                                </div>
                                            )}
                                            <span className={`text-sm ${bullet.style === 'check' ? 'text-slate-700' : 'text-slate-500 line-through'}`}>{bullet.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
