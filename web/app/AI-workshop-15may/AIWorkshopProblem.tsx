'use client';

export function AIWorkshopProblem() {
    const painPoints = [
        {
            icon: 'fa-lightbulb',
            title: 'Great Ideas, Zero Validation',
            desc: 'You have brilliant ideas but don\'t know if they\'ll work in the real market. You\'re building in the dark.',
            color: '#8b5cf6',
        },
        {
            icon: 'fa-circle-play',
            title: 'Stuck in Tutorial Hell',
            desc: 'You\'ve watched 100+ YouTube videos about AI and startups but still haven\'t shipped anything tangible.',
            color: '#d946ef',
        },
        {
            icon: 'fa-map',
            title: 'No Clear Roadmap',
            desc: 'You know you need to start, but the path from idea to launch feels overwhelming and unclear.',
            color: '#8b5cf6',
        },
    ];

    return (
        <section className="py-16 md:py-24 relative z-10" id="problem">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 md:mb-6">Why Most Startup Dreams<br className="hidden md:block" /> Never Take Off</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                </div>

                <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-14 md:mb-20">
                    {painPoints.map((point, i) => (
                        <div key={i} className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-slate-700/50 rounded-2xl p-6 md:p-8 hover:border-slate-700/50 transition-all duration-300 group hover:-translate-y-1">
                            <div className="w-12 h-12 rounded-xl bg-[#8b5cf6]/10 flex items-center justify-center mb-5 border border-[#8b5cf6]/20 group-hover:scale-110 transition-transform">
                                <i className={`fa-solid ${point.icon} text-xl`} style={{ color: point.color }} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-slate-50 mb-3">{point.title}</h3>
                            <p className="text-sm md:text-base text-slate-300 font-light leading-relaxed">{point.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Transition */}
                <div className="relative group max-w-3xl mx-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
                    <div className="relative text-center bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-2xl p-6 md:p-10 border border-slate-700/50">
                        <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-50 leading-snug">
                            What if you could go from idea to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] font-extrabold">validated MVP in just 3 days?</span>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
