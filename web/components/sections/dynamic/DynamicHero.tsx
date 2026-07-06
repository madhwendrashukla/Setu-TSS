"use client";
import React from 'react';

export function DynamicHero({ data }: { data: any }) {
    return (
        <section className="relative w-full min-h-[80vh] flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-bg-main isolate">
            {data.backgroundImage && (
                <div className="absolute inset-0 z-0">
                    <img src={data.backgroundImage} alt="Hero Background" className="w-full h-full object-cover opacity-30" />
                    <div className="absolute inset-0 bg-gradient-to-b from-bg-main/50 via-bg-main/80 to-bg-main"></div>
                </div>
            )}
            
            <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-bold mb-8 uppercase tracking-widest backdrop-blur-md shadow-[0_0_20px_rgba(46,144,250,0.2)]">
                    <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse"></span>
                    Live Masterclass
                </div>
                
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-primary mb-8 tracking-tighter leading-none">
                    {data.title || "Dynamic Hero Title"}
                </h1>
                
                <p className="text-xl md:text-3xl text-text-secondary font-light max-w-3xl mb-12 leading-relaxed">
                    {data.subtitle || "Your dynamic subtitle goes here."}
                </p>
                
                {data.buttonText && (
                    <a href={data.buttonLink || "#"} className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-text-primary text-bg-main rounded-full font-black text-lg uppercase tracking-wider overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_40px_rgba(0,0,0,0.3)]">
                        <span className="relative z-10">{data.buttonText}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-accent-blue to-accent-violet opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <i className="fas fa-arrow-right relative z-10 group-hover:translate-x-1 transition-transform"></i>
                    </a>
                )}
            </div>
        </section>
    );
}
