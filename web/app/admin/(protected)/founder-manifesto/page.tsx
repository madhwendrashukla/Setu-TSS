"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import {
    Save,
    ExternalLink,
    CheckCircle2,
    AlertCircle,
    RotateCcw,
    Upload,
    Linkedin,
    Sparkles,
    Eye,
    Edit3,
    Quote,
    User,
    FileText,
} from "lucide-react";
import { ImageCropperModal } from "@/components/admin/ImageCropperModal";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

const DEFAULT_QUOTE = `“दिल में हो आग तो जलती रहनी चाहिए,<br />तेरा हो चाहे मेरा,<br /><span style="color: #A855F7">सपना ज़िंदा रहना चाहिए!</span>”`;

const DEFAULT_BODY_HTML = `<p>Knowledge not only removes the darkness of doubts and fears but also gives you the confidence to start right, the courage to aim for the sky.</p>

<p>Many promising startups fade into oblivion, not because their founders lack passion or ideas, but because they lack the right knowledge, guidance, and access to resources at the right time.</p>

<p>My mission is not just to give founders real courage and strength through knowledge, but <span style="color: #A855F7"><strong>also to give rocket speed to their dreams</strong></span> by providing access to the right resources.</p>

<p><span style="color: #A855F7"><strong>Having built startups in my career</strong></span>, I have experienced these challenges up close and felt this pain firsthand.</p>

<p>India today has thousands of B-schools. Yet, a fundamental question remains: Are they producing an equal number of startups? And more importantly, <span style="color: #A855F7"><strong>what percentage of aspiring founders would realistically invest two years and ₹10-30 lakhs in a B-School simply to learn how to build a successful startup?</strong></span></p>

<p>Additionally for the middle-class dreamer, choosing a startup over a steady paycheck is an act of war against social security. For a founder <span style="color: #A855F7"><strong>the “Opportunity Cost” of building a startup</strong></span> isn't just a line on a spreadsheet, it is a weight on a founder's soul, because Startups in India aren't built in garages, they are built at kitchen tables amidst family debates, silent sacrifices, and financial anxiety.</p>

<p>A startup's greatest enemy isn't competition, it's the “Initial Days Vacuum”. <span style="color: #A855F7"><strong>We talk about “funding”, but we forget about “foundation”</strong></span>. Many have the <span style="color: #A855F7"><strong>‘Keeda’</strong></span> (the itch) and the <span style="color: #A855F7"><strong>‘Himmat’</strong></span> (the courage), but courage without a compass is just a slow way to get lost.</p>

<p>The ecosystem treats early-stage startups like athletes. In reality, they need to be treated like infants. If you don't hold the hand that is trying to build, that hand will eventually reach for a corporate cubicle just to survive.</p>

<p>I believe tactical, hands-on support in the first 100 days is more valuable than a seed check in the first 300.</p>

<p>If we provide the right scaffolding to the aspiring founder, we won't just see more startups but also <span style="color: #A855F7"><strong>will unlock an era of unstoppable builders.</strong></span></p>

<p>I am not here just to teach. <span style="color: #A855F7"><strong>I am here to make sure the fire that made a founder start does not go out before the sun rises.</strong></span></p>`;

const DEFAULT_DATA = {
    prefix: "The Founder's Manifesto.",
    founder_name: "Gaurav Bansal",
    founder_photo_url: "/gaurav.webp",
    founder_linkedin_url: "https://www.linkedin.com/in/gauravbansal2",
    quote_heading: DEFAULT_QUOTE,
    body_html: DEFAULT_BODY_HTML,
    cta_text: `For all those who have “Keeda” and “Himmat” come join the gang!`,
};

