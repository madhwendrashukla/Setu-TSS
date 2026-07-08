'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Registration {
    id: string;
    event_id: string;
    status: string;
    amount: number;
    razorpay_order_id: string;
    razorpay_payment_id: string;
    created_at: string;
    user: {
        name: string;
        email: string;
    };
}

export default function AdminRegistrations() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filterEventId, setFilterEventId] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const fetchRegistrations = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                router.push('/admin');
                return;
            }

            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/registrations`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!res.ok) throw new Error('Failed to fetch registrations');
                
                const data = await res.json();
                setRegistrations(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRegistrations();
    }, [router]);

    // Get unique event IDs for the filter dropdown
    const uniqueEventIds = Array.from(new Set(registrations.map(r => r.event_id))).filter(Boolean);

    // Filter registrations based on selected event ID
    const filteredRegistrations = filterEventId 
        ? registrations.filter(r => r.event_id === filterEventId)
        : registrations;

    if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading registrations...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">Event Registrations</h1>
                    <p className="text-slate-500 font-medium">View all user payments and workshop registrations.</p>
                </div>
                
                {/* Filter Dropdown */}
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <i className="fas fa-filter text-slate-400"></i>
                    <select 
                        value={filterEventId} 
                        onChange={(e) => setFilterEventId(e.target.value)}
                        className="bg-transparent border-none text-sm font-medium text-slate-700 focus:ring-0 cursor-pointer outline-none w-48"
                    >
                        <option value="">All Workshops</option>
                        {uniqueEventIds.map(id => (
                            <option key={id} value={id}>{id}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Event ID</th>
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
                                            <div className="font-bold text-slate-900">{reg.user?.name || 'Unknown'}</div>
                                            <div className="text-xs text-slate-500">{reg.user?.email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-700">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-xs">{reg.event_id}</span>
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
