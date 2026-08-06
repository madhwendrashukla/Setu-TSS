import React from 'react';

export function WorkshopNudgeCTA({ text = "Reserve Your Seat Now" }: { text?: string }) {
    // The section this used to target ('workshops') does not exist — the rendered
    // id is 'workshop-breakdown' — so both nudge CTAs ("Reserve Your Seat Now" and
    // "Limited Seats - Book Now") were dead: clicking them did nothing at all.
    // Falls through to the pricing section, which is where a buyer actually enrols.
    const scrollToWorkshops = () => {
        const el =
            document.getElementById('workshop-breakdown') ||
            document.getElementById('workshops') ||
            document.getElementById('pricing');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-12 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-block relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                    <button 
                        onClick={scrollToWorkshops}
                        className="relative px-8 py-4 bg-slate-900 rounded-full leading-none flex items-center gap-3 font-bold text-white hover:bg-slate-800 transition-colors shadow-lg hover:shadow-xl"
                    >
                        <span>{text}</span>
                        <i className="fas fa-arrow-right text-blue-400 group-hover:translate-x-1 transition-transform"></i>
                    </button>
                </div>
            </div>
        </section>
    );
}
