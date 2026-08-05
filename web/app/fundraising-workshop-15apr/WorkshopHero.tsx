'use client';

export function WorkshopHero() {
    return (
        <header className="relative pt-32 pb-16 md:pt-40 md:pb-24 lg:pt-56 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none animate-[blob_7s_infinite]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)' }} />
            <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, rgba(217,70,239,0) 70%)' }} />
            <div className="absolute -bottom-8 left-20 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full bg-white/5 border border-functional-border text-xs md:text-sm text-[#d946ef] mb-6 md:mb-8 backdrop-blur-md">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d946ef]" />
                    </span>
                    <span className="font-medium tracking-wide">Past Workshop - April 15th</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-4 md:mb-6 leading-[1.15] md:leading-[1.1]">
                    Raise Capital With <br />
                    <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent relative inline-block">
                        Clarity.
                        <svg className="absolute w-full h-2 md:h-3 -bottom-1 md:-bottom-2 left-0 text-[#8b5cf6] opacity-70" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="2" fill="none" />
                        </svg>
                    </span>{' '}Not Luck.
                </h1>

                <p className="mt-6 md:mt-8 max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-slate-300 mb-8 md:mb-12 leading-relaxed font-light px-2">
                    Stop guessing what investors want. Join the live, cohort-based program that transforms passionate
                    builders into <span className="text-white font-medium">investable founders.</span>
                </p>

                <div className="flex flex-col items-center justify-center gap-4 md:gap-6 w-full max-w-md mx-auto sm:max-w-none">
                    <div className="relative group w-full sm:w-auto">
                        <button disabled className="relative w-full sm:w-auto px-6 py-4 md:px-8 md:py-5 text-base md:text-lg font-bold rounded-xl text-white bg-slate-800 border border-functional-border cursor-not-allowed flex items-center justify-center">
                            <i className="fa-solid fa-lock mr-2" /> Registrations Closed
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
