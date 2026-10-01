"use client";
import { useState, useEffect } from "react";

export default function IncubatorsManager() {
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 10;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        logo_url: "",
        description: "",
        country: "",
        state: "",
        city: "",
        full_address: "",
        pincode: "",
        website: "",
        contact_person: "",
        contact_designation: "",
        contact_email: "",
        contact_mobile: "",
        date_of_establishment: "",
        program_duration_months: "",
        no_of_current_incubatees: "",
        no_of_graduated_incubatees: "",
        portfolio_companies: "",
        industries: "",
        sectors: "",
        industries_detailed: "",
        sectors_detailed: "",
        stages: "",
        preferred_stages: ""
    });

    const emptyForm = {
        name: "", logo_url: "", description: "", country: "", state: "", city: "", full_address: "", pincode: "", website: "", contact_person: "", contact_designation: "", contact_email: "", contact_mobile: "", date_of_establishment: "", program_duration_months: "", no_of_current_incubatees: "", no_of_graduated_incubatees: "", portfolio_companies: "", industries: "", sectors: "", industries_detailed: "", sectors_detailed: "", stages: "", preferred_stages: ""
    };

    const fetchData = () => {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");
        fetch(`/api/tools/incubators`, {
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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const data = new FormData();
        data.append("file", file);
        setIsUploading(true);
        const token = localStorage.getItem("adminToken");
        
        try {
            const res = await fetch(`/api/admin/upload`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: data
            });
            const json = await res.json();
            if (json.url) {
                setFormData(prev => ({ ...prev, logo_url: json.url }));
            }
        } catch (error) {
            console.error("Upload failed", error);
        }
        setIsUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");
        const url = editingItem 
            ? `/api/tools/incubators/${editingItem.id}`
            : `/api/tools/incubators`;
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
                setFormData(emptyForm);
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
            const res = await fetch(`/api/tools/incubators/${id}`, {
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
            name: item.name || "",
            logo_url: item.logo_url || "",
            description: item.description || "",
            country: item.country || "",
            state: item.state || "",
            city: item.city || "",
            full_address: item.full_address || "",
            pincode: item.pincode || "",
            website: item.website || "",
            contact_person: item.contact_person || "",
            contact_designation: item.contact_designation || "",
            contact_email: item.contact_email || "",
            contact_mobile: item.contact_mobile || "",
            date_of_establishment: item.date_of_establishment || "",
            program_duration_months: item.program_duration_months || "",
            no_of_current_incubatees: item.no_of_current_incubatees || "",
            no_of_graduated_incubatees: item.no_of_graduated_incubatees || "",
            portfolio_companies: item.portfolio_companies || "",
            industries: item.industries || "",
            sectors: item.sectors || "",
            industries_detailed: item.industries_detailed || "",
            sectors_detailed: item.sectors_detailed || "",
            stages: item.stages || "",
            preferred_stages: item.preferred_stages || ""
        });
        setIsModalOpen(true);
    };

    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paginatedItems = items.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Incubators & Accelerators</h2>
                <button 
                    onClick={() => { setEditingItem(null); setFormData(emptyForm); setIsModalOpen(true); }}
                    className="bg-accent-blue hover:bg-accent-blue/90 text-white px-4 py-2 rounded font-bold"
                >
                    Add Incubator
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
                                    <th className="p-4">Logo</th>
                                    <th className="p-4">Name</th>
                                    <th className="p-4">Location</th>
                                    <th className="p-4">Stages</th>
                                    <th className="p-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {paginatedItems.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4">
                                            {item.logo_url ? <img src={item.logo_url.includes('api.startupindia.gov.in') ? `/api/tools/incubators/proxy-image?url=${encodeURIComponent(item.logo_url)}` : item.logo_url} alt="" className="h-10 w-auto rounded object-contain bg-white" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=0A0A0A&color=508cff&bold=true&size=128`; }} /> : <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">No img</div>}
                                        </td>
                                        <td className="p-4 font-medium">{item.name}</td>
                                        <td className="p-4 text-gray-600">{item.city}{item.city && item.state ? ', ' : ''}{item.state}</td>
                                        <td className="p-4 text-gray-600">{item.stages}</td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <button onClick={() => openEdit(item)} className="p-2 text-gray-500 hover:text-accent-blue"><i className="fas fa-edit"></i></button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-500 hover:text-red-400"><i className="fas fa-trash"></i></button>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr><td colSpan={5} className="p-8 text-center text-gray-500">No incubators found.</td></tr>
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
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">{editingItem ? "Edit Incubator" : "Add Incubator"}</h3>
                            <button type="button" onClick={() => setIsModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                                <i className="fas fa-times text-gray-600"></i>
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Name *</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                                </div>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Logo URL or Upload</label>
                                    <div className="flex gap-2">
                                        <input type="text" placeholder="https://..." className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.logo_url} onChange={e => setFormData({...formData, logo_url: e.target.value})} />
                                        <label className="bg-gray-100 hover:bg-gray-200 border border-gray-200 px-3 py-2 rounded-lg cursor-pointer flex items-center gap-2 whitespace-nowrap">
                                            {isUploading ? <i className="fas fa-spinner fa-spin text-gray-500"></i> : <i className="fas fa-upload text-gray-500"></i>}
                                            <span className="text-sm font-medium text-gray-700">Upload</span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                                        </label>
                                    </div>
                                    {formData.logo_url && (
                                        <div className="mt-2 p-2 bg-gray-50 rounded border border-gray-200 inline-block">
                                            <img src={formData.logo_url.includes('api.startupindia.gov.in') ? `/api/tools/incubators/proxy-image?url=${encodeURIComponent(formData.logo_url)}` : formData.logo_url} alt="Preview" className="h-10 object-contain" referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name || 'Incubator')}&background=0A0A0A&color=508cff&bold=true&size=128`; }} />
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <textarea className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 h-20" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Country</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">State</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">City</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                                </div>
                                
                                <div className="space-y-1 md:col-span-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Full Address</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.full_address} onChange={e => setFormData({...formData, full_address: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Website</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Date of Establishment</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.date_of_establishment} onChange={e => setFormData({...formData, date_of_establishment: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Person</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.contact_person} onChange={e => setFormData({...formData, contact_person: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Designation</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.contact_designation} onChange={e => setFormData({...formData, contact_designation: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Email</label>
                                    <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.contact_email} onChange={e => setFormData({...formData, contact_email: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Contact Mobile</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.contact_mobile} onChange={e => setFormData({...formData, contact_mobile: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Stages</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.stages} onChange={e => setFormData({...formData, stages: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Preferred Stages</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.preferred_stages} onChange={e => setFormData({...formData, preferred_stages: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Industries</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.industries} onChange={e => setFormData({...formData, industries: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Sectors</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.sectors} onChange={e => setFormData({...formData, sectors: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Industries (Detailed)</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.industries_detailed} onChange={e => setFormData({...formData, industries_detailed: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Sectors (Detailed)</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.sectors_detailed} onChange={e => setFormData({...formData, sectors_detailed: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Program Duration (Months)</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.program_duration_months} onChange={e => setFormData({...formData, program_duration_months: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Portfolio Companies</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.portfolio_companies} onChange={e => setFormData({...formData, portfolio_companies: e.target.value})} />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Current Incubatees</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.no_of_current_incubatees} onChange={e => setFormData({...formData, no_of_current_incubatees: e.target.value})} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Graduated Incubatees</label>
                                    <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2" value={formData.no_of_graduated_incubatees} onChange={e => setFormData({...formData, no_of_graduated_incubatees: e.target.value})} />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-4 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 font-bold text-gray-700">Cancel</button>
                                <button type="submit" className="flex-1 px-4 py-3 bg-accent-blue hover:bg-accent-blue/90 text-white rounded-xl font-bold shadow-lg shadow-accent-blue/20">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
