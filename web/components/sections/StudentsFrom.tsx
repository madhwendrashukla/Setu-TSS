import React from 'react';

export const StudentsFrom = ({ data, headings = {} }: { data?: any[], headings?: any }) => {
    // Placeholder data for students' companies/colleges if none provided from backend
    const studentLogos = data && data.length > 0 ? data : [
        { id: 1, name: 'IIT Delhi', label: 'IIT Delhi' },
        { id: 2, name: 'BITS Pilani', label: 'BITS Pilani' },
        { id: 3, name: 'IIM Bangalore', label: 'IIM Bangalore' },
        { id: 4, name: 'Google', label: 'Google' },
        { id: 5, name: 'Microsoft', label: 'Microsoft' },
        { id: 6, name: 'Amazon', label: 'Amazon' },
        { id: 7, name: 'Flipkart', label: 'Flipkart' },
        { id: 8, name: 'TCS', label: 'TCS' },
    ];

    return (
        <section className="card-section py-16 md:py-24 border-t border-functional-border relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 text-center">
                <span className="text-text-secondary text-xs font-bold tracking-[0.2em] uppercase mb-4 block" dangerouslySetInnerHTML={{ __html: headings?.subtitle || 'NETWORK' }} />
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-12" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Our Students Come From' }} />

                <div className="relative flex overflow-x-hidden py-4">
                    
                    
                    <div className="animate-marquee-slow flex whitespace-nowrap space-x-12 px-4 items-center">
                        {studentLogos.map((logo, index) => (
                            <div key={`logo-1-${index}`} className="flex items-center justify-center shrink-0 w-40 h-20 bg-bg-surface border border-functional-border rounded-xl">
                                {logo.logo_url ? (
                                    <img src={encodeURI(logo.logo_url)} alt={logo.name} className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                                ) : (
                                    <span className="text-text-secondary font-bold text-lg opacity-70">{logo.label || logo.name}</span>
                                )}
                            </div>
                        ))}
                        {/* Duplicate for marquee */}
                        {studentLogos.map((logo, index) => (
                            <div key={`logo-2-${index}`} className="flex items-center justify-center shrink-0 w-40 h-20 bg-bg-surface border border-functional-border rounded-xl">
                                {logo.logo_url ? (
                                    <img src={encodeURI(logo.logo_url)} alt={logo.name} className="max-h-12 max-w-full object-contain grayscale hover:grayscale-0 transition-all opacity-70 hover:opacity-100" />
                                ) : (
                                    <span className="text-text-secondary font-bold text-lg opacity-70">{logo.label || logo.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
