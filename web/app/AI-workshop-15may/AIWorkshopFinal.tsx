'use client';

import { useState } from 'react';

const faqs = [
    { q: 'Are the sessions live or recorded?', a: 'All sessions are 100% live and interactive on Zoom. We believe deep learning happens when you can ask questions in real-time. Recordings will NOT be provided, but if you miss a session, you can attend it in the next cohort.' },
    { q: 'Do I need technical skills for the Claude Pro workshop?', a: 'No! The workshops are designed for non-technical founders. Atul will guide you step-by-step through everything. If you can browse the internet, you can do this.' },
    { q: 'Do I need prior AI or filmmaking experience?', a: 'Absolutely not. These workshops start from basics and take you to building actual outputs. Beginners are welcome and encouraged.' },
    { q: 'Can I attend just one workshop instead of all three?', a: 'Yes! You can choose individual workshops based on your needs. However, the Complete Bundle gives you the full toolkit at the best price.' },
    { q: 'What if I\'m at the idea stage?', a: 'Perfect! This is exactly when you should attend. Starting with the right frameworks prevents costly mistakes later.' },
    { q: 'Will I get support after the workshop?', a: 'Yes, you\'ll get access to our community group where you can ask questions and connect with fellow entrepreneurs.' },
    { q: 'What\'s the time commitment?', a: 'Total: 13 hours across 3 days (5 sessions). Each session is 2.5–3 hours. The schedule is designed to fit working professionals.' },
    { q: 'Is there a refund policy?', a: 'Due to the live nature of workshops, refunds aren\'t available once registered. However, we can transfer your seat to the next batch if needed.' },
    { q: 'What tools or software do I need?', a: 'A laptop/computer with stable internet, Zoom installed, and a Claude Pro account (preferably the Paid version for Atul Pandey\'s sessions for the best experience). Specific tool lists will be shared before each session.' },
    { q: 'Can I get just the certificates without attending?', a: 'No. Certificates are only provided to participants who attend the live sessions. Attendance shall be recorded on a daily basis — it is compulsory to attend all sessions of the workshop you choose.' },
];

