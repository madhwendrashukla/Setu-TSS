import Image from 'next/image';

export const EcosystemPartners = ({ data, headings = {} }: { data?: any[], headings?: any }) => {
    const partners = data && data.length > 0 ? data : [];

    if (partners.length === 0) {
        return null;
    }

    return (
        <section className="card-section pt-8 md:pt-12 pb-0">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <span className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4 block" dangerouslySetInnerHTML={{ __html: headings?.subtitle || 'NETWORK' }} />
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-12" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Ecosystem <span style="color: #A855F7">Partners.</span>' }} />

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                    {partners.map(partner => {
                        const hasRealLogo = partner.logo_url && !partner.logo_url.includes('via.placeholder.com');
                        return (
                            <a 
                                key={partner.id} 
                                href={partner.website_url || '#'} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="group flex flex-col items-center gap-3 block transition-transform hover:scale-105"
                            >
                                <div className="relative w-32 h-16 md:w-40 md:h-20 bg-bg-surface flex items-center justify-center rounded-xl overflow-hidden border border-functional-border">
                                    {hasRealLogo ? (
                                        <img 
                                            src={encodeURI(partner.logo_url)} 
                                            alt={partner.name} 
                                            className="object-contain w-full h-full p-2"
                                        />
                                    ) : (
                                        <div className="text-text-secondary font-bold text-base px-2 text-center w-full truncate">{partner.name}</div>
                                    )}
                                </div>
                                <span className="text-sm font-semibold text-text-secondary group-hover:text-text-primary transition-colors">
                                    {partner.name}
                                </span>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
