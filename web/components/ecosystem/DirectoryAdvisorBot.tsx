'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Bot, ExternalLink, Paperclip, Smile, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import * as LucideIcons from 'lucide-react';

const WHATSAPP_LINK = 'https://chat.whatsapp.com/BJ5RIXujFJG7ceB06nVqa4';
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

function IdleNotifications({ widgets, dismissed, onDismiss, renderIcon }: { widgets: any[], dismissed: Set<string>, onDismiss: (id: string) => void, renderIcon: (name: string) => React.ReactNode }) {
    const visibleWidgets = widgets.filter(w => !dismissed.has(w.id));
    if (visibleWidgets.length === 0) return null;

    return (
        <div className="flex flex-col items-end gap-3 mb-4">
            {visibleWidgets.map((w, index) => (
                <div key={w.id} 
                    className="flex items-center gap-3 bg-white border border-gray-100 rounded-3xl px-4 py-3 shadow-[0_10px_40px_rgba(0,0,0,0.1)] max-w-[280px] group animate-in fade-in duration-500 cursor-pointer hover:shadow-[0_10px_40px_rgba(0,0,0,0.15)] transition-all"
                    style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'both', animationName: 'slide-in-from-right-8' }}
                >
                    <div className="w-10 h-10 rounded-full bg-accent-violet/10 flex items-center justify-center shrink-0 border border-accent-violet/20 text-accent-violet">
                        {renderIcon(w.icon)}
                    </div>
                    <div 
                        onClick={() => {
                            if (w.link.startsWith('http')) {
                                window.open(w.link, '_blank');
                            } else {
                                window.location.href = w.link;
                            }
                        }}
                        className="flex-1 min-w-0 pr-2"
                    >
                        <p className="text-gray-900 text-sm font-bold truncate tracking-tight">{w.title}</p>
                        {w.subtitle && <p className="text-accent-violet text-xs font-medium truncate">{w.subtitle}</p>}
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onDismiss(w.id); }}
                        className="p-1 rounded-full text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                        aria-label="Dismiss notification"
                    >
                        <X size={16} strokeWidth={2} />
                    </button>
                </div>
            ))}
        </div>
    );
}

