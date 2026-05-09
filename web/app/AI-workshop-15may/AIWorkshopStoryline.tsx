

const story = [
    {
        heading: 'It starts with an idea.',
        body: 'You have it. That spark. The "what if this existed?" moment at 2am. You Google it. You tell a friend. They say "that\'s cool." And then... nothing happens.',
        color: '#8b5cf6',
    },
    {
        heading: 'Then the doubt creeps in.',
        body: '"Is this even a good idea? Has it already been done? What if I build it and nobody comes?" You open 14 browser tabs. You watch YouTube videos. You feel more lost than before.',
        color: '#d946ef',
    },
    {
        heading: 'You get stuck in the loop.',
        body: 'Learn → Doubt → Delay. Learn more → Doubt more → Delay more. Weeks pass. Months pass. The idea lives only in your head — and slowly, it fades.',
        color: '#8b5cf6',
    },
    {
        heading: 'What if you broke the loop in 3 days?',
        body: 'What if, instead of watching someone else talk about startups, you actually built one? Validated it. Prototyped it. Marketed it — with AI as your co-founder.',
        color: '#d946ef',
        highlight: true,
    },
];

export function AIWorkshopStoryline() {
    return (
        <section className="py-16 md:py-24 relative z-10 border-t border-white/5" id="story">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-72 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[180px] opacity-[0.08] pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Section label */}
                <div className="text-center mb-12 md:mb-16">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-400 font-medium uppercase tracking-widest mb-5">
                        <i className="fa-solid fa-book-open text-[#8b5cf6]" /> The Founder Journey
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                        Sound familiar?
                    </h2>
                </div>

                {/* Story cards — alternating left/right on ALL screen sizes */}
                <div className="relative">
                    {/* Center timeline line — desktop only */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[#8b5cf6]/40 via-[#d946ef]/40 to-transparent hidden sm:block"
                        style={{ left: '50%', transform: 'translateX(-0.5px)' }}
                    />
                    {/* Left timeline line — mobile only */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-[#8b5cf6]/40 via-[#d946ef]/30 to-transparent sm:hidden"
                        style={{ left: '50%', transform: 'translateX(-0.5px)' }}
                    />

                    <div className="space-y-6 md:space-y-10">
                        {story.map((s, i) => {
                            const isRight = i % 2 === 1;
                            return (
                                <div key={i} className="relative flex items-start">
                                    {/* Timeline dot — centered on the line */}
                                    <div
                                        className="absolute w-3 h-3 rounded-full z-10 border-2 border-[#0f172a]"
                                        style={{
                                            background: `linear-gradient(135deg, #8b5cf6, ${s.color})`,
                                            boxShadow: `0 0 10px ${s.color}60`,
                                            left: '50%',
                                            top: '28px',
                                            transform: 'translateX(-50%)',
                                        }}
                                    />

                                    {/* Card — alternates left/right using width + margin */}
                                    <div
                                        className={`w-[46%] ${isRight ? 'ml-auto' : 'mr-auto'}`}
                                    >
                                        <div className={`relative bg-[rgba(15,23,42,0.7)] backdrop-blur-[16px] border rounded-2xl p-4 md:p-8 transition-all duration-300 hover:-translate-y-1 ${s.highlight ? 'border-[#8b5cf6]/50 shadow-[0_0_30px_rgba(139,92,246,0.15)]' : 'border-white/10 hover:border-white/20'}`}>
                                            {s.highlight && (
                                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#8b5cf6]/5 to-[#d946ef]/5 pointer-events-none" />
                                            )}
                                            <h3 className={`text-sm md:text-xl font-extrabold mb-2 md:mb-3 leading-snug ${s.highlight ? 'bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent' : 'text-white'}`}>
                                                {s.heading}
                                            </h3>
                                            <p className="text-xs md:text-base text-slate-400 font-light leading-relaxed">
                                                {s.body}
                                            </p>
                                            {s.highlight && (
                                                <a href="#pricing" className="mt-4 inline-flex items-center gap-1.5 px-3 py-2 md:px-5 md:py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white text-xs md:text-sm font-bold hover:opacity-90 transition-opacity">
                                                    Register Now <i className="fa-solid fa-arrow-right text-xs" />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Closing pull-quote */}
                <div className="mt-16 md:mt-20 text-center">
                    <div className="relative max-w-3xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-2xl blur-xl opacity-15" />
                        <div className="relative bg-[rgba(15,23,42,0.8)] backdrop-blur-[16px] border border-[#8b5cf6]/30 rounded-2xl px-6 py-8 md:p-12">
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold text-white leading-snug mb-2">
                                More than Knowledge,
                            </p>
                            <p className="text-xl md:text-2xl lg:text-3xl font-bold leading-snug">
                                You need <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">a system, a deadline, and a mentor.</span>
                            </p>
                            <p className="mt-5 text-slate-400 text-base md:text-lg font-light">
                                This is exactly what this 3-day workshop gives you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
