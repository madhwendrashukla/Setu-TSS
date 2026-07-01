'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, Filter, ArrowLeft, ExternalLink, Globe, Layout, TrendingUp, Calendar } from 'lucide-react';
import { globalPitchDecksData, GlobalPitchDeck } from '@/lib/data/globalPitchDecks';

// Curated domain map for companies whose domain differs from their name
const DOMAIN_MAP: Record<string, string> = {
    'airbnb': 'airbnb.com',
    'uber': 'uber.com',
    'facebook': 'facebook.com',
    'linkedin': 'linkedin.com',
    'dropbox': 'dropbox.com',
    'youtube': 'youtube.com',
    'snapchat': 'snapchat.com',
    'doordash': 'doordash.com',
    'wework': 'wework.com',
    'spacex': 'spacex.com',
    'tinder': 'tinder.com',
    'elevenlabs': 'elevenlabs.io',
    'candidate.fyi': 'candidate.fyi',
    'crosby health': 'crosbyhealth.com',
    'micro1': 'micro1.ai',
    'iconic ai': 'iconicai.io',
    'pruna ai': 'pruna.ai',
    'seek ai': 'seek.ai',
    'seam social': 'seam.so',
    'avatarос': 'avatarios.com',
    'avatarOS': 'avatarios.com',
    'lirvana labs': 'lirvanalabs.com',
    'vaulted deep': 'vaulteddeep.com',
    'kamino': 'kamino.finance',
    'proofs': 'proofs.xyz',
    'zive': 'zive.so',
};

function getLogoDomain(company: string): string {
    const key = company.toLowerCase().trim();
    return DOMAIN_MAP[key] || DOMAIN_MAP[key.replace(/\s+/g, '')] || (key.replace(/[^a-z0-9]/g, '') + '.com');
}

