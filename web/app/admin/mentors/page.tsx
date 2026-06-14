"use client";
import { useState, useEffect } from "react";

export default function AdminMentors() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", title: "", bio: "", linkedin_url: "" });
    const [file, setFile] = useState<File | null>(null);

    const fetchMentors = () => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mentors`)
            .then(res => res.json())
            .then(data => setMentors(data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const data = new FormData();
        data.append("name", formData.name);
        data.append("title", formData.title);
        data.append("bio", formData.bio);
        data.append("linkedin_url", formData.linkedin_url);
        if (file) data.append("photo", file);

        const url = editingMentor 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors/${editingMentor.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors`;
        const method = editingMentor ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingMentor(null);
                setFormData({ name: "", title: "", bio: "", linkedin_url: "" });
                setFile(null);
                fetchMentors();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this mentor?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchMentors();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (mentor: any) => {
        setEditingMentor(mentor);
        setFormData({ name: mentor.name, title: mentor.title, bio: mentor.bio || "", linkedin_url: mentor.linkedin_url || "" });
        setFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Manage Mentors</h1>
                    <p className="text-white/50 text-sm">Add, update, or remove mentors from the roster.</p>
                </div>
                <button 
                    onClick={() => { setEditingMentor(null); setFormData({ name: "", title: "", bio: "", linkedin_url: "" }); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add New Mentor
                </button>
            </div>

            <div className="glass-card bg-[#0F1322]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-bold w-1/3">Mentor Profile</th>
                                <th className="p-5 font-bold w-1/3">Title & Bio</th>
                                <th className="p-5 font-bold text-right w-1/3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {mentors.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-10 text-center text-white/40">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <i className="fas fa-users-slash text-4xl mb-2 opacity-50"></i>
                                            <p>No mentors found. Add one to get started.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                mentors.map(mentor => (
                                    <tr key={mentor.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                {mentor.photo_url ? (
                                                    <img src={mentor.photo_url} alt="" className="w-12 h-12 rounded-full object-cover border border-white/10 shadow-lg" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center shadow-lg">
                                                        <i className="fas fa-user text-white/50"></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-bold text-white text-base group-hover:text-accent-blue transition-colors">{mentor.name}</div>
                                                    {mentor.linkedin_url && (
                                                        <a href={mentor.linkedin_url} target="_blank" className="text-xs text-white/30 hover:text-[#0077b5] transition-colors flex items-center gap-1 mt-0.5">
                                                            <i className="fab fa-linkedin"></i> LinkedIn
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-white/80 font-medium mb-1">{mentor.title}</div>
                                            <div className="text-white/40 text-xs line-clamp-1 max-w-xs">{mentor.bio || "No bio provided."}</div>
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button 
                                                    onClick={() => openEdit(mentor)} 
                                                    className="w-8 h-8 rounded-lg bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                                                    title="Edit Mentor"
                                                >
                                                    <i className="fas fa-edit text-sm"></i>
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(mentor.id)} 
                                                    className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"
                                                    title="Delete Mentor"
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

            {/* Glassmorphic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-[#121626] border border-white/10 p-8 rounded-[2rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">{editingMentor ? "Edit Mentor" : "Add New Mentor"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white flex items-center justify-center transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Mentor Name</label>
                                <input placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Title / Designation</label>
                                <input placeholder="e.g. Founder at TechCorp" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">LinkedIn URL</label>
                                <input placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Bio (Optional)</label>
                                <textarea placeholder="Short description about the mentor..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none h-24 resize-none custom-scrollbar" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Profile Photo</label>
                                <div className="relative w-full">
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="w-full bg-black/40 border border-white/10 border-dashed rounded-xl px-4 py-6 text-center flex flex-col items-center justify-center gap-2 group hover:border-accent-blue/50 transition-colors">
                                        <i className="fas fa-cloud-upload-alt text-2xl text-white/30 group-hover:text-accent-blue transition-colors"></i>
                                        <span className="text-white/50 text-sm">{file ? file.name : (editingMentor && editingMentor.photo_url ? "Click to upload a new photo" : "Click to upload photo (Max 5MB)")}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors">Cancel</button>
                                <button type="submit" className="flex-1 py-3 rounded-xl bg-accent-blue hover:bg-accent-blue/90 text-white font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                                    {editingMentor ? "Update Mentor" : "Save Mentor"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
