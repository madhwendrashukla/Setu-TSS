"use client";
import { useState, useEffect } from "react";

export default function AdminChatWidgets() {
    const [widgets, setWidgets] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({
        title: "", subtitle: "", icon: "", link: "",
        display_order: 0, is_active: true
    });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchWidgets = () => {
        fetch(`${API}/api/chat-widgets`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setWidgets(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchWidgets(); }, []);

    const resetForm = () => {
        setFormData({ title: "", subtitle: "", icon: "", link: "", display_order: 0, is_active: true });
        setEditing(null);
    };

    const openEdit = (w: any) => { 
        setFormData({ 
            title: w.title, 
            subtitle: w.subtitle ?? "", 
            icon: w.icon ?? "", 
            link: w.link ?? "", 
            display_order: w.display_order ?? 0, 
            is_active: w.is_active 
        }); 
        setEditing(w); 
        setIsModalOpen(true); 
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing ? `${API}/api/chat-widgets/${editing.id}` : `${API}/api/chat-widgets`;
        const method = editing ? "PUT" : "POST";
        await fetch(url, { method, headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` }, body: JSON.stringify(formData) });
        setIsModalOpen(false); resetForm(); fetchWidgets();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this widget?")) return;
        await fetch(`${API}/api/chat-widgets/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchWidgets();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Chat Widgets</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Widget
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-normal">Title</th>
                            <th className="p-4 font-normal">Link</th>
                            <th className="p-4 font-normal">Icon</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {widgets.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No widgets found</td></tr>
                        ) : widgets.map(w => (
                            <tr key={w.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4">
                                    <p className="font-bold text-gray-900">{w.title}</p>
                                    {w.subtitle && <p className="text-xs text-gray-500">{w.subtitle}</p>}
                                </td>
                                <td className="p-4 text-gray-500">{w.link ?? '—'}</td>
                                <td className="p-4 text-gray-500">{w.icon ?? '—'}</td>
                                <td className="p-4"><span className={`text-xs px-2 py-1 rounded ${w.is_active ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-50'}`}>{w.is_active ? 'Active' : 'Hidden'}</span></td>
                                <td className="p-4 text-right flex gap-2 justify-end">
                                    <button onClick={() => openEdit(w)} className="text-accent-blue hover:underline text-sm">Edit</button>
                                    <button onClick={() => handleDelete(w.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-2xl p-8">
                        <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Widget' : 'Add Widget'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Title *</label>
                                    <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Subtitle</label>
                                    <input value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. Curated events" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm text-gray-500 mb-1">Link URL *</label><input required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. /tools/events or https://..." /></div>
                                <div><label className="block text-sm text-gray-500 mb-1">Icon Name</label><input value={formData.icon} onChange={e => setFormData({...formData, icon: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. BookOpen" /></div>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                                <span className="text-sm text-gray-500">Active (visible in chat box)</span>
                            </label>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">Save Widget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
