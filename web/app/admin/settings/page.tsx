"use client";
import { useState, useEffect } from "react";

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>({});
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [formData, setFormData] = useState({ address: "", contact_email: "", contact_phone: "", section_toggles: {} as any });
    const [promoData, setPromoData] = useState({ title: "", button_text: "", button_link: "", price_text: "", subtext: "", is_active: false });
    const [savingPromo, setSavingPromo] = useState(false);
    const [savedPromo, setSavedPromo] = useState(false);

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(`${API}/api/admin/site_settings`, { headers: { "Authorization": `Bearer ${token()}` } })
            .then(res => res.json())
            .then(data => {
                setSettings(data);
                let toggles = {};
                try { toggles = typeof data.section_toggles === 'string' ? JSON.parse(data.section_toggles) : (data.section_toggles || {}); } catch(e) {}
                setFormData({ 
                    address: data.address ?? "", 
                    contact_email: data.contact_email ?? "", 
                    contact_phone: data.contact_phone ?? "",
                    section_toggles: toggles
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
                            { key: 'show_students_from', label: 'Students From' }
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
                            const val = formData.section_toggles[section.key];
                            const status = typeof val === 'boolean' ? (val ? 'live' : 'disabled') : (val || 'live');
                            return (
                                <div key={section.key} className="flex flex-col gap-2 p-4 border border-gray-100 rounded bg-gray-50">
                                    <span className="text-gray-700 font-medium">{section.label}</span>
                                    <select
                                        value={status}
                                        onChange={e => setFormData({
                                            ...formData, 
                                            section_toggles: { ...formData.section_toggles, [section.key]: e.target.value }
                                        })}
                                        className="w-full bg-white border border-gray-200 rounded px-3 py-2 text-sm text-gray-900 focus:outline-none focus:border-accent-blue"
                                    >
                                        <option value="live">Live</option>
                                        <option value="coming_soon">Coming Soon</option>
                                        <option value="upcoming">Upcoming</option>
                                        <option value="disabled">Disabled (Hidden)</option>
                                    </select>
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

            <div className="bg-white border border-gray-200 p-8 rounded-xl">
                <h2 className="text-xl font-bold mb-2">Certifications & Badges</h2>
                <p className="text-gray-500 mb-6 text-sm">Upload ISO or registration badges to display in the footer.</p>
                <p className="text-gray-500 text-sm italic">Badge upload requires S3 configuration — coming in Phase 2.</p>
            </div>
        </div>
    );
}
