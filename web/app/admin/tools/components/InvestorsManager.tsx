"use client";
import { useState, useEffect } from "react";

export default function InvestorsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "" });

    const fetchData = () => {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/investors`, {
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
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/tools/investors/${editingItem.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/tools/investors`;
        const method = editingItem ? "PUT" : "POST";

        const payload = {
            ...formData,
            stages: formData.stages.split(",").map(s => s.trim()).filter(Boolean),
            sectors: formData.sectors.split(",").map(s => s.trim()).filter(Boolean),
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                setFormData({ name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "" });
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
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/investors/${id}`, {
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
            name: item.name, 
            firm: item.firm || "", 
            type: item.type || "", 
            stages: (item.stages || []).join(", "),
            sectors: (item.sectors || []).join(", "),
            linkedin: item.linkedin || ""
        });
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Investors</h2>
                <button 
                    onClick={() => { setEditingItem(null); setFormData({ name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "" }); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded font-bold"
                >
                    Add Investor
                </button>
            </div>

            <div className="overflow-x-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-10 h-10 border-4 border-gray-200 border-t-accent-blue rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <>
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Firm</th>
                                    <th className="p-4">Type</th>
                                    <th className="p-4">Sectors</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {paginatedItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.firm}</td>
                                        <td className="p-4 text-gray-600">{item.type}</td>
                                        <td className="p-4 text-gray-600">{(item.sectors || []).join(", ")}</td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <button onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-accent-blue"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No investors found.</td></tr>
                                )}
                            </tbody>
                        </table>
                        
                        {totalPages > 1 && (
                            <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
                                <span className="text-gray-500 text-sm">Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, items.length)} of {items.length}</span>
                                <div className="flex gap-2">
                                    <button 
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        className="px-3 py-1 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
                                    >
                                        Prev
                                    </button>
                                    <button 
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        className="px-3 py-1 rounded bg-white border border-gray-200 text-gray-600 disabled:opacity-50 hover:bg-gray-100"
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
                <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-bold mb-4">{editingItem ? "Edit Investor" : "Add Investor"}</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <input type="text" placeholder="Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                            <input type="text" placeholder="Firm" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.firm} onChange={e => setFormData({...formData, firm: e.target.value})} />
                            <input type="text" placeholder="Type (e.g. VC, Angel)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                            <input type="text" placeholder="Stages (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.stages} onChange={e => setFormData({...formData, stages: e.target.value})} />
                            <input type="text" placeholder="Sectors (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.sectors} onChange={e => setFormData({...formData, sectors: e.target.value})} />
                            <input type="text" placeholder="LinkedIn URL" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.linkedin} onChange={e => setFormData({...formData, linkedin: e.target.value})} />
                            <div className="flex gap-4 mt-2">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 rounded-xl font-bold">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
