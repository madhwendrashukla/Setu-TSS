"use client";
import React from 'react';
import { PageData, MentorData } from '@/types/cms';

export function DynamicMentors({ data }: { data: PageData }) {
    if (!data?.mentors || !data.mentors.items || data.mentors.items.length === 0) return null;

    const { mentors } = data;
    const visibleMentors = mentors.items.filter((m: MentorData) => m.visible !== false);
    
    if (visibleMentors.length === 0) return null;

    return (
        <section className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {mentors.section_headline && (
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">{mentors.section_headline}</h2>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleMentors.map((mentor: MentorData, idx: number) => (
                        <div key={mentor.id || idx} className="bg-slate-50 rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                            <div className="relative h-72 w-full bg-slate-200">
                                {mentor.image_url ? (
                                    <img src={mentor.image_url} alt={mentor.name} className="absolute inset-0 w-full h-full object-cover object-center" />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
                                
                                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{mentor.name}</h3>
                                    <p className="text-blue-300 font-medium">{mentor.professional_headline}</p>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                {mentor.professional_description && (
                                    <div 
                                        className="text-slate-600 mb-6 text-sm leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: mentor.professional_description }}
                                    />
                                )}
                                
                                {mentor.credential_bullets && mentor.credential_bullets.length > 0 && (
                                    <ul className="space-y-3">
                                        {mentor.credential_bullets.map((bullet: string, bIdx: number) => (
                                            <li key={bIdx} className="flex gap-3 text-sm font-medium text-slate-700">
                                                <i className="fas fa-check-circle text-purple-500 shrink-0 mt-0.5 text-base"></i>
                                                <span dangerouslySetInnerHTML={{ __html: bullet }} />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