const quillModules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, false] }],
        [{ font: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ list: "ordered" }, { list: "bullet" }],
        [
            {
                color: [
                    "#000000",
                    "#A855F7",
                    "#7C3AED",
                    "#9333EA",
                    "#2563EB",
                    "#059669",
                    "#DC2626",
                    "#D97706",
                    "#4B5563",
                    "#6B7280",
                    "#9CA3AF",
                    "#FFFFFF",
                ],
            },
            { background: [] },
        ],
        [{ align: [] }],
        ["link"],
        ["clean"],
    ],
};

export default function AdminFounderManifesto() {
    const [formData, setFormData] = useState(DEFAULT_DATA);
    const [allHeadings, setAllHeadings] = useState<any>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [savedSuccess, setSavedSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Image Cropper State
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

    // Active View Mode on mobile/desktop
    const [viewMode, setViewMode] = useState<"split" | "editor" | "preview">("split");

    const token = () => (typeof window !== "undefined" ? localStorage.getItem("adminToken") : "");
    const API = process.env.NEXT_PUBLIC_API_URL || "";

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`${API}/api/admin/site_settings`, {
                headers: { Authorization: `Bearer ${token()}` },
            });
            if (res.ok) {
                const data = await res.json();
                let headings: any = {};
                try {
                    headings = typeof data.section_headings === "string"
                        ? JSON.parse(data.section_headings)
                        : (data.section_headings || {});
                } catch (e) {
                    console.error("Failed to parse section headings", e);
                }
                setAllHeadings(headings);

                if (headings.founder_manifesto) {
                    const fm = headings.founder_manifesto;
                    setFormData({
                        prefix: fm.prefix !== undefined ? fm.prefix : DEFAULT_DATA.prefix,
                        founder_name: fm.founder_name !== undefined ? fm.founder_name : DEFAULT_DATA.founder_name,
                        founder_photo_url: fm.founder_photo_url !== undefined ? fm.founder_photo_url : DEFAULT_DATA.founder_photo_url,
                        founder_linkedin_url: fm.founder_linkedin_url !== undefined ? fm.founder_linkedin_url : DEFAULT_DATA.founder_linkedin_url,
                        quote_heading: fm.quote_heading !== undefined ? fm.quote_heading : DEFAULT_DATA.quote_heading,
                        body_html: fm.body_html !== undefined ? fm.body_html : DEFAULT_DATA.body_html,
                        cta_text: fm.cta_text !== undefined ? fm.cta_text : DEFAULT_DATA.cta_text,
                    });
                }
            }
        } catch (error) {
            console.error("Error fetching site settings:", error);
            setErrorMessage("Failed to load founder manifesto settings.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handlePhotoFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
            });
            reader.readAsDataURL(file);
        }
        e.target.value = "";
    };

    const handleCropComplete = async (croppedImage: File) => {
        setImageSrc(null);
        setIsUploadingPhoto(true);
        try {
            const fd = new FormData();
            fd.append("file", croppedImage);
            const uploadRes = await fetch(`${API}/api/admin/upload`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token()}` },
                body: fd,
            });
            if (uploadRes.ok) {
                const data = await uploadRes.json();
                if (data.url) {
                    setFormData(prev => ({ ...prev, founder_photo_url: data.url }));
                }
            } else {
                alert("Failed to upload photo. Please try again.");
            }
        } catch (err) {
            console.error("Error uploading cropped image:", err);
            alert("An error occurred during photo upload.");
        } finally {
            setIsUploadingPhoto(false);
        }
    };

    const handleSave = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setIsSaving(true);
        setErrorMessage("");
        setSavedSuccess(false);

        try {
            const updatedHeadings = {
                ...allHeadings,
                founder_manifesto: {
                    prefix: formData.prefix,
                    founder_name: formData.founder_name,
                    founder_photo_url: formData.founder_photo_url,
                    founder_linkedin_url: formData.founder_linkedin_url,
                    quote_heading: formData.quote_heading,
                    body_html: formData.body_html,
                    cta_text: formData.cta_text,
                },
            };

            const res = await fetch(`${API}/api/admin/site_settings`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token()}`,
                },
                body: JSON.stringify({ section_headings: updatedHeadings }),
            });

            if (res.ok) {
                setAllHeadings(updatedHeadings);
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 4000);
            } else {
                const errData = await res.json().catch(() => ({}));
                setErrorMessage(errData.error || "Failed to save founder manifesto settings.");
            }
        } catch (error) {
            console.error("Save error:", error);
            setErrorMessage("An error occurred while saving changes.");
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetDefaults = () => {
        if (window.confirm("Are you sure you want to reset all fields to the default copy with original styling and purple highlights? Any unsaved edits will be replaced.")) {
            setFormData(DEFAULT_DATA);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Top Header Card */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-[#A855F7] border border-purple-100 shadow-sm">
                            <Quote className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                            Founder Manifesto CMS
                        </h1>
                    </div>
                    <p className="text-sm text-gray-500 max-w-2xl">
                        Customize the Founder&apos;s Manifesto section displayed on the homepage. Edit quotes, author details, rich text body copy, purple color highlights, and call to action.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Link
                        href="/#manifesto"
                        target="_blank"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-sm border border-gray-200 transition-all shadow-sm hover:shadow"
                    >
                        <ExternalLink className="w-4 h-4 text-gray-500" />
                        View on Site
                    </Link>

                    <button
                        type="button"
                        onClick={handleResetDefaults}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-rose-50 text-gray-600 hover:text-rose-600 font-semibold rounded-xl text-sm border border-gray-200 hover:border-rose-200 transition-all shadow-sm"
                        title="Reset to default copy and purple highlights"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Reset Defaults
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSave()}
                        disabled={isSaving || isLoading}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold rounded-xl text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Notification Messages */}
            {savedSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <span><strong>Success!</strong> Founder Manifesto section has been updated successfully and is now live on the website.</span>
                </div>
            )}

            {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 px-5 py-4 rounded-xl flex items-center gap-3 text-sm animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span><strong>Error:</strong> {errorMessage}</span>
                </div>
            )}

            {/* View Mode Toggle (Mobile / Tablet / Desktop) */}
            <div className="flex justify-end lg:hidden">
                <div className="bg-gray-100 p-1 rounded-xl flex items-center text-xs font-semibold text-gray-600">
                    <button
                        type="button"
                        onClick={() => setViewMode("editor")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                            viewMode === "editor" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
                        }`}
                    >
                        <Edit3 className="w-3.5 h-3.5" /> Editor
                    </button>
                    <button
                        type="button"
                        onClick={() => setViewMode("preview")}
                        className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                            viewMode === "preview" ? "bg-white text-gray-900 shadow-sm" : "hover:text-gray-900"
                        }`}
                    >
                        <Eye className="w-3.5 h-3.5" /> Live Preview
                    </button>
                </div>
            </div>

            {/* Main Content: Split Grid on Desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* LEFT COLUMN: EDIT CONTROLS */}
                <div className={`space-y-6 lg:col-span-7 ${viewMode === "preview" ? "hidden lg:block" : "block"}`}>
                    
                    {/* Card 1: Section Header & Founder Profile */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100">
                            <User className="w-5 h-5 text-[#A855F7]" />
                            <h2 className="text-lg font-bold text-gray-900">Author & Section Tagline</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Pill Tagline
                                </label>
                                <input
                                    type="text"
                                    value={formData.prefix}
                                    onChange={(e) => setFormData({ ...formData, prefix: e.target.value })}
                                    placeholder="e.g. The Founder's Manifesto."
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7]"
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Founder Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.founder_name}
                                        onChange={(e) => setFormData({ ...formData, founder_name: e.target.value })}
                                        placeholder="e.g. Gaurav Bansal"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        LinkedIn Profile URL
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.founder_linkedin_url}
                                        onChange={(e) => setFormData({ ...formData, founder_linkedin_url: e.target.value })}
                                        placeholder="https://www.linkedin.com/in/..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7]"
                                    />
                                </div>
                            </div>

                            {/* Founder Photo Management */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                    Founder Profile Photo
                                </label>
                                <div className="flex flex-wrap items-center gap-4 p-4 rounded-xl bg-gray-50 border border-gray-200">
                                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-200">
                                        <img
                                            src={formData.founder_photo_url || "/gaurav.webp"}
                                            alt={formData.founder_name || "Founder"}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                (e.target as HTMLElement).setAttribute("src", "/gaurav.webp");
                                            }}
                                        />
                                    </div>
                                    <div className="flex-1 min-w-[200px] space-y-2">
                                        <div className="flex items-center gap-3">
                                            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold rounded-lg border border-gray-300 shadow-sm transition-all">
                                                <Upload className="w-3.5 h-3.5 text-gray-600" />
                                                {isUploadingPhoto ? "Uploading..." : "Upload & Crop Photo"}
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handlePhotoFileSelect}
                                                    className="hidden"
                                                    disabled={isUploadingPhoto}
                                                />
                                            </label>
                                            {formData.founder_photo_url !== "/gaurav.webp" && (
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData({ ...formData, founder_photo_url: "/gaurav.webp" })}
                                                    className="text-xs text-gray-500 hover:text-rose-600 font-semibold"
                                                >
                                                    Use Default
                                                </button>
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.founder_photo_url}
                                            onChange={(e) => setFormData({ ...formData, founder_photo_url: e.target.value })}
                                            placeholder="Direct Image URL (e.g. /gaurav.webp)"
                                            className="w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700 focus:outline-none focus:ring-1 focus:ring-[#A855F7]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2: Quote / Opening Heading */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="w-5 h-5 text-[#A855F7]" />
                                <h2 className="text-lg font-bold text-gray-900">Poem / Quote Heading (HTML)</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, quote_heading: DEFAULT_QUOTE })}
                                className="text-xs text-[#A855F7] hover:underline font-semibold"
                            >
                                Reset Quote
                            </button>
                        </div>

                        <p className="text-xs text-gray-500">
                            Supports HTML tags such as <code>&lt;br /&gt;</code> for line breaks and <code>&lt;span style=&quot;color: #A855F7&quot;&gt;...&lt;/span&gt;</code> for brand purple highlights.
                        </p>

                        <textarea
                            rows={4}
                            value={formData.quote_heading}
                            onChange={(e) => setFormData({ ...formData, quote_heading: e.target.value })}
                            placeholder="Enter opening quote or poem..."
                            className="w-full px-4 py-3 font-mono text-sm rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7] leading-relaxed"
                        />
                    </div>

                    {/* Card 3: Main Manifesto Body (Rich Text Editor) */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <FileText className="w-5 h-5 text-[#A855F7]" />
                                <h2 className="text-lg font-bold text-gray-900">Manifesto Body Content (Rich Text)</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, body_html: DEFAULT_BODY_HTML })}
                                className="text-xs text-[#A855F7] hover:underline font-semibold"
                            >
                                Reset Body
                            </button>
                        </div>

                        <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-3.5 text-xs text-purple-900 flex items-start gap-2.5">
                            <Sparkles className="w-4 h-4 text-[#A855F7] shrink-0 mt-0.5" />
                            <div>
                                <strong>Tip:</strong> Bold text and highlighted phrases automatically render in the vibrant brand purple (<code>#A855F7</code>). You can also use the color picker in the toolbar to style individual words or paragraphs.
                            </div>
                        </div>

                        <div className="quill-editor-wrapper">
                            <ReactQuill
                                theme="snow"
                                value={formData.body_html}
                                onChange={(val: string) => setFormData({ ...formData, body_html: val })}
                                modules={quillModules}
                                className="bg-white rounded-xl overflow-hidden min-h-[350px]"
                            />
                        </div>
                    </div>

                    {/* Card 4: Closing CTA */}
                    <div className="bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                            <div className="flex items-center gap-2.5">
                                <Sparkles className="w-5 h-5 text-[#A855F7]" />
                                <h2 className="text-lg font-bold text-gray-900">Closing Call to Action (CTA)</h2>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Bottom Callout Line
                            </label>
                            <input
                                type="text"
                                value={formData.cta_text}
                                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                                placeholder="e.g. For all those who have “Keeda” and “Himmat” come join the gang!"
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#A855F7]/30 focus:border-[#A855F7]"
                            />
                        </div>
                    </div>

                    {/* Floating Save Button at bottom of form */}
                    <div className="flex justify-end pt-2">
                        <button
                            type="button"
                            onClick={() => handleSave()}
                            disabled={isSaving || isLoading}
                            className="inline-flex items-center gap-2 px-8 py-3 bg-[#A855F7] hover:bg-[#9333EA] text-white font-bold rounded-xl text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Saving Changes...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>

                </div>

                {/* RIGHT COLUMN: REAL-TIME PREVIEW */}
                <div className={`space-y-4 lg:col-span-5 lg:sticky lg:top-8 ${viewMode === "editor" ? "hidden lg:block" : "block"}`}>
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                            <Eye className="w-4 h-4 text-[#A855F7]" />
                            Live Homepage Preview
                        </div>
                        <span className="text-[11px] text-gray-400">Updates in real-time</span>
                    </div>

                    <div className="bg-[#FAF8F5] rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-inner overflow-hidden max-h-[calc(100vh-140px)] overflow-y-auto">
                        
                        {/* Preview Section Header Pill */}
                        <div className="flex justify-center mb-10">
                            <span
                                className="text-[#A855F7] bg-white border border-[#A855F7]/40 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-sm"
                                dangerouslySetInnerHTML={{ __html: formData.prefix || "The Founder's Manifesto." }}
                            />
                        </div>

                        {/* Founder Profile Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-gray-200 shadow-sm bg-white">
                                <img
                                    src={formData.founder_photo_url || "/gaurav.webp"}
                                    alt={formData.founder_name || "Founder"}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLElement).setAttribute("src", "/gaurav.webp");
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-gray-900 text-xl font-bold tracking-tight">
                                    {formData.founder_name || "Gaurav Bansal"}
                                </h3>
                                {formData.founder_linkedin_url && (
                                    <a
                                        href={formData.founder_linkedin_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[#A855F7] text-xs font-semibold hover:underline mt-0.5"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" /> Connect on LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Left Border Body Content */}
                        <div className="border-l-[3px] border-[#A855F7] pl-5 sm:pl-6 space-y-5 text-gray-600 text-sm leading-[1.8]">
                            
                            {/* Quote Heading */}
                            <h2
                                className="text-xl sm:text-2xl font-bold text-black leading-[1.3] mb-6 tracking-tight"
                                dangerouslySetInnerHTML={{ __html: formData.quote_heading || DEFAULT_QUOTE }}
                            />

                            {/* Body HTML */}
                            <div
                                className="space-y-4 [&_p]:leading-[1.8] [&_p]:text-gray-600 [&_p]:text-sm [&_strong]:text-[#A855F7] [&_b]:text-[#A855F7] [&_a]:text-[#A855F7] [&_a]:underline"
                                dangerouslySetInnerHTML={{ __html: formData.body_html || DEFAULT_BODY_HTML }}
                            />

                            {/* CTA Line */}
                            {formData.cta_text && (
                                <p
                                    className="pt-2 font-bold text-base text-[#A855F7]"
                                    dangerouslySetInnerHTML={{ __html: formData.cta_text }}
                                />
                            )}
                        </div>

                    </div>
                </div>

            </div>

            {/* Image Cropper Modal */}
            {imageSrc && (
                <ImageCropperModal
                    imageSrc={imageSrc}
                    aspect={1}
                    onCropComplete={handleCropComplete}
                    onCancel={() => setImageSrc(null)}
                />
            )}
        </div>
    );
}
