"use client";
import React, { useState } from 'react';
import { PageData, FAQData } from '@/types/cms';

export function DynamicFAQ({ data }: { data: PageData }) {
    if (!data?.faqs || data.faqs.length === 0) return null;

    const visibleFaqs = data.faqs.filter((f: FAQData) => f.visible !== false).sort((a, b) => (a.priority_order || 0) - (b.priority_order || 0));
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    if (visibleFaqs.length === 0) return null;

    return (
        <section className="py-24 bg-slate-50 relative">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
                </div>

                <div className="space-y-4">
                    {visibleFaqs.map((faq: FAQData, idx: number) => {
                        const isOpen = openIndex === idx;
                        return (
                            <div key={faq.id || idx} className={`bg-white border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-blue-500 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}>
                                <button 
                                    onClick={() => setOpenIndex(isOpen ? null : idx)}
                                    className="w-full text-left p-6 flex justify-between items-center focus:outline-none"
                                >
                                    <h3 className={`text-lg font-bold pr-8 ${isOpen ? 'text-blue-700' : 'text-slate-800'}`}>
                                        {faq.question}
                                    </h3>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'bg-blue-100 text-blue-600 rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                                        <i className="fas fa-chevron-down text-sm"></i>
                                    </div>
                                </button>
                                
                                <div 
                                    className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                                >
                                    <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 mt-2"
                                         dangerouslySetInnerHTML={{ __html: faq.answer }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
