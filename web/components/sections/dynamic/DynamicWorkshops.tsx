"use client";
import React from 'react';
import { PageData, WorkshopData } from '@/types/cms';

export function DynamicWorkshops({ data, onCheckoutClick }: { data: PageData, onCheckoutClick: (id: string) => void }) {
    if (!data?.workshops || data.workshops.length === 0) return null;

    // Sort by priority_order
    const sortedWorkshops = [...data.workshops].sort((a, b) => (a.priority_order || 0) - (b.priority_order || 0));

    return (
        <section className="py-24 bg-slate-50 relative" id="workshops">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="space-y-16">
                    {sortedWorkshops.map((workshop: WorkshopData, idx: number) => {
                        if (!workshop.visible) return null;

                        return (
                            <div key={workshop.id || idx} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                                <div className="flex flex-col lg:flex-row">
                                    {/* Left: Workshop Details */}
                                    <div className="w-full lg:w-3/5 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-200">
                                        {workshop.heading && (
                                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100 text-blue-700 font-bold text-sm tracking-widest uppercase mb-6">
                                                {workshop.heading}
                                            </div>
                                        )}
                                        <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6">{workshop.title}</h3>
                                        
                                        {workshop.key_features && (
                                            <div 
                                                className="text-lg text-slate-600 mb-8"
                                                dangerouslySetInnerHTML={{ __html: workshop.key_features }}
                                            />
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {workshop.detail_bullets?.what_youll_learn && workshop.detail_bullets.what_youll_learn.length > 0 && (
                                                <div>
                                                    <h4 className="font-bold text-slate-900 mb-4 text-lg border-b pb-2">What You'll Learn</h4>
                                                    <ul className="space-y-3">
                                                        {workshop.detail_bullets.what_youll_learn.map((item, i) => (
                                                            <li key={i} className="flex gap-3 text-sm text-slate-600">
                                                                <i className="fas fa-arrow-right text-blue-500 mt-1 shrink-0"></i>
                                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {workshop.detail_bullets?.your_deliverables && workshop.detail_bullets.your_deliverables.length > 0 && (
                                                <div>
                                                    <h4 className="font-bold text-slate-900 mb-4 text-lg border-b pb-2">Your Deliverables</h4>
                                                    <ul className="space-y-3">
                                                        {workshop.detail_bullets.your_deliverables.map((item, i) => (
                                                            <li key={i} className="flex gap-3 text-sm text-slate-600">
                                                                <i className="fas fa-cube text-purple-500 mt-1 shrink-0"></i>
                                                                <span dangerouslySetInnerHTML={{ __html: item }} />
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right: Pricing & CTA */}
                                    <div className="w-full lg:w-2/5 bg-slate-900 p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
                                        
                                        <div className="relative z-10 text-center">
                                            <div className="mb-6 flex items-center justify-center gap-3">
                                                {workshop.pricing?.strike_price && (
                                                    <span className="text-xl md:text-2xl text-slate-400 line-through font-medium">₹{workshop.pricing.strike_price}</span>
                                                )}
                                                <span className="text-4xl md:text-6xl font-extrabold text-white">₹{workshop.pricing?.actual_price}</span>
                                            </div>

                                            <div className="space-y-4 mb-8 text-slate-300">
                                                {workshop.pricing?.date_time_bullets && workshop.pricing.date_time_bullets.map((dt, i) => (
                                                    <div key={i} className="flex items-center justify-center gap-2">
                                                        <i className="far fa-calendar-alt text-blue-400 w-5"></i>
                                                        <span dangerouslySetInnerHTML={{ __html: dt }} />
                                                    </div>
                                                ))}
                                                <div className="flex items-center justify-center gap-2">
                                                    <i className={`fas fa-${workshop.pricing?.mode === 'offline' ? 'map-marker-alt' : 'laptop'} text-purple-400 w-5`}></i>
                                                    <span className="capitalize">{workshop.pricing?.mode}</span>
                                                </div>
                                                {workshop.pricing?.mode === 'offline' && workshop.pricing?.address && (
                                                    <div className="text-sm mt-2">{workshop.pricing.address}</div>
                                                )}
                                            </div>

                                            {workshop.cta?.active ? (
                                                <button 
                                                    onClick={() => onCheckoutClick(workshop.id)}
                                                    className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                                                >
                                                    {workshop.cta.text || "Book Your Seat Now"}
                                                </button>
                                            ) : (
                                                <div className="w-full py-4 rounded-xl font-bold text-lg bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed">
                                                    Registrations Closed
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
