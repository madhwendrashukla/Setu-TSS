"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {
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
} from "lucide-react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        [{ align: [] }],
        ["link"],
        ["clean"],
    ],
};

export interface ActionCardItem {
    id: string;
    title: string;
    description: string;
    button_text: string;
    button_url?: string;
    action_type: "URL" | "PHONE" | "EMAIL";
    target_url?: string;
    phone_number?: string;
    email_to?: string;
    email_subject?: string;
    email_body?: string;
    icon_class?: string;
    image_url?: string;
    badge?: string;
    display_order?: number;
    is_active: boolean;
}

export interface InfoBoxItem {
    id: string;
    text: string;
    display_order?: number;
    is_active: boolean;
}

export default function AdminContactPageManager() {
    const [activeTab, setActiveTab] = useState<"cards" | "header" | "checklist">("cards");
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Form / CMS Data
    const [formData, setFormData] = useState({
        badge_text: "Get in Touch • We're Here For You",
        title: 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
        description: '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
        back_btn_text: "← Back",
        back_btn_link: "/",
        
        action_cards: [] as ActionCardItem[],

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
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [cardForm, setCardForm] = useState<ActionCardItem>({
        id: "",
        title: "",
        description: "",
        button_text: "Join community →",
        action_type: "URL",
        target_url: "",
        phone_number: "",
        email_to: "",
        email_subject: "",
        email_body: "",
        icon_class: "fab fa-whatsapp",
        image_url: "",
        badge: "Community",
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
                    title: data.title || 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
                    description: data.description || '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
                    back_btn_text: data.back_btn_text ?? "← Back",
                    back_btn_link: data.back_btn_link ?? "/",

                    action_cards: Array.isArray(data.action_cards) ? data.action_cards : [],

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

    // ── Upload Icon Image ──────────────────────────────────────────────────────
    const handleUploadIcon = async (file: File) => {
        setIsUploadingImage(true);
        const uploadData = new FormData();
        uploadData.append("file", file);
        try {
            const res = await fetch(`${API}/api/admin/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token()}` },
                body: uploadData,
            });
            if (res.ok) {
                const data = await res.json();
                return data.url;
            }
        } catch (err) {
            console.error("Upload icon failed:", err);
        } finally {
            setIsUploadingImage(false);
        }
        return null;
    };

    // ── Card Operations ────────────────────────────────────────────────────────
    const openAddCard = () => {
        setEditingCard(null);
        setCardForm({
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
            title: "",
            description: "",
            button_text: "Open →",
            action_type: "URL",
            target_url: "",
            phone_number: "",
            email_to: "",
            email_subject: "",
            email_body: "",
            icon_class: "fab fa-whatsapp",
            image_url: "",
            badge: "Community",
            is_active: true,
            display_order: formData.action_cards.length,
        });
        setCardModalOpen(true);
    };

    const openEditCard = (card: ActionCardItem) => {
        setEditingCard(card);
        // Normalize action_type
        let normalizedType: "URL" | "PHONE" | "EMAIL" = "URL";
        const rawType = (card.action_type || "").toUpperCase();
        if (rawType === "EMAIL" || rawType === "MAIL") normalizedType = "EMAIL";
        else if (rawType === "PHONE" || rawType === "DIALER") normalizedType = "PHONE";
        else normalizedType = "URL";

        setCardForm({
            ...card,
            action_type: normalizedType,
            target_url: card.target_url || card.button_url || "",
            phone_number: card.phone_number || "",
            email_to: card.email_to || "",
            email_subject: card.email_subject || "",
            email_body: card.email_body || "",
            icon_class: card.icon_class || "",
            image_url: card.image_url || "",
        });
        setCardModalOpen(true);
    };

    const handleSaveCard = (e: React.FormEvent) => {
        e.preventDefault();
        let updated: ActionCardItem[];
        const payload: ActionCardItem = {
            ...cardForm,
            button_url: cardForm.action_type === "URL" ? cardForm.target_url : (cardForm.action_type === "PHONE" ? cardForm.phone_number : cardForm.email_to),
        };

        if (editingCard) {
            updated = formData.action_cards.map((c) => (c.id === editingCard.id ? payload : c));
        } else {
            updated = [...formData.action_cards, { ...payload, id: payload.id || String(Date.now()) }];
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
    const renderAdminCardIcon = (card: ActionCardItem) => {
        if (card.image_url) {
            return <img src={card.image_url} alt="" className="w-5 h-5 object-contain" />;
        }
        if (card.icon_class) {
            return <i className={`${card.icon_class} text-lg text-[#7C3AED]`}></i>;
        }
        const type = (card.action_type || "URL").toUpperCase();
        if (type === "EMAIL") return <i className="fas fa-envelope text-lg text-[#7C3AED]"></i>;
        if (type === "PHONE") return <i className="fas fa-phone-alt text-lg text-[#7C3AED]"></i>;
        return <i className="fab fa-whatsapp text-lg text-[#7C3AED]"></i>;
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
                    { key: "header", label: "Header & Tagline", icon: Heading },
                    { key: "checklist", label: "How We Help Checklist", icon: ListChecks },
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
                                        Configure direct action cards (WhatsApp / External Link, Phone Dialer, Pre-filled Email).
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
                                    formData.action_cards.map((card, idx) => {
                                        const type = (card.action_type || "URL").toUpperCase();
                                        return (
                                            <div
                                                key={card.id || idx}
                                                className={`flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border transition-all gap-4 ${
                                                    card.is_active ? "bg-white border-gray-200 shadow-2xs" : "bg-gray-50 border-gray-200 opacity-60"
                                                }`}
                                            >
                                                <div className="flex items-start gap-4 flex-1">
                                                    <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                                                        {renderAdminCardIcon(card)}
                                                    </div>

                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className="font-bold text-sm text-gray-900">{card.title}</span>
                                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                                                type === "EMAIL" 
                                                                    ? "bg-blue-100 text-blue-700" 
                                                                    : (type === "PHONE" ? "bg-emerald-100 text-emerald-700" : "bg-purple-100 text-purple-700")
                                                            }`}>
                                                                {type === "EMAIL" ? "MAIL" : (type === "PHONE" ? "PHONE DIALER" : "WHATSAPP / LINK")}
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
                                                            {type === "URL" && (card.target_url || card.button_url) && (
                                                                <span className="text-gray-400 truncate max-w-sm">
                                                                    • Link: {card.target_url || card.button_url}
                                                                </span>
                                                            )}
                                                            {type === "PHONE" && card.phone_number && (
                                                                <span className="text-gray-400 truncate max-w-sm">
                                                                    • Phone: {card.phone_number}
                                                                </span>
                                                            )}
                                                            {type === "EMAIL" && (
                                                                <span className="text-gray-400 truncate max-w-sm">
                                                                    • Mail to: {card.email_to || "Default Support Email"} {card.email_subject ? `("${card.email_subject}")` : ""}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
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
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── TAB 2: HEADER & TAGLINE (RICH TEXT EDITORS) ──────────────── */}
                    {activeTab === "header" && (
                        <div className="space-y-6 max-w-4xl">
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-1">Header &amp; Tagline Content</h2>
                                <p className="text-xs text-gray-500">
                                    Use the visual rich text editor below to format text colors, bold highlights, and alignment.
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

                            {/* Main Heading (Rich Text Editor) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    MAIN HEADING (RICH TEXT EDITOR)
                                </label>
                                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.title}
                                        onChange={(val) => setFormData({ ...formData, title: val })}
                                        modules={quillModules}
                                        className="bg-white"
                                    />
                                </div>
                            </div>

                            {/* Tagline / Subtitle (Rich Text Editor) */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    TAGLINE / SUBTITLE DESCRIPTION (RICH TEXT EDITOR)
                                </label>
                                <div className="border border-gray-300 rounded-xl overflow-hidden bg-white">
                                    <ReactQuill
                                        theme="snow"
                                        value={formData.description}
                                        onChange={(val) => setFormData({ ...formData, description: val })}
                                        modules={quillModules}
                                        className="bg-white"
                                    />
                                </div>
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



                </div>
            )}

            {/* ── CARD EDIT MODAL ────────────────────────────────────────────── */}
            {cardModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
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
                            {/* Title */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Card Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={cardForm.title}
                                    onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })}
                                    placeholder="e.g. WhatsApp community or Program Inquiry"
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Card Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={2}
                                    required
                                    value={cardForm.description}
                                    onChange={(e) => setCardForm({ ...cardForm, description: e.target.value })}
                                    placeholder="e.g. Join founders across Bharat. Ask questions, collaborate, and get peer feedback."
                                    className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none resize-none"
                                />
                            </div>

                            {/* Icon Class & Image Upload */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-gray-50 rounded-2xl border border-gray-200">
                                <div>
                                    <label className="flex justify-between items-center text-xs font-bold mb-1 text-gray-600">
                                        Top Icon Class
                                        <a
                                            href="https://fontawesome.com/v5/search?m=free"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 hover:underline font-normal text-[11px]"
                                        >
                                            Find Icons ↗
                                        </a>
                                    </label>
                                    <input
                                        className="w-full bg-white border border-gray-200 focus:border-[#7C3AED] p-2 rounded-xl outline-none text-xs"
                                        placeholder="e.g. fab fa-whatsapp or fas fa-phone-alt"
                                        value={cardForm.icon_class || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, icon_class: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold mb-1 text-gray-600">
                                        Top Image Upload (Overrides Icon)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        disabled={isUploadingImage}
                                        onChange={async (e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                const url = await handleUploadIcon(e.target.files[0]);
                                                if (url) setCardForm({ ...cardForm, image_url: url });
                                            }
                                        }}
                                        className="w-full text-[10px] text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 mb-1 cursor-pointer"
                                    />
                                    <input
                                        className="w-full bg-white border border-gray-200 focus:border-[#7C3AED] p-1.5 rounded-xl outline-none text-[11px]"
                                        placeholder="Or paste image URL..."
                                        value={cardForm.image_url || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, image_url: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Action Type Select */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                    Action Type <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={cardForm.action_type || "URL"}
                                    onChange={(e) => setCardForm({ ...cardForm, action_type: e.target.value as any })}
                                    className="w-full bg-gray-50 border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none cursor-pointer font-semibold"
                                >
                                    <option value="URL">WhatsApp Link / External URL</option>
                                    <option value="PHONE">Phone Dialer (Call)</option>
                                    <option value="EMAIL">Mail (with Pre-filled Message)</option>
                                </select>
                            </div>

                            {/* Dynamic Fields Based on Action Type */}
                            {cardForm.action_type === "URL" && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Target Link / URL <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={cardForm.target_url || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, target_url: e.target.value })}
                                        placeholder="https://chat.whatsapp.com/... or https://wa.me/91... or https://..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none"
                                    />
                                </div>
                            )}

                            {cardForm.action_type === "PHONE" && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Phone Number for Dialer <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={cardForm.phone_number || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, phone_number: e.target.value })}
                                        placeholder="e.g. +91 92891 21121"
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                    />
                                </div>
                            )}

                            {cardForm.action_type === "EMAIL" && (
                                <div className="space-y-3 p-3.5 bg-purple-50/50 border border-purple-200/70 rounded-2xl">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Recipient Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={cardForm.email_to || ""}
                                            onChange={(e) => setCardForm({ ...cardForm, email_to: e.target.value })}
                                            placeholder="e.g. admissions@thestartupschool.in"
                                            className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Email Subject / Title (Basic Title)
                                        </label>
                                        <input
                                            type="text"
                                            value={cardForm.email_subject || ""}
                                            onChange={(e) => setCardForm({ ...cardForm, email_subject: e.target.value })}
                                            placeholder="e.g. Inquiry regarding Setu Startup School Cohort 2026"
                                            className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Default Email Message / Body
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={cardForm.email_body || ""}
                                            onChange={(e) => setCardForm({ ...cardForm, email_body: e.target.value })}
                                            placeholder="e.g. Hi Setu Team, I am interested in learning more about the upcoming founder programs..."
                                            className="w-full bg-white border border-gray-300 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-xs text-gray-900 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Button Text & Badge */}
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
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Badge Label (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={cardForm.badge || ""}
                                        onChange={(e) => setCardForm({ ...cardForm, badge: e.target.value })}
                                        placeholder="e.g. Community, Admissions"
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] rounded-xl px-3.5 py-2 text-sm text-gray-900 outline-none"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
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
