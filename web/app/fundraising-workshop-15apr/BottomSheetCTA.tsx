'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function BottomSheetCTAContent() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const isFromHome = searchParams.get('from') === 'home';
        const delay = isFromHome ? 8000 : 4000;

        const timer = setTimeout(() => {
            setIsVisible(true);
        }, delay);

        return () => clearTimeout(timer);
    }, [searchParams]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsVisible(false);
            // Removed sticky bar timeout
        }, 300); // match animation duration
    };

    return (
        <>
            {/* Main Popup Modal */}
            {isVisible && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center p-0 sm:p-4">
                    {/* Backdrop */}
                    <div 
                        className={`fixed inset-0 bg-accent-blue hover:bg-accent-royal text-white/60 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
                        onClick={handleClose}
                        aria-hidden="true"
                    />
                    
                    {/* Modal / Bottom Sheet */}
                    <div 
                        className={`relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden transition-transform duration-300 transform ${isClosing ? 'translate-y-full sm:translate-y-10 sm:scale-95 sm:opacity-0' : 'translate-y-0 sm:scale-100 sm:opacity-100'}`}
                        role="dialog"
                        aria-modal="true"
                    >
                        {/* Grabber */}
                        <div className="w-full flex justify-center pt-3 pb-1 sm:hidden">
                            <div className="w-12 h-1.5 bg-gray-200 rounded-full" />
                        </div>

                        {/* Close Button */}
                        <button 
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full transition-colors z-10"
                            aria-label="Close"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="px-6 pb-8 pt-4 sm:pt-8 flex flex-col items-center text-center relative z-0">
                            {/* Icon Container */}
                            <div className="w-24 h-24 mb-6 rounded-full bg-green-50 flex items-center justify-center relative shadow-inner">
                                <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
                                <svg className="w-14 h-14 text-[#25D366] drop-shadow-sm" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.347-.272.271-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                </svg>
                            </div>

                            {/* Text */}
                            <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">
                                Any questions about our fundraising workshop?
                            </h3>

                            {/* CTA */}
                            <a 
                                href="https://chat.whatsapp.com/DsWZ7dyfz4C5bB4QydtNqH"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-text-primary font-bold py-4 px-6 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(37,211,102,0.6)] hover:-translate-y-0.5"
                                onClick={handleClose}
                            >
                                <span className="text-lg">Chat with us on WhatsApp</span>
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            )}


        </>
    );
}

export function BottomSheetCTA() {
    return (
        <Suspense fallback={null}>
            <BottomSheetCTAContent />
        </Suspense>
    );
}
