"use client";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ address: "", contact_email: "", contact_phone: "" });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API}/api/admin/site_settings`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                setFormData({ address: data.address ?? "", contact_email: data.contact_email ?? "", contact_phone: data.contact_phone ?? "" });
            })
            .catch(console.error);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await fetch(`${API}/api/admin/site_settings`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
                body: JSON.stringify(formData)
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } finally { setSaving(false); }
    };

    return (
        <div className="max-w-3xl">
            <h1 className="text-3xl font-bold mb-8">Site Settings</h1>

            <form onSubmit={handleSave}>
                <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8 space-y-6">
                    <h2 className="text-xl font-bold border-b border-gray-200 pb-4">Footer Details</h2>

                    <div>
                        <label className="block text-sm text-gray-500 mb-2">Registered Address</label>
                        <textarea
                            value={formData.address}
                            onChange={e => setFormData({...formData, address: e.target.value})}
                            className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue min-h-[100px]"
                            placeholder="Enter the official address shown in footer"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Contact Email</label>
                            <input
                                type="email"
                                value={formData.contact_email}
                                onChange={e => setFormData({...formData, contact_email: e.target.value})}
                                className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue"
                                placeholder="hello@thestartupschool.in"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Contact Phone</label>
                            <input
                                type="text"
                                value={formData.contact_phone}
                                onChange={e => setFormData({...formData, contact_phone: e.target.value})}
                                className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button type="submit" disabled={saving} className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 mt-4">
                            {saving ? 'Saving...' : 'Save Footer Settings'}
                        </button>
                        {saved && <span className="text-green-400 text-sm mt-4"><i className="fas fa-check mr-1"></i>Saved successfully</span>}
                    </div>
                </div>
            </form>

            <div className="bg-white border border-gray-200 p-8 rounded-xl">
                <h2 className="text-xl font-bold mb-2">Certifications & Badges</h2>
                <p className="text-gray-500 mb-6 text-sm">Upload ISO or registration badges to display in the footer.</p>
                <p className="text-gray-500 text-sm italic">Badge upload requires S3 configuration — coming in Phase 2.</p>
            </div>
        </div>
    );
}
