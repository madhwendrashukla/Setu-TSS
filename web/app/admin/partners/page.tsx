"use client";
import { useState, useEffect } from "react";

export default function AdminPartners() {
    const [partners, setPartners] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ name: "", website_url: "", display_order: 0, is_active: true });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchPartners = () => {
        fetch(`${API}/api/admin/community_partners`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setPartners(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchPartners(); }, []);

    const resetForm = () => { setFormData({ name: "", website_url: "", display_order: 0, is_active: true }); setFile(null); setEditing(null); };

    const openEdit = (p: any) => {
        setFormData({ name: p.name, website_url: p.website_url ?? "", display_order: p.display_order ?? 0, is_active: p.is_active });
        setEditing(p); setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(formData).forEach(([k, v]) => data.append(k, String(v)));
        if (file) data.append("logo", file);
        const url = editing ? `${API}/api/admin/community_partners/${editing.id}` : `${API}/api/admin/community_partners`;
        const method = editing ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Authorization": `Bearer ${token()}` }, body: data });
        setIsModalOpen(false); resetForm(); fetchPartners();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this partner?")) return;
        await fetch(`${API}/api/admin/community_partners/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchPartners();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Ecosystem Partners</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Partner
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Logo</th>
                            <th className="p-4 font-normal">Partner Name</th>
                            <th className="p-4 font-normal">Website Link</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {partners.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-text-secondary">No partners added yet</td></tr>
                        ) : partners.map(p => (
                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4">
                                    {p.logo_url && <img src={p.logo_url} alt={p.name} className="h-8 w-auto object-contain" />}
                                </td>
                                <td className="p-4 font-bold text-white">{p.name}</td>
                                <td className="p-4">
                                    {p.website_url ? <a href={p.website_url} target="_blank" className="text-accent-blue hover:underline text-sm">{p.website_url}</a> : <span className="text-text-secondary">—</span>}
                                </td>
                                <td className="p-4"><span className={`text-xs px-2 py-1 rounded ${p.is_active ? 'text-green-400 bg-green-400/10' : 'text-white/40 bg-white/5'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                                <td className="p-4 text-right flex gap-2 justify-end">
                                    <button onClick={() => openEdit(p)} className="text-accent-blue hover:underline text-sm">Edit</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Partner' : 'Add Partner'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Partner Name *</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Website URL</label>
                                <input value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="https://partner.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Logo Image</label>
                                <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full text-white text-sm" />
                                {editing?.logo_url && <p className="text-xs text-text-secondary mt-1">Current: {editing.logo_url}</p>}
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                                <span className="text-sm text-text-secondary">Active (visible on site)</span>
                            </label>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="border border-white/20 text-white px-4 py-2 rounded hover:bg-white/10">Cancel</button>
                                <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">Save Partner</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
