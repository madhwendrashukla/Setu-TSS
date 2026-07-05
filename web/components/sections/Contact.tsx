"use client";

import { useState, useEffect } from 'react';


export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        email: '',
        source: 'contact_section'
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [sourceOptions, setSourceOptions] = useState<{id: string, label: string}[]>([]);

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/lead-sources`)
            .then(res => res.json())
            .then(data => setSourceOptions(data))
            .catch(console.error);
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

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/leads`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    city: formData.city,
                    phone: formData.phone,
                    email: formData.email,
                    source: formData.source
                }),
            });

            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', city: '', phone: '', email: '', source: 'contact_section' });
                setTimeout(() => setStatus('idle'), 5000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <section id="contact" className="card-section pb-24 md:pb-32 pt-8 relative overflow-hidden">
            {/* Extremely Subtle Background Glow */}
            <div className="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#A855F7]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="text-center mb-10 flex flex-col items-center justify-center">
                    <h2 className="text-3xl md:text-4xl font-black tracking-tight text-text-primary leading-tight">
                        HAI <span className="text-[#A855F7]">KEEDA?</span><br />
                        HAI <span className="text-[#A855F7]">HIMMAT?</span><br />
                        TO KAR <span className="text-[#A855F7]">STARTUP!</span>
                    </h2>
                </div>

                <div className="bg-[#13113B] rounded-3xl p-6 md:p-8 border border-functional-border/20 shadow-[0_8px_40px_rgba(168,85,247,0.15)] relative overflow-hidden">
                    <div className="mb-6 text-center">
                        <h3 className="text-lg font-bold text-white mb-3">To know more about our programs, drop your details below</h3>
                        <div className="h-1 w-12 bg-[#A855F7] mx-auto rounded-full"></div>
                    </div>
                    
                    <form id="inquiry-form" onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="form-name" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5">Full Name</label>
                                <input
                                    type="text"
                                    id="form-name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-functional-border/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all placeholder-gray-500"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-city" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5">City</label>
                                <input
                                    type="text"
                                    id="form-city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-functional-border/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all placeholder-gray-500"
                                    placeholder="Mumbai, Bengaluru, etc."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="form-contact" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5">Contact Number</label>
                                <input
                                    type="tel"
                                    id="form-contact"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10 digit mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-functional-border/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all placeholder-gray-500"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-email" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5">Email Address</label>
                                <input
                                    type="email"
                                    id="form-email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-black/20 border border-functional-border/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all placeholder-gray-500"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="form-source" className="block text-xs font-semibold tracking-wider text-gray-400 uppercase mb-1.5">What are you interested in?</label>
                            <select
                                id="form-source"
                                required
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full bg-black/20 border border-functional-border/20 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-[#A855F7]/40 focus:border-[#A855F7] transition-all"
                            >
                                {sourceOptions.length > 0 ? (
                                    sourceOptions.map(option => (
                                        <option key={option.id} value={option.id}>{option.label}</option>
                                    ))
                                ) : (
                                    <option value="contact_section">General Inquiry</option>
                                )}
                            </select>
                        </div>

                        <div className="pt-4 text-center flex flex-col items-center justify-center gap-4">
                            <button type="submit" disabled={status === 'loading'} className="group w-full md:w-auto bg-[#A855F7] hover:bg-[#9333ea] text-white px-8 py-3 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center shadow-[0_4px_14px_0_rgba(168,85,247,0.39)] hover:shadow-[0_6px_20px_rgba(168,85,247,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
                                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                                {status !== 'loading' && <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>}
                            </button>
                            {status === 'success' && <p className="text-green-600 font-medium text-sm bg-green-50 px-4 py-2 rounded-full">Thank you! We have received your inquiry.</p>}
                            {status === 'error' && <p className="text-red-600 font-medium text-sm bg-red-50 px-4 py-2 rounded-full">Something went wrong. Please try again later.</p>}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
