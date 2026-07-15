import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Startup Tools Ecosystem | Setu - TheStartupSchool',
    description: 'Explore the definitive list of tools and resources for the startup ecosystem.',
};

async function getHomepageData() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homepage`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        return null;
    }
}

export default async function ToolsPage() {
    const data = await getHomepageData();
    const togglesStr = data?.siteSettings?.section_toggles;
    let toggles: any = {};
    try { toggles = typeof togglesStr === 'string' ? JSON.parse(togglesStr) : (togglesStr || {}); } catch(e) {}

    const toolsList = [
        {
            key: 'tool_calendar',
            title: "Founder Events Calendar",
            desc: "A curated monthly basis details of all top B2B events and exhibitions. Add to your calendar to never miss an opportunity.",
            href: "/tools/founder-calendar",
            icon: "fas fa-calendar-alt",
            colorClass: "text-accent-violet",
            bgClass: "bg-accent-violet/5 border-accent-violet/10"
        },
        {
            key: 'tool_pitch_decks',
            title: "Pitch Deck Repo",
            desc: "A massive curated collection of 48+ winning pitch decks from YC startups and global unicorns. Study how the best in the world built their narrative.",
            href: "/tools/pitch-decks",
            icon: "fas fa-file-powerpoint",
            colorClass: "text-accent-violet",
            bgClass: "bg-accent-violet/5 border-accent-violet/10"
        },
        {
            key: 'tool_incubators',
            title: "Incubators & Accelerators",
            desc: "An intelligent mapping tool to discover workspaces across the startup landscape.",
            href: "/tools/incubators-accelerators",
            icon: "fas fa-building",
            colorClass: "text-accent-violet",
            bgClass: "bg-accent-violet/5 border-accent-violet/10"
        },
        {
            key: 'tool_grants',
            title: "Grants & Schemes",
            desc: "Explore government-backed hubs, incubation grants, and pure schemes asking for 0% equity.",
            href: "/tools/grants",
            icon: "fas fa-university",
            colorClass: "text-accent-violet",
            bgClass: "bg-accent-violet/5 border-accent-violet/10"
        },
        {
            key: 'tool_investors',
            title: "Investor Database",
            desc: "Connect with 250+ active angel investors and VCs tailored to your startup's stage and industry.",
            href: "/tools/incubator-search/investors",
            icon: "fas fa-wallet",
            colorClass: "text-accent-violet",
            bgClass: "bg-accent-violet/5 border-accent-violet/10"
        }
    ];

    const displayTools = toolsList.map(tool => {
        let rawToggleVal: any = toggles[tool.key];
        if (rawToggleVal === undefined) rawToggleVal = true;
        
        let status = 'live';
        if (typeof rawToggleVal === 'boolean') {
            status = rawToggleVal ? 'live' : 'disabled';
        } else if (typeof rawToggleVal === 'string') {
            status = rawToggleVal;
        }
        return { ...tool, status };
    }).filter(tool => !tool.status.startsWith('disabled'));

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main flex items-center justify-center relative overflow-hidden">
            {/* Subtle light background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="text-center px-6 relative z-10 w-full max-w-5xl mx-auto">

                <h1 className="text-4xl md:text-6xl font-black text-black mb-6 tracking-tight">
                    Startup <span className="text-accent-violet">Tools.</span>
                </h1>
                <p className="text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto mb-16">
                    A curated ecosystem of resources, platforms, and frameworks to accelerate your build.
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 text-left relative z-10 w-full mb-8">
                    {displayTools.map((tool, idx) => {
                        const isUnclickable = tool.status !== 'live';
                        let badgeText = "Live Now";
                        if (tool.status === 'coming_soon') badgeText = "COMING SOON";
                        else if (tool.status === 'upcoming') badgeText = "UPCOMING";
                        
                        if (isUnclickable) {
                            return (
                                <div 
                                    key={idx} 
                                    className="glass-card bg-white p-8 md:p-10 rounded-3xl border border-black/5 relative overflow-hidden flex flex-col items-start gap-4 opacity-70 cursor-not-allowed"
                                >
                                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block bg-orange-500/10 text-orange-600">
                                        {badgeText}
                                    </span>
                                    <div className="flex gap-4">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tool.bgClass}`}>
                                            <i className={`${tool.icon} text-xl ${tool.colorClass}`}></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">{tool.title}</h3>
                                            <div className="w-10 h-0.5 bg-accent-violet/30 mb-4"></div>
                                            <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">{tool.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <Link 
                                key={idx} 
                                href={tool.href} 
                                className="glass-card bg-white p-8 md:p-10 rounded-3xl border border-black/5 relative overflow-hidden flex flex-col items-start gap-4 hover:border-accent-violet/30 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] group transition-all"
                            >
                                <span className="text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-block bg-accent-violet/10 text-accent-violet">
                                    {badgeText}
                                </span>
                                <div className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${tool.bgClass}`}>
                                        <i className={`${tool.icon} text-xl ${tool.colorClass}`}></i>
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-black mb-2 tracking-tight">{tool.title}</h3>
                                        <div className="w-10 h-0.5 bg-accent-violet/30 mb-4"></div>
                                        <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">{tool.desc}</p>
                                        <span className="text-accent-violet font-bold text-sm tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">Access Tool &rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>


            </div>
        </div>
    );
}
