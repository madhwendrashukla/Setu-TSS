"use client";

import { useState, useMemo, useEffect } from 'react';

// Format currency
const formatCurrency = (amount: number, currency: 'INR' | 'USD') => {
    return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount);
};

// Reusable manual entry component
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
            value={isEditing ? localVal : (currency ? formatCurrency(value, currency) : `${prefix}${value}${suffix}`)}
            onChange={(e) => setLocalVal(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className={`bg-white/5 hover:bg-white/10 px-2 py-0.5 rounded text-right min-w-[80px] w-auto outline-none font-mono transition-colors border border-transparent focus:border-accent-blue focus:bg-bg-main ${textColor}`}
        />
    );
};

export default function FinancialModeler() {
    // ─── Core UI States ───
    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [activeTab, setActiveTab] = useState<'BASICS' | 'REVENUE' | 'COSTS' | 'FUNDING'>('BASICS');
    const [viewMode, setViewMode] = useState<'CHART' | 'TABLE'>('CHART');

    // ─── 1. Basics ───
    const [startingCash, setStartingCash] = useState<number>(5000000);
    const [mrr, setMrr] = useState<number>(500000);
    const [oneOffRevenue, setOneOffRevenue] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(1500000);

    // ─── 2. Revenue Matrix ───
    const [growthMode, setGrowthMode] = useState<'PERCENTAGE' | 'MARKETING'>('PERCENTAGE');
    const [mrrGrowth, setMrrGrowth] = useState<number>(10);
    const [cac, setCac] = useState<number>(5000); // Cost to acquire customer
    const [arpa, setArpa] = useState<number>(10000); // Avg revenue per account
    const [marketingBudget, setMarketingBudget] = useState<number>(100000); // Monthly spend
    const [mrrChurn, setMrrChurn] = useState<number>(5);

    // ─── 3. Costs & Team ───
    const [expenseGrowth, setExpenseGrowth] = useState<number>(2);
    const [cogsPercent, setCogsPercent] = useState<number>(20);
    const [hiresPerMonth, setHiresPerMonth] = useState<number>(0);
    const [avgSalary, setAvgSalary] = useState<number>(100000);

    // ─── 4. Fundraising ───
    const [raiseAmount, setRaiseAmount] = useState<number>(0);
    const [raiseMonth, setRaiseMonth] = useState<number>(6); // Default month 6

    // Handle currency swap appropriately
    const handleCurrencyChange = (newCurrency: 'INR' | 'USD') => {
        if (currency === newCurrency) return;
        const rate = newCurrency === 'INR' ? 80 : 1 / 80;

        setStartingCash(Math.round(startingCash * rate));
        setMrr(Math.round(mrr * rate));
        setOneOffRevenue(Math.round(oneOffRevenue * rate));
        setExpenses(Math.round(expenses * rate));
        setCac(Math.round(cac * rate));
        setArpa(Math.round(arpa * rate));
        setMarketingBudget(Math.round(marketingBudget * rate));
        setAvgSalary(Math.round(avgSalary * rate));
        setRaiseAmount(Math.round(raiseAmount * rate));

        setCurrency(newCurrency);
    };

    // Support hydration
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // ─── CALCULATIONS ────────────────────────────────────────────────────────
    const projectionData = useMemo(() => {
        let currentCash = startingCash;
        let currentMrr = mrr;
        let baseExpenses = expenses;
        let cumulativeHires = 0;

        const data = [];
        let runwayMonths = 0;
        let defaultAlive = false;
        let willRunOut = false;


        // Project out 24 months
        for (let month = 0; month <= 24; month++) {

            // Apply fundraising injection
            let fundInjection = 0;
            if (month === raiseMonth && raiseAmount > 0) {
                currentCash += raiseAmount;
                fundInjection = raiseAmount;
            }

            // Calculate Revenue
            const grossRevenue = currentMrr + oneOffRevenue;

            // Calculate COGS and Gross Profit
            const cogs = grossRevenue * (cogsPercent / 100);
            const grossProfit = grossRevenue - cogs;

            // Calculate Base Expenses + Hires + Marketing
            const hiringCosts = cumulativeHires * avgSalary;
            const currentMarketingSpend = growthMode === 'MARKETING' ? marketingBudget : 0;
            const totalExpenses = baseExpenses + hiringCosts + currentMarketingSpend;

            // Net Burn
            const netBurn = totalExpenses - grossProfit;

            // Record data
            data.push({
                month,
                cash: currentCash, // Allow going negative so the true debt is visible
                revenue: currentMrr,
                grossRevenue,
                grossProfit,
                expenses: totalExpenses,
                marketingSpend: currentMarketingSpend,
                burn: netBurn > 0 ? netBurn : 0,
                profit: netBurn < 0 ? Math.abs(netBurn) : 0,
                headcountAdded: cumulativeHires,
                fundInjection
            });

            // Check if runway ends
            if (currentCash <= 0 && !willRunOut) {
                willRunOut = true;
                runwayMonths = month;
            }

            // Calculate NEXT month's starting cash
            currentCash -= netBurn;

            // Growth Model Calculations
            const mrrLost = currentMrr * (mrrChurn / 100);

            if (growthMode === 'MARKETING') {
                const customersAcquired = cac > 0 ? marketingBudget / cac : 0;
                const newMrrAdded = customersAcquired * arpa;
                currentMrr = currentMrr + newMrrAdded - mrrLost;
            } else {
                const newMrrAdded = currentMrr * (mrrGrowth / 100);
                currentMrr = currentMrr + newMrrAdded - mrrLost;
            }

            // Expenses grow
            baseExpenses = baseExpenses * (1 + (expenseGrowth / 100));
            cumulativeHires += hiresPerMonth;
        }

        // Default Alive Check
        if (!willRunOut) {
            defaultAlive = true;
            runwayMonths = 24;
        }

        // Initial stats
        const initialGrossRevenue = mrr + oneOffRevenue;
        const initialCogs = initialGrossRevenue * (cogsPercent / 100);
        const initialGrossProfit = initialGrossRevenue - initialCogs;
        const initialNetBurn = (expenses + (growthMode === 'MARKETING' ? marketingBudget : 0)) - initialGrossProfit;

        return {
            projection: data,
            runwayMonths,
            defaultAlive,
            willRunOut,
            initialNetBurn,
            initialGrossMargin: Math.round(100 - cogsPercent)
        };
    }, [startingCash, mrr, oneOffRevenue, expenses, mrrGrowth, mrrChurn, expenseGrowth, cogsPercent, hiresPerMonth, avgSalary, growthMode, cac, arpa, marketingBudget, raiseAmount, raiseMonth]);

    // ─── EXPORT CSV ───
    const exportToCsv = () => {
        const headers = ['Month', 'Cash Balance', 'Gross Revenue', 'MRR', 'Gross Profit', 'Total Expenses', 'Marketing Spend', 'Net Burn/Profit', 'Funds Raised'];
        const csvRows = [headers.join(',')];

        for (const row of projectionData.projection) {
            csvRows.push([
                row.month,
                row.cash.toFixed(2),
                row.grossRevenue.toFixed(2),
                row.revenue.toFixed(2),
                row.grossProfit.toFixed(2),
                row.expenses.toFixed(2),
                row.marketingSpend.toFixed(2),
                (row.burn > 0 ? -row.burn : row.profit).toFixed(2),
                row.fundInjection.toFixed(2)
            ].join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `financial_projection_${currency}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    if (!mounted) return null;

    const { projection, runwayMonths, defaultAlive, initialNetBurn, initialGrossMargin } = projectionData;
    const maxCash = Math.max(...projection.map(d => d.cash), 1);

    const tabs = [
        { id: 'BASICS', label: '1. Basics' },
        { id: 'REVENUE', label: '2. Revenue' },
        { id: 'COSTS', label: '3. Costs' },
        { id: 'FUNDING', label: '4. Funding' }
    ] as const;

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* ─── LEFT: CONTROLS ─── */}
            <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-32">

                {/* Header controls (Currency & Tabs) */}
                <div className="flex flex-col gap-4 bg-bg-surface border border-functional-border rounded-2xl p-4">
                    <div className="flex gap-2 w-full">
                        <button
                            onClick={() => handleCurrencyChange('INR')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${currency === 'INR'
                                ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                : 'text-text-tertiary hover:text-text-primary hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            INR (₹)
                        </button>
                        <button
                            onClick={() => handleCurrencyChange('USD')}
                            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold tracking-widest uppercase transition-all ${currency === 'USD'
                                ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30'
                                : 'text-text-tertiary hover:text-text-primary hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            USD ($)
                        </button>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-1 bg-white/5 p-1 rounded-xl">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === tab.id
                                    ? 'bg-white/10 text-text-primary shadow-sm'
                                    : 'text-text-tertiary hover:text-text-primary hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Content based on Active Tab */}
                <div className="glass-card p-6 md:p-8 rounded-3xl border border-functional-border bg-bg-surface min-h-[440px]">

                    {/* --- TAB: BASICS --- */}
                    {activeTab === 'BASICS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-2">The Basics</h3>
                                <p className="text-xs text-text-tertiary mb-6">Your starting financial position for the model.</p>
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Starting Bank Balance</span>
                                    <EditableNumber value={startingCash} onChange={setStartingCash} currency={currency} textColor="text-text-primary" />
                                </label>
                                <input type="range" min="0" max={currency === 'INR' ? 100000000 : 1000000} step={currency === 'INR' ? 500000 : 10000}
                                    value={startingCash} onChange={(e) => setStartingCash(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue" />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Current MRR</span>
                                    <EditableNumber value={mrr} onChange={setMrr} currency={currency} textColor="text-green-400" />
                                </label>
                                <input type="range" min="0" max={currency === 'INR' ? 10000000 : 100000} step={currency === 'INR' ? 50000 : 1000}
                                    value={mrr} onChange={(e) => setMrr(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500" />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Monthly One-Off Revenue</span>
                                    <EditableNumber value={oneOffRevenue} onChange={setOneOffRevenue} currency={currency} prefix="+" textColor="text-green-400" />
                                </label>
                                <input type="range" min="0" max={currency === 'INR' ? 5000000 : 50000} step={currency === 'INR' ? 25000 : 500}
                                    value={oneOffRevenue} onChange={(e) => setOneOffRevenue(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500" />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Monthly Base Expenses</span>
                                    <EditableNumber value={expenses} onChange={setExpenses} currency={currency} textColor="text-red-400" />
                                </label>
                                <input type="range" min="0" max={currency === 'INR' ? 20000000 : 200000} step={currency === 'INR' ? 50000 : 1000}
                                    value={expenses} onChange={(e) => setExpenses(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500" />
                            </div>
                        </div>
                    )}

                    {/* --- TAB: REVENUE --- */}
                    {activeTab === 'REVENUE' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-2">Revenue Matrix</h3>
                                <p className="text-xs text-text-tertiary mb-6">Choose how your startup acquires new revenue.</p>
                            </div>

                            {/* Growth Mode Toggle */}
                            <div className="flex bg-white/5 p-1 rounded-lg mb-4">
                                <button onClick={() => setGrowthMode('PERCENTAGE')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${growthMode === 'PERCENTAGE' ? 'bg-white/10 text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}>Flat % Growth</button>
                                <button onClick={() => setGrowthMode('MARKETING')} className={`flex-1 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-md ${growthMode === 'MARKETING' ? 'bg-white/10 text-text-primary' : 'text-text-tertiary hover:text-text-primary'}`}>Marketing ROI</button>
                            </div>

                            {growthMode === 'PERCENTAGE' ? (
                                <div>
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                        <span>New MRR Growth (MoM)</span>
                                        <EditableNumber value={mrrGrowth} onChange={setMrrGrowth} prefix="+" suffix="%" textColor="text-green-400" />
                                    </label>
                                    <input type="range" min="0" max="50" step="1"
                                        value={mrrGrowth} onChange={(e) => setMrrGrowth(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-500" />
                                </div>
                            ) : (
                                <div className="space-y-6 border border-accent-violet/20 bg-accent-violet/5 p-4 rounded-xl">
                                    <div>
                                        <label className="flex justify-between text-xs text-text-secondary mb-2 items-center">
                                            <span>Monthly Marketing Budget</span>
                                            <EditableNumber value={marketingBudget} onChange={setMarketingBudget} currency={currency} textColor="text-text-primary" />
                                        </label>
                                        <input type="range" min="0" max={currency === 'INR' ? 2000000 : 20000} step={currency === 'INR' ? 10000 : 500}
                                            value={marketingBudget} onChange={(e) => setMarketingBudget(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-violet" />
                                    </div>
                                    <div>
                                        <label className="flex justify-between text-xs text-text-secondary mb-2 items-center">
                                            <span>CAC (Acquisition Cost)</span>
                                            <EditableNumber value={cac} onChange={setCac} currency={currency} textColor="text-red-300" />
                                        </label>
                                        <input type="range" min="10" max={currency === 'INR' ? 50000 : 500} step={currency === 'INR' ? 500 : 10}
                                            value={cac} onChange={(e) => setCac(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-400" />
                                    </div>
                                    <div>
                                        <label className="flex justify-between text-xs text-text-secondary mb-2 items-center">
                                            <span>ARPA (Avg Rev / Acct)</span>
                                            <EditableNumber value={arpa} onChange={setArpa} currency={currency} textColor="text-green-300" />
                                        </label>
                                        <input type="range" min="10" max={currency === 'INR' ? 100000 : 1000} step={currency === 'INR' ? 1000 : 10}
                                            value={arpa} onChange={(e) => setArpa(Number(e.target.value))}
                                            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-green-400" />
                                    </div>
                                    <div className="bg-bg-main/50 p-2 rounded text-[10px] text-text-secondary text-center">
                                        Acquires <span className="text-text-primary font-bold">{cac > 0 ? (marketingBudget / cac).toFixed(0) : 0} users</span> adding <span className="text-green-400 font-bold">{formatCurrency((cac > 0 ? (marketingBudget / cac) : 0) * arpa, currency)} MRR</span> monthly.
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>MRR Churn Rate (MoM)</span>
                                    <EditableNumber value={mrrChurn} onChange={setMrrChurn} prefix="-" suffix="%" textColor="text-red-400" />
                                </label>
                                <input type="range" min="0" max="25" step="1"
                                    value={mrrChurn} onChange={(e) => setMrrChurn(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500" />
                            </div>
                        </div>
                    )}

                    {/* --- TAB: COSTS --- */}
                    {activeTab === 'COSTS' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-2">Costs & Hiring</h3>
                                <p className="text-xs text-text-tertiary mb-6">Model your team growth and margins.</p>
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>COGS (Cost of Goods Sold)</span>
                                    <EditableNumber value={cogsPercent} onChange={setCogsPercent} suffix="%" textColor="text-red-400" />
                                </label>
                                <input type="range" min="0" max="100" step="1"
                                    value={cogsPercent} onChange={(e) => setCogsPercent(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500" />
                                <p className="text-[10px] text-text-tertiary mt-1">Direct costs to deliver your product (e.g. servers)</p>
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Base Expense Growth</span>
                                    <EditableNumber value={expenseGrowth} onChange={setExpenseGrowth} prefix="+" suffix="%" textColor="text-red-400" />
                                </label>
                                <input type="range" min="0" max="25" step="1"
                                    value={expenseGrowth} onChange={(e) => setExpenseGrowth(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500" />
                                <p className="text-[10px] text-text-tertiary mt-1">Natural bloat in software, office space, etc.</p>
                            </div>

                            <hr className="border-functional-border" />

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Planned Hires / Month</span>
                                    <EditableNumber value={hiresPerMonth} onChange={setHiresPerMonth} suffix=" ppl" textColor="text-text-primary" />
                                </label>
                                <input type="range" min="0" max="10" step="1"
                                    value={hiresPerMonth} onChange={(e) => setHiresPerMonth(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue" />
                            </div>

                            <div>
                                <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                    <span>Avg Salary / Hire / Mo</span>
                                    <EditableNumber value={avgSalary} onChange={setAvgSalary} currency={currency} textColor="text-red-400" />
                                </label>
                                <input type="range" min="0" max={currency === 'INR' ? 500000 : 20000} step={currency === 'INR' ? 5000 : 500}
                                    value={avgSalary} onChange={(e) => setAvgSalary(Number(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500" />
                            </div>
                        </div>
                    )}

                    {/* --- TAB: FUNDING --- */}
                    {activeTab === 'FUNDING' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div>
                                <h3 className="text-xl font-black text-text-primary mb-2">Fundraising Events</h3>
                                <p className="text-xs text-text-tertiary mb-6">Simulate a capital injection into your runway.</p>
                            </div>

                            <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-xl p-6 space-y-6">
                                <div>
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                        <span>Capital Raise Amount</span>
                                        <EditableNumber value={raiseAmount} onChange={setRaiseAmount} currency={currency} prefix="+" textColor="text-accent-blue font-bold" />
                                    </label>
                                    <input type="range" min="0" max={currency === 'INR' ? 500000000 : 5000000} step={currency === 'INR' ? 1000000 : 50000}
                                        value={raiseAmount} onChange={(e) => setRaiseAmount(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-blue" />
                                </div>

                                <div>
                                    <label className="flex justify-between text-sm text-text-secondary mb-2 items-center">
                                        <span>Month of Injection</span>
                                        <EditableNumber value={raiseMonth} onChange={setRaiseMonth} prefix="Month " textColor="text-text-primary" />
                                    </label>
                                    <input type="range" min="1" max="23" step="1"
                                        value={raiseMonth} onChange={(e) => setRaiseMonth(Number(e.target.value))}
                                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white" />
                                </div>
                                <p className="text-xs text-text-tertiary italic text-center">
                                    Watch the chart immediately spike in Month {raiseMonth} to extend your runway.
                                    <br />
                                    (Or use the Detailed Report view to see exact numbers)
                                </p>
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* ─── RIGHT: DASHBOARD ─── */}
            <div className="lg:col-span-8 flex flex-col gap-6 lg:sticky lg:top-32">

                {/* Top Header Actions */}
                <div className="flex justify-between items-center mb-[-12px] z-10 w-full">
                    <div className="flex bg-bg-surface border border-functional-border rounded-full p-1 opacity-90 backdrop-blur-sm">
                        <button onClick={() => setViewMode('CHART')} className={`py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${viewMode === 'CHART' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary hover:bg-white/5'}`}>Chart</button>
                        <button onClick={() => setViewMode('TABLE')} className={`py-1.5 px-4 text-[10px] font-bold uppercase tracking-wider rounded-full transition-all ${viewMode === 'TABLE' ? 'bg-white/10 text-text-primary shadow-sm' : 'text-text-tertiary hover:text-text-primary hover:bg-white/5'}`}>Detailed Report</button>
                    </div>
                    <button onClick={exportToCsv} className="bg-white/10 hover:bg-white/20 text-text-primary text-[10px] uppercase font-bold tracking-widest py-2 px-4 rounded-full transition-all flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                        Export CSV
                    </button>
                </div>

                {/* Top Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

                    <div className="glass-card p-5 rounded-2xl border border-functional-border bg-white/5 relative overflow-hidden">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">Initial Net Burn</span>
                        {initialNetBurn > 0 ? (
                            <span className="text-2xl font-mono text-red-400 block tracking-tight">-{formatCurrency(initialNetBurn, currency)}</span>
                        ) : (
                            <span className="text-2xl font-mono text-green-400 block tracking-tight">+{formatCurrency(Math.abs(initialNetBurn), currency)}</span>
                        )}
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-functional-border bg-white/5 relative overflow-hidden">
                        <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">Gross Margin</span>
                        <span className="text-2xl font-mono text-text-primary block tracking-tight">{initialGrossMargin}%</span>
                    </div>

                    <div className="glass-card p-5 rounded-2xl border border-functional-border bg-bg-surface relative overflow-hidden lg:col-span-2 flex items-center justify-between border-accent-blue/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full blur-[40px]"></div>
                        <div>
                            <span className="text-[10px] text-text-tertiary uppercase tracking-wider block mb-1">Runway Extended</span>
                            <div className="flex items-baseline gap-2 relative z-10">
                                <span className="text-3xl md:text-4xl font-black text-text-primary tracking-tighter drop-shadow-lg">
                                    {defaultAlive ? "24+" : runwayMonths}
                                </span>
                                <span className="text-accent-blue font-bold text-sm">months</span>
                            </div>
                        </div>
                        <div className="text-right relative z-10">
                            {defaultAlive ? (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-3 py-1.5 rounded-lg badge-glow">
                                    <span className="block text-[9px] uppercase tracking-widest font-bold mb-0.5">Status</span>
                                    <span className="font-medium text-sm whitespace-nowrap">Default Alive</span>
                                </div>
                            ) : (
                                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg relative">
                                    <span className="block text-[9px] uppercase tracking-widest font-bold mb-0.5">Status</span>
                                    <span className="font-medium text-sm whitespace-nowrap">Default Dead</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* View Area: CHAT or TABLE */}
                {viewMode === 'CHART' ? (
                    <div className="glass-card p-6 md:p-8 rounded-3xl border border-functional-border bg-bg-surface flex-grow relative overflow-hidden min-h-[440px] animate-in fade-in duration-300">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/5 rounded-full blur-[80px] pointer-events-none"></div>

                        <div className="flex justify-between items-end mb-8 border-b border-functional-border pb-4">
                            <div>
                                <h3 className="text-xl font-bold text-text-primary tracking-tight">24-Month Projection Model</h3>
                                <p className="text-sm text-text-tertiary">Real-time cash flow and profitability analysis.</p>
                            </div>
                            <div className="flex gap-4 text-xs font-mono text-text-tertiary">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-sm bg-accent-blue shadow-[0_0_10px_rgba(100,150,255,0.5)]"></span> Cash
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-sm bg-yellow-400 shadow-[0_0_10px_rgba(250,200,50,0.5)]"></span> Funding
                                </div>
                            </div>
                        </div>

                        {/* Highly Custom SVG Bar Chart */}
                        <div className="h-64 md:h-80 w-full flex items-end gap-[2px] relative pt-4 bottom-0">
                            {/* Y-Axis Lines */}
                            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none mb-6">
                                {[1, 0.75, 0.5, 0.25, 0].map((tick) => (
                                    <div key={tick} className="w-full border-t border-functional-border flex items-start h-0 hidden md:flex">
                                        <span className="text-[9px] text-text-tertiary font-mono -translate-y-1/2 -translate-x-full pr-2 whitespace-nowrap">
                                            {formatCurrency(maxCash * tick, currency)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Bars */}
                            {projection.map((point) => {
                                // Important fix: If negative, bar height is 0, but tooltip still shows exact negative value
                                const barHeight = point.cash <= 0 ? 0 : (point.cash / maxCash) * 100;
                                const isZero = point.cash <= 0;
                                const isFundMonth = point.fundInjection > 0;

                                return (
                                    <div key={point.month} className="flex-1 flex flex-col justify-end h-full relative group">

                                        {/* Tooltip on hover - Now much more comprehensive */}
                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-bg-main border border-functional-border w-[260px] p-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none shadow-[0_20px_40px_rgba(0,0,0,0.8)]">
                                            <div className="flex justify-between items-center mb-3 border-b border-functional-border pb-2">
                                                <span className="text-[10px] text-accent-blue font-bold uppercase tracking-wider">Month {point.month}</span>
                                                <span className={`text-sm font-black ${point.cash < 0 ? 'text-red-500' : 'text-text-primary'}`}>{formatCurrency(point.cash, currency)}</span>
                                            </div>

                                            <div className="space-y-2 text-xs font-mono">
                                                {isFundMonth && (
                                                    <div className="flex justify-between text-yellow-400 bg-yellow-500/10 p-1 rounded font-bold">
                                                        <span>Fundraising:</span>
                                                        <span>+{formatCurrency(point.fundInjection, currency)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-green-400 pt-1">
                                                    <span>Gross Rev:</span>
                                                    <span>{formatCurrency(point.grossRevenue, currency)}</span>
                                                </div>
                                                <div className="flex justify-between text-text-tertiary text-[10px]">
                                                    <span>↳ MRR:</span>
                                                    <span>{formatCurrency(point.revenue, currency)}</span>
                                                </div>
                                                <div className="flex justify-between text-red-300">
                                                    <span>Gross Profit:</span>
                                                    <span>{formatCurrency(point.grossProfit, currency)}</span>
                                                </div>
                                                <div className="w-full h-px bg-white/5 my-1"></div>
                                                <div className="flex justify-between text-red-400">
                                                    <span>Total Exp:</span>
                                                    <span>{formatCurrency(point.expenses, currency)}</span>
                                                </div>
                                                {point.marketingSpend > 0 && (
                                                    <div className="flex justify-between text-text-tertiary text-[10px]">
                                                        <span>↳ Mktg Spend:</span>
                                                        <span>{formatCurrency(point.marketingSpend, currency)}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between text-text-tertiary text-[10px]">
                                                    <span>↳ Hires:</span>
                                                    <span>{point.headcountAdded} total</span>
                                                </div>
                                                <div className="w-full h-px bg-white/5 my-1"></div>
                                                <div className="flex justify-between font-bold">
                                                    <span>Net Burn:</span>
                                                    <span className={point.burn > 0 ? "text-red-500" : "text-green-500"}>
                                                        {point.burn > 0 ? '-' : '+'}{formatCurrency(point.burn > 0 ? point.burn : point.profit, currency)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* The visual bar */}
                                        <div
                                            className={`w-full rounded-t-sm transition-all duration-300 relative overflow-hidden ${isZero ? 'bg-red-500/20' : isFundMonth ? 'bg-yellow-400' : 'bg-gradient-to-t from-accent-blue/40 to-accent-blue hover:brightness-125'}`}
                                            style={{ height: `${Math.max(barHeight, 1)}%` }}
                                        >
                                            {/* Optional glow effect mapping for fund months */}
                                            {isFundMonth && <div className="absolute inset-0 bg-white/30 animate-pulse"></div>}
                                        </div>

                                        {/* X-axis label */}
                                        {point.month % 3 === 0 && (
                                            <div className="absolute top-full mt-2 text-[10px] text-text-tertiary font-mono w-full text-center">
                                                M{point.month}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // Detailed Table Report View
                    <div className="glass-card rounded-3xl border border-functional-border bg-bg-surface flex-grow flex flex-col h-[500px] md:min-h-[440px] animate-in fade-in duration-300 relative overflow-hidden">
                        <div className="p-4 md:p-8 border-b border-functional-border shrink-0 bg-bg-surface/90 backdrop-blur-md z-20 absolute top-0 left-0 right-0">
                            <h3 className="text-lg md:text-xl font-bold text-text-primary tracking-tight">Detailed Monthly Report</h3>
                            <p className="text-xs md:text-sm text-text-tertiary">A comprehensive breakdown of your cashflow logic. Unclamped true balances.</p>
                        </div>

                        <div className="flex-grow overflow-x-auto overflow-y-auto custom-scrollbar p-0 md:p-6 mt-[80px] md:mt-[100px]">
                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="w-full text-left text-xs border-collapse min-w-[700px]">
                                    <thead className="sticky top-0 bg-bg-surface z-10 shadow-[0_10px_10px_-10px_rgba(0,0,0,0.5)]">
                                        <tr className="border-b border-functional-border text-[9px] md:text-[10px] uppercase tracking-wider text-text-tertiary">
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Month</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Bank Balance</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Gross Rev</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">MRR</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Gross Profit</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Total Exp</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold pr-2 md:pr-4">Funding</th>
                                            <th className="pb-2 md:pb-3 px-2 md:px-0 font-bold">Net Margin</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 font-mono text-[10px] md:text-xs">
                                        {projection.map((row) => (
                                            <tr key={row.month} className="hover:bg-white/5 transition-colors">
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-text-primary font-sans font-medium whitespace-nowrap">Month {row.month}</td>
                                                <td className={`py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 font-bold ${row.cash < 0 ? 'text-red-500' : 'text-accent-blue'}`}>{formatCurrency(row.cash, currency)}</td>
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-green-300">{formatCurrency(row.grossRevenue, currency)}</td>
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-text-tertiary">{formatCurrency(row.revenue, currency)}</td>
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-text-primary">{formatCurrency(row.grossProfit, currency)}</td>
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-red-300">{formatCurrency(row.expenses, currency)}</td>
                                                <td className="py-2 md:py-3 px-2 md:px-0 pr-2 md:pr-4 text-yellow-500">{row.fundInjection > 0 ? `+${formatCurrency(row.fundInjection, currency)}` : '-'}</td>
                                                <td className={`py-2 md:py-3 px-2 md:px-0 font-bold ${row.burn > 0 ? 'text-red-500' : 'text-green-500'}`}>{row.burn > 0 ? `-${formatCurrency(row.burn, currency)}` : `+${formatCurrency(row.profit, currency)}`}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden flex flex-col gap-4 p-4">
                                {projection.map((row) => (
                                    <div key={row.month} className="bg-white/5 border border-functional-border rounded-2xl p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-center border-b border-functional-border pb-2">
                                            <span className="text-sm font-bold text-text-primary uppercase tracking-wider">Month {row.month}</span>
                                            <span className={`text-sm font-black font-mono ${row.cash < 0 ? 'text-red-500' : 'text-accent-blue'}`}>
                                                {formatCurrency(row.cash, currency)}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs font-mono">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Gross Rev</span>
                                                <span className="text-green-300">{formatCurrency(row.grossRevenue, currency)}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">MRR</span>
                                                <span className="text-text-tertiary">{formatCurrency(row.revenue, currency)}</span>
                                            </div>

                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Gross Profit</span>
                                                <span className="text-text-primary">{formatCurrency(row.grossProfit, currency)}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Total Exp</span>
                                                <span className="text-red-300">{formatCurrency(row.expenses, currency)}</span>
                                            </div>
                                        </div>

                                        <div className="mt-1 pt-3 border-t border-functional-border flex justify-between items-center text-xs font-mono">
                                            <div className="flex flex-col">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Funding</span>
                                                <span className="text-yellow-500 font-bold">{row.fundInjection > 0 ? `+${formatCurrency(row.fundInjection, currency)}` : '-'}</span>
                                            </div>
                                            <div className="flex flex-col text-right">
                                                <span className="text-[9px] text-text-tertiary uppercase tracking-wider">Net Margin</span>
                                                <span className={`font-black ${row.burn > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {row.burn > 0 ? `-${formatCurrency(row.burn, currency)}` : `+${formatCurrency(row.profit, currency)}`}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
