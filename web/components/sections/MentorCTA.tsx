"use client";

import { useState } from 'react';
import { X, Send } from 'lucide-react';

export function MentorCTA() {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
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
        setErrorMessage('');
        
        try {
            const res = await fetch('/api/leads', {
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
                const data = await res.json().catch(() => ({}));
                setErrorMessage(data.error || 'Something went wrong. Please try again.');
                setStatus('error');
            }
        } catch (error) {
            setErrorMessage('Network error. Please check your connection and try again.');
            setStatus('error');
        }
    };

    return (
        <>
            <button 
                onClick={() => setIsOpen(true)}
                className="mt-8 bg-[#A855F7] hover:bg-[#9333ea] text-white px-8 py-3 rounded-full font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer shadow-md"
            >
                Apply to be a Mentor
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Standard Dark Blur Backdrop (removes the solid purple overlay) */}
                    <div 
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* Modal Content */}
                    <div className="relative z-10 bg-white border border-slate-200 w-full max-w-md rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <button 
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                        >
                            <X size={22} />
                        </button>
                        
                        <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Join as <span className="text-[#A855F7]">Mentor</span></h2>
                        <p className="text-slate-500 mb-6 text-sm font-normal">Help guide the next generation of visionary founders.</p>
                        
                        {status === 'success' ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-green-800 font-bold text-lg mb-1">Application Received!</h3>
                                <p className="text-green-700 text-sm">Thank you for your interest. Our team will review your profile and get in touch shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Full Name *</label>
                                    <input 
                                        type="text" 
                                        required
                                        maxLength={100}
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all placeholder-slate-400"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Email Address *</label>
                                    <input 
                                        type="email" 
                                        required
                                        maxLength={200}
                                        value={formData.email}
                                        onChange={e => setFormData({...formData, email: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all placeholder-slate-400"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        maxLength={20}
                                        value={formData.phone}
                                        onChange={e => setFormData({...formData, phone: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all placeholder-slate-400"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">LinkedIn Profile URL *</label>
                                    <input 
                                        type="url" 
                                        required
                                        maxLength={300}
                                        value={formData.linkedin}
                                        onChange={e => setFormData({...formData, linkedin: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all placeholder-slate-400"
                                        placeholder="https://linkedin.com/in/johndoe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">Short Description / Bio *</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        maxLength={1000}
                                        value={formData.description || ''}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:bg-white focus:border-[#A855F7] focus:ring-1 focus:ring-[#A855F7] transition-all resize-none placeholder-slate-400"
                                        placeholder="Tell us a little about your experience..."
                                    />
                                </div>
                                
                                {status === 'error' && (
                                    <p className="text-red-500 text-sm font-medium">{errorMessage || 'Something went wrong. Please try again.'}</p>
                                )}
                                
                                <button 
                                    type="submit" 
                                    disabled={status === 'loading'}
                                    className="w-full mt-4 bg-[#A855F7] hover:bg-[#9333ea] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer"
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
