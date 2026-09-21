"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ color: [] }, { background: [] }],
        [{ list: "ordered" }, { list: "bullet" }],
        ["link", "clean"],
    ],
};

const DEFAULT_SOCIAL_COLORS: Record<string, string> = {
    LinkedIn: "text-[#0A66C2] bg-blue-50 border-blue-100 hover:bg-[#0A66C2] hover:text-white",
    Instagram: "text-[#E1306C] bg-pink-50 border-pink-100 hover:bg-[#E1306C] hover:text-white",
    YouTube: "text-[#FF0000] bg-red-50 border-red-100 hover:bg-[#FF0000] hover:text-white",
    "WhatsApp Community": "text-[#25D366] bg-emerald-50 border-emerald-100 hover:bg-[#25D366] hover:text-white",
    "Twitter / X": "text-slate-900 bg-slate-100 border-slate-200 hover:bg-black hover:text-white",
    Telegram: "text-[#229ED9] bg-sky-50 border-sky-100 hover:bg-[#229ED9] hover:text-white",
    Discord: "text-[#5865F2] bg-indigo-50 border-indigo-100 hover:bg-[#5865F2] hover:text-white",
};

interface SocialLinkItem {
    id: string;
    name: string;
    handle: string;
    url: string;
    icon: string;
    color?: string;
    badge: string;
    is_active: boolean;
    display_order?: number;
}

interface FaqItem {
    id: string;
    q: string;
    a: string;
    is_active: boolean;
    display_order?: number;
}

