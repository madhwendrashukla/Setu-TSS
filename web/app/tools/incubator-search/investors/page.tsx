'use client';

import { useState, useMemo, useEffect } from 'react';
import { Investor } from '@/lib/data/Investors/investors';
import { Search, MapPin, Globe, Linkedin, Twitter, Filter, ArrowLeft, Briefcase, TrendingUp, X, ExternalLink, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

/* ─── Detail Overlay ────────────────────────────── */
function InvestorDetail({ investor, onClose }: { investor: Investor; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-2xl" />
            <div
                className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-gray-200 bg-white backdrop-blur-xl shadow-2xl animate-in zoom-in-95 fade-in duration-200"
                onClick={e => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-6 right-6 z-20 w-10 h-10 rounded-full bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                    <X size={20} />
                </button>

                <div className="p-8 md:p-12">
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-10">
                        <div className="w-24 h-24 rounded-3xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-2xl">
                            {investor.logoUrl ? (
                                <img src={investor.logoUrl} alt={investor.name} className="w-full h-full object-contain p-3" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-3xl font-black text-slate-900">${investor.name.charAt(0)}</span>`; }} />
                            ) : (
                                <span className="text-3xl font-black text-slate-900">{investor.name.charAt(0)}</span>
                            )}
                        </div>
                        <div className="pt-2">
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight mb-2">{investor.name}</h2>
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{investor.type}</span>
                                <span className="bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{investor.title}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">About</h4>
                                <p className="text-gray-600 text-base leading-relaxed font-light">{investor.about}</p>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">Focus Industries</h4>
                                <div className="flex flex-wrap gap-2">
                                    {investor.industries.map(ind => (
                                        <span key={ind} className="text-[11px] font-bold px-3 py-1.5 rounded-xl border border-gray-100 bg-gray-50 text-gray-700">{ind}</span>
                                    ))}
                                </div>
                            </div>
                            {investor.portfolioLogos && investor.portfolioLogos.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">Portfolio Highlights</h4>
                                <div className="flex flex-wrap gap-4">
                                    {investor.portfolioLogos.map((pl, i) => (
                                        <div key={i} className="h-12 w-32 bg-white border border-gray-100 rounded-xl flex items-center justify-center p-2 shadow-sm">
                                            <img src={pl.logo} alt="Portfolio Company" className="max-h-full max-w-full object-contain" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            )}
                        </div>

                        <div className="space-y-6">
                            <div className="shadow-sm p-6 rounded-3xl border border-gray-200 bg-gray-50">
                                <h4 className="text-[10px] font-bold text-gray-500 tracking-[0.2em] uppercase mb-4">Investment Strategy</h4>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Ideal Stage</span>
                                        <span className="text-gray-900 font-bold">{investor.stages.join(' • ')}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-400">Portfolio Size</span>
                                        <span className="text-gray-900 font-bold">{investor.investments || 'N/A'} Companies</span>
                                    </div>
                                </div>
                            </div>

                            {investor.pocName && (
                            <div className="shadow-sm p-6 rounded-3xl border border-gray-200 bg-white flex items-center gap-4">
                                {investor.pocPhoto ? (
                                    <img src={investor.pocPhoto} alt={investor.pocName} className="w-16 h-16 rounded-full object-cover shadow-sm" />
                                ) : (
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">{investor.pocName.charAt(0)}</div>
                                )}
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 tracking-[0.2em] uppercase mb-1">Point of Contact</h4>
                                    <div className="font-bold text-gray-900">{investor.pocName}</div>
                                    {investor.pocTitle && <div className="text-xs text-gray-500">{investor.pocTitle}</div>}
                                    {investor.pocLinkedin && <a href={investor.pocLinkedin} target="_blank" className="text-accent-blue text-xs font-bold hover:underline mt-1 inline-block">LinkedIn ↗</a>}
                                </div>
                            </div>
                            )}

                            <div className="flex gap-3">
                                {investor.socials?.linkedin && <a href={investor.socials.linkedin} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-[#0077b5] hover:opacity-90 text-white py-3 rounded-2xl text-sm font-bold transition-all"><Linkedin size={18} /> LinkedIn</a>}
                                {investor.socials?.website && <a href={investor.socials.website} target="_blank" className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-white/20 text-gray-900 py-3 rounded-2xl text-sm font-bold transition-all border border-gray-200"><Globe size={18} /> Website</a>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function InvestorsPage() {
    const [search, setSearch] = useState('');
    const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const [dbInvestors, setDbInvestors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:5000/api/tools/investors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Map backend schema to frontend Investor type
                    const mapped = data.map(inv => ({
                        id: inv.id,
                        name: inv.name,
                        type: inv.type || 'Investor',
                        title: inv.firm || '',
                        stages: inv.stages || [],
                        industries: inv.sectors || [],
                        logoUrl: inv.logo_url || '',
                        about: inv.about || '',
                        investments: inv.portfolio_cos?.length || null,
                        socials: { 
                            linkedin: inv.linkedin,
                            twitter: inv.twitter,
                            website: inv.website
                        },
                        portfolioCompanies: inv.portfolio_cos || [],
                        portfolioLogos: (inv.portfolio_logos || []).map((url: string) => ({ name: '', logo: url })),
                        pocName: inv.poc_name || '',
                        pocTitle: inv.poc_designation || '',
                        pocLinkedin: inv.poc_linkedin || '',
                        pocPhoto: inv.poc_photo || ''
                    }));
                    setDbInvestors(mapped);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    }, []);

    const industries = useMemo(() => {
        const ind = new Set<string>();
        dbInvestors.forEach(inv => inv.industries.forEach((i: string) => ind.add(i)));
        return ['All Industries', ...Array.from(ind).sort()];
    }, [dbInvestors]);

    const displayedInvestors = useMemo(() => {
        return dbInvestors.filter(inv => {
            const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
                inv.about.toLowerCase().includes(search.toLowerCase());
            const matchesIndustry = selectedIndustry === 'All Industries' || inv.industries.includes(selectedIndustry);
            return matchesSearch && matchesIndustry;
        });
    }, [search, selectedIndustry, dbInvestors]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-gray-50 relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link href="/tools" className="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors mb-8 text-sm group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-5xl font-black text-gray-900 tracking-[-0.04em] mb-6">
                        Investors <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Match.</span>
                    </h1>
                    <p className="text-xl text-gray-600 font-light max-w-2xl">
                        A curated database of 100+ top-tier VCs, Angel Networks, and Family Offices. Find the right capital for your mission.
                    </p>
                </div>


                {/* Unified Filter Bar */}
                <div className="shadow-sm p-4 md:p-6 rounded-[2rem] border border-gray-200 bg-white mb-12 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="flex items-center gap-4 px-4 border-r border-gray-200 hidden lg:flex">
                        <Filter size={20} className="text-accent-blue" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">Source Capital</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Industry Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Focus Area</label>
                            <select
                                value={selectedIndustry}
                                onChange={(e) => setSelectedIndustry(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-sm text-gray-900 focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {industries.map(ind => <option key={ind} value={ind} className="bg-white">{ind}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                <Search size={16} className="rotate-90" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-white text-[10px] font-bold text-gray-500 uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Search Partners</label>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-accent-blue transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Fund name, person, or mandate..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-accent-blue/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* Search & Results */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-300 border-t-accent-blue rounded-full animate-spin"></div>
                    </div>
                ) : (
                <div className="space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center">
                            Available Matches: <span className="text-gray-900 ml-2">{displayedInvestors.length}</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {displayedInvestors.map((inv, i) => (
                        <div
                            key={inv.name + i}
                            onClick={() => setSelectedInvestor(inv)}
                            className="shadow-sm p-8 rounded-3xl border border-gray-200 hover:border-accent-blue/40 bg-white transition-all duration-300 group cursor-pointer flex flex-col relative overflow-hidden h-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    {inv.logoUrl ? (
                                        <img src={inv.logoUrl} alt={inv.name} className="w-full h-full object-contain p-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = `<span class="text-xl font-bold text-slate-900">${inv.name.charAt(0)}</span>`; }} />
                                    ) : (
                                        <span className="text-xl font-bold text-slate-900">{inv.name.charAt(0)}</span>
                                    )}
                                </div>
                                <span className="text-accent-blue text-[10px] font-bold tracking-widest uppercase bg-accent-blue/10 px-3 py-1 rounded-full border border-accent-blue/20">{inv.type}</span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-accent-blue transition-colors line-clamp-2">{inv.name}</h3>
                            <p className="text-gray-600 text-sm font-light mb-6 line-clamp-2 italic">"{inv.about}"</p>


                            <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-2"><Briefcase size={14} /> Stage</span>
                                    <span className="text-gray-900 font-bold">{inv.stages.join(' • ')}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <span className="flex items-center gap-2"><TrendingUp size={14} /> Focus</span>
                                    <span className="text-gray-900 font-bold truncate max-w-[150px]">{inv.industries[0] || 'N/A'} & More</span>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center justify-center gap-2 text-accent-blue text-xs font-bold uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                                View Mandate <ArrowUpRight size={14} />
                            </div>
                        </div>
                    ))}
                    </div>

                    {displayedInvestors.length === 0 && (
                        <div className="text-center py-20 shadow-sm rounded-[2rem] border border-gray-100">
                            <Briefcase size={48} className="text-white/20 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No investors found</h3>
                            <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                </div>
                )}
            </div>

            {selectedInvestor && (
                <InvestorDetail
                    investor={selectedInvestor}
                    onClose={() => setSelectedInvestor(null)}
                />
            )}
        </div>
    );
}
