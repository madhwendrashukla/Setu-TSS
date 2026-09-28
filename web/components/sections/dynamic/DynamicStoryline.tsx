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

    const getBoxThemeClasses = () => {
        return "bg-white shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)]";
    };

    const getTitleClasses = () => {
        return "text-slate-900";
    };

    const getDescriptionClasses = () => {
        return "text-slate-500";
    };

    const getBulletTextClasses = (style: string) => {
        if (style === 'cross_light' || style === 'check_light') return "text-slate-600";
        if (style === 'check_purple_light') return "text-slate-700";
        if (style === 'cross') return "text-slate-500";
        return "text-slate-700 font-medium";
    };

    const gridCols = story.boxes?.length === 2 ? 'md:grid-cols-2 max-w-5xl mx-auto' : story.boxes?.length === 1 ? 'md:grid-cols-1 max-w-2xl mx-auto' : 'md:grid-cols-2 lg:grid-cols-3';
    
    let sectionBg = "bg-[#FAFAFC]";

    return (
        <section className={`py-12 sm:py-20 md:py-24 relative overflow-hidden ${sectionBg}`}>
            {/* Grid Pattern Background for both light and dark */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute inset-0 opacity-[0.03]`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)`, backgroundSize: '40px 40px' }}></div>
            </div>
            
            {/* Light Mode Gradients for "Tale of Two Founders" / "Why This Program" vibe */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[-10%] w-[40%] h-[40%] bg-pink-300/10 rounded-full blur-[120px]" />
                <div className="absolute top-[0%] right-[0%] w-[40%] h-[40%] bg-purple-400/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto">
                    {story.headline && (
                        <h2 
                            className={`text-2xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-5 tracking-tight text-slate-900`}
                            dangerouslySetInnerHTML={{ __html: story.headline }}
                        />
                    )}
                    {story.description && (
                        <div 
                            className={`text-sm sm:text-lg md:text-xl text-slate-500`}
                            dangerouslySetInnerHTML={{ __html: story.description }}
                        />
                    )}
                </div>

                {story.boxes && story.boxes.length > 0 && (
                    <div className={`grid grid-cols-1 ${gridCols} gap-4 sm:gap-6 lg:gap-8 items-stretch relative`}>
                        {/* Connecting Line if exactly 2 boxes */}
                        {story.boxes.length === 2 && (
                            <div className={`hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 w-24 h-[1px] -z-10 bg-purple-200`}></div>
                        )}

                        {story.boxes.map((box: any, idx: number) => {
                            const watermarkIcon = box.watermark_icon || box.icon_class;
                            
                            return (
                                <div key={idx} className={`rounded-2xl sm:rounded-[2rem] p-5 sm:p-8 md:p-10 transition-all duration-500 relative group overflow-hidden flex flex-col h-full ${getBoxThemeClasses()}`}>
                                    
                                    {/* Giant Watermark Background Icon */}
                                    {watermarkIcon && (
                                        <i className={`${watermarkIcon} absolute -top-10 -right-10 text-[250px] opacity-[0.03] transform rotate-12 pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:opacity-[0.05] text-gray-900`}></i>
                                    )}

                                    {/* Icon Header */}
                                    {(box.icon_class || box.image_url) && (
                                        <div className="mb-4 sm:mb-6 relative z-10">
                                            {box.image_url ? (
                                                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center bg-white">
                                                    <img src={box.image_url} alt="" className="w-full h-full object-contain p-1" />
                                                </div>
                                            ) : (
                                                <div className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl bg-[#f0f1f5] text-slate-600`}>
                                                    <i className={box.icon_class}></i>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <h3 className={`text-lg sm:text-xl md:text-[22px] font-bold mb-2 sm:mb-3 relative z-10 ${getTitleClasses()}`}>{box.title}</h3>
                                    
                                    <div className={`text-xs sm:text-sm md:text-[15px] mb-4 sm:mb-8 relative z-10 ${getDescriptionClasses()}`} dangerouslySetInnerHTML={{__html: box.description}}></div>
                                    
                                    <ul className="space-y-3 sm:space-y-5 flex-1 relative z-10">
                                        {box.bullets && box.bullets.map((bullet: any, bIdx: number) => (
                                            <li key={bIdx} className="flex items-start gap-3 sm:gap-4">
                                                {renderBulletIcon(bullet.style)}
                                                <span 
                                                    className={`text-xs sm:text-[14px] leading-relaxed pt-0.5 ${getBulletTextClasses(bullet.style)}`}
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
            </div>
        </section>
    );
}
