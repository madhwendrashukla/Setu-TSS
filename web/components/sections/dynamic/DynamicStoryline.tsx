"use client";
import React from 'react';
import { PageData } from '@/types/cms';

export function DynamicStoryline({ data }: { data: PageData }) {
    if (!data?.story) return null;

    const { story } = data;

    const renderBulletIcon = (style: string) => {
        switch(style) {
            case 'check':
                return (
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]">
                        <i className="fas fa-check text-[10px] text-green-600"></i>
                    </div>
                );
            case 'check_light':
                return (
                    <div className="w-5 h-5 rounded-full bg-green-50 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fas fa-check text-[10px] text-green-500"></i>
                    </div>
                );
            case 'cross':
                return (
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1 shadow-[0_0_10px_rgba(248,113,113,0.2)]">
                        <i className="fas fa-times text-[10px] text-red-600"></i>
                    </div>
                );
            case 'cross_light':
                return (
                    <div className="w-5 h-5 rounded-full bg-red-50 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fas fa-times text-[10px] text-red-400"></i>
                    </div>
                );
            case 'check_purple':
                return (
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0 mt-0.5 border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                        <i className="fas fa-check text-[10px] text-purple-400"></i>
                    </div>
                );
            case 'check_purple_light':
                return (
                    <div className="w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fas fa-check text-[10px] text-purple-500"></i>
                    </div>
                );
            case 'cross_grey':
                return (
                    <div className="w-6 h-6 rounded-full bg-slate-800/80 flex items-center justify-center shrink-0 mt-0.5 border border-slate-700/80">
                        <i className="fas fa-times text-[10px] text-slate-500"></i>
                    </div>
                );
            default:
                return (
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                        <i className="fas fa-arrow-right text-[10px] text-blue-600"></i>
                    </div>
                );
        }
    };

    const getBoxThemeClasses = (theme: string) => {
        if (theme === 'dark') {
            return "bg-[#161821] border border-white/5 shadow-xl";
        }
        if (theme === 'purple') {
            return "bg-gradient-to-br from-[#1b1238] to-[#0c0817] border border-purple-500/30 shadow-[0_0_50px_rgba(168,85,247,0.15)]";
        }
        if (theme === 'light_purple') {
            return "bg-white border border-purple-200 shadow-[0_0_40px_rgba(168,85,247,0.08)] ring-1 ring-purple-100";
        }
        // Default light (Why This Program style)
        return "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)]";
    };

    const getTitleClasses = (theme: string) => {
        if (theme === 'dark' || theme === 'purple') return "text-white";
        return "text-slate-900";
    };

    const getDescriptionClasses = (theme: string) => {
        if (theme === 'purple') return "text-purple-400";
        if (theme === 'light_purple') return "text-purple-600";
        if (theme === 'dark') return "text-slate-400";
        return "text-slate-500";
    };

    const getBulletTextClasses = (theme: string, style: string) => {
        if (theme === 'dark' || theme === 'purple') {
            if (style === 'cross_grey') return "text-slate-400";
            return "text-slate-200 font-medium";
        }
        if (style === 'cross_light' || style === 'check_light') return "text-slate-600";
        if (style === 'check_purple_light') return "text-slate-700";
        if (style === 'cross') return "text-slate-500";
        return "text-slate-700 font-medium";
    };

    const gridCols = story.boxes?.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : story.boxes?.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3';

    // Auto-detect if we should use a dark section background
    const allDark = story.boxes?.every((b: any) => b.theme === 'dark' || b.theme === 'purple');
    const hasLightPurple = story.boxes?.some((b: any) => b.theme === 'light_purple');
    
    let sectionBg = allDark ? "bg-[#0b0e14]" : "bg-[#FAFAFC]";

    return (
        <section className={`py-24 relative overflow-hidden ${sectionBg}`}>
            {/* Grid Pattern Background for both light and dark */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 ${allDark ? 'opacity-[0.02]' : 'opacity-[0.03]'}`} style={{ backgroundImage: `linear-gradient(${allDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px), linear-gradient(90deg, ${allDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            </div>
            
            {/* Light Mode Gradients for "Tale of Two Founders" / "Why This Program" vibe */}
            {!allDark && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-pink-300/10 rounded-full blur-[120px]" />
                    <div className="absolute top-[0%] right-[0%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]" />
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 max-w-3xl mx-auto">
                    {story.headline && (
                        <h2 
                            className={`text-4xl md:text-5xl font-bold mb-5 tracking-tight ${allDark ? 'text-white' : 'text-slate-900'}`}
                            dangerouslySetInnerHTML={{ __html: story.headline }}
                        />
                    )}
                    {story.description && (
                        <div 
                            className={`text-lg md:text-xl ${allDark ? 'text-slate-400' : 'text-slate-500'}`}
                            dangerouslySetInnerHTML={{ __html: story.description }}
                        />
                    )}
                </div>

                {story.boxes && story.boxes.length > 0 && (
                    <div className={`grid grid-cols-1 ${gridCols} gap-6 lg:gap-8 items-stretch relative`}>
                        {/* Connecting Line if exactly 2 boxes */}
                        {story.boxes.length === 2 && (
                            <div className={`hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-24 h-[1px] -z-10 ${allDark ? 'bg-gradient-to-r from-slate-700/50 to-purple-500/50' : 'bg-purple-200'}`}></div>
                        )}

                        {story.boxes.map((box: any, idx: number) => {
                            const theme = box.theme || 'light';
                            const watermarkIcon = box.watermark_icon || box.icon_class;
                            
                            return (
                                <div key={idx} className={`rounded-[2rem] p-8 md:p-10 transition-all duration-500 relative group overflow-hidden border ${theme === 'light' ? 'border-gray-50' : ''} flex flex-col h-full ${getBoxThemeClasses(theme)}`}>
                                    
                                    {/* Giant Watermark Background Icon */}
                                    {watermarkIcon && (
                                        <i className={`${watermarkIcon} absolute -top-10 -right-10 text-[250px] opacity-[0.02] transform rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:opacity-[0.04] ${theme === 'light_purple' ? 'text-purple-600 opacity-[0.04]' : theme === 'light' ? 'text-gray-900 opacity-[0.03]' : ''}`}></i>
                                    )}

                                    {/* Icon Header */}
                                    {box.icon_class && (
                                        <div className="mb-6 relative z-10">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl
                                                ${theme === 'purple' ? 'bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.5)]' : 
                                                  theme === 'light_purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-[0_4px_15px_rgba(168,85,247,0.3)]' :
                                                  theme === 'dark' ? 'bg-slate-800 text-slate-300' : 
                                                  'bg-[#f0f1f5] text-slate-600'}`}>
                                                <i className={box.icon_class}></i>
                                            </div>
                                        </div>
                                    )}

                                    <h3 className={`text-xl md:text-[22px] font-bold mb-3 relative z-10 ${getTitleClasses(theme)}`}>{box.title}</h3>
                                    
                                    <p className={`text-sm md:text-[15px] mb-8 relative z-10 ${getDescriptionClasses(theme)}`} dangerouslySetInnerHTML={{__html: box.description}}></p>
                                    
                                    <ul className="space-y-5 flex-1 relative z-10">
                                        {box.bullets && box.bullets.map((bullet: any, bIdx: number) => (
                                            <li key={bIdx} className="flex items-start gap-4">
                                                {renderBulletIcon(bullet.style)}
                                                <span 
                                                    className={`text-[14px] leading-relaxed pt-0.5 ${getBulletTextClasses(theme, bullet.style)}`}
                                                    dangerouslySetInnerHTML={{ __html: bullet.text }}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            );
                        })}
                    </div>
                )}
                
                {/* Bottom Banner if exactly 2 boxes and light mode */}
                {!allDark && hasLightPurple && story.boxes?.length === 2 && (
                    <div className="mt-12 max-w-2xl mx-auto bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] rounded-full px-8 py-4 flex items-center justify-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center shrink-0">
                            <i className="fas fa-star text-xs"></i>
                        </div>
                        <p className="text-gray-600 text-sm md:text-base font-medium">
                            We help you become the <span className="text-purple-700 font-bold">Founder 2</span>. <span className="text-gray-400">Structured. Prepared. Investable.</span>
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
