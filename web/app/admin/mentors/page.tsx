"use client";
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";

export default function AdminMentors() {
    const [mentors, setMentors] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMentor, setEditingMentor] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", title: "", bio: "", linkedin_url: "", show_linkedin: true });
    const [file, setFile] = useState<File | null>(null);

    const fetchMentors = () => {
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setMentors(data))
            .catch(console.error);
    };

    useEffect(() => {
        fetchMentors();
    }, []);

    const handleDragEnd = async (result: DropResult) => {
        if (!result.destination) return;
        const items = Array.from(mentors);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            display_order: index + 1
        }));
        setMentors(updatedItems);

        const token = localStorage.getItem("adminToken");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors/reorder`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                items: updatedItems.map(i => ({ id: i.id, display_order: i.display_order }))
            })
        });
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        const token = localStorage.getItem("adminToken");
        const formData = new FormData();
        formData.append("is_active", String(!currentStatus));
        
        setMentors(mentors.map(m => m.id === id ? { ...m, is_active: !currentStatus } : m));

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/mentors/${id}`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const data = new FormData();
        data.append("name", formData.name);
        data.append("title", formData.title);
        data.append("bio", formData.bio);
        data.append("linkedin_url", formData.linkedin_url);
        data.append("show_linkedin", String(formData.show_linkedin));
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
                setFormData({ name: "", title: "", bio: "", linkedin_url: "", show_linkedin: true });
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
        setFormData({ name: mentor.name, title: mentor.title, bio: mentor.bio || "", linkedin_url: mentor.linkedin_url || "", show_linkedin: mentor.show_linkedin !== false });
        setFile(null);
        setIsModalOpen(true);
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight mb-1">Manage Mentors</h1>
                    <p className="text-gray-500 text-sm">Add, update, or remove mentors from the roster.</p>
                </div>
                <button 
                    onClick={() => { setEditingMentor(null); setFormData({ name: "", title: "", bio: "", linkedin_url: "", show_linkedin: true }); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-2"
                >
                    <i className="fas fa-plus"></i> Add New Mentor
                </button>
            </div>

            <div className="shadow-sm bg-white backdrop-blur-xl border border-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th className="p-5 font-bold w-1/3">Mentor Profile</th>
                                <th className="p-5 font-bold w-1/3">Title & Bio</th>
                                <th className="p-5 font-bold text-right w-1/3">Actions</th>
                            </tr>
                        </thead>
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="mentors-list">
                                {(provided) => (
                                    <tbody className="divide-y divide-white/5" ref={provided.innerRef} {...provided.droppableProps}>
                                        {mentors.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-10 text-center text-gray-400">
                                                    <div className="flex flex-col items-center justify-center gap-3">
                                                        <i className="fas fa-users-slash text-4xl mb-2 opacity-50"></i>
                                                        <p>No mentors found. Add one to get started.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            mentors.map((mentor, index) => (
                                                <Draggable key={mentor.id} draggableId={mentor.id} index={index}>
                                                    {(provided) => (
                                                        <tr 
                                                            className={`hover:bg-gray-50 transition-colors group ${mentor.is_active ? '' : 'opacity-50'}`}
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                        >
                                                            <td className="p-5">
                                                                <div className="flex items-center gap-4">
                                                                    <div {...provided.dragHandleProps} className="text-gray-400 hover:text-gray-600 cursor-grab px-2">
                                                                        <i className="fas fa-grip-vertical"></i>
                                                                    </div>
                                                                    {mentor.photo_url ? (
                                                                        <img src={mentor.photo_url} alt="" className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-lg" />
                                                                    ) : (
                                                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 border border-gray-200 flex items-center justify-center shadow-lg">
                                                                            <i className="fas fa-user text-gray-500"></i>
                                                                        </div>
                                                                    )}
                                                                    <div>
                                                                        <div className="font-bold text-gray-900 text-base group-hover:text-accent-blue transition-colors">
                                                                            {mentor.name}
                                                                            {!mentor.is_active && <span className="ml-2 text-xs font-bold text-red-500 bg-red-100 px-2 py-0.5 rounded">HIDDEN</span>}
                                                                        </div>
                                                                        {mentor.linkedin_url && (
                                                                            <a href={mentor.linkedin_url} target="_blank" className="text-xs text-gray-400 hover:text-[#0077b5] transition-colors flex items-center gap-1 mt-0.5">
                                                                                <i className="fab fa-linkedin"></i> LinkedIn
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="p-5">
                                                                <div className="text-gray-700 font-medium mb-1">{mentor.title}</div>
                                                                <div className="text-gray-400 text-xs line-clamp-1 max-w-xs">{mentor.bio || "No bio provided."}</div>
                                                            </td>
                                                            <td className="p-5 text-right">
                                                                <div className="flex justify-end items-center gap-4">
                                                                    <button
                                                                        onClick={() => handleToggleActive(mentor.id, mentor.is_active)}
                                                                        className={`w-10 h-5 rounded-full relative transition-colors ${mentor.is_active ? 'bg-green-500' : 'bg-gray-300'}`}
                                                                        title={mentor.is_active ? "Disable Mentor" : "Enable Mentor"}
                                                                    >
                                                                        <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${mentor.is_active ? 'translate-x-5' : ''}`}></div>
                                                                    </button>
                                                                    
                                                                    <div className="flex gap-2">
                                                                        <button 
                                                                            onClick={() => openEdit(mentor)} 
                                                                            className="w-8 h-8 rounded-lg bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center"
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
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </tbody>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </table>
                </div>
            </div>

            {/* Glassmorphic Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
                    <div className="bg-white border border-gray-200 p-8 rounded-[2rem] w-full max-w-xl shadow-[0_0_100px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom-8 zoom-in-95 duration-300">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold tracking-tight">{editingMentor ? "Edit Mentor" : "Add New Mentor"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 flex items-center justify-center transition-colors">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Mentor Name</label>
                                <input placeholder="e.g. Rahul Sharma" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Title / Designation</label>
                                <input placeholder="e.g. Founder at TechCorp" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">LinkedIn URL</label>
                                <input placeholder="https://linkedin.com/in/..." value={formData.linkedin_url} onChange={e => setFormData({...formData, linkedin_url: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none mb-3" />
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={formData.show_linkedin} onChange={e => setFormData({...formData, show_linkedin: e.target.checked})} className="w-4 h-4 text-accent-blue rounded border-gray-300 focus:ring-accent-blue" />
                                    <span className="text-sm font-medium text-gray-700">Show LinkedIn Profile Link</span>
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Bio (Optional)</label>
                                <textarea placeholder="Short description about the mentor..." value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all outline-none h-24 resize-none custom-scrollbar" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Profile Photo</label>
                                <div className="relative w-full">
                                    <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                    <div className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-6 text-center flex flex-col items-center justify-center gap-2 group hover:border-accent-blue/50 transition-colors">
                                        <i className="fas fa-cloud-upload-alt text-2xl text-gray-400 group-hover:text-accent-blue transition-colors"></i>
                                        <span className="text-gray-500 text-sm">{file ? file.name : (editingMentor && editingMentor.photo_url ? "Click to upload a new photo" : "Click to upload photo (Max 5MB)")}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3 mt-4 pt-4 border-t border-gray-200">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold transition-colors">Cancel</button>
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
