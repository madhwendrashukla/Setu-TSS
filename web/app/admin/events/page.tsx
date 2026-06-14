"use client";
import { useState, useEffect } from "react";

export default function AdminEvents() {
    const [events, setEvents] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        title: "", slug: "", description: "", venue: "", city: "", 
        start_date: "", end_date: "", is_past: false, is_pinned: false
    });

    const fetchEvents = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events`)
            .then(res => res.json())
            .then(data => setEvents(data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const data = new FormData();
        
        Object.keys(formData).forEach(key => {
            data.append(key, (formData as any)[key]);
        });
        if (file) data.append("banner", file);

        const url = editingEvent 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${editingEvent.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/events`;
        const method = editingEvent ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingEvent(null);
                resetForm();
                fetchEvents();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/events/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchEvents();
        } catch (error) {
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData({ title: "", slug: "", description: "", venue: "", city: "", start_date: "", end_date: "", is_past: false, is_pinned: false });
        setFile(null);
    };

    const openEdit = (event: any) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            slug: event.slug,
            description: event.description,
            venue: event.venue,
            city: event.city,
            start_date: new Date(event.start_date).toISOString().split('T')[0],
            end_date: new Date(event.end_date).toISOString().split('T')[0],
            is_past: event.is_past,
            is_pinned: event.is_pinned
        });
        setFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Manage Events</h1>
                    <p className="text-white/50 text-sm">Schedule workshops, bootcamps, and events.</p>
                </div>
                <button 
                    onClick={() => { setEditingEvent(null); resetForm(); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add New Event
                </button>
            </div>

            <div className="glass-card bg-[#0F1322]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-bold">Event Details</th>
                                <th className="p-5 font-bold">Date & Location</th>
                                <th className="p-5 font-bold text-center">Status</th>
                                <th className="p-5 font-bold text-center">Pinned</th>
                                <th className="p-5 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-10 text-center text-white/40">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <i className="fas fa-calendar-times text-4xl mb-2 opacity-50"></i>
                                            <p>No events scheduled. Create one above.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                events.map(event => (
                                    <tr key={event.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-base group-hover:text-accent-blue transition-colors">{event.title}</span>
                                                <span className="text-xs text-white/30 mt-1">/{event.slug}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-white/80 font-medium flex items-center gap-2 mb-1">
                                                <i className="fas fa-clock text-xs text-white/40"></i>
                                                {new Date(event.start_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-white/40 text-xs flex items-center gap-2">
                                                <i className="fas fa-map-marker-alt text-xs"></i>
                                                {event.city} - {event.venue}
                                            </div>
                                        </td>
                                        <td className="p-5 text-center">
                                            {event.is_past ? 
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-500/20 text-gray-400 px-3 py-1 rounded-full border border-gray-500/30">Past</span> : 
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30">Upcoming</span>
                                            }
                                        </td>
                                        <td className="p-5 text-center">
                                            {event.is_pinned ? 
                                                <span className="text-accent-blue text-lg" title="Pinned to Homepage"><i className="fas fa-star"></i></span> : 
                                                <span className="text-white/10" title="Not Pinned"><i className="far fa-star"></i></span>
                                            }
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEdit(event)} 
                                                    className="w-8 h-8 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                                                >
                                                    <i className="fas fa-edit text-sm"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(event.id)} 
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                >
                                                    <i className="fas fa-trash-alt text-sm"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#121626] border border-white/10 p-8 rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">{editingEvent ? "Edit Event" : "Create Event"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title</label>
                                    <input placeholder="Event Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Slug</label>
                                    <input placeholder="event-slug-name" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">City</label>
                                    <input placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Venue</label>
                                    <input placeholder="Venue" value={formData.venue} onChange={e => setFormData({...formData, venue: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Start Date</label>
                                    <input type="date" value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">End Date</label>
                                    <input type="date" value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Description</label>
                                <textarea placeholder="Event details..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue outline-none transition-all h-24 resize-none custom-scrollbar" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Banner Image</label>
                                <div className="relative w-full">
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="w-full bg-black/40 border border-white/10 border-dashed rounded-xl px-4 py-6 text-center flex flex-col items-center justify-center gap-2 group hover:border-accent-blue/50 transition-colors">
                                        <i className="fas fa-image text-2xl text-white/30 group-hover:text-accent-blue transition-colors"></i>
                                        <span className="text-white/50 text-sm">{file ? file.name : (editingEvent && editingEvent.banner_url ? "Click to upload a new banner" : "Upload event banner (1920x1080 recommended)")}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-6 mt-2 bg-white/5 p-4 rounded-xl border border-white/5">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_past} onChange={e => setFormData({...formData, is_past: e.target.checked})} className="w-5 h-5 accent-accent-blue rounded" />
                                    <span className="text-sm font-medium text-white/80">Mark as Past Event</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={formData.is_pinned} onChange={e => setFormData({...formData, is_pinned: e.target.checked})} className="w-5 h-5 accent-accent-blue rounded" />
                                    <span className="text-sm font-medium text-white/80">Pin to Homepage</span>
                                </label>
                            </div>

                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                                    {editingEvent ? "Update Event" : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