export default function AdminContactPageManager() {
    const [activeTab, setActiveTab] = useState<"hero" | "form" | "contact" | "social" | "founder" | "faqs">("hero");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Lead Sources for Dropdown
    const [leadSources, setLeadSources] = useState<{ id: string; label: string }[]>([]);

    // Form / CMS Data
    const [formData, setFormData] = useState({
        badge_text: "Get in Touch • We're Here For You",
        title: 'Connect with <span class="text-[#A855F7]">Setu Startup School</span>',
        description: "Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.",
        
        form_heading: "Send Us a Message",
        form_subheading: "Fill in the form below and our team will get back to you within 24 hours.",
        lead_source_tag: "contact_page",
        submit_btn_text: "Submit Inquiry",
        success_heading: "Message Sent Successfully!",
        success_message: "Thank you for reaching out! A member of the Setu Startup School team will connect with you shortly.",

        email: "info@setustartupschool.com",
        phone: "+91 92891 21121",
        address: "98-103, Aditya Industrial Estate, behind Evershine Mall, Chincholi Bunder, Malad West, Mumbai, Maharashtra 400064",
        chat_link: "https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4",

        social_links: [] as SocialLinkItem[],

        show_founder_card: true,
        founder_name: "Gaurav Bansal",
        founder_title: "Founder & Chief Mentor • Setu Startup School",
        founder_tag: "Founder Profile",
        founder_photo_url: "/gaurav.webp",
        founder_link: "/gauravbansal",

        show_faqs: true,
        faqs: [] as FaqItem[],
    });

    // Modals
    const [socialModalOpen, setSocialModalOpen] = useState(false);
    const [editingSocial, setEditingSocial] = useState<SocialLinkItem | null>(null);
    const [socialForm, setSocialForm] = useState<SocialLinkItem>({
        id: "",
        name: "",
        handle: "",
        url: "",
        icon: "fab fa-linkedin-in",
        badge: "Official Channel",
        is_active: true,
    });

    const [faqModalOpen, setFaqModalOpen] = useState(false);
    const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
    const [faqForm, setFaqForm] = useState<FaqItem>({
        id: "",
        q: "",
        a: "",
        is_active: true,
    });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch contact page content
            const res = await fetch(`${API}/api/admin/contact-page`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    badge_text: data.badge_text ?? "Get in Touch • We're Here For You",
                    title: data.title ?? 'Connect with <span class="text-[#A855F7]">Setu Startup School</span>',
                    description: data.description ?? "Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships?",
                    form_heading: data.form_heading ?? "Send Us a Message",
                    form_subheading: data.form_subheading ?? "Fill in the form below and our team will get back to you within 24 hours.",
                    lead_source_tag: data.lead_source_tag ?? "contact_page",
                    submit_btn_text: data.submit_btn_text ?? "Submit Inquiry",
                    success_heading: data.success_heading ?? "Message Sent Successfully!",
                    success_message: data.success_message ?? "Thank you for reaching out! A member of the Setu Startup School team will connect with you shortly.",
                    email: data.email ?? "info@setustartupschool.com",
                    phone: data.phone ?? "+91 92891 21121",
                    address: data.address ?? "98-103, Aditya Industrial Estate, behind Evershine Mall, Chincholi Bunder, Malad West, Mumbai, Maharashtra 400064",
                    chat_link: data.chat_link ?? "https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4",
                    social_links: Array.isArray(data.social_links) ? data.social_links : [],
                    show_founder_card: data.show_founder_card !== false,
                    founder_name: data.founder_name ?? "Gaurav Bansal",
                    founder_title: data.founder_title ?? "Founder & Chief Mentor • Setu Startup School",
                    founder_tag: data.founder_tag ?? "Founder Profile",
                    founder_photo_url: data.founder_photo_url ?? "/gaurav.webp",
                    founder_link: data.founder_link ?? "/gauravbansal",
                    show_faqs: data.show_faqs !== false,
                    faqs: Array.isArray(data.faqs) ? data.faqs : [],
                });
            }

            // Fetch lead sources
            const sourcesRes = await fetch(`${API}/api/lead-sources`);
            if (sourcesRes.ok) {
                const sourcesData = await sourcesRes.json();
                if (Array.isArray(sourcesData)) {
                    setLeadSources(sourcesData);
                }
            }
        } catch (err) {
            console.error("Failed to load contact settings:", err);
            setErrorMessage("Failed to load settings from server.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setSavedSuccess(false);
        setErrorMessage("");

        try {
            const res = await fetch(`${API}/api/admin/contact-page`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 3000);
            } else {
                const err = await res.json().catch(() => ({}));
                setErrorMessage(err.error || "Failed to save contact settings.");
            }
        } catch {
            setErrorMessage("Network error while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    // Social Links Operations
    const openAddSocial = () => {
        setEditingSocial(null);
        setSocialForm({
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            name: "",
            handle: "",
            url: "",
            icon: "fab fa-linkedin-in",
            color: DEFAULT_SOCIAL_COLORS["LinkedIn"],
            badge: "Official Channel",
            is_active: true,
            display_order: formData.social_links.length,
        });
        setSocialModalOpen(true);
    };

    const openEditSocial = (item: SocialLinkItem) => {
        setEditingSocial(item);
        setSocialForm({ ...item });
        setSocialModalOpen(true);
    };

    const handleSaveSocial = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: SocialLinkItem[];
        if (editingSocial) {
            updated = formData.social_links.map((s) => (s.id === editingSocial.id ? socialForm : s));
        } else {
            updated = [...formData.social_links, { ...socialForm, id: socialForm.id || String(Date.now()) }];
        }
        setFormData({ ...formData, social_links: updated });
        setSocialModalOpen(false);
    };

    const handleDeleteSocial = (id: string) => {
        if (!confirm("Are you sure you want to remove this social link?")) return;
        setFormData({
            ...formData,
            social_links: formData.social_links.filter((s) => s.id !== id),
        });
    };

    const handleToggleSocial = (id: string) => {
        setFormData({
            ...formData,
            social_links: formData.social_links.map((s) =>
                s.id === id ? { ...s, is_active: !s.is_active } : s
            ),
        });
    };

    // FAQ Operations
    const openAddFaq = () => {
        setEditingFaq(null);
        setFaqForm({
            id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            q: "",
            a: "",
            is_active: true,
            display_order: formData.faqs.length,
        });
        setFaqModalOpen(true);
    };

    const openEditFaq = (item: FaqItem) => {
        setEditingFaq(item);
        setFaqForm({ ...item });
        setFaqModalOpen(true);
    };

    const handleSaveFaq = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: FaqItem[];
        if (editingFaq) {
            updated = formData.faqs.map((f) => (f.id === editingFaq.id ? faqForm : f));
        } else {
            updated = [...formData.faqs, { ...faqForm, id: faqForm.id || String(Date.now()) }];
        }
        setFormData({ ...formData, faqs: updated });
        setFaqModalOpen(false);
    };

    const handleDeleteFaq = (id: string) => {
        if (!confirm("Delete this FAQ?")) return;
        setFormData({
            ...formData,
            faqs: formData.faqs.filter((f) => f.id !== id),
        });
    };

    const handleToggleFaq = (id: string) => {
        setFormData({
            ...formData,
            faqs: formData.faqs.map((f) =>
                f.id === id ? { ...f, is_active: !f.is_active } : f
            ),
        });
    };

    return (
        <div className="space-y-6">
            {/* Top Bar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Contact Us Page CMS</h1>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                            /contact
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Customize page title, rich text description, lead collection tag, contact details, social channels, and FAQs.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/contact"
                        target="_blank"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl transition-all flex items-center gap-1.5"
                    >
                        <i className="fas fa-external-link-alt text-xs"></i>
                        <span>Live Preview</span>
                    </Link>

                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i>
                                <span>Save All Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Notification Alerts */}
            {savedSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
                    <i className="fas fa-check-circle text-emerald-600 text-lg"></i>
                    <span>Contact page settings successfully saved and published!</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-semibold flex items-center gap-3 shadow-xs">
                    <i className="fas fa-exclamation-triangle text-red-600 text-lg"></i>
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {[
                    { key: "hero", label: "Hero & Description", icon: "fas fa-heading" },
                    { key: "form", label: "Form & Lead Tag", icon: "fas fa-envelope-open-text" },
                    { key: "contact", label: "Direct Reach & Address", icon: "fas fa-phone-alt" },
                    { key: "social", label: "Social & Chat Links", icon: "fas fa-share-alt" },
                    { key: "founder", label: "Founder Highlight", icon: "fas fa-user-tie" },
                    { key: "faqs", label: "FAQ Accordion", icon: "fas fa-question-circle" },
                ].map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as any)}
                        className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                            activeTab === tab.key
                                ? "bg-accent-blue text-white shadow-sm"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                        }`}
                    >
                        <i className={tab.icon}></i>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                    <i className="fas fa-spinner fa-spin text-2xl mb-2 text-accent-blue"></i>
                    <p className="font-semibold text-sm">Loading contact page settings...</p>
                </div>
            ) : (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                    {/* ── TAB 1: HERO & DESCRIPTION ─────────────────────────────────── */}
                    {activeTab === "hero" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Header & Hero Content</h2>
                                <p className="text-xs text-gray-500">
                                    Edit the top pill badge, rich text headline, and description shown at the top of the /contact page.
                                </p>
                            </div>

                            {/* Badge */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Top Badge Tag
                                </label>
                                <input
                                    type="text"
                                    value={formData.badge_text}
                                    onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                    placeholder="Get in Touch • We're Here For You"
                                />
                            </div>

                            {/* Title with Rich Text */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Page Title (Rich Text Editor)
                                    </label>
                                    <span className="text-[11px] text-gray-400">
                                        Tip: Highlight words to apply purple gradient or bold emphasis
                                    </span>
                                </div>
                                <div className="border border-gray-300 rounded-xl overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.title}
                                        onChange={(val) => setFormData({ ...formData, title: val })}
                                        modules={quillModules}
                                        className="bg-white min-h-[120px]"
                                    />
                                </div>
                            </div>

                            {/* Description with Rich Text */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                        Page Description / Subtitle (Rich Text Editor)
                                    </label>
                                </div>
                                <div className="border border-gray-300 rounded-xl overflow-hidden">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(val) => setFormData({ ...formData, description: val })}
                                        modules={quillModules}
                                        className="bg-white min-h-[140px]"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 2: FORM & LEAD COLLECTION ─────────────────────────────── */}
                    {activeTab === "form" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Form & Lead Tagging Settings</h2>
                                <p className="text-xs text-gray-500">
                                    Configure under which lead source/tag inquiries from this page are logged, button texts, and success messages.
                                </p>
                            </div>

                            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl flex items-start gap-3.5">
                                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                                    <i className="fas fa-tag"></i>
                                </div>
                                <div className="flex-1">
                                    <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider mb-1">
                                        Default Lead Source / Tag for Submissions *
                                    </label>
                                    <p className="text-xs text-purple-700 mb-2">
                                        All inquiries submitted via the Contact Us page form will be recorded in the Admin Leads database tagged under this source.
                                    </p>
                                    
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <select
                                            value={formData.lead_source_tag}
                                            onChange={(e) => setFormData({ ...formData, lead_source_tag: e.target.value })}
                                            className="bg-white border border-purple-300 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-semibold outline-none cursor-pointer flex-1"
                                        >
                                            <option value="contact_page">contact_page (Default)</option>
                                            <option value="website_inquiry">website_inquiry</option>
                                            <option value="cohort_2026">cohort_2026</option>
                                            {leadSources.map((ls) => (
                                                <option key={ls.id} value={ls.id}>
                                                    {ls.label} ({ls.id})
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="text"
                                            value={formData.lead_source_tag}
                                            onChange={(e) => setFormData({ ...formData, lead_source_tag: e.target.value })}
                                            placeholder="Or type custom tag slug..."
                                            className="bg-white border border-purple-300 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none flex-1"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Form Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.form_heading}
                                        onChange={(e) => setFormData({ ...formData, form_heading: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                        placeholder="Send Us a Message"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Submit Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.submit_btn_text}
                                        onChange={(e) => setFormData({ ...formData, submit_btn_text: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                        placeholder="Submit Inquiry"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Form Subheading / Instructions
                                </label>
                                <input
                                    type="text"
                                    value={formData.form_subheading}
                                    onChange={(e) => setFormData({ ...formData, form_subheading: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                    placeholder="Fill in the form below and our team will get back to you within 24 hours."
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Success Heading
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.success_heading}
                                        onChange={(e) => setFormData({ ...formData, success_heading: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                        placeholder="Message Sent Successfully!"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Success Message Text
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={formData.success_message}
                                        onChange={(e) => setFormData({ ...formData, success_message: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none resize-none"
                                        placeholder="Thank you for reaching out! A member of our team will connect shortly."
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── TAB 3: DIRECT CONTACT & ADDRESS ───────────────────────────── */}
                    {activeTab === "contact" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Direct Contact Details</h2>
                                <p className="text-xs text-gray-500">
                                    Update official email, telephone helpline number, address, and live chat/WhatsApp links.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        <i className="fas fa-envelope text-accent-blue mr-1"></i> Official Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-medium"
                                        placeholder="info@setustartupschool.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        <i className="fas fa-phone text-emerald-600 mr-1"></i> Phone / WhatsApp Helpline
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-medium"
                                        placeholder="+91 92891 21121"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    <i className="fas fa-map-marker-alt text-red-500 mr-1"></i> Campus &amp; Office Address
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-medium resize-none"
                                    placeholder="Enter physical address of office / hub..."
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    <i className="fab fa-whatsapp text-emerald-500 mr-1"></i> Quick Chat / WhatsApp Group Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.chat_link}
                                    onChange={(e) => setFormData({ ...formData, chat_link: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>
                        </div>
                    )}

                    {/* ── TAB 4: SOCIAL & CHAT LINKS ────────────────────────────────── */}
                    {activeTab === "social" && (
                        <div className="space-y-6 max-w-4xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Official Social &amp; Chat Channels</h2>
                                    <p className="text-xs text-gray-500">
                                        Manage social links shown on the contact page, their badges, handles, and icons.
                                    </p>
                                </div>
                                <button
                                    onClick={openAddSocial}
                                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start"
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>Add Social Channel</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.social_links.length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 text-sm">
                                        No social links configured. Click &quot;Add Social Channel&quot; above to add one.
                                    </div>
                                ) : (
                                    formData.social_links.map((s) => (
                                        <div
                                            key={s.id}
                                            className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                                                s.is_active ? "bg-white border-gray-200 shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5">
                                                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center text-lg shrink-0">
                                                    <i className={s.icon || "fas fa-link"}></i>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-sm text-gray-900">{s.name}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                                            {s.badge}
                                                        </span>
                                                        {!s.is_active && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                                        <span>{s.handle}</span>
                                                        <span>•</span>
                                                        <a
                                                            href={s.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="text-accent-blue hover:underline truncate max-w-xs"
                                                        >
                                                            {s.url}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => handleToggleSocial(s.id)}
                                                    className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                                                        s.is_active
                                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                                                            : "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {s.is_active ? "Active" : "Hidden"}
                                                </button>
                                                <button
                                                    onClick={() => openEditSocial(s)}
                                                    className="px-3 py-1 text-xs font-bold text-accent-blue bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSocial(s.id)}
                                                    className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── TAB 5: FOUNDER HIGHLIGHT CARD ─────────────────────────────── */}
                    {activeTab === "founder" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Founder Highlight Card</h2>
                                <p className="text-xs text-gray-500">
                                    Configure the quick direct connect card displayed on the contact page linking to Gaurav Bansal&apos;s profile.
                                </p>
                            </div>

                            <label className="flex items-center gap-3 p-4 bg-purple-50/50 border border-purple-200 rounded-2xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.show_founder_card}
                                    onChange={(e) => setFormData({ ...formData, show_founder_card: e.target.checked })}
                                    className="w-5 h-5 text-accent-blue rounded cursor-pointer"
                                />
                                <div>
                                    <span className="font-bold text-sm text-gray-900 block">Show Founder Highlight Card</span>
                                    <span className="text-xs text-gray-500">
                                        When checked, a sleek card linking to the mentor profile is displayed on /contact.
                                    </span>
                                </div>
                            </label>

                            {formData.show_founder_card && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Founder / Mentor Name
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.founder_name}
                                            onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="Gaurav Bansal"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Title / Subtext
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.founder_title}
                                            onChange={(e) => setFormData({ ...formData, founder_title: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="Founder & Chief Mentor • Setu Startup School"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Card Tag Badge
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.founder_tag}
                                            onChange={(e) => setFormData({ ...formData, founder_tag: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="Founder Profile"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Target Profile Link
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.founder_link}
                                            onChange={(e) => setFormData({ ...formData, founder_link: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="/gauravbansal"
                                        />
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Photo URL
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.founder_photo_url}
                                            onChange={(e) => setFormData({ ...formData, founder_photo_url: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="/gaurav.webp"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TAB 6: FAQ ACCORDION ───────────────────────────────────────── */}
                    {activeTab === "faqs" && (
                        <div className="space-y-6 max-w-4xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Frequently Asked Questions</h2>
                                    <p className="text-xs text-gray-500">
                                        Manage questions and answers displayed in the accordion at the bottom of the contact page.
                                    </p>
                                </div>
                                <button
                                    onClick={openAddFaq}
                                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer self-start"
                                >
                                    <i className="fas fa-plus"></i>
                                    <span>Add Question &amp; Answer</span>
                                </button>
                            </div>

                            <label className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-2xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.show_faqs}
                                    onChange={(e) => setFormData({ ...formData, show_faqs: e.target.checked })}
                                    className="w-5 h-5 text-accent-blue rounded cursor-pointer"
                                />
                                <div>
                                    <span className="font-bold text-sm text-gray-900 block">Show FAQ Accordion Section</span>
                                    <span className="text-xs text-gray-500">
                                        Toggle whether the FAQ block appears on the live /contact page.
                                    </span>
                                </div>
                            </label>

                            <div className="space-y-3">
                                {formData.faqs.length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 text-sm">
                                        No FAQs added yet. Click &quot;Add Question &amp; Answer&quot; to create one.
                                    </div>
                                ) : (
                                    formData.faqs.map((faq, idx) => (
                                        <div
                                            key={faq.id || idx}
                                            className={`p-4 rounded-2xl border transition-all ${
                                                faq.is_active ? "bg-white border-gray-200 shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="space-y-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700">
                                                            Q{idx + 1}
                                                        </span>
                                                        <h4 className="font-bold text-sm text-gray-900">{faq.q}</h4>
                                                        {!faq.is_active && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-200 text-gray-600">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 leading-relaxed pl-8">{faq.a}</p>
                                                </div>

                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => handleToggleFaq(faq.id)}
                                                        className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                                                            faq.is_active
                                                                ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                                                                : "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200"
                                                        }`}
                                                    >
                                                        {faq.is_active ? "Active" : "Hidden"}
                                                    </button>
                                                    <button
                                                        onClick={() => openEditFaq(faq)}
                                                        className="px-3 py-1 text-xs font-bold text-accent-blue bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteFaq(faq.id)}
                                                        className="px-3 py-1 text-xs font-bold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ── MODAL: Social Link ─────────────────────────────────────────── */}
            {socialModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 sm:p-7 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingSocial ? "Edit Social Channel" : "Add Social Channel"}
                            </h3>
                            <button
                                onClick={() => setSocialModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSaveSocial} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Platform Name *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={socialForm.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setSocialForm({
                                            ...socialForm,
                                            name,
                                            color: DEFAULT_SOCIAL_COLORS[name] || socialForm.color || "text-slate-900 bg-slate-100 border-slate-200",
                                        });
                                    }}
                                    placeholder="e.g. LinkedIn, Instagram, WhatsApp Community, Telegram"
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Account Handle / Subtitle *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={socialForm.handle}
                                    onChange={(e) => setSocialForm({ ...socialForm, handle: e.target.value })}
                                    placeholder="e.g. @the__startup__school or Join Founder Group"
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Target URL *
                                </label>
                                <input
                                    required
                                    type="url"
                                    value={socialForm.url}
                                    onChange={(e) => setSocialForm({ ...socialForm, url: e.target.value })}
                                    placeholder="https://..."
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        FontAwesome Icon Class
                                    </label>
                                    <input
                                        type="text"
                                        value={socialForm.icon}
                                        onChange={(e) => setSocialForm({ ...socialForm, icon: e.target.value })}
                                        placeholder="fab fa-linkedin-in"
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Badge Label
                                    </label>
                                    <input
                                        type="text"
                                        value={socialForm.badge}
                                        onChange={(e) => setSocialForm({ ...socialForm, badge: e.target.value })}
                                        placeholder="e.g. Professional Network"
                                        className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 pt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={socialForm.is_active}
                                    onChange={(e) => setSocialForm({ ...socialForm, is_active: e.target.checked })}
                                    className="w-4 h-4 text-accent-blue rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-gray-700">Active (Visible on public page)</span>
                            </label>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setSocialModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-sm rounded-xl shadow-sm cursor-pointer hover:opacity-90"
                                >
                                    Save Channel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL: FAQ Item ───────────────────────────────────────────── */}
            {faqModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-lg p-6 sm:p-7 animate-in fade-in zoom-in-95">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingFaq ? "Edit FAQ" : "Add FAQ Question & Answer"}
                            </h3>
                            <button
                                onClick={() => setFaqModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        <form onSubmit={handleSaveFaq} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Question *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={faqForm.q}
                                    onChange={(e) => setFaqForm({ ...faqForm, q: e.target.value })}
                                    placeholder="e.g. Who is Setu Startup School for?"
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Answer *
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={faqForm.a}
                                    onChange={(e) => setFaqForm({ ...faqForm, a: e.target.value })}
                                    placeholder="Enter clear, comprehensive response..."
                                    className="w-full bg-white border border-gray-300 focus:border-accent-blue rounded-xl px-4 py-2 text-sm text-gray-900 outline-none resize-none"
                                />
                            </div>

                            <label className="flex items-center gap-2 pt-1 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={faqForm.is_active}
                                    onChange={(e) => setFaqForm({ ...faqForm, is_active: e.target.checked })}
                                    className="w-4 h-4 text-accent-blue rounded cursor-pointer"
                                />
                                <span className="text-xs font-bold text-gray-700">Active (Visible in accordion)</span>
                            </label>

                            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setFaqModalOpen(false)}
                                    className="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 bg-gradient-to-r from-[#7C3AED] to-[#A855F7] text-white font-bold text-sm rounded-xl shadow-sm cursor-pointer hover:opacity-90"
                                >
                                    Save FAQ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
