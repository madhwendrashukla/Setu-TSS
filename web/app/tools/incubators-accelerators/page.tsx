'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, ExternalLink, ArrowLeft, Globe, Building2, Zap, X } from 'lucide-react';

function IncubatorLogo({ name, logo_url, website }: { name: string, logo_url?: string, website?: string }) {
    if (logo_url) {
        return (
            <img
                src={logo_url.includes('api.startupindia.gov.in') ? `${process.env.NEXT_PUBLIC_API_URL || ''}/api/tools/incubators/proxy-image?url=${encodeURIComponent(logo_url)}` : logo_url}
                alt={name}
                className="w-full h-full object-contain p-2.5 rounded-2xl bg-white"
                loading="lazy"
                referrerPolicy="no-referrer"
                onError={(e) => {
                    // Fallback to avatar if logo fails to load
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A0A0A&color=508cff&bold=true&size=128`;
                    e.currentTarget.classList.remove('bg-white');
                }}
            />
        );
    }
    
    let domain = '';
    try {
        if (website?.startsWith('http')) {
            domain = new URL(website).hostname.replace('www.', '');
        } else if (website?.includes('.')) {
            domain = website.replace('www.', '');
        }
    } catch { }

    return (
        <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A0A0A&color=508cff&bold=true&size=128`}
            alt={name}
            className="w-full h-full object-contain p-2.5 rounded-2xl"
            loading="lazy"
        />
    );
}

function IncubatorModal({ item, onClose }: { item: any, onClose: () => void }) {
    if (!item) return null;
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-bg-surface border border-functional-border rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header */}
                <div className="flex items-start justify-between p-6 md:p-8 border-b border-functional-border bg-white/5">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 border border-functional-border flex items-center justify-center overflow-hidden shrink-0">
                            <IncubatorLogo name={item.name} logo_url={item.logo_url} website={item.website} />
                        </div>
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">{item.name}</h2>
                            <div className="flex flex-wrap gap-3 text-sm text-text-tertiary">
                                <span className="flex items-center gap-1"><MapPin size={14} /> {item.city ? `${item.city}, ` : ''}{item.state}</span>
                                {item.website && (
                                    <a href={item.website.startsWith('http') ? item.website : `https://${item.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-accent-blue hover:underline">
                                        <Globe size={14} /> Visit Website
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-text-tertiary hover:text-text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar flex-1">
                    {item.description && (
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-text-primary mb-3">About</h3>
                            <p className="text-text-secondary leading-relaxed">{item.description}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Building2 size={18} className="text-accent-blue"/> Program Details</h3>
                            <ul className="space-y-3">
                                {item.stages && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Stages</span><span className="text-sm text-text-secondary">{item.stages}</span></li>}
                                {item.preferred_stages && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Preferred Stages</span><span className="text-sm text-text-secondary">{item.preferred_stages}</span></li>}
                                {item.program_duration_months && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Duration</span><span className="text-sm text-text-secondary">{item.program_duration_months} Months</span></li>}
                                {item.date_of_establishment && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Established</span><span className="text-sm text-text-secondary">{item.date_of_establishment}</span></li>}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2"><Zap size={18} className="text-amber-400"/> Focus Areas</h3>
                            <ul className="space-y-3">
                                {item.industries && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Industries</span><span className="text-sm text-text-secondary">{item.industries}</span></li>}
                                {item.sectors && <li className="flex flex-col"><span className="text-xs text-text-tertiary uppercase font-bold">Sectors</span><span className="text-sm text-text-secondary">{item.sectors}</span></li>}
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-4">Incubatees</h3>
                            <div className="flex gap-6">
                                <div className="bg-white/5 border border-functional-border p-4 rounded-xl flex-1 text-center">
                                    <div className="text-2xl font-black text-accent-blue mb-1">{item.no_of_current_incubatees || 'N/A'}</div>
                                    <div className="text-xs text-text-tertiary uppercase font-bold">Current</div>
                                </div>
                                <div className="bg-white/5 border border-functional-border p-4 rounded-xl flex-1 text-center">
                                    <div className="text-2xl font-black text-accent-violet mb-1">{item.no_of_graduated_incubatees || 'N/A'}</div>
                                    <div className="text-xs text-text-tertiary uppercase font-bold">Graduated</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-text-primary mb-4">Contact Info</h3>
                            <ul className="space-y-2 bg-white/5 border border-functional-border p-4 rounded-xl">
                                {item.contact_person && <li className="text-sm text-text-secondary"><span className="text-text-tertiary">Person:</span> {item.contact_person} {item.contact_designation && `(${item.contact_designation})`}</li>}
                                {item.contact_email && <li className="text-sm text-text-secondary"><span className="text-text-tertiary">Email:</span> <a href={`mailto:${item.contact_email}`} className="text-accent-blue hover:underline">{item.contact_email}</a></li>}
                                {item.contact_mobile && <li className="text-sm text-text-secondary"><span className="text-text-tertiary">Phone:</span> {item.contact_mobile}</li>}
                                {item.full_address && <li className="text-sm text-text-secondary mt-2"><span className="text-text-tertiary block mb-1">Address:</span>{item.full_address}</li>}
                            </ul>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function IncubatorCard({ item, onClick }: { item: any, onClick: () => void }) {
    if (!item.name) return null;

    const isAccelerator = item.name.toLowerCase().includes('accelerator');

    return (
        <div 
            onClick={onClick}
            className="flex flex-col glass-card rounded-3xl p-6 md:p-8 bg-bg-surface/40 border border-functional-border hover:border-accent-blue/40 hover:shadow-[0_0_40px_rgba(80,140,255,0.1)] transition-all duration-300 group h-full relative overflow-hidden cursor-pointer"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-functional-border flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IncubatorLogo name={item.name} logo_url={item.logo_url} website={item.website} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                        {isAccelerator ? 'Accelerator' : 'Incubator'}
                    </span>
                    <span className="text-text-tertiary text-[10px] font-medium flex items-center gap-1 max-w-[120px] truncate">
                        <MapPin size={10} className="text-accent-violet shrink-0" />
                        {item.city ? `${item.city}, ${item.state}` : (item.state || 'India')}
                    </span>
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-text-primary mb-2 leading-tight group-hover:text-accent-blue transition-colors line-clamp-2">{item.name}</h3>
            <p className="text-text-secondary text-sm font-light mb-6 line-clamp-2 italic">
                {item.industries || item.sectors || 'Sector Agnostic'}
            </p>

            <div className="space-y-3 mb-8 flex-1 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-functional-border">
                    <span className="text-text-tertiary flex items-center gap-2">
                        <Zap size={14} className="text-amber-400" /> Stages
                    </span>
                    <span className="text-text-primary font-medium truncate max-w-[150px]">{item.stages || 'Any'}</span>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 mt-auto">
                <button className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-text-primary py-3 rounded-xl text-xs font-bold border border-functional-border transition-all group-hover:border-accent-blue/50">
                    View Details
                </button>
            </div>
        </div>
    );
}

export default function IncubatorsPage() {
    const [search, setSearch] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('All Locations');
    const [selectedType, setSelectedType] = useState('All Types');
    const [incubatorsData, setIncubatorsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    useEffect(() => {
        const fetchIncubators = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/tools/incubators`);
                if (res.ok) {
                    const data = await res.json();
                    setIncubatorsData(Array.isArray(data) ? data : []);
                }
            } catch (error) {
                console.error("Failed to fetch incubators", error);
            }
            setIsLoading(false);
        };
        fetchIncubators();
    }, []);

    const locations = useMemo(() => {
        const locs = Array.from(new Set(incubatorsData.map(item => item.state))).filter(Boolean).sort();
        return ['All Locations', ...locs];
    }, [incubatorsData]);

    const types = ['All Types', 'Incubator', 'Accelerator'];

    const filteredData = useMemo(() => {
        return incubatorsData.filter(item => {
            const matchesSearch =
                item.name?.toLowerCase().includes(search.toLowerCase()) ||
                (item.industries && item.industries.toLowerCase().includes(search.toLowerCase())) ||
                (item.sectors && item.sectors.toLowerCase().includes(search.toLowerCase()));

            const matchesLocation = selectedLocation === 'All Locations' || item.state === selectedLocation;

            const isAccelerator = item.name?.toLowerCase().includes('accelerator');
            const matchesType = selectedType === 'All Types' ||
                (selectedType === 'Accelerator' && isAccelerator) ||
                (selectedType === 'Incubator' && !isAccelerator);

            return matchesSearch && matchesLocation && matchesType;
        });
    }, [search, selectedLocation, selectedType, incubatorsData]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link href="/tools" className="inline-flex items-center text-text-tertiary hover:text-text-primary transition-colors mb-8 text-sm group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-5xl font-black text-text-primary tracking-[-0.04em] mb-6">
                        Incubators & <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Accelerators.</span>
                    </h1>
                    <p className="text-xl text-text-secondary font-light max-w-2xl">
                        Comprehensive mapping of major hubs across the ecosystem. Filter by location or type to find your perfect launchpad.
                    </p>
                </div>

                {/* Filter Bar */}
                <div className="glass-card p-4 md:p-6 rounded-[2rem] border border-functional-border bg-bg-surface/30 mb-12 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="flex items-center gap-4 px-4 border-r border-functional-border hidden lg:flex">
                        <Filter size={20} className="text-accent-blue" />
                        <span className="text-xs font-bold text-text-primary uppercase tracking-widest whitespace-nowrap">Filter Hubs</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Location Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-[#0A0A0B] text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">State</label>
                            <select
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full bg-white/5 border border-functional-border rounded-2xl py-4 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {locations.map((loc: any) => <option key={loc} value={loc} className="bg-bg-surface">{loc}</option>)}
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
                                className="w-full bg-white/5 border border-functional-border rounded-2xl py-4 px-4 text-sm text-text-primary focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
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
                                className="w-full bg-white/5 border border-functional-border rounded-2xl py-4 pl-12 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">
                        Results Found: <span className="text-text-primary ml-2">{filteredData.length}</span>
                    </p>
                    <div className="flex gap-2">
                        <button onClick={() => { setSearch(''); setSelectedLocation('All Locations'); setSelectedType('All Types'); }} className="text-[10px] font-bold text-accent-blue hover:text-text-primary transition-colors uppercase tracking-widest border border-accent-blue/20 px-3 py-1 rounded-full">Reset Filters</button>
                    </div>
                </div>

                {/* Grid Layout */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-32">
                        <div className="w-12 h-12 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                    </div>
                ) : filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
                        {filteredData.map((item, i) => (
                            <IncubatorCard key={item.id || i} item={item} onClick={() => setSelectedItem(item)} />
                        ))}
                    </div>
                ) : (
                    <div className="glass-card p-20 rounded-[3rem] border border-dashed border-functional-border text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-8">
                            <Search size={40} className="text-text-tertiary opacity-50" />
                        </div>
                        <h3 className="text-3xl font-bold text-text-primary mb-3">No matching hubs</h3>
                        <p className="text-text-secondary font-light max-w-sm mx-auto mb-10 text-lg">
                            Adjust your filters or search terms to explore more of the startup ecosystem.
                        </p>
                    </div>
                )}
            </div>
            
            {selectedItem && (
                <IncubatorModal item={selectedItem} onClose={() => setSelectedItem(null)} />
            )}
        </div>
    );
}
