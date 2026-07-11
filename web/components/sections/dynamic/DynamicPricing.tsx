"use client";
import React from 'react';
import { PageData, WorkshopData } from '@/types/cms';

export function DynamicPricing({ data, onCheckoutClick }: { data: PageData, onCheckoutClick?: (id: string) => void }) {
    const pricingItems = data?.pricing_options || data?.workshops || [];
    if (pricingItems.length === 0) return null;

    // Sort by priority_order
    const sortedItems = [...pricingItems].sort((a: any, b: any) => (a.priority_order || 0) - (b.priority_order || 0));

    return (
        <section className="py-24 bg-slate-50 relative" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">Pricing & Registration</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Select the option that fits your goals and reserve your seat today. Limited spots available.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
                    {sortedItems.map((item: any, idx: number) => {
                        if (!item.visible) return null;

                        return (
                            <div key={item.id || idx} className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-200 flex flex-col hover:shadow-2xl transition-shadow relative">
                                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                
                                <div className="p-8 flex-1">
                                    {item.heading && (
                                        <div className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-bold text-xs tracking-widest uppercase mb-4">
                                            {item.heading}
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{item.title}</h3>
                                    {item.key_features && (
                                        <div 
                                            className="text-sm text-slate-600 mb-6"
                                            dangerouslySetInnerHTML={{ __html: item.key_features }}
                                        />
                                    )}

                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <div className="flex items-end gap-3 mb-1">
                                            {item.pricing?.strike_price && (
                                                <span className="text-xl text-slate-400 line-through font-medium">₹{item.pricing.strike_price}</span>
                                            )}
                                            <span className="text-5xl font-extrabold text-slate-900">₹{item.pricing?.actual_price}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8 text-slate-700">
                                        {item.pricing?.date_time_bullets && item.pricing.date_time_bullets.map((dt: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <i className="far fa-calendar-alt text-blue-500 mt-1"></i>
                                                <span dangerouslySetInnerHTML={{ __html: dt }} />
                                            </div>
                                        ))}
                                        <div className="flex items-start gap-3">
                                            <i className={`fas fa-${item.pricing?.mode === 'offline' ? 'map-marker-alt' : 'laptop'} text-purple-500 mt-1`}></i>
                                            <div>
                                                <span className="capitalize font-medium">{item.pricing?.mode}</span>
                                                {item.pricing?.mode === 'offline' && item.pricing?.address && (
                                                    <div className="text-sm text-slate-500 mt-1">{item.pricing.address}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 bg-slate-50 border-t border-slate-100 mt-auto">
                                    {item.cta?.active && onCheckoutClick ? (
                                        <button 
                                            onClick={() => onCheckoutClick(item.id)}
                                            className="w-full py-4 rounded-xl font-bold text-lg bg-slate-900 text-white hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all"
                                        >
                                            {item.cta.text || "Book Your Seat Now"}
                                        </button>
                                    ) : (
                                        <div className="w-full py-4 rounded-xl font-bold text-lg bg-slate-200 text-slate-500 text-center cursor-not-allowed">
                                            Registrations Closed
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
