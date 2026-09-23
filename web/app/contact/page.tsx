'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Users, 
    MessageSquare, 
    Calendar, 
    MessageCircle, 
    Mail, 
    Phone, 
    HelpCircle, 
    ArrowRight, 
    ArrowLeft, 
    Sparkles, 
    X, 
    Check, 
    Star, 
    AlertCircle,
    ExternalLink,
    Rocket
} from 'lucide-react';

interface ActionCard {
    id: string;
    title: string;
    description: string;
    button_text: string;
    button_url?: string;
    action_type?: 'whatsapp' | 'url' | 'email' | 'phone' | 'feedback_modal' | 'inquiry_modal';
    icon?: string;
    badge?: string;
    display_order?: number;
    is_active?: boolean;
}

interface InfoBoxItem {
    id: string;
    text: string;
    display_order?: number;
    is_active?: boolean;
}

interface ContactPageData {
    badge_text: string;
    title: string;
    description: string;
    back_btn_text: string;
    back_btn_link: string;
    action_cards: ActionCard[];
    show_info_box: boolean;
    info_box_title: string;
    info_box_icon: string;
    info_box_items: InfoBoxItem[];
    email: string;
    phone: string;
    chat_link: string;
    lead_source_tag: string;
}

const DEFAULT_CONTENT: ContactPageData = {
    badge_text: "Get in Touch • We're Here For You",
    title: 'Connect with <span class="text-accent-violet">Setu Startup School.</span>',
    description: '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
    back_btn_text: '← Back',
    back_btn_link: '/',
    action_cards: [
        {
            id: '1',
            title: 'WhatsApp community',
            description: 'Join founders across Bharat. Ask questions, collaborate, and get peer feedback.',
            button_text: 'Join community →',
            button_url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
            action_type: 'whatsapp',
            icon: 'users',
            badge: 'Community',
            display_order: 0,
            is_active: true,
        },
        {
            id: '2',
            title: 'Message us on WhatsApp',
            description: 'Quickest way to reach our admissions and founder support team.',
            button_text: 'Chat on WhatsApp →',
            button_url: 'https://wa.me/919289121121',
            action_type: 'whatsapp',
            icon: 'message',
            badge: 'Direct Connect',
            display_order: 1,
            is_active: true,
        },
        {
            id: '3',
            title: 'Book a 1-on-1 Mentor Call',
            description: 'Talk to mentor Gaurav Bansal about your startup idea, pitch deck, or traction.',
            button_text: 'Book a slot →',
            button_url: 'https://foundersschool.in/gauravbansal',
            action_type: 'url',
            icon: 'calendar',
            badge: 'Mentorship',
            display_order: 2,
            is_active: true,
        },
        {
            id: '4',
            title: 'Program & Cohort Inquiry',
            description: 'Have questions regarding Cohort 2026, Startup Launchpad, or masterclasses?',
            button_text: 'Send inquiry →',
            button_url: '',
            action_type: 'inquiry_modal',
            icon: 'mail',
            badge: 'Admissions',
            display_order: 3,
            is_active: true,
        },
        {
            id: '5',
            title: 'Partnerships & E-Cells',
            description: 'Partner as an incubator, investor network, college E-Cell, or corporate sponsor.',
            button_text: 'Partner with us →',
            button_url: '',
            action_type: 'inquiry_modal',
            icon: 'sparkles',
            badge: 'Partnership',
            display_order: 4,
            is_active: true,
        },
        {
            id: '6',
            title: 'Give feedback & Ideas',
            description: 'Tell us what startup topics, tools, or founder workshops you want to see next.',
            button_text: 'Share feedback →',
            button_url: '',
            action_type: 'feedback_modal',
            icon: 'feedback',
            badge: 'Your Voice',
            display_order: 5,
            is_active: true,
        },
    ],
    show_info_box: true,
    info_box_title: 'How we can help you',
    info_box_icon: 'fas fa-question-circle',
    info_box_items: [
        { id: '1', text: 'Guidance on choosing the right cohort, incubation program, or masterclass for your startup stage.', display_order: 0, is_active: true },
        { id: '2', text: '1-on-1 mentorship, pitch deck reviews, and fundraising support.', display_order: 1, is_active: true },
        { id: '3', text: 'Joining the founder WhatsApp community and attending offline mixer sessions.', display_order: 2, is_active: true },
        { id: '4', text: 'Queries regarding admissions, session schedules, invoices, or founder certificates.', display_order: 3, is_active: true },
        { id: '5', text: 'Ecosystem partnerships, college E-Cell collaborations, and angel investor network connects.', display_order: 4, is_active: true },
    ],
    email: 'info@setustartupschool.com',
    phone: '+91 92891 21121',
    chat_link: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
    lead_source_tag: 'contact_page',
};

