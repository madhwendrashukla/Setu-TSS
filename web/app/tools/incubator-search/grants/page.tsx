'use client';

import { useState, useEffect } from 'react';
import { grantsData, Grant } from '@/lib/data/grants';
import Link from 'next/link';
import { ExternalLink, ChevronDown, ChevronUp, Search, MapPin, Building2, TrendingUp, Filter, Calendar, Briefcase, ArrowLeft } from 'lucide-react';

function ScoreBadge({ score }: { score: number }) {
    let color = 'text-gray-400 border-gray-400';
    if (score >= 70) color = 'text-accent-blue border-accent-blue/50 bg-accent-blue/10';
    else if (score >= 40) color = 'text-[#FFF] border-[#FFF]/50 bg-[#FFF]/10';
    else if (score >= 20) color = 'text-accent-violet border-accent-violet/50 bg-accent-violet/10';

    return (
        <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold shrink-0 ${color}`}>
            {score}
        </span>
    );
}

function DirectoryCard({ item }: { item: any }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="glass-card hover-glow p-6 md:p-8 rounded-3xl border border-white/5 h-full flex flex-col relative group transition-all duration-300 bg-bg-surface hover:bg-white/5">
            <div className="flex justify-between items-start gap-4 mb-6">
                <div>
                    <span className="bg-white/10 text-text-primary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider mb-3 inline-block">
                        {item.benefitTags || 'Grant'}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-accent-blue transition-colors">{item.title}</h3>
                    <p className="flex items-center gap-1.5 text-sm text-text-secondary font-light">
                        <MapPin size={12} className="text-accent-blue/60" /> Pan India
                    </p>
                </div>
                <ScoreBadge score={85} />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Funding Support</span>
                    <strong className="text-sm text-white font-medium line-clamp-2">{item.amount || 'N/A'}</strong>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Ministry</span>
                    <strong className="text-sm text-white font-medium line-clamp-2">{item.ministry || 'N/A'}</strong>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Tenure</span>
                    <strong className="text-sm text-white font-medium line-clamp-2">{item.tenure || 'N/A'}</strong>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] text-text-secondary uppercase tracking-widest font-bold">Deadline</span>
                    <strong className="text-sm text-white font-medium line-clamp-1">{item.deadline || 'Ongoing'}</strong>
                </div>
            </div>

            <button
                className="inline-flex items-center gap-2 text-sm font-bold text-accent-blue hover:text-white transition-colors mb-6 pb-2 border-b border-white/5 w-fit"
                onClick={() => setOpen(!open)}
            >
                {open ? 'Hide details' : 'View all parameters'} {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {open && (
                <div className="mb-8 pt-4 border-t border-white/10 animate-fade-in">
                    <ul className="space-y-3">
                        <li className="text-sm text-text-secondary font-light flex justify-between gap-4 border-b border-white/5 pb-2">
                            <span className="shrink-0 text-white font-medium">Focus Sectors:</span>
                            <span className="text-right">{item.sectors || 'Agnostic'}</span>
                        </li>
                        <li className="text-sm text-text-secondary font-light flex flex-col gap-2 pt-2 pb-2 border-b border-white/5">
                            <span className="shrink-0 text-white font-medium">Overview:</span>
                            <span>{item.description || 'N/A'}</span>
                        </li>
                        <li className="text-sm text-text-secondary font-light flex flex-col gap-2 pt-2 pb-2 border-b border-white/5">
                            <span className="shrink-0 text-white font-medium">Eligibility:</span>
                            <span>{item.eligibility || 'N/A'}</span>
                        </li>
                        <li className="text-sm text-text-secondary font-light flex flex-col gap-2 pt-2">
                            <span className="shrink-0 text-white font-medium">Benefits:</span>
                            <span>{item.benefits || 'N/A'}</span>
                        </li>
                    </ul>
                </div>
            )}

            <div className="mt-auto flex flex-col gap-3">
                <a
                    href={item.link || '#'}
                    target={item.link ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="w-full bg-white hover:bg-gray-200 text-black py-3 rounded-full font-bold transition duration-300 flex justify-center items-center gap-2 text-sm"
                    onClick={(e) => { if (!item.link) e.preventDefault(); }}
                >
                    Link to Entity <ExternalLink size={14} />
                </a>
            </div>
        </div>
    );
}

export default function GrantsPage() {
    const [search, setSearch] = useState('');
    const [regionFilter, setRegionFilter] = useState('All');

    const [allData, setAllData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/tools/grants')
            .then(res => res.json())
            .then(data => {
                setAllData(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const regions = ['All', 'Pan India', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Kerala', 'Telangana', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Andhra Pradesh', 'Punjab', 'Haryana', 'Goa', 'Odisha', 'Assam', 'Delhi NCR', 'Jharkhand', 'Chhattisgarh', 'Meghalaya', 'Bihar'];

    const filteredData = allData.filter(item => {
        const matchesSearch = (item.title || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.ministry || '').toLowerCase().includes(search.toLowerCase()) ||
            (item.sectors || '').toLowerCase().includes(search.toLowerCase());
        return matchesSearch; // Removed region match since the new data doesn't have locations mapped explicitly yet
    });

    const resetFilters = () => {
        setSearch(''); setRegionFilter('All');
    };

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link href="/tools" className="inline-flex items-center text-text-tertiary hover:text-white transition-colors mb-8 text-sm group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-5xl font-black text-white tracking-[-0.04em] mb-6">
                        Grants <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Directory.</span>
                    </h1>
                    <p className="text-xl text-text-secondary font-light max-w-2xl">
                        Explore government-backed hubs, universities, and pure grants asking for 0% equity.
                    </p>
                </div>

                {/* Unified Filter Bar */}
                <div className="glass-card p-4 md:p-6 rounded-[2rem] border border-white/10 bg-bg-surface/30 mb-12 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="flex items-center gap-4 px-4 border-r border-white/10 hidden lg:flex">
                        <Filter size={20} className="text-accent-blue" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">Browse Grants</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Region Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Region</label>
                            <select
                                value={regionFilter}
                                onChange={(e) => setRegionFilter(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {regions.map(r => <option key={r} value={r} className="bg-bg-surface">{r}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                <Search size={16} className="rotate-90" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Search Grants</label>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-blue transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Grant name, provider, sector..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">
                        Grants Available: <span className="text-white ml-2">{filteredData.length}</span>
                    </p>
                </div>

                {filteredData.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredData.map((item, i) => (
                            <DirectoryCard key={item.id || i} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-16 rounded-3xl border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <h3 className="text-2xl font-bold text-white mb-2">No Results Found</h3>
                        <p className="text-text-secondary mb-8">No grants matched this specific query setup.</p>
                        <button className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-gray-200 transition-colors" onClick={resetFilters}>Clear Filters</button>
                    </div>
                )}
            </div>
        </div>
    );
}
