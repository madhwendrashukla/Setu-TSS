"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function PromoBar() {
    const [promo, setPromo] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasScrolled, setHasScrolled] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const handleScroll = () => {
            setHasScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchPromo = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/promo-bar`, { cache: 'no-store' });
                if (res.ok) {
                    const data = await res.json();
                    setPromo(data);
                }
            } catch (e) {
                console.error("Failed to fetch promo bar", e);
            } finally {
                setLoading(false);
            }
        };
        fetchPromo();
    }, []);

    useEffect(() => {
        let minutes = promo?.timer_minutes;
        if (!minutes && promo?.subtext?.includes('TIMER:')) {
            const match = promo.subtext.match(/TIMER:(\d+)/);
            if (match) minutes = parseInt(match[1]);
        }
        if (!minutes) return;

        const storageKey = `promoTimer_${promo.id || 'current'}`;
        let targetTime = parseInt(localStorage.getItem(storageKey) || '0');

        if (!targetTime || targetTime < Date.now()) {
            targetTime = Date.now() + minutes * 60 * 1000;
            localStorage.setItem(storageKey, targetTime.toString());
        }

        const updateTimer = () => {
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((targetTime - now) / 1000));
            setTimeLeft(remaining);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [promo]);

    if (loading || !promo || !promo.is_active || pathname?.startsWith('/admin')) {
        return null;
    }

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // Attempt to parse original and discounted prices
    let renderPrice = <span className="text-white font-bold">{promo.price_text}</span>;
    if (promo.price_text?.includes('|')) {
        const [original, discounted] = promo.price_text.split('|');
        renderPrice = (
            <div className="flex items-center gap-2">
                <span className="line-through text-gray-400 font-medium text-sm">{original.trim()}</span>
                <span className="text-white font-bold">{discounted.trim()}</span>
            </div>
        );
    } else if (promo.price_text?.includes(' ')) {
        const priceParts = promo.price_text.split(' ');
        const lastWord = priceParts.pop();
        renderPrice = (
            <div className="flex items-center gap-2">
                <span className="line-through text-gray-400 font-medium text-sm">{priceParts.join(' ')}</span>
                <span className="text-white font-bold">{lastWord}</span>
            </div>
        );
    }

    return (
        <div 
            className={`fixed bottom-8 left-0 w-full z-50 flex justify-center px-4 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                hasScrolled ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-24 opacity-0 scale-95'
            }`}
        >
            <div className="pointer-events-auto w-full max-w-4xl bg-[#0B0F19]/80 backdrop-blur-2xl border border-white/10 shadow-[0_0_40px_rgba(99,102,241,0.2)] rounded-2xl md:rounded-full px-2 py-2 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                
                {/* Title & Animated Pulse */}
                <div className="flex items-center gap-4 pl-4 py-2">
                    <div className="relative flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-blue opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-accent-blue"></span>
                    </div>
                    <div className="font-bold text-lg md:text-xl text-white tracking-wide">
                        {promo.title}
                    </div>
                </div>
                
                {/* Right Actions Block */}
                <div className="flex items-center gap-4 pr-2 pb-2 md:pb-0">
                    {promo.price_text && (
                        <div className="flex flex-col text-right pr-4 border-r border-white/10 hidden md:flex">
                            <div className="text-base md:text-lg">
                                {renderPrice}
                            </div>
                            {promo.subtext && (
                                <div className="text-accent-blue text-xs mt-0.5 font-bold uppercase tracking-wider flex items-center justify-end gap-1.5">
                                    {promo.subtext.replace(/TIMER:\d+/g, '').trim()}
                                    {timeLeft !== null && (
                                        <span className="inline-flex items-center text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px] tabular-nums font-mono animate-pulse">
                                            <i className="fa-regular fa-clock mr-1 opacity-70"></i>
                                            {formatTime(timeLeft)}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                    
                    <a 
                        href={promo.button_link} 
                        className="bg-white text-black px-8 py-3.5 rounded-full font-bold text-sm md:text-base hover:bg-gray-100 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all whitespace-nowrap uppercase tracking-widest hover:-translate-y-0.5"
                    >
                        {promo.button_text}
                    </a>
                </div>
                
            </div>
        </div>
    );
}
