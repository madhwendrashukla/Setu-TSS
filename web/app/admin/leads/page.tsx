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
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [adminSources, setAdminSources] = useState<any[]>([]);
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [newSourceLabel, setNewSourceLabel] = useState('');

    const fetchSources = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/lead-sources`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        })
        .then(res => res.json())
        .then(data => setAdminSources(data))
        .catch(console.error);
    };

    useEffect(() => { fetchSources(); }, []);

    const fetchLeads = () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (statusFilter) params.set('status', statusFilter);
        if (sourceFilter) params.set('source', sourceFilter);
        if (searchQuery) params.set('search', searchQuery);
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/leads?${params}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        })
            .then(res => res.json())
            .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { 
        const delayDebounceFn = setTimeout(() => {
            fetchLeads();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [statusFilter, sourceFilter, searchQuery]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
            body: JSON.stringify({ status })
        });
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const statusColor = (s: string) => s === 'new' ? 'text-blue-400 bg-blue-400/10' : s === 'contacted' ? 'text-yellow-400 bg-yellow-400/10' : 'text-green-400 bg-green-400/10';

    const addSource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSourceLabel) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/lead-sources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
            body: JSON.stringify({ label: newSourceLabel })
        });
        setNewSourceLabel('');
        fetchSources();
    };

    const deleteSource = async (id: string) => {
        if (!confirm('Are you sure you want to delete this source?')) return;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/admin/lead-sources/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        });
        fetchSources();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Lead Inquiries <span className="text-gray-500 text-lg font-normal">({leads.length})</span></h1>
                <div className="flex gap-3">
                    <button onClick={() => setShowSourceModal(true)} className="border border-gray-300 text-gray-900 font-bold px-4 py-2 rounded hover:bg-gray-100">
                        <i className="fas fa-list mr-2"></i>Manage Sources
                    </button>
                    <button onClick={() => exportCsv(leads)} className="border border-gray-300 text-gray-900 font-bold px-4 py-2 rounded hover:bg-gray-100">
                        <i className="fas fa-download mr-2"></i>Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                        <input 
                            type="text" 
                            placeholder="Search by name, email, or phone..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-gray-200 text-gray-900 rounded pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-accent-blue"
                        />
                    </div>
                </div>
                <div className="flex gap-3">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-blue">
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                    </select>
                    <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 rounded px-3 py-2 text-sm focus:outline-none focus:border-accent-blue">
                        <option value="">All Sources</option>
                        {adminSources.map(s => (
                            <option key={s.id} value={s.slug}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
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
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500">Loading...</td></tr>
                        ) : leads.length === 0 ? (
                            <tr><td colSpan={7} className="p-4 text-center text-gray-500">No inquiries found</td></tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4 font-bold">{lead.full_name}</td>
                                <td className="p-4 text-gray-500">{lead.email}</td>
                                <td className="p-4 text-gray-500">{lead.phone ?? '—'}</td>
                                <td className="p-4 text-gray-500">{lead.city ?? '—'}</td>
                                <td className="p-4"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{adminSources.find(s => s.slug === lead.source)?.label || lead.source || '—'}</span></td>
                                <td className="p-4 text-gray-500 text-xs">{formatDate(lead.created_at)}</td>
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

            {showSourceModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Manage Lead Sources</h2>
                            <button onClick={() => setShowSourceModal(false)} className="text-gray-500 hover:text-black"><i className="fas fa-times"></i></button>
                        </div>
                        <form onSubmit={addSource} className="flex gap-2 mb-4">
                            <input type="text" value={newSourceLabel} onChange={e => setNewSourceLabel(e.target.value)} placeholder="New source label (e.g. AI Workshop)" className="flex-1 border rounded px-3 py-2 text-sm text-black" required />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-bold">Add</button>
                        </form>
                        <div className="max-h-64 overflow-y-auto border rounded divide-y">
                            {adminSources.map(s => (
                                <div key={s.id} className="flex justify-between items-center p-3 text-sm text-black">
                                    <div><span className="font-bold">{s.label}</span> <span className="text-gray-400 text-xs ml-2">({s.slug})</span></div>
                                    <button onClick={() => deleteSource(s.id)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash"></i></button>
                                </div>
                            ))}
                            {adminSources.length === 0 && <div className="p-4 text-center text-gray-500">No sources found.</div>}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
