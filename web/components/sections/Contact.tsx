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
        <section id="contact" className="card-section pb-24 md:pb-32 pt-12 relative overflow-hidden">
            {/* Extremely Subtle Background Glow */}
            <div className="!absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#6B21FB]/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16 flex flex-col items-center justify-center">
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight text-gray-900 leading-tight">
                        HAI <span className="text-[#6B21FB]">KEEDA?</span><br />
                        HAI <span className="text-[#6B21FB]">HIMMAT?</span><br />
                        TO KAR <span className="text-[#6B21FB]">STARTUP!</span>
                    </h2>
                </div>

                <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/50 relative overflow-hidden">
                    <div className="mb-10 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">To know more about our programs, drop your details below</h3>
                        <div className="h-1 w-12 bg-[#6B21FB] mx-auto rounded-full"></div>
                    </div>
                    
                    <form id="inquiry-form" onSubmit={handleFormSubmit} className="space-y-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="form-name" className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Full Name</label>
                                <input
                                    type="text"
                                    id="form-name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FB]/20 focus:border-[#6B21FB] transition-all placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-city" className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">City</label>
                                <input
                                    type="text"
                                    id="form-city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FB]/20 focus:border-[#6B21FB] transition-all placeholder-gray-400"
                                    placeholder="Mumbai, Bengaluru, etc."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="form-contact" className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Contact Number</label>
                                <input
                                    type="tel"
                                    id="form-contact"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10 digit mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FB]/20 focus:border-[#6B21FB] transition-all placeholder-gray-400"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-email" className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Email Address</label>
                                <input
                                    type="email"
                                    id="form-email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FB]/20 focus:border-[#6B21FB] transition-all placeholder-gray-400"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="form-source" className="block text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">What are you interested in?</label>
                            <select
                                id="form-source"
                                required
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6B21FB]/20 focus:border-[#6B21FB] transition-all"
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

                        <div className="pt-8 text-center flex flex-col items-center justify-center gap-4">
                            <button type="submit" disabled={status === 'loading'} className="group w-full md:w-auto bg-[#6B21FB] hover:bg-[#5818d6] text-white px-10 py-4 rounded-full font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center shadow-lg shadow-[#6B21FB]/25 hover:shadow-xl hover:shadow-[#6B21FB]/40 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0">
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
