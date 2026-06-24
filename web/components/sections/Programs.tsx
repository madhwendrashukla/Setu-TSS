import Link from 'next/link';

export function Programs({ data = [] }: { data?: any[] }) {
    const programs = data || [];

    if (programs.length === 0) return null;

    return (
        <section id="programs" className="py-32 w-full bg-bg-main border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="mb-4 text-lg md:text-xl font-bold tracking-tight text-white/90">
                        For all those who have <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">"KEEDA"</span> and <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">"HIMMAT"</span> :
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-white tracking-[-0.04em] mb-3 md:mb-5">
                        Programs <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,var(--color-accent-blue),var(--color-accent-violet))]">Launching Soon.</span>
                    </h2>
                </div>


                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 mb-20 items-stretch">

                    {programs.map((program: any, index: number) => {
                        const isEven = index % 2 !== 0;
                        const borderColor = isEven ? 'border-accent-violet/30' : 'border-white/5';
                        const accentColor = isEven ? 'accent-violet' : 'accent-blue';

                        return (
                            <div key={program.id} className={`glass-card hover-glow rounded-[2rem] p-6 sm:p-10 lg:p-14 border ${borderColor} flex flex-col justify-between group h-full relative overflow-hidden`}>
                                {isEven && <div className="absolute inset-0 bg-gradient-to-br from-accent-violet/5 to-transparent z-0 pointer-events-none"></div>}
                                <div className="relative z-10 flex flex-col h-full">
                                    <div>
                                        <div className={`text-${accentColor} text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-8`}>PROGRAM {index + 1}</div>
                                        <h3 className="text-2xl md:text-3xl font-black text-white tracking-[-0.04em] mb-6 leading-tight">{program.title}:<br />{program.subtitle}</h3>
                                        <p className="text-text-secondary text-lg leading-relaxed mb-10 whitespace-pre-line">
                                            {program.description}
                                        </p>

                                        <div className="w-full h-[1px] bg-white/10 mb-8 max-w-[200px]"></div>

                                        <div className="space-y-4 mb-12 flex-grow">
                                            <div className="flex items-center text-white font-medium tracking-wide">
                                                <span className={`w-2 h-2 rounded-full bg-${accentColor} mr-4 ${isEven ? 'shadow-[0_0_10px_rgba(217,70,239,0.8)]' : ''}`}></span> {program.duration}
                                            </div>
                                        </div>
                                    </div>
                                    <Link href="/#contact" className={`w-full text-center ${isEven ? 'bg-accent-violet hover:bg-white hover:text-black' : 'bg-white/5 hover:bg-white border border-white/10 hover:text-black'} text-white font-bold py-4 rounded-xl transition duration-300 mt-auto backdrop-blur-md`}>
                                        {program.cta_text}
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
