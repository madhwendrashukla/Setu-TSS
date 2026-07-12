"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';

export default function AdminCoupons() {
    const [coupons, setCoupons] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState<any>(null);
    const [viewingUsages, setViewingUsages] = useState<any>(null);

    const [formData, setFormData] = useState({
        code: "", type: "percentage", discount_value: 0,
        is_active: true, start_date: "", end_date: "",
        max_uses: "", max_uses_per_user: "", applicable_emails: "", referrer_id: ""
    });

    const fetchCoupons = () => {
        const token = localStorage.getItem("adminToken");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/admin`, {
            headers: { "Authorization": `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) setCoupons(data);
                else setCoupons([]);
            })
            .catch(console.error);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("adminToken");

        const payload = {
            ...formData,
            max_uses: formData.max_uses ? parseInt(formData.max_uses) : null,
            max_uses_per_user: formData.max_uses_per_user ? parseInt(formData.max_uses_per_user) : null,
            applicable_emails: formData.applicable_emails ? formData.applicable_emails.split(',').map(e => e.trim()).filter(e => e) : [],
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
        };

        const url = editingCoupon 
            ? `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/admin/${editingCoupon.id}`
            : `${process.env.NEXT_PUBLIC_API_URL}/api/coupons/admin`;
            
        const method = editingCoupon ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchCoupons();
                setFormData({
                    code: "", type: "percentage", discount_value: 0,
                    is_active: true, start_date: "", end_date: "",
                    max_uses: "", max_uses_per_user: "", applicable_emails: "", referrer_id: ""
                });
                setEditingCoupon(null);
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save coupon");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this coupon?")) return;
        const token = localStorage.getItem("adminToken");
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/admin/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        fetchCoupons();
    };

    const openEdit = (coupon: any) => {
        setEditingCoupon(coupon);
        setFormData({
            code: coupon.code,
            type: coupon.type,
            discount_value: coupon.discount_value,
            is_active: coupon.is_active,
            start_date: coupon.start_date ? coupon.start_date.substring(0, 10) : "",
            end_date: coupon.end_date ? coupon.end_date.substring(0, 10) : "",
            max_uses: coupon.max_uses || "",
            max_uses_per_user: coupon.max_uses_per_user || "",
            applicable_emails: coupon.applicable_emails?.join(', ') || "",
            referrer_id: coupon.referrer_id || ""
        });
        setIsModalOpen(true);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Global Coupons</h1>
                <button
                    onClick={() => {
                        setEditingCoupon(null);
                        setFormData({
                            code: "", type: "percentage", discount_value: 0,
                            is_active: true, start_date: "", end_date: "",
                            max_uses: "", max_uses_per_user: "", applicable_emails: "", referrer_id: ""
                        });
                        setIsModalOpen(true);
                    }}
                    className="bg-accent-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    + Create Coupon
                </button>
            </div>

            <div className="bg-white rounded-xl shadow overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="p-4 font-bold text-gray-600">Code</th>
                            <th className="p-4 font-bold text-gray-600">Discount</th>
                            <th className="p-4 font-bold text-gray-600">Status</th>
                            <th className="p-4 font-bold text-gray-600">Usage</th>
                            <th className="p-4 font-bold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id} className="border-b last:border-0 hover:bg-gray-50">
                                <td className="p-4 font-bold">{coupon.code}</td>
                                <td className="p-4">
                                    {coupon.type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${coupon.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {coupon.is_active ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                    {coupon.current_uses} {coupon.max_uses ? `/ ${coupon.max_uses}` : 'used'}
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setViewingUsages(coupon)} className="text-purple-500 hover:text-purple-700 font-bold mr-4">Log</button>
                                    <button onClick={() => openEdit(coupon)} className="text-blue-500 hover:text-blue-700 font-bold mr-4">Edit</button>
                                    <button onClick={() => handleDelete(coupon.id)} className="text-red-500 hover:text-red-700 font-bold">Delete</button>
                                </td>
                            </tr>
                        ))}
                        {coupons.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500 font-bold">No coupons found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-xl font-bold">{editingCoupon ? "Edit Coupon" : "Create Coupon"}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-black">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold mb-1">Coupon Code</label>
                                    <input required className="w-full border p-2 rounded" value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} placeholder="e.g. SUMMER20" />
                                </div>
                                <div className="flex items-end pb-2">
                                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                                        <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-5 h-5" />
                                        Is Active?
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Discount Type</label>
                                    <select className="w-full border p-2 rounded" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Fixed Amount (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Discount Value</label>
                                    <input type="number" required className="w-full border p-2 rounded" value={formData.discount_value} onChange={e => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-1">Start Date (Optional)</label>
                                    <input type="date" className="w-full border p-2 rounded" value={formData.start_date} onChange={e => setFormData({ ...formData, start_date: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">End Date (Optional)</label>
                                    <input type="date" className="w-full border p-2 rounded" value={formData.end_date} onChange={e => setFormData({ ...formData, end_date: e.target.value })} />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-bold mb-1">Total Max Uses (Optional)</label>
                                    <input type="number" className="w-full border p-2 rounded" placeholder="e.g. 100" value={formData.max_uses} onChange={e => setFormData({ ...formData, max_uses: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Max Uses Per User (Optional)</label>
                                    <input type="number" className="w-full border p-2 rounded" placeholder="e.g. 1" value={formData.max_uses_per_user} onChange={e => setFormData({ ...formData, max_uses_per_user: e.target.value })} />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold mb-1">Applicable Emails (Optional, comma separated)</label>
                                <textarea className="w-full border p-2 rounded h-20" placeholder="user1@example.com, user2@example.com" value={formData.applicable_emails} onChange={e => setFormData({ ...formData, applicable_emails: e.target.value })} />
                                <p className="text-xs text-gray-500 mt-1">Leave empty to allow all users.</p>
                            </div>

                            <div className="pt-4 border-t flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border rounded font-bold hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-accent-blue text-white rounded font-bold hover:bg-blue-700">Save Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {viewingUsages && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Usage Log: {viewingUsages.code}</h2>
                            <button onClick={() => setViewingUsages(null)} className="text-gray-500 hover:text-black">
                                <i className="fas fa-times text-xl"></i>
                            </button>
                        </div>
                        <div className="p-6">
                            {viewingUsages.usages && viewingUsages.usages.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="p-3 font-bold text-gray-600">User Email / Guest</th>
                                            <th className="p-3 font-bold text-gray-600">Used At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewingUsages.usages.map((usage: any, idx: number) => (
                                            <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                                                <td className="p-3 font-medium text-gray-900">{usage.user_email || 'Anonymous/Guest'}</td>
                                                <td className="p-3 text-sm text-gray-600">
                                                    {new Date(usage.used_at).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center p-8 text-gray-500 font-bold bg-gray-50 rounded-lg">
                                    No usage logged yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
