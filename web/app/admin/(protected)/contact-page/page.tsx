"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
    Users,
    MessageSquare,
    Calendar,
    MessageCircle,
    Mail,
    Phone,
    Plus,
    Trash2,
    Edit3,
    ArrowUp,
    ArrowDown,
    Save,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    LayoutGrid,
    Heading,
    ListChecks,
    AtSign,
    Sparkles,
} from "lucide-react";

interface ActionCardItem {
    id: string;
    title: string;
    description: string;
    button_text: string;
    button_url?: string;
    action_type?: "whatsapp" | "url" | "email" | "phone" | "feedback_modal" | "inquiry_modal";
    icon?: string;
    badge?: string;
    display_order?: number;
    is_active: boolean;
}

interface InfoBoxItem {
    id: string;
    text: string;
    display_order?: number;
    is_active: boolean;
}

function cleanHtml(raw?: string): string {
    if (!raw) return "";
    return raw
        .replace(/<[^>]*>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

export default function AdminContactPageManager() {
    const [activeTab, setActiveTab] = useState<"cards" | "header" | "checklist" | "contact">("cards");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Lead Sources for Dropdown
    const [leadSources, setLeadSources] = useState<{ id: string; label: string }[]>([]);

    // Form / CMS Data
    const [formData, setFormData] = useState({
        badge_text: "Get in Touch • We're Here For You",
        title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
        description: "Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.",
        back_btn_text: "← Back",
        back_btn_link: "/",
        
        action_cards: [] as ActionCardItem[],

        show_problem_banner: false,
        problem_banner_title: "Need Custom Mentorship for your Startup?",
        problem_banner_desc: "Looking for tailored 1-on-1 guidance or institutional partnership? Let us know your goals.",
        problem_banner_action_text: "Explore Programs",
        problem_banner_action_url: "/events",
        problem_banner_icon: "fas fa-rocket",

        show_info_box: true,
        info_box_title: "How we can help you",
        info_box_icon: "fas fa-question-circle",
        info_box_items: [] as InfoBoxItem[],

        lead_source_tag: "contact_page",
        email: "info@setustartupschool.com",
        phone: "+91 92891 21121",
        chat_link: "https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4",
    });

    // Card Modal State
    const [cardModalOpen, setCardModalOpen] = useState(false);
    const [editingCard, setEditingCard] = useState<ActionCardItem | null>(null);
    const [cardForm, setCardForm] = useState<ActionCardItem>({
        id: "",
        title: "",
        description: "",
        button_text: "Open →",
        button_url: "",
        action_type: "url",
        icon: "users",
        badge: "Support",
        is_active: true,
        display_order: 0,
    });

    // Checklist Item Modal State
    const [checkModalOpen, setCheckModalOpen] = useState(false);
    const [editingCheck, setEditingCheck] = useState<InfoBoxItem | null>(null);
    const [checkForm, setCheckForm] = useState<InfoBoxItem>({
        id: "",
        text: "",
        is_active: true,
        display_order: 0,
    });

    const token = () => localStorage.getItem("adminToken");
    const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/admin/contact-page`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    badge_text: data.badge_text ?? "Get in Touch • We're Here For You",
                    title: data.title ?? 'Support & <span class="text-[#7C3AED]">Contact</span>',
                    description: cleanHtml(data.description) || "Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team.",
                    back_btn_text: data.back_btn_text ?? "← Back",
                    back_btn_link: data.back_btn_link ?? "/",

                    action_cards: Array.isArray(data.action_cards) ? data.action_cards : [],

                    show_problem_banner: data.show_problem_banner === true,
                    problem_banner_title: data.problem_banner_title ?? "Need Custom Mentorship for your Startup?",
                    problem_banner_desc: data.problem_banner_desc ?? "Looking for tailored 1-on-1 guidance or institutional partnership? Let us know your goals.",
                    problem_banner_action_text: data.problem_banner_action_text ?? "Explore Programs",
                    problem_banner_action_url: data.problem_banner_action_url ?? "/events",
                    problem_banner_icon: data.problem_banner_icon ?? "fas fa-rocket",

                    show_info_box: data.show_info_box !== false,
                    info_box_title: data.info_box_title ?? "How we can help you",
                    info_box_icon: data.info_box_icon ?? "fas fa-question-circle",
                    info_box_items: Array.isArray(data.info_box_items) ? data.info_box_items : [],

                    lead_source_tag: data.lead_source_tag ?? "contact_page",
                    email: data.email ?? "info@setustartupschool.com",
                    phone: data.phone ?? "+91 92891 21121",
                    chat_link: data.chat_link ?? "https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4",
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
            const payload = {
                ...formData,
                description: cleanHtml(formData.description),
            };

            const res = await fetch(`${API}/api/admin/contact-page`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify(payload),
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

    // ── Card Operations ────────────────────────────────────────────────────────
    const openAddCard = () => {
        setEditingCard(null);
        setCardForm({
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            title: "",
            description: "",
            button_text: "Open →",
            button_url: "",
            action_type: "url",
            icon: "users",
            badge: "Community",
            is_active: true,
            display_order: formData.action_cards.length,
        });
        setCardModalOpen(true);
    };

    const openEditCard = (card: ActionCardItem) => {
        setEditingCard(card);
        setCardForm({ ...card });
        setCardModalOpen(true);
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: ActionCardItem[];
        if (editingCard) {
            updated = formData.action_cards.map((c) => (c.id === editingCard.id ? cardForm : c));
        } else {
            updated = [...formData.action_cards, { ...cardForm, id: cardForm.id || String(Date.now()) }];
        }
        setFormData({ ...formData, action_cards: updated });
        setCardModalOpen(false);
    };

    const handleDeleteCard = (id: string) => {
        if (!confirm("Are you sure you want to delete this action card?")) return;
        setFormData({
            ...formData,
            action_cards: formData.action_cards.filter((c) => c.id !== id),
        });
    };

    const handleToggleCard = (id: string) => {
        setFormData({
            ...formData,
            action_cards: formData.action_cards.map((c) =>
                c.id === id ? { ...c, is_active: !c.is_active } : c
            ),
        });
    };

    const moveCard = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= formData.action_cards.length) return;
        const newCards = [...formData.action_cards];
        const temp = newCards[index];
        newCards[index] = newCards[targetIndex];
        newCards[targetIndex] = temp;
        newCards.forEach((c, idx) => {
            c.display_order = idx;
        });
        setFormData({ ...formData, action_cards: newCards });
    };

    // ── Checklist Operations ───────────────────────────────────────────────────
    const openAddCheck = () => {
        setEditingCheck(null);
        setCheckForm({
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            text: "",
            is_active: true,
            display_order: formData.info_box_items.length,
        });
        setCheckModalOpen(true);
    };

    const openEditCheck = (item: InfoBoxItem) => {
        setEditingCheck(item);
        setCheckForm({ ...item });
        setCheckModalOpen(true);
    };

    const handleSaveCheck = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: InfoBoxItem[];
        if (editingCheck) {
            updated = formData.info_box_items.map((i) => (i.id === editingCheck.id ? checkForm : i));
        } else {
            updated = [...formData.info_box_items, { ...checkForm, id: checkForm.id || String(Date.now()) }];
        }
        setFormData({ ...formData, info_box_items: updated });
        setCheckModalOpen(false);
    };

    const handleDeleteCheck = (id: string) => {
        if (!confirm("Delete this checklist item?")) return;
        setFormData({
            ...formData,
            info_box_items: formData.info_box_items.filter((i) => i.id !== id),
        });
    };

    const moveCheck = (index: number, direction: "up" | "down") => {
        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= formData.info_box_items.length) return;
        const newItems = [...formData.info_box_items];
        const temp = newItems[index];
        newItems[index] = newItems[targetIndex];
        newItems[targetIndex] = temp;
        newItems.forEach((item, idx) => {
            item.display_order = idx;
        });
        setFormData({ ...formData, info_box_items: newItems });
    };

    // Render icon helper in admin preview
    const renderIconBadge = (iconType?: string) => {
        const key = (iconType || "").toLowerCase();
        if (key.includes("user") || key.includes("community")) return <Users className="w-5 h-5 text-[#7C3AED]" />;
        if (key.includes("message") || key.includes("chat") || key.includes("whatsapp")) return <MessageSquare className="w-5 h-5 text-[#7C3AED]" />;
        if (key.includes("calendar") || key.includes("call") || key.includes("book")) return <Calendar className="w-5 h-5 text-[#7C3AED]" />;
        if (key.includes("feedback") || key.includes("comment")) return <MessageCircle className="w-5 h-5 text-[#7C3AED]" />;
        if (key.includes("mail") || key.includes("email")) return <Mail className="w-5 h-5 text-[#7C3AED]" />;
        if (key.includes("phone") || key.includes("tel")) return <Phone className="w-5 h-5 text-[#7C3AED]" />;
        return <Sparkles className="w-5 h-5 text-[#7C3AED]" />;
    };

    return (
        <div className="space-y-6">
            
            {/* ── Top Bar Header ─────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
                <div>
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold text-gray-900">Support &amp; Contact Portal CMS</h1>
                        <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                            /contact
                        </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Customize Support Cards, page headline, guidance checklist, and direct reach channels.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/contact"
                        target="_blank"
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded-xl transition-all flex items-center gap-1.5"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        <span>Live Preview</span>
                    </Link>

                    {/* Top Save button with matching brand color */}
                    <button
                        onClick={() => handleSave()}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-[#7C3AED] hover:bg-[#5A1EEB] text-white font-bold text-sm rounded-xl shadow-md hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                <span>Saving...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                <span>Save All Changes</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Notification Alerts */}
            {savedSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-3 shadow-xs animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span>Contact page settings successfully saved and published!</span>
                </div>
            )}

            {errorMessage && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-semibold flex items-center gap-3 shadow-xs">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* ── Navigation Tabs ────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
                {[
                    { key: "cards", label: "Support Action Cards", icon: LayoutGrid },
                    { key: "header", label: "Header & Navigation", icon: Heading },
                    { key: "checklist", label: "How We Help Checklist", icon: ListChecks },
                    { key: "contact", label: "Direct Channels & Tagging", icon: AtSign },
                ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer ${
                                activeTab === tab.key
                                    ? "bg-[#7C3AED] text-white shadow-sm"
                                    : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            <span>{tab.label}</span>
                        </button>
                    );
                })}
            </div>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-200">
                    <span className="animate-spin text-2xl mb-2 inline-block">⏳</span>
                    <p className="font-semibold text-sm">Loading contact page settings...</p>
                </div>
            ) : (
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-xs">
                    
                    {/* ── TAB 1: SUPPORT ACTION CARDS ────────────────────────────────── */}
                    {activeTab === "cards" && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">Support Action Cards</h2>
                                    <p className="text-xs text-gray-500">
                                        Manage the 2-column cards shown on `/contact` (WhatsApp, Feedback, Bookings, Mail, Collabs).
                                    </p>
                                </div>
                                <button
                                    onClick={openAddCard}
                                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#5A1EEB] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all flex items-center gap-1.5 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Action Card</span>
                                </button>
                            </div>

                            <div className="space-y-3">
                                {formData.action_cards.length === 0 ? (
                                    <div className="p-8 text-center bg-gray-50 border border-gray-200 rounded-2xl text-gray-500 text-sm">
                                        No action cards configured. Click &quot;Add Action Card&quot; to create one.
                                    </div>
                                ) : (
                                    formData.action_cards.map((card, idx) => (
                                        <div
                                            key={card.id || idx}
                                            className={`flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-4 ${
                                                card.is_active ? "bg-white border-gray-200 shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                                            }`}
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                                                    {renderIconBadge(card.icon || card.title)}
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <span className="font-bold text-sm text-gray-900">{card.title}</span>
                                                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                                            {card.action_type || "url"}
                                                        </span>
                                                        {card.badge && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                                                                {card.badge}
                                                            </span>
                                                        )}
                                                        {!card.is_active && (
                                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                                                                Hidden
                                                            </span>
                                                        )}
                                                    </div>

                                                    <p className="text-xs text-gray-500 leading-relaxed">
                                                        {card.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 pt-1">
                                                        <span className="font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md">
                                                            Button: {card.button_text}
                                                        </span>
                                                        {card.button_url && (
                                                            <span className="text-gray-400 truncate max-w-xs">
                                                                • {card.button_url}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2 self-end md:self-center">
                                                {/* Reorder Buttons */}
                                                <button
                                                    onClick={() => moveCard(idx, "up")}
                                                    disabled={idx === 0}
                                                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100 cursor-pointer"
                                                    title="Move Up"
                                                >
                                                    <ArrowUp className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => moveCard(idx, "down")}
                                                    disabled={idx === formData.action_cards.length - 1}
                                                    className="p-1.5 text-gray-500 hover:text-gray-900 disabled:opacity-30 rounded-lg hover:bg-gray-100 cursor-pointer"
                                                    title="Move Down"
                                                >
                                                    <ArrowDown className="w-4 h-4" />
                                                </button>

                                                {/* Active Toggle */}
                                                <button
                                                    onClick={() => handleToggleCard(card.id)}
                                                    className={`px-3 py-1 text-xs font-bold rounded-lg border cursor-pointer transition-all ${
                                                        card.is_active
                                                            ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                                                            : "text-gray-700 bg-gray-100 border-gray-300 hover:bg-gray-200"
                                                    }`}
                                                >
                                                    {card.is_active ? "Active" : "Hidden"}
                                                </button>

                                                {/* Edit */}
                                                <button
                                                    onClick={() => openEditCard(card)}
                                                    className="px-3 py-1 text-xs font-bold text-[#7C3AED] bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 cursor-pointer flex items-center gap-1"
                                                >
                                                    <Edit3 className="w-3.5 h-3.5" />
                                                    <span>Edit</span>
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDeleteCard(card.id)}
                                                    className="p-1.5 text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 cursor-pointer"
                                                    title="Delete Card"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── TAB 2: HEADER & NAVIGATION ─────────────────────────────────── */}
                    {activeTab === "header" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Header &amp; Navigation Settings</h2>
                                <p className="text-xs text-gray-500">
                                    Configure back button target, headline with purple styling, and clean description.
                                </p>
                            </div>

                            {/* Back Button Settings */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-200">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Back Button Text
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.back_btn_text}
                                        onChange={(e) => setFormData({ ...formData, back_btn_text: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                        placeholder="← Back"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Back Button Target URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.back_btn_link}
                                        onChange={(e) => setFormData({ ...formData, back_btn_link: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                        placeholder="/"
                                    />
                                </div>
                            </div>

                            {/* Title with HTML/Custom Styling */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Page Headline (Supports HTML span for purple color)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-semibold"
                                    placeholder='Support & <span class="text-[#7C3AED]">Contact</span>'
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Example: <code>Support &amp; &lt;span class=&quot;text-[#7C3AED]&quot;&gt;Contact&lt;/span&gt;</code>
                                </p>
                            </div>

                            {/* Clean Description Input without HTML tags */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Page Subtitle / Description (Clean Text)
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: cleanHtml(e.target.value) })}
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none resize-none leading-relaxed"
                                    placeholder="Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Reach out across our channels below or connect with our team."
                                />
                            </div>
                        </div>
                    )}

                    {/* ── TAB 3: CHECKLIST / HOW WE HELP ─────────────────────────────── */}
                    {activeTab === "checklist" && (
                        <div className="space-y-6 max-w-4xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900">&quot;How we can help you&quot; Checklist</h2>
                                    <p className="text-xs text-gray-500">
                                        Configure the guidance scenarios &amp; checklist items displayed on the contact page.
                                    </p>
                                </div>
                                <button
                                    onClick={openAddCheck}
                                    className="px-4 py-2 bg-[#7C3AED] hover:bg-[#5A1EEB] text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all flex items-center gap-1.5 cursor-pointer self-start"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add Bullet Item</span>
                                </button>
                            </div>

                            {/* Visibility Toggle */}
                            <label className="flex items-center gap-3 p-4 bg-purple-50/50 border border-purple-200 rounded-2xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.show_info_box}
                                    onChange={(e) => setFormData({ ...formData, show_info_box: e.target.checked })}
                                    className="w-5 h-5 text-[#7C3AED] rounded cursor-pointer"
                                />
                                <div>
                                    <span className="font-bold text-sm text-gray-900 block">Show Checklist Container</span>
                                    <span className="text-xs text-gray-500">
                                        When enabled, the &quot;How we can help you&quot; container is visible on `/contact`.
                                    </span>
                                </div>
                            </label>

                            {formData.show_info_box && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Container Headline
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.info_box_title}
                                            onChange={(e) => setFormData({ ...formData, info_box_title: e.target.value })}
                                            className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                            placeholder="How we can help you"
                                        />
                                    </div>

                                    {/* Items List */}
                                    <div className="space-y-2.5 pt-2">
                                        {formData.info_box_items.map((item, idx) => (
                                            <div
                                                key={item.id || idx}
                                                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                                                    item.is_active ? "bg-white border-gray-200 shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                                                }`}
                                            >
                                                <div className="flex items-start gap-3 flex-1 pr-4">
                                                    <span className="w-2 h-2 rounded-full bg-[#7C3AED] mt-2 shrink-0"></span>
                                                    <span className="text-xs font-medium text-gray-800 leading-relaxed">
                                                        {item.text}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    <button
                                                        onClick={() => moveCheck(idx, "up")}
                                                        disabled={idx === 0}
                                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                                                        title="Move Up"
                                                    >
                                                        <ArrowUp className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => moveCheck(idx, "down")}
                                                        disabled={idx === formData.info_box_items.length - 1}
                                                        className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20 cursor-pointer"
                                                        title="Move Down"
                                                    >
                                                        <ArrowDown className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button
                                                        onClick={() => openEditCheck(item)}
                                                        className="px-2.5 py-1 text-xs font-bold text-[#7C3AED] bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 cursor-pointer"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteCheck(item.id)}
                                                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── TAB 4: DIRECT CHANNELS & LEAD TAGGING ──────────────────────── */}
                    {activeTab === "contact" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Direct Channels &amp; Lead Source Tag</h2>
                                <p className="text-xs text-gray-500">
                                    Configure default fallback emails, phone helplines, WhatsApp links, and lead tagging for CRM sync.
                                </p>
                            </div>

                            {/* Lead Source Tag */}
                            <div className="p-4 bg-purple-50/70 border border-purple-200 rounded-2xl space-y-2">
                                <label className="block text-xs font-bold text-purple-900 uppercase tracking-wider">
                                    Default Lead Source / Tag for Inquiries
                                </label>
                                <p className="text-xs text-purple-700">
                                    All inquiries sent via the Contact page modals will be logged into Admin Leads tagged under this source.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                    <select
                                        value={formData.lead_source_tag}
                                        onChange={(e) => setFormData({ ...formData, lead_source_tag: e.target.value })}
                                        className="bg-white border border-purple-300 focus:border-purple-600 rounded-xl px-4 py-2.5 text-sm text-gray-900 font-semibold outline-none cursor-pointer flex-1"
                                    >
                                        <option value="contact_page">contact_page (Default)</option>
                                        <option value="contact_support">contact_support</option>
                                        <option value="website_inquiry">website_inquiry</option>
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Official Support Email
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-medium"
                                        placeholder="info@setustartupschool.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Helpline / Call Number
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none font-medium"
                                        placeholder="+91 92891 21121"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Official WhatsApp Community / Group Link
                                </label>
                                <input
                                    type="url"
                                    value={formData.chat_link}
                                    onChange={(e) => setFormData({ ...formData, chat_link: e.target.value })}
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-4 py-2.5 text-sm text-gray-900 outline-none"
                                    placeholder="https://chat.whatsapp.com/..."
                                />
                            </div>
                        </div>
                    )}

                </div>
            )}

            {/* ── CARD EDIT MODAL ────────────────────────────────────────────── */}
            {cardModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingCard ? "Edit Support Action Card" : "Add New Support Action Card"}
                            </h3>
                            <button
                                onClick={() => setCardModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveCard} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Card Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={cardForm.title}
                                    onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                                    placeholder="e.g. WhatsApp community"
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Card Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={cardForm.description}
                                    onChange={(e) => setCardForm({ ...cardForm, description: cleanHtml(e.target.value) })}
                                    placeholder="e.g. Join founders across Bharat. Ask questions, collaborate, and get peer feedback."
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Button Text <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={cardForm.button_text}
                                        onChange={(e) => setCardForm({ ...cardForm, button_text: e.target.value })}
                                        placeholder="Join community →"
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Action Type
                                    </label>
                                    <select
                                        value={cardForm.action_type || "url"}
                                        onChange={(e) => setCardForm({ ...cardForm, action_type: e.target.value as any })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3 py-2 text-sm text-gray-900 outline-none cursor-pointer"
                                    >
                                        <option value="whatsapp">WhatsApp Link</option>
                                        <option value="url">External / Custom URL</option>
                                        <option value="inquiry_modal">Open Program Inquiry Modal</option>
                                        <option value="feedback_modal">Open Feedback Modal</option>
                                        <option value="email">Direct mailto: link</option>
                                        <option value="phone">Direct tel: call</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Target Link / URL / Phone
                                </label>
                                <input
                                    type="text"
                                    value={cardForm.button_url || ""}
                                    onChange={(e) => setCardForm({ ...cardForm, button_url: e.target.value })}
                                    placeholder="https://chat.whatsapp.com/... or tel:+91... or leave blank for modal"
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Icon
                                    </label>
                                    <select
                                        value={cardForm.icon || "users"}
                                        onChange={(e) => setCardForm({ ...cardForm, icon: e.target.value })}
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3 py-2 text-sm text-gray-900 outline-none cursor-pointer"
                                    >
                                        <option value="users">Users / Community</option>
                                        <option value="message">Message / WhatsApp</option>
                                        <option value="calendar">Calendar / Mentorship</option>
                                        <option value="mail">Mail / Inquiry</option>
                                        <option value="sparkles">Sparkles / Collabs</option>
                                        <option value="feedback">Feedback / Star</option>
                                        <option value="phone">Phone / Call</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Badge Label (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={cardForm.badge || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                                        placeholder="e.g. Community, Mentorship"
                                        className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-2">
                                <label className="flex items-center gap-2 text-xs font-semibold text-gray-800 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={cardForm.is_active}
                                        onChange={(e) => setCardForm({ ...cardForm, is_active: e.target.checked })}
                                        className="w-4 h-4 text-[#7C3AED] rounded cursor-pointer"
                                    />
                                    <span>Card is active (visible on page)</span>
                                </label>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setCardModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#5A1EEB] rounded-xl shadow-xs hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
                                >
                                    Save Card
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── CHECKLIST ITEM EDIT MODAL ──────────────────────────────────── */}
            {checkModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-gray-900">
                                {editingCheck ? "Edit Checklist Item" : "Add Checklist Item"}
                            </h3>
                            <button
                                onClick={() => setCheckModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSaveCheck} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Bullet Scenario / Condition Text <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    required
                                    value={checkForm.text}
                                    onChange={(e) => setCheckForm({ ...checkForm, text: e.target.value })}
                                    placeholder="e.g. Guidance on choosing the right cohort or incubation program for your startup stage."
                                    className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none resize-none"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setCheckModalOpen(false)}
                                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 text-xs font-bold text-white bg-[#7C3AED] hover:bg-[#5A1EEB] rounded-xl shadow-xs hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all cursor-pointer"
                                >
                                    Save Item
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
