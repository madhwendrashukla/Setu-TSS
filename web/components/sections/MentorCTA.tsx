"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';

export function MentorCTA() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        linkedin: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/leads`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    message: `LinkedIn: ${formData.linkedin}\n\nDescription: ${formData.description}`,
                    source: 'mentor_application'
                })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => {
                    setIsOpen(false);
                    setStatus('idle');
                    setFormData({ name: '', email: '', phone: '', linkedin: '', description: '' });
                }, 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="mt-8 bg-black text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:bg-[#1e1e1e]"
            >
                Apply to be a Mentor
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsOpen(false)}
                    ></div>
                    
                    {/* Modal Content */}
                    <div className="relative bg-white border border-black/5 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-black/50 hover:text-black transition-colors"
                        >
                            <X size={24} />
                        </button>
                        
                        <h2 className="text-3xl font-black text-text-primary mb-2 tracking-tight">Join as <span className="text-accent-blue">Mentor</span></h2>
                        <p className="text-text-secondary mb-8 text-sm font-light">Help guide the next generation of visionary founders.</p>
                        
                        {status === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-green-700 font-bold text-lg mb-2">Application Received!</h3>
                                <p className="text-green-600/80 text-sm">Thank you for your interest. Our team will review your profile and get in touch shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Full Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-bg-surface border border-black/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Email Address *</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-bg-surface border border-black/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-bg-surface border border-black/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">LinkedIn Profile URL *</label>
                                    <input 
                                        type="url" 
                                        required
                                        value={formData.linkedin}
                                        onChange={e => setFormData({...formData, linkedin: e.target.value})}
                                        className="w-full bg-bg-surface border border-black/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                                        placeholder="https://linkedin.com/in/johndoe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-2">Short Description / Bio *</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-bg-surface border border-black/10 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all resize-none"
                                        placeholder="Tell us a little about your experience..."
                                    />
                                </div>
                                
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-medium">Something went wrong. Please try again.</p>
                                )}
                                
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="w-full mt-4 bg-accent-blue hover:bg-accent-violet disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_4px_14px_0_rgba(107,33,251,0.39)] hover:shadow-[0_6px_20px_rgba(107,33,251,0.23)]"
                                >
                                    {status === 'loading' ? 'Submitting...' : (
                                        <>
                                            Submit Application
                                            <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
