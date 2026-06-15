"use client";
import { useState, useEffect } from "react";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false });
    const [file, setFile] = useState<File | null>(null);

    const fetchTestimonials = () => {
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setTestimonials(Array.isArray(data) ? data : []))
            .catch(console.error);
    };

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const data = new FormData();
        data.append("type", formData.type);
        if (formData.type === "text") {
            data.append("name", formData.name);
            data.append("city", formData.city);
            data.append("quote", formData.quote);
            if (file) data.append("photo", file);
        } else {
            data.append("youtube_url", formData.youtube_url);
            data.append("video_heading", formData.video_heading);
            data.append("video_description", formData.video_description);
            data.append("show_description", String(formData.show_description));
        }

        const url = editingTestimonial 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/testimonials/${editingTestimonial.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/testimonials`;
        const method = editingTestimonial ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingTestimonial(null);
                setFormData({ name: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false });
                setFile(null);
                fetchTestimonials();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save testimonial");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/testimonials/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchTestimonials();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (t: any) => {
        setEditingTestimonial(t);
        setFormData({ 
            name: t.name || "", 
            city: t.city || "", 
            quote: t.quote || "", 
            type: t.type || "text",
            youtube_url: t.youtube_url || "",
            video_heading: t.video_heading || "",
            video_description: t.video_description || "",
            show_description: t.show_description || false
        });
        setFile(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Testimonials</h1>
                <button 
                    onClick={() => { setEditingTestimonial(null); setFormData({ name: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false }); setIsModalOpen(true); }}
                    className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200"
                >
                    + Add Testimonial
                </button>
            </div>

            <div className="bg-zinc-900 border border-white/10 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-white/5 border-b border-white/10 text-text-secondary text-sm">
                        <tr>
                            <th className="p-4 font-normal">Type</th>
                            <th className="p-4 font-normal">Details</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-text-secondary">No testimonials found</td></tr>
                        ) : (
                            testimonials.map(t => (
                                <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                                    <td className="p-4 font-bold uppercase text-xs">{t.type}</td>
                                    <td className="p-4">
                                        {t.type === 'text' ? (
                                            <div>
                                                <div className="font-bold">{t.name} <span className="text-text-secondary font-normal text-sm">({t.city})</span></div>
                                                <div className="text-sm text-text-secondary mt-1 truncate max-w-md">"{t.quote}"</div>
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-bold">{t.video_heading}</div>
                                                <div className="text-sm text-accent-blue mt-1 truncate max-w-md">{t.youtube_url}</div>
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEdit(t)} className="text-text-secondary hover:text-white mr-4">Edit</button>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <select 
                                value={formData.type} 
                                onChange={e => setFormData({...formData, type: e.target.value})}
                                className="bg-black border border-white/10 rounded p-2 text-white"
                            >
                                <option value="text">Text Testimonial</option>
                                <option value="video">Video Testimonial</option>
                            </select>

                            {formData.type === 'text' ? (
                                <>
                                    <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-black border border-white/10 rounded p-2 text-white" />
                                    <input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="bg-black border border-white/10 rounded p-2 text-white" />
                                    <textarea placeholder="Quote" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} required className="bg-black border border-white/10 rounded p-2 text-white h-24" />
                                    <label className="text-sm text-text-secondary -mb-2">Photo (optional)</label>
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-black border border-white/10 rounded p-2 text-white" />
                                </>
                            ) : (
                                <>
                                    <input placeholder="YouTube Embed URL" value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} required className="bg-black border border-white/10 rounded p-2 text-white" />
                                    <input placeholder="Video Heading" value={formData.video_heading} onChange={e => setFormData({...formData, video_heading: e.target.value})} required className="bg-black border border-white/10 rounded p-2 text-white" />
                                    <textarea placeholder="Video Description" value={formData.video_description} onChange={e => setFormData({...formData, video_description: e.target.value})} className="bg-black border border-white/10 rounded p-2 text-white h-24" />
                                    <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                                        <input type="checkbox" checked={formData.show_description} onChange={e => setFormData({...formData, show_description: e.target.checked})} className="rounded bg-black border-white/10" />
                                        Show Description
                                    </label>
                                </>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-white font-bold">Cancel</button>
                                <button type="submit" className="flex-1 py-2 rounded bg-white text-black font-bold hover:bg-gray-200">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
