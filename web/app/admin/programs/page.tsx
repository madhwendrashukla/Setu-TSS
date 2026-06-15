"use client";
import { useState, useEffect } from "react";

export default function AdminPrograms() {
    const [programs, setPrograms] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "", subtitle: "", description: "", duration: "",
        locations: "", price: "", cta_text: "Show your interest",
        lead_source_tag: "", display_order: 0, is_active: true
    });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchPrograms = () => {
        fetch(`${API}/api/admin/programs`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setPrograms(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchPrograms(); }, []);

    const resetForm = () => {
        setFormData({ title: "", subtitle: "", description: "", duration: "", locations: "", price: "", cta_text: "Show your interest", lead_source_tag: "", display_order: 0, is_active: true });
        setEditing(null);
    };

    const openEdit = (p: any) => { setFormData({ title: p.title, subtitle: p.subtitle ?? "", description: p.description ?? "", duration: p.duration ?? "", locations: p.locations ?? "", price: p.price ?? "", cta_text: p.cta_text ?? "Show your interest", lead_source_tag: p.lead_source_tag ?? "", display_order: p.display_order ?? 0, is_active: p.is_active }); setEditing(p); setIsModalOpen(true); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing ? `${API}/api/admin/programs/${editing.id}` : `${API}/api/admin/programs`;
        const method = editing ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` }, body: JSON.stringify(formData) });
        setIsModalOpen(false); resetForm(); fetchPrograms();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this program?")) return;
        await fetch(`${API}/api/admin/programs/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchPrograms();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Programs</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Program
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Title</th>
                            <th className="p-4 font-normal">Duration</th>
                            <th className="p-4 font-normal">Price</th>
                            <th className="p-4 font-normal">Lead Tag</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {programs.length === 0 ? (
                            <tr><td colSpan={6} className="p-8 text-center text-text-secondary">No programs found</td></tr>
                        ) : programs.map(p => (
                            <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4">
                                    <p className="font-bold text-white">{p.title}</p>
                                    {p.subtitle && <p className="text-xs text-text-secondary">{p.subtitle}</p>}
                                </td>
                                <td className="p-4 text-text-secondary">{p.duration ?? '—'}</td>
                                <td className="p-4 text-text-secondary">{p.price ?? '—'}</td>
                                <td className="p-4"><span className="bg-white/10 px-2 py-1 rounded text-xs font-mono">{p.lead_source_tag ?? '—'}</span></td>
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
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Program' : 'Add Program'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Title *</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" />
                                </div>
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Subtitle</label>
                                    <input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="e.g. 3-Day Ignition Sprint" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue min-h-[80px]" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm text-text-secondary mb-1">Duration</label><input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="e.g. 3 Days" /></div>
                                <div><label className="block text-sm text-text-secondary mb-1">Price</label><input value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="e.g. ₹4,999" /></div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm text-text-secondary mb-1">Lead Source Tag</label><input value={formData.lead_source_tag} onChange={e => setFormData({...formData, lead_source_tag: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="spark_interest" /></div>
                                <div><label className="block text-sm text-text-secondary mb-1">Display Order</label><input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" /></div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                                <span className="text-sm text-text-secondary">Active (visible on site)</span>
                            </label>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="border border-white/20 text-white px-4 py-2 rounded hover:bg-white/10">Cancel</button>
                                <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">Save Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
