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
                            <div key={item.id || idx} className={`bg-white rounded-3xl overflow-hidden shadow-xl border ${idx === sortedItems.length - 1 && sortedItems.length > 1 ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'} flex flex-col hover:shadow-2xl transition-shadow relative`}>
                                
                                {idx === sortedItems.length - 1 && sortedItems.length > 1 && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-10 uppercase tracking-wider shadow-sm">
                                        Best Value
                                    </div>
                                )}
                                
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="mb-6">
                                        {item.heading && (
                                            <div className="inline-block px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-bold text-[10px] tracking-widest uppercase mb-4 border border-slate-200">
                                                {item.heading}
                                            </div>
                                        )}
                                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{item.title}</h3>
                                    </div>

                                    <div className="mb-6 pb-6 border-b border-slate-100">
                                        <div className="flex flex-col gap-1">
                                            {(item.pricing?.strike_price || 0) > 0 && (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-lg text-slate-400 line-through font-medium">₹{item.pricing.strike_price}</span>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm uppercase tracking-wider">Early Bird</span>
                                                </div>
                                            )}
                                            <div className="flex items-end gap-1 mt-1">
                                                <span className="text-5xl font-extrabold text-slate-900 tracking-tight">₹{item.pricing?.actual_price}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-6 text-slate-700 border-b border-slate-100 pb-6">
                                        {item.date_time_html ? (
                                            <div 
                                                className="pricing-datetime text-sm text-slate-600"
                                                dangerouslySetInnerHTML={{ __html: item.date_time_html }}
                                            />
                                        ) : item.pricing?.date_time_bullets && item.pricing.date_time_bullets.length > 0 ? (
                                            <ul className="pricing-datetime list-disc pl-4 text-sm space-y-1 text-slate-600">
                                                {item.pricing.date_time_bullets.map((dt: string, i: number) => (
                                                    <li key={i} dangerouslySetInnerHTML={{ __html: dt }} />
                                                ))}
                                            </ul>
                                        ) : null}

                                        <div className="flex items-start gap-3 mt-4 text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                            <i className={`fas fa-${item.pricing?.mode === 'offline' ? 'map-marker-alt' : 'laptop'} text-blue-500 mt-0.5`}></i>
                                            <div>
                                                <span className="capitalize font-medium text-slate-800">{item.pricing?.mode}</span>
                                                {item.pricing?.mode === 'offline' && item.pricing?.address && (
                                                    <div className="mt-0.5 text-xs">{item.pricing.address}</div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        {item.key_features && (
                                            <div 
                                                className="pricing-features text-sm text-slate-700"
                                                dangerouslySetInnerHTML={{ __html: item.key_features }}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                                    {data.registrations_open !== false ? (
                                        <button 
                                            onClick={() => onCheckoutClick && onCheckoutClick(item.id)}
                                            className="w-full py-3.5 rounded-xl font-bold text-base bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                                        >
                                            {item.cta?.text || "Book Your Seat Now"}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <div className="w-full py-3.5 rounded-xl font-bold text-base bg-slate-800 text-slate-400 text-center cursor-not-allowed opacity-90">
                                                Registration Closed
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
                .pricing-datetime p { margin-bottom: 0.5rem; }
                .pricing-datetime p:last-child { margin-bottom: 0; }
                .pricing-datetime ul { list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .pricing-datetime li { margin-bottom: 0.25rem; }
                
                .pricing-features p { margin-bottom: 0.5rem; }
                .pricing-features ul { list-style: none; padding-left: 0; margin-top: 0.5rem; margin-bottom: 0.5rem; }
                .pricing-features li { 
                    position: relative; 
                    padding-left: 1.75rem; 
                    margin-bottom: 0.75rem; 
                    color: #475569;
                    font-size: 0.875rem;
                }
                .pricing-features li::before {
                    content: '✓';
                    position: absolute;
                    left: 0;
                    top: 0;
                    color: #3b82f6;
                    font-weight: bold;
                }
            `}} />
        </section>
    );
}
