"use client";
import React from 'react';
import { PageData, MentorData } from '@/types/cms';

export function DynamicMentors({ data }: { data: PageData }) {
    if (!data?.mentors || !data.mentors.items || data.mentors.items.length === 0) return null;

    const { mentors } = data;
    const visibleMentors = mentors.items.filter((m: MentorData) => m.visible !== false);
    
    if (visibleMentors.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {mentors.section_headline && (
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">{mentors.section_headline}</h2>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleMentors.map((mentor: MentorData, idx: number) => (
                        <div key={mentor.id || idx} className="bg-white rounded-[24px] overflow-hidden shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 p-8 flex flex-col items-start text-left">
                            
                            {mentor.image_url && (
                                <div className="relative mb-6 rounded-2xl p-[3px] bg-gradient-to-r from-purple-500 to-indigo-500 inline-block shadow-sm">
                                    <img src={mentor.image_url} alt={mentor.name} className="w-20 h-20 rounded-xl object-cover border-[3px] border-white bg-white" />
                                </div>
                            )}
                            
                            {mentor.badge_text && (
                                <div className="bg-purple-100 text-purple-800 text-[10px] font-bold px-3 py-1.5 rounded-md mb-4 tracking-wider uppercase border border-purple-200">
                                    {mentor.badge_text}
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">{mentor.name}</h3>
                            
                            {mentor.professional_headline && (
                                <p className="text-purple-600 font-bold mb-4 text-sm">{mentor.professional_headline}</p>
                            )}
                            
                            {mentor.professional_description && (
                                <div 
                                    className="text-slate-600 text-sm leading-relaxed mb-6"
                                    dangerouslySetInnerHTML={{ __html: mentor.professional_description }}
                                />
                            )}
                            
                            {mentor.credential_bullets && mentor.credential_bullets.length > 0 && (
                                <ul className="space-y-3 mt-auto w-full">
                                    {mentor.credential_bullets.map((bullet: string, bIdx: number) => (
                                        <li key={bIdx} className="flex gap-3 text-sm font-medium text-slate-700">
                                            <i className="fas fa-check-circle text-purple-500 shrink-0 mt-0.5 text-base"></i>
                                            <span dangerouslySetInnerHTML={{ __html: bullet }} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
