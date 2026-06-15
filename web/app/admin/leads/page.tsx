"use client";
import { useState, useEffect } from "react";

function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function exportCsv(leads: any[]) {
    const headers = ['Name', 'Email', 'Phone', 'City', 'Source', 'Status', 'Date'];
    const rows = leads.map(l => [l.full_name, l.email, l.phone ?? '', l.city ?? '', l.source ?? '', l.status, formatDate(l.created_at)]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
}

export default function AdminLeads() {
    const [leads, setLeads] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchLeads = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (sourceFilter) params.set('source', sourceFilter);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/leads?${params}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        })
            .then(res => res.json())
            .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { fetchLeads(); }, [statusFilter, sourceFilter]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
            body: JSON.stringify({ status })
        });
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const statusColor = (s: string) => s === 'new' ? 'text-blue-400 bg-blue-400/10' : s === 'contacted' ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10';

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Lead Inquiries <span className="text-text-secondary text-lg font-normal">({leads.length})</span></h1>
                <button onClick={() => exportCsv(leads)} className="border border-white/20 text-white font-bold px-4 py-2 rounded hover:bg-white/10">
                    <i className="fas fa-download mr-2"></i>Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-3 mb-6">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-blue">
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="converted">Converted</option>
                </select>
                <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                    className="bg-zinc-900 border border-white/10 text-white rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-blue">
                    <option value="">All Sources</option>
                    <option value="contact_section">Contact Section</option>
                    <option value="hero_apply_form">Hero Apply Form</option>
                    <option value="apply_mentor">Apply as Mentor</option>
                    <option value="spark_interest">Spark Interest</option>
                    <option value="transformation_interest">Transformation Interest</option>
                </select>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Name</th>
                            <th className="p-4 font-normal">Email</th>
                            <th className="p-4 font-normal">Phone</th>
                            <th className="p-4 font-normal">City</th>
                            <th className="p-4 font-normal">Source</th>
                            <th className="p-4 font-normal">Date</th>
                            <th className="p-4 font-normal">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={7} className="p-8 text-center text-text-secondary">Loading...</td></tr>
                        ) : leads.length === 0 ? (
                            <tr><td colSpan={7} className="p-4 text-center text-text-secondary">No inquiries found</td></tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 font-bold">{lead.full_name}</td>
                                <td className="p-4 text-text-secondary">{lead.email}</td>
                                <td className="p-4 text-text-secondary">{lead.phone ?? '—'}</td>
                                <td className="p-4 text-text-secondary">{lead.city ?? '—'}</td>
                                <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs">{lead.source ?? '—'}</span></td>
                                <td className="p-4 text-text-secondary text-xs">{formatDate(lead.created_at)}</td>
                                <td className="p-4">
                                    <select value={lead.status} onChange={e => updateStatus(lead.id, e.target.value)}
                                        className={`rounded px-2 py-1 text-xs font-bold border-0 focus:outline-none ${statusColor(lead.status)}`}>
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
