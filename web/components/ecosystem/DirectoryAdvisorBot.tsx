'use client';

import { useState, useEffect } from 'react';
import { X, MessageSquare, Bot, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4';

import { BookOpen, CalendarDays } from 'lucide-react';

const TOOLS = [
    { label: 'Pitch Deck Repo', icon: BookOpen, desc: '48+ winning pitch decks', href: '/tools/pitch-decks', color: 'from-violet-500/20 to-violet-600/10 border-violet-500/30 hover:border-violet-400/60' },
    { label: 'Founder Events', icon: CalendarDays, desc: 'Curated monthly B2B events', href: '/tools/founder-calendar', color: 'from-orange-500/20 to-orange-600/10 border-orange-500/30 hover:border-orange-400/60' },
];

/* ── Idle notification bubbles shown near FAB when chat is closed ──────────── */
function IdleNotifications({ onDismiss }: { onDismiss: (id: string) => void }) {
    return (
        <div className="flex flex-col items-end gap-3 mb-4">
            {/* WhatsApp community */}
            <div className="flex items-center gap-3 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] max-w-[280px] group animate-in slide-in-from-right-8 fade-in duration-500 cursor-pointer hover:bg-white/[0.06] hover:border-[#25D366]/30 transition-all">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0 border border-[#25D366]/20">
                    <span className="text-lg">💬</span>
                </div>
                <div 
                    onClick={() => window.open(WHATSAPP_LINK, '_blank')}
                    className="flex-1 min-w-0"
                >
                    <p className="text-white text-sm font-bold truncate tracking-tight">Join Founder Community</p>
                    <p className="text-[#25D366] text-[11px] font-medium opacity-80 truncate">Connect on WhatsApp</p>
                </div>
                <button
                    onClick={(e) => { e.stopPropagation(); onDismiss('whatsapp'); }}
                    className="p-1.5 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-all shrink-0"
                >
                    <X size={14} />
                </button>
            </div>

        </div>
    );
}

/* ── Rich notification sound via Web Audio API ─────────────────────────────── */
function playNotifSound() {
    try {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();

        // Punchy low "pop" kick
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.connect(kickGain);
        kickGain.connect(ctx.destination);
        kick.type = 'sine';
        kick.frequency.setValueAtTime(150, ctx.currentTime);
        kick.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.1);
        kickGain.gain.setValueAtTime(0.5, ctx.currentTime);
        kickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        kick.start(ctx.currentTime);
        kick.stop(ctx.currentTime + 0.2);

        // 3-tone ascending chime (loud and bright)
        const notes = [
            { freq: 880, start: 0.12, vol: 0.35 },
            { freq: 1320, start: 0.26, vol: 0.3 },
            { freq: 1760, start: 0.40, vol: 0.25 },
        ];
        notes.forEach(({ freq, start, vol }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'triangle';
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0, ctx.currentTime + start);
            gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + start + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + 0.5);
            osc.start(ctx.currentTime + start);
            osc.stop(ctx.currentTime + start + 0.55);
        });
    } catch {}
}

