

const plans = [
    {
        level: 'WORKSHOP 1',
        name: 'Startup Ideation & Validation',
        mentor: 'Gaurav Bansal',
        originalPrice: '₹1,000',
        earlyBird: '₹290',
        razorpayLink: 'https://rzp.io/rzp/CCyfuJ7',
        isFeatured: false,
        sessions: '1 Session (3 hours)',
        date: 'May 15  •  6–9 PM',
        includes: [
            '12 ideation methods',
            'Business model canvas',
            'Market validation checklist',
            'Certificate of Participation',
        ],
        color: '#8b5cf6',
    },
    {
        level: 'WORKSHOP 2',
        name: 'Zero-to-MVP using Claude Pro',
        mentor: 'Atul Pandey',
        originalPrice: '₹4,500',
        earlyBird: '₹1,490',
        razorpayLink: 'https://rzp.io/rzp/AgknNVq',
        isFeatured: false,
        sessions: '3 Sessions (7.5 hours)',
        date: 'May 16–17',
        includes: [
            'AI-powered market research',
            'Build working MVP prototype',
            'Prompt templates & workflows',
            'Certificate of Participation',
        ],
        color: '#d946ef',
    },
    {
        level: 'WORKSHOP 3',
        name: 'AI Filmmaking & Video Marketing',
        mentor: 'Amey Asuti',
        originalPrice: '₹1,500',
        earlyBird: '₹490',
        razorpayLink: 'https://rzp.io/rzp/5SMdwth',
        isFeatured: false,
        sessions: '1 Session (2.5 hours)',
        date: 'May 17  •  10 AM–12:30 PM',
        includes: [
            'Create complete AI film using Claude Pro',
            'Script + prompts + all assets',
            'Repeatable production workflow',
            'Certificate of Participation',
        ],
        color: '#8b5cf6',
    },
    {
        level: '⭐ EARLY BIRD OFFER',
        name: 'Complete AI Launchpad (All 3 Workshops)',
        mentor: 'All 3 Mentors',
        originalPrice: '₹7,000',
        earlyBird: '₹1,750',
        razorpayLink: 'https://rzp.io/rzp/ZyLUYd62',
        isFeatured: true,
        sessions: 'All 5 Sessions (13 hours)',
        date: 'May 15–17, 2026',
        includes: [
            'Full Access: Workshop-1 + Workshop-2 + Workshop-3',
            'Core Offering: The Complete AI Startup Toolkit',
            'All deliverables, templates & prompts',
            '3 Certificates of Participation',
        ],
        color: '#d946ef',
        saveBadge: 'SAVE ₹530',
    },
];

export function AIWorkshopPricing() {
    return (
        <section className="py-16 md:py-32 relative" id="pricing">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] md:h-[500px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-full mix-blend-screen filter blur-[150px] md:blur-[200px] opacity-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12 md:mb-16">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">We Offer Customised Learning Path</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-6" />
                    <p className="text-slate-400 text-base md:text-lg font-light max-w-xl mx-auto">Individual workshops or the complete entrepreneurship bundle — you decide.</p>

                    {/* FOMO Early Bird Banner */}
                    <div className="mt-6 inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-[#d946ef]/40 bg-[#d946ef]/10 text-sm font-semibold text-[#f0abfc] animate-pulse">
                        <i className="fa-solid fa-bolt text-[#d946ef]" />
                        Early Bird Offer expiring soon — grab your spot before prices go up!
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6 max-w-7xl mx-auto">
                    {plans.map((plan, pi) => (
                        <div
                            key={pi}
                            className={`bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-2xl md:rounded-3xl p-6 flex flex-col transition-all duration-300 relative overflow-hidden ${plan.isFeatured ? 'border-2 border-[#8b5cf6]/50 shadow-[0_0_40px_rgba(217,70,239,0.15)] hover:shadow-[0_0_50px_rgba(217,70,239,0.25)]' : 'border border-white/10 hover:border-white/25'}`}
                        >
                            {plan.isFeatured && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white text-[10px] font-bold px-4 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg">Early Bird Offer</div>
                            )}
                            {plan.saveBadge && (
                                <div className="mb-3 inline-flex">
                                    <span className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-bold rounded uppercase tracking-widest">{plan.saveBadge}</span>
                                </div>
                            )}

                            <div className="mb-4">
                                <div className="inline-block px-2.5 py-0.5 text-[10px] font-bold rounded uppercase tracking-widest text-white mb-2" style={{ background: plan.isFeatured ? 'linear-gradient(135deg, #8b5cf6, #d946ef)' : 'rgba(139,92,246,0.2)', border: '1px solid rgba(139,92,246,0.3)' }}>
                                    {plan.level}
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-white mb-1 leading-tight">{plan.name}</h3>
                                <p className="text-xs text-slate-400 font-light">by {plan.mentor}</p>
                            </div>

                            {/* Pricing display */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 flex-wrap mb-1">
                                    <span className="text-slate-500 line-through text-base font-medium">{plan.originalPrice}</span>
                                    <span className="text-xs text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">Early Bird</span>
                                </div>
                                <div className={`text-4xl md:text-5xl font-extrabold ${plan.isFeatured ? 'bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent' : 'text-white'}`}>
                                    {plan.earlyBird}
                                </div>
                            </div>

                            <div className="mb-5 space-y-1.5">
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <i className="fa-regular fa-clock text-[#8b5cf6]" /> {plan.sessions}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <i className="fa-regular fa-calendar text-[#8b5cf6]" /> {plan.date}
                                </div>
                            </div>

                            <ul className="mb-6 space-y-2.5 flex-1">
                                {plan.includes.map((item, ii) => (
                                    <li key={ii} className="flex items-start gap-2">
                                        <i className="fa-solid fa-check mt-0.5 text-[10px] shrink-0" style={{ color: plan.color }} />
                                        <span className="text-xs text-slate-300 font-light">{item}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button - direct, no reveal */}
                            <div className="mt-auto w-full">
                                {plan.isFeatured ? (
                                    <div className="relative w-full">
                                        <span
                                             className="relative w-full block text-center px-4 py-4 rounded-xl bg-[#1e293b] border border-white/10 text-white/50 font-bold transition-all text-base cursor-not-allowed"
                                         >
                                             Sold Out
                                         </span>
                                    </div>
                                ) : (
                                    <span
                                        className="w-full block text-center px-4 py-3.5 rounded-xl text-white/50 font-bold transition-all text-sm border border-white/10 bg-[#1e293b] cursor-not-allowed"
                                    >
                                        Sold Out
                                    </span>
                                )}
                                <p className="text-[10px] text-slate-500 mt-2 text-center">Registrations Closed</p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-center mt-8 text-xs md:text-sm text-slate-500 font-medium">
                    <i className="fa-solid fa-ban text-[#8b5cf6]" /> Registrations are now closed
                </div>
            </div>
        </section>
    );
}
