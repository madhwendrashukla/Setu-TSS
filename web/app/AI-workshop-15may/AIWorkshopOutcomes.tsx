

const deliverables = [
    { icon: 'fa-check-double', title: 'Validated Business Idea', desc: '12 proven ideation methods applied, market-tested concept ready to build', color: '#8b5cf6' },
    { icon: 'fa-laptop-code', title: 'Working MVP Prototype', desc: 'Functional landing page or app, built during the workshop', color: '#d946ef' },
    { icon: 'fa-film', title: 'AI-Generated Marketing Film', desc: 'Complete 30-60 second video, professional quality content', color: '#8b5cf6' },
    { icon: 'fa-chart-bar', title: 'Market Research Report', desc: 'Competitor analysis complete, customer personas defined', color: '#d946ef' },
    { icon: 'fa-wand-magic-sparkles', title: 'Prompt Templates & Workflows', desc: 'Reusable AI frameworks, copy-paste ready templates', color: '#8b5cf6' },
    { icon: 'fa-certificate', title: '3 Certificates of Completion', desc: 'Professional credentials, LinkedIn-ready certificates', color: '#d946ef' },
];

const audience = [
    { icon: 'fa-rocket', label: 'Aspiring Entrepreneurs', desc: 'You have an idea but don\'t know where to start' },
    { icon: 'fa-seedling', label: 'Early-Stage Founders', desc: 'You\'re building but need validation and tools' },
    { icon: 'fa-person-running', label: 'Solopreneurs', desc: 'You\'re doing everything yourself and need leverage' },
    { icon: 'fa-briefcase', label: 'Corporate Professionals', desc: 'You want to transition into entrepreneurship' },
    { icon: 'fa-graduation-cap', label: 'Students & Recent Graduates', desc: 'You want to learn startup skills early' },
    { icon: 'fa-video', label: 'Content Creators', desc: 'You want to scale production with AI' },
];

const whyItWorks = [
    { icon: 'fa-users', title: 'Live & Interactive', points: ['Real-time Q&A with mentors', 'Not pre-recorded lectures', 'Get unstuck immediately'] },
    { icon: 'fa-hammer', title: 'Build, Don\'t Just Learn', points: ['You\'ll ship actual deliverables', 'Every session has hands-on exercises', 'Walk away with tangible outputs'] },
    { icon: 'fa-puzzle-piece', title: 'Complete System, Not Random Tips', points: ['End-to-end entrepreneurship journey', 'Each workshop builds on the previous', 'No gaps in your knowledge'] },
];

export function AIWorkshopOutcomes() {
    return (
        <>
            {/* Deliverables */}
            <section className="py-16 md:py-24 relative z-10 border-t border-white/5" id="deliverables">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Your Complete Startup Launch Toolkit</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                        {deliverables.map((item, i) => (
                            <div key={i} className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 hover:border-white/25 hover:-translate-y-1 transition-all duration-300 group">
                                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 border transition-transform group-hover:scale-110" style={{ background: `${item.color}15`, borderColor: `${item.color}30` }}>
                                    <i className={`fa-solid ${item.icon} text-lg`} style={{ color: item.color }} />
                                </div>
                                <h3 className="text-base md:text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-slate-400 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Who Should Attend */}
            <section className="py-16 md:py-24 relative border-t border-white/5" id="audience">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-full max-w-xl h-[400px] bg-gradient-to-l from-[#d946ef] to-[#8b5cf6] rounded-full mix-blend-screen filter blur-[150px] opacity-8 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Is This For You?</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {audience.map((item, i) => (
                            <div key={i} className="flex items-start gap-4 bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-xl p-5 hover:border-[#8b5cf6]/40 transition-all duration-300 group">
                                <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/15 flex items-center justify-center shrink-0 border border-[#8b5cf6]/25 group-hover:scale-110 transition-transform">
                                    <i className={`fa-solid ${item.icon} text-[#8b5cf6] text-sm`} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-sm md:text-base mb-1">✓ {item.label}</h3>
                                    <p className="text-xs text-slate-400 font-light">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why This Works */}
            <section className="py-16 md:py-24 relative border-t border-white/5" id="why-us">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12 md:mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Not Another Theoretical Course</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        {whyItWorks.map((item, i) => (
                            <div key={i} className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 hover:border-[#8b5cf6]/40 transition-all duration-300 hover:-translate-y-1 group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform">
                                    <i className={`fa-solid ${item.icon} text-white text-lg`} />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-4">{item.title}</h3>
                                <ul className="space-y-2.5">
                                    {item.points.map((point, pi) => (
                                        <li key={pi} className="flex items-start gap-2.5 text-sm text-slate-400 font-light">
                                            <i className="fa-solid fa-check text-[#8b5cf6] mt-0.5 text-xs shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
