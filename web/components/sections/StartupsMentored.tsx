import React from 'react';

export function StartupsMentored({ data = [], headings = {} }: { data?: any[], headings?: any }) {
    const startups = data || [];
    if (startups.length === 0) return null;

    const shouldRoll = true;

    return (
        <section className="card-section py-16 md:py-24">
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <h2 className="text-2xl md:text-4xl font-black text-text-primary tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Startups Mentored By <span style="color: #A855F7">Us.</span>' }} />
                <div className="text-text-secondary text-lg max-w-2xl mx-auto" dangerouslySetInnerHTML={{ __html: headings?.subtitle || 'We take pride in guiding passionate founders from the idea stage all the way to product-market fit and beyond.' }} />
            </div>

            <div className="relative w-full overflow-hidden flex items-center justify-center py-8">
                {shouldRoll && (
                    <>
                        {/* Fading Edges */}
                        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-bg-main to-transparent z-10 pointer-events-none"></div>
                        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-bg-main to-transparent z-10 pointer-events-none"></div>
                    </>
                )}
                
                <div className={`flex ${shouldRoll ? 'animate-scroll-left whitespace-nowrap hover:[animation-play-state:paused] w-max' : 'flex-wrap justify-center gap-6 md:gap-10 max-w-6xl mx-auto px-6'}`}>
                    
                    {(shouldRoll ? [...startups, ...startups, ...startups, ...startups] : startups).map((startup, index) => {
                        const CardWrapper = startup.website_url ? 'a' : 'div';
                        return (
                            <div key={`${startup.id}-${index}`} className={shouldRoll ? 'mx-3 md:mx-6' : ''}>
                                <CardWrapper 
                                    href={startup.website_url || undefined}
                                    target={startup.website_url ? "_blank" : undefined}
                                    rel={startup.website_url ? "noopener noreferrer" : undefined}
                                    className={`flex-shrink-0 flex flex-col items-center justify-center w-48 h-32 md:w-64 md:h-40 bg-bg-surface border border-functional-border rounded-2xl hover:bg-white/10 hover:shadow-[0_8px_40px_rgba(168,85,247,0.1)] transition duration-300 group p-4 ${startup.website_url ? 'cursor-pointer hover:-translate-y-1' : ''}`}
                                >
                                    {startup.logo_url && (
                                        <img 
                                            src={encodeURI(startup.logo_url)} 
                                            alt={startup.name} 
                                            className="max-w-full max-h-[60%] object-contain transition duration-300 mb-2"
                                        />
                                    )}
                                    {startup.name && (
                                        <span className="text-sm font-bold text-text-secondary group-hover:text-text-primary transition duration-300 text-center line-clamp-2">
                                            {startup.name}
                                        </span>
                                    )}
                                </CardWrapper>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
