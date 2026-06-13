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
        <section className="mb-32 w-full py-16 bg-white">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <span className="text-gray-500 text-xs font-bold tracking-[0.2em] uppercase mb-4 block">NETWORK</span>
                <h2 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-12">Ecosystem Partners</h2>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
                    {partners.map(partner => (
                        <a 
                            key={partner.id} 
                            href={partner.website_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group block transition-transform hover:scale-105"
                        >
                            <div className="relative w-32 h-16 md:w-40 md:h-20 filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition duration-300">
                                {/* If image comes from S3, might need next.config.js whitelisting. Use unoptimized img tag or standard Next Image. */}
                                <img 
                                    src={partner.logo_url} 
                                    alt={partner.name} 
                                    className="object-contain w-full h-full"
                                />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};
