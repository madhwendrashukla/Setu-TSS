import React from 'react';

export function StartupsMentored({ data = [] }: { data?: any[] }) {
    const startups = data || [];
    if (startups.length === 0) return null;

    const shouldRoll = startups.length > 5;

    return (
        <section className="card-section py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-6">
                    Startups <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-violet">Mentored By Us</span>
                </h2>
                <p className="text-text-secondary text-lg max-w-2xl mx-auto">
                    We take pride in guiding passionate founders from the idea stage all the way to product-market fit and beyond.
                </p>
            </div>

            <div className="relative w-full overflow-hidden flex items-center justify-center py-8">
                {shouldRoll && (
                    <>
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
                    </>
                )}
                
                <div className={`flex ${shouldRoll ? 'animate-[marquee_30s_linear_infinite] whitespace-nowrap gap-6 md:gap-12 hover:[animation-play-state:paused] w-max' : 'flex-wrap justify-center gap-6 md:gap-10 max-w-6xl mx-auto px-6'}`}>
                    
                    {(shouldRoll ? [...startups, ...startups, ...startups] : startups).map((startup, index) => {
                        const CardWrapper = startup.website_url ? 'a' : 'div';
                        return (
                            <CardWrapper 
                                key={`${startup.id}-${index}`} 
                                href={startup.website_url || undefined}
                                target={startup.website_url ? "_blank" : undefined}
                                rel={startup.website_url ? "noopener noreferrer" : undefined}
                                className={`flex-shrink-0 flex items-center justify-center w-48 h-24 md:w-64 md:h-32 bg-gray-50 border border-black/5 rounded-2xl hover:bg-white hover:shadow-lg transition duration-300 group ${startup.website_url ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                            >
                                {startup.logo_url ? (
                                    <img 
                                        src={encodeURI(startup.logo_url)} 
                                        alt={startup.name} 
                                        className="max-w-[80%] max-h-[70%] object-contain opacity-70 group-hover:opacity-100 transition duration-300 filter grayscale group-hover:grayscale-0"
                                    />
                                ) : (
                                    <span className="text-xl md:text-2xl font-bold text-black/40 group-hover:text-black transition duration-300">
                                        {startup.name}
                                    </span>
                                )}
                            </CardWrapper>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
