"use client";
import { useState, useEffect } from "react";

export default function AdminBottomVideos() {
    const [items, setItems] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title: "", youtube_url: "", display_order: 0 });
    const [uploading, setUploading] = useState(false);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchItems = () => {
        fetch(`${API}/api/admin/bottom_videos`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json()).then(data => setItems(Array.isArray(data) ? data : [])).catch(console.error);
    };

    useEffect(() => { fetchItems(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const res = await fetch(`${API}/api/admin/bottom_videos`, { 
                method: "POST", 
                headers: { "Authorization": `Bearer ${token()}`, "Content-Type": "application/json" }, 
                body: JSON.stringify(formData) 
            });
            const result = await res.json();
            if (!res.ok) { alert(result.error || 'Failed to add video'); return; }
            setIsModalOpen(false); 
            setFormData({ title: "", youtube_url: "", display_order: items.length + 1 }); 
            fetchItems();
        } finally { setUploading(false); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this video?")) return;
        await fetch(`${API}/api/admin/bottom_videos/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token()}` } });
        fetchItems();
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Bottom Video Gallery</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-white text-black font-bold px-4 py-2 rounded-xl hover:bg-gray-100 transition shadow">+ Add Video</button>
            </div>

            {items.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-gray-500 shadow-sm">No videos added yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map(item => (
                        <div key={item.id} className="relative group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
                            <div className="w-full aspect-video bg-gray-50 flex items-center justify-center border-b border-gray-100">
                                {item.youtube_url.includes('youtube.com') || item.youtube_url.includes('youtu.be') ? (
                                    <iframe 
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${item.youtube_url.split('v=')[1]?.split('&')[0] || item.youtube_url.split('youtu.be/')[1]}`} 
                                        title={item.title || "Video"}
                                        frameBorder="0" 
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <i className="fas fa-play-circle text-4xl text-accent-blue"></i>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-gray-900 truncate">{item.title || "Untitled Video"}</h3>
                                <p className="text-xs text-gray-500 mt-1 truncate">{item.youtube_url}</p>
                                <p className="text-xs text-gray-400 mt-1">Order: {item.display_order}</p>
                            </div>
                            <button onClick={() => handleDelete(item.id)}
                                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition shadow">
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Add Video</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Video Title (Optional)</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" 
                                    placeholder="e.g. Masterclass with Founder" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">YouTube URL</label>
                                <input type="url" required value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" 
                                    placeholder="https://www.youtube.com/watch?v=..." />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Display Order</label>
                                <input type="number" required value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-accent-blue/20 focus:border-accent-blue transition" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition">Cancel</button>
                                <button type="submit" disabled={uploading} className="flex-1 bg-accent-blue text-white font-bold py-3 rounded-xl hover:bg-accent-blue/90 disabled:opacity-50 transition shadow-lg shadow-accent-blue/20">
                                    {uploading ? 'Saving...' : 'Add Video'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
