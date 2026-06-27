'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function WorkshopPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 10000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
        }, 300);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-end justify-center sm:items-center p-0 sm:p-4">
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/80 sm:backdrop-blur-md transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                onClick={handleClose}
                aria-hidden="true"
            />
            
            {/* Modal - Adjusted mobile width and scale */}
            <div 
                className={`relative w-full sm:max-w-md max-w-[92%] sm:mx-0 mx-auto bg-[#0A0F1C] border border-white/20 rounded-2xl sm:rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden transition-transform duration-300 transform ${isClosing ? 'translate-y-full sm:translate-y-10 sm:scale-95 sm:opacity-0' : 'translate-y-0 sm:scale-100 sm:opacity-100'} mb-4 sm:mb-0`}
                role="dialog"
                aria-modal="true"
            >
                {/* Close Button */}
                <button 
                    onClick={handleClose}
                    className="absolute top-4 right-4 p-1.5 bg-white/5 hover:bg-white/10 text-slate-400 rounded-full transition-colors z-20"
                    aria-label="Close"
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="px-5 sm:px-6 pb-10 pt-10 sm:pt-12 flex flex-col items-center text-center relative z-10">
                    {/* NEW TAG */}
                    <div className="mb-6 bg-[#872DFB]/20 px-4 py-2 rounded-full border border-[#872DFB]/40 shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                        <span className="text-[10px] md:text-xs font-black text-[#a78bfa] uppercase tracking-widest leading-none">
                            Live Workshop • May 15–17, 2026
                        </span>
                    </div>

                    {/* ICON */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 mb-6 rounded-3xl bg-gradient-to-br from-[#872DFB] to-[#B797EB] flex items-center justify-center relative shadow-[0_0_30px_rgba(139,92,246,0.6)] group">
                        <div className="absolute inset-0 bg-[#872DFB] rounded-3xl animate-pulse opacity-20"></div>
                        <i className="fa-solid fa-rocket text-white text-3xl sm:text-4xl" />
                    </div>

                    {/* Text content */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-[1.1] px-2">
                        AI Startup<br />
                        Launchpad<br />
                        2026
                    </h3>
                    <p className="text-slate-300 mb-8 sm:mb-10 text-sm sm:text-base md:text-lg leading-relaxed max-w-sm font-medium px-4">
                        From idea to AI-powered MVP in 3 days. Live on Zoom with <span className="text-white font-bold">India&apos;s top mentors</span> — Limited seats!
                    </p>

                    {/* CTA */}
                    <Link 
                        href="/AI-workshop-15may"
                        className="group/btn relative w-full sm:w-[90%] bg-white text-slate-950 font-black py-4 sm:py-5 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_10px_40px_rgba(255,255,255,0.1)] hover:shadow-[0_15px_50px_rgba(255,255,255,0.2)]"
                        onClick={handleClose}
                    >
                        <span className="text-lg">Register Now</span>
                        <i className="fa-solid fa-arrow-right text-lg group-hover/btn:translate-x-1.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
