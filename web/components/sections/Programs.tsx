import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Programs({ data = [] }: { data?: any[] }) {
    const defaultPrograms = [
        { id: 1, title: '7 days Sprint', subtitle: 'The Spark', description: 'A rapid 7-day intensive to kickstart your journey.', cta_text: 'Apply Now' },
        { id: 2, title: '45 days intensive', subtitle: 'The Transformation', description: 'A deep dive into transforming your startup idea into reality.', cta_text: 'Apply Now' }
    ];
    const programs = data.length > 0 ? data : defaultPrograms;

    if (programs.length === 0) return null;

    return (
        <section id="programs" className="card-section py-16 md:py-24">
            {/* Background Pattern overlay (dotted mesh effect) */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_20%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-4 text-sm md:text-base font-bold tracking-tight text-text-secondary">
                        For all those who have <span className="text-[#A855F7]">'KEEDA'</span> and <span className="text-[#A855F7]">'HIMMAT'</span> :
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-text-primary tracking-tight mb-6">
                        Programs Launching Soon
                    </h2>
                    <div className="w-12 h-0.5 bg-[#A855F7] mx-auto rounded-full"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto items-stretch">
                    {programs.map((program: any, index: number) => {
                        const isEven = index % 2 !== 0;
                        const cardBg = isEven ? 'bg-[#EDE5FF] border-accent-blue/20' : 'bg-bg-surface border-functional-border';
                        const btnStyle = isEven 
                            ? 'bg-accent-blue hover:bg-accent-royal text-white' 
                            : 'bg-black/5 hover:bg-black/10 text-text-primary border border-functional-border';
                        const btnArrow = isEven ? 'text-white' : 'text-text-primary';
                        
                        // Parse durations into array (assuming backend might send comma separated or just one string)
                        const locations = program.duration ? program.duration.split(',').map((l: string) => l.trim()) : ['TBA'];

                        return (
                            <div key={program.id} className={`${cardBg} rounded-3xl p-6 md:p-8 border flex flex-col justify-between group h-full shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:shadow-[0_20px_50px_rgba(168,85,247,0.15)] transition-all duration-300 relative overflow-hidden`}>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-[#A855F7] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">PROGRAM {index + 1}</span>
                                            <div className="w-6 h-px bg-[#A855F7]/40"></div>
                                        </div>
                                        
                                        <h3 className="text-3xl md:text-4xl font-bold text-text-primary tracking-tight mb-4 leading-[1.15]">
                                            {program.title}:<br />{program.subtitle}
                                        </h3>
                                        
                                        <p className="text-text-secondary text-base leading-relaxed mb-6 font-medium whitespace-pre-line">
                                            {program.description}
                                        </p>

                                        <div className="w-full h-px bg-text-secondary/20 mb-6"></div>

                                        <div className="space-y-3 mb-6 flex-grow">
                                            {locations.map((loc: string, i: number) => (
                                                <div key={i} className="flex items-center text-text-secondary font-medium text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#A855F7] mr-4 shadow-[0_0_8px_rgba(168,85,247,0.6)]"></span> {loc}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <Link href="/#contact" className={`w-full flex justify-center items-center gap-3 ${btnStyle} font-bold py-4 rounded-xl transition duration-300 mt-auto`}>
                                        {program.cta_text} <ArrowRight className={`w-5 h-5 ${btnArrow}`} />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
