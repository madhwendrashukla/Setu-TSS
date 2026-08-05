"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminMentoredStartups() {
    const [startups, setStartups] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", website_url: "", display_order: 0, is_active: true });
    const [logoFile, setLogoFile] = useState<File | null>(null);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchStartups = () => {
        fetch(`${API}/api/admin/mentored-startups`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => setStartups(Array.isArray(data) ? data : []))
            .catch(console.error);
    };

    useEffect(() => { fetchStartups(); }, []);

    const resetForm = () => {
        setFormData({ name: "", website_url: "", display_order: 0, is_active: true });
        setLogoFile(null);
        setEditing(null);
    };

    const openEdit = (s: any) => {
        setFormData({ name: s.name, website_url: s.website_url ?? "", display_order: s.display_order ?? 0, is_active: s.is_active });
        setLogoFile(null);
        setEditing(s);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing ? `${API}/api/admin/mentored-startups/${editing.id}` : `${API}/api/admin/mentored-startups`;
        const method = editing ? "PUT" : "POST";

        const fd = new FormData();
        fd.append("name", formData.name);
        fd.append("website_url", formData.website_url);
        fd.append("display_order", formData.display_order.toString());
        fd.append("is_active", formData.is_active.toString());
        if (logoFile) fd.append("logo", logoFile);

        await fetch(url, { method, headers: { "Authorization": `Bearer ${token()}` }, body: fd });
        setIsModalOpen(false);
        resetForm();
        fetchStartups();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this startup?")) return;
        await fetch(`${API}/api/admin/mentored-startups/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchStartups();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Mentored Startups</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Startup
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-normal">Logo</th>
                            <th className="p-4 font-normal">Name</th>
                            <th className="p-4 font-normal">Website</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {startups.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No startups found</td></tr>
                        ) : startups.map(s => (
                            <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                                <td className="p-4">
                                    {s.logo_url ? (
                                        <div className="relative w-12 h-12 bg-white rounded flex items-center justify-center overflow-hidden p-1">
                                            <img src={encodeURI(s.logo_url)} alt={s.name} className="max-w-full max-h-full object-contain" />
                                        </div>
                                    ) : (
                                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">None</div>
                                    )}
                                </td>
                                <td className="p-4"><p className="font-bold text-gray-900">{s.name}</p></td>
                                <td className="p-4"><a href={s.website_url} target="_blank" className="text-accent-blue hover:underline text-sm">{s.website_url}</a></td>
                                <td className="p-4"><span className={`text-xs px-2 py-1 rounded ${s.is_active ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-50'}`}>{s.is_active ? 'Active' : 'Hidden'}</span></td>
                                <td className="p-4 text-right flex gap-2 justify-end items-center h-full mt-2">
                                    <button onClick={() => openEdit(s)} className="text-accent-blue hover:underline text-sm">Edit</button>
                                    <button onClick={() => handleDelete(s.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-8">
                        <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Startup' : 'Add Startup'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Startup Name *</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Website URL</label>
                                <input type="url" value={formData.website_url} onChange={e => setFormData({...formData, website_url: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="https://example.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Logo Image</label>
                                {editing && editing.logo_url && !logoFile && (
                                    <div className="mb-2 text-xs text-gray-500">Current logo: <a href={editing.logo_url} target="_blank" className="text-accent-blue underline">View</a></div>
                                )}
                                <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:bg-gray-100 file:text-gray-900 hover:file:bg-white/20" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer pt-2">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                                <span className="text-sm text-gray-500">Active (visible on site)</span>
                            </label>
                            <div className="flex gap-3 justify-end pt-4">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
