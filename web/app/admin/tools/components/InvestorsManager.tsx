"use client";
import { useState, useEffect } from "react";

export default function InvestorsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({ 
        name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "", about: "", logo_url: "",
        poc_name: "", poc_designation: "", poc_linkedin: "", twitter: "", org_linkedin: "", portfolio_cos: "", ticketSize: ""
    });
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [pocPhotoFile, setPocPhotoFile] = useState<File | null>(null);

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

        const payload = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
            payload.append(key, value);
        });

        if (logoFile) payload.append('logo', logoFile);
        if (pocPhotoFile) payload.append('pocPhoto', pocPhotoFile);

        try {
            const res = await fetch(url, {
                method,
                headers: { 
                    "Authorization": `Bearer ${token}`
                },
                body: payload
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingItem(null);
                setLogoFile(null);
                setPocPhotoFile(null);
                setFormData({ name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "", about: "", logo_url: "", poc_name: "", poc_designation: "", poc_linkedin: "", twitter: "", org_linkedin: "", portfolio_cos: "", ticketSize: "" });
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
        setLogoFile(null);
        setPocPhotoFile(null);
        setFormData({ 
            name: item.name, 
            firm: item.firm || "", 
            type: item.type || "", 
            stages: (item.stages || []).join(", "),
            sectors: (item.sectors || []).join(", "),
            linkedin: item.linkedin || "",
            about: item.about || "",
            logo_url: item.logo_url || "",
            poc_name: item.poc_name || "",
            poc_designation: item.poc_designation || "",
            poc_linkedin: item.poc_linkedin || "",
            twitter: item.twitter || "",
            org_linkedin: item.org_linkedin || "",
            portfolio_cos: (item.portfolio_cos || []).join(", "),
            ticketSize: item.ticketSize || ""
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
                    onClick={() => { 
                        setEditingItem(null); 
                        setLogoFile(null);
                        setPocPhotoFile(null);
                        setFormData({ name: "", firm: "", type: "", stages: "", sectors: "", linkedin: "", about: "", logo_url: "", poc_name: "", poc_designation: "", poc_linkedin: "", twitter: "", org_linkedin: "", portfolio_cos: "", ticketSize: "" }); 
                        setIsModalOpen(true); 
                    }}
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
                                    <th className="p-4">About</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/10">
                                {paginatedItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.firm}</td>
                                        <td className="p-4 text-gray-600">{item.type}</td>
                                        <td className="p-4 text-gray-600 truncate max-w-xs" title={(item.sectors || []).join(", ")}>{(item.sectors || []).join(", ")}</td>
                                        <td className="p-4 text-gray-600 truncate max-w-xs" title={item.about}>{item.about || '-'}</td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <button onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-accent-blue"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan={6} className="p-8 text-center text-gray-500">No investors found.</td></tr>
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                        <h3 className="text-2xl font-bold mb-4">{editingItem ? "Edit Investor" : "Add Investor"}</h3>
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input type="text" placeholder="Name *" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                <input type="text" placeholder="Firm" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.firm} onChange={e => setFormData({...formData, firm: e.target.value})} />
                                <input type="text" placeholder="Type (e.g. VC, Angel)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} />
                                <input type="text" placeholder="Stages (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.stages} onChange={e => setFormData({...formData, stages: e.target.value})} />
                                <input type="text" placeholder="Sectors (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.sectors} onChange={e => setFormData({...formData, sectors: e.target.value})} />
                                <input type="text" placeholder="Ticket Size" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.ticketSize} onChange={e => setFormData({...formData, ticketSize: e.target.value})} />
                                <input type="text" placeholder="Portfolio Cos (comma separated)" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.portfolio_cos} onChange={e => setFormData({...formData, portfolio_cos: e.target.value})} />
                                
                                {/* Socials */}
                                <input type="text" placeholder="Org LinkedIn URL" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.org_linkedin} onChange={e => setFormData({...formData, org_linkedin: e.target.value})} />
                                <input type="text" placeholder="Twitter URL" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.twitter} onChange={e => setFormData({...formData, twitter: e.target.value})} />
                                
                                {/* POC info */}
                                <input type="text" placeholder="POC Name" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.poc_name} onChange={e => setFormData({...formData, poc_name: e.target.value})} />
                                <input type="text" placeholder="POC Designation" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.poc_designation} onChange={e => setFormData({...formData, poc_designation: e.target.value})} />
                                <input type="text" placeholder="POC LinkedIn URL" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3" value={formData.poc_linkedin} onChange={e => setFormData({...formData, poc_linkedin: e.target.value})} />
                            </div>

                            <textarea placeholder="About / Bio..." className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 min-h-[100px] resize-y" value={formData.about} onChange={e => setFormData({...formData, about: e.target.value})} />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">Firm Logo</label>
                                    <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                    {formData.logo_url && !logoFile && <p className="text-xs text-gray-500">Current: {formData.logo_url.substring(0,30)}...</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">POC Photo</label>
                                    <input type="file" accept="image/*" onChange={e => setPocPhotoFile(e.target.files?.[0] || null)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm" />
                                </div>
                            </div>
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
