"use client";
import React from 'react';

export function DynamicWhyUs({ data }: { data: any }) {
 return (
 <section className="w-full py-24 px-6 bg-white border-t border-b border-gray-100 overflow-hidden relative">
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-accent-rose/5 to-transparent rounded-full blur-3xl -z-10 transform translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

 <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16">
 <div className="w-full lg:w-1/2 relative">
 <div className="absolute inset-0 bg-gradient-to-tr from-accent-rose/10 to-transparent rounded-3xl transform -rotate-3 scale-105 z-0"></div>
 <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 bg-white aspect-square md:aspect-[4/3] flex items-center justify-center">
 {data.floatingImage ? (
 <img src={data.floatingImage} alt="Floating Graphic" className="w-full h-full object-cover" />
 ) : (
 <div className="w-full h-full bg-gray-50 flex items-center justify-center text-slate-400">
 <i className="fas fa-image text-6xl"></i>
 </div>
 )}
 </div>
 </div>
 
 <div className="w-full lg:w-1/2 flex flex-col">
 <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
 {data.title || "Why Attend?"}
 </h2>
 
 {data.subtitle && (
 <p className="text-xl text-gray-600 mb-8 leading-relaxed">
 {data.subtitle}
 </p>
 )}
 
 <ul className="space-y-4">
 {(data.list || []).map((item: string, idx: number) => item.trim() && (
 <li key={idx} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
 <div className="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-accent-rose/10 text-accent-rose flex items-center justify-center text-sm">
 <i className="fas fa-check"></i>
 </div>
 <span className="text-gray-800 text-lg">{item}</span>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </section>
 );
}
