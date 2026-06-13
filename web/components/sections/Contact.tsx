"use client";

import { useState } from 'react';


export function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        city: '',
        phone: '',
        email: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id === 'form-name' ? 'name' :
                id === 'form-city' ? 'city' :
                    id === 'form-contact' ? 'phone' : 'email']: value
        }));
    };

    const handleFormSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const subject = "Inquiry for Setu - TheStartupSchool";
        const body = `Name: ${formData.name}%0D%0ACity: ${formData.city}%0D%0AEmail: ${formData.email}%0D%0AContact Number: ${formData.phone}`;

        window.location.href = `mailto:info@thestartupschool.in?subject=${subject}&body=${body}`;
    };

    return (
        <section id="contact" className="py-32 w-full bg-bg-main border-t border-white/5 relative overflow-hidden">
            {/* Extremely Subtle Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-blue/5 rounded-full blur-[150px] pointer-events-none"></div>

            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-12 flex flex-col items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-1 md:gap-2">
                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                            <span className="text-white">HAI</span>
                            <span className="ml-2 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">KEEDA?</span>
                        </span>
                        <span className="text-2xl md:text-3xl font-black tracking-tighter">
                            <span className="text-white">HAI</span>
                            <span className="ml-2 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">HIMMAT?</span>
                        </span>
                        <span className="text-2xl md:text-3xl font-black tracking-tight pt-2">
                            <span className="text-white/90">TO KAR</span>
                            <span className="ml-2 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">STARTUP!</span>
                        </span>
                    </div>
                </div>

                <div className="glass-card rounded-[2rem] p-6 sm:p-10 md:p-14 border border-white/5 relative overflow-hidden shadow-2xl">
                    <div className="mb-8 text-center">
                        <h3 className="text-lg md:text-xl font-bold text-white mb-2">To know more about our programs, drop your details below</h3>
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue focus:bg-white/[0.05] transition duration-300 placeholder-white/20"
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue focus:bg-white/[0.05] transition duration-300 placeholder-white/20"
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue focus:bg-white/[0.05] transition duration-300 placeholder-white/20"
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
                                    className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-accent-blue focus:bg-white/[0.05] transition duration-300 placeholder-white/20"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="pt-6 text-center flex justify-center">
                            <button type="submit" className="group w-full md:w-auto bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-full font-bold text-sm transition-all duration-300 flex items-center justify-center">
                                Submit Inquiry
                                <i className="fas fa-arrow-right ml-3 group-hover:translate-x-1 transition-transform"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