/* ── Main Component ─────────────────────────────────────────────────────────── */
export default function DirectoryAdvisorBot({ isHome }: { isHome?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [showIdle, setShowIdle] = useState(false);
    const [clicked, setClicked] = useState<string | null>(null);
    const router = useRouter();

    // Unlock AudioContext on first user interaction (browser requires gesture before audio)
    useEffect(() => {
        let unlocked = false;
        const unlock = () => {
            if (unlocked) return;
            unlocked = true;
            try {
                const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                // Create and immediately stop a silent buffer to warm up the context
                const buf = ctx.createBuffer(1, 1, 22050);
                const src = ctx.createBufferSource();
                src.buffer = buf;
                src.connect(ctx.destination);
                src.start(0);
                ctx.resume();
            } catch {}
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('touchstart', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });
        return () => {
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('keydown', unlock);
        };
    }, []);

    // Show idle notifications after 8 seconds — sound fires exactly with visual pop
    useEffect(() => {
        if (isOpen || isHome) { setShowIdle(false); return; }
        const t = setTimeout(() => {
            setShowIdle(true);   // visual pop-in
            playNotifSound();    // sound fires simultaneously
        }, 8000);
        return () => clearTimeout(t);
    }, [isOpen, isHome]);

    const dismissNotif = (id: string) => {
        setDismissed(prev => new Set(prev).add(id));
    };

    const handleTool = (href: string, label: string) => {
        setClicked(label);
        setTimeout(() => {
            if (href.startsWith('http')) {
                window.open(href, '_blank');
            } else {
                router.push(href);
            }
            setIsOpen(false);
            setClicked(null);
        }, 350);
    };

    const notifCount = (showIdle && !isOpen)
        ? [!dismissed.has('whatsapp')].filter(Boolean).length
        : 0;

    const anyIdleVisible = showIdle && !isOpen && (!dismissed.has('whatsapp'));

    return (
        <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end">

            {/* Idle notification bubbles */}
            {anyIdleVisible && (
                <div className="mb-1">
                    <IdleNotifications onDismiss={(id) => {
                        dismissNotif(id);
                        if (id === 'whatsapp') window.open(WHATSAPP_LINK, '_blank');
                    }} />
                </div>
            )}

            {/* Chat panel */}
            {isOpen && (
                <div className="mb-4 w-[360px] max-w-[calc(100vw-32px)] glass-card border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-xl bg-bg-main/70 animate-in slide-in-from-bottom-4 fade-in duration-200">
                    {/* Header */}
                    <div className="p-4 bg-white/5 border-b border-white/10 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-bg-surface border border-white/10 flex items-center justify-center text-accent-blue">
                                <Bot size={18} />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white">Startup Advisor</h3>
                                <span className="text-xs text-accent-blue/80 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
                                    Online
                                </span>
                            </div>
                        </div>
                        <button
                            className="text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col gap-3 overflow-y-auto max-h-[460px]">
                        {/* Greeting bubble */}
                        <div className="flex items-end gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/5 border border-white/10 text-accent-blue flex items-center justify-center shrink-0">
                                <Bot size={11} />
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-4 py-3 text-sm text-white font-light leading-relaxed">
                                Hey! 👋 How can I help you today? Pick what you're looking for:
                            </div>
                        </div>

                        {/* Tool buttons */}
                        <div className="flex flex-col gap-2 pl-8">
                            {TOOLS.map(tool => (
                                <button
                                    key={tool.href}
                                    onClick={() => handleTool(tool.href, tool.label)}
                                    className={`w-full text-left px-4 py-3 rounded-xl border bg-gradient-to-r ${tool.color} transition-all duration-200 group flex items-center gap-3 ${clicked === tool.label ? 'scale-95 opacity-70' : 'hover:scale-[1.02]'}`}
                                >
                                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white/80 group-hover:text-white transition-colors">
                                        <tool.icon size={16} />
                                    </div>
                                    <div>
                                        <p className="text-white text-sm font-semibold leading-tight">{tool.label}</p>
                                        <p className="text-text-tertiary text-[11px] mt-0.5">{tool.desc}</p>
                                    </div>
                                </button>
                            ))}
                        </div>

                        {/* WhatsApp community strip */}
                        <div className="pl-8">
                            <a
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 w-full bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366]/60 hover:bg-[#25D366]/15 rounded-xl px-4 py-3 transition-all group"
                            >
                                <svg className="w-5 h-5 shrink-0 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.12.554 4.12 1.524 5.855L.057 23.886a.5.5 0 0 0 .614.617l6.155-1.56A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.65-.518-5.16-1.42l-.36-.215-3.73.946.995-3.641-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                                </svg>
                                <div>
                                    <p className="text-[#25D366] text-sm font-bold leading-tight">Join Our Community 👥</p>
                                    <p className="text-text-tertiary text-[10px]">Connect with founders on WhatsApp</p>
                                </div>
                                <ExternalLink size={13} className="ml-auto text-[#25D366]/50 group-hover:text-[#25D366]" />
                            </a>
                        </div>


                    </div>
                </div>
            )}

            {/* FAB */}
            <div className="relative w-14 h-14">
                {/* Ping ring */}
                <div className="absolute inset-0 rounded-full bg-accent-blue opacity-40 animate-ping" style={{ animationDuration: '3s' }} />
                {/* Notification badge */}
                {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg">
                        {notifCount}
                    </span>
                )}
                <button
                    className="absolute inset-0 w-full h-full rounded-full bg-bg-main border border-white/10 text-accent-blue shadow-[0_0_30px_rgba(45,212,191,0.2)] flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-accent-blue hover:text-black z-10"
                    onClick={() => { setIsOpen(o => !o); setShowIdle(false); }}
                    aria-label="Open Advisor"
                >
                    {isOpen ? <X size={22} /> : <MessageSquare size={22} />}
                </button>
            </div>
        </div>
    );
}
