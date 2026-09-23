'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    HelpCircle, 
    ArrowLeft, 
} from 'lucide-react';

interface ActionCard {
    id: string;
    title: string;
    description: string;
    button_text: string;
    button_url?: string;
    action_type?: 'URL' | 'PHONE' | 'EMAIL' | 'whatsapp' | 'url' | 'email' | 'phone';
    target_url?: string;
    phone_number?: string;
    email_to?: string;
    email_subject?: string;
    email_body?: string;
    icon_class?: string;
    image_url?: string;
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
}

const DEFAULT_CONTENT: ContactPageData = {
    badge_text: "Get in Touch • We're Here For You",
    title: 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>',
    description: '<p>Have a question about our founder cohorts, incubation programs, masterclasses, or partnerships? Drop your details below or connect directly across our channels.</p>',
    back_btn_text: '← Back',
    back_btn_link: '/',
    action_cards: [
        {
            id: '1',
            title: 'WhatsApp community',
            description: 'Join founders across Bharat. Ask questions, collaborate, and get peer feedback.',
            button_text: 'Join community →',
            action_type: 'URL',
            target_url: 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4',
            icon_class: 'fab fa-whatsapp',
            badge: 'Community',
            display_order: 0,
            is_active: true,
        },
        {
            id: '2',
            title: 'Message us on WhatsApp',
            description: 'Quickest way to reach our admissions and founder support team.',
            button_text: 'Chat on WhatsApp →',
            action_type: 'URL',
            target_url: 'https://wa.me/919289121121',
            icon_class: 'fab fa-whatsapp',
            badge: 'Direct Connect',
            display_order: 1,
            is_active: true,
        },
        {
            id: '3',
            title: 'Call Founder Support',
            description: 'Speak directly with our team regarding cohort details, admissions, or assistance.',
            button_text: 'Call +91 92891 21121 →',
            action_type: 'PHONE',
            phone_number: '+91 92891 21121',
            icon_class: 'fas fa-phone-alt',
            badge: 'Direct Call',
            display_order: 2,
            is_active: true,
        },
        {
            id: '4',
            title: 'Program & Cohort Inquiry',
            description: 'Send us an email regarding Cohort 2026, Startup Launchpad, or masterclasses.',
            button_text: 'Send email →',
            action_type: 'EMAIL',
            email_to: 'info@setustartupschool.com',
            email_subject: 'Inquiry regarding Setu Startup School Cohort 2026',
            email_body: 'Hi Setu Startup School Team,\n\nI am interested in learning more about the upcoming cohort and founder programs.\n\nMy Details:\n- Name:\n- Startup / Idea:\n\nThank you!',
            icon_class: 'fas fa-envelope',
            badge: 'Admissions',
            display_order: 3,
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
};

export default function ContactPage() {
    const [pageContent, setPageContent] = useState<ContactPageData>(DEFAULT_CONTENT);
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
                    }));
                }
            })
            .catch(() => {});
    }, [API_URL]);

    // Render action card icon (Custom image or FontAwesome class or fallback)
    const renderCardIcon = (card: ActionCard) => {
        if (card.image_url) {
            return <img src={card.image_url} alt="" className="w-6 h-6 object-contain" />;
        }
        if (card.icon_class) {
            return <i className={`${card.icon_class} text-xl text-[#7C3AED]`}></i>;
        }
        const type = (card.action_type || 'URL').toUpperCase();
        if (type === 'EMAIL' || type === 'MAIL') {
            return <i className="fas fa-envelope text-xl text-[#7C3AED]"></i>;
        }
        if (type === 'PHONE' || type === 'DIALER') {
            return <i className="fas fa-phone-alt text-xl text-[#7C3AED]"></i>;
        }
        return <i className="fab fa-whatsapp text-xl text-[#7C3AED]"></i>;
    };

    // Handle direct click actions for URL, PHONE, EMAIL
    const handleCardAction = (card: ActionCard) => {
        const type = (card.action_type || 'URL').toUpperCase();

        if (type === 'EMAIL' || type === 'MAIL') {
            const emailTo = card.email_to || pageContent.email || 'info@setustartupschool.com';
            const subjectParam = card.email_subject ? `?subject=${encodeURIComponent(card.email_subject)}` : '';
            const bodyPrefix = subjectParam ? '&' : '?';
            const bodyParam = card.email_body ? `${bodyPrefix}body=${encodeURIComponent(card.email_body)}` : '';
            window.location.href = `mailto:${emailTo}${subjectParam}${bodyParam}`;
            return;
        }

        if (type === 'PHONE' || type === 'DIALER') {
            const rawPhone = (card.phone_number || card.target_url || card.button_url || pageContent.phone || '').replace(/[^0-9+]/g, '');
            if (rawPhone) {
                window.location.href = `tel:${rawPhone}`;
            }
            return;
        }

        // URL / WhatsApp
        const target = card.target_url || card.button_url || pageContent.chat_link || 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4';
        if (target) {
            if (target.startsWith('http') || target.startsWith('//')) {
                window.open(target, '_blank', 'noopener,noreferrer');
            } else {
                window.location.href = target;
            }
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
                    dangerouslySetInnerHTML={{ __html: pageContent.title || 'Connect with <span style="color: #7C3AED;">Setu Startup School</span>' }}
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
                                        {renderCardIcon(card)}
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

                            {/* Action Button - Brand purple match */}
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
        </div>
    );
}
