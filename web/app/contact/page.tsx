'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SocialLink {
    id: string;
    name: string;
    handle: string;
    url: string;
    icon: string;
    color?: string;
    badge: string;
    is_active?: boolean;
}

interface FaqItem {
    id?: string;
    q: string;
    a: string;
    is_active?: boolean;
}

interface ContactPageData {
    badge_text: string;
    title: string;
    description: string;
    form_heading: string;
    form_subheading: string;
    lead_source_tag: string;
    submit_btn_text: string;
    success_heading: string;
    success_message: string;
    email: string;
    phone: string;
    address: string;
    chat_link: string;
    show_founder_card: boolean;
    founder_name: string;
    founder_title: string;
    founder_tag: string;
    founder_photo_url: string;
    founder_link: string;
    show_faqs: boolean;
    social_links: SocialLink[];
    faqs: FaqItem[];
}

const DEFAULT_CONTENT: ContactPageData = {
    badge_text: "Get in Touch • We're Here For You",
    title: 'Connect with <span class="text-[#A855F7]">Setu Startup School</span>',
    description: 'Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.',
    form_heading: 'Send Us a Message',
    form_subheading: 'Fill in the form below and our team will get back to you within 24 hours.',
    lead_source_tag: 'contact_page',
    submit_btn_text: 'Submit Inquiry',
    success_heading: 'Message Sent Successfully!',
    success_message: 'Thank you for reaching out! A member of the Setu Startup School team will connect with you shortly.',
    email: 'info@setustartupschool.com',
    phone: '+91 92891 21121',
    address: '98-103, Aditya Industrial Estate, behind Evershine Mall, Chincholi Bunder, Malad West, Mumbai, Maharashtra 400064',
    chat_link: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
    show_founder_card: true,
    founder_name: 'Gaurav Bansal',
    founder_title: 'Founder & Chief Mentor • Setu Startup School',
    founder_tag: 'Founder Profile',
    founder_photo_url: '/gaurav.webp',
    founder_link: '/gauravbansal',
    show_faqs: true,
    social_links: [
        {
            id: '1',
            name: 'LinkedIn',
            handle: 'Setu - TheStartupSchool',
            url: 'https://www.linkedin.com/company/the-startup-school-2026/',
            icon: 'fab fa-linkedin-in',
            color: 'text-[#0A66C2] bg-blue-50 border-blue-100 hover:bg-[#0A66C2] hover:text-white',
            badge: 'Professional Network',
        },
        {
            id: '2',
            name: 'Instagram',
            handle: '@the__startup__school',
            url: 'https://www.instagram.com/the__startup__school',
            icon: 'fab fa-instagram',
            color: 'text-[#E1306C] bg-pink-50 border-pink-100 hover:bg-[#E1306C] hover:text-white',
            badge: 'Behind the Scenes',
        },
        {
            id: '3',
            name: 'YouTube',
            handle: '@setustartupschool',
            url: 'https://youtube.com/@setustartupschool?si=UPdcAl5qcCH9gzow',
            icon: 'fab fa-youtube',
            color: 'text-[#FF0000] bg-red-50 border-red-100 hover:bg-[#FF0000] hover:text-white',
            badge: 'Masterclasses & Hacks',
        },
        {
            id: '4',
            name: 'WhatsApp Community',
            handle: 'Join Founder Group',
            url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
            icon: 'fab fa-whatsapp',
            color: 'text-[#25D366] bg-emerald-50 border-emerald-100 hover:bg-[#25D366] hover:text-white',
            badge: 'Direct Founder Group',
        },
        {
            id: '5',
            name: 'Twitter / X',
            handle: '@The_startup_sch',
            url: 'https://x.com/The_startup_sch',
            icon: 'fab fa-x-twitter',
            color: 'text-slate-900 bg-slate-100 border-slate-200 hover:bg-black hover:text-white',
            badge: 'Updates & Insights',
        },
    ],
    faqs: [
        {
            id: '1',
            q: 'Who is Setu Startup School for?',
            a: 'Setu is built for aspiring founders, early-stage builders, college students with startup ideas, and working professionals looking to transition into entrepreneurship. We bridge the 4 deadly gaps of Learning, Access, Mentoring, and Community.',
        },
        {
            id: '2',
            q: 'What happens after I submit this inquiry form?',
            a: 'Our admissions & founder relations team reviews your note and contacts you via WhatsApp or Email within 24 hours to guide you on the right program, cohort, or next steps.',
        },
        {
            id: '3',
            q: 'Are your programs and workshops online or in-person?',
            a: 'We offer interactive live online cohort sessions accessible across Bharat and globally, as well as exclusive in-person mixer sessions and workshops in major hub cities like Mumbai, Bengaluru, and Delhi NCR.',
        },
        {
            id: '4',
            q: 'Can I connect directly with mentor Gaurav Bansal?',
            a: 'Yes! You can visit his dedicated profile at foundersschool.in/gauravbansal to save his contact card, explore his masterclasses, or connect directly on LinkedIn.',
        },
    ],
};

