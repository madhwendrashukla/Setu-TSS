"use client";
import { useState, useEffect } from "react";

export default function AdminTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('text');
    const [formData, setFormData] = useState({ name: "", designation: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false, event_tag: "", display_order: "0", rating: "" });
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
        data.append("display_order", formData.display_order);
        data.append("rating", formData.rating);
        if (formData.event_tag) data.append("event_tag", formData.event_tag);

        if (formData.type === "text") {
            data.append("name", formData.name);
            data.append("designation", formData.designation);
            data.append("city", formData.city);
            data.append("quote", formData.quote);
            if (file) data.append("photo", file);
        } else {
            if (formData.name) data.append("name", formData.name);
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
                setFormData({ name: "", designation: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false, event_tag: "", display_order: "0", rating: "" });
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
            designation: t.designation || "",
            city: t.city || "", 
            quote: t.quote || "", 
            type: t.type || "text",
            youtube_url: t.youtube_url || "",
            video_heading: t.video_heading || "",
            video_description: t.video_description || "",
            show_description: t.show_description || false,
            event_tag: t.event_tag || "",
            display_order: t.display_order?.toString() || "0",
            rating: t.rating ? t.rating.toString() : ""
        });
        setFile(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Testimonials</h1>
                <button 
                    onClick={() => { 
                        setEditingTestimonial(null); 
                        const maxOrder = testimonials.filter(t => t.type === 'video').reduce((max, t) => Math.max(max, t.display_order || 0), 0);
                        setFormData({ name: "", designation: "", city: "", quote: "", type: "text", youtube_url: "", video_heading: "", video_description: "", show_description: false, event_tag: "", display_order: (maxOrder + 1).toString(), rating: "" }); 
                        setIsModalOpen(true); 
                    }}
                    className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200"
                >
                    + Add Testimonial
                </button>
            </div>

            <div className="flex gap-4 mb-6 border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('text')}
                    className={`pb-2 px-2 font-bold ${activeTab === 'text' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Text Testimonials
                </button>
                <button 
                    onClick={() => setActiveTab('video')}
                    className={`pb-2 px-2 font-bold ${activeTab === 'video' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    Video Testimonials
                </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                        <tr>
                            <th className="p-4 font-normal">Type</th>
                            <th className="p-4 font-normal">Details</th>
                            <th className="p-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testimonials.filter(t => t.type === activeTab).length === 0 ? (
                            <tr><td colSpan={3} className="p-4 text-center text-gray-500">No testimonials found</td></tr>
                        ) : (
                            testimonials
                                .filter(t => t.type === activeTab)
                                .sort((a, b) => {
                                    if (activeTab === 'text') {
                                        return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
                                    }
                                    return (a.display_order || 0) - (b.display_order || 0);
                                })
                                .map(t => (
                                <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <td className="p-4 font-bold uppercase text-xs">
                                        {t.type}
                                        {t.type === 'video' && <div className="text-gray-400 font-normal mt-1">Order: {t.display_order}</div>}
                                    </td>
                                    <td className="p-4">
                                        {t.type === 'text' ? (
                                            <div>
                                                <div className="font-bold">{t.name} <span className="text-gray-500 font-normal text-sm">({t.designation}{t.designation && t.city ? ', ' : ''}{t.city})</span></div>
                                                {t.rating !== null && t.rating !== undefined && (
                                                    <div className="text-yellow-500 text-xs mt-1">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                                                )}
                                                <div className="text-sm text-gray-500 mt-1 truncate max-w-md">"{t.quote}"</div>
                                                {t.event_tag && <div className="mt-1"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{t.event_tag}</span></div>}
                                            </div>
                                        ) : (
                                            <div>
                                                <div className="font-bold">{t.video_heading} {t.name && <span className="text-gray-500 font-normal text-sm">- {t.name}</span>}</div>
                                                {t.rating !== null && t.rating !== undefined && (
                                                    <div className="text-yellow-500 text-xs mt-1">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
                                                )}
                                                <div className="text-sm text-accent-blue mt-1 truncate max-w-md">{t.youtube_url}</div>
                                                {t.event_tag && <div className="mt-1"><span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">{t.event_tag}</span></div>}
                                            </div>
                                        )}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button onClick={() => openEdit(t)} className="text-gray-500 hover:text-gray-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-400">Delete</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white/80 flex items-center justify-center p-4 z-50">
                    <div className="bg-white border border-gray-200 p-6 rounded-xl w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <select 
                                value={formData.type} 
                                onChange={e => {
                                    const newType = e.target.value;
                                    let newOrder = formData.display_order;
                                    if (newType === 'video' && !editingTestimonial) {
                                        const maxOrder = testimonials.filter(t => t.type === 'video').reduce((max, t) => Math.max(max, t.display_order || 0), 0);
                                        newOrder = (maxOrder + 1).toString();
                                    }
                                    setFormData({...formData, type: newType, display_order: newOrder})
                                }}
                                className="bg-white border border-gray-200 rounded p-2 text-gray-900"
                            >
                                <option value="text">Text Testimonial</option>
                                <option value="video">Video Testimonial</option>
                            </select>

                            <select
                                value={formData.rating}
                                onChange={e => setFormData({...formData, rating: e.target.value})}
                                className="bg-white border border-gray-200 rounded p-2 text-gray-900"
                            >
                                <option value="">None (No Rating)</option>
                                <option value="5">5 Stars</option>
                                <option value="4">4 Stars</option>
                                <option value="3">3 Stars</option>
                                <option value="2">2 Stars</option>
                                <option value="1">1 Star</option>
                            </select>

                            {formData.type === 'video' && (
                                <input type="number" placeholder="Display Order (e.g. 1)" value={formData.display_order} onChange={e => setFormData({...formData, display_order: e.target.value})} required className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                            )}

                            {formData.type === 'text' ? (
                                <>
                                    <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <input placeholder="Title / Designation" value={formData.designation} onChange={e => setFormData({...formData, designation: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <textarea placeholder="Quote" value={formData.quote} onChange={e => setFormData({...formData, quote: e.target.value})} required className="bg-white border border-gray-200 rounded p-2 text-gray-900 h-24" />
                                    <input placeholder="Event Tag (Optional)" value={formData.event_tag} onChange={e => setFormData({...formData, event_tag: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <label className="text-sm text-gray-500 -mb-2">Photo (optional)</label>
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                </>
                            ) : (
                                <>
                                    <input placeholder="Name (Optional)" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <input placeholder="YouTube Embed URL" value={formData.youtube_url} onChange={e => setFormData({...formData, youtube_url: e.target.value})} required className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <input placeholder="Video Title (Optional)" value={formData.video_heading} onChange={e => setFormData({...formData, video_heading: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <textarea placeholder="Video Description (Optional)" value={formData.video_description} onChange={e => setFormData({...formData, video_description: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900 h-24" />
                                    <input placeholder="Event Tag (Optional)" value={formData.event_tag} onChange={e => setFormData({...formData, event_tag: e.target.value})} className="bg-white border border-gray-200 rounded p-2 text-gray-900" />
                                    <label className="flex items-center gap-2 text-sm text-gray-900 cursor-pointer">
                                        <input type="checkbox" checked={formData.show_description} onChange={e => setFormData({...formData, show_description: e.target.checked})} className="rounded bg-white border-gray-200" />
                                        Show Description
                                    </label>
                                </>
                            )}
                            
                            <div className="flex gap-2 mt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-900 font-bold">Cancel</button>
                                <button type="submit" className="flex-1 py-2 rounded bg-white text-black font-bold hover:bg-gray-200">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
