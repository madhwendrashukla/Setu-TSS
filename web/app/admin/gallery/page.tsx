"use client";
import { useState, useEffect, useRef } from "react";

export default function AdminGallery() {
    const [items, setItems] = useState<any[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchGallery = () => {
        fetch("http://localhost:5000/api/homepage")
            .then(res => res.json())
            .then(data => setItems(data.galleryItems || []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchGallery();
    }, []);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const token = localStorage.getItem("adminToken");
        const data = new FormData();
        data.append("media", file);
        data.append("type", file.type.startsWith("video/") ? "video" : "image");

        try {
            const res = await fetch("http://localhost:5000/api/admin/gallery", {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                fetchGallery();
            } else {
                const err = await res.json();
                alert(err.error || "Upload failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this item?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`http://localhost:5000/api/admin/gallery/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchGallery();
        } catch (error) {
            console.error(error);
        }
    };

    const images = items.filter(i => i.type === 'image');
    const videos = items.filter(i => i.type === 'video');
    const total = items.length;
    const progress = Math.min((total / 30) * 100, 100);

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Gallery</h1>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 disabled:opacity-50"
                >
                    {isUploading ? "Uploading..." : "+ Upload Media"}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*,video/*"
                    onChange={handleUpload}
                />
            </div>

            <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl mb-8">
                <h2 className="text-xl font-bold mb-2">Upload Limits</h2>
                <p className="text-text-secondary text-sm">
                    Images: <span className="text-white">{images.length} / 20</span> &nbsp;|&nbsp; 
                    Videos: <span className="text-white">{videos.length} / 10</span> &nbsp;|&nbsp; 
                    Total: <span className="text-white">{total} / 30</span>
                </p>
                <div className="w-full bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                    <div className={`bg-accent-blue h-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-8 text-text-secondary hover:text-white hover:border-white cursor-pointer transition h-48"
                >
                    <span className="text-3xl mb-2">+</span>
                    <span>Click to Upload</span>
                    <span className="text-xs mt-2 opacity-50 text-center">JPG, PNG, WebP<br/>Max 5MB</span>
                </div>
                
                {items.map(item => (
                    <div key={item.id} className="relative group rounded-xl overflow-hidden border border-white/10 bg-zinc-900 h-48 flex items-center justify-center">
                        {item.type === 'image' ? (
                            <img src={item.media_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <video src={item.media_url} className="w-full h-full object-cover" muted />
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => handleDelete(item.id)}
                                className="bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded font-bold transition"
                            >
                                Delete
                            </button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs uppercase font-bold text-white">
                            {item.type}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
