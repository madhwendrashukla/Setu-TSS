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
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary tracking-tight mb-12" dangerouslySetInnerHTML={{ __html: headings?.prefix || 'Our Students Come <span style="color: #A855F7">From.</span>' }} />

                <div className="relative flex overflow-x-hidden py-4">
                    
                    
                    <div className="animate-marquee-slow flex whitespace-nowrap space-x-12 px-4 items-center">
                        {studentLogos.map((logo, index) => (
                            <div key={`logo-1-${index}`} className="flex flex-col items-center justify-center shrink-0 w-48 h-44 bg-bg-surface border border-functional-border rounded-xl p-4">
                                {logo.logo_url && (
                                    <img src={encodeURI(logo.logo_url)} alt={logo.name} className="w-20 h-20 rounded-full object-cover transition-all mb-3 shadow-sm border border-functional-border" />
                                )}
                                <span className="text-text-primary font-bold text-base text-center leading-tight">{logo.label || logo.name}</span>
                            </div>
                        ))}
                        {/* Duplicate for marquee */}
                        {studentLogos.map((logo, index) => (
                            <div key={`logo-2-${index}`} className="flex flex-col items-center justify-center shrink-0 w-48 h-44 bg-bg-surface border border-functional-border rounded-xl p-4">
                                {logo.logo_url && (
                                    <img src={encodeURI(logo.logo_url)} alt={logo.name} className="w-20 h-20 rounded-full object-cover transition-all mb-3 shadow-sm border border-functional-border" />
                                )}
                                <span className="text-text-primary font-bold text-base text-center leading-tight">{logo.label || logo.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
