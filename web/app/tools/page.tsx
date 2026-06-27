import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Startup Tools Ecosystem | Setu - TheStartupSchool',
    description: 'Explore the definitive list of tools and resources for the startup ecosystem.',
};

export default function ToolsPage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main flex items-center justify-center relative overflow-hidden">
            {/* Subtle light background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center px-6 relative z-10 w-full max-w-5xl mx-auto">
                <span className="text-accent-violet text-xs font-bold tracking-[0.2em] uppercase mb-4 flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-violet"></span> ECOSYSTEM HUB
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tight">
                    Startup <span className="text-accent-violet">Tools.</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto mb-16">
                    A curated ecosystem of resources, platforms, and frameworks to accelerate your build.
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left relative z-10 w-full mb-8">
                    {/* Active Tool 1: Founder Events Calendar */}
                    <Link href="/tools/founder-calendar" className="glass-card bg-white p-8 md:p-10 rounded-3xl border border-black/5 hover:border-accent-violet/30 transition-all hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] group relative overflow-hidden flex flex-col items-start gap-4">
                        <span className="bg-accent-violet/10 text-accent-violet text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block">Live Now</span>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-violet/5 flex items-center justify-center border border-accent-violet/10">
                                <i className="fas fa-calendar-alt text-xl text-accent-violet"></i>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">Founder Events Calendar</h3>
                                <div className="w-10 h-0.5 bg-accent-violet/30 mb-4"></div>
                                <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">A curated monthly basis details of all top B2B events and exhibitions. Add to your calendar to never miss an opportunity.</p>
                                <span className="text-accent-violet font-bold text-sm tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Access Tool &rarr;</span>
                            </div>
                        </div>
                    </Link>

                    {/* Active Tool 2: Pitch Deck Repo */}
                    <Link href="/tools/pitch-decks" className="glass-card bg-white p-8 md:p-10 rounded-3xl border border-black/5 hover:border-accent-violet/30 transition-all hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] group relative overflow-hidden flex flex-col items-start gap-4">
                        <span className="bg-accent-violet/10 text-accent-violet text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block">Live Now</span>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-violet/5 flex items-center justify-center border border-accent-violet/10">
                                <i className="fas fa-file-powerpoint text-xl text-accent-violet"></i>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">Pitch Deck Repo</h3>
                                <div className="w-10 h-0.5 bg-accent-violet/30 mb-4"></div>
                                <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">A massive curated collection of 48+ winning pitch decks from YC startups and global unicorns. Study how the best in the world built their narrative.</p>
                                <span className="text-accent-violet font-bold text-sm tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Access Tool &rarr;</span>
                            </div>
                        </div>
                    </Link>

                    {/* Coming Soon: Incubators & Accelerators */}
                    <div className="glass-card bg-[#f8fafc] p-8 md:p-10 rounded-3xl border border-black/5 relative overflow-hidden flex flex-col items-start gap-4">
                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block">Coming Soon</span>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center border border-green-100">
                                <i className="fas fa-building text-xl text-green-600"></i>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">Incubators & Accelerators</h3>
                                <div className="w-10 h-0.5 bg-green-300 mb-4"></div>
                                <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">An intelligent mapping tool to discover workspaces across the startup landscape.</p>
                                <span className="text-accent-violet font-bold text-sm tracking-widest flex items-center gap-2 opacity-50 cursor-not-allowed">Access Tool &rarr;</span>
                            </div>
                        </div>
                    </div>

                    {/* Active Tool 3: Grants & Schemes */}
                    <Link href="/tools/grants" className="glass-card bg-white p-8 md:p-10 rounded-3xl border border-black/5 hover:border-accent-violet/30 transition-all hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] group relative overflow-hidden flex flex-col items-start gap-4">
                        <span className="bg-accent-violet/10 text-accent-violet text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block">Live Now</span>
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent-violet/5 flex items-center justify-center border border-accent-violet/10">
                                <i className="fas fa-university text-xl text-accent-violet"></i>
                            </div>
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">Grants & Schemes</h3>
                                <div className="w-10 h-0.5 bg-accent-violet/30 mb-4"></div>
                                <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">Explore government-backed hubs, incubation grants, and pure schemes asking for 0% equity.</p>
                                <span className="text-accent-violet font-bold text-sm tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Access Tool &rarr;</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Toolkit Banner */}
                <div className="bg-white rounded-3xl border border-black/5 p-8 md:p-12 text-left flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative overflow-hidden shadow-sm">
                    <div className="relative z-10 max-w-md">
                        <span className="text-accent-violet font-bold text-xs uppercase tracking-widest mb-4 inline-flex items-center gap-2">
                            <span className="bg-accent-violet/10 px-2 py-1 rounded">NEW</span> All tools. One place.
                        </span>
                        <h2 className="text-3xl font-black text-black mb-4">Your startup toolkit, simplified.</h2>
                        <p className="text-text-secondary font-medium">Handpicked resources to save you time, reduce noise, and help you focus on what matters—building.</p>
                    </div>
                    <div className="relative w-full max-w-[300px] h-[200px] flex items-center justify-center">
                        <div className="absolute inset-0 bg-gradient-to-tr from-accent-violet/20 to-transparent rounded-full blur-3xl"></div>
                        <div className="w-full h-full bg-accent-violet/10 rounded-2xl border border-accent-violet/20 shadow-inner flex items-end justify-center pb-0 overflow-hidden relative">
                            {/* Graphic simulation */}
                            <div className="w-[80%] h-[50%] bg-gradient-to-b from-[#a855f7] to-[#7c3aed] rounded-t-xl relative z-10"></div>
                            {/* Floating icons */}
                            <i className="fas fa-calendar-alt absolute top-[20%] left-[30%] text-accent-violet/50 text-2xl"></i>
                            <i className="fas fa-file-powerpoint absolute top-[30%] right-[30%] text-accent-violet/50 text-2xl"></i>
                            <i className="fas fa-building absolute bottom-[60%] left-[20%] text-green-500/50 text-2xl"></i>
                            <i className="fas fa-university absolute bottom-[50%] right-[20%] text-accent-violet/50 text-2xl"></i>
                        </div>
                    </div>
                </div>

                {/* Explore Categories */}
                <div className="text-left">
                    <h3 className="text-2xl font-black text-black mb-6">Explore by Category</h3>
                    <div className="flex flex-wrap gap-4 mb-8">
                        {['Fundraising', 'Market Research', 'Build & Tech', 'Legal & Finance', 'Marketing', 'Communities'].map(cat => (
                            <div key={cat} className="px-5 py-2.5 rounded-full border border-black/5 bg-white text-sm font-semibold text-black hover:bg-black/5 cursor-pointer transition-colors flex items-center gap-2 shadow-sm">
                                <i className="fas fa-layer-group text-accent-violet text-xs"></i> {cat}
                            </div>
                        ))}
                    </div>

                    <div className="bg-white border border-black/5 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-accent-violet rounded-full flex items-center justify-center text-white shrink-0 shadow-lg shadow-accent-violet/30">
                                <i className="fas fa-comment-dots text-xl"></i>
                            </div>
                            <div>
                                <h4 className="font-bold text-black">Can't find what you're looking for?</h4>
                                <p className="text-text-secondary text-sm font-medium">Tell us what resource you need. We'll try to add it.</p>
                            </div>
                        </div>
                        <button className="px-6 py-2.5 rounded-full border border-accent-violet/30 text-accent-violet font-semibold text-sm hover:bg-accent-violet/5 transition-colors whitespace-nowrap">
                            Request a Resource &rarr;
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