export default function ContactPage() {
    const [pageContent, setPageContent] = useState<ContactPageData>(DEFAULT_CONTENT);
    const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
    const [inquiryModalOpen, setInquiryModalOpen] = useState(false);

    // Feedback Form State
    const [feedbackForm, setFeedbackForm] = useState({
        name: '',
        email: '',
        rating: 5,
        category: 'General Feedback',
        message: '',
    });
    const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [feedbackError, setFeedbackError] = useState('');

    // Inquiry Form State
    const [inquiryForm, setInquiryForm] = useState({
        name: '',
        email: '',
        phone: '',
        subject: 'General Support Inquiry',
        message: '',
    });
    const [inquiryStatus, setInquiryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [inquiryError, setInquiryError] = useState('');

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    useEffect(() => {
        fetch(`${API_URL}/api/contact-page`)
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data && typeof data === 'object') {
                    setPageContent((prev) => ({
                        ...prev,
                        badge_text: data.badge_text ?? prev.badge_text,
                        title: data.title || prev.title,
                        description: data.description || prev.description,
                        back_btn_text: data.back_btn_text ?? prev.back_btn_text,
                        back_btn_link: data.back_btn_link ?? prev.back_btn_link,
                        action_cards: Array.isArray(data.action_cards) && data.action_cards.length > 0 
                            ? data.action_cards 
                            : prev.action_cards,
                        show_info_box: data.show_info_box !== false,
                        info_box_title: data.info_box_title ?? prev.info_box_title,
                        info_box_icon: data.info_box_icon ?? prev.info_box_icon,
                        info_box_items: Array.isArray(data.info_box_items) && data.info_box_items.length > 0 
                            ? data.info_box_items 
                            : prev.info_box_items,
                        email: data.email ?? prev.email,
                        phone: data.phone ?? prev.phone,
                        chat_link: data.chat_link ?? prev.chat_link,
                        lead_source_tag: data.lead_source_tag ?? prev.lead_source_tag,
                    }));
                }
            })
            .catch(() => {});
    }, [API_URL]);

    // Render action card icon
    const renderCardIcon = (iconType?: string) => {
        const iconKey = (iconType || '').toLowerCase();
        if (iconKey.includes('user') || iconKey.includes('community')) {
            return <Users className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('message') || iconKey.includes('chat') || iconKey.includes('whatsapp')) {
            return <MessageSquare className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('calendar') || iconKey.includes('slot') || iconKey.includes('call') || iconKey.includes('book')) {
            return <Calendar className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('feedback') || iconKey.includes('comment') || iconKey.includes('review')) {
            return <MessageCircle className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('mail') || iconKey.includes('email') || iconKey.includes('envelope')) {
            return <Mail className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('phone') || iconKey.includes('tel') || iconKey.includes('mobile')) {
            return <Phone className="w-6 h-6 text-[#7C3AED]" />;
        }
        if (iconKey.includes('rocket')) {
            return <Rocket className="w-6 h-6 text-[#7C3AED]" />;
        }
        return <Sparkles className="w-6 h-6 text-[#7C3AED]" />;
    };

    // Handle clicking a card button
    const handleCardAction = (card: ActionCard) => {
        const type = card.action_type || 'url';
        
        if (type === 'feedback_modal') {
            setFeedbackModalOpen(true);
            return;
        }

        if (type === 'inquiry_modal') {
            setInquiryModalOpen(true);
            return;
        }

        if (type === 'whatsapp') {
            const url = card.button_url || pageContent.chat_link || 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4';
            window.open(url, '_blank', 'noopener,noreferrer');
            return;
        }

        if (type === 'email') {
            const url = card.button_url || `mailto:${pageContent.email || 'info@setustartupschool.com'}`;
            window.location.href = url;
            return;
        }

        if (type === 'phone') {
            const rawPhone = (card.button_url || pageContent.phone || '+91 92891 21121').replace(/[^0-9+]/g, '');
            window.location.href = `tel:${rawPhone}`;
            return;
        }

        // Generic URL
        if (card.button_url) {
            if (card.button_url.startsWith('http')) {
                window.open(card.button_url, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = card.button_url;
            }
        }
    };

    // Submit Feedback to Backend
    const handleFeedbackSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFeedbackStatus('loading');
        setFeedbackError('');

        try {
            const payload = {
                name: feedbackForm.name.trim() || 'Anonymous User',
                email: feedbackForm.email.trim() || 'feedback@foundersschool.in',
                phone: 'N/A',
                city: 'Web Support Portal',
                source: 'contact_feedback',
                message: `[Rating: ${feedbackForm.rating}/5 stars] [Category: ${feedbackForm.category}] ${feedbackForm.message}`,
            };

            let res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                res = await fetch('https://foundersschool.in/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                setFeedbackStatus('success');
                setFeedbackForm({
                    name: '',
                    email: '',
                    rating: 5,
                    category: 'General Feedback',
                    message: '',
                });
            } else {
                const data = await res.json().catch(() => ({}));
                setFeedbackError(data?.error || 'Failed to submit feedback. Please try again.');
                setFeedbackStatus('error');
            }
        } catch {
            setFeedbackError('Network error. Please try again later.');
            setFeedbackStatus('error');
        }
    };

    // Submit Inquiry to Backend
    const handleInquirySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setInquiryStatus('loading');
        setInquiryError('');

        try {
            const payload = {
                name: inquiryForm.name.trim(),
                email: inquiryForm.email.trim(),
                phone: inquiryForm.phone.trim() || 'N/A',
                city: 'Web Support Portal',
                source: pageContent.lead_source_tag || 'contact_support',
                message: `[Subject: ${inquiryForm.subject}] ${inquiryForm.message}`,
            };

            let res = await fetch(`${API_URL}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                res = await fetch('https://foundersschool.in/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (res.ok) {
                setInquiryStatus('success');
                setInquiryForm({
                    name: '',
                    email: '',
                    phone: '',
                    subject: 'General Support Inquiry',
                    message: '',
                });
            } else {
                const data = await res.json().catch(() => ({}));
                setInquiryError(data?.error || 'Failed to send message. Please try again.');
                setInquiryStatus('error');
            }
        } catch {
            setInquiryError('Network error. Please reach out directly via email or WhatsApp.');
            setInquiryStatus('error');
        }
    };

    const activeCards = (pageContent.action_cards || []).filter((c) => c.is_active !== false);
    const activeInfoItems = (pageContent.info_box_items || []).filter((i) => i.is_active !== false);

    return (
        <div className="pt-32 pb-24 min-h-screen bg-bg-main relative overflow-hidden flex items-center justify-center">
            
            {/* Ambient Background Elements matching Tools page */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-violet/5 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="text-center px-4 sm:px-6 relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
                
                {/* ── 1. Top Navigation & Centered Header ────────────────────── */}
                <div className="w-full flex justify-start mb-6">
                    <Link
                        href={pageContent.back_btn_link || '/'}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-black transition-colors group cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                        <span>{pageContent.back_btn_text?.replace('←', '').trim() || 'Back'}</span>
                    </Link>
                </div>

                {/* Main Headline (Rich Text Enabled) */}
                <h1 
                    className="text-4xl md:text-6xl font-black text-black mb-4 tracking-tight text-center leading-tight [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: pageContent.title || 'Connect with <span class="text-accent-violet">Setu Startup School.</span>' }}
                />

                {/* Subtitle / Tagline (Rich Text Enabled) */}
                <div 
                    className="text-base sm:text-lg md:text-xl text-text-secondary font-medium max-w-2xl mx-auto mb-14 text-center leading-relaxed [&_p]:m-0"
                    dangerouslySetInnerHTML={{ __html: pageContent.description || '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>' }}
                />

                {/* ── 2. Action Cards Grid (2-Column) ─────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left relative z-10 w-full mb-8">
                    {activeCards.map((card) => (
                        <div
                            key={card.id || card.title}
                            className="bg-white p-8 md:p-9 rounded-3xl border border-black/5 relative overflow-hidden flex flex-col items-start justify-between gap-4 hover:border-accent-violet/30 hover:shadow-[0_8px_30px_rgba(124,58,237,0.08)] group transition-all duration-200"
                        >
                            <div className="w-full">
                                {card.badge && (
                                    <span className="text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest inline-block bg-accent-violet/10 text-accent-violet mb-4">
                                        {card.badge}
                                    </span>
                                )}

                                <div className="flex items-start gap-4 mb-2">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] border border-purple-100/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                                        {renderCardIcon(card.icon || card.title)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl md:text-2xl font-bold text-black tracking-tight mb-1">
                                            {card.title}
                                        </h3>
                                        <div className="w-8 h-0.5 bg-accent-violet/30 mb-2"></div>
                                    </div>
                                </div>

                                <p className="text-text-secondary leading-relaxed text-sm mb-6 max-w-sm">
                                    {card.description}
                                </p>
                            </div>

                            {/* Action Button - Exact Color Match with Connect button */}
                            <div>
                                <button
                                    onClick={() => handleCardAction(card)}
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#7C3AED] hover:bg-[#5A1EEB] text-white text-sm font-bold shadow-md hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
                                >
                                    <span>{card.button_text || 'Open →'}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── 3. "How we can help you" Info Box ───────────────────────── */}
                {pageContent.show_info_box && (
                    <div className="bg-white p-8 md:p-10 rounded-3xl border border-black/5 shadow-[0_4px_20px_rgba(0,0,0,0.03)] w-full text-left space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                                <HelpCircle className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                                {pageContent.info_box_title || 'How we can help you'}
                            </h2>
                        </div>
                        <div className="w-10 h-0.5 bg-accent-violet/30 mb-3"></div>

                        <ul className="space-y-3 pt-1">
                            {activeInfoItems.map((item) => (
                                <li key={item.id} className="flex items-start gap-3 text-sm text-text-secondary leading-relaxed font-medium">
                                    <span className="w-2 h-2 rounded-full bg-[#7C3AED] mt-2 shrink-0"></span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* ── 4. Interactive Feedback Modal ───────────────────────────────── */}
            {feedbackModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => {
                                setFeedbackModalOpen(false);
                                setFeedbackStatus('idle');
                            }}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                                <MessageCircle className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Share Your Feedback &amp; Ideas</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Tell us what is working, what needs improvement, or suggestions for new masterclasses.
                            </p>
                        </div>

                        {feedbackStatus === 'success' ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                                    <Check className="w-7 h-7" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Thank You for Your Feedback!</h4>
                                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                                    Your response has been recorded. Our team reviews every note to improve Setu Startup School.
                                </p>
                                <button
                                    onClick={() => {
                                        setFeedbackModalOpen(false);
                                        setFeedbackStatus('idle');
                                    }}
                                    className="mt-4 px-6 py-2 rounded-full bg-[#7C3AED] hover:bg-[#5A1EEB] text-white text-xs font-bold transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                        Overall Experience Rating
                                    </label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                                                className={`p-1.5 rounded-lg transition-transform hover:scale-110 cursor-pointer ${
                                                    star <= feedbackForm.rating ? 'text-amber-400' : 'text-gray-300'
                                                }`}
                                            >
                                                <Star className="w-6 h-6 fill-current" />
                                            </button>
                                        ))}
                                        <span className="text-xs font-bold text-gray-500 ml-2">
                                            {feedbackForm.rating} / 5 Stars
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Feedback Category
                                    </label>
                                    <select
                                        value={feedbackForm.category}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, category: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium outline-none transition-all cursor-pointer"
                                    >
                                        <option value="General Feedback">General Feedback</option>
                                        <option value="Cohort 2026 Programs">Cohort 2026 Programs</option>
                                        <option value="Mentorship & Masterclasses">Mentorship &amp; Masterclasses</option>
                                        <option value="WhatsApp Founder Community">WhatsApp Founder Community</option>
                                        <option value="Startup Tools & Resources">Startup Tools &amp; Resources</option>
                                        <option value="Suggestions & Ideas">Suggestions &amp; Ideas</option>
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Your Name (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={feedbackForm.name}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                                            placeholder="e.g. Rahul Sharma"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Email (Optional)
                                        </label>
                                        <input
                                            type="email"
                                            value={feedbackForm.email}
                                            onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                                            placeholder="e.g. rahul@example.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Your Feedback / Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={feedbackForm.message}
                                        onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                                        placeholder="Tell us what you liked or what we could do better..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none resize-none"
                                    />
                                </div>

                                {feedbackError && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{feedbackError}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={feedbackStatus === 'loading'}
                                    className="w-full py-3 px-6 rounded-full bg-[#7C3AED] hover:bg-[#5A1EEB] text-white text-xs font-bold shadow-md hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {feedbackStatus === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ── 5. Interactive Email / Inquiry Modal ────────────────────────── */}
            {inquiryModalOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-lg w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => {
                                setInquiryModalOpen(false);
                                setInquiryStatus('idle');
                            }}
                            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="mb-6">
                            <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Send an Inquiry</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Drop your note below or write to us at{' '}
                                <a href={`mailto:${pageContent.email}`} className="text-[#7C3AED] font-semibold underline">
                                    {pageContent.email || 'info@setustartupschool.com'}
                                </a>
                            </p>
                        </div>

                        {inquiryStatus === 'success' ? (
                            <div className="py-8 text-center flex flex-col items-center justify-center space-y-3">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl">
                                    <Check className="w-7 h-7" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-900">Inquiry Sent Successfully!</h4>
                                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                                    Thank you for reaching out. A member of the Setu Startup School team will connect with you shortly.
                                </p>
                                <button
                                    onClick={() => {
                                        setInquiryModalOpen(false);
                                        setInquiryStatus('idle');
                                    }}
                                    className="mt-4 px-6 py-2 rounded-full bg-[#7C3AED] hover:bg-[#5A1EEB] text-white text-xs font-bold transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleInquirySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Full Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={inquiryForm.name}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                                        placeholder="e.g. Rahul Sharma"
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            required
                                            value={inquiryForm.email}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                                            placeholder="e.g. rahul@example.com"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                            Phone / WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            value={inquiryForm.phone}
                                            onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                                            placeholder="10-digit number"
                                            className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Inquiry Subject
                                    </label>
                                    <select
                                        value={inquiryForm.subject}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium outline-none transition-all cursor-pointer"
                                    >
                                        <option value="Cohort 2026 Admissions">Cohort 2026 Admissions</option>
                                        <option value="1-on-1 Founder Mentorship">1-on-1 Founder Mentorship</option>
                                        <option value="Fundraising Workshop Inquiry">Fundraising Workshop Inquiry</option>
                                        <option value="Partnership & E-Cell Collaboration">Partnership &amp; E-Cell Collaboration</option>
                                        <option value="General Program Inquiry">General Program Inquiry</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                                        Your Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        required
                                        value={inquiryForm.message}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                                        placeholder="Tell us a little about your startup idea or what you'd like to explore..."
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-3.5 py-2.5 text-xs text-gray-900 outline-none resize-none"
                                    />
                                </div>

                                {inquiryError && (
                                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        <span>{inquiryError}</span>
                                    </div>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <a
                                        href={`mailto:${pageContent.email || 'info@setustartupschool.com'}`}
                                        className="flex-1 py-3 px-4 rounded-full border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Open Mail App</span>
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={inquiryStatus === 'loading'}
                                        className="flex-1 py-3 px-4 rounded-full bg-[#7C3AED] hover:bg-[#5A1EEB] text-white text-xs font-bold shadow-md hover:shadow-[0_8px_20px_rgba(124,58,237,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {inquiryStatus === 'loading' ? 'Sending...' : 'Send Inquiry'}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
