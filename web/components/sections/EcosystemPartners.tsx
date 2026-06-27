import Image from 'next/image';

export const EcosystemPartners = ({ data }: { data?: any[] }) => {
    // Mock data for display
    const partners = data && data.length > 0 ? data : [
        { id: 1, name: 'Partner 1', logo_url: 'https://via.placeholder.com/150x80?text=Partner+1', website_url: '#' },
        { id: 2, name: 'Partner 2', logo_url: 'https://via.placeholder.com/150x80?text=Partner+2', website_url: '#' },
        { id: 3, name: 'Partner 3', logo_url: 'https://via.placeholder.com/150x80?text=Partner+3', website_url: '#' },
        { id: 4, name: 'Partner 4', logo_url: 'https://via.placeholder.com/150x80?text=Partner+4', website_url: '#' },
    ];

    return (
        <section className="card-section pt-8 md:pt-12 pb-0">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">NETWORK</span>
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-12">Ecosystem Partners</h2>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                    {partners.map(partner => (
                        <a 
                            key={partner.id} 
                            href={partner.website_url || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group flex flex-col items-center gap-3 block transition-transform hover:scale-105"
                        >
                            <div className="relative w-32 h-16 md:w-40 md:h-20 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-300 bg-gray-50 flex items-center justify-center rounded-xl overflow-hidden border border-gray-200">
                                {partner.logo_url ? (
                                    <img 
                                        src={encodeURI(partner.logo_url)} 
                                        alt={partner.name} 
                                        className="object-contain w-full h-full p-2"
                                    />
                                ) : (
                                    <div className="text-gray-400 font-bold text-xl px-2 text-center w-full truncate">{partner.name}</div>
                                )}
                            </div>
                            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {partner.name}
                            </span>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
