"use client";
import { useState, useEffect } from "react";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";

// ── Types ────────────────────────────────────────────────────────────────────

interface ProfileLink {
    id: string;
    label: string;
    sublabel: string;
    url: string;
    icon: string;
    style: "primary" | "glass";
    color: string;
    display_order: number;
    is_active: boolean;
}

interface GauravProfileData {
    id: string;
    name: string;
    tagline: string;
    photo_url?: string;
    org: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    vcard_filename: string;
    ecosystem_links: ProfileLink[];
    founder_links: ProfileLink[];
    footer_brand_name: string;
    footer_tagline: string;
}

// ── Icon Preset ───────────────────────────────────────────────────────────────

const ICON_PRESETS = [
    { label: "Globe / Website", value: "fas fa-globe" },
    { label: "LinkedIn (Brand)", value: "fab fa-linkedin" },
    { label: "LinkedIn (In mark)", value: "fab fa-linkedin-in" },
    { label: "Instagram", value: "fab fa-instagram" },
    { label: "YouTube", value: "fab fa-youtube" },
    { label: "Twitter / X", value: "fab fa-x-twitter" },
    { label: "Facebook", value: "fab fa-facebook" },
    { label: "WhatsApp", value: "fab fa-whatsapp" },
    { label: "Phone", value: "fas fa-phone" },
    { label: "Envelope / Email", value: "fas fa-envelope" },
    { label: "Link (generic)", value: "fas fa-link" },
    { label: "Play / Video", value: "fas fa-play" },
    { label: "Calendar / Event", value: "fas fa-calendar-alt" },
    { label: "Rocket / Launch", value: "fas fa-rocket" },
    { label: "Star / Featured", value: "fas fa-star" },
];

const COLOR_OPTIONS = [
    { label: "Violet", value: "violet" },
    { label: "Blue", value: "blue" },
    { label: "Pink", value: "pink" },
    { label: "Red", value: "red" },
    { label: "Green", value: "green" },
    { label: "Amber", value: "amber" },
    { label: "White / Neutral", value: "white" },
    { label: "Indigo", value: "indigo" },
];

// ── Default empty link ────────────────────────────────────────────────────────

