import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Startup Tools Ecosystem | Setu - TheStartupSchool',
    description: 'Explore the definitive list of tools and resources for the startup ecosystem.',
};

export default function ToolsPage() {
    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main flex items-center justify-center relative overflow-hidden">
            {/* Extremely Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/10 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center px-6 relative z-10">
                <span className="text-accent-blue text-sm font-bold tracking-[0.2em] uppercase mb-4 block animate-pulse">Ecosystem Hub</span>
                <h1 className="text-5xl md:text-5xl font-black text-white mb-6 tracking-[-0.04em]">
                    Startup <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-violet">Tools.</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary font-light max-w-2xl mx-auto mb-10">
                    A curated ecosystem of resources, platforms, and frameworks to accelerate your build.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto text-left relative z-10 w-full font-light">
                    {/* Active Tool 1: Founder Events Calendar */}
                    <Link href="/tools/founder-calendar" className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 hover:border-accent-blue/50 transition-colors group relative overflow-hidden bg-[#050505]">
                        <span className="bg-accent-blue/10 text-accent-blue text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block border border-accent-blue/20">Live Now</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-accent-blue transition-colors">Founder Events Calendar</h3>
                        <p className="text-text-secondary leading-relaxed font-light mb-8 max-w-xl">A curated monthly basis details of all top B2B events and exhibitions. Add to your calendar to never miss an opportunity.</p>
                        <span className="text-accent-blue font-bold text-sm tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">Access Tool <span className="text-lg">&rarr;</span></span>
                    </Link>

                    {/* Active Tool 2: Pitch Deck Repo */}
                    <Link href="/tools/pitch-decks" className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 hover:border-accent-blue/50 transition-colors group relative overflow-hidden bg-[#050505]">
                        <span className="bg-accent-blue/10 text-accent-blue text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block border border-accent-blue/20">Live Now</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-accent-blue transition-colors">Pitch Deck Repo</h3>
                        <p className="text-text-secondary leading-relaxed font-light mb-8 max-w-xl">A massive curated collection of 48+ winning pitch decks from YC startups and global unicorns. Study how the best in the world built their narrative.</p>
                        <span className="text-accent-blue font-bold text-sm tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">Access Tool <span className="text-lg">&rarr;</span></span>
                    </Link>

                    {/* Coming Soon: Incubators & Accelerators */}
                    <div className="glass-card p-8 md:p-10 rounded-3xl border border-dashed border-white/10 bg-[#020202] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]"></div>
                        <div className="relative z-10">
                            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">Coming Soon</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-4 tracking-tight">Incubators & Accelerators</h3>
                            <p className="text-gray-500 leading-relaxed font-light mb-8">An intelligent mapping tool to discover workspaces across the startup landscape.</p>
                        </div>
                    </div>

                    {/* Active Tool 3: Grants & Schemes */}
                    <Link href="/tools/grants" className="glass-card p-8 md:p-10 rounded-3xl border border-white/10 hover:border-accent-blue/50 transition-colors group relative overflow-hidden bg-[#050505]">
                        <span className="bg-accent-blue/10 text-accent-blue text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block border border-accent-blue/20">Live Now</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight group-hover:text-accent-blue transition-colors">Grants & Schemes</h3>
                        <p className="text-text-secondary leading-relaxed font-light mb-8">Explore government-backed hubs, incubation grants, and pure schemes asking for 0% equity.</p>
                        <span className="text-accent-blue font-bold text-sm tracking-widest uppercase flex items-center gap-2 group-hover:translate-x-2 transition-transform">Access Tool <span className="text-lg">&rarr;</span></span>
                    </Link>

                    {/* Coming Soon: Investors Match */}
                    <div className="glass-card p-8 md:p-10 rounded-3xl border border-dashed border-white/10 bg-[#020202] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]"></div>
                        <div className="relative z-10">
                            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">Coming Soon</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-4 tracking-tight">Investors Match</h3>
                            <p className="text-gray-500 leading-relaxed font-light mb-8">Discover hubs with the highest investor density and direct seed funding guarantees.</p>
                        </div>
                    </div>

                    {/* Coming Soon: Cap Table Simulator */}
                    <div className="glass-card p-8 md:p-10 rounded-3xl border border-dashed border-white/10 bg-[#020202] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]"></div>
                        <div className="relative z-10">
                            <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">Coming Soon</span>
                            <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-4 tracking-tight">Interactive Cap Table Simulator</h3>
                            <p className="text-gray-500 leading-relaxed font-light mb-8 max-w-xl">Simulate seed rounds, option pool expansions, and visualize founder dilution with dynamic pie charts before you sign a term sheet.</p>
                        </div>
                    </div>

                    {/* Coming Soon: Financial Modeler */}
                    <div className="glass-card p-8 md:p-10 rounded-3xl border border-dashed border-white/10 bg-[#020202] relative overflow-hidden group lg:col-span-2">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:4px_4px]"></div>
                        <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest mb-6 inline-block shadow-[0_0_15px_rgba(34,197,94,0.2)]">Coming Soon</span>
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-400 mb-4 tracking-tight">Financial Modeler</h3>
                        <p className="text-gray-500 leading-relaxed font-light mb-8 relative z-10">Automated financial projections and runway estimation templates for SaaS and Hardware.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
