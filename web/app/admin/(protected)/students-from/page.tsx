"use client";
import { useState, useEffect } from "react";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";
import { DraggableList } from "@/components/admin/DraggableList";

function readFile(file: File): Promise<string> {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => resolve(reader.result as string), false);
        reader.readAsDataURL(file);
    });
}

export default function AdminStudentsFrom() {
    const [logos, setLogos] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editing, setEditing] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ name: "", display_order: 0, is_active: true });
    
    // Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchLogos = () => {
        fetch(`${API}/api/admin/student-network-logos`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setLogos(Array.isArray(data) ? data.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0)) : [])).catch(console.error);
    };

    useEffect(() => { fetchLogos(); }, []);

    const resetForm = () => { 
        setFormData({ name: "", display_order: 0, is_active: true }); 
        setFile(null); 
        setEditing(null); 
        setImageSrc(null);
    };

    const openEdit = (p: any) => {
        setFormData({ name: p.name, display_order: p.display_order ?? 0, is_active: p.is_active });
        setEditing(p); setIsModalOpen(true);
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const f = e.target.files[0];
            const dataUrl = await readFile(f);
            setImageSrc(dataUrl);
        }
        e.target.value = '';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editing ? `${API}/api/admin/student-network-logos/${editing.id}` : `${API}/api/admin/student-network-logos`;
        const method = editing ? "PUT" : "POST";
        
        let logoUrl = editing?.logo_url || "";
        if (file) {
            const uploadData = new FormData();
            uploadData.append("file", file);
            const uploadRes = await fetch(`${API}/api/admin/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token()}` },
                body: uploadData
            }).then(r => r.json());
            if (uploadRes.url) logoUrl = uploadRes.url;
        }

        const payload = { name: formData.name, display_order: formData.display_order, is_active: formData.is_active, logo_url: logoUrl };
        await fetch(url, { method, headers: { "Authorization": `Bearer ${token()}`, "Content-Type": "application/json" }, body: JSON.stringify(payload) });
        setIsModalOpen(false); resetForm(); fetchLogos();
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this logo?")) return;
        await fetch(`${API}/api/admin/student-network-logos/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchLogos();
    };

    const handleReorder = async (newItems: any[]) => {
        const reordered = newItems.map((item, index) => ({ ...item, display_order: index }));
        setLogos(reordered);
        await fetch(`${API}/api/admin/student-network-logos/reorder`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ items: reordered.map((p, i) => ({ id: p.id, display_order: i })) })
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Students From</h1>
                <button onClick={() => { resetForm(); setIsModalOpen(true); }} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">
                    + Add New Logo
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                        <tr>
                            <th className="pl-4 py-3 font-normal w-8"></th>
                            <th className="p-4 font-normal">Logo</th>
                            <th className="p-4 font-normal">Company / College Name</th>
                            <th className="p-4 font-normal">Status</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logos.length === 0 ? (
                            <tr><td colSpan={5} className="p-8 text-center text-gray-500">No logos added yet</td></tr>
                        ) : (
                            <DraggableList
                                items={logos}
                                onReorder={handleReorder}
                                renderRow={(p) => (
                                    <>
                                        <td className="p-4">
                                            {p.logo_url ? <img src={p.logo_url} alt={p.name} className="h-8 w-auto object-contain" /> : <span className="text-gray-400 text-sm">No image</span>}
                                        </td>
                                        <td className="p-4 font-bold text-gray-900">{p.name}</td>
                                        <td className="p-4"><span className={`text-xs px-2 py-1 rounded ${p.is_active ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-50'}`}>{p.is_active ? 'Active' : 'Hidden'}</span></td>
                                        <td className="p-4 text-right flex gap-2 justify-end">
                                            <button onClick={() => openEdit(p)} className="text-accent-blue hover:underline text-sm">Edit</button>
                                            <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:underline text-sm">Delete</button>
                                        </td>
                                    </>
                                )}
                            />
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">{editing ? 'Edit Logo' : 'Add Logo'}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Company / College Name *</label>
                                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Logo Image (Will be cropped to 1:1)</label>
                                <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-gray-900 text-sm" />
                                {file ? (
                                    <p className="text-xs text-green-500 mt-1 truncate">Selected cropped image ready to upload.</p>
                                ) : editing?.logo_url ? (
                                    <p className="text-xs text-gray-500 mt-1 truncate">Current: {editing.logo_url}</p>
                                ) : null}
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-accent-blue" />
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4" />
                                <span className="text-sm text-gray-500">Active (visible on site)</span>
                            </label>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200">Save Logo</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            
            {imageSrc && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    aspect={1}
                    onCropComplete={(croppedFile) => { setFile(croppedFile); setImageSrc(null); }}
                    onCancel={() => { setImageSrc(null); }}
                />
            )}
        </div>
    );
}
