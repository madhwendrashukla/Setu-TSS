'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

export default function PaymentSuccessAv() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        // Prevent returning to the success page via browser back button
        window.history.pushState(null, '', window.location.href);
        const handlePopState = () => {
            window.location.replace('https://thestartupschool.in');
        };
        window.addEventListener('popstate', handlePopState);

        // Navbar scroll effect
        const handleScroll = () => {
            if (window.scrollY > 10) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('popstate', handlePopState);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {/* Scoped Styling matching HTML explicitly */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

                .payment-success-body {
                    background-color: #0f172a;
                    color: #f8fafc;
                    overflow-x: hidden;
                    display: flex;
                    flex-direction: column;
                    min-height: 100vh;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }
                
                /* Core Brand Gradient Utilities */
                .brand-gradient {
                    background: linear-gradient(to right, #8b5cf6, #d946ef);
                }
                .text-brand-gradient {
                    background: linear-gradient(to right, #8b5cf6, #d946ef);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Ambient UI */
                .glass-card {
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
                }
                
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 30px 30px;
                }
                @media (min-width: 768px) {
                    .bg-grid-pattern { background-size: 40px 40px; }
                }

                /* Fade Animations */
                .fade-in-section {
                    opacity: 0;
                    transform: translateY(20px);
                    visibility: hidden;
                    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
                    will-change: opacity, visibility, transform;
                }
                .fade-in-section.is-visible {
                    opacity: 1;
                    transform: none;
                    visibility: visible;
                }

                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1) }
                    33% { transform: translate(20px, -30px) scale(1.05) }
                    66% { transform: translate(-15px, 15px) scale(0.95) }
                    100% { transform: translate(0px, 0px) scale(1) }
                }
                .animate-blob { animation: blob 7s infinite; }

                @keyframes float {
                    0%, 100% { transform: translateY(0) }
                    50% { transform: translateY(-15px) }
                }

                @keyframes successPop {
                    0% { opacity: 0; transform: scale(0.5) }
                    100% { opacity: 1; transform: scale(1) }
                }
                .animate-success-pop { animation: successPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

                /* Hide global navbar/footer for this specific page layout */
                header nav, footer.global-footer, .directory-advisor-bot {
                    display: none !important;
                }
            `}} />

            <div className="payment-success-body antialiased selection:bg-[#8b5cf6] selection:text-white relative">
                
                {/* Global Background Texture */}
                <div className="fixed inset-0 bg-grid-pattern z-[-1] pointer-events-none"></div>

                {/* Navigation */}
                <nav className={`fixed w-full z-50 transition-all duration-300 border-b border-white/5 ${scrolled ? 'bg-[#0f172a]/90 backdrop-blur-xl shadow-[0_4px_20px_rgba(0,0,0,0.5)]' : 'glass-card'}`}>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16 md:h-20">
                            <a 
                                href="https://thestartupschool.in" 
                                onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in'); }} 
                                className="flex-shrink-0 font-extrabold text-lg md:text-2xl tracking-tight flex items-center gap-2 md:gap-3 hover:opacity-90 transition-opacity"
                            >
                                <img 
                                    src="logo.png" 
                                    alt="Setu - TheStartupSchool" 
                                    className="w-8 h-8 md:w-10 md:h-10 rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.5)] object-cover" 
                                    onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=SS&background=8b5cf6&color=fff&rounded=true' }} 
                                />
                                <span>The<span className="text-brand-gradient">Startup</span><span className="hidden sm:inline">School</span></span>
                            </a>
                            <div>
                                <div className="relative group">
                                    <div className="absolute -inset-0.5 brand-gradient rounded-lg blur opacity-30 group-hover:opacity-70 transition duration-300"></div>
                                    <a 
                                        href="https://thestartupschool.in" 
                                        onClick={(e) => { e.preventDefault(); window.location.replace('https://thestartupschool.in'); }} 
                                        className="relative inline-flex items-center justify-center px-3 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg text-white bg-[#0f172a] border border-white/10 hover:bg-transparent transition-all gap-1.5 md:gap-2"
                                    >
                                        <i className="fa-solid fa-arrow-left"></i> <span className="hidden xs:inline sm:inline">Return</span> Home
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Success Content */}
                <main className="flex-grow flex items-center justify-center pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden min-h-[85vh]">
                    {/* Animated Background Orbs */}
                    <div className="absolute top-1/4 -left-10 w-64 h-64 md:w-96 md:h-96 bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[90px] md:blur-[128px] opacity-30 animate-blob pointer-events-none"></div>
                    <div className="absolute bottom-1/4 -right-10 w-64 h-64 md:w-96 md:h-96 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[90px] md:blur-[128px] opacity-30 animate-blob pointer-events-none" style={{ animationDelay: '2000ms' }}></div>
                    
                    <div className="w-full max-w-2xl relative z-10 fade-in-section is-visible">
                        <div className="glass-card rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 border-t border-l border-r border-white/10 border-b-4 border-b-[#25D366] text-center shadow-[0_15px_40px_-15px_rgba(37,211,102,0.2)] md:shadow-[0_20px_50px_-15px_rgba(37,211,102,0.2)]">
                            
                            {/* Success Icon */}
                            <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-[#25D366]/10 rounded-full flex items-center justify-center mb-6 sm:mb-8 border border-[#25D366]/30 shadow-[0_0_20px_rgba(37,211,102,0.3)] md:shadow-[0_0_30px_rgba(37,211,102,0.3)] animate-success-pop">
                                <i className="fa-solid fa-check text-[#25D366] text-3xl sm:text-4xl md:text-5xl drop-shadow-lg"></i>
                            </div>

                            {/* Text Content */}
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">Payment Successful!</h1>
                            
                            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed font-light mb-6 sm:mb-8 max-w-lg mx-auto">
                                Your transaction has been completed successfully. A confirmation email with the details has been sent to your registered email address.
                            </p>

                            {/* Divider */}
                            <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-6 sm:my-8"></div>

                            {/* Next Steps / WhatsApp CTA */}
                            <div className="bg-[#0f172a]/50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-white/5 backdrop-blur-sm">
                                <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                                    <i className="fa-brands fa-whatsapp text-[#25D366] text-lg md:text-xl"></i> Next Step: Join the Inner Circle
                                </h3>
                                <p className="text-xs sm:text-sm md:text-base text-slate-400 font-light mb-5 sm:mb-6">
                                    Join our exclusive WhatsApp community instantly to avoid any hassle and get immediate access to cohort updates.
                                </p>

                                <div className="relative group block w-full sm:w-auto sm:inline-block">
                                    {/* Glow effect matching WhatsApp green */}
                                    <div className="absolute -inset-1 bg-[#25D366] rounded-xl blur-lg opacity-40 group-hover:opacity-70 transition duration-300"></div>
                                    <a 
                                        href="https://chat.whatsapp.com/Lm2k3AV1HgAI3XxdXBfd4L?mode=gi_t" 
                                        target="_blank" 
                                        rel="noreferrer"
                                        className="relative flex items-center justify-center px-4 py-3.5 sm:px-6 sm:py-4 md:px-8 md:py-5 text-sm sm:text-base md:text-lg font-bold rounded-xl text-white bg-[#25D366] hover:bg-[#20b858] border border-white/20 transition-all duration-300 transform group-hover:-translate-y-1 w-full shadow-lg text-center"
                                    >
                                        <i className="fa-brands fa-whatsapp text-lg sm:text-xl mr-2 animate-pulse"></i> 
                                        <span>Join WhatsApp Group <span className="hidden xs:inline">Now</span></span>
                                        <i className="fa-solid fa-arrow-right ml-2 sm:ml-3 text-white/70 text-xs sm:text-sm"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </main>


            </div>
        </>
    );
}
