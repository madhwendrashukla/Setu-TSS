"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        email: '',
        source: 'Cohort 2026 Programs'
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [sourceOptions, setSourceOptions] = useState<{ id: string; label: string }[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/lead-sources`)
            .then(res => (res.ok ? res.json() : []))
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setSourceOptions(data);
                }
            })
            .catch(() => {});
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'form-name' ? 'name' :
                id === 'form-city' ? 'city' :
                    id === 'form-contact' ? 'phone' :
                        id === 'form-source' ? 'source' : 'email']: value
        }));
    };

    const handleFormSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const payload = {
                name: formData.name.trim(),
                city: formData.city.trim() || 'Online',
                phone: formData.phone.trim(),
                email: formData.email.trim(),
                source: formData.source || 'homepage_contact_section',
                message: `Inquiry submitted via Homepage Contact Section. Interested in: ${formData.source}`,
            };

            let response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // Fallback to production API if local is offline
                response = await fetch('https://foundersschool.in/api/leads', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
            }

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', city: '', phone: '', email: '', source: 'Cohort 2026 Programs' });
            } else {
                const data = await response.json().catch(() => ({}));
                setErrorMessage(data?.error || 'Unable to submit inquiry. Please try again or email us.');
                setStatus('error');
            }
        } catch {
            setErrorMessage('Network error. Please try again or reach out directly.');
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="card-section py-20 md:py-28 relative overflow-hidden bg-bg-main w-full">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-accent-violet/10 rounded-full blur-[150px] pointer-events-none z-0" />
            <div className="absolute top-10 right-[5%] w-[400px] h-[400px] bg-accent-blue/5 rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
                
                {/* ── Section Header ─────────────────────────────────────── */}
                <div className="text-center mb-12 md:mb-16 flex flex-col items-center justify-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-[0.2em] bg-white border border-[#A855F7]/30 text-[#7C3AED] shadow-sm mb-4">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED] animate-pulse"></span>
                        Admissions &amp; Inquiries
                    </div>

                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-text-primary leading-tight mb-4">
                        Ready to Build Your Startup? <span className="text-[#A855F7]">Take the First Step.</span>
                    </h2>

                    <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto font-light leading-relaxed">
                        Have <span className="font-semibold text-text-primary">Keeda</span>? Have <span className="font-semibold text-text-primary">Himmat</span>? Connect with our admissions and founder relations team to explore cohorts, 1-on-1 mentorship, and upcoming workshops.
                    </p>
                </div>

                {/* ── Dual-Surface Card Layout ───────────────────────────── */}
                <div className="bg-white/95 backdrop-blur-2xl rounded-3xl border border-functional-border shadow-2xl shadow-purple-950/5 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    
                    {/* ── LEFT PANEL: Direct Reach & Highlights (5 Cols) ─── */}
                    <div className="lg:col-span-5 bg-[#13113B] text-white p-8 sm:p-10 md:p-12 flex flex-col justify-between relative overflow-hidden">
                        {/* Decorative Gradient Flare */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C3AED]/20 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#A855F7]/15 rounded-full blur-3xl pointer-events-none" />

                        <div className="relative z-10">
                            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#A855F7] block mb-2">
                                Setu Startup School
                            </span>
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4 leading-snug">
                                We are here to hold the hand that is trying to build.
                            </h3>
                            <p className="text-sm text-slate-300 font-light leading-relaxed mb-8">
                                India&apos;s alternate B-School bridging the 4 deadly gaps of Learning, Access, Mentoring, and Community.
                            </p>

                            {/* Key Highlights */}
                            <div className="space-y-4 mb-8">
                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A855F7] shrink-0 text-sm">
                                        <i className="fas fa-graduation-cap"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cohort 2026 Programs</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Tactical, hands-on support in the critical first 100 days.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A855F7] shrink-0 text-sm">
                                        <i className="fas fa-user-tie"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Masterclasses &amp; Mentorship</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Direct guidance from Gaurav Bansal &amp; top operators.</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3.5">
                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-[#A855F7] shrink-0 text-sm">
                                        <i className="fas fa-clock"></i>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Swift Response SLA</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">Our team replies within 24 hours via Call or WhatsApp.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Direct Contacts & SLA */}
                        <div className="relative z-10 pt-6 border-t border-white/10 space-y-3">
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                <i className="fas fa-phone-alt text-[#A855F7] w-4 text-center"></i>
                                <a href="tel:+919289121121" className="hover:text-white transition-colors font-medium">
                                    +91 92891 21121
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                <i className="fas fa-envelope text-[#A855F7] w-4 text-center"></i>
                                <a href="mailto:info@setustartupschool.com" className="hover:text-white transition-colors font-medium">
                                    info@setustartupschool.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-300">
                                <i className="fas fa-map-marker-alt text-[#A855F7] w-4 text-center"></i>
                                <span>Malad West, Mumbai, Maharashtra 400064</span>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT PANEL: Inquiry Form (7 Cols) ─────────────── */}
                    <div className="lg:col-span-7 p-8 sm:p-10 md:p-12 flex flex-col justify-between bg-white">
                        <div>
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-text-primary tracking-tight mb-1">
                                    Drop Your Inquiry
                                </h3>
                                <p className="text-xs sm:text-sm text-text-secondary">
                                    Fill in your contact details below to receive the cohort brochure &amp; schedule.
                                </p>
                            </div>

                            {status === 'success' ? (
                                <div className="py-12 px-6 text-center flex flex-col items-center justify-center bg-purple-50/60 border border-purple-200/80 rounded-2xl animate-in fade-in zoom-in-95 duration-300">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] text-white flex items-center justify-center text-2xl shadow-lg shadow-purple-600/25 mb-4">
                                        <i className="fas fa-check"></i>
                                    </div>
                                    <h4 className="text-2xl font-bold text-text-primary mb-2">
                                        Thank You for Connecting!
                                    </h4>
                                    <p className="text-text-secondary text-sm max-w-sm mx-auto mb-6">
                                        We have received your details. A member of our admissions &amp; founder relations team will contact you within 24 hours.
                                    </p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="px-6 py-2.5 rounded-full bg-accent-blue hover:bg-accent-royal text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                                    >
                                        Submit Another Inquiry
                                    </button>
                                </div>
                            ) : (
                                <form id="inquiry-form" onSubmit={handleFormSubmit} className="space-y-4">
                                    
                                    {/* Name & City */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="form-name" className="block text-xs font-bold tracking-wider text-text-primary uppercase mb-1.5">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="form-name"
                                                    required
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                                                    placeholder="e.g. Gaurav Sharma"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <i className="fas fa-user text-xs"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="form-city" className="block text-xs font-bold tracking-wider text-text-primary uppercase mb-1.5">
                                                City / Location <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="form-city"
                                                    required
                                                    value={formData.city}
                                                    onChange={handleChange}
                                                    className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                                                    placeholder="e.g. Mumbai, Bengaluru"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <i className="fas fa-map-marker-alt text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Contact & Email */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="form-contact" className="block text-xs font-bold tracking-wider text-text-primary uppercase mb-1.5">
                                                Mobile / WhatsApp <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="tel"
                                                    id="form-contact"
                                                    required
                                                    pattern="[0-9]{10}"
                                                    title="Please enter a valid 10 digit mobile number"
                                                    value={formData.phone}
                                                    onChange={handleChange}
                                                    className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                                                    placeholder="10-digit number"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <i className="fas fa-phone text-xs"></i>
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="form-email" className="block text-xs font-bold tracking-wider text-text-primary uppercase mb-1.5">
                                                Email Address <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    id="form-email"
                                                    required
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl pl-10 pr-4 py-3 text-slate-900 text-sm font-medium outline-none transition-all placeholder:text-slate-400 shadow-2xs"
                                                    placeholder="you@domain.com"
                                                />
                                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                    <i className="fas fa-envelope text-xs"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Program / Source Interest */}
                                    <div>
                                        <label htmlFor="form-source" className="block text-xs font-bold tracking-wider text-text-primary uppercase mb-1.5">
                                            What are you interested in?
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="form-source"
                                                required
                                                value={formData.source}
                                                onChange={handleChange}
                                                className="w-full bg-bg-main/60 border border-functional-border focus:border-accent-blue focus:bg-white rounded-xl pl-10 pr-10 py-3 text-slate-900 text-sm font-medium outline-none transition-all shadow-2xs appearance-none cursor-pointer"
                                            >
                                                {sourceOptions.length > 0 ? (
                                                    sourceOptions.map(option => (
                                                        <option key={option.id} value={option.label || option.id} className="bg-white text-slate-900 py-2">
                                                            {option.label}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="Cohort 2026 Programs">Cohort 2026 Programs</option>
                                                        <option value="1-on-1 Mentorship">1-on-1 Mentorship</option>
                                                        <option value="Fundraising Workshop">Fundraising Workshop</option>
                                                        <option value="Partnership & Sponsorship">Partnership &amp; Sponsorship</option>
                                                        <option value="General Inquiry">General Inquiry</option>
                                                    </>
                                                )}
                                            </select>
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                                <i className="fas fa-sparkles text-xs"></i>
                                            </div>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500">
                                                <i className="fas fa-chevron-down text-xs"></i>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error Notification */}
                                    {status === 'error' && (
                                        <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs font-semibold flex items-center gap-2">
                                            <i className="fas fa-exclamation-circle"></i>
                                            <span>{errorMessage}</span>
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <div className="pt-2">
                                        <button 
                                            type="submit" 
                                            disabled={status === 'loading'} 
                                            className="group w-full bg-gradient-to-r from-[#7C3AED] via-[#8B3DFF] to-[#A855F7] hover:from-[#6D28D9] hover:to-[#9333EA] text-white py-4 px-8 rounded-2xl font-bold text-sm sm:text-base tracking-wide transition-all duration-300 flex items-center justify-center gap-2.5 shadow-[0_8px_25px_rgba(124,58,237,0.25)] hover:shadow-[0_12px_32px_rgba(124,58,237,0.35)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:pointer-events-none cursor-pointer"
                                        >
                                            {status === 'loading' ? (
                                                <>
                                                    <i className="fas fa-spinner fa-spin"></i>
                                                    <span>Submitting Details...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>Submit Inquiry</span>
                                                    <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform"></i>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>

                        {/* Footer trust badge */}
                        <div className="mt-6 pt-4 border-t border-functional-border/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-text-secondary">
                            <span className="flex items-center gap-1.5">
                                <i className="fas fa-lock text-accent-blue"></i> 100% Confidential &amp; Safe
                            </span>
                            <Link href="/contact" className="text-accent-blue font-semibold hover:underline">
                                Dedicated Contact Page &rarr;
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
