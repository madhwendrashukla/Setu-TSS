"use client";

import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export function WhoIsSetuFor() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: false, margin: "-100px" });

    return (
        <section className="w-full bg-transparent text-gray-900 py-24 md:py-32 relative overflow-hidden" ref={containerRef}>
            {/* Very faint grid background for minimal texture in light mode */}
            <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }}></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-start w-full">
                <div className="mb-16 md:mb-24">
                    <span className="text-gray-500 font-bold text-xs md:text-sm tracking-[0.2em] uppercase mb-4 block">
                        OUR CORE PHILOSOPHY
                    </span>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-4">
                        What exactly is Setu?
                    </h2>
                </div>

                {/* Curve and Points Container */}
                <div className="relative w-full h-[400px] md:h-[500px] mt-10 md:mt-20">
                    
                    {/* The SVG Curve */}
                    <svg 
                        className="absolute inset-0 w-full h-full overflow-visible" 
                        preserveAspectRatio="none"
                        viewBox="0 0 1000 500"
                    >
                        <defs>
                            <linearGradient id="cleanLine" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(107,33,251,0.1)" />
                                <stop offset="50%" stopColor="rgba(107,33,251,0.6)" />
                                <stop offset="100%" stopColor="rgba(107,33,251,1)" />
                            </linearGradient>
                        </defs>
                        
                        {/* Faint background path */}
                        <path 
                            d="M -50 480 C 300 480, 500 250, 1050 50" 
                            fill="none" 
                            stroke="rgba(0,0,0,0.05)" 
                            strokeWidth="3"
                        />
                        
                        {/* Main primary-color path */}
                        <motion.path 
                            d="M -50 480 C 300 480, 500 250, 1050 50" 
                            fill="none" 
                            stroke="url(#cleanLine)" 
                            strokeWidth="2"
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                        />
                    </svg>

                    {/* Point 1: Mentorship & Guidance */}
                    <motion.div 
                        className="absolute flex flex-col items-start"
                        style={{ left: '20%', top: '86.2%' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 0.8 }}
                    >
                        {/* Content box positioned above the dot */}
                        <div className="absolute bottom-full left-0 pb-24 transform -translate-x-12">
                            <div className="flex flex-row items-center gap-4 w-[350px]">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight w-[120px]">
                                    Mentorship & Guidance
                                </h3>
                                <div className="h-14 w-px bg-gray-300"></div>
                                <p className="text-gray-600 text-xs md:text-sm max-w-[180px] leading-relaxed">
                                    Get expert guidance to navigate the startup world. We help you build, incubate, and grow.
                                </p>
                            </div>
                        </div>
                        {/* Connector line extending up from the dot */}
                        <div className="absolute bottom-0 left-0 w-px h-24 bg-gray-200"></div>
                        {/* Dot on the curve */}
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-[#6B21FB] transform -translate-x-[2px] -translate-y-[2px]"></div>
                    </motion.div>

                    {/* Point 2: Alternate B-School */}
                    <motion.div 
                        className="absolute flex flex-col items-start"
                        style={{ left: '50%', top: '59.6%' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 1.2 }}
                    >
                        {/* Content box positioned above the dot */}
                        <div className="absolute bottom-full left-0 pb-32 transform -translate-x-12">
                            <div className="flex flex-row items-center gap-4 w-[350px]">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight w-[120px]">
                                    Alternate B-School
                                </h3>
                                <div className="h-14 w-px bg-gray-300"></div>
                                <p className="text-gray-600 text-xs md:text-sm max-w-[180px] leading-relaxed">
                                    Real-world education through interactive workshops, courses, and hands-on incubation.
                                </p>
                            </div>
                        </div>
                        {/* Connector line extending up from the dot */}
                        <div className="absolute bottom-0 left-0 w-px h-32 bg-gray-200"></div>
                        {/* Dot on the curve */}
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-[#6B21FB] transform -translate-x-[2px] -translate-y-[2px]"></div>
                    </motion.div>

                    {/* Point 3: Ecosystem & Free Tools */}
                    <motion.div 
                        className="absolute flex flex-col items-start"
                        style={{ left: '80%', top: '31.2%' }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                        transition={{ duration: 0.6, delay: 1.6 }}
                    >
                        {/* Content box positioned above the dot */}
                        <div className="absolute bottom-full left-0 pb-28 transform -translate-x-12">
                            <div className="flex flex-row items-center gap-4 w-[350px]">
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight w-[120px]">
                                    Ecosystem & Tools
                                </h3>
                                <div className="h-14 w-px bg-gray-300"></div>
                                <p className="text-gray-600 text-xs md:text-sm max-w-[180px] leading-relaxed">
                                    Free access to premium tools, resources, and deep immersion into the startup ecosystem.
                                </p>
                            </div>
                        </div>
                        {/* Connector line extending up from the dot */}
                        <div className="absolute bottom-0 left-0 w-px h-28 bg-gray-200"></div>
                        {/* Dot on the curve */}
                        <div className="absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full bg-[#6B21FB] transform -translate-x-[2px] -translate-y-[2px]"></div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
