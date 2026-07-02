'use client';

import { useState } from 'react';

const faqs = [
    { q: 'Is this program live or pre-recorded?', a: 'This is a 100% live, interactive program. We believe execution and deep learning happen best when you can ask questions and engage directly with the mentor in real-time.' },
    { q: 'Will I get the recordings if I miss a session?', a: 'If you miss a session, recordings will NOT be provided. However, you can email our team and we will allow you to attend that session in an upcoming cohort.' },
    { q: 'Which cohort is the right fit for me?', a: 'If you are an early-stage founder wanting to understand the basics of the fundraising landscape, choose the Basic Cohort. If you are actively preparing to raise funds right now and need to master Term Sheets, Cap Tables, and investor negotiations, the Advanced Cohort is exactly what you need.' },
    { q: "I'm at idea stage or pre-revenue — is this still relevant for me?", a: "Absolutely. In fact, this is the best time to learn. Most founders make their biggest fundraising mistakes early — by giving away too much equity, signing bad term sheets, or approaching the wrong investors. Understanding the rules of the game before you play it puts you miles ahead of founders who learn the hard way." },
    { q: 'What is the time commitment — how many hours per day?', a: 'The Basic Cohort runs for 3 evenings — 6:00 PM to 9:00 PM on April 15th, 16th, and 17th. The Advanced Cohort additionally covers April 18th and 19th with full-day sessions from 10:00 AM to 6:30 PM. All sessions are live on Zoom, designed to fit around a founder\'s schedule.' },
    { q: 'Will this workshop directly help me get funded?', a: 'This workshop gives you the exact knowledge, frameworks, and tools that investors expect — but funding depends on your execution. What we guarantee is that you will walk out knowing precisely what investors look for, how to position your startup, and how to run a structured fundraising process. The rest is in your hands.' },
    { q: 'What makes this different from free content available online?', a: 'Free content gives you information. This program gives you a system. You get live interaction with a mentor who has done this in the real world, access to 80+ pitch decks that actually raised money, legal and financial frameworks built for Indian startups, and a founder community — all in one place. No algorithm, no fluff.' },
    { q: 'Is there a refund policy?', a: 'Due to the live and resource-intensive nature of the program, we do not offer refunds once registered. However, if you are unable to attend the cohort you registered for, we will transfer your seat to the next available batch.' },
];

export function WorkshopFinal() {
    const [queryForm, setQueryForm] = useState({ name: '', city: '', email: '', phone: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleQuerySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: queryForm.name,
                    city: queryForm.city,
                    phone: queryForm.phone,
                    email: queryForm.email,
                    source: 'fundraising_workshop'
                }),
            });

            if (response.ok) {
                setStatus('success');
                setQueryForm({ name: '', city: '', email: '', phone: '' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section className="py-20 relative border-t border-white/5 overflow-hidden bg-[#0A0F1C]">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#8b5cf6]/10 pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] md:w-[800px] h-[150px] md:h-[300px] bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-[100%] filter blur-[80px] md:blur-[120px] opacity-10 pointer-events-none" />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
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
                                    <span className="transition group-open:rotate-180">
                                        <i className="fa-solid fa-chevron-down text-slate-400" />
                                    </span>
                                </summary>
                                <div className="text-slate-400 font-light p-5 pt-0 text-sm md:text-base leading-relaxed border-t border-white/5 mt-2">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>

                {/* Transformation */}
                <div>
                    <div className="relative group max-w-4xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500" />
                        <div className="relative text-center bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-2xl p-6 md:p-8 lg:p-12 border border-white/10">
                            <h4 className="text-[#d946ef] font-bold tracking-widest uppercase mb-2 md:mb-4 text-xs md:text-sm">The Transformation</h4>
                            <p className="text-xl md:text-2xl lg:text-3xl font-medium leading-tight">
                                You will stop treating fundraising like a lottery and master it as a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] font-extrabold">repeatable system.</span>
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
                        <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 text-center hover:border-green-500/50 transition-colors group relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-green-500 rounded-full mix-blend-screen filter blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform relative z-10 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                <i className="fa-brands fa-whatsapp text-3xl" />
                            </div>
                            <h4 className="text-white font-bold text-xl mb-2 relative z-10">WhatsApp Us</h4>
                            <p className="text-sm text-slate-400 mb-6 font-light relative z-10">Get instant replies for your queries directly from our team.</p>
                            <a href="https://chat.whatsapp.com/DsWZ7dyfz4C5bB4QydtNqH?mode=gi_t" target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 rounded-lg bg-green-500/10 border border-green-500/30 text-sm font-bold text-green-400 hover:bg-green-500 hover:text-white transition-all relative z-10">
                                Message Now <i className="fa-solid fa-arrow-up-right-from-square ml-1 text-xs" />
                            </a>
                        </div>

                        <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="mb-6 text-center">
                                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">Or Drop a Message</h3>
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
                                    <button type="submit" disabled={status === 'loading'} className="w-full mt-6 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold py-3.5 rounded-lg hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(217,70,239,0.3)] flex items-center justify-center gap-2 disabled:opacity-50">
                                        {status === 'loading' ? 'Submitting...' : <><i className="fa-regular fa-paper-plane" /> Send Inquiry</>}
                                    </button>
                                    {status === 'success' && <p className="text-center text-green-400 font-bold text-sm mt-3">Thank you! We have received your inquiry.</p>}
                                    {status === 'error' && <p className="text-center text-red-400 font-bold text-sm mt-3">Something went wrong. Please try again later.</p>}
                                    <p className="text-center text-[10px] text-slate-500 mt-3 font-light">We respect your privacy. No spam, ever.</p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FOMO CTA */}
                <div className="text-center pb-10">
                    <div className="max-w-4xl mx-auto bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-[#8b5cf6]/50 rounded-2xl p-6 md:p-10 mb-8 shadow-[0_0_20px_rgba(139,92,246,0.2)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-[#8b5cf6]/5 pointer-events-none" />
                        <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-slate-300 tracking-tight relative z-10 leading-relaxed">
                            Don&apos;t shy investing hundreds if you are looking to raise <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-4xl md:text-5xl lg:text-6xl font-extrabold block mt-3">Millions.</span>
                        </h3>
                    </div>
                    <div className="relative group inline-block w-full sm:w-auto px-4 sm:px-0 mt-4">
                        <button disabled className="relative flex sm:inline-flex items-center justify-center px-10 py-5 md:px-14 md:py-6 text-xl md:text-2xl font-extrabold rounded-2xl text-slate-400 bg-slate-800/50 border border-white/10 cursor-not-allowed w-full">
                            <i className="fa-solid fa-lock mr-3" /> Registrations Closed
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
