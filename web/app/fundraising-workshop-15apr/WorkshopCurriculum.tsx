export function WorkshopCurriculum() {
    return (
        <section className="py-16 md:py-24 relative" id="curriculum">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12 md:mb-20">
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4">Choose the cohort that fits you the best</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                </div>

                <div className="space-y-8 md:space-y-10">
                    {/* TRACK 1: BASIC COHORT */}
                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-functional-border shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 hover:border-functional-border transition-all duration-500 group">
                        <div className="md:flex gap-8 lg:gap-12 items-start">
                            <div className="md:w-1/3 mb-8 md:mb-0">
                                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-slate-800 text-slate-300 font-bold rounded-lg text-xs md:text-sm mb-4 border border-functional-border shadow-inner">LEVEL 1: BASIC COHORT</div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-1 text-white group-hover:text-[#8b5cf6] transition-colors">Fund Raising Basics</h3>
                                <div className="mt-6 md:mt-8 mb-6 md:mb-8">
                                    <h4 className="text-white text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-crosshairs text-[#8b5cf6] opacity-70" /> Who is this for?
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed font-light">Anyone stepping into the world of startup fundraising</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-xl p-4 md:p-5 border border-functional-border relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8b5cf6]" />
                                    <span className="block text-[10px] md:text-xs uppercase tracking-widest text-[#8b5cf6] mb-1 font-bold">The Goal</span>
                                    <p className="text-xs md:text-sm font-medium text-white">Walk away with a clear roadmap of the fundraising landscape.</p>
                                </div>
                            </div>

                            <div className="md:w-2/3">
                                <h4 className="text-xl md:text-2xl font-bold mb-4 pb-3 border-b border-functional-border text-white">What do you get in this workshop:</h4>
                                <div className="mt-6 mb-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center shrink-0 border border-[#8b5cf6]/30">
                                            <i className="fa-solid fa-map-signs text-[#8b5cf6] text-xs" />
                                        </div>
                                        <h5 className="text-white font-bold text-sm md:text-base">Introduction to the Complete Fundraising Process</h5>
                                    </div>
                                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm text-slate-300 font-light ml-4 pl-7 border-l border-functional-border">
                                        {['Data Room Preparation','Pitch Deck Preparation','Types of Agreements — Term Sheet, SHA','Cap Table Management','Investor Outreach','Legal Compliance'].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <i className="fa-solid fa-circle-dot text-[#8b5cf6]/60 mt-1.5 text-[8px] shrink-0" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="w-full h-px bg-white/5 mb-6" />
                                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-4 text-sm text-slate-300 font-light">
                                    {['Data Room Preparation — all documents required','All basic financial jargons and key terms every founder should know','Introduction to all agreements required','Pitch Deck creation and how to pitch it effectively','Access to tools and resources wherever needed','Certificate of Participation – Basic Level'].map((item, i) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <i className="fa-solid fa-check text-[#8b5cf6] mt-1" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-6 bg-[#0f172a]/50 p-4 rounded-xl border border-functional-border">
                                    <p className="text-xs text-slate-400 italic"><strong className="text-slate-300">Note:</strong> What this workshop does not cover — Deep dive into term sheet, agreements, Cap Tables explaining every clause, loopholes, areas of negotiation and case studies. (These are covered in Level 2).</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* TRACK 2: ADVANCED COHORT */}
                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-functional-border shadow-[0_4px_30px_rgba(0,0,0,0.1)] rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border-2 border-[#8b5cf6]/40 shadow-[0_0_30px_rgba(217,70,239,0.1)] md:shadow-[0_0_40px_rgba(217,70,239,0.15)] relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white text-[10px] md:text-xs font-bold px-4 py-1.5 md:px-6 md:py-2 rounded-bl-xl md:rounded-bl-2xl uppercase tracking-widest shadow-lg z-20">Most Advanced</div>
                        <div className="md:flex gap-8 lg:gap-12 items-start mt-2 md:mt-0">
                            <div className="md:w-1/3 mb-8 md:mb-0">
                                <div className="inline-block px-3 py-1 md:px-4 md:py-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold rounded-lg text-xs md:text-sm mb-4 shadow-lg shadow-[#d946ef]/30">LEVEL 2: ADVANCED COHORT</div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2 text-white">Fund Raising Advanced</h3>
                                <div className="mt-6 md:mt-8 mb-6 md:mb-8">
                                    <h4 className="text-white text-sm md:text-base font-semibold mb-2 md:mb-3 flex items-center gap-2">
                                        <i className="fa-solid fa-crosshairs bg-gradient-to-br from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent" /> Who is this for?
                                    </h4>
                                    <p className="text-sm text-slate-300 leading-relaxed font-light">Founders actively preparing to raise funds right now.</p>
                                </div>
                                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 shadow-[0_0_20px_rgba(34,197,94,0.2)] backdrop-blur-sm">
                                    <p className="text-xs md:text-sm font-bold text-green-400 flex items-center gap-2 tracking-wide mb-3">
                                        <i className="fa-solid fa-layer-group text-green-400" /> Includes full access to Level 1
                                    </p>
                                    <ul className="space-y-2">
                                        {['Complete Fundraising Process','Data Room Preparation','Financial Jargons & Key Terms','Introduction to Agreements','Pitch Deck & Pitching','Tools & Resources'].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-xs text-green-300/80 font-light">
                                                <i className="fa-solid fa-circle-dot mt-1 text-[8px] shrink-0 text-green-400/60" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <div className="md:w-2/3">
                                <h4 className="text-lg md:text-xl font-bold mb-4 pb-3 border-b border-functional-border text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef]">What this workshop shall cover (Advanced):</h4>
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-6 md:gap-x-8 md:gap-y-6 mt-6">
                                    {[
                                        { icon: 'fa-file-contract', title: 'Term Sheet Basics', desc: 'Covering all key terms in the agreements.' },
                                        { icon: 'fa-chess-knight', title: 'Term Sheet Advanced', desc: 'Deep dive into negotiation areas, potential conflicts, protecting future rounds — with case studies.' },
                                        { icon: 'fa-scale-balanced', title: 'Key Agreements', desc: 'Introduction and discussion on all key agreements: SHA, ESOP, NDA, IP.' },
                                        { icon: 'fa-chart-pie', title: 'Cap Table Management', desc: 'Introduction and deep dive on Cap Table management and calculations.' },
                                        { icon: 'fa-route', title: 'Investor Outreach Roadmap', desc: 'How to identify, connect and close funding with the right investor easily.' },
                                        { icon: 'fa-award', title: 'Certificate of Participation', desc: 'Advanced Level certificate provided upon completion.' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 md:gap-4">
                                            <div className="mt-1 w-8 h-8 rounded-lg bg-[#d946ef]/10 flex items-center justify-center shrink-0 border border-[#d946ef]/20">
                                                <i className={`fa-solid ${item.icon} text-[#d946ef] text-xs md:text-sm`} />
                                            </div>
                                            <div>
                                                <h5 className="text-white font-bold mb-1 text-sm md:text-base">{item.title}</h5>
                                                <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-8 border border-[#d946ef]/30 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md bg-[#d946ef]/5">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[50px] opacity-20" />
                                    <h5 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                        <i className="fa-solid fa-gift text-[#d946ef]" /> Special Benefits Included
                                    </h5>
                                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-white font-light relative z-10">
                                        <ul className="space-y-3">
                                            {[<span key="a"><strong>80+ Pitch Decks</strong> That Actually Raised Money</span>, 'Access to Investor Database', 'Access to List of Incubators and Accelerators', <span key="b"><strong>1 Year Free</strong> Community Membership</span>].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <i className="fa-solid fa-circle-check text-[#d946ef] mt-1 text-[10px]" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        <ul className="space-y-3">
                                            {['Free Access to Session on DPIIT Startup India Registration', 'Updates to All Upcoming B2B Events'].map((item, i) => (
                                                <li key={i} className="flex items-start gap-2">
                                                    <i className="fa-solid fa-circle-check text-[#d946ef] mt-1 text-[10px]" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