export default function ContactPage() {
    const [pageContent, setPageContent] = useState<ContactPageData>(DEFAULT_CONTENT);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        city: '',
        profileType: 'Aspiring Founder',
        source: 'Cohort 2026 Programs',
        message: '',
    });

    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [sourceOptions, setSourceOptions] = useState<{ id: string; label: string }[]>([]);
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        // 1. Fetch CMS Content for Contact Page
        fetch(`${API_URL}/api/contact-page`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && typeof data === 'object') {
                    setPageContent((prev) => ({
                        ...prev,
                        badge_text: data.badge_text || prev.badge_text,
                        title: data.title || prev.title,
                        description: data.description || prev.description,
                        form_heading: data.form_heading || prev.form_heading,
                        form_subheading: data.form_subheading || prev.form_subheading,
                        lead_source_tag: data.lead_source_tag || prev.lead_source_tag,
                        submit_btn_text: data.submit_btn_text || prev.submit_btn_text,
                        success_heading: data.success_heading || prev.success_heading,
                        success_message: data.success_message || prev.success_message,
                        email: data.email || prev.email,
                        phone: data.phone || prev.phone,
                        address: data.address || prev.address,
                        chat_link: data.chat_link || prev.chat_link,
                        show_founder_card: data.show_founder_card !== false,
                        founder_name: data.founder_name || prev.founder_name,
                        founder_title: data.founder_title || prev.founder_title,
                        founder_tag: data.founder_tag || prev.founder_tag,
                        founder_photo_url: data.founder_photo_url || prev.founder_photo_url,
                        founder_link: data.founder_link || prev.founder_link,
                        show_faqs: data.show_faqs !== false,
                        social_links: Array.isArray(data.social_links) && data.social_links.length > 0 ? data.social_links : prev.social_links,
                        faqs: Array.isArray(data.faqs) && data.faqs.length > 0 ? data.faqs : prev.faqs,
                    }));
                }
            })
            .catch(() => {});

        // 2. Fetch Lead Sources for Dropdown
        fetch(`${API_URL}/api/lead-sources`)
            .then((res) => (res.ok ? res.json() : []))
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setSourceOptions(data);
                }
            })
            .catch(() => {});
    }, [API_URL]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopiedItem(label);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const combinedMessage = [
                formData.profileType ? `[Profile: ${formData.profileType}]` : '',
                formData.message ? formData.message : 'Submitted from dedicated /contact page',
            ]
                .filter(Boolean)
                .join(' ');

            // Use selected interest or the CMS-configured lead_source_tag
            const payload = {
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                city: formData.city.trim() || 'Online',
                source: formData.source || pageContent.lead_source_tag || 'contact_page',
                message: combinedMessage,
            };

            let res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                // Fallback to production if local proxy fails
                res = await fetch('https://foundersschool.in/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                setStatus('success');
                setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    city: '',
                    profileType: 'Aspiring Founder',
                    source: 'Cohort 2026 Programs',
                    message: '',
                });
            } else {
                const data = await res.json().catch(() => ({}));
                setErrorMessage(data?.error || 'Failed to submit inquiry. Please try again.');
                setStatus('error');
            }
        } catch {
            setErrorMessage('Network error. Please try again or reach out via email directly.');
            setStatus('error');
        }
    };

    return (
        <div className="min-h-screen bg-bg-main relative pt-24 sm:pt-28 md:pt-36 pb-24 px-4 sm:px-6 md:px-8 flex flex-col items-center justify-start overflow-hidden">
            {/* Ambient Background Orbs */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] md:w-[1000px] h-[380px] bg-accent-violet/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute top-[45%] right-[-10%] w-[500px] h-[500px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[10%] left-[-10%] w-[450px] h-[450px] bg-accent-violet/5 rounded-full blur-[110px] pointer-events-none" />

            {/* ── Page Hero Header ─────────────────────────────────────────── */}
            <div className="max-w-4xl mx-auto text-center relative z-10 mb-12 md:mb-16">
                {pageContent.badge_text && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white border border-[#A855F7]/30 text-[#7C3AED] shadow-sm mb-5">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
                        {pageContent.badge_text}
                    </div>
                )}

                {/* Rich Text Title */}
                <div
                    className="text-4xl sm:text-5xl md:text-6xl font-black text-text-primary tracking-tight mb-5 leading-tight rich-text-header"
                    dangerouslySetInnerHTML={{ __html: pageContent.title }}
                />

                {/* Rich Text Description */}
                <div
                    className="text-base sm:text-lg md:text-xl text-text-secondary max-w-2xl mx-auto font-light leading-relaxed rich-text-body"
                    dangerouslySetInnerHTML={{ __html: pageContent.description }}
                />
            </div>

            {/* ── Main Two Column Grid ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 w-full max-w-7xl relative z-10 mb-20">

                {/* ── LEFT COLUMN: Interactive Contact Form (7 Cols) ───────── */}
                <div className="lg:col-span-7 flex flex-col">
                    <div className="bg-white/95 backdrop-blur-2xl border border-functional-border shadow-xl shadow-purple-950/5 rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden flex-1 flex flex-col justify-between">
                        {/* Top Gradient Stripe */}
                        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-[#A855F7] via-[#8B3DFF] to-[#7C3AED]" />

                        <div>
                            <div className="mb-8">
                                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight mb-2">
                                    {pageContent.form_heading}
                                </h2>
                                <p className="text-sm text-text-secondary">
                                    {pageContent.form_subheading}
                                </p>
                            </div>

                            {status === 'success' ? (
                                <div className="py-12 px-6 text-center flex flex-col items-center justify-center bg-purple-50/60 border border-purple-200/80 rounded-2xl animate-in fade-in">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-600/25 mb-5">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <h3 className="text-2xl font-bold text-text-primary mb-2">
                                        {pageContent.success_heading}
                                    </h3>
                                    <p className="text-text-secondary text-sm max-w-md mx-auto mb-6">
                                        {pageContent.success_message}
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="px-6 py-2.5 rounded-full bg-accent-blue hover:bg-accent-royal text-white text-sm font-bold shadow-md transition-all cursor-pointer"
                                    >
                                        Send Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Name & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                placeholder="e.g. Rahul Sharma"
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium placeholder:text-text-secondary/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="e.g. rahul@example.com"
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium placeholder:text-text-secondary/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Phone & City */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                Phone / WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                required
                                                pattern="[0-9]{10}"
                                                title="Please enter a valid 10-digit mobile number"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="10-digit Mobile No."
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium placeholder:text-text-secondary/50 outline-none transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                City / Location
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="e.g. Mumbai, Bengaluru, Delhi"
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium placeholder:text-text-secondary/50 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Type & Inquiry Type */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                I am a / an
                                            </label>
                                            <select
                                                name="profileType"
                                                value={formData.profileType}
                                                onChange={handleChange}
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium outline-none transition-all cursor-pointer"
                                            >
                                                <option value="Aspiring Founder">Aspiring Founder (Idea Stage)</option>
                                                <option value="Early Stage Founder">Early Stage Founder (MVP / Traction)</option>
                                                <option value="Growth Stage Founder">Growth Stage Founder (Scaling)</option>
                                                <option value="Student / Young Builder">Student / College Builder</option>
                                                <option value="Mentor / Angel Investor">Mentor / Angel Investor</option>
                                                <option value="Ecosystem / Corporate Partner">Ecosystem / Corporate Partner</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                                Inquiry Regarding
                                            </label>
                                            <select
                                                name="source"
                                                value={formData.source}
                                                onChange={handleChange}
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium outline-none transition-all cursor-pointer"
                                            >
                                                {sourceOptions.length > 0 ? (
                                                    sourceOptions.map((opt) => (
                                                        <option key={opt.id} value={opt.label || opt.id}>
                                                            {opt.label}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="Cohort 2026 Programs">Cohort 2026 Programs</option>
                                                        <option value="1-on-1 Mentorship">1-on-1 Mentorship</option>
                                                        <option value="Fundraising Workshop">Fundraising Workshop</option>
                                                        <option value="Founders Speed Dating">Founders Speed Dating</option>
                                                        <option value="Partnership & Sponsorship">Partnership &amp; Sponsorship</option>
                                                        <option value="General Inquiry">General Inquiry</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div>
                                        <label className="block text-xs font-bold text-text-primary uppercase tracking-wider mb-1.5">
                                            Your Message / What are you building? (Optional)
                                        </label>
                                        <textarea
                                            name="message"
                                            rows={3}
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Tell us a little about your startup idea or what you'd like to discuss..."
                                            className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl px-4 py-3 text-sm text-text-primary font-medium placeholder:text-text-secondary/50 outline-none transition-all resize-none"
                                        />
                                    </div>

                                    {/* Error Display */}
                                    {status === 'error' && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                                            <i className="fas fa-exclamation-circle"></i>
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-4 px-8 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#8B3DFF] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white font-bold text-base shadow-[0_8px_25px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-70 disabled:pointer-events-none"
                                    >
                                        {status === 'loading' ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i>
                                                <span>Submitting Inquiry...</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>{pageContent.submit_btn_text || 'Submit Inquiry'}</span>
                                                <i className="fas fa-arrow-right text-sm"></i>
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Privacy notice */}
                        <div className="mt-6 pt-4 border-t border-functional-border/60 text-center">
                            <p className="text-[11px] text-text-secondary">
                                <i className="fas fa-lock text-accent-blue mr-1"></i>
                                We respect your privacy. Your information is protected under our{' '}
                                <Link href="/privacy-policy" className="text-accent-blue underline hover:text-accent-royal">
                                    Privacy Policy
                                </Link>
                                .
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Details, Socials & Highlights (5 Cols) ──── */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-start">

                    {/* 1. Direct Contact Information */}
                    <div className="bg-white/95 backdrop-blur-xl border border-functional-border shadow-lg shadow-purple-950/5 rounded-3xl p-6 sm:p-7">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-blue mb-5">
                            Direct Reach
                        </h3>

                        <div className="space-y-4">
                            {/* Email */}
                            {pageContent.email && (
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-bg-main/70 border border-functional-border/60 hover:border-accent-blue/30 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#7C3AED] flex items-center justify-center text-base shrink-0 group-hover:bg-[#7C3AED] group-hover:text-white transition-all">
                                        <i className="fas fa-envelope"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                                            Email Us
                                        </span>
                                        <a
                                            href={`mailto:${pageContent.email}`}
                                            className="text-sm font-bold text-text-primary hover:text-accent-blue transition-colors truncate block"
                                        >
                                            {pageContent.email}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(pageContent.email, 'email')}
                                        className="text-xs text-text-secondary hover:text-accent-blue px-2.5 py-1 rounded-lg bg-white border border-functional-border shadow-2xs transition-all cursor-pointer"
                                        title="Copy Email"
                                    >
                                        {copiedItem === 'email' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            )}

                            {/* Phone */}
                            {pageContent.phone && (
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-bg-main/70 border border-functional-border/60 hover:border-accent-blue/30 transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#059669] flex items-center justify-center text-base shrink-0 group-hover:bg-[#059669] group-hover:text-white transition-all">
                                        <i className="fas fa-phone-alt"></i>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                                            Helpline / WhatsApp
                                        </span>
                                        <a
                                            href={`tel:${pageContent.phone.replace(/[^0-9+]/g, '')}`}
                                            className="text-sm font-bold text-text-primary hover:text-accent-blue transition-colors block"
                                        >
                                            {pageContent.phone}
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(pageContent.phone, 'phone')}
                                        className="text-xs text-text-secondary hover:text-accent-blue px-2.5 py-1 rounded-lg bg-white border border-functional-border shadow-2xs transition-all cursor-pointer"
                                        title="Copy Phone"
                                    >
                                        {copiedItem === 'phone' ? 'Copied!' : 'Copy'}
                                    </button>
                                </div>
                            )}

                            {/* Address */}
                            {pageContent.address && (
                                <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-bg-main/70 border border-functional-border/60">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#0A66C2] flex items-center justify-center text-base shrink-0">
                                        <i className="fas fa-location-dot"></i>
                                    </div>
                                    <div>
                                        <span className="text-[11px] font-bold text-text-secondary uppercase tracking-wider block">
                                            Campus &amp; Office
                                        </span>
                                        <p className="text-xs text-text-secondary leading-relaxed font-medium mt-0.5">
                                            {pageContent.address}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Quick WhatsApp Chat */}
                            {pageContent.chat_link && (
                                <a
                                    href={pageContent.chat_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 hover:bg-emerald-100 transition-all text-emerald-950 group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-base shrink-0 shadow-xs">
                                            <i className="fab fa-whatsapp"></i>
                                        </div>
                                        <div>
                                            <span className="block font-bold text-xs">Direct WhatsApp Connect</span>
                                            <span className="text-[11px] text-emerald-700">Chat with team / join founder group</span>
                                        </div>
                                    </div>
                                    <i className="fas fa-arrow-right text-xs text-emerald-700 group-hover:translate-x-1 transition-transform"></i>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* 2. Social Media Hub */}
                    {pageContent.social_links && pageContent.social_links.length > 0 && (
                        <div className="bg-white/95 backdrop-blur-xl border border-functional-border shadow-lg shadow-purple-950/5 rounded-3xl p-6 sm:p-7">
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-accent-blue mb-2">
                                Official Social Channels
                            </h3>
                            <p className="text-xs text-text-secondary mb-4">
                                Follow our daily startup insights, masterclasses, and community updates.
                            </p>

                            <div className="space-y-2.5">
                                {pageContent.social_links.map((s) => (
                                    <a
                                        key={s.id || s.name}
                                        href={s.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-between p-3 rounded-2xl bg-bg-main/60 border border-functional-border/70 hover:border-accent-blue/40 hover:bg-white transition-all duration-200 group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm border transition-all ${
                                                    s.color || 'text-purple-600 bg-purple-50 border-purple-100'
                                                }`}
                                            >
                                                <i className={s.icon || 'fas fa-link'}></i>
                                            </div>
                                            <div>
                                                <span className="block font-bold text-text-primary text-xs group-hover:text-accent-blue transition-colors">
                                                    {s.name}
                                                </span>
                                                <span className="text-[11px] text-text-secondary font-medium">
                                                    {s.handle}
                                                </span>
                                            </div>
                                        </div>
                                        {s.badge && (
                                            <span className="text-[10px] uppercase font-bold tracking-wider text-accent-violet px-2.5 py-1 rounded-full bg-purple-50 border border-purple-100 group-hover:bg-purple-100 transition-colors">
                                                {s.badge}
                                            </span>
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 3. Founder Card Highlight */}
                    {pageContent.show_founder_card && (
                        <Link
                            href={pageContent.founder_link || '/gauravbansal'}
                            className="group relative overflow-hidden rounded-3xl p-5 bg-gradient-to-r from-[#13113B] to-[#1E2640] text-white shadow-xl shadow-purple-950/10 border border-purple-500/20 flex items-center justify-between hover:scale-[1.01] transition-all duration-300"
                        >
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-13 h-13 rounded-full p-[2px] bg-gradient-to-tr from-[#A855F7] to-[#7C3AED] shrink-0">
                                    <Image
                                        src={pageContent.founder_photo_url || '/gaurav.webp'}
                                        alt={pageContent.founder_name || 'Gaurav Bansal'}
                                        width={52}
                                        height={52}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#A855F7] block">
                                        {pageContent.founder_tag || 'Founder Profile'}
                                    </span>
                                    <h4 className="font-bold text-base text-white group-hover:text-[#A855F7] transition-colors">
                                        Connect with {pageContent.founder_name || 'Gaurav Bansal'}
                                    </h4>
                                    <p className="text-[11px] text-slate-400">
                                        {pageContent.founder_title || 'Founder & Chief Mentor • Setu Startup School'}
                                    </p>
                                </div>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#13113B] transition-all shrink-0">
                                <i className="fas fa-arrow-right text-xs"></i>
                            </div>
                        </Link>
                    )}

                </div>
            </div>

            {/* ── 3. Frequently Asked Questions ────────────────────────────── */}
            {pageContent.show_faqs && pageContent.faqs && pageContent.faqs.length > 0 && (
                <div className="w-full max-w-4xl mx-auto relative z-10">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight mb-2">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-sm text-text-secondary">
                            Quick answers to common questions about connecting and programs.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {pageContent.faqs.map((faq, idx) => {
                            const isOpen = openFaq === idx;
                            return (
                                <div
                                    key={faq.id || idx}
                                    className="bg-white/90 backdrop-blur-md border border-functional-border rounded-2xl overflow-hidden shadow-2xs transition-all"
                                >
                                    <button
                                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                                        className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-text-primary hover:text-accent-blue transition-colors cursor-pointer"
                                    >
                                        <span>{faq.q}</span>
                                        <i
                                            className={`fas fa-chevron-down text-xs text-text-secondary transition-transform duration-200 ${
                                                isOpen ? 'rotate-180 text-accent-blue' : ''
                                            }`}
                                        />
                                    </button>
                                    {isOpen && (
                                        <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-text-secondary leading-relaxed border-t border-functional-border/40">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

        </div>
    );
}
