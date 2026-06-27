"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Sparkles, Star, Users, BookOpen, Quote, ArrowRight, Play } from 'lucide-react';

const ExperienceCards = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="grid lg:grid-cols-3 gap-6 w-full">
            {/* Block 1 */}
            <div className="bg-white border border-black/5 rounded-[24px] p-5 hover:border-[#6B21FB]/30 transition duration-500 group flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[16/10] bg-gray-100 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <Image src="/bootcamp.webp" alt="Mentor Panel at IIT Madras" width={640} height={360} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                </div>
                <h3 className="text-[15px] font-bold text-black mb-2 tracking-tight uppercase">Mentor Panel:<br/>E-Cell IIT Madras</h3>
                <p className="text-text-secondary text-xs mb-6 leading-relaxed font-medium flex-grow">
                    Mentoring early-stage founders, reviewing startup ideas, and providing practical guidance on execution and validation.
                </p>
                <a href="https://www.linkedin.com/posts/gauravbansal2_mentor-iit-startup-activity-7404790908174450688-P0G5" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6B21FB] text-xs font-bold transition-all group-hover:gap-3 mt-auto">
                    View Story <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* Block 2 */}
            <div className="bg-white border border-black/5 rounded-[24px] p-5 hover:border-[#6B21FB]/30 transition duration-500 group flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1">
                <div className="aspect-[16/10] bg-gray-100 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <Image src="/iimrohtak.webp" alt="Judge and Mentor at IIM Rohtak" width={640} height={360} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                </div>
                <h3 className="text-[15px] font-bold text-black mb-2 tracking-tight uppercase">IIM ROHTAK:<br/>JUDGE & MENTOR</h3>
                <p className="text-text-secondary text-xs mb-6 leading-relaxed font-medium flex-grow">
                    Invited as a Judge and Mentor. Evaluating innovative startups, providing critical feedback on pitches, and guiding aspiring founders on their journey from concept to scale.
                </p>
                <a href="https://www.linkedin.com/in/gauravbansal2/details/featured/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6B21FB] text-xs font-bold transition-all group-hover:gap-3 mt-auto">
                    View on LinkedIn <ArrowRight className="w-4 h-4" />
                </a>
            </div>

            {/* Block 3 */}
            <div className="bg-white border border-black/5 rounded-[24px] p-5 hover:border-[#6B21FB]/30 transition duration-500 group flex flex-col shadow-sm hover:shadow-lg hover:-translate-y-1">
                <div
                    onClick={() => setIsPlaying(true)}
                    className={`aspect-[16/10] bg-gray-100 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden ${!isPlaying ? 'cursor-pointer' : ''}`}
                >
                    {isPlaying ? (
                        <iframe
                            width="100%"
                            height="100%"
                            src="https://www.youtube-nocookie.com/embed/tt_PVE_A3wU?autoplay=1&modestbranding=1&rel=0"
                            title="YouTube session at Doon Business School"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen>
                        </iframe>
                    ) : (
                        <>
                            <Image src={`https://img.youtube.com/vi/tt_PVE_A3wU/hqdefault.jpg`} alt="Session Thumbnail" width={640} height={360} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" unoptimized />
                            <div className="absolute inset-0 flex items-center justify-center z-10">
                                <div className="w-12 h-12 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition duration-300">
                                    <Play className="w-5 h-5 text-white ml-1 fill-white" />
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <h3 className="text-[15px] font-bold text-black mb-2 tracking-tight uppercase">SESSION AT<br/>DOON B. SCHOOL</h3>
                <p className="text-text-secondary text-xs mb-6 leading-relaxed font-medium flex-grow">
                    How to Ideate, Build and Scale your Startup | Hacks and Mistakes.
                </p>
                <a href="https://www.youtube.com/watch?v=tt_PVE_A3wU" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#6B21FB] text-xs font-bold transition-all group-hover:gap-3 mt-auto">
                    Watch on YouTube <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

export function FounderManifesto() {
    return (
        <section id="manifesto" className="card-section pb-16 md:pb-24 pt-0 -mt-32 md:-mt-40 relative z-20">
            {/* Background Pattern */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_20%,transparent_100%)]"></div>
            {/* Left side purple soft gradient glow as in mockup */}
            <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-[#6B21FB]/10 rounded-full blur-[120px] pointer-events-none -translate-x-1/2"></div>

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                
                {/* Top Section: Quote & Profile */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-16 mb-24">
                    {/* Left: Quote */}
                    <div className="flex-1 max-w-2xl">
                        <div className="inline-flex items-center gap-2 text-[#6B21FB] font-bold text-xs tracking-[0.2em] uppercase mb-8">
                            <Sparkles className="w-4 h-4" /> THE FOUNDER'S MANIFESTO
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-black leading-[1.25] tracking-tight mb-12">
                            “दिल में हो आग <br />
                            तो जलती रहनी चाहिए,<br />
                            तेरा हो चाहे मेरा,<br />
                            <span className="text-[#6B21FB]">सपना ज़िंदा रहना चाहिए !</span>”
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-[2px] bg-black"></div>
                            <div>
                                <h4 className="text-xl font-bold text-black tracking-tight">Gaurav Bansal</h4>
                                <p className="text-text-secondary text-sm font-medium">Founder, Setu</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Profile Card */}
                    <div className="w-full lg:w-[320px] shrink-0 bg-white rounded-[32px] p-8 shadow-[0_20px_60px_rgba(0,0,0,0.06)] border border-black/5 relative overflow-hidden group">
                        <div className="w-28 h-28 mx-auto rounded-full bg-[#f3e8ff] p-1.5 mb-6 relative overflow-hidden border-2 border-white shadow-sm">
                            <Image
                                src="/gaurav.webp"
                                alt="Gaurav Bansal"
                                width={120}
                                height={120}
                                className="w-full h-full rounded-full object-cover"
                                loading="lazy"
                            />
                        </div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-black tracking-tight">Gaurav Bansal</h3>
                            <p className="text-[#6B21FB] font-bold text-sm">Founder, Setu</p>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 text-text-secondary font-medium text-sm">
                                <div className="w-6 flex justify-center"><Star className="w-4 h-4 text-[#6B21FB]" /></div>
                                Builder
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary font-medium text-sm">
                                <div className="w-6 flex justify-center"><Users className="w-4 h-4 text-[#6B21FB]" /></div>
                                Mentor
                            </div>
                            <div className="flex items-center gap-4 text-text-secondary font-medium text-sm">
                                <div className="w-6 flex justify-center"><BookOpen className="w-4 h-4 text-[#6B21FB]" /></div>
                                Educator
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4 Points Grid */}
                <div className="grid md:grid-cols-2 gap-x-20 gap-y-16 mb-32 max-w-5xl mx-auto">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-[#6B21FB]">01</span>
                            <div className="h-px bg-[#6B21FB]/30 flex-1"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 leading-tight tracking-tight">
                            Startups aren't built<br/>in garages.
                        </h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            They're built at kitchen tables amidst family debates, silent sacrifices, and financial anxiety.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-[#6B21FB]">02</span>
                            <div className="h-px bg-[#6B21FB]/30 flex-1"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 leading-tight tracking-tight">
                            Opportunity cost<br/>isn't financial.
                        </h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            <span className="opacity-60 block mb-2">It's emotional.</span>
                            It is a weight on a founder's soul.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-[#6B21FB]">03</span>
                            <div className="h-px bg-[#6B21FB]/30 flex-1"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 leading-tight tracking-tight">
                            Support in the first<br/>100 days
                        </h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            <span className="block mb-4">is more valuable than capital in 300.</span>
                            Outliers don't die because they lack talent — they die because they lack a map.
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <span className="text-3xl font-bold text-[#6B21FB]">04</span>
                            <div className="h-px bg-[#6B21FB]/30 flex-1"></div>
                        </div>
                        <h3 className="text-2xl font-bold text-black mb-4 leading-tight tracking-tight">
                            Founders don't need<br/>investors.
                        </h3>
                        <p className="text-text-secondary font-medium leading-relaxed">
                            <span className="block mb-4">They need believers.</span>
                            If we provide the right scaffolding to the aspiring founder, we will unlock an era of unstoppable builders.
                        </p>
                    </div>
                </div>

                {/* Experience Section */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 mb-24 items-center lg:items-stretch">
                    <div className="w-full lg:w-48 shrink-0 flex flex-col pt-4">
                        <span className="text-[#6B21FB] font-bold text-[10px] tracking-widest uppercase mb-3">EXPERIENCE</span>
                        <h2 className="text-2xl md:text-3xl font-bold text-black leading-tight tracking-tight">
                            Where these ideas<br className="hidden lg:block"/> were tested.
                        </h2>
                    </div>
                    <div className="flex-1 w-full">
                        <ExperienceCards />
                    </div>
                </div>

                {/* Bottom Quote Banner */}
                <div className="bg-[#f8f5ff] rounded-3xl p-8 md:p-12 text-center relative overflow-hidden border border-[#6B21FB]/10">
                    <div className="flex justify-center mb-6">
                        <Quote className="w-10 h-10 text-[#6B21FB] fill-[#6B21FB] opacity-80" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-black mb-4 tracking-tight">
                        This school is not built on theory.
                    </h3>
                    <p className="text-lg md:text-xl text-text-secondary font-medium max-w-3xl mx-auto">
                        It is built on lived <span className="text-[#6B21FB] font-bold">experience, scars</span>, and <span className="text-[#6B21FB] font-bold">lessons</span> earned the hard way.
                    </p>
                </div>

            </div>
        </section>
    );
}
