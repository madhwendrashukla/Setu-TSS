'use client';
import Image from 'next/image';

export function WorkshopMentor() {
    return (
        <section className="py-16 md:py-24 relative overflow-hidden" id="mentor">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full max-w-xl h-[300px] md:h-[500px] bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[120px] md:blur-[180px] opacity-10 pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">Meet Your Mentor</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] mx-auto rounded-full mb-6" />
                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                        <strong className="font-bold text-white">Learn directly from someone who knows how to navigate the complexities of startup funding.</strong>
                    </p>
                </div>

                <div className="max-w-4xl mx-auto bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] rounded-3xl border-2 border-[#8b5cf6]/40 p-8 md:p-12 relative overflow-hidden flex flex-col items-center gap-8 md:gap-12 shadow-[0_10px_40px_-15px_rgba(139,92,246,0.2)] text-center">
                    <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#8b5cf6] rounded-full mix-blend-screen filter blur-[40px] opacity-30" />
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#d946ef] rounded-full mix-blend-screen filter blur-[40px] opacity-30" />

                    <div className="z-10">
                        <div className="inline-block px-4 py-1.5 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold rounded-lg text-sm mb-6 shadow-lg shadow-[#d946ef]/30 uppercase tracking-widest">Lead Mentor</div>
                        <h3 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2">Gaurav Bansal</h3>
                        <p className="text-lg md:text-xl font-bold mb-8 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">Founder – Setu - TheStartupSchool</p>
                        <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed mb-10 max-w-2xl mx-auto">
                            To master fundraising, you must speak three languages: <strong className="text-white">The Narrative, The Numbers, and The Law.</strong> Gaurav will guide you through the exact execution strategies needed to build an investable company and secure your funding rounds with clarity.
                        </p>
                        <a href="#pricing" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] text-white font-bold hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] transition-all transform hover:-translate-y-1 text-lg">
                            Learn from Gaurav <i className="fa-solid fa-arrow-right ml-2" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function WorkshopProof() {
    return (
        <section className="py-20 md:py-24 bg-transparent text-white border-t border-[#333333] relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-xl p-6 hover:border-[#8b5cf6] transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">Mentor Panel: E-Cell IIT Madras</h3>
                        <div className="aspect-video bg-[#0f172a] rounded-lg mb-6 flex items-center justify-center border border-white/5 group-hover:border-[#8b5cf6]/50 transition relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-[#8b5cf6]/20">
                                <i className="fa-solid fa-graduation-cap text-6xl" />
                            </div>
                            <Image src="/bootcamp.jpeg" alt="Mentor Panel at IIT Madras" width={640} height={360} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300 relative z-10" loading="lazy" />
                        </div>
                        <p className="text-slate-400 text-sm mb-6 flex-grow font-light">Invited as a Mentor at E-Cell IIT Madras. Mentoring early-stage founders, reviewing startup ideas, and providing practical guidance on execution and validation.</p>
                        <a href="https://www.linkedin.com/posts/gauravbansal2_mentor-iit-startup-activity-7404790908174450688-P0G5?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADU8MA4Bu-Z-EZKMZRNCs9TMRf6ND89yVds" target="_blank" rel="noopener noreferrer" className="block w-full text-center border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:text-[#8b5cf6] transition-colors">
                            <i className="fa-brands fa-linkedin mr-2" /> Explore More
                        </a>
                    </div>

                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-xl p-6 hover:border-[#d946ef] transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">IIM ROHTAK: JUDGE & MENTOR</h3>
                        <div className="aspect-video bg-[#0f172a] rounded-lg mb-6 flex items-center justify-center border border-white/5 group-hover:border-[#d946ef]/50 transition relative overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center text-[#d946ef]/20">
                                <i className="fa-solid fa-gavel text-6xl" />
                            </div>
                            <Image src="/iimrohtak.jpg" alt="Judge and Mentor at IIM Rohtak" width={640} height={360} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300 relative z-10" loading="lazy" />
                        </div>
                        <p className="text-slate-400 text-sm mb-6 flex-grow font-light">Invited as a Judge and Mentor at IIM Rohtak. Evaluating innovative startups, providing critical feedback on pitches, and guiding aspiring founders on their journey from concept to scale.</p>
                        <a href="https://www.linkedin.com/in/gauravbansal2/details/featured/" target="_blank" rel="noopener noreferrer" className="block w-full text-center border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:text-[#d946ef] transition-colors">
                            <i className="fa-brands fa-linkedin mr-2" /> View on LinkedIn
                        </a>
                    </div>

                    <div className="bg-[rgba(15,23,42,0.6)] backdrop-blur-[16px] border border-white/10 rounded-xl p-6 hover:border-red-500 transition-all duration-300 group flex flex-col h-full transform hover:-translate-y-2">
                        <h3 className="text-xl font-bold text-white mb-4 text-center">SESSION AT DOON B. SCHOOL</h3>
                        <VideoThumbnail videoId="tt_PVE_A3wU" />
                        <p className="text-slate-400 text-sm mb-6 flex-grow font-light">
                            How to Ideate, Build and Scale your Startup | Hacks and Mistakes.<br />
                            <span className="text-xs text-[#8b5cf6] mt-2 block font-medium">Conducted at Doon Business School.</span>
                        </p>
                        <a href="https://www.youtube.com/watch?v=tt_PVE_A3wU" target="_blank" rel="noopener noreferrer" className="block w-full text-center border border-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/5 hover:text-red-500 hover:border-red-500 transition-colors">
                            <i className="fa-brands fa-youtube mr-2" /> Watch on YouTube
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

function VideoThumbnail({ videoId }: { videoId: string }) {
    'use client';
    // This is rendered on client, but we need useState - handled in parent with 'use client'
    return (
        <div className="aspect-video bg-[#0f172a] rounded-lg mb-6 flex items-center justify-center border border-white/5 group-hover:border-red-500/50 transition relative overflow-hidden cursor-pointer"
            onClick={(e) => {
                const el = e.currentTarget;
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.className = 'absolute inset-0 w-full h-full z-20';
                el.innerHTML = '';
                el.appendChild(iframe);
            }}>
            <img src={`https://img.youtube.com/vi/${videoId}/hqdefault.jpg`} alt="Session Thumbnail" width={640} height={360} loading="lazy" className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-300" />
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                    <i className="fa-solid fa-play text-white ml-1 text-lg" />
                </div>
            </div>
        </div>
    );
}
