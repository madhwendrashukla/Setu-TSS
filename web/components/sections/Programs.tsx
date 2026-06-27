import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function Programs({ data = [] }: { data?: any[] }) {
    const programs = data || [];

    if (programs.length === 0) return null;

    return (
        <section id="programs" className="card-section py-16 md:py-24">
            {/* Background Pattern overlay (dotted mesh effect) */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_20%,transparent_100%)]"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-4 text-sm md:text-base font-bold tracking-tight text-text-secondary">
                        For all those who have <span className="text-[#6B21FB]">'KEEDA'</span> and <span className="text-[#6B21FB]">'HIMMAT'</span> :
                    </div>
                    <h2 className="text-4xl md:text-6xl font-bold text-black tracking-tight mb-6">
                        Programs <span className="text-[#6B21FB]">Launching Soon.</span>
                    </h2>
                    <div className="w-12 h-0.5 bg-[#6B21FB] mx-auto rounded-full"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 max-w-6xl mx-auto items-stretch">
                    {programs.map((program: any, index: number) => {
                        const isEven = index % 2 !== 0;
                        const cardBg = isEven ? 'bg-[#f8f5ff] border-[#6B21FB]/5' : 'bg-white border-black/5';
                        const btnStyle = isEven 
                            ? 'bg-[#6B21FB] hover:bg-[#4c31d1] text-white' 
                            : 'bg-gray-50 hover:bg-gray-100 text-black border border-black/5';
                        const btnArrow = isEven ? 'text-white' : 'text-[#6B21FB]';
                        
                        // Parse durations into array (assuming backend might send comma separated or just one string)
                        const locations = program.duration ? program.duration.split(',').map((l: string) => l.trim()) : ['TBA'];

                        return (
                            <div key={program.id} className={`${cardBg} rounded-[32px] p-8 sm:p-12 border flex flex-col justify-between group h-full shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(90,58,247,0.08)] transition-all duration-300 relative overflow-hidden`}>
                                <div className="relative z-10 flex flex-col h-full">
                                    <div>
                                        <div className="flex items-center gap-3 mb-8">
                                            <span className="text-[#6B21FB] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">PROGRAM {index + 1}</span>
                                            <div className="w-6 h-px bg-[#6B21FB]/30"></div>
                                        </div>
                                        
                                        <h3 className="text-3xl md:text-4xl font-bold text-black tracking-tight mb-6 leading-[1.15]">
                                            {program.title}:<br />{program.subtitle}
                                        </h3>
                                        
                                        <p className="text-text-secondary text-base leading-relaxed mb-10 font-medium whitespace-pre-line">
                                            {program.description}
                                        </p>

                                        <div className="w-full h-px bg-black/5 mb-8"></div>

                                        <div className="space-y-4 mb-12 flex-grow">
                                            {locations.map((loc: string, i: number) => (
                                                <div key={i} className="flex items-center text-text-secondary font-medium text-sm">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-[#6B21FB] mr-4 shadow-[0_0_8px_rgba(90,58,247,0.6)]"></span> {loc}
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
