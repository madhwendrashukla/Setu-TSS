"use client";
import React, { useState } from 'react';
import { PageData } from '@/types/cms';

export function DynamicContact({ data }: { data: PageData }) {
    if (!data?.contact) return null;

    const { whatsapp, lead_gen } = data.contact;
    const [formData, setFormData] = useState({ name: '', city: '', email: '', phone: '' });
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    city: formData.city,
                    email: formData.email,
                    phone: formData.phone,
                    source: lead_gen?.lead_source_tag || 'Event Page - Lead Gen Form'
                })
            });
            if (res.ok) {
                setSubmitted(true);
            } else {
                alert("Failed to submit. Please try again.");
            }
        } catch (e) {
            alert("Error submitting form.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="py-24 bg-white relative border-t border-slate-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-16">
                    
                    {/* Left: WhatsApp Block */}
                    <div className="w-full lg:w-1/2 flex flex-col justify-center">
                        <div className="bg-green-50 rounded-3xl p-10 border border-green-100 relative overflow-hidden h-full flex flex-col justify-center">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none" />
                            
                            <div className="relative z-10">
                                <i className="fab fa-whatsapp text-5xl text-green-500 mb-6 block"></i>
                                {whatsapp?.headline && (
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{whatsapp.headline}</h3>
                                )}
                                {whatsapp?.description && (
                                    <p className="text-lg text-slate-600 mb-8">{whatsapp.description}</p>
                                )}
                                
                                {whatsapp?.link && (
                                    <a 
                                        href={whatsapp.link.startsWith('http') ? whatsapp.link : `https://wa.me/${whatsapp.link.replace(/[^0-9]/g, '')}`} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-8 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-500/30"
                                    >
                                        <i className="fab fa-whatsapp text-xl"></i>
                                        {whatsapp.button_text || "Message Now"}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: Lead Gen Form */}
                    <div className="w-full lg:w-1/2">
                        <div className="bg-slate-900 rounded-3xl p-10 shadow-2xl relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 pointer-events-none" />
                            
                            {lead_gen?.headline && (
                                <div 
                                    className="text-2xl md:text-3xl font-extrabold mb-2"
                                    dangerouslySetInnerHTML={{ __html: lead_gen.headline }}
                                />
                            )}
                            
                            {lead_gen?.subtext && (
                                <p className="text-slate-400 mb-8">{lead_gen.subtext}</p>
                            )}

                            {submitted ? (
                                <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-6 rounded-xl flex items-center gap-4">
                                    <i className="fas fa-check-circle text-2xl"></i>
                                    <div>
                                        <h4 className="font-bold">Details Received!</h4>
                                        <p className="text-sm text-green-400/80">Our team will get back to you shortly.</p>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                                    <div>
                                        <input 
                                            required type="text" placeholder="Full Name" 
                                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <input 
                                            required type="text" placeholder="City" 
                                            value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                        <input 
                                            required type="tel" placeholder="Phone Number" 
                                            value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <input 
                                            required type="email" placeholder="Email Address" 
                                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
                                        />
                                    </div>
                                    <button 
                                        type="submit" 
                                        disabled={submitting}
                                        className="w-full py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50 mt-4"
                                    >
                                        {submitting ? "Sending..." : (lead_gen?.submit_text || "Submit Details")}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