/* ── Main Component ───────────────────────────────────────── */
export default function DirectoryAdvisorBot({ isHome }: { isHome?: boolean }) {
    const [isOpen, setIsOpen] = useState(false);
    const [dismissed, setDismissed] = useState<Set<string>>(new Set());
    const [showIdle, setShowIdle] = useState(false);
    
    // Helpdesk Form State
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState(''); // Optional if you want to collect it
    const [file, setFile] = useState<File | null>(null);
    const [isSending, setIsSending] = useState(false);
    const [sentStatus, setSentStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [showEmoji, setShowEmoji] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const EMOJI_LIST = ['😊','👋','🚀','💡','🎯','🙌','❤️','🔥','✅','😅','🤔','📩'];

    // Dynamic Widgets
    const [widgets, setWidgets] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        // Fetch dynamic widgets
        fetch(`${API}/api/chat-widgets`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setWidgets(data.filter(w => w.is_active));
                }
            })
            .catch(console.error);
    }, []);

    // Removed AudioContext and unlock logic

    useEffect(() => {
        if (isOpen) { setShowIdle(false); return; }
        const t = setTimeout(() => {
            setShowIdle(true);   
        }, 8000);
        return () => clearTimeout(t);
    }, [isOpen]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        setIsSending(true);
        setSentStatus('idle');

        const formData = new FormData();
        formData.append('message', message);
        formData.append('email', email); // Optional
        if (file) {
            formData.append('attachment', file);
        }

        try {
            const res = await fetch(`${API}/api/helpdesk`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                setSentStatus('success');
                setMessage('');
                setFile(null);
                setTimeout(() => setSentStatus('idle'), 4000);
            } else {
                setSentStatus('error');
            }
        } catch (e) {
            setSentStatus('error');
        } finally {
            setIsSending(false);
        }
    };

    const renderIcon = (iconName: string) => {
        const IconComponent = (LucideIcons as any)[iconName || 'Link'];
        return IconComponent ? <IconComponent size={16} /> : <ExternalLink size={16} />;
    };

    const notifCount = (showIdle && !isOpen) ? widgets.filter(w => !dismissed.has(w.id)).length : 0;
    const anyIdleVisible = showIdle && !isOpen && (notifCount > 0);

    return (
        <div className="fixed bottom-8 right-8 z-[999] flex flex-col items-end">
            {anyIdleVisible && (
                <div className="mb-1">
                    <IdleNotifications 
                        widgets={widgets}
                        dismissed={dismissed}
                        renderIcon={renderIcon}
                        onDismiss={(id) => {
                            setDismissed(prev => new Set(prev).add(id));
                        }} 
                    />
                </div>
            )}

            {isOpen && (
                <div className="mb-4 w-[380px] max-w-[calc(100vw-32px)] bg-white border border-gray-100 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200 font-sans">
                    {/* Header */}
                    <div className="p-4 bg-white border-b border-gray-100 flex justify-between items-center relative z-10">
                        <div>
                            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Setu Help</h3>
                            <span className="text-[13px] text-green-600 flex items-center gap-1.5 font-medium mt-0.5">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Online
                            </span>
                        </div>
                        <button
                            className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full p-2 transition-colors -mr-2"
                            onClick={() => { setIsOpen(false); setShowEmoji(false); }}
                            aria-label="Close help widget"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex flex-col overflow-y-auto max-h-[600px] bg-white custom-scrollbar">
                        
                        <div className="p-5 flex flex-col gap-5">
                            {/* Greeting */}
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2">Hi there! 👋</h4>
                                <p className="text-[14px] text-gray-600 leading-relaxed">
                                    How can we help you today? Type your question or describe what you need.
                                </p>
                            </div>

                            {/* Helpdesk Input Area */}
                            <div className="border border-gray-200 rounded-2xl focus-within:border-accent-violet focus-within:ring-1 focus-within:ring-accent-violet transition-all bg-white shadow-sm overflow-hidden flex flex-col relative">
                                <textarea 
                                    className="w-full resize-none outline-none p-4 text-sm text-gray-800 placeholder:text-gray-400 min-h-[100px] bg-transparent"
                                    placeholder="Type your question here..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    disabled={isSending}
                                />
                                {file && (
                                    <div className="px-4 pb-2">
                                        <div className="inline-flex items-center gap-2 bg-gray-100 text-xs px-3 py-1.5 rounded-full text-gray-700">
                                            <Paperclip size={12} />
                                            <span className="truncate max-w-[150px]">{file.name}</span>
                                            <button onClick={() => setFile(null)} className="hover:text-red-500 ml-1" aria-label="Remove attached file"><X size={12}/></button>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center justify-between p-3 border-t border-gray-100 bg-gray-50/50">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <button 
                                            className="p-1.5 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={isSending}
                                            aria-label="Attach file"
                                        >
                                            <Paperclip size={18} />
                                        </button>
                                        <input 
                                            type="file" 
                                            ref={fileInputRef} 
                                            className="hidden" 
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                        <div className="w-[1px] h-4 bg-gray-300"></div>
                                        <div className="relative">
                                            <button 
                                                type="button"
                                                className="p-1.5 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setShowEmoji(prev => !prev);
                                                }}
                                                disabled={isSending}
                                                aria-label="Open emoji picker"
                                            >
                                                <Smile size={18} />
                                            </button>
                                            {showEmoji && (
                                                <div className="absolute bottom-9 left-0 bg-white border border-gray-200 rounded-xl p-2 shadow-xl flex flex-wrap gap-1 w-48 z-20">
                                                    {EMOJI_LIST.map(emoji => (
                                                        <button
                                                            key={emoji}
                                                            type="button"
                                                            onClick={(e) => { 
                                                                e.preventDefault();
                                                                setMessage(m => m + emoji); 
                                                                setShowEmoji(false); 
                                                            }}
                                                            className="text-xl p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                                            aria-label={`Insert ${emoji}`}
                                                        >
                                                            {emoji}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleSendMessage}
                                        disabled={!message.trim() || isSending}
                                        className={`p-2.5 rounded-full transition-all ${message.trim() && !isSending ? 'bg-[#3b5e48] text-text-primary hover:bg-[#2d4736]' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        {isSending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                                    </button>
                                </div>
                            </div>
                            
                            {sentStatus === 'success' && <p className="text-xs text-green-600 font-medium text-center">Message sent successfully!</p>}
                            {sentStatus === 'error' && <p className="text-xs text-red-500 font-medium text-center">Failed to send message.</p>}
                        </div>

                        {/* Divider */}
                        {widgets.length > 0 && (
                            <div className="flex items-center justify-center relative my-2 px-5">
                                <div className="absolute inset-0 flex items-center px-5">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative bg-white px-3 text-[11px] text-gray-500 font-medium uppercase tracking-wider">
                                    Stay Connected
                                </div>
                            </div>
                        )}

                        {/* Dynamic Widgets */}
                        <div className="p-5 flex flex-col gap-3 pt-4">
                            {widgets.map(w => (
                                <a
                                    key={w.id}
                                    href={w.link}
                                    target={w.link.startsWith('http') ? "_blank" : undefined}
                                    className="flex items-center gap-3 w-full bg-green-50/50 border border-green-100 hover:border-green-300 hover:bg-green-50 rounded-xl px-4 py-3.5 transition-all group cursor-pointer"
                                    onClick={(e) => {
                                        if (!w.link.startsWith('http')) {
                                            e.preventDefault();
                                            router.push(w.link);
                                            setIsOpen(false);
                                        }
                                    }}
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 shrink-0">
                                        {renderIcon(w.icon)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-gray-900 text-sm font-semibold leading-tight truncate">{w.title}</p>
                                        {w.subtitle && <p className="text-gray-500 text-xs mt-0.5 truncate">{w.subtitle}</p>}
                                    </div>
                                    <ExternalLink size={14} className="ml-auto text-gray-300 group-hover:text-green-600 transition-colors shrink-0" />
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* FAB */}
            <div className="relative w-[52px] h-[52px]">
                <div className="absolute inset-0 rounded-full bg-accent-violet opacity-30 animate-ping" style={{ animationDuration: '3s' }} />
                {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 z-20 w-5 h-5 bg-red-500 text-text-primary text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                        {notifCount}
                    </span>
                )}
                <button
                    className="absolute inset-0 w-full h-full rounded-full bg-accent-violet border border-functional-border text-text-primary shadow-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 hover:bg-violet-700 z-10"
                    onClick={() => { setIsOpen(o => !o); setShowIdle(false); }}
                    aria-label="Open Help"
                >
                    {isOpen ? <X size={22} strokeWidth={2.5} /> : <MessageSquare size={22} strokeWidth={2.5} />}
                </button>
            </div>
        </div>
    );
}
