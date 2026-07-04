'use client';

export function WorkshopOutcome() {
    return (
        <section className="py-16 md:py-24 relative z-10" id="outcome">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6">A Tale of Two Founders</h2>
                    <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-light">In the startup ecosystem, there are two types of founders. Which outcome do you want?</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 lg:gap-12 relative">
                    <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-px bg-gradient-to-r from-slate-700 via-[#8b5cf6] to-[#d946ef] z-0" />

                    {/* Founder 1 */}
                    <div className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden z-10 border-t-0 border-l-0 border-r-0 border-b-4 border-b-slate-700 hover:border-b-slate-500 transition-colors bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-functional-border shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
                        <div className="absolute top-0 right-0 p-4 md:p-6 opacity-5 text-slate-500">
                            <i className="fa-solid fa-xmark text-6xl md:text-8xl" />
                        </div>
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-functional-border">
                            <i className="fa-solid fa-user-astronaut text-text-secondary text-xl md:text-2xl" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-text-primary">Founder 1: Passionate but Unprepared</h3>
                        <p className="text-sm md:text-base text-text-secondary mb-6 md:mb-8 font-light">Builds relentlessly but feels completely lost when it&apos;s time to raise capital.</p>
                        <ul className="space-y-4 md:space-y-5">
                            {['Walks into investor meetings armed with a vision, but no structured narrative.', 'Stumbles over basic unit economics and dreads the "Data Room" request.', "Often faces rejection or signs restrictive deals because they don't know the rules of the game."].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 md:gap-4">
                                    <div className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-functional-border">
                                        <i className="fa-solid fa-xmark text-slate-500 text-[10px] md:text-xs" />
                                    </div>
                                    <span className="text-sm md:text-base text-text-secondary font-light leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Founder 2 */}
                    <div className="rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-10 relative overflow-hidden z-10 shadow-[0_10px_30px_-10px_rgba(139,92,246,0.3)] md:shadow-[0_20px_50px_-15px_rgba(139,92,246,0.3)] bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border-2 border-[#8b5cf6]/40">
                        <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10">
                            <i className="fa-solid fa-check text-6xl md:text-8xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent" />
                        </div>
                        <div className="absolute -top-16 -right-16 md:-top-24 md:-right-24 w-32 h-32 md:w-48 md:h-48 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[60px] md:blur-[80px] opacity-40" />
                        <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-2xl flex items-center justify-center mb-6 md:mb-8 shadow-lg shadow-[#8b5cf6]/50">
                            <i className="fa-solid fa-user-tie text-text-primary text-xl md:text-2xl" />
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-text-primary">Founder 2: The Prepared Architect</h3>
                        <p className="text-sm md:text-base text-[#d946ef] mb-6 md:mb-8 font-medium">Builds an investable company structure, not just a great product.</p>
                        <ul className="space-y-4 md:space-y-5">
                            {["Understands Term Sheets and uses financial models to prove growth.", <span key="b">Walks into the room knowing <strong className="text-text-primary">90% of what investors will ask</strong> before they open their mouths.</span>, "Doesn't just ask for money—they negotiate a strategic partnership from a place of leverage."].map((item, i) => (
                                <li key={i} className="flex items-start gap-3 md:gap-4">
                                    <div className="mt-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#8b5cf6]/20 flex items-center justify-center shrink-0 border border-[#8b5cf6]/30">
                                        <i className="fa-solid fa-check text-[#d946ef] text-[10px] md:text-xs" />
                                    </div>
                                    <span className="text-sm md:text-base text-text-primary font-light leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}
