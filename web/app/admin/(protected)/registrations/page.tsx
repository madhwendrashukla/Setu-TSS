'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

interface Registration {
    id: string;
    event_id: string;
    status: string;
    amount: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    created_at: string;
    ticket_tier?: string;
    guest_name?: string;
    guest_email?: string;
    guest_phone?: string;
    user: {
        name: string;
        email: string;
    };
}

interface EventData {
    id: string;
    slug: string;
    title?: string;
    page_blocks?: any;
    start_date?: string;
    created_at?: string;
}

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterEventId, setFilterEventId] = useState<string>('');
    const [filterTier, setFilterTier] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchRegistrations = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin');
                return;
            }

            try {
                const [regRes, eventsRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/registrations`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/events?all=true`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })
                ]);

                if (!regRes.ok) throw new Error('Failed to fetch registrations');
                
                const regData = await regRes.json();
                const sortedRegs = Array.isArray(regData) ? regData : [];
                setRegistrations(sortedRegs);

                let loadedEvents: EventData[] = [];
                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    loadedEvents = Array.isArray(eventsData) ? eventsData : [];
                    setEvents(loadedEvents);
                }

                // Default selection to the latest event to prevent overwhelming data float
                if (sortedRegs.length > 0) {
                    setFilterEventId(sortedRegs[0].event_id);
                } else if (loadedEvents.length > 0) {
                    setFilterEventId(loadedEvents[0].id || loadedEvents[0].slug);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [router]);

    // Helper to resolve raw UUID / slug into real Event Name
    const getEventTitle = (eventId: string): string => {
        if (!eventId) return 'Unknown Event';
        const found = events.find(e => e.id === eventId || e.slug === eventId);
        if (found?.title) return found.title;

        // If it's a slug format with dashes and not a raw UUID, prettify it nicely
        if (eventId.includes('-') && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(eventId)) {
            return eventId
                .split('-')
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ');
        }
        return eventId;
    };

    // Get unique options for filters
    const uniqueEventIds = Array.from(new Set(registrations.map(r => r.event_id))).filter(Boolean);
    
    // Dynamically get tiers for the selected event directly from the events table
    let uniqueTiers: string[] = [];
    if (filterEventId) {
        const matchingEvent = events.find(e => e.slug === filterEventId || e.id === filterEventId);
        if (matchingEvent && matchingEvent.page_blocks) {
            let blocks = matchingEvent.page_blocks;
            if (typeof blocks === 'string') {
                try { blocks = JSON.parse(blocks); } catch (e) { blocks = []; }
            }
            if (Array.isArray(blocks)) {
                const pricingBlock = blocks.find((b: any) => b.type === 'pricing' || b.type === 'workshop_breakdown');
                if (pricingBlock && pricingBlock.data) {
                    const options = pricingBlock.data.pricing_options || pricingBlock.data.workshops || [];
                    uniqueTiers = options.map((opt: any) => opt.heading ? `${opt.heading} - ${opt.title}` : opt.title).filter(Boolean);
                }
            } else if (blocks && typeof blocks === 'object') {
                const options = blocks.pricing_options || blocks.workshops || [];
                if (Array.isArray(options)) {
                    uniqueTiers = options.map((opt: any) => opt.heading ? `${opt.heading} - ${opt.title}` : opt.title).filter(Boolean);
                }
            }
        }
    }
    // Fallback if no event selected or no tiers found in event definition
    if (uniqueTiers.length === 0) {
        const regsForTiers = filterEventId ? registrations.filter(r => r.event_id === filterEventId) : registrations;
        uniqueTiers = Array.from(new Set(regsForTiers.map(r => r.ticket_tier))).filter(Boolean) as string[];
    }

    const uniqueStatuses = Array.from(new Set(registrations.map(r => r.status))).filter(Boolean);

    // Filter registrations
    const filteredRegistrations = registrations.filter(r => {
        const matchEvent = filterEventId ? r.event_id === filterEventId : true;
        const matchTier = filterTier ? r.ticket_tier === filterTier : true;
        const matchStatus = filterStatus ? r.status === filterStatus : true;
        const matchSearch = searchQuery ? (
            (r.user?.name || r.guest_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.user?.email || r.guest_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (r.guest_phone || '').includes(searchQuery) ||
            (r.razorpay_payment_id || '').toLowerCase().includes(searchQuery.toLowerCase())
        ) : true;
        return matchEvent && matchTier && matchStatus && matchSearch;
    });

    // Total revenue calculation for the current filter view
    const totalRevenue = filteredRegistrations
        .filter(r => r.status === 'COMPLETED')
        .reduce((sum, r) => sum + (r.amount || 0), 0);

    const handleExportExcel = () => {
        const exportData = filteredRegistrations.map(reg => ({
            'Registration ID': reg.id,
            'User Name': reg.user?.name || reg.guest_name || 'Unknown',
            'User Email': reg.user?.email || reg.guest_email || 'N/A',
            'Phone': reg.guest_phone || 'N/A',
            'Event': getEventTitle(reg.event_id),
            'Ticket / Tier': reg.ticket_tier || 'N/A',
            'Status': reg.status,
            'Amount (INR)': (!reg.amount || reg.amount === 0) ? 'Free' : reg.amount,
            'Payment ID': reg.razorpay_payment_id || 'N/A',
            'Date': new Date(reg.created_at).toLocaleString('en-IN')
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        
        const colWidths = [
            { wch: 36 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 30 }, 
            { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 20 }
        ];
        ws['!cols'] = colWidths;

        const eventNameForFile = filterEventId ? getEventTitle(filterEventId).replace(/[^a-z0-9]/gi, '_') : 'All_Events';
        XLSX.writeFile(wb, `Registrations_${eventNameForFile}_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium"><i className="fas fa-circle-notch fa-spin mr-2 text-purple-600"></i> Loading registrations...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="space-y-6">
            {/* Header with Title, Count, Revenue, and Export */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-1 flex items-center gap-3">
                        Event Registrations
                        <span className="text-sm font-bold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                            {filteredRegistrations.length} {filteredRegistrations.length === 1 ? 'Attendee' : 'Attendees'}
                        </span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        View all attendee enrollments, packages purchased, and transaction receipts.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Revenue Badge */}
                    <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
                        <span className="text-emerald-700 font-medium">Total Revenue:</span>
                        <span className="font-bold text-emerald-900 text-sm">₹{totalRevenue.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Export Excel */}
                    <button 
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95"
                    >
                        <i className="fa-solid fa-file-excel"></i> Export Excel
                    </button>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row gap-3">
                {/* Search box */}
                <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
                    <input
                        type="text"
                        placeholder="Search by attendee name, email, phone, or payment ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Event Selector (Defaulted to Latest Event) */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <i className="fas fa-calendar-alt text-purple-600 text-xs"></i>
                    <select 
                        value={filterEventId} 
                        onChange={(e) => {
                            setFilterEventId(e.target.value);
                            setFilterTier(''); // Reset tier filter on event change
                        }}
                        className="bg-transparent border-none text-xs font-semibold text-slate-800 focus:ring-0 cursor-pointer outline-none max-w-[240px]"
                    >
                        <option value="">All Events ({registrations.length})</option>
                        {uniqueEventIds.map(id => (
                            <option key={id} value={id}>
                                {getEventTitle(id)} ({registrations.filter(r => r.event_id === id).length})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Ticket Tier Filter */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <i className="fas fa-ticket text-slate-400 text-xs"></i>
                    <select 
                        value={filterTier} 
                        onChange={(e) => setFilterTier(e.target.value)}
                        className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none max-w-[180px]"
                    >
                        <option value="">All Tiers / Packages</option>
                        {uniqueTiers.map(tier => <option key={tier} value={String(tier)}>{tier}</option>)}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <i className="fas fa-circle-check text-slate-400 text-xs"></i>
                    <select 
                        value={filterStatus} 
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none"
                    >
                        <option value="">All Statuses</option>
                        {uniqueStatuses.map(status => <option key={status} value={String(status)}>{status}</option>)}
                    </select>
                </div>
            </div>

            {/* Registrations Table (No Pagination - Smooth Horizontal & Vertical Layout) */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[980px] border-collapse">
                        <thead className="bg-slate-50/90 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4 w-[240px]">Attendee / User</th>
                                <th className="px-6 py-4 w-[280px]">Event & Package / Tier</th>
                                <th className="px-6 py-4 w-[130px]">Status</th>
                                <th className="px-6 py-4 w-[130px]">Amount</th>
                                <th className="px-6 py-4 w-[180px]">Payment Ref</th>
                                <th className="px-6 py-4 w-[160px]">Registration Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-medium">
                                        <i className="fas fa-folder-open text-2xl mb-2 block text-slate-300"></i>
                                        No registrations found matching the current filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors group">
                                        {/* User / Attendee Info */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-semibold text-slate-900 whitespace-nowrap">
                                                {reg.user?.name || reg.guest_name || 'Unknown Attendee'}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">
                                                {reg.user?.email || reg.guest_email || 'N/A'}
                                            </div>
                                            {reg.guest_phone && (
                                                <div className="text-[11px] text-slate-400 mt-0.5 whitespace-nowrap flex items-center gap-1">
                                                    <i className="fa-solid fa-phone text-[9px]"></i>
                                                    <a href={`tel:${reg.guest_phone}`} className="hover:text-purple-600 hover:underline">
                                                        {reg.guest_phone}
                                                    </a>
                                                </div>
                                            )}
                                        </td>

                                        {/* Event Name & Ticket Package */}
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-semibold text-slate-900">
                                                {getEventTitle(reg.event_id)}
                                            </div>
                                            {reg.ticket_tier && (
                                                <div className="mt-1.5 inline-flex items-center text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200/60">
                                                    <i className="fa-solid fa-ticket text-[9px] mr-1 text-purple-500"></i>
                                                    <span>{reg.ticket_tier}</span>
                                                </div>
                                            )}
                                        </td>

                                        {/* Status */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase inline-flex items-center gap-1 ${
                                                reg.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                                                reg.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-red-100 text-red-700 border border-red-200'
                                            }`}>
                                                <i className={`fa-solid fa-${reg.status === 'COMPLETED' ? 'check-circle' : reg.status === 'PENDING' ? 'clock' : 'times-circle'} text-[9px]`}></i>
                                                {reg.status}
                                            </span>
                                        </td>

                                        {/* Amount (Free vs Paid Currency) */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {(!reg.amount || reg.amount === 0) ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                                    <i className="fa-solid fa-gift text-[10px]"></i> Free
                                                </span>
                                            ) : (
                                                <span className="font-bold text-slate-900 text-sm">
                                                    ₹{reg.amount.toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </td>

                                        {/* Payment Reference ID */}
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                                            {reg.razorpay_payment_id ? (
                                                <span className="bg-slate-100 px-2 py-1 rounded text-slate-700 text-[11px]" title={reg.razorpay_payment_id}>
                                                    {reg.razorpay_payment_id}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400">—</span>
                                            )}
                                        </td>

                                        {/* Registration Date */}
                                        <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap font-medium">
                                            {new Date(reg.created_at).toLocaleDateString('en-IN', {
                                                day: '2-digit', month: 'short', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer summary bar */}
                {filteredRegistrations.length > 0 && (
                    <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 flex justify-between items-center">
                        <span>Showing all <strong>{filteredRegistrations.length}</strong> registrations for the selected filter.</span>
                        <span className="text-slate-400">Setu Startup School Registration Dashboard</span>
                    </div>
                )}
            </div>
        </div>
    );
}