function emptyLink(): Omit<ProfileLink, "id"> {
    return {
        label: "",
        sublabel: "",
        url: "",
        icon: "fas fa-globe",
        style: "glass",
        color: "blue",
        display_order: 0,
        is_active: true,
    };
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function AdminGauravProfile() {
    const [profile, setProfile] = useState<GauravProfileData | null>(null);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

    // Profile form
    const [profileForm, setProfileForm] = useState({
        name: "", tagline: "", org: "", title: "", phone: "",
        email: "", website: "", address: "", vcard_filename: "",
        footer_brand_name: "", footer_tagline: "",
    });

    // Photo
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string>("");

    // Link editing
    const [linkModal, setLinkModal] = useState<{ section: "ecosystem" | "founder"; idx: number | null } | null>(null);
    const [linkForm, setLinkForm] = useState<Omit<ProfileLink, "id">>(emptyLink());

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL;

    // ── Fetch ───────────────────────────────────────────────────────────────

    const fetchProfile = async () => {
        try {
            const res = await fetch(`${API}/api/admin/gaurav-profile`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            const data = await res.json();
            setProfile(data);
            setProfileForm({
                name: data.name ?? "",
                tagline: data.tagline ?? "",
                org: data.org ?? "",
                title: data.title ?? "",
                phone: data.phone ?? "",
                email: data.email ?? "",
                website: data.website ?? "",
                address: data.address ?? "",
                vcard_filename: data.vcard_filename ?? "",
                footer_brand_name: data.footer_brand_name ?? "",
                footer_tagline: data.footer_tagline ?? "",
            });
            setPhotoPreview(data.photo_url ?? "");
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { fetchProfile(); }, []);

    // ── Save profile scalars ────────────────────────────────────────────────

    const saveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);
        try {
            let photoUrl = profile?.photo_url ?? "";

            // Upload photo if a new one was cropped
            if (photoFile) {
                const fd = new FormData();
                fd.append("file", photoFile);
                const upRes = await fetch(`${API}/api/admin/upload`, {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token()}` },
                    body: fd,
                }).then(r => r.json());
                if (upRes.url) photoUrl = upRes.url;
            }

            await fetch(`${API}/api/admin/gaurav-profile`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
                body: JSON.stringify({ ...profileForm, photo_url: photoUrl }),
            });

            setMsg({ text: "Profile saved successfully!", ok: true });
            setPhotoFile(null);
            fetchProfile();
        } catch {
            setMsg({ text: "Error saving profile.", ok: false });
        } finally {
            setSaving(false);
        }
    };

    // ── Photo crop helpers ───────────────────────────────────────────────────

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const reader = new FileReader();
            reader.addEventListener("load", () => setImageSrc(reader.result as string));
            reader.readAsDataURL(e.target.files[0]);
        }
        e.target.value = "";
    };

    // ── Link CRUD ────────────────────────────────────────────────────────────

    const openAddLink = (section: "ecosystem" | "founder") => {
        setLinkForm(emptyLink());
        setLinkModal({ section, idx: null });
    };

    const openEditLink = (section: "ecosystem" | "founder", idx: number) => {
        const links = section === "ecosystem" ? profile!.ecosystem_links : profile!.founder_links;
        const link = links[idx];
        setLinkForm({ ...link });
        setLinkModal({ section, idx });
    };

    const saveLink = async () => {
        if (!profile || !linkModal) return;
        const { section, idx } = linkModal;
        const field = section === "ecosystem" ? "ecosystem_links" : "founder_links";
        const links = [...(profile[field] ?? [])];

        if (idx === null) {
            // Add new
            const res = await fetch(`${API}/api/admin/gaurav-profile/links/${section}`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
                body: JSON.stringify(linkForm),
            });
            if (res.ok) { fetchProfile(); setLinkModal(null); }
        } else {
            // Edit existing
            const linkId = links[idx].id;
            const res = await fetch(`${API}/api/admin/gaurav-profile/links/${section}/${linkId}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
                body: JSON.stringify(linkForm),
            });
            if (res.ok) { fetchProfile(); setLinkModal(null); }
        }
    };

    const deleteLink = async (section: "ecosystem" | "founder", idx: number) => {
        if (!profile) return;
        if (!confirm("Delete this link?")) return;
        const field = section === "ecosystem" ? "ecosystem_links" : "founder_links";
        const links = profile[field];
        const linkId = links[idx].id;
        await fetch(`${API}/api/admin/gaurav-profile/links/${section}/${linkId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token()}` },
        });
        fetchProfile();
    };

    const toggleLinkActive = async (section: "ecosystem" | "founder", idx: number) => {
        if (!profile) return;
        const field = section === "ecosystem" ? "ecosystem_links" : "founder_links";
        const links = [...profile[field]];
        const link = links[idx];
        await fetch(`${API}/api/admin/gaurav-profile/links/${section}/${link.id}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !link.is_active }),
        });
        fetchProfile();
    };

    const moveLink = async (section: "ecosystem" | "founder", idx: number, dir: -1 | 1) => {
        if (!profile) return;
        const field = section === "ecosystem" ? "ecosystem_links" : "founder_links";
        const links = [...profile[field]];
        const newIdx = idx + dir;
        if (newIdx < 0 || newIdx >= links.length) return;
        [links[idx], links[newIdx]] = [links[newIdx], links[idx]];
        const reordered = links.map((l, i) => ({ ...l, display_order: i }));
        await fetch(`${API}/api/admin/gaurav-profile/links/${section}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token()}`, "Content-Type": "application/json" },
            body: JSON.stringify({ links: reordered }),
        });
        fetchProfile();
    };

    // ── Link Section Table ───────────────────────────────────────────────────

    const renderLinkSection = (section: "ecosystem" | "founder", title: string) => {
        const links = section === "ecosystem" ? profile?.ecosystem_links ?? [] : profile?.founder_links ?? [];
        const sorted = [...links].sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0));

        return (
            <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{title} Links</h2>
                    <button
                        onClick={() => openAddLink(section)}
                        className="bg-white text-black font-bold px-4 py-2 rounded hover:bg-gray-200 text-sm"
                    >
                        + Add Link
                    </button>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-sm">
                            <tr>
                                <th className="p-4 font-normal">Order</th>
                                <th className="p-4 font-normal">Icon</th>
                                <th className="p-4 font-normal">Label</th>
                                <th className="p-4 font-normal">URL</th>
                                <th className="p-4 font-normal">Style</th>
                                <th className="p-4 font-normal">Status</th>
                                <th className="p-4 font-normal text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sorted.length === 0 ? (
                                <tr><td colSpan={7} className="p-8 text-center text-gray-400">No links yet</td></tr>
                            ) : (
                                sorted.map((link, idx) => (
                                    <tr key={link.id} className="border-b border-gray-100 last:border-0">
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <button onClick={() => moveLink(section, idx, -1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs" disabled={idx === 0}>▲</button>
                                                <button onClick={() => moveLink(section, idx, 1)} className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs" disabled={idx === sorted.length - 1}>▼</button>
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-600 text-lg"><i className={link.icon}></i></td>
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{link.label}</div>
                                            {link.sublabel && <div className="text-xs text-gray-400">{link.sublabel}</div>}
                                        </td>
                                        <td className="p-4 text-xs text-gray-400 max-w-[160px] truncate">{link.url}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded font-bold ${link.style === 'primary' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'}`}>
                                                {link.style}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleLinkActive(section, idx)}
                                                className={`text-xs px-2 py-1 rounded ${link.is_active ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 bg-gray-50 hover:bg-gray-100'}`}
                                            >
                                                {link.is_active ? "Active" : "Hidden"}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right flex gap-2 justify-end">
                                            <button onClick={() => openEditLink(section, idx)} className="text-blue-500 hover:underline text-sm">Edit</button>
                                            <button onClick={() => deleteLink(section, idx)} className="text-red-400 hover:underline text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    // ── Render ───────────────────────────────────────────────────────────────

    if (!profile) {
        return <div className="p-8 text-gray-500">Loading profile data…</div>;
    }

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Gaurav Profile</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage content for <code className="bg-gray-100 px-1 rounded text-xs">/gauravbansal</code></p>
                </div>
                <a
                    href="/gauravbansal"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                >
                    <i className="fas fa-external-link-alt text-xs"></i> View Live Page
                </a>
            </div>

            {msg && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${msg.ok ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {msg.text}
                </div>
            )}

            {/* ── Profile Scalars Form ─────────────────────────────────────────────── */}
            <form onSubmit={saveProfile}>
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-10">
                    <h2 className="text-xl font-bold mb-6">Profile Details</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Photo */}
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-500 mb-1">Profile Photo</label>
                            <div className="flex items-center gap-6">
                                {photoPreview ? (
                                    <img src={photoPreview} alt="Profile" className="w-20 h-20 rounded-full object-cover border border-gray-200" />
                                ) : (
                                    <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <i className="fas fa-user text-2xl"></i>
                                    </div>
                                )}
                                <div>
                                    <input type="file" accept="image/*" onChange={handlePhotoChange} className="text-sm text-gray-700" />
                                    {photoFile && <p className="text-xs text-green-600 mt-1">New photo ready to upload.</p>}
                                    <p className="text-xs text-gray-400 mt-1">Will be displayed as a circle. Will be cropped to 1:1.</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Full Name *</label>
                            <input required value={profileForm.name} onChange={e => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm text-gray-500 mb-1">Tagline / Quote *</label>
                            <textarea required rows={2} value={profileForm.tagline} onChange={e => setProfileForm({ ...profileForm, tagline: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400 resize-none" />
                        </div>

                        {/* VCard section */}
                        <div className="md:col-span-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Contact / VCard</p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Organisation</label>
                            <input value={profileForm.org} onChange={e => setProfileForm({ ...profileForm, org: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Job Title</label>
                            <input value={profileForm.title} onChange={e => setProfileForm({ ...profileForm, title: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Phone</label>
                            <input value={profileForm.phone} onChange={e => setProfileForm({ ...profileForm, phone: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Email</label>
                            <input type="email" value={profileForm.email} onChange={e => setProfileForm({ ...profileForm, email: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Website URL</label>
                            <input value={profileForm.website} onChange={e => setProfileForm({ ...profileForm, website: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Address</label>
                            <input value={profileForm.address} onChange={e => setProfileForm({ ...profileForm, address: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">VCard Download Filename (no .vcf)</label>
                            <input value={profileForm.vcard_filename} onChange={e => setProfileForm({ ...profileForm, vcard_filename: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>

                        {/* Footer branding */}
                        <div className="md:col-span-2 pt-2 border-t border-gray-100">
                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold mb-4">Footer Branding</p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Brand Name (shown at bottom)</label>
                            <input value={profileForm.footer_brand_name} onChange={e => setProfileForm({ ...profileForm, footer_brand_name: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-500 mb-1">Brand Tagline</label>
                            <input value={profileForm.footer_tagline} onChange={e => setProfileForm({ ...profileForm, footer_tagline: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                        </div>
                    </div>

                    <div className="flex justify-end mt-8">
                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-black text-white font-bold px-8 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
                        >
                            {saving ? "Saving…" : "Save Profile"}
                        </button>
                    </div>
                </div>
            </form>

            {/* ── Link Sections ────────────────────────────────────────────────────── */}
            {renderLinkSection("ecosystem", "Ecosystem")}
            {renderLinkSection("founder", "Founder")}

            {/* ── Link Modal ───────────────────────────────────────────────────────── */}
            {linkModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
                    <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
                        <h2 className="text-2xl font-bold mb-6">
                            {linkModal.idx === null ? "Add Link" : "Edit Link"}
                        </h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Label *</label>
                                <input required value={linkForm.label} onChange={e => setLinkForm({ ...linkForm, label: e.target.value })} placeholder="Visit Website" className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Sub-label <span className="text-gray-400">(optional, shown smaller below label)</span></label>
                                <input value={linkForm.sublabel} onChange={e => setLinkForm({ ...linkForm, sublabel: e.target.value })} placeholder="setustartupschool.com" className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">URL *</label>
                                <input required value={linkForm.url} onChange={e => setLinkForm({ ...linkForm, url: e.target.value })} placeholder="https://..." className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500 mb-1">Icon</label>
                                <select value={linkForm.icon} onChange={e => setLinkForm({ ...linkForm, icon: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400">
                                    {ICON_PRESETS.map(ic => (
                                        <option key={ic.value} value={ic.value}>{ic.label} ({ic.value})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Style</label>
                                    <select value={linkForm.style} onChange={e => setLinkForm({ ...linkForm, style: e.target.value as "primary" | "glass" })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400">
                                        <option value="glass">Glass (subtle card)</option>
                                        <option value="primary">Primary (gradient CTA)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-500 mb-1">Icon Colour</label>
                                    <select value={linkForm.color} onChange={e => setLinkForm({ ...linkForm, color: e.target.value })} className="w-full border border-gray-200 rounded px-3 py-2 text-gray-900 focus:outline-none focus:border-blue-400">
                                        {COLOR_OPTIONS.map(c => (
                                            <option key={c.value} value={c.value}>{c.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={linkForm.is_active} onChange={e => setLinkForm({ ...linkForm, is_active: e.target.checked })} className="w-4 h-4" />
                                <span className="text-sm text-gray-500">Active (visible on public page)</span>
                            </label>
                        </div>

                        <div className="flex gap-3 justify-end pt-6">
                            <button type="button" onClick={() => setLinkModal(null)} className="border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50">Cancel</button>
                            <button type="button" onClick={saveLink} className="bg-black text-white font-bold px-6 py-2 rounded hover:bg-gray-800">Save Link</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Image Cropper ────────────────────────────────────────────────────── */}
            {imageSrc && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    aspect={1}
                    onCropComplete={(croppedFile) => { setPhotoFile(croppedFile); setPhotoPreview(URL.createObjectURL(croppedFile)); setImageSrc(null); }}
                    onCancel={() => setImageSrc(null)}
                />
            )}
        </div>
    );
}
