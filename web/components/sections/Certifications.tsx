import React from 'react';

export const Certifications = ({ data }: { data?: any[] }) => {
    // If we have explicit certifications data, use it.
    // Otherwise fallback to a default set (e.g. UDYAM) to allow toggleability if not empty.
    const certs = data && data.length > 0 ? data : [
        { id: 1, name: 'Startup India', logo_url: '/gallery/startup-india.png', label: 'Startup India' },
        { id: 2, name: 'UDYAM', logo_url: '/gallery/udyam.png', label: 'UDYAM Registered' },
    ];

    if (!certs || certs.length === 0) {
        return null;
    }

    return (
        <section className="card-section py-8 border-t border-functional-border relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <span className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4 block">NETWORK</span>
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-12">Certifications</h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {certs.map((cert, index) => (
                    <div key={`cert-${index}`} className="flex items-center justify-center shrink-0 h-16 opacity-70 hover:opacity-100 transition-opacity">
                        {cert.logo_url && cert.logo_url !== '/gallery/startup-india.png' && cert.logo_url !== '/gallery/udyam.png' ? (
                            <img src={encodeURI(cert.logo_url)} alt={cert.name} className="max-h-full max-w-full object-contain grayscale hover:grayscale-0 transition-all" />
                        ) : (
                            <span className="text-text-secondary font-bold text-sm tracking-wider uppercase">{cert.label || cert.name}</span>
                        )}
                    </div>
                ))}
                </div>
            </div>
        </section>
    );
};
