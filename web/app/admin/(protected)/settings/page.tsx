"use client";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ address: "", contact_email: "", contact_phone: "", section_toggles: {} as any, section_headings: {} as any });
    const [promoData, setPromoData] = useState({ title: "", button_text: "", button_link: "", price_text: "", subtext: "", is_active: false });
    const [savingPromo, setSavingPromo] = useState(false);
    const [savedPromo, setSavedPromo] = useState(false);

    // Admin account management state
    const [myInfo, setMyInfo] = useState<any>(null);
    const [adminList, setAdminList] = useState<any[]>([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newAdmin, setNewAdmin] = useState({ email: "", name: "", password: "" });
    const [creatingAdmin, setCreatingAdmin] = useState(false);
    const [showNewAdminPw, setShowNewAdminPw] = useState(false);

    // Password change state
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
    const [changingPw, setChangingPw] = useState(false);
    const [pwMsg, setPwMsg] = useState<{ type: string; text: string } | null>(null);
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);

    // Reset secondary admin password state
    const [resetTarget, setResetTarget] = useState<any>(null);
    const [resetPw, setResetPw] = useState("");
    const [showResetPw, setShowResetPw] = useState(false);
    const [resettingPw, setResettingPw] = useState(false);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API}/api/admin/site_settings`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                let toggles = {};
                let headings = {};
                try { toggles = typeof data.section_toggles === 'string' ? JSON.parse(data.section_toggles) : (data.section_toggles || {}); } catch(e) {}
                try { headings = typeof data.section_headings === 'string' ? JSON.parse(data.section_headings) : (data.section_headings || {}); } catch(e) {}
                setFormData({ 
                    address: data.address ?? "", 
                    contact_email: data.contact_email ?? "", 
                    contact_phone: data.contact_phone ?? "",
                    section_toggles: toggles,
                    section_headings: headings
                });
            })
            .catch(console.error);

        fetch(`${API}/api/promo-bar`)
            .then(res => res.json())
            .then(data => {
                if (data) {
                    setPromoData({
                        title: data.title ?? "",
                        button_text: data.button_text ?? "",
                        button_link: data.button_link ?? "",
                        price_text: data.price_text ?? "",
                        subtext: data.subtext ?? "",
                        is_active: data.is_active ?? false
                    });
                }
            })
            .catch(console.error);

        // Fetch current admin info
        fetch(`${API}/api/admin/me`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                setMyInfo(data);
                // If primary, also fetch admin list
                if (data.admin_type === 'primary') {
                    fetchAdminList();
                }
            }).catch(console.error);
    }, []);

    const fetchAdminList = () => {
        fetch(`${API}/api/admin/admins`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => { if (Array.isArray(data)) setAdminList(data); })
            .catch(console.error);
    };

    const handleCreateAdmin = async () => {
        if (!newAdmin.email || !newAdmin.password) return alert('Email and password are required');
        if (newAdmin.password.length < 6) return alert('Password must be at least 6 characters');
        setCreatingAdmin(true);
        try {
            const res = await fetch(`${API}/api/admin/admins`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify(newAdmin)
            });
            const data = await res.json();
            if (res.ok) {
                setShowCreateModal(false);
                setNewAdmin({ email: '', name: '', password: '' });
                fetchAdminList();
            } else {
                alert(data.error || 'Failed to create admin');
            }
        } catch (e) { alert('Failed to create admin'); }
        setCreatingAdmin(false);
    };

    const handleDeleteAdmin = async (id: string, email: string) => {
        if (!confirm(`Are you sure you want to delete admin "${email}"? This cannot be undone.`)) return;
        try {
            const res = await fetch(`${API}/api/admin/admins/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token()}` }
            });
            if (res.ok) fetchAdminList();
            else { const d = await res.json(); alert(d.error || 'Failed to delete'); }
        } catch (e) { alert('Failed to delete admin'); }
    };

    const handleChangeMyPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPwMsg(null);
        if (pwForm.newPassword !== pwForm.confirmPassword) return setPwMsg({ type: 'error', text: 'Passwords do not match' });
        if (pwForm.newPassword.length < 6) return setPwMsg({ type: 'error', text: 'Password must be at least 6 characters' });
        setChangingPw(true);
        try {
            const res = await fetch(`${API}/api/admin/admins/${myInfo.id}/reset-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword })
            });
            const data = await res.json();
            if (res.ok) {
                setPwMsg({ type: 'success', text: 'Password changed successfully!' });
                setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                setPwMsg({ type: 'error', text: data.error || 'Failed to change password' });
            }
        } catch (e) { setPwMsg({ type: 'error', text: 'Server error' }); }
        setChangingPw(false);
    };

    const handleResetSecondaryPw = async () => {
        if (!resetPw || resetPw.length < 6) return alert('Password must be at least 6 characters');
        setResettingPw(true);
        try {
            const res = await fetch(`${API}/api/admin/admins/${resetTarget.id}/reset-password`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token()}` },
                body: JSON.stringify({ newPassword: resetPw })
            });
            const data = await res.json();
            if (res.ok) {
                setResetTarget(null);
                setResetPw('');
                alert('Password reset successfully!');
            } else {
                alert(data.error || 'Failed to reset password');
            }
        } catch (e) { alert('Failed to reset password'); }
        setResettingPw(false);
    };

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

    const handleSavePromo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingPromo(true);
        try {
            await fetch(`${API}/api/admin/promo_bar`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token()}` },
                body: JSON.stringify(promoData)
            });
            setSavedPromo(true);
            setTimeout(() => setSavedPromo(false), 3000);
        } finally { setSavingPromo(false); }
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
                                placeholder="info@setustartupschool.com"
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
                        <button type="submit" disabled={saving} className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 mt-4 border border-gray-200">
                            {saving ? 'Saving...' : 'Save Settings'}
                        </button>
                        {saved && <span className="text-green-500 text-sm mt-4 font-semibold"><i className="fas fa-check mr-1"></i>Saved successfully</span>}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8 space-y-6">
                    <h2 className="text-xl font-bold border-b border-gray-200 pb-4">Section Visibility (Homepage)</h2>
                    <p className="text-sm text-gray-500 mb-4">Turn off any section to hide it from the main website.</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'show_pinned_event', label: 'Pinned Event / Workshop Preview' },
                            { key: 'show_mentors', label: 'Mentors Preview' },
                            { key: 'show_tools', label: 'Tools Showcase' },
                            { key: 'show_founder_manifesto', label: 'Founder Manifesto' },
                            { key: 'show_programs', label: 'Programs Launching Soon' },
                            { key: 'show_video_gallery', label: 'Video & Gallery' },
                            { key: 'show_past_events', label: 'Events Gallery' },
                            { key: 'show_community_gallery', label: 'Community Gallery' },
                            { key: 'show_startups', label: 'Startups Mentored' },
                            { key: 'show_testimonials', label: 'Testimonials' },
                            { key: 'show_partners', label: 'Ecosystem Partners' },
                            { key: 'show_students_from', label: 'Students From' },
                            { key: 'show_certifications', label: 'Certifications' }
                        ].map((section) => (
                            <label key={section.key} className="flex items-center justify-between p-4 border border-gray-100 rounded bg-gray-50 cursor-pointer">
                                <span className="text-gray-700 font-medium">{section.label}</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={formData.section_toggles[section.key] !== false} 
                                        onChange={e => setFormData({
                                            ...formData, 
                                            section_toggles: { ...formData.section_toggles, [section.key]: e.target.checked }
                                        })} 
                                    />
                                    <div className={`block w-12 h-6 rounded-full transition-colors ${formData.section_toggles[section.key] !== false ? 'bg-accent-blue' : 'bg-gray-300'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.section_toggles[section.key] !== false ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        ))}
                    </div>

                    <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mt-8 mb-4 text-gray-800">Individual Tool Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'tool_grants', label: 'Government Grants' },
                            { key: 'tool_pitch_decks', label: 'Pitch Deck Library' },
                            { key: 'tool_calendar', label: 'Events Calendar' },
                            { key: 'tool_incubators', label: 'Incubators & Accelerators' },
                            { key: 'tool_investors', label: 'Investor Database' }
                        ].map((section) => {
                            let currentVal = 'live';
                            const val = formData.section_toggles[section.key];
                            if (typeof val === 'boolean') {
                                currentVal = val ? 'live' : 'disabled';
                            } else if (typeof val === 'string') {
                                currentVal = val;
                            }
                            
                            const isVisible = currentVal !== 'disabled' && currentVal !== 'disabled_live' && currentVal !== 'disabled_upcoming' && currentVal !== false;
                            const isLive = currentVal === 'live' || currentVal === 'disabled_live' || currentVal === true || currentVal === 'disabled';

                            const handleVisibilityChange = (checked: boolean) => {
                                const newVal = checked ? (isLive ? 'live' : 'upcoming') : (isLive ? 'disabled_live' : 'disabled_upcoming');
                                setFormData({ ...formData, section_toggles: { ...formData.section_toggles, [section.key]: newVal } });
                            };

                            const handleStatusChange = (statusStr: string) => {
                                const liveChecked = statusStr === 'live';
                                const newVal = isVisible ? (liveChecked ? 'live' : 'upcoming') : (liveChecked ? 'disabled_live' : 'disabled_upcoming');
                                setFormData({ ...formData, section_toggles: { ...formData.section_toggles, [section.key]: newVal } });
                            };

                            return (
                                <div key={section.key} className="flex flex-col gap-3 p-4 border border-gray-100 rounded bg-gray-50">
                                    <span className="text-gray-700 font-medium">{section.label}</span>
                                    <div className="flex items-center gap-4 bg-white px-3 py-2 rounded-lg border border-gray-200 shadow-sm w-full">
                                        <label className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                                            <span className="text-xs font-bold text-gray-600 mr-2">Visible</span>
                                            <div className="relative">
                                                <input type="checkbox" className="sr-only" checked={isVisible} onChange={e => handleVisibilityChange(e.target.checked)} />
                                                <div className={`block w-8 h-5 rounded-full transition-colors ${isVisible ? 'bg-accent-blue' : 'bg-gray-300'}`}></div>
                                                <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isVisible ? 'transform translate-x-3' : ''}`}></div>
                                            </div>
                                        </label>
                                        <div className="w-px h-5 bg-gray-200"></div>
                                        <div className="flex flex-1 items-center gap-2">
                                            <span className="text-xs font-bold text-gray-600">Status:</span>
                                            <select 
                                                value={isLive ? 'live' : 'upcoming'}
                                                onChange={e => handleStatusChange(e.target.value)}
                                                className="bg-gray-50 border border-gray-200 text-xs rounded focus:ring-accent-blue focus:border-accent-blue block w-full p-1 font-semibold text-gray-700 outline-none"
                                            >
                                                <option value="live">Live</option>
                                                <option value="upcoming">Upcoming</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <h3 className="text-lg font-bold border-b border-gray-100 pb-2 mt-8 mb-4 text-gray-800">Testimonial Types Visibility</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'testi_video', label: 'Video Testimonials' },
                            { key: 'testi_text', label: 'Text Testimonials' }
                        ].map((section) => (
                            <label key={section.key} className="flex items-center justify-between p-4 border border-gray-100 rounded bg-gray-50 cursor-pointer">
                                <span className="text-gray-700 font-medium">{section.label}</span>
                                <div className="relative">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only" 
                                        checked={formData.section_toggles[section.key] !== false} 
                                        onChange={e => setFormData({
                                            ...formData, 
                                            section_toggles: { ...formData.section_toggles, [section.key]: e.target.checked }
                                        })} 
                                    />
                                    <div className={`block w-12 h-6 rounded-full transition-colors ${formData.section_toggles[section.key] !== false ? 'bg-accent-blue' : 'bg-gray-300'}`}></div>
                                    <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.section_toggles[section.key] !== false ? 'transform translate-x-6' : ''}`}></div>
                                </div>
                            </label>
                        ))}
                    </div>


                    <div className="flex items-center gap-4 mt-6">
                        <button type="submit" disabled={saving} className="bg-accent-blue text-white font-bold px-6 py-3 rounded hover:bg-[#6D28D9] transition-colors disabled:opacity-50">
                            {saving ? 'Saving...' : 'Save Visibility Settings'}
                        </button>
                        {saved && <span className="text-green-500 text-sm font-semibold"><i className="fas fa-check mr-1"></i>Saved successfully</span>}
                    </div>
                </div>
            </form>

            <form onSubmit={handleSavePromo}>
                <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8 space-y-6">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-bold">Promo Bar Settings</h2>
                        <label className="flex items-center cursor-pointer">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={promoData.is_active} onChange={e => setPromoData({...promoData, is_active: e.target.checked})} />
                                <div className={`block w-14 h-8 rounded-full transition-colors ${promoData.is_active ? 'bg-accent-blue' : 'bg-gray-300'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${promoData.is_active ? 'transform translate-x-6' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-gray-700 font-medium">
                                Active
                            </div>
                        </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-500 mb-2">Title</label>
                            <input type="text" value={promoData.title} onChange={e => setPromoData({...promoData, title: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. 2 Day Gen-AI Mastermind" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Button Text</label>
                            <input type="text" value={promoData.button_text} onChange={e => setPromoData({...promoData, button_text: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. Join the free Mastermind" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Button Link</label>
                            <input type="text" value={promoData.button_link} onChange={e => setPromoData({...promoData, button_link: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. /events or https://..." />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Price Text</label>
                            <input type="text" value={promoData.price_text} onChange={e => setPromoData({...promoData, price_text: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. ₹24,999 Free" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-2">Subtext</label>
                            <input type="text" value={promoData.subtext} onChange={e => setPromoData({...promoData, subtext: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="e.g. Offer expires in 04:53" />
                        </div>
                    </div>

                    <div className="flex items-center gap-4 pt-2">
                        <button type="submit" disabled={savingPromo} className="bg-white text-black font-bold px-6 py-3 rounded hover:bg-gray-200 disabled:opacity-50 mt-2">
                            {savingPromo ? 'Saving...' : 'Save Promo Bar'}
                        </button>
                        {savedPromo && <span className="text-green-400 text-sm mt-2"><i className="fas fa-check mr-1"></i>Saved successfully</span>}
                    </div>
                </div>
            </form>

            <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8">
                <h2 className="text-xl font-bold mb-2">Certifications & Badges</h2>
                <p className="text-gray-500 mb-6 text-sm">Upload ISO or registration badges to display in the footer.</p>
                <p className="text-gray-500 text-sm italic">Badge upload requires S3 configuration — coming in Phase 2.</p>
            </div>

            {/* MY ACCOUNT SECTION */}
            {myInfo && (
                <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-bold">My Account</h2>
                        <span className={`text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full ${myInfo.admin_type === 'primary' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {myInfo.admin_type === 'primary' ? '👑 Primary Admin' : '👤 Secondary Admin'}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div><span className="text-gray-500">Email:</span> <span className="font-semibold text-gray-900 ml-2">{myInfo.email}</span></div>
                        <div><span className="text-gray-500">Name:</span> <span className="font-semibold text-gray-900 ml-2">{myInfo.name || '—'}</span></div>
                    </div>

                    <h3 className="text-lg font-bold border-t border-gray-100 pt-6 mt-4">Change My Password</h3>
                    <form onSubmit={handleChangeMyPassword} className="space-y-4 max-w-md">
                        <div className="relative">
                            <label className="block text-sm text-gray-500 mb-1">Current Password</label>
                            <div className="relative">
                                <input type={showCurrentPw ? 'text' : 'password'} value={pwForm.currentPassword} onChange={e => setPwForm({...pwForm, currentPassword: e.target.value})} required className="w-full bg-white border border-gray-200 rounded px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:border-accent-blue" />
                                <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i className={`fas ${showCurrentPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-sm text-gray-500 mb-1">New Password</label>
                            <div className="relative">
                                <input type={showNewPw ? 'text' : 'password'} value={pwForm.newPassword} onChange={e => setPwForm({...pwForm, newPassword: e.target.value})} required minLength={6} className="w-full bg-white border border-gray-200 rounded px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:border-accent-blue" />
                                <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    <i className={`fas ${showNewPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Confirm New Password</label>
                            <input type={showNewPw ? 'text' : 'password'} value={pwForm.confirmPassword} onChange={e => setPwForm({...pwForm, confirmPassword: e.target.value})} required minLength={6} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" />
                        </div>
                        {pwMsg && (
                            <div className={`text-sm font-semibold ${pwMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                                <i className={`fas ${pwMsg.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-1`}></i>
                                {pwMsg.text}
                            </div>
                        )}
                        <button type="submit" disabled={changingPw} className="bg-accent-blue text-white font-bold px-6 py-3 rounded hover:bg-[#6D28D9] transition-colors disabled:opacity-50">
                            {changingPw ? 'Changing...' : 'Change Password'}
                        </button>
                    </form>
                </div>
            )}

            {/* MANAGE ADMIN ACCOUNTS (PRIMARY ONLY) */}
            {myInfo?.admin_type === 'primary' && (
                <div className="bg-white border border-gray-200 p-8 rounded-xl mb-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-bold">Manage Admin Accounts</h2>
                        <button onClick={() => setShowCreateModal(true)} className="bg-accent-blue text-white font-bold px-4 py-2 rounded hover:bg-[#6D28D9] transition-colors text-sm">
                            <i className="fas fa-plus mr-2"></i>Create Admin
                        </button>
                    </div>
                    <p className="text-sm text-gray-500">Secondary admins use your MFA authenticator code to log in. You control access by sharing or withholding the 6-digit OTP.</p>

                    {adminList.length === 0 ? (
                        <p className="text-gray-400 text-sm italic">No admin accounts found.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-200 text-left text-gray-500">
                                        <th className="pb-3 font-semibold">Name</th>
                                        <th className="pb-3 font-semibold">Email</th>
                                        <th className="pb-3 font-semibold">Type</th>
                                        <th className="pb-3 font-semibold">Created</th>
                                        <th className="pb-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {adminList.map(admin => (
                                        <tr key={admin.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                            <td className="py-3 font-medium text-gray-900">{admin.name || '—'}</td>
                                            <td className="py-3 text-gray-700">{admin.email}</td>
                                            <td className="py-3">
                                                <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-1 rounded-full ${admin.admin_type === 'primary' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {admin.admin_type || 'primary'}
                                                </span>
                                            </td>
                                            <td className="py-3 text-gray-500">{new Date(admin.created_at).toLocaleDateString()}</td>
                                            <td className="py-3 text-right">
                                                {admin.admin_type === 'secondary' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <button onClick={() => { setResetTarget(admin); setResetPw(''); setShowResetPw(false); }} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded transition-colors">
                                                            <i className="fas fa-key mr-1"></i>Reset Password
                                                        </button>
                                                        <button onClick={() => handleDeleteAdmin(admin.id, admin.email)} className="text-xs bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded transition-colors">
                                                            <i className="fas fa-trash mr-1"></i>Delete
                                                        </button>
                                                    </div>
                                                )}
                                                {admin.admin_type === 'primary' && (
                                                    <span className="text-xs text-gray-400 italic">Protected</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* CREATE ADMIN MODAL */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">Create Secondary Admin</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Name</label>
                                <input type="text" value={newAdmin.name} onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="Employee name" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Email *</label>
                                <input type="email" value={newAdmin.email} onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} required className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="employee@company.com" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Password *</label>
                                <div className="relative">
                                    <input type={showNewAdminPw ? 'text' : 'password'} value={newAdmin.password} onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} required minLength={6} className="w-full bg-white border border-gray-200 rounded px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="Min 6 characters" />
                                    <button type="button" onClick={() => setShowNewAdminPw(!showNewAdminPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showNewAdminPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button onClick={() => setShowCreateModal(false)} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button onClick={handleCreateAdmin} disabled={creatingAdmin} className="bg-accent-blue text-white font-bold px-6 py-2 rounded hover:bg-[#6D28D9] disabled:opacity-50">
                                    {creatingAdmin ? 'Creating...' : 'Create Admin'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* RESET PASSWORD MODAL */}
            {resetTarget && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
                        <p className="text-gray-500 text-sm mb-6">Set a new password for <span className="font-bold text-gray-900">{resetTarget.email}</span></p>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">New Password</label>
                                <div className="relative">
                                    <input type={showResetPw ? 'text' : 'password'} value={resetPw} onChange={e => setResetPw(e.target.value)} minLength={6} className="w-full bg-white border border-gray-200 rounded px-4 py-3 pr-12 text-gray-900 focus:outline-none focus:border-accent-blue" placeholder="Min 6 characters" />
                                    <button type="button" onClick={() => setShowResetPw(!showResetPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        <i className={`fas ${showResetPw ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button onClick={() => setResetTarget(null)} className="border border-gray-300 text-gray-900 px-4 py-2 rounded hover:bg-gray-100">Cancel</button>
                                <button onClick={handleResetSecondaryPw} disabled={resettingPw} className="bg-accent-blue text-white font-bold px-6 py-2 rounded hover:bg-[#6D28D9] disabled:opacity-50">
                                    {resettingPw ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
