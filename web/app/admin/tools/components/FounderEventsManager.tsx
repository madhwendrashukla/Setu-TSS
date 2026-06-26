"use client";
import { useState, useEffect } from "react";

export default function FounderEventsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ tag: "", eventName: "", exhibitionCentre: "", location: "", startDate: "", month: "", weblink: "", priority: "", description: "" });

    const fetchData = () => {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/founder-events`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                setItems(Array.isArray(data) ? data : []);
                setIsLoading(false);
            })
            .catch(err => {
                console.error(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const url = editingItem 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tools/founder-events/${editingItem.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/tools/founder-events`;
        const method = editingItem ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ tag: "", eventName: "", exhibitionCentre: "", location: "", startDate: "", month: "", weblink: "", priority: "", description: "" });
                fetchData();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this?")) return;
        const token = localStorage.getItem("adminToken");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/founder-events/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.ok) fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const openEdit = (item: any) => {
        setEditingItem(item);
        setFormData({ 
            tag: item.tag || "", 
            eventName: item.eventName, 
            exhibitionCentre: item.exhibitionCentre || "",
            location: item.location || "",
            startDate: item.startDate || "",
            month: item.month || "",
            weblink: item.weblink || "",
            priority: item.priority || "",
            description: item.description || ""
        });
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Founder Events Calendar</h2>
                <button 
                    onClick={() => { setEditingItem(null); setFormData({ tag: "", eventName: "", exhibitionCentre: "", location: "", startDate: "", month: "", weblink: "", priority: "", description: "" }); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded font-bold"
                >
                    Add Event
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-white/10 border-t-accent-blue rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Event Name</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Date</th>
                                    <th className="p-4">Weblink</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {paginatedItems.map(item => (
                                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{item.eventName}</td>
                                        <td className="p-4 text-white/70">{item.location}</td>
                                        <td className="p-4 text-white/70">{item.startDate}</td>
                                        <td className="p-4 text-white/70">
                                            <a href={item.weblink} target="_blank" className="text-accent-blue hover:underline">Link</a>
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <button onClick={() => openEdit(item)} className="p-2 text-white/50 hover:text-accent-blue"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-white/50 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-white/50">No events found.</td></tr>
                                )}
                            </tbody>
                        </table>
                        
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 border-t border-white/10 bg-white/5">
                                <span className="text-white/50 text-sm">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of {items.length}</span>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1 rounded bg-[#0F1322] border border-white/10 text-white/70 disabled:opacity-50 hover:bg-white/10"
                                    >
                                        Prev
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1 rounded bg-[#0F1322] border border-white/10 text-white/70 disabled:opacity-50 hover:bg-white/10"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#0F1322] border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-bold mb-4">{editingItem ? "Edit Event" : "Add Event"}</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input type="text" placeholder="Event Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.eventName} onChange={e => setFormData({...formData, eventName: e.target.value})} required />
                            <input type="text" placeholder="Tag (e.g. Startup Summit)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                            <input type="text" placeholder="Exhibition Centre" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.exhibitionCentre} onChange={e => setFormData({...formData, exhibitionCentre: e.target.value})} />
                            <input type="text" placeholder="Location" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                            <input type="text" placeholder="Start Date (e.g. 14-27 Nov)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} />
                            <input type="text" placeholder="Month (e.g. Nov)" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
                            <input type="text" placeholder="Weblink" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.weblink} onChange={e => setFormData({...formData, weblink: e.target.value})} />
                            <input type="text" placeholder="Priority" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} />
                            <textarea placeholder="Description" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            
                            <div className="flex gap-4 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 rounded-xl font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
