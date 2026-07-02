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
        <section id="contact" className="card-section pb-8 md:pb-12 pt-0 relative overflow-hidden">
            {/* Extremely Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none z-0"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                            <span className="text-black">HAI</span>
                            <span className="ml-2 bg-gradient-to-r from-accent-violet to-accent-lavender bg-clip-text text-transparent">KEEDA?</span>
                        </span>
                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                            <span className="text-black">HAI</span>
                            <span className="ml-2 bg-gradient-to-r from-accent-violet to-accent-lavender bg-clip-text text-transparent">HIMMAT?</span>
                        </span>
                        <span className="text-2xl md:text-3xl font-black tracking-tight pt-2">
                            <span className="text-black/90">TO KAR</span>
                            <span className="ml-2 bg-gradient-to-r from-accent-violet to-accent-lavender bg-clip-text text-transparent">STARTUP!</span>
                        </span>
                    </div>
                </div>

                <div className="glass-card rounded-[2rem] p-6 sm:p-10 md:p-14 border border-black/5 relative overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] bg-white/70">
                    <div className="mb-8 text-center">
                        <h3 className="text-lg md:text-xl font-bold text-black mb-2">To know more about our programs, drop your details below</h3>
                        <div className="h-1 w-20 bg-accent-blue mx-auto rounded-full"></div>
                    </div>
                    <form id="inquiry-form" onSubmit={handleFormSubmit} className="space-y-8 relative z-10">
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="form-name" className="block text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    id="form-name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/10 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-accent-blue focus:bg-white transition duration-300 placeholder-gray-400"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-city" className="block text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2 ml-1">City</label>
                                <input
                                    type="text"
                                    id="form-city"
                                    required
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/10 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-accent-blue focus:bg-white transition duration-300 placeholder-gray-400"
                                    placeholder="Mumbai, Bengaluru, etc."
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label htmlFor="form-contact" className="block text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2 ml-1">Contact Number</label>
                                <input
                                    type="tel"
                                    id="form-contact"
                                    required
                                    pattern="[0-9]{10}"
                                    title="Please enter a valid 10 digit mobile number"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/10 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-accent-blue focus:bg-white transition duration-300 placeholder-gray-400"
                                    placeholder="9876543210"
                                />
                            </div>
                            <div>
                                <label htmlFor="form-email" className="block text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    id="form-email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full bg-gray-50 border border-black/10 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-accent-blue focus:bg-white transition duration-300 placeholder-gray-400"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="form-source" className="block text-[10px] font-bold tracking-[0.1em] text-text-secondary uppercase mb-2 ml-1">What are you interested in?</label>
                            <select
                                id="form-source"
                                required
                                value={formData.source}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-black/10 rounded-lg px-4 py-3 text-sm text-black focus:outline-none focus:border-accent-blue focus:bg-white transition duration-300"
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

                        <div className="pt-6 text-center flex flex-col items-center justify-center gap-3">
                            <button type="submit" disabled={status === 'loading'} className="group w-full md:w-auto bg-accent-blue hover:bg-accent-violet text-white px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center shadow-md hover:shadow-lg disabled:opacity-50">
                                {status === 'loading' ? 'Submitting...' : 'Submit Inquiry'}
                                {status !== 'loading' && <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>}
                            </button>
                            {status === 'success' && <p className="text-green-600 font-bold text-sm">Thank you! We have received your inquiry.</p>}
                            {status === 'error' && <p className="text-red-600 font-bold text-sm">Something went wrong. Please try again later.</p>}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
