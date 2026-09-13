"use client";
import { useState, useEffect } from "react";

interface AdminUser {
    id: string;
    name: string | null;
    email: string;
    admin_type: string;
    created_at: string;
    created_by: string | null;
}

export default function AdminsPage() {
    const [admins, setAdmins] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [me, setMe] = useState<AdminUser | null>(null);

    // Create modal state
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [createForm, setCreateForm] = useState({ name: "", email: "", password: "" });
    const [showCreatePassword, setShowCreatePassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset password modal state
    const [resetModalUserId, setResetModalUserId] = useState<string | null>(null);
    const [resetForm, setResetForm] = useState({ currentPassword: "", newPassword: "" });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isResetting, setIsResetting] = useState(false);

    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchAdmins = async () => {
        try {
            const token = localStorage.getItem("adminToken");
            
            // First fetch current user
            const meRes = await fetch(`${API}/api/admin/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (meRes.ok) {
                const meData = await meRes.json();
                setMe(meData);
                
                // If primary, fetch all admins
                if (meData.admin_type === 'primary') {
                    const res = await fetch(`${API}/api/admin/admins`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        setAdmins(await res.json());
                    }
                } else {
                    // If secondary, just show themselves
                    setAdmins([meData]);
                }
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/admins`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(createForm)
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to create admin");
                return;
            }

            setCreateForm({ name: "", email: "", password: "" });
            setIsCreateModalOpen(false);
            fetchAdmins();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to delete the admin account for ${email}?`)) return;
        
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/admins/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || "Failed to delete admin");
                return;
            }

            fetchAdmins();
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsResetting(true);
        try {
            const token = localStorage.getItem("adminToken");
            const res = await fetch(`${API}/api/admin/admins/${resetModalUserId}/reset-password`, {
                method: "PUT",
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify(resetForm)
            });

            const data = await res.json();
            if (!res.ok) {
                alert(data.error || "Failed to reset password");
                return;
            }

            setResetForm({ currentPassword: "", newPassword: "" });
            setResetModalUserId(null);
            alert("Password successfully reset.");
        } catch (error) {
            console.error(error);
            alert("An error occurred");
        } finally {
            setIsResetting(false);
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading admin accounts...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
                <div>
                    <div className="flex items-center gap-2.5">
                        <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold">
                            <i className="fa-solid fa-user-shield text-lg"></i>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Admin Accounts</h1>
                            <p className="text-xs sm:text-sm text-slate-500">
                                Manage primary and office (secondary) admin access to this portal.
                            </p>
                        </div>
                    </div>
                </div>

                {me?.admin_type === 'primary' && (
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold transition-all shadow-md active:scale-95"
                    >
                        <i className="fa-solid fa-plus"></i>
                        <span>Create Office Admin</span>
                    </button>
                )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-200/80 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                                <th className="py-3.5 px-4 sm:px-6">Name / Email</th>
                                <th className="py-3.5 px-4 sm:px-6">Role Type</th>
                                <th className="py-3.5 px-4 sm:px-6">Created On</th>
                                <th className="py-3.5 px-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-medium">
                            {admins.map((admin) => {
                                const isMe = me?.id === admin.id;
                                return (
                                    <tr key={admin.id} className="hover:bg-slate-50/60 transition-colors">
                                        <td className="py-4 px-4 sm:px-6">
                                            <div className="font-bold text-slate-900 flex items-center gap-2">
                                                {admin.name || "Unnamed"}
                                                {isMe && <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">You</span>}
                                            </div>
                                            <div className="text-xs text-slate-500 mt-0.5">{admin.email}</div>
                                        </td>
                                        <td className="py-4 px-4 sm:px-6">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                                                admin.admin_type === 'primary' 
                                                ? "bg-amber-50 text-amber-700 border-amber-200" 
                                                : "bg-blue-50 text-blue-700 border-blue-200"
                                            }`}>
                                                {admin.admin_type === 'primary' ? 'Primary' : 'Office (Secondary)'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 sm:px-6 text-slate-500 text-xs">
                                            {new Date(admin.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => setResetModalUserId(admin.id)}
                                                    className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                                                    title="Reset Password"
                                                >
                                                    <i className="fa-solid fa-key"></i>
                                                </button>
                                                {me?.admin_type === 'primary' && admin.admin_type !== 'primary' && !isMe && (
                                                    <button
                                                        onClick={() => handleDelete(admin.id, admin.email)}
                                                        className="text-slate-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-rose-50 transition-colors"
                                                        title="Delete Admin"
                                                    >
                                                        <i className="fa-regular fa-trash-can text-sm"></i>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Admin Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Create Office Admin</h2>
                            <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Name</label>
                                <input 
                                    required
                                    value={createForm.name} 
                                    onChange={e => setCreateForm({...createForm, name: e.target.value})}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                    placeholder="e.g. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Email Address</label>
                                <input 
                                    type="email" required
                                    value={createForm.email} 
                                    onChange={e => setCreateForm({...createForm, email: e.target.value})}
                                    className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors"
                                    placeholder="office@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Password</label>
                                <div className="relative">
                                    <input 
                                        type={showCreatePassword ? "text" : "password"} required minLength={6}
                                        value={createForm.password} 
                                        onChange={e => setCreateForm({...createForm, password: e.target.value})}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors pr-10"
                                        placeholder="Min. 6 characters"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowCreatePassword(!showCreatePassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <i className={`fa-regular ${showCreatePassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isSubmitting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50">
                                    {isSubmitting ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reset Password Modal */}
            {resetModalUserId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-black text-slate-900">Reset Password</h2>
                            <button onClick={() => setResetModalUserId(null)} className="text-slate-400 hover:text-slate-600">
                                <i className="fa-solid fa-xmark text-lg"></i>
                            </button>
                        </div>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            {me?.id === resetModalUserId && (
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showCurrentPassword ? "text" : "password"} required
                                            value={resetForm.currentPassword} 
                                            onChange={e => setResetForm({...resetForm, currentPassword: e.target.value})}
                                            className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors pr-10"
                                        />
                                        <button 
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            <i className={`fa-regular ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-500 mt-1">Required because you are changing your own password.</p>
                                </div>
                            )}
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1.5">New Password</label>
                                <div className="relative">
                                    <input 
                                        type={showNewPassword ? "text" : "password"} required minLength={6}
                                        value={resetForm.newPassword} 
                                        onChange={e => setResetForm({...resetForm, newPassword: e.target.value})}
                                        className="w-full bg-slate-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 focus:bg-white transition-colors pr-10"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                    >
                                        <i className={`fa-regular ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setResetModalUserId(null)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-slate-700 text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                                <button type="submit" disabled={isResetting} className="px-6 py-2.5 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 transition-colors shadow-md disabled:opacity-50">
                                    {isResetting ? 'Resetting...' : 'Save Password'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
