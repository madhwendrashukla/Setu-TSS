'use client';

export function WorkshopPricing() {

    return (
        <section className="py-16 md:py-32 relative" id="pricing">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] md:h-[500px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[150px] md:blur-[200px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 md:mb-8">Cohorts & Pricing</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 max-w-5xl mx-auto">
                    {/* Basic Pricing */}
                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-functional-border rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col hover:border-functional-border transition-all duration-300 relative overflow-hidden">
                        <div className="mb-5 border-b border-functional-border pb-5">
                            <div className="inline-block px-3 py-1 bg-slate-800 text-text-secondary font-bold rounded-lg text-[10px] mb-3 border border-functional-border">LEVEL 1</div>
                            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Basic Cohort</h3>
                            <p className="text-sm md:text-base text-text-secondary font-medium">The basics of capital and readiness.</p>
                        </div>
                        <div className="mb-6 flex items-center flex-wrap gap-3">
                            <span className="text-slate-500 line-through text-xl font-medium">₹3,500</span>
                            <span className="text-text-primary text-4xl md:text-5xl font-extrabold">₹999</span>
                        </div>
                        <ul className="mb-8 space-y-4 md:space-y-5 flex-1">
                            <li className="flex items-start gap-3 md:gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-calendar text-[#8b5cf6] text-sm" />
                                </div>
                                <div><span className="text-sm md:text-base font-bold block text-text-primary">15th, 16th, 17th April</span></div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-clock text-[#8b5cf6] text-sm" />
                                </div>
                                <div>
                                    <span className="text-sm md:text-base font-bold block text-text-primary">6:00 PM - 9:00 PM</span>
                                    <span className="text-xs text-text-secondary block">Live on Zoom</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4 mt-6 bg-white/5 p-3 md:p-4 rounded-xl border border-functional-border">
                                <i className="fa-solid fa-circle-info text-[#8b5cf6] mt-0.5 text-lg shrink-0" />
                                <span className="text-xs md:text-sm text-text-secondary font-light leading-relaxed">Less than the cost of a weekend dinner to learn the exact financial language required to build an investable company.</span>
                            </li>
                        </ul>
                        <div className="mt-auto w-full">
                            <button disabled className="w-full py-4 rounded-xl bg-slate-800/50 text-text-secondary font-bold border border-functional-border cursor-not-allowed flex items-center justify-center gap-2">
                                <i className="fa-solid fa-lock text-slate-500" /> Registrations Closed
                            </button>
                        </div>
                    </div>

                    {/* Advanced Pricing */}
                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border-2 border-[#8b5cf6]/40 rounded-2xl md:rounded-3xl p-6 md:p-8 flex flex-col hover:shadow-[0_0_30px_rgba(217,70,239,0.2)] transition-all duration-300 mt-4 md:mt-0 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-text-primary text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg">Best Value</div>
                        <div className="mb-5 border-b border-functional-border pb-5">
                            <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-text-primary font-bold rounded-lg text-[10px] mb-3 shadow-lg shadow-[#d946ef]/30">LEVEL 2</div>
                            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">Advanced Cohort</h3>
                            <p className="text-sm md:text-base text-[#d946ef] font-medium">Full deep dive + Special Benefits.</p>
                        </div>
                        <div className="mb-6 flex items-center flex-wrap gap-3">
                            <span className="text-slate-500 line-through text-xl font-medium">₹11,000</span>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-4xl md:text-5xl font-extrabold">₹3,500</span>
                        </div>
                        <ul className="mb-8 space-y-4 md:space-y-5 flex-1">
                            <li className="flex items-start gap-3 md:gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-calendar text-[#d946ef] text-sm" />
                                </div>
                                <div><span className="text-sm md:text-base font-bold block text-text-primary">15th, 16th, 17th April</span></div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-clock text-[#d946ef] text-sm" />
                                </div>
                                <div>
                                    <span className="text-sm md:text-base font-bold block text-text-primary">6:00 PM - 9:00 PM</span>
                                    <span className="text-xs text-text-secondary block">Live on Zoom</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4 border-t border-functional-border pt-4 mt-2">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-calendar text-[#d946ef] text-sm" />
                                </div>
                                <div><span className="text-sm md:text-base font-bold block text-text-primary">18th & 19th April</span></div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4">
                                <div className="mt-1 w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-functional-border shrink-0">
                                    <i className="fa-regular fa-clock text-[#d946ef] text-sm" />
                                </div>
                                <div>
                                    <span className="text-sm md:text-base font-bold block text-text-primary">10:00 AM - 1:30 PM & 3:00 PM to 6:30 PM</span>
                                    <span className="text-xs text-text-secondary block">Live on Zoom</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3 md:gap-4 mt-6 bg-[#d946ef]/10 p-3 md:p-4 rounded-xl border border-[#d946ef]/20 backdrop-blur-sm">
                                <i className="fa-solid fa-gift text-text-primary mt-0.5 text-lg shrink-0" />
                                <span className="text-xs md:text-sm text-text-primary font-medium leading-relaxed">Includes 100+ pitch decks, investor databases, and 1-year community membership.</span>
                            </li>
                        </ul>
                        <div className="mt-auto w-full">
                            <button disabled className="w-full py-4 rounded-xl bg-[#0f172a]/50 text-text-secondary font-bold border border-functional-border cursor-not-allowed flex items-center justify-center gap-2">
                                <i className="fa-solid fa-lock text-slate-500" /> Registrations Closed
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
