'use client';

import { WorkshopData } from '../../types/cms';

export function DynamicPricing({ data, onCheckoutClick }: { data: any, onCheckoutClick?: (workshopId: string) => void }) {
    if (!data) return null;
    
    // Use the unified workshops array and sort by priority_order, filter by visible
    const workshops: WorkshopData[] = (data.workshops || [])
        .filter((ws: WorkshopData) => ws.visible !== false)
        .sort((a: WorkshopData, b: WorkshopData) => (a.priority_order || 0) - (b.priority_order || 0));

    return (
        <section className="py-16 md:py-32 relative" id="pricing">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] md:h-[500px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-multiply filter blur-[150px] md:blur-[200px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">We Offer Customised Learning Path</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-6" />
                    <p className="text-slate-600 text-base md:text-lg font-light max-w-xl mx-auto">Individual workshops or the complete entrepreneurship bundle — you decide.</p>

                    {/* FOMO Early Bird Banner (could be driven by extras/coupons, hardcoding for now if requested, but leaving generic) */}
                    {data.coupon?.active && (
                        <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#d946ef]/40 bg-[#d946ef]/10 text-sm font-semibold text-[#f0abfc] animate-pulse">
                            <i className="fa-solid fa-bolt text-[#d946ef]" />
                            Use code {data.coupon.code} for {data.coupon.discount_percent}% off — grab your spot before prices go up!
                        </div>
                    )}
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto justify-center">
                    {workshops.map((ws, pi) => {
                        const isFeatured = ws.badge && ws.badge.toLowerCase().includes('offer');
                        
                        return (
                            <div
                                key={ws.id || pi}
                                className={`bg-white shadow-xl rounded-2xl md:rounded-3xl p-6 flex flex-col transition-all duration-300 relative overflow-hidden ${isFeatured ? 'border-2 border-[#8b5cf6]/50 shadow-[0_0_40px_rgba(217,70,239,0.15)] hover:shadow-[0_0_50px_rgba(217,70,239,0.25)]' : 'border border-slate-200 hover:border-slate-300'}`}
                            >
                                {isFeatured && (
                                    <div className="absolute top-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-slate-900 text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg">Featured</div>
                                )}
                                
                                <div className="mb-4">
                                    <div className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest text-slate-900 mb-2" style={{ background: isFeatured ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                                        {ws.heading || ws.badge}
                                    </div>
                                    <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-1 leading-tight">{ws.title}</h3>
                                    {ws.mentor && <p className="text-xs text-slate-600 font-light">by {ws.mentor}</p>}
                                </div>

                                {/* Pricing display */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 flex-wrap mb-1">
                                        <span className="text-slate-500 line-through text-base font-medium">₹{ws.pricing?.strike_price}</span>
                                        <span className="text-xs text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Early Bird</span>
                                    </div>
                                    <div className={`text-4xl md:text-5xl font-extrabold ${isFeatured ? 'bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent' : 'text-slate-900'}`}>
                                        ₹{ws.pricing?.actual_price}
                                    </div>
                                </div>

                                <div className="mb-5 space-y-1.5">
                                    {(ws.pricing?.date_time_bullets || []).map((dt, dti) => (
                                        <div key={dti} className="flex items-center gap-2 text-xs text-slate-600">
                                            <i className="fa-regular fa-clock text-[#8b5cf6]" /> {dt}
                                        </div>
                                    ))}
                                    <div className="flex items-center gap-2 text-xs text-slate-600 capitalize">
                                        <i className="fa-solid fa-location-dot text-[#8b5cf6]" /> {ws.pricing?.mode} {ws.pricing?.mode === 'offline' && ws.pricing.address ? `- ${ws.pricing.address}` : ''}
                                    </div>
                                </div>

                                {/* Detail Bullets repurposed for pricing features */}
                                <ul className="mb-6 space-y-2.5 flex-1">
                                    {(ws.detail_bullets?.your_deliverables || []).slice(0, 4).map((item, ii) => (
                                        <li key={ii} className="flex items-start gap-2">
                                            <i className="fa-solid fa-check mt-0.5 text-[10px] shrink-0" style={{ color: ws.color || '#8b5cf6' }} />
                                            <span 
                                                className="text-xs text-slate-600 font-light"
                                                dangerouslySetInnerHTML={{ __html: item }}
                                            />
                                        </li>
                                    ))}
                                </ul>

                                {/* CTA Button - Independent Toggle per workshop */}
                                <div className="mt-auto w-full">
                                    {ws.cta?.active ? (
                                        isFeatured ? (
                                            <div className="relative w-full group">
                                                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur opacity-50 group-hover:opacity-100 transition duration-300" />
                                                <button
                                                    onClick={() => onCheckoutClick && onCheckoutClick(ws.id)}
                                                    className="relative w-full block text-center px-4 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold transition-all text-base shadow-xl"
                                                >
                                                    {ws.cta?.text || 'Enroll Now'}
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onCheckoutClick && onCheckoutClick(ws.id)}
                                                className="w-full block text-center px-4 py-3.5 rounded-xl text-slate-900 font-bold transition-all text-sm border-2 border-[#8b5cf6] bg-white hover:bg-slate-50 shadow-md"
                                            >
                                                {ws.cta?.text || 'Enroll Now'}
                                            </button>
                                        )
                                    ) : (
                                        <>
                                            {isFeatured ? (
                                                <div className="relative w-full">
                                                    <span
                                                        className="relative w-full block text-center px-4 py-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-900/50 font-bold transition-all text-base cursor-not-allowed"
                                                    >
                                                        Sold Out
                                                    </span>
                                                </div>
                                            ) : (
                                                <span
                                                    className="w-full block text-center px-4 py-3.5 rounded-xl text-slate-900/50 font-bold transition-all text-sm border border-slate-200 bg-slate-100 cursor-not-allowed"
                                                >
                                                    Sold Out
                                                </span>
                                            )}
                                            <p className="text-[10px] text-slate-500 mt-2 text-center">Registrations Closed</p>
                                        </>
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
