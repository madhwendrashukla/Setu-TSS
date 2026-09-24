"use client";
import React from 'react';
import { PageData, WorkshopData } from '@/types/cms';

export function DynamicPricing({ data, onCheckoutClick }: { data: PageData, onCheckoutClick?: (id: string) => void }) {
    const pricingItems = data?.pricing_options || data?.workshops || [];
    if (pricingItems.length === 0) return null;

    // Filter visible items
    const visibleItems = pricingItems.filter((item: any) => item.visible !== false);
    if (visibleItems.length === 0) return null;

    // Sort by priority_order
    const sortedItems = [...visibleItems].sort((a: any, b: any) => (a.priority_order || 0) - (b.priority_order || 0));

    const decodeHtmlEntities = (str: string): string => {
        if (!str) return '';
        return str
            .replace(/&nbsp;/gi, ' ')
            .replace(/&amp;/gi, '&')
            .replace(/&quot;/gi, '"')
            .replace(/&#39;|&apos;|&#x27;/gi, "'")
            .replace(/&lt;/gi, '<')
            .replace(/&gt;/gi, '>')
            .replace(/&#160;/gi, ' ')
            .replace(/&#(\d+);/g, (_, dec) => {
                try {
                    return String.fromCharCode(parseInt(dec, 10));
                } catch {
                    return '';
                }
            })
            .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
                try {
                    return String.fromCharCode(parseInt(hex, 16));
                } catch {
                    return '';
                }
            });
    };

    const cleanFeatureItem = (item: string): string => {
        let text = decodeHtmlEntities(item);
        // Strip any HTML tags
        text = text.replace(/<[^>]*>/g, ' ');
        // Decode entities again in case entities were inside tags or nested
        text = decodeHtmlEntities(text);
        // Remove leading bullet characters / dashes / list counters
        text = text.replace(/^[\s•·●▪▫◆✦✓✔★\-\*–—\d+\.\)]+/, '');
        // Collapse multiple whitespace
        text = text.replace(/\s+/g, ' ').trim();
        return text;
    };

    const parseFeatures = (featuresStr?: string): string[] => {
        if (!featuresStr || typeof featuresStr !== 'string') return [];

        let raw = featuresStr.trim();
        if (!raw) return [];

        // If it contains <li> tags, extract each <li> item
        if (/<li[^>]*>/i.test(raw)) {
            const matches = raw.match(/<li[^>]*>([\s\S]*?)<\/li>/gi);
            if (matches && matches.length > 0) {
                return matches
                    .map(m => cleanFeatureItem(m))
                    .filter(Boolean);
            }
        }

        // Convert block-level closing/opening tags and line breaks to newlines before stripping tags
        let normalized = raw
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/(p|div|h[1-6]|tr|li|section|article)>/gi, '\n')
            .replace(/<(p|div|h[1-6]|tr|li|section|article)[^>]*>/gi, '\n');

        // Strip remaining HTML tags
        normalized = normalized.replace(/<[^>]*>/g, ' ');
        // Decode entities
        normalized = decodeHtmlEntities(normalized);

        // Split on newlines
        const lines = normalized
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        // If any line contains middle dots or bullets, split them
        const items: string[] = [];
        for (const line of lines) {
            if (/[·•●▪▫◆✦]/.test(line)) {
                const subItems = line.split(/[·•●▪▫◆✦]/);
                items.push(...subItems);
            } else {
                items.push(line);
            }
        }

        // Clean and normalize each item
        let cleaned = items
            .map(item => cleanFeatureItem(item))
            .filter(Boolean);

        // Fallback: If only 1 line was found but it contains comma-separated phrases
        if (cleaned.length === 1 && cleaned[0].includes(',')) {
            const commaSplit = cleaned[0]
                .split(',')
                .map(s => cleanFeatureItem(s))
                .filter(Boolean);
            if (commaSplit.length > 1) {
                return commaSplit;
            }
        }

        return cleaned;
    };

    const getBulletMeta = (text: string, index: number) => {
        const lower = text.toLowerCase();
        if (lower.includes('am') || lower.includes('pm') || lower.includes('time') || lower.includes('ist') || lower.includes('hour')) {
            return { icon: 'far fa-clock', bg: 'bg-purple-100/80 text-purple-600' };
        }
        if (lower.includes('zoom') || lower.includes('online') || lower.includes('meet') || lower.includes('laptop') || lower.includes('live')) {
            return { icon: 'fas fa-video', bg: 'bg-emerald-100/80 text-emerald-600' };
        }
        if (lower.includes('venue') || lower.includes('hall') || lower.includes('offline') || lower.includes('map') || lower.includes('campus') || lower.includes('address')) {
            return { icon: 'fas fa-map-marker-alt', bg: 'bg-rose-100/80 text-rose-600' };
        }
        if (index === 0 || lower.includes('202') || lower.includes('day') || lower.includes('month') || lower.includes('september')) {
            return { icon: 'far fa-calendar-alt', bg: 'bg-blue-100/80 text-blue-600' };
        }
        return { icon: 'fas fa-info', bg: 'bg-slate-100 text-slate-600' };
    };

    return (
        <section className="py-24 bg-slate-50 relative" id="pricing">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                        {data.registrations_open !== false ? 'Pricing & Registration' : 'Workshop Details'}
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {data.registrations_open !== false
                            ? 'Select the option that fits your goals and reserve your seat today. Limited spots available.'
                            : 'Registrations for this event are now closed.'}
                    </p>
                </div>

                <div className="flex flex-wrap justify-center gap-8 items-stretch">
                    {sortedItems.map((item: any, idx: number) => {
                        const features = parseFeatures(item.key_features);
                        const dateBullets = item.pricing?.date_time_bullets || [];

                        return (
                            <div 
                                key={item.id || idx} 
                                className={`w-full ${sortedItems.length === 1 ? 'max-w-[420px]' : 'max-w-sm md:w-[380px]'} bg-white rounded-3xl overflow-hidden shadow-xl border ${idx === sortedItems.length - 1 && sortedItems.length > 1 ? 'border-blue-400 ring-2 ring-blue-400/20' : 'border-slate-200'} flex flex-col hover:shadow-2xl transition-all duration-300 relative`}
                            >
                                {idx === sortedItems.length - 1 && sortedItems.length > 1 && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-bl-xl z-10 uppercase tracking-wider shadow-sm">
                                        Best Value
                                    </div>
                                )}
                                
                                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>
                                
                                <div className="p-7 sm:p-8 flex-1 flex flex-col">
                                    {/* Header: Centered Tag & Title */}
                                    <div className="text-center mb-5">
                                        {item.heading && (
                                            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[11px] tracking-wider uppercase mb-3 border border-blue-200/60 shadow-2xs">
                                                {decodeHtmlEntities(item.heading).replace(/<[^>]*>/g, '')}
                                            </div>
                                        )}
                                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight tracking-tight">
                                            {decodeHtmlEntities(item.title).replace(/<[^>]*>/g, '')}
                                        </h3>
                                    </div>

                                    {/* Centered Pricing Display */}
                                    {data.registrations_open !== false && (
                                        <div className="text-center mb-6 pb-6 border-b border-slate-100 flex flex-col items-center justify-center">
                                            {(item.pricing?.strike_price || 0) > 0 && (
                                                <div className="flex items-center justify-center gap-2 mb-1.5">
                                                    <span className="text-base text-slate-400 line-through font-semibold">
                                                        ₹{item.pricing.strike_price}
                                                    </span>
                                                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Save ₹{item.pricing.strike_price - (item.pricing?.actual_price || 0)}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex items-baseline justify-center gap-1.5">
                                                <span className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight">
                                                    ₹{item.pricing?.actual_price ?? 0}
                                                </span>
                                                {(item.pricing?.actual_price ?? 0) === 0 ? (
                                                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                                                        Free
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                                        / pass
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {/* Session Details Box (Clean aligned icon column) */}
                                    {(dateBullets.length > 0 || item.date_time_html || item.pricing?.mode) && (
                                        <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-100/90 mb-6 space-y-3">
                                            {item.date_time_html ? (
                                                <div 
                                                    className="pricing-datetime text-sm text-slate-600"
                                                    dangerouslySetInnerHTML={{ __html: item.date_time_html }}
                                                />
                                            ) : dateBullets.length > 0 ? (
                                                dateBullets.map((dt: string, i: number) => {
                                                    const meta = getBulletMeta(dt, i);
                                                    return (
                                                        <div key={i} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                                                            <div className={`w-8 h-8 rounded-xl ${meta.bg} flex items-center justify-center shrink-0 shadow-2xs`}>
                                                                <i className={`${meta.icon} text-xs`}></i>
                                                            </div>
                                                            <span className="flex-1 leading-snug" dangerouslySetInnerHTML={{ __html: dt }} />
                                                        </div>
                                                    );
                                                })
                                            ) : null}

                                            {item.pricing?.mode === 'offline' && item.pricing?.address && (
                                                <div className="flex items-center gap-3 text-sm text-slate-700 font-medium pt-2 border-t border-slate-200/60">
                                                    <div className="w-8 h-8 rounded-xl bg-rose-100/80 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                                                        <i className="fas fa-map-marker-alt text-xs"></i>
                                                    </div>
                                                    <span className="text-xs text-slate-600 leading-snug">{decodeHtmlEntities(item.pricing.address).replace(/<[^>]*>/g, '')}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Features Checklist */}
                                    {features.length > 0 && (
                                        <div className="space-y-2.5 mb-6 flex-1 px-1">
                                            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                                What&apos;s Included:
                                            </div>
                                            {features.map((feat, i) => (
                                                <div key={i} className="flex items-start gap-2.5 text-sm text-slate-700 font-medium">
                                                    <i className="fas fa-circle-check text-emerald-500 text-sm mt-0.5 shrink-0"></i>
                                                    <span className="leading-snug">{feat}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* CTA Footer Button */}
                                <div className="p-6 bg-slate-50 border-t border-slate-100 mt-auto">
                                    {data.registrations_open !== false ? (
                                        <button 
                                            onClick={() => onCheckoutClick && onCheckoutClick(item.id)}
                                            className="w-full py-3.5 rounded-xl font-bold text-base bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-500/20 hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 group cursor-pointer"
                                        >
                                            <span>
                                                {(item.pricing?.actual_price ?? 0) === 0
                                                    ? (item.cta?.text || 'Reserve a spot')
                                                    : (item.cta?.text || 'Book Your Seat Now')}
                                            </span>
                                            <i className="fas fa-arrow-right text-xs transition-transform duration-200 group-hover:translate-x-1"></i>
                                        </button>
                                    ) : (
                                        <div className="w-full py-3.5 rounded-xl font-bold text-base bg-slate-800 text-slate-400 text-center cursor-not-allowed opacity-90">
                                            Registration Closed
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
