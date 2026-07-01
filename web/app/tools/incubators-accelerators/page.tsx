'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, ExternalLink, ArrowLeft, Globe, Building2, Zap } from 'lucide-react';
import { incubatorsData, Incubator } from '@/lib/data/Incubators and Accelerators/incubators';

function IncubatorLogo({ domain, name }: { domain: string, name: string }) {
    const [errorStage, setErrorStage] = useState(0);

    if (!domain || errorStage >= 2) {
        return <span className="text-xl font-bold text-accent-blue">{name.charAt(0)}</span>;
    }

    const src = errorStage === 0
        ? `https://logo.clearbit.com/${domain}`
        : `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${domain}&size=128`;

    return (
        <img
            src={src}
            alt={name}
            className="w-full h-full object-contain p-2.5"
            onError={() => setErrorStage(prev => prev + 1)}
        />
    );
}

function IncubatorCard({ item }: { item: Incubator }) {
    if (!item.name) return null;

    let domain = '';
    try {
        if (item.website?.startsWith('http')) {
            domain = new URL(item.website).hostname.replace('www.', '');
        } else if (item.website?.includes('.')) {
            domain = item.website.replace('www.', '');
        } else if (item.contactDetails?.includes('.')) {
            domain = item.contactDetails.replace('www.', '');
        }
    } catch { }

    return (
        <div className="flex flex-col glass-card rounded-3xl p-6 md:p-8 bg-bg-surface/40 border border-white/10 hover:border-accent-blue/40 hover:shadow-[0_0_40px_rgba(80,140,255,0.1)] transition-all duration-300 group flex flex-col h-full relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IncubatorLogo domain={domain} name={item.name} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                        {item.type.includes('Accelerator') ? 'Accelerator' : 'Incubator'}
                    </span>
                    <span className="text-text-tertiary text-[10px] font-medium flex items-center gap-1">
                        <MapPin size={10} className="text-accent-violet" />
                        {item.location || 'India'}
                    </span>
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight group-hover:text-accent-blue transition-colors line-clamp-2">{item.name}</h3>
            <p className="text-text-secondary text-sm font-light mb-6 line-clamp-2 italic">
                {item.focusSector || 'Sector Agnostic'}
            </p>

            <div className="space-y-3 mb-8 flex-1 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-text-tertiary flex items-center gap-2">
                        <Zap size={14} className="text-amber-400" /> Funding
                    </span>
                    <span className="text-white font-medium truncate max-w-[120px]">{item.fundingSupport || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/5">
                    <span className="text-text-tertiary flex items-center gap-2">
                        <Building2 size={14} className="text-accent-blue" /> Stage
                    </span>
                    <span className="text-white font-medium truncate max-w-[120px]">{item.idealStage || 'Any'}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
                {item.website ? (
                    <a
                        href={item.website.startsWith('http') ? item.website : `https://${item.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))] hover:opacity-90 text-white py-3 rounded-xl text-xs font-bold transition-all"
                    >
                        <Globe size={14} /> Visit Portal
                    </a>
                ) : (
                    <div className="w-full flex items-center justify-center gap-2 bg-white/5 text-text-tertiary py-3 rounded-xl text-xs font-bold border border-white/5 cursor-not-allowed">
                        No Website
                    </div>
                )}
            </div>
        </div>
    );
}

export default function IncubatorsPage() {
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [selectedType, setSelectedType] = useState('All Types');

    const locations = useMemo(() => {
        const locs = Array.from(new Set(incubatorsData.map(item => item.location))).filter(Boolean).sort();
        return ['All Locations', ...locs];
    }, []);

    const types = ['All Types', 'Incubator', 'Accelerator'];

    const filteredData = useMemo(() => {
        return incubatorsData.filter(item => {
            const matchesSearch =
                item.name.toLowerCase().includes(search.toLowerCase()) ||
                (item.focusSector && item.focusSector.toLowerCase().includes(search.toLowerCase()));

            const matchesLocation = selectedLocation === 'All Locations' || item.location === selectedLocation;

            const matchesType = selectedType === 'All Types' ||
                (selectedType === 'Accelerator' && item.type.toLowerCase().includes('accelerator')) ||
                (selectedType === 'Incubator' && item.type.toLowerCase().includes('incubator'));

            return matchesSearch && matchesLocation && matchesType;
        });
    }, [search, selectedLocation, selectedType]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link href="/tools" className="inline-flex items-center text-text-tertiary hover:text-white transition-colors mb-8 text-sm group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-5xl font-black text-white tracking-[-0.04em] mb-6">
                        Incubators & <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Accelerators.</span>
                    </h1>
                    <p className="text-xl text-text-secondary font-light max-w-2xl">
                        Comprehensive mapping of major hubs across the ecosystem. Filter by location or type to find your perfect launchpad.
                    </p>
                </div>

                {/* Filter Bar: Calendar Style */}
                <div className="glass-card p-4 md:p-6 rounded-[2rem] border border-white/10 bg-bg-surface/30 mb-12 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="flex items-center gap-4 px-4 border-r border-white/10 hidden lg:flex">
                        <Filter size={20} className="text-accent-blue" />
                        <span className="text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">Filter Hubs</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Location</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {locations.map(loc => <option key={loc} value={loc} className="bg-bg-surface">{loc}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                <Search size={16} className="rotate-90" />
                            </div>
                        </div>

                        {/* Type Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Structure</label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 text-sm text-white focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {types.map(t => <option key={t} value={t} className="bg-bg-surface">{t}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                <Search size={16} className="rotate-90" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Search</label>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-blue transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="Name or Focus area..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">
                        Results Found: <span className="text-white ml-2">{filteredData.length}</span>
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => { setSearch(''); setSelectedLocation('All Locations'); setSelectedType('All Types'); }} className="text-[10px] font-bold text-accent-blue hover:text-white transition-colors uppercase tracking-widest border border-accent-blue/20 px-3 py-1 rounded-full">Reset Filters</button>
                    </div>
                </div>

                {/* Grid Layout */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {filteredData.map((item, i) => (
                            <IncubatorCard key={item.id || i} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-20 rounded-[3rem] border border-dashed border-white/10 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                            <Search size={40} className="text-text-tertiary opacity-50" />
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-3">No matching hubs</h3>
                        <p className="text-text-secondary font-light max-w-sm mx-auto mb-10 text-lg">
                            Adjust your filters or search terms to explore more of the startup ecosystem.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
