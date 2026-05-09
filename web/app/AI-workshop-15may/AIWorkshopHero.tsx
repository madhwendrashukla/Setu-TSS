

export function AIWorkshopHero() {
    return (
        <header className="relative pt-32 pb-16 md:pt-44 md:pb-24 lg:pt-56 lg:pb-32 overflow-hidden">
            <div className="absolute top-0 -left-4 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none animate-[blob_7s_infinite]" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(139,92,246,0) 70%)' }} />
            <div className="absolute top-0 -right-4 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(217,70,239,0.3) 0%, rgba(217,70,239,0) 70%)' }} />
            <div className="absolute -bottom-8 left-20 w-64 h-64 md:w-96 md:h-96 rounded-full mix-blend-screen pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, rgba(139,92,246,0) 70%)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">

                {/* Single top badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs md:text-sm text-[#d946ef] backdrop-blur-md font-medium mb-6 md:mb-8">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8b5cf6] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d946ef]" />
                    </span>
                    Live Workshop Series • May 15–17, 2026
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-2 md:mb-4 leading-[1.1] text-white">
                    AI Startup Launchpad
                </h1>

                {/* Brand attribution */}
                <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#8b5cf6]/60" />
                    <p className="text-base md:text-2xl lg:text-3xl font-semibold tracking-wide text-slate-300 flex flex-nowrap items-center whitespace-nowrap gap-1.5 md:gap-2">
                        <span className="text-sm md:text-lg shrink-0">by</span>
                        <span className="font-extrabold text-white shrink-0">THE</span>
                        <span className="font-extrabold bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent shrink-0">STARTUP</span>
                        <span className="font-extrabold text-white shrink-0">SCHOOL</span>
                    </p>
                    <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#d946ef]/60" />
                </div>

                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 md:mb-8 text-slate-300">
                    From idea to <span className="bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] bg-clip-text text-transparent">AI-powered MVP</span>
                </h2>

                <p className="mt-6 max-w-2xl mx-auto text-lg md:text-2xl text-white font-medium mb-8 leading-relaxed px-2">
                    Build Validate and Launch your Startup in 3 days
                </p>

                {/* Stats */}
                <div className="w-full flex justify-center mb-10 md:mb-14 px-2">
                    <div className="inline-flex flex-nowrap items-center justify-center gap-1.5 min-[380px]:gap-2 sm:gap-3 md:gap-5 text-[9px] min-[360px]:text-[10px] sm:text-xs md:text-lg text-slate-200 font-semibold tracking-wide whitespace-nowrap bg-[rgba(15,23,42,0.4)] backdrop-blur-md border border-white/10 rounded-full px-3 py-2 md:px-8 md:py-3.5 shadow-lg">
                        <span>3 Mentors</span>
                        <span className="text-[#a855f7] font-extrabold text-[11px] min-[360px]:text-xs sm:text-sm md:text-xl">•</span>
                        <span>3 Days</span>
                        <span className="text-[#a855f7] font-extrabold text-[11px] min-[360px]:text-xs sm:text-sm md:text-xl">•</span>
                        <span>5 Sessions</span>
                        <span className="text-[#a855f7] font-extrabold text-[11px] min-[360px]:text-xs sm:text-sm md:text-xl">•</span>
                        <span>12+ Hr</span>
                        <span className="text-[#a855f7] font-extrabold text-[11px] min-[360px]:text-xs sm:text-sm md:text-xl">•</span>
                        <span>Live on Zoom</span>
                    </div>
                </div>

                {/* CTA */}
                <div className="relative group inline-block w-full sm:w-auto">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] rounded-xl blur-lg opacity-60 group-hover:opacity-100 transition duration-300" />
                    <a href="#pricing" className="relative w-full sm:w-auto px-8 py-4 md:px-10 md:py-5 text-base md:text-lg font-bold rounded-xl text-white bg-gradient-to-r from-[#8b5cf6] to-[#d946ef] flex items-center justify-center transform group-hover:-translate-y-1 transition-all duration-300">
                        Secure Your Seat
                        <i className="fa-solid fa-arrow-right ml-2 group-hover:translate-x-1 transition-transform" />
                    </a>
                </div>

            </div>
        </header>
    );
}
