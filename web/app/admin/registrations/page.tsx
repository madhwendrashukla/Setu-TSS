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
    page_blocks: any[];
}

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [events, setEvents] = useState<EventData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterEventId, setFilterEventId] = useState<string>('');
    const [filterTier, setFilterTier] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');
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
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
                ]);

                if (!regRes.ok) throw new Error('Failed to fetch registrations');
                
                const regData = await regRes.json();
                setRegistrations(regData);

                if (eventsRes.ok) {
                    const eventsData = await eventsRes.json();
                    setEvents(eventsData);
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [router]);

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
            }
        }
    }
    // Fallback if no event selected or no tiers found in event definition
    if (uniqueTiers.length === 0) {
        // Limit fallback tiers to the selected event's registrations if an event is selected
        const regsForTiers = filterEventId ? registrations.filter(r => r.event_id === filterEventId) : registrations;
        uniqueTiers = Array.from(new Set(regsForTiers.map(r => r.ticket_tier))).filter(Boolean) as string[];
    }

    const uniqueStatuses = Array.from(new Set(registrations.map(r => r.status))).filter(Boolean);

    // Filter registrations
    const filteredRegistrations = registrations.filter(r => {
        const matchEvent = filterEventId ? r.event_id === filterEventId : true;
        const matchTier = filterTier ? r.ticket_tier === filterTier : true;
        const matchStatus = filterStatus ? r.status === filterStatus : true;
        return matchEvent && matchTier && matchStatus;
    });

    const handleExportExcel = () => {
        const exportData = filteredRegistrations.map(reg => ({
            'Registration ID': reg.id,
            'User Name': reg.user?.name || reg.guest_name || 'Unknown',
            'User Email': reg.user?.email || reg.guest_email || 'N/A',
            'Phone': reg.guest_phone || 'N/A',
            'Event ID': reg.event_id,
            'Ticket Tier': reg.ticket_tier || 'N/A',
            'Status': reg.status,
            'Amount (INR)': reg.amount,
            'Payment ID': reg.razorpay_payment_id || 'N/A',
            'Date': new Date(reg.created_at).toLocaleString('en-IN')
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Registrations");
        
        // Auto-size columns nicely
        const colWidths = [
            { wch: 36 }, { wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 20 }, 
            { wch: 25 }, { wch: 15 }, { wch: 12 }, { wch: 25 }, { wch: 20 }
        ];
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, `Registrations_${new Date().toISOString().split('T')[0]}.xlsx`);
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading registrations...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Event Registrations</h1>
                    <p className="text-slate-500 font-medium">View all user payments and workshop registrations.</p>
                </div>
                
                {/* Filters & Export */}
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <i className="fas fa-filter text-slate-400 text-xs"></i>
                        <select 
                            value={filterEventId} 
                            onChange={(e) => setFilterEventId(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none w-32"
                        >
                            <option value="">All Events</option>
                            {uniqueEventIds.map(id => <option key={id} value={id}>{id}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <i className="fas fa-ticket text-slate-400 text-xs"></i>
                        <select 
                            value={filterTier} 
                            onChange={(e) => setFilterTier(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none w-32"
                        >
                            <option value="">All Tiers</option>
                            {uniqueTiers.map(tier => <option key={tier} value={String(tier)}>{tier}</option>)}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 shadow-sm">
                        <i className="fas fa-circle-check text-slate-400 text-xs"></i>
                        <select 
                            value={filterStatus} 
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="bg-transparent border-none text-xs font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none w-32"
                        >
                            <option value="">All Statuses</option>
                            {uniqueStatuses.map(status => <option key={status} value={String(status)}>{status}</option>)}
                        </select>
                    </div>

                    <button 
                        onClick={handleExportExcel}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm shadow-green-200 transition-all active:scale-95"
                    >
                        <i className="fa-solid fa-file-excel"></i> Export Excel
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Event & Tier</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4">Payment ID</th>
                                <th className="px-6 py-4">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredRegistrations.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">No registrations found.</td>
                                </tr>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-900">{reg.user?.name || reg.guest_name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{reg.user?.email || reg.guest_email || 'N/A'}</div>
                                            {reg.guest_phone && (
                                                <div className="text-xs text-slate-400 mt-0.5"><i className="fa-solid fa-phone text-[10px] mr-1"></i>{reg.guest_phone}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-700">
                                                <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">{reg.event_id}</span>
                                            </div>
                                            {reg.ticket_tier && (
                                                <div className="mt-2 text-xs font-bold text-blue-600 uppercase tracking-wide">{reg.ticket_tier}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                                                reg.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                                                reg.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {reg.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold text-slate-900">
                                            ₹{reg.amount || 0}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                            {reg.razorpay_payment_id || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-slate-500">
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
            </div>
        </div>
    );
}
