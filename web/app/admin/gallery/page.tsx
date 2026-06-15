"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function AdminGallery() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({ type: "image", caption: "", display_order: 0, media_url: "" });
    const [uploading, setUploading] = useState(false);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchItems = () => {
        fetch(`${API}/api/gallery`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setItems(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        const data = new FormData();
        data.append('type', formData.type);
        data.append('caption', formData.caption);
        data.append('display_order', String(formData.display_order));
        if (formData.type === 'video') data.append('media_url', formData.media_url);
        if (file) data.append('media', file);
        try {
            const res = await fetch(`${API}/api/admin/gallery`, { method: "POST", headers: { "Authorization": `Bearer ${token()}` }, body: data });
            const result = await res.json();
            if (!res.ok) { alert(result.error || 'Upload failed'); return; }
            setIsModalOpen(false); setFile(null); setFormData({ type: "image", caption: "", display_order: 0, media_url: "" }); fetchItems();
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this gallery item?")) return;
        await fetch(`${API}/api/admin/gallery/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
    };

    const images = items.filter(i => i.type === 'image');
    const videos = items.filter(i => i.type === 'video');

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Gallery</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200">+ Add Item</button>
            </div>
            <p className="text-text-secondary text-sm mb-8">Limits: <span className="text-white">20 images</span> · <span className="text-white">10 videos</span> · <span className="text-white">30 total</span> — Current: {images.length} images, {videos.length} videos</p>

            {items.length === 0 ? (
                <div className="bg-zinc-900 border border-white/10 rounded-xl p-12 text-center text-text-secondary">No gallery items yet</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map(item => (
                        <div key={item.id} className="relative group bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                            {item.type === 'image' ? (
                                <Image src={item.media_url} alt={item.caption ?? ''} width={300} height={200} className="w-full h-40 object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-40 bg-black/50 flex items-center justify-center">
                                    <i className="fas fa-play-circle text-4xl text-accent-blue"></i>
                                </div>
                            )}
                            <div className="p-2">
                                <p className="text-xs text-text-secondary truncate">{item.caption ?? item.type}</p>
                            </div>
                            <button onClick={() => handleDelete(item.id)}
                                className="absolute top-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Add Gallery Item</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Type</label>
                                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                                    className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue">
                                    <option value="image">Image (max 20)</option>
                                    <option value="video">Video (max 10)</option>
                                </select>
                            </div>
                            {formData.type === 'image' ? (
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Image File</label>
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] ?? null)} className="w-full text-white text-sm" />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm text-text-secondary mb-1">Video URL (YouTube embed)</label>
                                    <input value={formData.media_url} onChange={e => setFormData({...formData, media_url: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" placeholder="https://www.youtube.com/embed/..." />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Caption (optional)</label>
                                <input value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div>
                                <label className="block text-sm text-text-secondary mb-1">Display Order</label>
                                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value)})} className="w-full bg-black border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-accent-blue" />
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="border border-white/20 text-white px-4 py-2 rounded hover:bg-white/10">Cancel</button>
                                <button type="submit" disabled={uploading} className="bg-white text-black font-bold px-6 py-2 rounded hover:bg-gray-200 disabled:opacity-50">
                                    {uploading ? 'Uploading...' : 'Add to Gallery'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
