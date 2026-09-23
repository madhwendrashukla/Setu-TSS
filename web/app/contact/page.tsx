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
    Flag, 
    HelpCircle, 
    ArrowRight, 
    ArrowLeft, 
    Sparkles, 
    X, 
    Check, 
    Star, 
    AlertCircle,
    ExternalLink
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
    show_problem_banner: boolean;
    problem_banner_title: string;
    problem_banner_desc: string;
    problem_banner_action_text: string;
    problem_banner_action_url: string;
    problem_banner_icon: string;
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
    title: 'Support & <span class="text-[#7C3AED]">Contact</span>',
    description: "Stuck on something? We're one message away.",
    back_btn_text: '← Back',
    back_btn_link: '/',
    action_cards: [
        {
            id: '1',
            title: 'WhatsApp community',
            description: 'Ask questions and meet other founders.',
            button_text: 'Open community →',
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
            description: 'Fastest way to reach the team.',
            button_text: 'Send a message →',
            button_url: 'https://wa.me/919289121121',
            action_type: 'whatsapp',
            icon: 'message',
            badge: 'Direct Message',
            display_order: 1,
            is_active: true,
        },
        {
            id: '3',
            title: 'Book a 1-on-1 call',
            description: 'Talk to a mentor about your startup.',
            button_text: 'Book a slot →',
            button_url: 'https://topmate.io',
            action_type: 'url',
            icon: 'calendar',
            badge: 'Mentorship',
            display_order: 2,
            is_active: true,
        },
        {
            id: '4',
            title: 'Give feedback',
            description: 'Tell us what is working and what is not.',
            button_text: 'Share feedback →',
            button_url: '',
            action_type: 'feedback_modal',
            icon: 'feedback',
            badge: 'Feedback',
            display_order: 3,
            is_active: true,
        },
        {
            id: '5',
            title: 'Email us',
            description: 'We reply within one working day.',
            button_text: 'Email support →',
            button_url: 'mailto:info@setustartupschool.com',
            action_type: 'inquiry_modal',
            icon: 'mail',
            badge: 'Support Desk',
            display_order: 4,
            is_active: true,
        },
        {
            id: '6',
            title: 'Call Us Now !!!',
            description: 'call on this number - +91 92891 21121',
            button_text: 'Call now →',
            button_url: 'tel:+919289121121',
            action_type: 'phone',
            icon: 'phone',
            badge: 'Helpline',
            display_order: 5,
            is_active: true,
        },
    ],
    show_problem_banner: true,
    problem_banner_title: 'Found a problem in a course?',
    problem_banner_desc: "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket.",
    problem_banner_action_text: 'Enroll in a course to report an issue.',
    problem_banner_action_url: '/courses',
    problem_banner_icon: 'fas fa-flag',
    show_info_box: true,
    info_box_title: 'When should you contact us?',
    info_box_icon: 'fas fa-question-circle',
    info_box_items: [
        { id: '1', text: "You can't access a course you paid for, or a lesson won't load.", display_order: 0, is_active: true },
        { id: '2', text: "A live session's meeting link is missing or not working.", display_order: 1, is_active: true },
        { id: '3', text: 'You have a question about the course content and want to ask a mentor.', display_order: 2, is_active: true },
        { id: '4', text: 'Payment, invoice, or refund questions.', display_order: 3, is_active: true },
        { id: '5', text: "Your certificate has a typo or didn't appear after finishing the course.", display_order: 4, is_active: true },
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
                        title: data.title ?? prev.title,
                        description: data.description ?? prev.description,
                        back_btn_text: data.back_btn_text ?? prev.back_btn_text,
                        back_btn_link: data.back_btn_link ?? prev.back_btn_link,
                        action_cards: Array.isArray(data.action_cards) && data.action_cards.length > 0 
                            ? data.action_cards 
                            : prev.action_cards,
                        show_problem_banner: data.show_problem_banner !== false,
                        problem_banner_title: data.problem_banner_title ?? prev.problem_banner_title,
                        problem_banner_desc: data.problem_banner_desc ?? prev.problem_banner_desc,
                        problem_banner_action_text: data.problem_banner_action_text ?? prev.problem_banner_action_text,
                        problem_banner_action_url: data.problem_banner_action_url ?? prev.problem_banner_action_url,
                        problem_banner_icon: data.problem_banner_icon ?? prev.problem_banner_icon,
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
        <div className="min-h-screen bg-[#F8F9FD] text-gray-900 pt-24 sm:pt-28 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
            
            {/* Ambient Background Glow */}
            <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-purple-200/20 blur-[130px] pointer-events-none -z-10" />

            <div className="w-full max-w-4xl mx-auto space-y-8">
                
                {/* ── 1. Top Navigation & Header ─────────────────────────────── */}
                <div className="space-y-4">
                    {/* Back Link */}
                    <div>
                        <Link
                            href={pageContent.back_btn_link || '/'}
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors group cursor-pointer"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                            <span>{pageContent.back_btn_text?.replace('←', '').trim() || 'Back'}</span>
                        </Link>
                    </div>

                    {/* Page Headline with Icon */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center text-[#7C3AED] shadow-2xs shrink-0">
                            {/* Hexagon/Spiral Support Icon */}
                            <svg className="w-5 h-5 text-[#7C3AED]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="4" />
                                <line x1="4.93" y1="4.93" x2="9.17" y2="9.17" />
                                <line x1="14.83" y1="14.83" x2="19.07" y2="19.07" />
                                <line x1="14.83" y1="9.17" x2="19.07" y2="4.93" />
                                <line x1="4.93" y1="19.07" x2="9.17" y2="14.83" />
                            </svg>
                        </div>
                        <h1 
                            className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight [&_span]:text-[#7C3AED]"
                            dangerouslySetInnerHTML={{ __html: pageContent.title || 'Support & <span class="text-[#7C3AED]">Contact</span>' }}
                        />
                    </div>

                    {/* Subtitle */}
                    <p className="text-base text-gray-500 font-normal">
                        {pageContent.description || "Stuck on something? We're one message away."}
                    </p>
                </div>

                {/* ── 2. Action Cards Grid (2-Column) ─────────────────────────── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                    {activeCards.map((card) => (
                        <div
                            key={card.id || card.title}
                            className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-purple-100 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between group"
                        >
                            <div>
                                {/* Icon container in soft lavender squircle */}
                                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200 shadow-2xs">
                                    {renderCardIcon(card.icon || card.title)}
                                </div>

                                {/* Title */}
                                <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-1">
                                    {card.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-500 font-normal mb-6 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div>
                                <button
                                    onClick={() => handleCardAction(card)}
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white text-sm font-semibold shadow-xs hover:shadow-md active:scale-98 transition-all duration-200 cursor-pointer"
                                >
                                    <span>{card.button_text || 'Open →'}</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── 3. Problem in Course Banner ─────────────────────────────── */}
                {pageContent.show_problem_banner && (
                    <div className="bg-[#FFF9F2] border border-[#FDE6CA] rounded-2xl p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
                        <div className="flex items-start sm:items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFEBD4] text-[#E86A17] flex items-center justify-center shrink-0 shadow-2xs">
                                <Flag className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-gray-900">
                                    {pageContent.problem_banner_title || 'Found a problem in a course?'}
                                </h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {pageContent.problem_banner_desc || "Report a mistake, broken link, or wrong date — pick the course and we'll get a ticket."}
                                </p>
                            </div>
                        </div>

                        <div className="self-start md:self-center shrink-0">
                            {pageContent.problem_banner_action_url ? (
                                <Link
                                    href={pageContent.problem_banner_action_url}
                                    className="text-xs sm:text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white/70 hover:bg-white border border-amber-200/80 px-4 py-2 rounded-xl inline-block"
                                >
                                    {pageContent.problem_banner_action_text || 'Enroll in a course to report an issue.'}
                                </Link>
                            ) : (
                                <span className="text-xs sm:text-sm font-medium text-gray-600 bg-white/70 border border-amber-200/80 px-4 py-2 rounded-xl inline-block">
                                    {pageContent.problem_banner_action_text || 'Enroll in a course to report an issue.'}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* ── 4. "When should you contact us?" Info Box ───────────────── */}
                {pageContent.show_info_box && (
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-6 sm:p-8 space-y-5">
                        <div className="flex items-center gap-2.5">
                            <HelpCircle className="w-5 h-5 text-[#7C3AED]" />
                            <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                                {pageContent.info_box_title || 'When should you contact us?'}
                            </h2>
                        </div>

                        <ul className="space-y-3 pl-1">
                            {activeInfoItems.map((item) => (
                                <li key={item.id} className="flex items-start gap-3 text-sm text-gray-600 leading-relaxed font-normal">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] mt-2 shrink-0"></span>
                                    <span>{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

            </div>

            {/* ── 5. Interactive Feedback Modal ───────────────────────────────── */}
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
                            <h3 className="text-xl font-bold text-gray-900">Share Your Feedback</h3>
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
                                    className="mt-4 px-6 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
                                >
                                    Close
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                                {/* Rating */}
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

                                {/* Category */}
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
                                        <option value="Course Content & Quality">Course Content & Quality</option>
                                        <option value="Platform / Website Experience">Platform / Website Experience</option>
                                        <option value="Mentorship & Masterclasses">Mentorship & Masterclasses</option>
                                        <option value="WhatsApp Community">WhatsApp Community</option>
                                        <option value="Suggestions & Ideas">Suggestions & Ideas</option>
                                    </select>
                                </div>

                                {/* Name & Email */}
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

                                {/* Message */}
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
                                    className="w-full py-3 px-6 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {feedbackStatus === 'loading' ? 'Submitting...' : 'Submit Feedback'}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            {/* ── 6. Interactive Email / Inquiry Modal ────────────────────────── */}
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
                            <h3 className="text-xl font-bold text-gray-900">Email Support</h3>
                            <p className="text-xs text-gray-500 mt-1">
                                Send us a message directly or write to us at{' '}
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
                                    Thank you for writing to us. Our admissions and support team will reply within one working day.
                                </p>
                                <button
                                    onClick={() => {
                                        setInquiryModalOpen(false);
                                        setInquiryStatus('idle');
                                    }}
                                    className="mt-4 px-6 py-2 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-black transition-all cursor-pointer"
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
                                        Subject / Topic
                                    </label>
                                    <select
                                        value={inquiryForm.subject}
                                        onChange={(e) => setInquiryForm({ ...inquiryForm, subject: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 focus:border-[#7C3AED] focus:bg-white rounded-xl px-4 py-2.5 text-xs text-gray-900 font-medium outline-none transition-all cursor-pointer"
                                    >
                                        <option value="General Support Inquiry">General Support Inquiry</option>
                                        <option value="Course Access & Playback Issue">Course Access & Playback Issue</option>
                                        <option value="Live Session Link Missing">Live Session Link Missing</option>
                                        <option value="Payment, Invoice, or Refund">Payment, Invoice, or Refund</option>
                                        <option value="Certificate Typo / Not Received">Certificate Typo / Not Received</option>
                                        <option value="Cohort 2026 Admissions">Cohort 2026 Admissions</option>
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
                                        placeholder="Describe your issue or question in detail..."
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
                                        className="flex-1 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5"
                                    >
                                        <ExternalLink className="w-3.5 h-3.5" />
                                        <span>Open Mail App</span>
                                    </a>
                                    <button
                                        type="submit"
                                        disabled={inquiryStatus === 'loading'}
                                        className="flex-1 py-3 px-4 rounded-xl bg-[#6B21A8] hover:bg-[#581C87] text-white text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {inquiryStatus === 'loading' ? 'Sending...' : 'Send Message'}
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
