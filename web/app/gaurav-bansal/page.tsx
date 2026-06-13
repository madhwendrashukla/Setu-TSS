'use client';

import React, { useState } from 'react';

export default function GauravBansalProfile() {
    const [copied, setCopied] = useState(false);

    const copyCurrentUrl = () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        });
    };

    const downloadVCard = () => {
        const vcard = "BEGIN:VCARD\n" +
            "VERSION:3.0\n" +
            "FN:Gaurav Bansal\n" +
            "ORG:Setu - TheStartupSchool\n" +
            "TITLE:Founder\n" +
            "TEL;TYPE=CELL:+919289121121\n" +
            "EMAIL:Gauravbansal@thestartupschool.in\n" +
            "URL:https://thestartupschool.in\n" +
            "ADR;TYPE=WORK:;;Malad West;Mumbai;;;\n" +
            "END:VCARD";

        const blob = new Blob([vcard], { type: "text/vcard" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'Gaurav_Bansal.vcf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <>

            {/* Custom Styles and Tailwind overrides specific to this page */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Instrument+Serif:ital@1&display=swap');
                
                @keyframes reveal {
                    from { opacity: 0; transform: translateY(20px); filter: blur(8px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }

                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                .profile-body { 
                    background-color: #050810; 
                    overflow-x: hidden;
                    color: #f8fafc;
                    font-family: 'Plus Jakarta Sans', sans-serif;
                }

                .profile-body .font-serif {
                    font-family: 'Instrument Serif', serif;
                }

                .dot-pattern {
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(rgba(139, 92, 246, 0.1) 1.5px, transparent 1.5px);
                    background-size: 32px 32px;
                    z-index: -1;
                }

                .glow-orb {
                    position: fixed;
                    width: 100vw;
                    height: 100vh;
                    background: radial-gradient(circle at 50% -10%, rgba(139, 92, 246, 0.15) 0%, transparent 60%);
                    z-index: -1;
                    pointer-events: none;
                }

                .glass-card {
                    background: rgba(13, 18, 31, 0.7);
                    backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }

                .glass-card:hover {
                    border-color: rgba(139, 92, 246, 0.4);
                    background: rgba(18, 25, 43, 0.85);
                    transform: translateY(-2px);
                }

                .primary-cta {
                    background: linear-gradient(135deg, #8b5cf6, #d946ef);
                    position: relative;
                    overflow: hidden;
                }

                .primary-cta::after {
                    content: '';
                    position: absolute;
                    top: -50%; left: -50%; width: 200%; height: 200%;
                    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.15), transparent);
                    transform: rotate(45deg);
                    animation: shimmer 4s infinite;
                }

                @keyframes shimmer {
                    0% { transform: translateX(-100%) rotate(45deg); }
                    100% { transform: translateX(100%) rotate(45deg); }
                }

                .reveal {
                    opacity: 0;
                    animation: reveal 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }

                .delay-1 { animation-delay: 0.1s; }
                .delay-2 { animation-delay: 0.2s; }
                .delay-3 { animation-delay: 0.3s; }
                .delay-4 { animation-delay: 0.4s; }

                /* Hide global navbar/footer for this specific page layout */
                header nav, footer.global-footer, .directory-advisor-bot {
                    display: none !important;
                }
            `}} />

            <div className="profile-body min-h-screen relative">
                <div className="dot-pattern"></div>
                <div className="glow-orb"></div>

                {/* Background mesh for extra desktop appeal */}
                <div className="fixed top-0 left-0 w-full h-full opacity-20 pointer-events-none z-[-1] overflow-hidden">
                    <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-[#8b5cf6]/20 blur-[120px] rounded-full"></div>
                    <div className="absolute bottom-[10%] right-[-10%] w-[30vw] h-[30vw] bg-[#d946ef]/10 blur-[100px] rounded-full"></div>
                </div>

                <main className="relative z-10 min-h-screen flex flex-col items-center pt-12 md:pt-24 pb-24 px-6">
                    

                    {/* Profile Header */}
                    <header className="text-center mb-14 w-full max-w-lg md:max-w-2xl">
                        <div className="reveal delay-1 relative inline-block mb-8">
                            <div className="relative w-36 h-36 md:w-48 md:h-48 rounded-full p-1.5 bg-gradient-to-b from-white/20 to-transparent" style={{ animation: 'float 6s ease-in-out infinite' }}>
                                <div className="w-full h-full rounded-full overflow-hidden border-[4px] border-[#050810] bg-[#0d121f] shadow-2xl flex items-center justify-center">
                                    <img 
                                        src="/gaurav.jpg" 
                                        alt="Gaurav Bansal" 
                                        className="w-full h-full object-cover object-top" 
                                        onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=Gaurav+Bansal&background=1e1b4b&color=a78bfa&size=256' }}
                                    />
                                </div>
                            </div>
                            {/* Verified Badge */}
                            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 bg-blue-500 text-white w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-[4px] border-[#050810] shadow-lg">
                                <i className="fas fa-check text-[10px] md:text-sm"></i>
                            </div>
                        </div>

                        <h1 className="reveal delay-2 text-4xl md:text-6xl font-black text-white tracking-tight mb-12">Gaurav Bansal</h1>
                        
                        <div className="reveal delay-2 relative max-w-sm md:max-w-xl mx-auto">
                            <div className="glass-card p-8 md:p-10 rounded-3xl border-white/5">
                                <p className="text-[16px] md:text-2xl text-slate-400 font-serif italic leading-relaxed">
                                    "Building Bharat's Launchpad for next generation of Entrepreneurs"
                                </p>
                            </div>
                        </div>
                    </header>

                    {/* Link Stack */}
                    <div className="w-full max-w-lg md:max-w-2xl space-y-14">
                        
                        {/* Company Section */}
                        <div className="space-y-5">
                            <div className="reveal delay-3 flex items-center gap-4 px-3 mb-3">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Ecosystem</h3>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            {/* Main Website CTA */}
                            <a href="https://thestartupschool.in/" target="_blank" rel="noreferrer" className="reveal delay-3 primary-cta flex items-center justify-between p-6 md:p-8 rounded-full group transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-[#8b5cf6]/20">
                                <div className="flex items-center gap-5 ml-2">
                                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/20 flex items-center justify-center text-xl md:text-3xl text-white">
                                        <i className="fas fa-globe"></i>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-xl md:text-3xl text-white">Visit Website</span>
                                        <span className="text-[10px] md:text-[11px] text-white/70 font-bold uppercase tracking-widest">thestartupschool.in</span>
                                    </div>
                                </div>
                                <div className="mr-2 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/20 text-white group-hover:bg-white group-hover:text-[#8b5cf6] transition-all">
                                    <i className="fas fa-arrow-right text-sm md:text-base"></i>
                                </div>
                            </a>

                            <a href="https://www.linkedin.com/company/the-startup-school-2026/" target="_blank" rel="noreferrer" className="reveal delay-3 glass-card flex items-center justify-between p-5 md:p-6 rounded-3xl group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-2xl md:text-3xl">
                                        <i className="fab fa-linkedin"></i>
                                    </div>
                                    <span className="font-bold text-slate-200 md:text-2xl">Setu - TheStartupSchool LinkedIn</span>
                                </div>
                                <i className="fas fa-chevron-right text-slate-700 group-hover:text-white transition-all mr-3"></i>
                            </a>

                            <a href="https://www.instagram.com/the__startup__school" target="_blank" rel="noreferrer" className="reveal delay-4 glass-card flex items-center justify-between p-5 md:p-6 rounded-3xl group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl md:text-3xl">
                                        <i className="fab fa-instagram"></i>
                                    </div>
                                    <span className="font-bold text-slate-200 md:text-2xl">Follow our Instagram</span>
                                </div>
                                <i className="fas fa-chevron-right text-slate-700 group-hover:text-white transition-all mr-3"></i>
                            </a>
                        </div>

                        {/* Founder Section */}
                        <div className="space-y-5">
                            <div className="reveal delay-4 flex items-center gap-4 px-3 mb-3">
                                <h3 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.5em]">Founder</h3>
                                <div className="h-px flex-1 bg-white/5"></div>
                            </div>

                            <a href="https://www.linkedin.com/in/gauravbansal2/" target="_blank" rel="noreferrer" className="reveal delay-4 glass-card flex items-center justify-between p-5 md:p-6 rounded-3xl group">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 text-slate-400 flex items-center justify-center text-2xl md:text-3xl group-hover:bg-white group-hover:text-[#050810] transition-all">
                                        <i className="fab fa-linkedin-in"></i>
                                    </div>
                                    <span className="font-bold text-slate-200 md:text-2xl">Connect with Gaurav</span>
                                </div>
                                <i className="fas fa-external-link-alt text-slate-700 group-hover:text-white text-xs md:text-sm transition-all mr-3"></i>
                            </a>

                            <a href="https://www.youtube.com/watch?v=tt_PVE_A3wU" target="_blank" rel="noreferrer" className="reveal delay-4 glass-card flex items-center justify-between p-5 md:p-6 rounded-3xl group border-red-500/10">
                                <div className="flex items-center gap-5">
                                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center text-2xl md:text-3xl group-hover:bg-red-500 group-hover:text-white transition-all">
                                        <i className="fab fa-youtube"></i>
                                    </div>
                                    <div>
                                        <span className="block font-bold text-slate-200 md:text-2xl">Founder's Hacks</span>
                                        <span className="text-[10px] md:text-[11px] text-slate-500 font-bold uppercase tracking-widest">Masterclass Video</span>
                                    </div>
                                </div>
                                <i className="fas fa-play text-red-500 group-hover:text-white transition-all mr-4 text-xs md:text-sm"></i>
                            </a>
                        </div>
                    </div>

                    {/* Sticky Bottom Actions */}
                    <footer className="mt-24 text-center w-full max-w-lg md:max-w-2xl space-y-8 !block bg-transparent p-0 m-0 border-none shadow-none text-inherit font-inherit" style={{ display: 'block' }}>
                        {/* Save Contact Button */}
                        <button onClick={downloadVCard} className="reveal delay-4 w-full primary-cta flex items-center justify-center gap-4 py-5 md:py-6 px-10 rounded-3xl font-black text-white text-base md:text-xl tracking-widest uppercase hover:scale-[1.02] transition-all shadow-2xl shadow-[#8b5cf6]/30 border-none cursor-pointer">
                            <i className="fas fa-user-plus text-xl md:text-2xl"></i> Save Contact to Phone
                        </button>

                        {/* Share Button */}
                        <button 
                            onClick={copyCurrentUrl} 
                            className="reveal delay-4 w-full glass-card py-5 md:py-6 px-10 rounded-3xl font-black text-slate-400 text-[11px] md:text-sm tracking-[0.4em] uppercase transition-all flex items-center justify-center gap-4 cursor-pointer"
                            style={copied ? { borderColor: '#10b981', color: '#10b981' } : {}}
                        >
                            {copied ? (
                                <><i className="fas fa-check"></i> Profile Copied</>
                            ) : (
                                <><i className="fas fa-share-alt text-[#8b5cf6] text-lg"></i> Share Profile</>
                            )}
                        </button>
                        
                        <div className="reveal delay-4 mt-20 select-none opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
                            <div className="text-2xl md:text-5xl font-black text-white tracking-tighter uppercase">
                                THE <span className="text-[#8b5cf6]">STARTUP</span> SCHOOL
                            </div>
                            <p className="text-[8px] md:text-[11px] uppercase tracking-[1em] font-bold mt-4 text-slate-500">An alternate B-School for all Aspiring Founders</p>
                        </div>
                    </footer>
                </main>
            </div>
        </>
    );
}
