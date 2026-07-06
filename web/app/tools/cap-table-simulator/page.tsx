"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";

// Format currency
const formatCurrency = (amount: number, currency: 'INR' | 'USD' = 'USD') => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Reusable manual entry component (duplicated from Financial Modeler to keep this tool standalone)
const EditableNumber = ({
    value,
    onChange,
    currency = null,
    prefix = '',
    suffix = '',
    textColor = "text-text-primary"
}: {
    value: number;
    onChange: (val: number) => void;
    currency?: 'INR' | 'USD' | null;
    prefix?: string;
    suffix?: string;
    textColor?: string;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [localVal, setLocalVal] = useState(value.toString());

    useEffect(() => {
        if (!isEditing) setLocalVal(value.toString());
    }, [value, isEditing]);

    const handleBlur = () => {
        setIsEditing(false);
        const cleanStr = localVal.replace(/[^0-9.-]+/g, "");
        const parsed = parseFloat(cleanStr);
        if (!isNaN(parsed) && parsed >= 0) {
            onChange(parsed);
        } else {
            setLocalVal(value.toString());
        }
    };

    return (
        <input
            type="text"
            value={isEditing ? localVal : (currency ? formatCurrency(value, currency) : `${prefix}${value.toLocaleString()}${suffix}`)}
            onChange={(e) => setLocalVal(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className={`bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-right min-w-[80px] w-auto outline-none font-mono transition-colors border border-transparent focus:border-accent-blue focus:bg-[#0a0a0a] ${textColor}`}
        />
    );
};

type Shareholder = {
    id: string;
    name: string;
    shares: number;
    type: 'founder' | 'employee' | 'investor' | 'option_pool';
    color: string;
};

const COLORS = ['#6496ff', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#0ea5e9']; // Accent blue, violet, green, amber, red, pink, sky

export default function CapTableSimulator() {
    // ─── Core UI States ───
    const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
    const [mounted, setMounted] = useState(false);

    // ─── 1. Pre-Money State ───
    const [shareholders, setShareholders] = useState<Shareholder[]>([
        { id: '1', name: 'Founder (CEO)', shares: 10000000, type: 'founder', color: COLORS[0] },
        { id: 'pool', name: 'Unallocated Option Pool', shares: 0, type: 'option_pool', color: COLORS[2] } // Often zero at founding
    ]);

    // ─── 2. The Seed Round Parameters ───
    const [investmentAmount, setInvestmentAmount] = useState<number>(2000000); // 2M raised
    const [preMoneyValuation, setPreMoneyValuation] = useState<number>(8000000); // 8M pre
    const [targetOptionPoolPercent, setTargetOptionPoolPercent] = useState<number>(10); // Standard 10% post-money pool

    useEffect(() => setMounted(true), []);

    // Handle currency swap
    const handleCurrencyChange = (newCurrency: 'INR' | 'USD') => {
        if (currency === newCurrency) return;
        const rate = newCurrency === 'INR' ? 80 : 1 / 80;
        setInvestmentAmount(Math.round(investmentAmount * rate));
        setPreMoneyValuation(Math.round(preMoneyValuation * rate));
        setCurrency(newCurrency);
    };

    // Shareholder Management
    const foundersCount = shareholders.filter(s => s.type === 'founder').length;

    const addFounder = () => {
        const id = Date.now().toString();
        setShareholders([...shareholders, { id, name: `Founder ${shareholders.length + 1}`, shares: 1000000, type: 'founder', color: COLORS[(shareholders.length) % COLORS.length] }]);
    };

    const updateShareholder = (id: string, field: keyof Shareholder, value: any) => {
        setShareholders(shareholders.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const removeShareholder = (id: string) => {
        const s = shareholders.find(s => s.id === id);
        if (s?.type === 'founder' && foundersCount <= 1) return;
        setShareholders(shareholders.filter(s => s.id !== id));
    };

    // ─── CAP TABLE CALCULATIONS (THE ENGINE) ────────────────────────────────────────
    const calcData = useMemo(() => {
        // 1. Current Pre-Money Cap Table (Before any round or pool expansion)
        const currentTotalShares = shareholders.reduce((sum, s) => sum + s.shares, 0);

        // 2. The "Option Pool Shuffle" (The hardest math for founders)
        // We need the Post-Money Option Pool to equal exactly `targetOptionPoolPercent`% of the FINAL Post-Money shares.
        // Because the pool is created *before* the investors put money in, the dilution is borne entirely by the existing founders.

        const postMoneyValuation = preMoneyValuation + investmentAmount;

        // Target Ownerships
        const investorPercent = investmentAmount / postMoneyValuation;
        const poolTargetPercent = targetOptionPoolPercent / 100;

        // The Founders (and any existing angels) get whatever is left.
        const effectiveFounderPercent = 1 - investorPercent - poolTargetPercent;

        // If effective is <= 0, the math breaks (down round / wipeout)
        const isWipeout = effectiveFounderPercent <= 0;

        // How many total shares will exist Post-Money?
        // Current shares = effective founder %. So PostMoneyShares = CurrentShares / effectiveFounderPercent
        const postMoneyShares = isWipeout ? 0 : currentTotalShares / effectiveFounderPercent;

        // Therefore, how many shares will the Investors buy?
        const newInvestorShares = isWipeout ? 0 : postMoneyShares * investorPercent;

        // And how large must the TOTAL option pool be to equal poolTargetPercent?
        const targetTotalPoolShares = isWipeout ? 0 : postMoneyShares * poolTargetPercent;

        // How many *new* shares need to be created for the pool?
        const currentPool = shareholders.find(s => s.type === 'option_pool')?.shares || 0;
        const newPoolSharesToCreate = Math.max(0, targetTotalPoolShares - currentPool);

        // Calculate Share Price (Important: It's calculated on fully diluted Pre-Money including the newly expanded pool)
        // Share Price = Pre-Money Valuation / (Current Shares + New Pool Shares)
        const effectivePreMoneyShares = currentTotalShares + newPoolSharesToCreate;
        const sharePrice = effectivePreMoneyShares > 0 ? (preMoneyValuation / effectivePreMoneyShares) : 0;

        // Construct the Post-Money Cap Table
        const postShareholders = shareholders.map(s => {
            if (s.type === 'option_pool') {
                return { ...s, shares: s.shares + newPoolSharesToCreate, postPercent: isWipeout ? 0 : ((s.shares + newPoolSharesToCreate) / postMoneyShares) * 100, isNew: false };
            }
            return { ...s, postPercent: isWipeout ? 0 : (s.shares / postMoneyShares) * 100, isNew: false };
        });

        // Add Investors
        postShareholders.push({
            id: 'investor_seed',
            name: 'Seed Investors',
            shares: newInvestorShares,
            type: 'investor',
            color: '#f59e0b', // Amber
            postPercent: isWipeout ? 0 : (newInvestorShares / postMoneyShares) * 100,
            isNew: true
        });

        return {
            preMoneyValuation,
            investmentAmount,
            postMoneyValuation,
            currentTotalShares,
            postMoneyShares,
            sharePrice,
            newPoolSharesToCreate,
            newInvestorShares,
            postShareholders,
            isWipeout
        };
    }, [shareholders, investmentAmount, preMoneyValuation, targetOptionPoolPercent]);

    if (!mounted) return null;

    const { postMoneyValuation, currentTotalShares, postMoneyShares, sharePrice, postShareholders, isWipeout } = calcData;

    // Report Export Logic
    const exportCSV = () => {
        const headers = ['Shareholder Name', 'Type', 'Pre-Money Shares', 'Pre-Money %', 'Post-Money Shares', 'Post-Money %', `Post-Money Value (${currency})`];

        const rows = postShareholders.map(postS => {
            const preS = shareholders.find(s => s.id === postS.id);
            const preShares = preS ? preS.shares : 0;
            const prePercent = currentTotalShares > 0 ? (preShares / currentTotalShares) * 100 : 0;
            const postValue = postS.shares * sharePrice;

            return [
                `"${postS.name}"`,
                postS.type,
                preShares,
                `${prePercent.toFixed(2)}%`,
                postS.shares.toFixed(0),
                `${postS.postPercent.toFixed(2)}%`,
                postValue.toFixed(2)
            ].join(',');
        });

        // Add Total Row
        rows.push([
            '"Total"',
            '-',
            currentTotalShares,
            '100.00%',
            postMoneyShares.toFixed(0),
            '100.00%',
            postMoneyValuation.toFixed(2)
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `cap_table_impact_report_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Helper to draw SVG Pie charts
    const PieChart = ({ data, total }: { data: any[], total: number }) => {
        let currentAngle = 0;
        // Don't draw if 0
        if (total <= 0) return <div className="w-48 h-48 rounded-full bg-white/5 border border-functional-border"></div>;

        return (
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                {data.map((slice, i) => {
                    if (slice.shares <= 0 || Number.isNaN(slice.shares)) return null;
                    const sliceAngle = (slice.shares / total) * 360;

                    // IF the slice is exactly 100%, draw a full circle
                    if (sliceAngle >= 359.9) {
                        return <circle key={slice.id} cx="50" cy="50" r="50" fill={slice.color} />
                    }

                    const x1 = 50 + 50 * Math.cos((currentAngle * Math.PI) / 180);
                    const y1 = 50 + 50 * Math.sin((currentAngle * Math.PI) / 180);

                    const nextAngle = currentAngle + sliceAngle;
                    const x2 = 50 + 50 * Math.cos((nextAngle * Math.PI) / 180);
                    const y2 = 50 + 50 * Math.sin((nextAngle * Math.PI) / 180);

                    const largeArcFlag = sliceAngle > 180 ? 1 : 0;

                    const pathData = [
                        `M 50 50`, // Move to center
                        `L ${x1} ${y1}`, // Line to start of arc
                        `A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2}`, // Arc
                        `Z` // Close path back to center
                    ].join(' ');

                    currentAngle = nextAngle;

                    return (
                        <path
                            key={slice.id}
                            d={pathData}
                            fill={slice.color}
                            className="transition-all duration-500 hover:opacity-80"
                            stroke="#050505"
                            strokeWidth="1"
                        />
                    );
                })}
            </svg>
        );
    };

    return (
        <main className="min-h-screen pt-32 pb-24 bg-bg-main selection:bg-accent-blue/30 selection:text-accent-blue relative w-full overflow-x-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-violet/10 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <Link href="/tools" className="text-accent-violet text-xs font-bold uppercase tracking-widest hover:text-text-primary transition-colors mb-4 flex items-center gap-2 w-max">
                            <i className="fas fa-arrow-left"></i> Tools Directory
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black text-text-primary tracking-tighter mb-4">
                            Cap Table <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Simulator.</span>
                        </h1>
                        <p className="text-lg text-text-secondary font-light max-w-2xl">
                            Simulate your seed round. We handle the brutal &quot;Option Pool Shuffle&quot; math automatically so you actually understand your dilution.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 items-start md:items-end">
                        <div className="flex bg-bg-surface border border-functional-border rounded-full p-1 opacity-90 backdrop-blur-sm">
                            <button onClick={() => handleCurrencyChange('USD')} className={`py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${currency === 'USD' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary hover:bg-white/5'}`}>USD ($)</button>
                            <button onClick={() => handleCurrencyChange('INR')} className={`py-2 px-4 text-xs font-bold uppercase tracking-wider rounded-full transition-all ${currency === 'INR' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary hover:bg-white/5'}`}>INR (₹)</button>
                        </div>
                        <button onClick={exportCSV} className="bg-white/10 hover:bg-white/20 border border-functional-border text-text-primary px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2 shadow-lg w-max">
                            <i className="fas fa-file-csv"></i> Download Impact Report
                        </button>
                    </div>
                </div>

                {isWipeout && (
                    <div className="bg-red-500/10 border border-red-500 text-red-500 p-6 rounded-2xl mb-8 flex items-start gap-4 animate-in slide-in-from-top-4">
                        <i className="fas fa-exclamation-triangle text-2xl mt-1"></i>
                        <div>
                            <h3 className="font-bold text-lg">Catastrophic Dilution Wrapper (Wipeout)</h3>
                            <p className="text-sm opacity-80 mt-1">You are trying to sell more than 100% of your company. Increase your Pre-Money Valuation or decrease the Investment Amount/Option Pool size.</p>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* ─── LEFT: CONTROLS ─── */}
                    <div className="lg:col-span-5 flex flex-col gap-6">

                        {/* Box 1: Pre-Money Cap Table */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-functional-border bg-bg-surface">
                            <h3 className="text-xl font-black text-text-primary mb-2">1. Current Cap Table</h3>
                            <p className="text-xs text-text-tertiary mb-6">Before the funding round.</p>

                            <div className="space-y-4 mb-6">
                                {shareholders.map(s => (
                                    <div key={s.id} className="flex justify-between items-center group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-3 h-3 rounded-sm shadow-sm" style={{ backgroundColor: s.color }}></div>
                                            {s.type === 'option_pool' ? (
                                                <span className="text-sm font-medium text-text-primary">{s.name}</span>
                                            ) : (
                                                <input
                                                    value={s.name}
                                                    onChange={(e) => updateShareholder(s.id, 'name', e.target.value)}
                                                    className="bg-transparent text-sm font-medium text-text-primary border-b border-transparent focus:border-white/30 outline-none w-32 md:w-48"
                                                />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <EditableNumber
                                                value={s.shares}
                                                onChange={(val) => updateShareholder(s.id, 'shares', val)}
                                                textColor={s.type === 'option_pool' ? 'text-text-secondary' : 'text-accent-blue'}
                                            />
                                            {s.type !== 'option_pool' && (s.type !== 'founder' || foundersCount > 1) && (
                                                <button onClick={() => removeShareholder(s.id)} className="text-text-primary/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 p-1 title-attr" title="Remove Founder">
                                                    <i className="fas fa-times text-xs"></i>
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button onClick={addFounder} className="w-full py-3 rounded-xl border border-dashed border-functional-border text-text-primary/50 hover:text-text-primary hover:border-functional-border0 hover:bg-white/5 transition-all text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2">
                                <i className="fas fa-plus"></i> Add Founder
                            </button>

                            <div className="mt-6 pt-4 border-t border-functional-border flex justify-between items-center text-sm font-bold text-text-primary">
                                <span>Total Shares</span>
                                <span>{currentTotalShares.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Box 2: The Raise */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-accent-violet/20 bg-accent-violet/5">
                            <h3 className="text-xl font-black text-text-primary mb-2">2. Term Sheet (The Raise)</h3>
                            <p className="text-xs text-text-tertiary mb-6">Investors dictating the terms.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                        <span>Investment Amount</span>
                                        <EditableNumber value={investmentAmount} onChange={setInvestmentAmount} currency={currency} textColor="text-green-400 font-bold" />
                                    </label>
                                    <input type="range" min="0" max={currency === 'INR' ? 500000000 : 5000000} step={currency === 'INR' ? 1000000 : 100000}
                                        value={investmentAmount} onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center group relative cursor-help">
                                        <span className="border-b border-dotted border-text-tertiary">Pre-Money Valuation</span>
                                        <EditableNumber value={preMoneyValuation} onChange={setPreMoneyValuation} currency={currency} textColor="text-text-primary font-bold" />

                                        {/* Tooltip */}
                                        <div className="absolute bottom-full left-0 mb-2 w-64 bg-[#111] border border-functional-border p-3 rounded-lg text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                            The value of your company *before* the new money enters the bank account.
                                        </div>
                                    </label>
                                    <input type="range" min="1000000" max={currency === 'INR' ? 2000000000 : 25000000} step={currency === 'INR' ? 5000000 : 500000}
                                        value={preMoneyValuation} onChange={(e) => setPreMoneyValuation(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                </div>

                                <div className="p-4 bg-bg-main/40 rounded-xl border border-functional-border relative group cursor-help">
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                        <span className="font-bold text-accent-blue border-b border-dotted border-accent-blue/50">Post-Money Option Pool Target</span>
                                        <EditableNumber value={targetOptionPoolPercent} onChange={setTargetOptionPoolPercent} suffix="%" textColor="text-accent-blue font-bold" />
                                    </label>
                                    <input type="range" min="0" max="25" step="1"
                                        value={targetOptionPoolPercent} onChange={(e) => setTargetOptionPoolPercent(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue" />
                                    <p className="text-[10px] text-text-tertiary mt-3 leading-relaxed">
                                        Investors require a 10-15% unallocated options pool to hire future employees. Because this pool is created *before* the investment, <span className="text-red-400 font-bold">100% of the dilution hits the founders</span>.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* ─── RIGHT: VISUALIZATION ─── */}
                    <div className="lg:col-span-7 flex flex-col gap-6 lg:sticky lg:top-32">

                        {/* Top Metrics */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="glass-card p-5 rounded-2xl border border-functional-border bg-bg-surface">
                                <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">Calculated Share Price</span>
                                <span className="text-xl md:text-2xl font-mono text-text-primary block tracking-tight">{formatCurrency(sharePrice, currency)}</span>
                            </div>
                            <div className="glass-card p-5 rounded-2xl border border-functional-border bg-bg-surface">
                                <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">Post-Money Valuation</span>
                                <span className="text-xl md:text-2xl font-mono text-text-primary block tracking-tight">{formatCurrency(postMoneyValuation, currency)}</span>
                            </div>
                            <div className="glass-card p-5 rounded-2xl border border-functional-border bg-bg-surface md:col-span-1 col-span-2">
                                <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">New Pool Shares Issued</span>
                                <span className="text-xl md:text-2xl font-mono text-red-400 block tracking-tight">+{calcData.newPoolSharesToCreate.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Pie Chart Visuals */}
                        <div className="glass-card p-6 md:p-8 rounded-3xl border border-functional-border bg-bg-surface relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-accent-violet/5 rounded-full blur-[80px] pointer-events-none"></div>

                            <div className="grid grid-cols-2 w-full gap-8 relative z-10">
                                {/* Pre Money Pie */}
                                <div className="flex flex-col items-center text-center">
                                    <h4 className="text-xs font-bold text-text-tertiary uppercase tracking-widest mb-6 border-b border-functional-border pb-2 w-full">Current (Pre-Money)</h4>
                                    <div className="w-32 h-32 md:w-48 md:h-48 relative drop-shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                                        <PieChart data={shareholders} total={currentTotalShares} />
                                    </div>
                                    <div className="mt-6 flex flex-col gap-1 w-full max-w-[200px]">
                                        {shareholders.map(s => (
                                            <div key={`pre-${s.id}`} className="flex justify-between text-[10px] font-mono border-b border-functional-border py-1">
                                                <span className="text-text-primary truncate pr-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: s.color }}></span> {s.name}</span>
                                                <span className="text-text-secondary">{currentTotalShares > 0 ? ((s.shares / currentTotalShares) * 100).toFixed(1) : 0}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Post Money Pie */}
                                <div className="flex flex-col items-center text-center">
                                    <h4 className="text-xs font-bold text-green-400 uppercase tracking-widest mb-6 border-b border-green-400/20 pb-2 w-full">Post-Seed Round</h4>
                                    <div className="w-32 h-32 md:w-48 md:h-48 relative drop-shadow-[0_0_30px_rgba(100,255,100,0.1)]">
                                        <PieChart data={postShareholders} total={postMoneyShares} />
                                    </div>
                                    <div className="mt-6 flex flex-col gap-1 w-full max-w-[240px]">
                                        {postShareholders.map(s => (
                                            <div key={`post-${s.id}`} className={`flex justify-between items-center text-[10px] font-mono border-b border-functional-border py-1 ${s.isNew ? 'bg-amber-500/10 px-2 rounded -mx-2 border-transparent' : ''}`}>
                                                <span className="text-text-primary truncate pr-2 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: s.color }}></span> {s.name}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={s.type === 'investor' ? 'text-amber-400 font-bold' : s.type === 'option_pool' && calcData.newPoolSharesToCreate > 0 ? 'text-accent-blue' : 'text-text-secondary'}>
                                                        {s.postPercent.toFixed(1)}%
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 text-center text-xs text-text-tertiary bg-white/5 py-2 px-6 rounded-full border border-functional-border font-medium">
                                Look closely: Even though you sold <span className="text-text-primary font-bold">{isWipeout ? 0 : ((investmentAmount / postMoneyValuation) * 100).toFixed(1)}%</span> to investors, founder dilution is much higher due to the Option Pool.
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    );
}