function CompanyLogo({ company }: { company: string }) {
    const domain = getLogoDomain(company);
    const sources = [
        `https://logo.clearbit.com/${domain}`,
        `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
    ];
    const [idx, setIdx] = React.useState(0);
    const [failed, setFailed] = React.useState(false);
    const gradients = [
        'from-blue-500 to-violet-600',
        'from-purple-500 to-pink-500',
        'from-emerald-500 to-teal-400',
        'from-orange-500 to-amber-400',
        'from-rose-500 to-red-400',
        'from-cyan-500 to-blue-500',
    ];
    const grad = gradients[company.charCodeAt(0) % gradients.length];
    if (failed) {
        return (
            <div className={`w-full h-full rounded-2xl bg-gradient-to-br ${grad} flex items-center justify-center`}>
                <span className="text-xl font-black text-gray-900 drop-shadow">{company.charAt(0).toUpperCase()}</span>
            </div>
        );
    }
    return (
        <img
            src={sources[idx]}
            alt={company}
            className="w-full h-full object-contain p-1.5"
            onError={() => {
                if (idx < sources.length - 1) setIdx(idx + 1);
                else setFailed(true);
            }}
        />
    );
}

function PitchDeckCard({ deck }: { deck: GlobalPitchDeck }) {

    return (
        <div className="shadow-sm p-6 md:p-8 rounded-[2.5rem] border border-gray-200 hover:border-accent-blue/40 hover:shadow-[0_0_40px_rgba(80,140,255,0.1)] transition-all duration-300 group flex flex-col h-full bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-black/[0.02] to-transparent pointer-events-none"></div>

            <div className="flex justify-between items-start mb-6 shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <CompanyLogo company={deck.company} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className="bg-accent-violet/10 border border-accent-violet/20 text-accent-violet text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest leading-none">
                        {deck.round}
                    </span>
                    <span className="text-text-tertiary text-[10px] font-medium flex items-center gap-1">
                        <Calendar size={10} className="text-accent-blue" />
                        {deck.year}
                    </span>
                </div>
            </div>

            <div className="flex-1">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-accent-blue transition-colors line-clamp-1">{deck.company}</h3>
                <p className="text-text-secondary text-sm font-light mb-6 line-clamp-2 italic leading-relaxed">
                    "{deck.tagline}"
                </p>

                <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-text-tertiary flex items-center gap-2">
                            <TrendingUp size={14} className="text-accent-blue" /> Raised
                        </span>
                        <span className="text-gray-900 font-bold">{deck.raisedThisRound}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                        <span className="text-text-tertiary flex items-center gap-2">
                            <Layout size={14} className="text-accent-violet" /> Sector
                        </span>
                        <span className="text-gray-900 font-bold truncate max-w-[120px]">{deck.sector}</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-3 pt-4 border-t border-gray-100">
                <Link
                    href={`/tools/pitch-decks/${deck.id}`}
                    className="w-full flex items-center justify-center gap-2 bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))] hover:opacity-90 text-white py-3 rounded-2xl text-xs font-bold transition-all shadow-lg shadow-accent-blue/10"
                >
                    View Pitch Deck <ExternalLink size={14} />
                </Link>
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {deck.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] font-bold text-text-tertiary uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-200">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function PitchDecksPage() {
    const [search, setSearch] = useState('');
    const [selectedSector, setSelectedSector] = useState('All Sectors');

    const sectors = useMemo(() => {
        const s = new Set<string>();
        globalPitchDecksData.forEach(deck => s.add(deck.sector));
        return ['All Sectors', ...Array.from(s).sort()];
    }, []);

    const filteredDecks = useMemo(() => {
        return globalPitchDecksData.filter(deck => {
            const matchesSearch =
                deck.company.toLowerCase().includes(search.toLowerCase()) ||
                deck.tagline.toLowerCase().includes(search.toLowerCase()) ||
                deck.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
            const matchesSector = selectedSector === 'All Sectors' || deck.sector === selectedSector;
            return matchesSearch && matchesSector;
        });
    }, [search, selectedSector]);

    return (
        <div className="pt-32 pb-20 min-h-screen bg-bg-main relative">
            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <Link href="/tools" className="inline-flex items-center text-text-tertiary hover:text-gray-900 transition-colors mb-8 text-sm group">
                    <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Tools
                </Link>

                <div className="mb-12">
                    <h1 className="text-5xl md:text-5xl font-black text-gray-900 tracking-[-0.04em] mb-6">
                        Pitch Deck <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Repo.</span>
                    </h1>
                    <p className="text-xl text-text-secondary font-light max-w-2xl leading-relaxed">
                        The ultimate repository of winning pitch decks from global unicorns. Study how the best in the world built their narrative.
                    </p>
                </div>

                {/* Filter Bar: Unified Style */}
                <div className="shadow-sm p-4 md:p-6 rounded-[2rem] border border-gray-200 bg-white mb-12 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    <div className="flex items-center gap-4 px-4 border-r border-gray-200 hidden lg:flex">
                        <Filter size={20} className="text-accent-blue" />
                        <span className="text-xs font-bold text-gray-900 uppercase tracking-widest whitespace-nowrap">Browse Repo</span>
                    </div>

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Sector Select */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-white text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Economic Sector</label>
                            <select
                                value={selectedSector}
                                onChange={(e) => setSelectedSector(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 px-4 text-sm text-gray-900 focus:outline-none focus:border-accent-blue/50 transition-all appearance-none cursor-pointer"
                            >
                                {sectors.map(s => <option key={s} value={s} className="bg-white">{s}</option>)}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-tertiary">
                                <Search size={16} className="rotate-90" />
                            </div>
                        </div>

                        {/* Search Input */}
                        <div className="relative group">
                            <label className="absolute left-4 -top-2 px-2 bg-white text-[10px] font-bold text-text-tertiary uppercase tracking-wider z-20 transition-colors group-focus-within:text-accent-blue">Search Companies</label>
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-tertiary group-focus-within:text-accent-blue transition-colors">
                                <Search size={18} />
                            </div>
                            <input
                                type="text"
                                placeholder="YC, Unicorns, specific industry..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full bg-gray-50 border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm text-gray-900 placeholder:text-text-tertiary focus:outline-none focus:border-accent-blue/50 transition-all"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between mb-8">
                    <p className="text-text-tertiary text-xs font-bold uppercase tracking-widest">
                        Decks Available: <span className="text-gray-900 ml-2">{filteredDecks.length}</span>
                    </p>
                </div>

                {/* Grid Layout */}
                {filteredDecks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredDecks.map((deck) => (
                            <PitchDeckCard key={deck.id} deck={deck} />
                        ))}
                    </div>
                ) : (
                    <div className="shadow-sm p-20 rounded-[3rem] border border-dashed border-gray-200 text-center flex flex-col items-center justify-center min-h-[400px]">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-8">
                            <Search size={40} className="text-text-tertiary opacity-30" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Deck not found</h3>
                        <p className="text-text-secondary font-light max-w-sm mx-auto mb-10 text-lg leading-relaxed">
                            Try adjusting your search criteria or explore our hall of fame sectors.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
