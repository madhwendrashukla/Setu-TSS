"use client";
import { useState, useEffect } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

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

// ── Mail Compose Modal ────────────────────────────────────────────────────────
function MailModal({ lead, onClose }: { lead: any | null; onClose: () => void }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!lead) return null;

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        setError(null);
        try {
            const res = await fetch(`${API}/api/admin/leads/mail-one/${lead.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({ subject, message }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send');
            setSent(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg">Send Email</h3>
                        <p className="text-white/70 text-xs mt-0.5">To: {lead.full_name} &lt;{lead.email}&gt;</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <i className="fas fa-times text-lg" />
                    </button>
                </div>

                {sent ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check text-green-500 text-2xl" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg">Email Sent!</h4>
                        <p className="text-gray-500 text-sm mt-1">Message delivered to {lead.email}</p>
                        <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors">
                            Close
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                                <i className="fas fa-exclamation-circle" /> {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                            <input
                                type="text"
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                required
                                placeholder="Email subject..."
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                                Message
                                <span className="ml-2 text-purple-400 normal-case font-normal text-xs">
                                    — {"{{name}}"} will be replaced with {lead.full_name}
                                </span>
                            </label>
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                required
                                placeholder={`Hi {{name}},\n\nWe noticed your interest in The Startup School...`}
                                rows={7}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
                            />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all">
                                Cancel
                            </button>
                            <button type="submit" disabled={sending} className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {sending ? <><i className="fas fa-circle-notch fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send Email</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Bulk Mail Modal ───────────────────────────────────────────────────────────
function BulkMailModal({ leads, onClose, filterDesc }: { leads: any[]; onClose: () => void; filterDesc: string }) {
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);
    const [summary, setSummary] = useState<{ sent: number; failed: number; errors: string[] } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm(`Send to all ${leads.length} leads matching current filter?`)) return;
        setSending(true);
        setError(null);
        try {
            const recipients = leads.map(l => ({ email: l.email, name: l.full_name }));
            const res = await fetch(`${API}/api/admin/leads/mail-filtered`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify({ subject, message, recipients }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to send');
            setSummary({ sent: data.sent, failed: data.failed, errors: data.errors || [] });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] px-6 py-4 flex items-center justify-between">
                    <div>
                        <h3 className="text-white font-bold text-lg">Mail All Filtered Leads</h3>
                        <p className="text-white/70 text-xs mt-0.5">{leads.length} recipients · {filterDesc}</p>
                    </div>
                    <button onClick={onClose} className="text-white/70 hover:text-white">
                        <i className="fas fa-times text-lg" />
                    </button>
                </div>

                {summary ? (
                    <div className="p-10 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-envelope-open-text text-green-500 text-2xl" />
                        </div>
                        <h4 className="font-bold text-gray-900 text-lg mb-1">Bulk Send Complete!</h4>
                        <div className="flex gap-3 justify-center mt-4">
                            <span className="bg-green-50 text-green-600 border border-green-200 px-4 py-2 rounded-xl text-sm font-bold">
                                <i className="fas fa-check-circle mr-1.5" />{summary.sent} Sent
                            </span>
                            {summary.failed > 0 && (
                                <span className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-xl text-sm font-bold">
                                    <i className="fas fa-times-circle mr-1.5" />{summary.failed} Failed
                                </span>
                            )}
                        </div>
                        {summary.errors.length > 0 && (
                            <div className="mt-4 text-left bg-red-50 border border-red-200 rounded-xl p-3 max-h-32 overflow-y-auto">
                                {summary.errors.map((e, i) => <p key={i} className="text-xs text-red-500">{e}</p>)}
                            </div>
                        )}
                        <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700">Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSend} className="p-6 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm flex items-center gap-2">
                                <i className="fas fa-exclamation-circle" /> {error}
                            </div>
                        )}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
                            <i className="fas fa-triangle-exclamation" />
                            <span>This will send to <strong>{leads.length} leads</strong>. Use {"{{name}}"} for personalization.</span>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
                            <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required
                                placeholder="Email subject..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} required
                                placeholder={`Hi {{name}},\n\n...`} rows={7}
                                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none" />
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-all">Cancel</button>
                            <button type="submit" disabled={sending} className="flex-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2">
                                {sending ? <><i className="fas fa-circle-notch fa-spin" /> Sending...</> : <><i className="fas fa-paper-plane" /> Send to {leads.length} Leads</>}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminLeads() {
    const [leads, setLeads] = useState<any[]>([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [sourceFilter, setSourceFilter] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [adminSources, setAdminSources] = useState<any[]>([]);
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [newSourceLabel, setNewSourceLabel] = useState('');
    const [mailLead, setMailLead] = useState<any | null>(null);
    const [showBulkMail, setShowBulkMail] = useState(false);
    const [viewLead, setViewLead] = useState<any | null>(null);

    const fetchSources = () => {
        fetch(`${API}/api/admin/lead-sources`, {
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
        fetch(`${API}/api/admin/leads?${params}`, {
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        })
            .then(res => res.json())
            .then(data => { setLeads(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        const t = setTimeout(fetchLeads, 500);
        return () => clearTimeout(t);
    }, [statusFilter, sourceFilter, searchQuery]);

    const updateStatus = async (id: string, status: string) => {
        await fetch(`${API}/api/admin/leads/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
            body: JSON.stringify({ status })
        });
        setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    };

    const deleteLead = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete lead "${name}"?`)) return;
        try {
            const res = await fetch(`${API}/api/admin/leads/${id}`, {
                method: 'DELETE',
                headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
            });
            if (res.ok) {
                setLeads(prev => prev.filter(l => l.id !== id));
            }
        } catch (e) {
            console.error('Failed to delete lead', e);
        }
    };

    const statusColor = (s: string) => s === 'new' ? 'text-blue-600 bg-blue-50 border-blue-200' : s === 'contacted' ? 'text-amber-600 bg-amber-50 border-amber-200' : 'text-emerald-600 bg-emerald-50 border-emerald-200';

    const addSource = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSourceLabel) return;
        await fetch(`${API}/api/admin/lead-sources`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', "Authorization": `Bearer ${localStorage.getItem("adminToken")}` },
            body: JSON.stringify({ label: newSourceLabel })
        });
        setNewSourceLabel('');
        fetchSources();
    };

    const deleteSource = async (id: string) => {
        if (!confirm('Delete this source?')) return;
        await fetch(`${API}/api/admin/lead-sources/${id}`, {
            method: 'DELETE',
            headers: { "Authorization": `Bearer ${localStorage.getItem("adminToken")}` }
        });
        fetchSources();
    };

    const filterDesc = [
        statusFilter ? `Status: ${statusFilter}` : '',
        sourceFilter ? `Source: ${adminSources.find(s => s.slug === sourceFilter)?.label || sourceFilter}` : '',
        searchQuery ? `Search: "${searchQuery}"` : '',
    ].filter(Boolean).join(' · ') || 'All Leads';

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Lead Inquiries <span className="text-gray-400 text-lg font-normal">({leads.length})</span></h1>
                <div className="flex flex-wrap gap-3">
                    <button
                        onClick={() => setShowBulkMail(true)}
                        disabled={leads.length === 0}
                        className="flex items-center gap-2 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50 hover:opacity-90 transition-all shadow-sm"
                    >
                        <i className="fas fa-envelope-bulk" /> Mail All Filtered ({leads.length})
                    </button>
                    <button onClick={() => setShowSourceModal(true)} className="border border-gray-300 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 text-sm transition-colors">
                        <i className="fas fa-list mr-2" />Manage Sources
                    </button>
                    <button onClick={() => exportCsv(leads)} className="border border-gray-300 text-gray-900 font-bold px-4 py-2 rounded-xl hover:bg-gray-100 text-sm transition-colors">
                        <i className="fas fa-download mr-2" />Export CSV
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="flex-1 relative">
                    <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-gray-200 text-gray-900 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                </div>
                <div className="flex gap-3">
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 cursor-pointer">
                        <option value="">All Statuses</option>
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="converted">Converted</option>
                    </select>
                    <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}
                        className="bg-white border border-gray-200 text-gray-900 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-purple-400 cursor-pointer">
                        <option value="">All Sources</option>
                        {adminSources.map(s => (
                            <option key={s.id} value={s.slug}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table with responsive horizontal overflow and safe column widths */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-x-auto">
                <table className="w-full text-left min-w-[1000px] table-fixed border-collapse">
                    <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                        <tr>
                            <th className="p-4 w-[200px]">Name</th>
                            <th className="p-4 w-[220px]">Email</th>
                            <th className="p-4 w-[130px]">Phone</th>
                            <th className="p-4 w-[120px]">City</th>
                            <th className="p-4 w-[140px]">Source</th>
                            <th className="p-4 w-[110px]">Date</th>
                            <th className="p-4 w-[130px]">Status</th>
                            <th className="p-4 w-[110px] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-gray-400">
                                    <i className="fas fa-circle-notch fa-spin text-xl mr-2 text-purple-600" />
                                    Loading inquiries...
                                </td>
                            </tr>
                        ) : leads.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-12 text-center text-gray-400">
                                    No inquiries found matching criteria.
                                </td>
                            </tr>
                        ) : leads.map(lead => (
                            <tr key={lead.id} className="hover:bg-gray-50/80 transition-colors group">
                                <td className="p-4 font-bold text-gray-900">
                                    <div className="flex items-center gap-2.5">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs shrink-0">
                                            {lead.full_name ? lead.full_name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                        <span className="truncate max-w-[150px] block" title={lead.full_name}>
                                            {lead.full_name || '—'}
                                        </span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600 text-sm">
                                    <span className="truncate max-w-[200px] block" title={lead.email}>
                                        {lead.email}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 text-sm whitespace-nowrap">
                                    {lead.phone ? (
                                        <a href={`tel:${lead.phone}`} className="hover:text-purple-600 hover:underline">
                                            {lead.phone}
                                        </a>
                                    ) : '—'}
                                </td>
                                <td className="p-4 text-gray-600 text-sm">
                                    <span className="truncate max-w-[100px] block" title={lead.city}>
                                        {lead.city || '—'}
                                    </span>
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <span className="bg-gray-100 border border-gray-200 px-2.5 py-1 rounded-lg text-xs font-semibold text-gray-700 inline-block max-w-[120px] truncate" title={adminSources.find(s => s.slug === lead.source)?.label || lead.source}>
                                        {adminSources.find(s => s.slug === lead.source)?.label || lead.source || '—'}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-400 text-xs whitespace-nowrap font-medium">
                                    {formatDate(lead.created_at)}
                                </td>
                                <td className="p-4 whitespace-nowrap">
                                    <select
                                        value={lead.status}
                                        onChange={e => updateStatus(lead.id, e.target.value)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-bold border focus:outline-none cursor-pointer transition-all ${statusColor(lead.status)}`}
                                    >
                                        <option value="new">New</option>
                                        <option value="contacted">Contacted</option>
                                        <option value="converted">Converted</option>
                                    </select>
                                </td>
                                <td className="p-4 whitespace-nowrap text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                        {lead.message && (
                                            <button
                                                onClick={() => setViewLead(lead)}
                                                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all"
                                                title="View message note"
                                            >
                                                <i className="fas fa-comment-dots text-xs" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setMailLead(lead)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-purple-200 text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all"
                                            title={`Send email to ${lead.full_name}`}
                                        >
                                            <i className="fas fa-envelope text-xs" />
                                        </button>
                                        <button
                                            onClick={() => deleteLead(lead.id, lead.full_name)}
                                            className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 text-red-400 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                                            title={`Delete inquiry`}
                                        >
                                            <i className="fas fa-trash text-xs" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* View Lead Message Modal */}
            {viewLead && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">{viewLead.full_name}</h3>
                                <p className="text-xs text-gray-500">{viewLead.email} {viewLead.phone ? `· ${viewLead.phone}` : ''}</p>
                            </div>
                            <button onClick={() => setViewLead(null)} className="text-gray-400 hover:text-gray-600 p-1">
                                <i className="fas fa-times text-lg" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Inquiry Message</label>
                                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                                    {viewLead.message || 'No message provided.'}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-gray-500">
                                <div><span className="font-bold text-gray-700">Source:</span> {viewLead.source || '—'}</div>
                                <div><span className="font-bold text-gray-700">City:</span> {viewLead.city || '—'}</div>
                                <div><span className="font-bold text-gray-700">Date:</span> {formatDate(viewLead.created_at)}</div>
                                <div><span className="font-bold text-gray-700">Status:</span> {viewLead.status}</div>
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-2">
                            <button
                                onClick={() => { const leadToMail = viewLead; setViewLead(null); setMailLead(leadToMail); }}
                                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors flex items-center gap-2"
                            >
                                <i className="fas fa-paper-plane text-xs" /> Reply via Email
                            </button>
                            <button
                                onClick={() => setViewLead(null)}
                                className="border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Manage Sources Modal */}
            {showSourceModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Manage Lead Sources</h2>
                            <button onClick={() => setShowSourceModal(false)} className="text-gray-400 hover:text-gray-600">
                                <i className="fas fa-times" />
                            </button>
                        </div>
                        <form onSubmit={addSource} className="flex gap-2 mb-4">
                            <input type="text" value={newSourceLabel} onChange={e => setNewSourceLabel(e.target.value)}
                                placeholder="New source label (e.g. AI Workshop)"
                                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black focus:outline-none focus:border-purple-400" required />
                            <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors">Add</button>
                        </form>
                        <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y">
                            {adminSources.map(s => (
                                <div key={s.id} className="flex justify-between items-center p-3 text-sm">
                                    <div><span className="font-bold text-gray-900">{s.label}</span> <span className="text-gray-400 text-xs ml-2">({s.slug})</span></div>
                                    <button onClick={() => deleteSource(s.id)} className="text-red-400 hover:text-red-600 transition-colors">
                                        <i className="fas fa-trash text-xs" />
                                    </button>
                                </div>
                            ))}
                            {adminSources.length === 0 && <div className="p-4 text-center text-gray-400 text-sm">No sources found.</div>}
                        </div>
                    </div>
                </div>
            )}

            {/* Single Lead Mail Modal */}
            {mailLead && <MailModal lead={mailLead} onClose={() => setMailLead(null)} />}

            {/* Bulk Mail Modal */}
            {showBulkMail && (
                <BulkMailModal
                    leads={leads}
                    filterDesc={filterDesc}
                    onClose={() => setShowBulkMail(false)}
                />
            )}
        </div>
    );
}