export function AIWorkshopFinal() {
    const [queryForm, setQueryForm] = useState({ name: '', city: '', email: '', phone: '' });

    const handleQuerySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const subject = encodeURIComponent('Query – AI Workshop 15 May');
        const body = encodeURIComponent(`Name: ${queryForm.name}\nCity: ${queryForm.city}\nEmail: ${queryForm.email}\nContact Number: ${queryForm.phone}\n\n`);
        window.location.href = `mailto:info@thestartupschool.in?subject=${subject}&body=${body}`;
    };

    return (
        <section className="py-20 relative border-t border-white/5 overflow-hidden bg-[#0A0F1C]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8b5cf6]/10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[150px] md:h-[300px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-[100%] filter blur-[80px] md:blur-[120px] opacity-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
            {/* Secure Your Seat CTA — above FAQ */}
            <div className="flex justify-center">
                <span className="inline-flex items-center gap-3 px-12 py-5 rounded-xl font-extrabold text-white/50 text-lg bg-[#1e293b] border border-white/10 cursor-not-allowed">
                    Registrations Closed
                </span>
            </div>

                {/* FAQs */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full" />
                    </div>
                    <div className="space-y-4 max-w-4xl mx-auto">
                        {faqs.map((faq, i) => (
                            <details key={i} className="group bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/5 rounded-xl overflow-hidden">
                                <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-5 text-white hover:text-[#d946ef] transition-colors">
                                    <span>{faq.q}</span>
                                    <span className="transition group-open:rotate-180 shrink-0 ml-3">
                                        <i className="fa-solid fa-chevron-down text-slate-400" />
                                    </span>
                                </summary>
                                <div className="text-slate-400 font-light p-5 pt-0 text-sm md:text-base leading-relaxed border-t border-white/5 mt-2">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Transformation quote */}
                <div>
                    <div className="relative group max-w-4xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative text-center bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-2xl p-6 md:p-12 border border-white/10">
                            <h4 className="text-[#d946ef] font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">The Transformation</h4>
                            <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-tight">
                                Stop watching tutorials. Start <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] font-extrabold">building your startup in 3 days.</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Contact Us</h2>
                        <div className="w-16 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-4" />
                        <p className="text-slate-400 text-sm md:text-base">Reach out directly or drop your details below.</p>
                    </div>
                    <div className="max-w-4xl mx-auto flex flex-col gap-8">
                        {/* WhatsApp */}
                        <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-green-500/50 transition-colors group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500 rounded-full mix-blend-screen filter blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <i className="fa-brands fa-whatsapp text-3xl" />
                            </div>
                            <h4 className="text-white font-bold text-xl mb-2 relative z-10">WhatsApp Us</h4>
                            <p className="text-sm text-slate-400 mb-6 font-light relative z-10">Get instant replies for your queries directly from our team.</p>
                            <a href="https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm font-bold text-green-400 hover:bg-green-500 hover:text-white transition-all relative z-10">
                                Message Now <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs" />
                            </a>
                        </div>

                        {/* Email form */}
                        <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="relative z-10">
                        {/* Punchy taglines */}
                        <div className="text-center mb-8">
                            <p className="text-4xl md:text-5xl font-black text-white leading-tight">
                                HAI <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">KEEDA?</span>
                            </p>
                            <p className="text-4xl md:text-5xl font-black text-white leading-tight">
                                HAI <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">HIMMAT?</span>
                            </p>
                            <p className="text-4xl md:text-5xl font-black text-white leading-tight">
                                TO KAR <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP!</span>
                            </p>
                        </div>
                        <div className="mb-6 text-center">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-2">To know more about our programs, drop your details below</h3>
                        </div>
                                <form className="space-y-4" onSubmit={handleQuerySubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">Name</label>
                                            <input type="text" required placeholder="Your Full Name" value={queryForm.name} onChange={e => setQueryForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-[#161e31] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-slate-600" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-xs font-medium text-slate-300">City</label>
                                            <input type="text" required placeholder="e.g. Mumbai, Delhi" value={queryForm.city} onChange={e => setQueryForm(p => ({ ...p, city: e.target.value }))} className="w-full bg-[#161e31] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-slate-600" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Email Address</label>
                                        <input type="email" required placeholder="you@example.com" value={queryForm.email} onChange={e => setQueryForm(p => ({ ...p, email: e.target.value }))} className="w-full bg-[#161e31] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-slate-600" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-medium text-slate-300">Contact Number</label>
                                        <input type="tel" required placeholder="+91 XXXXXXXXXX" value={queryForm.phone} onChange={e => setQueryForm(p => ({ ...p, phone: e.target.value }))} className="w-full bg-[#161e31] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#8b5cf6] transition-colors placeholder:text-slate-600" />
                                    </div>
                                    <button type="submit" className="w-full mt-6 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center gap-2">
                                        <i className="fa-regular fa-paper-plane" /> Send via Email
                                    </button>
                                    <p className="text-center text-[10px] text-slate-500 mt-3 font-light">We respect your privacy. No spam, ever.</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA — Premium */}
                <div className="pb-10">
                    <div className="relative max-w-5xl mx-auto">
                        {/* Subtle background glow — not loud */}
                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                            <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-[#8b5cf6]/20 to-transparent rounded-full blur-[100px]" />
                        </div>

                        <div className="relative border border-white/8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(160deg, rgba(139,92,246,0.06) 0%, rgba(15,23,42,0.95) 40%, rgba(217,70,239,0.04) 100%)' }}>
                            {/* Top accent line */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#8b5cf6]/60 to-transparent" />

                            <div className="px-8 py-16 md:px-20 md:py-20 text-center">
                                {/* Eyebrow */}
                                <p className="text-slate-500 text-xs font-semibold tracking-[0.2em] uppercase mb-8">
                                    May 15 – 17, 2026 &nbsp;·&nbsp; Live on Zoom
                                </p>

                                {/* Headline — large, clean, two-tone */}
                                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-8">
                                    <span className="text-white">Your startup idea</span>
                                    <br />
                                    <span className="bg-gradient-to-r from-[#8b5cf6] via-[#a78bfa] to-[#d946ef] bg-clip-text text-transparent">
                                        deserves 3 days.
                                    </span>
                                </h2>

                                {/* Supporting line */}
                                <p className="text-slate-400 text-lg md:text-xl font-light max-w-lg mx-auto mb-12 leading-relaxed">
                                    Validate it. Build it. Market it.
                                    <br className="hidden md:block" /> All in one weekend — with experts who&apos;ve done it.
                                </p>

                                {/* CTA — refined, not loud */}
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                    <span
                                        className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-10 py-4 md:px-12 md:py-5 rounded-2xl font-bold text-base md:text-lg text-white/50 bg-[#1e293b] border border-white/10 cursor-not-allowed"
                                    >
                                        <span className="relative">Registrations Closed</span>
                                    </span>
                                    <a
                                        href="https://chat.whatsapp.com/JzVfrG7FXhIHHIFXtQCj2C?mode=gi_t"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-sm text-slate-300 border border-white/10 hover:border-white/25 hover:text-white transition-all duration-300"
                                    >
                                        <i className="fa-brands fa-whatsapp text-green-400" /> Have questions?
                                    </a>
                                </div>

                                {/* Trust tokens */}
                                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 font-medium">
                                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-shield-halved text-[#8b5cf6]" /> Secure via Razorpay</span>
                                    <span className="text-white/10">|</span>
                                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-rotate-left text-[#8b5cf6]" /> Seat transfer if needed</span>
                                    <span className="text-white/10">|</span>
                                    <span className="flex items-center gap-1.5"><i className="fa-solid fa-certificate text-[#8b5cf6]" /> Certificate on completion</span>
                                </div>
                            </div>

                            {/* Bottom accent line */}
                            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#d946ef]/40 to-transparent" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
